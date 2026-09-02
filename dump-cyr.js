const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');
const re = /[а-яА-ЯёЁ][^"'`\n]{0,100}/g;
let m;
while ((m = re.exec(app))) console.log(m[0]);
