const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');
const ru = require('./ru-strings.json');

const found = ru.filter((s) => app.includes(s));
const missing = ru.filter((s) => !app.includes(s));

// Count empty string literals in various contexts
const patterns = {
  'key:""': (app.match(/[a-zA-Z_$][\w$]*:""/g) || []).length,
  "key:''": (app.match(/[a-zA-Z_$][\w$]*:''/g) || []).length,
  'textContent=""': (app.match(/textContent=""/g) || []).length,
  'title=""': (app.match(/title=""/g) || []).length,
  'placeholder=""': (app.match(/placeholder=""/g) || []).length,
  'innerHTML=""': (app.match(/innerHTML=""/g) || []).length,
  'toast("")': (app.match(/toast\(""\)/g) || []).length,
  'double-quote pairs': (app.match(/""/g) || []).length,
};

console.log('RU strings found:', found.length, '/', ru.length);
console.log('Cyrillic chars:', (app.match(/[а-яА-ЯёЁ]/g) || []).length);
console.log('Patterns:', patterns);

// Sample corruptions
const bad = [
  'автоcomplete',
  'hide-Банned',
  'Втhref',
  'fee-ошибка',
  'cardПтwOpen',
];
for (const b of bad) {
  if (app.includes(b)) console.log('Corruption found:', b);
}

// Check syntax
try {
  require('child_process').execSync('node --check app.js', { stdio: 'pipe' });
  console.log('Syntax: OK');
} catch (e) {
  console.log('Syntax error:', String(e.stderr || e.message).split('\n')[0]);
}
