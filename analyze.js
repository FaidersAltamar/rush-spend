const ru = require('./ru-strings.json');
const app = require('fs').readFileSync('app.js', 'utf8');
const inApp = ru.filter((s) => app.includes(s));
const notInApp = ru.filter((s) => !app.includes(s));
console.log('in app:', inApp.length);
console.log('not in app:', notInApp.length);
console.log('empty quotes:', (app.match(/""/g) || []).length);
