const fs = require('fs');
const app = fs.readFileSync('../adstip-spend-1.14.1-original/app.js', 'utf8');
const needle = 'Сначала загрузите кабинеты на вкладке «Кабинеты».';
const idx = app.indexOf(needle);
console.log('index', idx);
console.log('context', JSON.stringify(app.slice(idx - 30, idx + needle.length + 30)));

const re = /(`(?:\\[\s\S]|[^`\\])*`|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')/g;
let m;
while ((m = re.exec(app))) {
  if (m[0].includes(needle)) {
    console.log('found in literal, quote:', m[0][0], 'len:', m[0].length);
    console.log('literal start:', JSON.stringify(m[0].slice(0, 80)));
  }
}
