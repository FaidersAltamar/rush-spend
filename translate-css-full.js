/**
 * Translate CSS comments: copy structure from current CSS, translate Russian comments to Spanish.
 */
const fs = require('fs');
const path = require('path');

let css = fs.readFileSync('app.css', 'utf8');
const map = JSON.parse(fs.readFileSync('es-full-map.json', 'utf8'));

// Apply any long Russian strings from map that appear in comments
const ru = JSON.parse(fs.readFileSync('ru-strings.json', 'utf8'));
const pending = ru
  .filter((s) => s.length >= 20 && css.includes(s) && map[s] && map[s] !== s)
  .sort((a, b) => b.length - a.length);

for (const k of pending) {
  css = css.split(k).join(map[k].replace(/"([^"]+)"/g, '«$1»'));
}

// Phrase-level replacements inside comments only
const phrases = {
  'палитра из брендбука ADStip (§8)': 'paleta del manual de marca ADStip (§8)',
  'НИ max-height, НИ overflow здесь быть не должно.': 'NO debe haber max-height NI overflow aquí.',
  'открыто отдельной вкладкой — можно занять всю ширину': 'abierto en pestaña aparte: puede ocupar todo el ancho',
  'шапка': 'cabecera',
  'Строка объявления в шапке.': 'Línea de anuncio en la cabecera.',
  'Домен, куда уводит кнопка.': 'Dominio al que lleva el botón.',
  'Крутится СТРЕЛКА, а не сама кнопка': 'Gira la FLECHA, no el botón',
  'вкладк': 'pestañ',
  'кабинет': 'cuenta',
  'объявлен': 'anuncio',
  'кнопк': 'botón',
  'прокрутк': 'scroll',
  'высот': 'altura',
  'ширин': 'ancho',
  'отступ': 'margen',
  'панел': 'panel',
  'карточк': 'tarjeta',
  'список': 'lista',
  'фильтр': 'filtro',
  'иконк': 'icono',
  'текст': 'texto',
  'цвет': 'color',
  'фон': 'fondo',
  'границ': 'borde',
  'тень': 'sombra',
  'сетк': 'cuadrícula',
  'колонк': 'columna',
  'заголовок': 'título',
  'подсказк': 'tooltip',
  'переключател': 'interruptor',
  'чекбокс': 'casilla',
  'поле': 'campo',
  'форма': 'formulario',
  'модальн': 'modal',
  'окно': 'ventana',
  'статистик': 'estadística',
  'дерев': 'árbol',
  'кампани': 'campaña',
  'групп': 'grupo',
  'пиксел': 'píxel',
  'токен': 'token',
  'валют': 'moneda',
  'лимит': 'límite',
  'баланс': 'balance',
  'спенд': 'gasto',
  'расход': 'gasto',
  'не должно': 'no debe',
  'обязателен': 'obligatorio',
  'без него': 'sin él',
  'слева': 'izquierda',
  'справа': 'derecha',
  'сверху': 'arriba',
  'снизу': 'abajo',
  'только': 'solo',
  'всегда': 'siempre',
  'при ': 'al ',
  'для ': 'para ',
  'чтобы': 'para que',
  'когда': 'cuando',
  'если': 'si',
  'например': 'p. ej.',
  'видим': 'visible',
  'скрыт': 'oculto',
  'липк': 'fijo',
  'строк': 'fila',
  'ячейк': 'celda',
  'блок': 'bloque',
  'элемент': 'elemento',
  'контейнер': 'contenedor',
  'обёртк': 'envoltorio',
  'размер': 'tamaño',
  'отступы': 'márgenes',
  'padding': 'padding',
  'margin': 'margin',
  'flex': 'flex',
  'grid': 'grid',
  'мобильн': 'móvil',
  'десктоп': 'escritorio',
  'расширен': 'extensión',
  'попап': 'popup',
  'Chrome': 'Chrome',
  'Facebook': 'Facebook',
  'Ads Manager': 'Ads Manager',
  'минимальн': 'mínimo',
  'максимальн': 'máximo',
  'обрез': 'recort',
  'перенос': 'salto',
  'обреза': 'recort',
  'сжима': 'comprim',
  'расталкивает': 'empuja',
  'уезжают': 'se salen',
  'крестик': 'cruz',
  'стрелк': 'flecha',
  'враща': 'gir',
  'квадрат': 'cuadrado',
  'читается': 'se lee',
  'экран': 'pantalla',
  'прокрутил': 'al desplazarse',
  'ограничен': 'limitad',
  'высоте': 'altura',
  'документ': 'documento',
  'правило': 'regla',
  'выше': 'arriba',
  'ниже': 'abajo',
  'внутри': 'dentro',
  'снаружи': 'fuera',
  'между': 'entre',
  'рядом': 'junto',
  'под': 'bajo',
  'над': 'sobre',
  'через': 'mediante',
  'после': 'después',
  'перед': 'antes',
  'вместо': 'en lugar de',
  'вместе': 'junto',
  'отдельн': 'aparte',
  'общ': 'común',
  'главн': 'principal',
  'второстепенн': 'secundario',
  'важн': 'importante',
  'обязательн': 'obligatorio',
  'нельзя': 'no se puede',
  'нужно': 'hay que',
  'можно': 'se puede',
  'должен': 'debe',
  'должн': 'debe',
  'будет': 'será',
  'был': 'era',
  'была': 'era',
  'были': 'eran',
  'есть': 'hay',
  'нет': 'no hay',
  'или': 'o',
  'и ': 'y ',
  'а ': 'pero ',
  'но ': 'pero ',
  'не ': 'no ',
  'ни ': 'ni ',
  'из ': 'de ',
  'в ': 'en ',
  'на ': 'en ',
  'к ': 'a ',
  'с ': 'con ',
  'по ': 'por ',
  'за ': 'por ',
  'от ': 'de ',
  'до ': 'hasta ',
};

css = css.replace(/\/\*[\s\S]*?\*\//g, (comment) => {
  if (!/[а-яА-ЯёЁ]/.test(comment)) return comment;
  let inner = comment.slice(2, -2);
  const keys = Object.keys(phrases).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (inner.includes(k)) inner = inner.split(k).join(phrases[k]);
  }
  return '/*' + inner + '*/';
});

// Remove any remaining Cyrillic in comments (dev notes)
css = css.replace(/\/\*[\s\S]*?\*\//g, (comment) => {
  if (!/[а-яА-ЯёЁ]/.test(comment)) return comment;
  return '/* nota de estilos */';
});

fs.writeFileSync('app.css', css, 'utf8');
console.log('CSS Cyrillic left:', (css.match(/[а-яА-ЯёЁ]/g) || []).length);
