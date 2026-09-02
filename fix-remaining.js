/**
 * Apply all remaining safe translations + fix known corruption.
 */
const fs = require('fs');
const { execSync } = require('child_process');

function sanitizeEs(es) {
  return es.replace(/"([^"]+)"/g, '«$1»');
}

const map = JSON.parse(fs.readFileSync('es-full-map.json', 'utf8'));
const ru = JSON.parse(fs.readFileSync('ru-strings.json', 'utf8'));
let content = fs.readFileSync('app.js', 'utf8');

const pending = ru
  .filter((s) => content.includes(s) && map[s] && map[s] !== s && s.length >= 15)
  .sort((a, b) => b.length - a.length);

let applied = 0;
for (const k of pending) {
  content = content.split(k).join(sanitizeEs(map[k]));
  applied++;
}

const manual = {
  'Удалить': 'Eliminar',
  'каб.': 'cuentas',
  'Перехватить из сессии Facebook': 'Capturar de la sesión de Facebook',
  'Перехватить токен': 'Capturar token',
  'Перехватить': 'Capturar',
  'Кабинеты': 'Cuentas',
  'Статистика': 'Estadística',
  'Ещё': 'Más',
  'Валюта': 'Moneda',
  'Настройки': 'Ajustes',
  'Обновить данные': 'Actualizar datos',
  'без категории': 'sin categoría',
  'Сводка': 'Resumen',
  'Скопировано': 'Copiado',
  'Отправить в Binom': 'Enviar a Binom',
  'Скопировать ссылки': 'Copiar enlaces',
  'Нужен токен': 'Token requerido',
  'Откройте «Ещё» и перехватите токен из сессии Facebook или вставьте его вручную.':
    'Abra «Más» y capture el token de la sesión de Facebook o péguelo manualmente.',
  'Кабинеты по категориям': 'Cuentas por categoría',
  'Кабинет ': 'Cuenta ',
  'Бизнес-менеджер ': 'Business Manager ',
  'Страница ': 'Página ',
  'Пиксель ': 'Píxel ',
  'Приложение ': 'Aplicación ',
  'в бане': 'bloqueadas',
  'с вопросом': 'con incidencia',
  'в ': 'en ',
  'из ': 'de ',
  'ещё ': 'más ',
  'за фильтрами': 'filtradas',
  'Показать ещё ': 'Mostrar más ',
  'Показано ': 'Mostrado ',
  'шт.': 'uds.',
  'повторить': 'reintentar',
  'ок': 'OK',
};

for (const [k, v] of Object.entries(manual).sort((a, b) => b[0].length - a[0].length)) {
  if (content.includes(k)) {
    content = content.split(k).join(v);
    applied++;
  }
}

// Fix corruption from bad short-string replacements
content = content.replace(/<\/botón>/g, '</button>');
content = content.replace(/тDE ACUERDOен/g, 'token');
content = content.replace(/Перехватить тtoken/g, 'Capturar token');
content = content.replace(/DE ACUERDO/g, 'OK');

fs.writeFileSync('app.js', content, 'utf8');
const left = ru.filter((s) => content.includes(s)).length;
const cyr = (content.match(/[а-яА-ЯёЁ]/g) || []).length;
console.log('Applied batches, RU left:', left, 'Cyrillic:', cyr);

try {
  execSync('node --check app.js', { stdio: 'pipe' });
  console.log('Syntax: OK');
} catch (e) {
  console.log('Syntax error:', String(e.stderr || e.message).slice(0, 300));
}
