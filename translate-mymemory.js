const fs = require('fs');
const https = require('https');

const DELAY_MS = 1200;
const RETRY_DELAY = 8000;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function myMemory(text) {
  return new Promise((resolve, reject) => {
    const q = encodeURIComponent(text.slice(0, 4500));
    const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=ru|es`;
    https.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.responseStatus === 200 || j.responseData?.translatedText) {
            resolve(j.responseData.translatedText);
          } else {
            reject(new Error(j.responseDetails || 'translate failed'));
          }
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function translateOne(text, attempt = 0) {
  try {
    const r = await myMemory(text);
    if (!r || r === text) return r;
    // MyMemory sometimes returns ALL CAPS warning prefix
    if (r.includes('MYMEMORY WARNING')) {
      const parts = r.split('WARNING:');
      return parts[parts.length - 1].trim() || text;
    }
    return r;
  } catch (e) {
    if (attempt < 4) {
      await sleep(RETRY_DELAY * (attempt + 1));
      return translateOne(text, attempt + 1);
    }
    console.error('FAIL after retries:', text.slice(0, 50), e.message);
    return null;
  }
}

async function main() {
  const ru = JSON.parse(fs.readFileSync('ru-strings.json', 'utf8'));
  let map = fs.existsSync('es-map.json') ? JSON.parse(fs.readFileSync('es-map.json', 'utf8')) : {};

  // Remove failed entries (untranslated)
  for (const k of Object.keys(map)) {
    if (map[k] === k) delete map[k];
  }

  const pending = ru.filter(s => !map[s] || map[s] === s);
  console.log(`Pending: ${pending.length} / ${ru.length}`);

  for (let i = 0; i < pending.length; i++) {
    const s = pending[i];
    if (i % 10 === 0) console.log(`${i + 1}/${pending.length}: ${s.slice(0, 55)}...`);
    const es = await translateOne(s);
    if (es && es !== s) map[s] = es;
    else map[s] = map[s] || s;
    if ((i + 1) % 25 === 0) fs.writeFileSync('es-map.json', JSON.stringify(map, null, 2), 'utf8');
    await sleep(DELAY_MS);
  }
  fs.writeFileSync('es-map.json', JSON.stringify(map, null, 2), 'utf8');

  let content = fs.readFileSync('app.js', 'utf8');
  const sorted = Object.keys(map).filter(k => map[k] !== k).sort((a, b) => b.length - a.length);
  for (const ruText of sorted) content = content.split(ruText).join(map[ruText]);
  content = content.replace(/ru-RU/g, 'es-ES');
  content = content.replace(/new Intl\.DisplayNames\(\["ru"\]/g, 'new Intl.DisplayNames(["es"]');
  content = content.replace(/localeCompare\(([^,]+),\s*"ru"\)/g, 'localeCompare($1, "es")');
  fs.writeFileSync('app.js', content, 'utf8');

  const left = (content.match(/[а-яА-ЯёЁ]/g) || []).length;
  console.log('Done. Cyrillic chars remaining in app.js:', left);
}

main().catch(e => { console.error(e); process.exit(1); });
