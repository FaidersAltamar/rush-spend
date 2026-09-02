/**
 * Rebuild corrupted app.js by filling empty string literals from ru-strings.json
 * using object-key context and unique surrounding anchors.
 */
const fs = require('fs');

const ru = require('./ru-strings.json');
const ruSet = new Set(ru);
let app = fs.readFileSync('app.js', 'utf8');

// Known key -> Russian label mappings (from ru-strings.json)
const keyLabels = {
  today: 'Спенд: сегодня',
  yesterday: 'Спенд: вчера',
  week: 'Спенд: 7 дней',
  month: 'Спенд: 30 дней',
  accId: 'ID кабинета',
  limit: 'Лимит',
  spent: 'Потрачено всего',
  currency: 'Валюта',
  geo: 'Страна кабинета',
  balance: 'Баланс',
  bill: 'Билл и карта',
  campaigns: 'Счётчики кампаний',
  category: 'Категория',
  presets: 'Кнопки APP и PWA (колонки Ads Manager)',
  preview: 'Превью объявлений в дереве',
  token: 'Токен',
  tokenSource: 'Источник токена',
  app: 'APP',
  pwa: 'PWA',
};

// Fill object key patterns: key:"" -> key:"Russian"
for (const [key, label] of Object.entries(keyLabels)) {
  if (!ruSet.has(label)) continue;
  const re = new RegExp(`(${key}:\\s*)""`, 'g');
  app = app.replace(re, `$1"${label.replace(/"/g, '\\"')}"`);
}

// Lc status labels
const lcLabels = {
  ACTIVE: 'Активно',
  PAUSED: 'На паузе',
  CAMPAIGN_PAUSED: 'Кампания на паузе',
  ADSET_PAUSED: 'Группа на паузе',
  WITH_ISSUES: 'С проблемами',
  PENDING_REVIEW: 'На проверке',
  PENDING_BILLING_INFO: 'Нужны платёжные данные',
  IN_PROCESS: 'В обработке',
  DISAPPROVED: 'Отклонено',
  PREAPPROVED: 'Предодобрено',
  ARCHIVED: 'В архиве',
  DELETED: 'Удалено',
  ADSET_ARCHIVED: 'Группа в архиве',
  CAMPAIGN_ARCHIVED: 'Кампания в архиве',
};

for (const [key, label] of Object.entries(lcLabels)) {
  const candidates = ru.filter((s) => s === label || s.toLowerCase() === label.toLowerCase());
  const val = candidates[0] || label;
  if (!ruSet.has(val) && val === label) {
    // try fuzzy match in ru-strings
    const fuzzy = ru.find((s) => s.length < 30 && s.includes(label.slice(0, 6)));
    if (fuzzy) {
      const re = new RegExp(`(${key}:\\s*)""`, 'g');
      app = app.replace(re, `$1"${fuzzy.replace(/"/g, '\\"')}"`);
    }
    continue;
  }
  const re = new RegExp(`(${key}:\\s*)""`, 'g');
  app = app.replace(re, `$1"${val.replace(/"/g, '\\"')}"`);
}

// Restore locale to Russian for re-translation
app = app.replace(/es-ES/g, 'ru-RU');
app = app.replace(/new Intl\.DisplayNames\(\["es"\]/g, 'new Intl.DisplayNames(["ru"]');
app = app.replace(/localeCompare\(([^,]+),\s*"es"\)/g, 'localeCompare($1, "ru")');

fs.writeFileSync('app.js', app, 'utf8');

const present = ru.filter((s) => app.includes(s)).length;
const cyr = (app.match(/[а-яА-ЯёЁ]/g) || []).length;
const empty = (app.match(/""/g) || []).length;
console.log('RU strings present:', present, '/', ru.length);
console.log('Cyrillic chars:', cyr);
console.log('Empty quote pairs:', empty);
