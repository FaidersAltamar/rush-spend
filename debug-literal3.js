const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');
const ru = 'Сначала загрузите кабинеты на вкладке «Кабинеты».';
const re = /(`(?:\\[\s\S]|[^`\\])*`|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')/g;
let m, n = 0;
while ((m = re.exec(app))) {
  if (m[0].includes(ru)) {
    n++;
    console.log('match', n, 'quote', m[0][0], 'len', m[0].length);
    console.log('content:', JSON.stringify(m[0].slice(0, 120)));
  }
}
