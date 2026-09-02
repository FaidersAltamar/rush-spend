// Extract all Cyrillic substrings still in app.js
const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');
const re = /["'`]([^"'`]*[а-яА-ЯёЁ][^"'`]*)["'`]/g;
const found = new Set();
let m;
while ((m = re.exec(app))) found.add(m[1]);
const sorted = [...found].sort((a, b) => b.length - a.length);
console.log('Unique Cyrillic string literals:', sorted.length);
sorted.forEach((s) => console.log(JSON.stringify(s.slice(0, 150))));
