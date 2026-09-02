const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');
const re = /["'`]([^"'`]*[а-яА-ЯёЁ][^"'`]*)["'`]/g;
const set = new Set();
let m;
while ((m = re.exec(app))) set.add(m[1]);
const arr = [...set].sort((a, b) => b.length - a.length);
console.log('Remaining unique strings:', arr.length);
arr.slice(0, 50).forEach((s, i) => console.log(i + 1, JSON.stringify(s.slice(0, 120))));
