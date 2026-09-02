/**
 * Final manual fixes for mixed/corrupt strings.
 */
const fs = require('fs');
const { execSync } = require('child_process');

let c = fs.readFileSync('app.js', 'utf8');

const fixes = [
  ['cuenta остался', 'cuenta restante'],
  ['cuentas restantes', 'cuentas restantes'],
  ['Открыл en фоне', 'Abierto en segundo plano'],
  ['Сохранить', 'Guardar'],
  ['Брать курс автоматически', 'Tomar tipo de cambio automáticamente'],
  ['<clase abarcada="hint"', '<span class="hint"'],
  ['по умолчанию', 'por defecto'],
  ['Косты en трекер (Binom)', 'Costes en el tracker (Binom)'],
  ['Тест: держит ли Binom cost по ad.id без кликов', 'Prueba: si Binom mantiene el coste por ad.id sin clics'],
  ['Отправить тестовый cost', 'Enviar coste de prueba'],
  ['О расширении', 'Sobre la extensión'],
  ['Cargando armarios', 'Cargando cuentas'],
  ['armarios', 'cuentas'],
  ['К отправке', 'Para enviar'],
  ['день', 'día'],
  ['дней', 'días'],
  ['Cable ', 'Fallo '],
  ['Перехватить из sesiones de facebook', 'Capturar de la sesión de Facebook'],
  ['Перехватите token de этой сессии', 'Capture el token de esta sesión'],
  ['Откройте Ads Manager под нужным аккаунтом', 'Abra Ads Manager con la cuenta correcta'],
  ['Открыть Ads Manager', 'Abrir Ads Manager'],
  ['Interceptar', 'Capturar'],
  ['Название', 'Nombre'],
  ['Описание', 'Descripción'],
  ['Версия', 'Versión'],
  ['Добро пожаловать', 'Bienvenido'],
  ['Инструмент сообщества', 'Herramienta de la comunidad'],
  ['без категории', 'sin categoría'],
  ['- sin categoría -', '- sin categoría -'],
  ['потрачено', 'gastado'],
  ['в кабинете', 'en la cuenta'],
  ['последний рекламный пост', 'última publicación patrocinada'],
  ['прошлый отказ', 'rechazo anterior'],
  ['проверено', 'comprobado'],
  ['постов', 'publicaciones'],
  ['посчитанных', 'contadas'],
  ['комментарии есть у', 'comentarios en'],
  ['из кабинета', 'de la cuenta'],
  ['в этом БМ не видно', 'no visible en este BM'],
  ['есть ещё', 'hay más'],
  ['это все', 'todo'],
  ['Список собран по кабинетам', 'Lista compilada por cuentas'],
  ['Часть списка Facebook не отдал', 'Facebook no devolvió parte de la lista'],
  ['Показано только то, что пришло', 'Solo se muestra lo recibido'],
  ['Найдено через кабинеты', 'Encontrado a través de cuentas'],
  ['Опросили', 'Consultadas'],
  ['пикселей в них нет', 'no tienen píxeles'],
  ['Через кабинеты тоже не вышло', 'Tampoco funcionó vía cuentas'],
  ['Скопировано', 'Copiado'],
  ['ссылок', 'enlaces'],
  ['с ошибкой', 'con error'],
  ['Отправлено', 'Enviado'],
  ['Отправить в Binom', 'Enviar a Binom'],
  ['Скопировать ссылки', 'Copiar enlaces'],
];

for (const [from, to] of fixes) {
  c = c.split(from).join(to);
}

fs.writeFileSync('app.js', c, 'utf8');
const cyr = (c.match(/[а-яА-ЯёЁ]/g) || []).length;
console.log('Cyrillic remaining:', cyr);
try {
  execSync('node --check app.js', { stdio: 'pipe' });
  console.log('Syntax: OK');
} catch (e) {
  console.log('Syntax error:', String(e.stderr || e.message).slice(0, 300));
}
