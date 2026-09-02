const fs = require('fs');
const { translate } = require('@vitalets/google-translate-api');

const BATCH = 20;
const DELAY_MS = 500;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function translateBatch(texts) {
  const results = [];
  for (const text of texts) {
    try {
      const r = await translate(text, { from: 'ru', to: 'es' });
      results.push(r.text);
    } catch (e) {
      console.error('FAIL:', text.slice(0, 60), e.message);
      results.push(text);
    }
    await sleep(100);
  }
  return results;
}

async function main() {
  const ru = JSON.parse(fs.readFileSync('ru-strings.json', 'utf8'));
  let map = {};
  if (fs.existsSync('es-map.json')) {
    map = JSON.parse(fs.readFileSync('es-map.json', 'utf8'));
  }
  const pending = ru.filter(s => !map[s]);
  console.log(`Total: ${ru.length}, done: ${Object.keys(map).length}, pending: ${pending.length}`);

  for (let i = 0; i < pending.length; i += BATCH) {
    const batch = pending.slice(i, i + BATCH);
    console.log(`Translating ${i + 1}-${i + batch.length} / ${pending.length}...`);
    const translated = await translateBatch(batch);
    batch.forEach((s, j) => { map[s] = translated[j]; });
    fs.writeFileSync('es-map.json', JSON.stringify(map, null, 2), 'utf8');
    await sleep(DELAY_MS);
  }

  // Apply to app.js (longest first)
  let content = fs.readFileSync('app.js', 'utf8');
  const sorted = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const ruText of sorted) {
    const esText = map[ruText];
    if (ruText !== esText) {
      content = content.split(ruText).join(esText);
    }
  }
  // Locale fixes
  content = content.replace(/ru-RU/g, 'es-ES');
  content = content.replace(/"ru"/g, '"es"');
  content = content.replace(/localeCompare\([^,]+,\s*"ru"\)/g, (m) => m.replace('"ru"', '"es"'));
  fs.writeFileSync('app.js', content, 'utf8');
  console.log('app.js updated');
}

main().catch(e => { console.error(e); process.exit(1); });
