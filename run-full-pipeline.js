/**
 * Full translation pipeline from clean Russian app.js (no short-string corruption).
 */
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const root = __dirname;
const orig = path.join(root, '..', 'adstip-spend-1.14.1-original', 'app.js');

fs.copyFileSync(orig, path.join(root, 'app.js'));
console.log('Restored original app.js');

const steps = ['apply-translations.js', 'apply-all-ru.js', 'finish-manual.js', 'apply-short-labels.js', 'apply-final-patches.js', 'fix-corruption.js', 'polish-es.js', 'fix-html.js'];

for (const step of steps) {
  console.log('\n---', step, '---');
  execSync(`node ${step}`, { cwd: root, stdio: 'inherit' });
}

const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const ru = require('./ru-strings.json');
const left = ru.filter((s) => app.includes(s));
const cyr = (app.match(/[а-яА-ЯёЁ]/g) || []).length;
console.log('\n=== AFTER PIPELINE ===');
console.log('RU strings left:', left.length);
console.log('Cyrillic chars:', cyr);
fs.writeFileSync('still-ru.json', JSON.stringify(left, null, 2));
