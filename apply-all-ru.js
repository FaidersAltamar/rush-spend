/**
 * Global replace all remaining ru-strings from merged map (long strings only).
 */
const fs = require('fs');
const { execSync } = require('child_process');

function sanitizeEs(es) {
  return es.replace(/"([^"]+)"/g, '«$1»');
}

const full = JSON.parse(fs.readFileSync('es-full-map.json', 'utf8'));
const esmap = JSON.parse(fs.readFileSync('es-map.json', 'utf8'));
const merged = { ...esmap, ...full };
const ru = JSON.parse(fs.readFileSync('ru-strings.json', 'utf8'));

let c = fs.readFileSync('app.js', 'utf8');
const before = (c.match(/[а-яА-ЯёЁ]/g) || []).length;

const MIN_LEN = 8; // avoid corrupting Russian words via short substrings

const pending = ru
  .filter((s) => s.length >= MIN_LEN && c.includes(s) && merged[s] && merged[s] !== s)
  .filter((s) => !/YOU USED ALL|MYMEMORY/i.test(merged[s]))
  .sort((a, b) => b.length - a.length);

let applied = 0;
for (const k of pending) {
  c = c.split(k).join(sanitizeEs(merged[k]));
  applied++;
}

fs.writeFileSync('app.js', c, 'utf8');
const after = (c.match(/[а-яА-ЯёЁ]/g) || []).length;
const left = ru.filter((s) => c.includes(s)).length;
console.log('Applied:', applied, 'RU left:', left);
console.log('Cyrillic before:', before, 'after:', after);

try {
  execSync('node --check app.js', { stdio: 'pipe' });
  console.log('Syntax: OK');
} catch (e) {
  console.log('Syntax error:', String(e.stderr || e.message).slice(0, 500));
}
