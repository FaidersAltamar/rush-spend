const fs = require('fs');

let content = fs.readFileSync('app.js', 'utf8');

content = content.replace(/YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY\. NEXT AVAILABLE IN\s+[\d\sA-Z:]+ VISIT HTTPS:\/\/MYMEMORY\.TRANSLATED\.NET\/DOC\/USAGELIMITS\.PHP TO TRANSLATE MORE/gi, '');

const map = JSON.parse(fs.readFileSync('es-full-map.json', 'utf8'));
const reverse = Object.entries(map)
  .filter(([ru, es]) => es && es !== ru && !/YOU USED ALL|MYMEMORY/i.test(es))
  .sort((a, b) => b[1].length - a[1].length);

let rev = 0;
for (const [ru, es] of reverse) {
  if (content.includes(es)) {
    content = content.split(es).join(ru);
    rev++;
  }
}

content = content.replace(/es-ES/g, 'ru-RU');
content = content.replace(/new Intl\.DisplayNames\(\["es"\]/g, 'new Intl.DisplayNames(["ru"]');
content = content.replace(/localeCompare\(([^,]+),\s*"es"\)/g, 'localeCompare($1, "ru")');

fs.writeFileSync('app.js', content, 'utf8');

const ru = JSON.parse(fs.readFileSync('ru-strings.json', 'utf8'));
const found = ru.filter(s => content.includes(s)).length;
const cyr = (content.match(/[а-яА-ЯёЁ]/g) || []).length;
console.log('Reversed entries:', rev);
console.log('RU strings in file:', found, '/', ru.length);
console.log('Cyrillic chars:', cyr);
