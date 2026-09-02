const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');
const i = app.indexOf('ов не стоит');
console.log(app.slice(i - 120, i + 150));
