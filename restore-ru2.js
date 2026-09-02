const fs = require('fs');

let content = fs.readFileSync('app.js', 'utf8');

// Strip MyMemory quota garbage
content = content.replace(/YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY\. NEXT AVAILABLE IN\s+[\d\sA-Z:]+ VISIT HTTPS:\/\/MYMEMORY\.TRANSLATED\.NET\/DOC\/USAGELIMITS\.PHP TO TRANSLATE MORE/gi, '');

// Reverse good translations from es-map.json
const goodMap = JSON.parse(fs.readFileSync('es-map.json', 'utf8'));
const reverseGood = Object.entries(goodMap)
  .filter(([ru, es]) => es && es !== ru && !/YOU USED ALL|MYMEMORY/i.test(es))
  .sort((a, b) => b[1].length - a[1].length);

for (const [ru, es] of reverseGood) {
  if (content.includes(es)) content = content.split(es).join(ru);
}

fs.writeFileSync('app.js', content, 'utf8');

const ru = [...new Set(JSON.parse(fs.readFileSync('ru-strings.json', 'utf8')))];
let found = 0;
for (const s of ru) if (content.includes(s)) found++;
const cyr = (content.match(/[а-яА-ЯёЁ]/g) || []).length;
console.log('Strings from ru-strings still in app.js:', found, '/', ru.length);
console.log('Cyrillic chars:', cyr);
