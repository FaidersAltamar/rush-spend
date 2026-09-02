const fs = require('fs');
const app = fs.readFileSync('../adstip-spend-1.14.1-original/app.js', 'utf8');
const needle = 'Сначала загрузите кабинеты на вкладке «Кабинеты».';
const idx = app.indexOf(needle);

const re = /(`(?:\\[\s\S]|[^`\\])*`|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')/g;
let m;
while ((m = re.exec(app))) {
  if (m.index <= idx && m.index + m[0].length >= idx + needle.length) {
    console.log('literal at', m.index, 'len', m[0].length, 'quote', m[0][0]);
    console.log('starts:', JSON.stringify(app.slice(m.index, m.index + 100)));
    console.log('ends:', JSON.stringify(app.slice(m.index + m[0].length - 100, m.index + m[0].length)));
  }
}
