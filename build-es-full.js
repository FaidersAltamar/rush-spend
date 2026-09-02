const fs = require('fs');
const https = require('https');

const DELAY_MS = 1500;
const RETRY_DELAY = 10000;

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
    [/\bEstadísticas\b/g, 'Estadística'],
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
    [/\bregi\b/gi, 'reg'],
    [/\bdepa\b/gi, 'depósito'],
    [/\bdepas\b/gi, 'depósitos'],
  ];
  for (const [re, rep] of replacements) t = t.replace(re, rep);
  if (t.includes('MYMEMORY WARNING')) {
    const parts = t.split('WARNING:');
    t = parts[parts.length - 1].trim();
  }
  return t;
}

function myMemory(text) {
  return new Promise((resolve, reject) => {
    const q = encodeURIComponent(text.slice(0, 4500));
    const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=ru|es`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.responseStatus === 200 || j.responseData?.translatedText) {
            resolve(j.responseData.translatedText);
          } else {
            reject(new Error(j.responseDetails || 'translate failed'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function translateOne(text, attempt = 0) {
  const { protectedText, placeholders } = protectTemplates(text);
  try {
    const raw = await myMemory(protectedText);
    return postProcess(restoreTemplates(raw, placeholders));
  } catch (e) {
    if (attempt < 5) {
      await sleep(RETRY_DELAY * (attempt + 1));
      return translateOne(text, attempt + 1);
    }
    throw e;
  }
}

function applyToApp(map) {
  let content = fs.readFileSync('app.js', 'utf8');
  const sorted = Object.keys(map).filter((k) => map[k] && map[k] !== k).sort((a, b) => b.length - a.length);
  for (const k of sorted) content = content.split(k).join(map[k]);
  content = content.replace(/ru-RU/g, 'es-ES');
  content = content.replace(/new Intl\.DisplayNames\(\["ru"\]/g, 'new Intl.DisplayNames(["es"]');
  content = content.replace(/localeCompare\(([^,]+),\s*"ru"\)/g, 'localeCompare($1, "es")');
  fs.writeFileSync('app.js', content, 'utf8');
  return { applied: sorted.length, cyrillic: (content.match(/[а-яА-ЯёЁ]/g) || []).length };
}

async function main() {
  const ru = JSON.parse(fs.readFileSync('ru-strings.json', 'utf8'));
  const unique = [...new Set(ru)];
  let map = {};
  if (fs.existsSync('es-full-map.json')) {
    map = JSON.parse(fs.readFileSync('es-full-map.json', 'utf8'));
  } else if (fs.existsSync('es-map.json')) {
    map = JSON.parse(fs.readFileSync('es-map.json', 'utf8'));
  }

  const pending = unique.filter((s) => !map[s] || map[s] === s);
  console.log(`Pending: ${pending.length} / ${unique.length}`);

  for (let i = 0; i < pending.length; i++) {
    const s = pending[i];
    if (i % 10 === 0) console.log(`${i + 1}/${pending.length}: ${s.slice(0, 55)}...`);
    try {
      map[s] = await translateOne(s);
    } catch (e) {
      console.error('FAIL', s.slice(0, 50), e.message);
      map[s] = s;
    }
    if ((i + 1) % 25 === 0) fs.writeFileSync('es-full-map.json', JSON.stringify(map, null, 2), 'utf8');
    await sleep(DELAY_MS);
  }

  for (const s of unique) if (!map[s]) map[s] = s;
  fs.writeFileSync('es-full-map.json', JSON.stringify(map, null, 2), 'utf8');
  console.log('Wrote es-full-map.json with', Object.keys(map).length, 'entries');

  const { applied, cyrillic } = applyToApp(map);
  console.log('Applied', applied, 'translations');
  console.log('Cyrillic remaining:', cyrillic);
}

main().catch((e) => { console.error(e); process.exit(1); });
