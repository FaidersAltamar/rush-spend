/**
 * Build es-full-map.json: start from good es-map entries, translate rest via LibreTranslate.
 * Then apply to app.js (longest keys first) + locale fixes.
 *
 * Usage: node build-translations.js [--apply]
 */
const fs = require('fs');
const https = require('https');

const DELAY_MS = 2500;
const LIBRE_URL = 'https://libretranslate.com/translate';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function protectTemplates(text) {
  const placeholders = [];
  let i = 0;
  const protectedText = text.replace(/\$\{[^}]+\}/g, (m) => {
    const key = `__PH${i++}__`;
    placeholders.push({ key, value: m });
    return key;
  });
  return { protectedText, placeholders };
}

function restoreTemplates(text, placeholders) {
  let out = text;
  for (const { key, value } of placeholders) {
    out = out.split(key).join(value);
  }
  return out;
}

function postProcess(es) {
  let t = es;
  t = t.replace(/<clase de sección=/gi, '<section class=');
  t = t.replace(/<\/sección>/gi, '</section>');
  t = t.replace(/<clase div=/gi, '<div class=');
  t = t.replace(/\boficina(s)?\b/gi, (m) => (m[0] === 'O' ? 'Cuenta' : 'cuenta') + (m.endsWith('s') ? 's' : ''));
  t = t.replace(/\bgabinete(s)?\b/gi, (m) => (m[0] === 'G' ? 'Cuenta' : 'cuenta') + (m.endsWith('s') ? 's' : ''));
  t = t.replace(/\bspread\b/gi, 'gasto');
  t = t.replace(/\bdesenroscar\b/gi, 'gastar');
  t = t.replace(/\bpor ruso\b/gi, 'en español');
  t = t.replace(/«([^»]+)»/g, '"$1"');
  const replacements = [
    [/\bAdministrador de eventos\b/g, 'Events Manager'],
    [/\badministrador de eventos\b/g, 'Events Manager'],
    [/\bAdministrador de anuncios\b/g, 'Ads Manager'],
    [/\badministrador de anuncios\b/g, 'Ads Manager'],
    [/\badministrador(es)? comercial(es)?\b/gi, 'Business Manager'],
    [/\bgerente(s)? comercial(es)?\b/gi, 'Business Manager'],
    [/\bGabinetes\b/g, 'Cuentas'],
    [/\bgabinetes\b/g, 'cuentas'],
    [/\bprohibición\b/gi, 'ban'],
    [/\bestado: prohibición\b/gi, 'status:ban'],
    [/\bPUBLICIDAD\b/g, 'ADVERTISE'],
    [/\bANUNCIAR\b/g, 'ADVERTISE'],
    [/\bconjunto de anuncios\b/gi, 'ad set'],
    [/\bgrupo de anuncios\b/gi, 'ad set'],
    [/\bgrupos de anuncios\b/gi, 'ad sets'],
    [/\bregistraciones\b/gi, 'registros'],
    [/\bregistración\b/gi, 'registro'],
    [/\bdepa\b/gi, 'depósito'],
    [/\bdepas\b/gi, 'depósitos'],
  ];
  for (const [re, rep] of replacements) t = t.replace(re, rep);
  if (/YOU USED ALL|MYMEMORY/i.test(t)) return null;
  return t;
}

function libreTranslate(text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ q: text.slice(0, 4500), source: 'ru', target: 'es', format: 'text' });
    const req = https.request(
      LIBRE_URL,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const j = JSON.parse(data);
            if (j.translatedText) resolve(j.translatedText);
            else reject(new Error(j.error || data.slice(0, 200)));
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function translateOne(text, attempt = 0) {
  const { protectedText, placeholders } = protectTemplates(text);
  try {
    const raw = await libreTranslate(protectedText);
    const out = postProcess(restoreTemplates(raw, placeholders));
    if (!out) throw new Error('bad translation');
    return out;
  } catch (e) {
    if (attempt < 4) {
      await sleep(8000 * (attempt + 1));
      return translateOne(text, attempt + 1);
    }
    throw e;
  }
}

function isGoodTranslation(ru, es) {
  if (!es || es === ru) return false;
  if (/YOU USED ALL|MYMEMORY/i.test(es)) return false;
  if (/[а-яА-ЯёЁ]/.test(es) && es.length > ru.length * 0.5) return false;
  return true;
}

function loadGoodFromEsMap() {
  const map = {};
  if (fs.existsSync('es-map.json')) {
    const em = JSON.parse(fs.readFileSync('es-map.json', 'utf8'));
    for (const [ru, es] of Object.entries(em)) {
      if (isGoodTranslation(ru, es)) map[ru] = postProcess(es) || es;
    }
  }
  return map;
}

function applyToApp(map) {
  let content = fs.readFileSync('app.js', 'utf8');
  const sorted = Object.keys(map)
    .filter((k) => map[k] && map[k] !== k && isGoodTranslation(k, map[k]))
    .sort((a, b) => b.length - a.length);
  let applied = 0;
  for (const k of sorted) {
    if (content.includes(k)) {
      content = content.split(k).join(map[k]);
      applied++;
    }
  }
  content = content.replace(/ru-RU/g, 'es-ES');
  content = content.replace(/new Intl\.DisplayNames\(\["ru"\]/g, 'new Intl.DisplayNames(["es"]');
  content = content.replace(/localeCompare\(([^,]+),\s*"ru"\)/g, 'localeCompare($1, "es")');
  fs.writeFileSync('app.js', content, 'utf8');
  const cyr = (content.match(/[а-яА-ЯёЁ]/g) || []).length;
  return { applied, cyrillic: cyr };
}

async function main() {
  const ru = [...new Set(JSON.parse(fs.readFileSync('ru-strings.json', 'utf8')))];
  let map = loadGoodFromEsMap();
  console.log('Good seed translations:', Object.keys(map).length);

  if (fs.existsSync('es-full-map.json')) {
    const existing = JSON.parse(fs.readFileSync('es-full-map.json', 'utf8'));
    for (const [k, v] of Object.entries(existing)) {
      if (isGoodTranslation(k, v)) map[k] = v;
    }
  }

  const pending = ru.filter((s) => !map[s] || !isGoodTranslation(s, map[s]));
  console.log(`Pending: ${pending.length} / ${ru.length}`);

  for (let i = 0; i < pending.length; i++) {
    const s = pending[i];
    if (i % 5 === 0) console.log(`${i + 1}/${pending.length}: ${s.slice(0, 60).replace(/\n/g, ' ')}...`);
    try {
      map[s] = await translateOne(s);
    } catch (e) {
      console.error('FAIL:', s.slice(0, 40), e.message);
      map[s] = s;
    }
    if ((i + 1) % 20 === 0) {
      fs.writeFileSync('es-full-map.json', JSON.stringify(map, null, 2), 'utf8');
      console.log('  checkpoint saved');
    }
    await sleep(DELAY_MS);
  }

  for (const s of ru) {
    if (!map[s]) map[s] = s;
  }
  fs.writeFileSync('es-full-map.json', JSON.stringify(map, null, 2), 'utf8');
  const good = Object.entries(map).filter(([k, v]) => isGoodTranslation(k, v)).length;
  console.log(`Wrote es-full-map.json: ${Object.keys(map).length} keys, ${good} translated`);

  if (process.argv.includes('--apply')) {
    const { applied, cyrillic } = applyToApp(map);
    console.log('Applied to app.js:', applied, 'replacements');
    console.log('Cyrillic remaining:', cyrillic);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
