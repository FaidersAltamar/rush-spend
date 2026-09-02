const fs = require('fs');
const app = fs.readFileSync('../adstip-spend-1.14.1-original/app.js', 'utf8');
const needle = 'Сначала загрузите кабинеты на вкладке «Кабинеты».';
const idx = app.indexOf(needle);

// Walk backwards to find if we're inside `, ", or '
function findStringContext(s, pos) {
  let inSingle = false, inDouble = false, inTemplate = false, escape = false;
  for (let i = 0; i < pos; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (inTemplate) {
      if (c === '`') inTemplate = false;
      continue;
    }
    if (inSingle) {
      if (c === "'") inSingle = false;
      continue;
    }
    if (inDouble) {
      if (c === '"') inDouble = false;
      continue;
    }
    if (c === '`') inTemplate = true;
    else if (c === '"') inDouble = true;
    else if (c === "'") inSingle = true;
  }
  return { inSingle, inDouble, inTemplate };
}

const ctx = findStringContext(app, idx);
console.log('context at needle:', ctx);
console.log('surrounding:', JSON.stringify(app.slice(idx - 50, idx + needle.length + 20)));

// Also check at the opening quote before needle
const qidx = app.lastIndexOf('"', idx);
const ctx2 = findStringContext(app, qidx + 1);
console.log('context at opening quote:', ctx2);
