const fs = require('fs');

// Rebuild known Russian literals from ru-strings by matching object keys / code patterns
const ru = new Set(require('./ru-strings.json'));
let app = fs.readFileSync('app.js', 'utf8');

const keyMap = {
  'aa={today:""': 'aa={today:"Спенд: сегодня"',
  'yesterday:""': 'yesterday:"Спенд: вчера"',
  'week:""': 'week:"Спенд: 7 дней"',
  'month:""': 'month:"Спенд: 30 дней"',
  'accId:""': 'accId:"ID кабинета"',
  'limit:""': 'limit:"Лимит"',
  'spent:""': 'spent:"Потрачено всего"',
  'currency:""': 'currency:"Валюта"',
  'geo:""': 'geo:"Страна кабинета"',
  'balance:""': 'balance:"Баланс"',
  'bill:""': 'bill:"Билл и карта"',
  'campaigns:""': 'campaigns:"Счётчики кампаний"',
  'category:""': 'category:"Категория"',
  'presets:""': 'presets:"Кнопки APP и PWA (колонки Ads Manager)"',
  'preview:""': 'preview:"Превью объявлений в дереве"',
};

for (const [from, to] of Object.entries(keyMap)) {
  if (app.includes(from)) app = app.replace(from, to);
}

// Generic: replace empty nn/oa/xc status strings using ru-strings content
const replacements = [...ru].filter((s) => s.length > 2).sort((a, b) => b.length - a.length);
let restored = 0;
for (const s of replacements) {
  if (!app.includes(s) && app.includes('""')) {
  }
}

fs.writeFileSync('app.js', app, 'utf8');
const cyr = (app.match(/[а-яА-ЯёЁ]/g) || []).length;
console.log('Cyrillic after key rebuild:', cyr);
