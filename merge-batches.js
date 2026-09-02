/**
 * Merge translation batch files + es-map good entries into es-full-map.json
 * Usage: node merge-batches.js [--apply]
 */
const fs = require('fs');

function isGood(ru, es) {
  if (!es || es === ru) return false;
  if (/YOU USED ALL|MYMEMORY/i.test(es)) return false;
  return true;
}

function postProcess(es) {
  let t = es;
  t = t.replace(/<clase de sección=/gi, '<section class=');
  t = t.replace(/<\/sección>/gi, '</section>');
  t = t.replace(/<clase div=/gi, '<div class=');
  t = t.replace(/\boficina(s)?\b/gi, (m) => (m[0] === 'O' ? 'Cuenta' : 'cuenta') + (m.endsWith('s') ? 's' : ''));
  t = t.replace(/\bgabinete(s)?\b/gi, (m) => (m[0] === 'G' ? 'Cuenta' : 'cuenta') + (m.endsWith('s') ? 's' : ''));
  t = t.replace(/\bspread\b/gi, 'gasto');
  t = t.replace(/\bGabinetes\b/g, 'Cuentas');
  t = t.replace(/\bgabinetes\b/g, 'cuentas');
  return t;
}

const ru = [...new Set(JSON.parse(fs.readFileSync('ru-strings.json', 'utf8')))];
const map = {};

if (fs.existsSync('es-map.json')) {
  for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync('es-map.json', 'utf8')))) {
    if (isGood(k, v)) map[k] = postProcess(v);
  }
}

for (const f of fs.readdirSync('.').filter((x) => /^es-batch-\d+\.json$/.test(x)).sort()) {
  const batch = JSON.parse(fs.readFileSync(f, 'utf8'));
  Object.assign(map, batch);
}

for (const s of ru) {
  if (!map[s]) map[s] = s;
}

fs.writeFileSync('es-full-map.json', JSON.stringify(map, null, 2), 'utf8');
const translated = Object.entries(map).filter(([k, v]) => isGood(k, v)).length;
console.log('es-full-map.json:', Object.keys(map).length, 'keys,', translated, 'translated');

if (process.argv.includes('--apply')) {
  let content = fs.readFileSync('app.js', 'utf8');
  const sorted = Object.keys(map).filter((k) => isGood(k, map[k])).sort((a, b) => b.length - a.length);
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
  console.log('Applied:', applied, 'replacements');
  console.log('Cyrillic remaining:', cyr);
}
