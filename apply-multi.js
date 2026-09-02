/**
 * Run translation passes until no progress.
 */
const fs = require('fs');
const { execSync } = require('child_process');

for (let pass = 1; pass <= 5; pass++) {
  execSync('node apply-translations.js', { stdio: 'inherit' });
  const app = fs.readFileSync('app.js', 'utf8');
  const ru = JSON.parse(fs.readFileSync('ru-strings.json', 'utf8'));
  const left = ru.filter((s) => app.includes(s)).length;
  const cyr = (app.match(/[а-яА-ЯёЁ]/g) || []).length;
  console.log(`Pass ${pass}: RU strings left ${left}, cyrillic ${cyr}`);
  if (left === 0) break;
}
