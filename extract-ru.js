const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
const matches = [...content.matchAll(/["'`]([^"'`]*[а-яА-ЯёЁ][^"'`]*)["'`]/g)];
const unique = [...new Set(matches.map(m => m[1]))].sort((a, b) => b.length - a.length);
fs.writeFileSync('ru-strings.json', JSON.stringify(unique, null, 2), 'utf8');
console.log('Total unique strings:', unique.length);
