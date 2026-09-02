const app = require('fs').readFileSync('app.js', 'utf8');
const re = /["'`]([^"'`]*[а-яА-ЯёЁ][^"'`]*)["'`]/g;
let m, hits = [];
while ((m = re.exec(app))) if (m[1] === 'ок') hits.push(m.index);
console.log('exact ok hits:', hits.length);
hits.slice(0, 3).forEach((i) => console.log(JSON.stringify(app.slice(i - 20, i + 30))));
