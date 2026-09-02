const fs = require('fs');
const https = require('https');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function myMemory(text) {
  return new Promise((resolve, reject) => {
    const q = encodeURIComponent(text.slice(0, 4500));
    https.get(`https://api.mymemory.translated.net/get?q=${q}&langpair=ru|es`, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          resolve(j.responseData?.translatedText || text);
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  let css = fs.readFileSync('app.css', 'utf8');
  const comments = [...css.matchAll(/\/\*[\s\S]*?[а-яА-ЯёЁ][\s\S]*?\*\//g)].map(m => m[0]);
  const unique = [...new Set(comments)];
  console.log('CSS comments to translate:', unique.length);
  const map = {};
  for (let i = 0; i < unique.length; i++) {
    const c = unique[i];
    const inner = c.slice(2, -2).trim();
    try {
      let es = await myMemory(inner);
      if (es.includes('MYMEMORY WARNING')) es = es.split('WARNING:').pop().trim();
      map[c] = `/* ${es} */`;
      console.log(`${i + 1}/${unique.length}`);
    } catch (e) {
      console.error('skip', inner.slice(0, 40));
      map[c] = c;
    }
    await sleep(1200);
  }
  for (const [ru, es] of Object.entries(map)) {
    if (ru !== es) css = css.split(ru).join(es);
  }
  css = css.replace(/палитра из брендбука ADStip \(§8\)/, 'paleta del manual de marca ADStip (§8)');
  fs.writeFileSync('app.css', css, 'utf8');
  const left = (css.match(/[а-яА-ЯёЁ]/g) || []).length;
  console.log('Cyrillic left in app.css:', left);
}

main();
