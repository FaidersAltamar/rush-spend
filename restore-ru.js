const fs = require('fs');

// Restore app.js to Russian by reversing all map entries (longest Spanish first)
const map = JSON.parse(fs.readFileSync('es-full-map.json', 'utf8'));
let content = fs.readFileSync('app.js', 'utf8');

// Also remove MyMemory garbage fragments that may be embedded
content = content.replace(/YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY\. NEXT AVAILABLE IN\s+[\d\sA-Z:]+ VISIT HTTPS:\/\/MYMEMORY\.TRANSLATED\.NET\/DOC\/USAGELIMITS\.PHP TO TRANSLATE MORE/gi, '');

const reverse = Object.entries(map)
  .filter(([ru, es]) => es && es !== ru)
  .sort((a, b) => b[1].length - a[1].length);

for (const [ru, es] of reverse) {
  if (content.includes(es)) content = content.split(es).join(ru);
}

fs.writeFileSync('app.js', content, 'utf8');
const cyr = (content.match(/[а-яА-ЯёЁ]/g) || []).length;
console.log('Restored Cyrillic chars:', cyr);
