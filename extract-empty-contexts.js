const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');

const contexts = new Map();
const re = /(.{0,60})""/g;
let m;
while ((m = re.exec(app))) {
  const ctx = m[1].slice(-60);
  contexts.set(ctx, (contexts.get(ctx) || 0) + 1);
}

const sorted = [...contexts.entries()].sort((a, b) => b[1] - a[1]);
console.log('Unique contexts before "":', sorted.length);
sorted.slice(0, 40).forEach(([ctx, n]) => console.log(n, JSON.stringify(ctx)));
