/**
 * Apply remaining translations via safe global replace (long strings only).
 */
const fs = require('fs');
const { execSync } = require('child_process');

function sanitizeEs(es) {
  return es.replace(/"([^"]+)"/g, '«$1»');
}

const map = JSON.parse(fs.readFileSync('es-full-map.json', 'utf8'));
const ru = JSON.parse(fs.readFileSync('ru-strings.json', 'utf8'));
let content = fs.readFileSync('app.js', 'utf8');

const pending = ru
  .filter((s) => content.includes(s) && map[s] && map[s] !== s)
  .filter((s) => s.length >= 12)
  .sort((a, b) => b.length - a.length);

let applied = 0;
for (const k of pending) {
  if (content.includes(k)) {
    content = content.split(k).join(sanitizeEs(map[k]));
    applied++;
  }
}

fs.writeFileSync('app.js', content, 'utf8');
const left = ru.filter((s) => content.includes(s)).length;
const cyr = (content.match(/[а-яА-ЯёЁ]/g) || []).length;
console.log('Applied:', applied, 'RU left:', left, 'Cyrillic:', cyr);

try {
  execSync('node --check app.js', { stdio: 'pipe' });
  console.log('Syntax: OK');
} catch (e) {
  console.log('Syntax error:', String(e.stderr || e.message).slice(0, 300));
}
