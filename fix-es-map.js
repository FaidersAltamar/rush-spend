/**
 * Clean es-full-map.json: remove corrupted entries, fix known bad translations.
 */
const fs = require('fs');

const map = JSON.parse(fs.readFileSync('es-full-map.json', 'utf8'));
const fixesByEs = {
  'Primero, cargue los cuentas en la pestaña "Armarios".':
    'Primero, cargue las cuentas en la pestaña "Cuentas".',
  'Cargue los cuentas en la pestaña "Armarios".':
    'Cargue las cuentas en la pestaña "Cuentas".',
  'Pasar: 7 días': 'Gasto: 7 días',
  'Pasar: 30 días': 'Gasto: 30 días',
  'País del cuenta': 'País de la cuenta',
  'Factura y mapa': 'Facturación y tarjeta',
  'Activamente': 'Activo',
};

const fixesByRu = {
  'Спенд: 7 дней': 'Gasto: 7 días',
  'Спенд: 30 дней': 'Gasto: 30 días',
  'Спенд: сегодня': 'Gasto: hoy',
  'Спенд: вчера': 'Gasto: ayer',
  'Страна кабинета': 'País de la cuenta',
  'Билл и карта': 'Facturación y tarjeta',
  'Активно': 'Activo',
  'Сначала загрузите кабинеты на вкладке «Кабинеты».':
    'Primero, cargue las cuentas en la pestaña "Cuentas".',
  'Загрузите кабинеты на вкладке «Кабинеты».':
    'Cargue las cuentas en la pestaña "Cuentas".',
};

function isCorrupt(es) {
  if (!es) return true;
  if (/clase=|identificación del botón|clase div=|MYMEMORY|YOU USED ALL/i.test(es))
    return true;
  if (/\$\{[^}]*$/.test(es)) return true;
  if ((es.match(/"/g) || []).length % 2 !== 0) return true;
  return false;
}

const cleaned = {};
let dropped = 0;
let fixed = 0;

for (const [ru, es] of Object.entries(map)) {
  let out = fixesByRu[ru] || fixesByEs[es] || es;
  if (fixesByRu[ru] || fixesByEs[es]) fixed++;
  if (isCorrupt(out) || out === ru) {
    dropped++;
    continue;
  }
  cleaned[ru] = out;
}

fs.writeFileSync('es-full-map.json', JSON.stringify(cleaned, null, 2), 'utf8');
console.log('Entries:', Object.keys(cleaned).length, 'dropped:', dropped, 'fixed:', fixed);
