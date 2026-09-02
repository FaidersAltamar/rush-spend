const fs = require('fs');
const app = fs.readFileSync('../adstip-spend-1.14.1-original/app.js', 'utf8');
const ru = 'Сначала загрузите кабинеты на вкладке «Кабинеты».';
const es = 'Primero, cargue las cuentas en la pestaña "Cuentas".';

const re = /(`(?:\\[\s\S]|[^`\\])*`|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')/g;
let m;
while ((m = re.exec(app))) {
  if (!m[0].includes(ru)) continue;
  const quote = m[0][0];
  const inner = m[0].slice(1, -1);
  const pos = inner.indexOf(ru);
  const before = inner.slice(Math.max(0, pos - 8), pos);
  console.log('quote', quote, 'before', JSON.stringify(before));
  console.log('match =\\"', /=\\"$/.test(before));
  console.log('slice-12', JSON.stringify(inner.slice(pos - 12, pos)));
}
