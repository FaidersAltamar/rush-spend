// Translate only block comments in app.css
const fs = require('fs');
let css = fs.readFileSync('app.css', 'utf8');

const map = {
  'палитра из брендбука ADStip (§8)': 'paleta del manual de marca ADStip (§8)',
  'НИ max-height, НИ overflow здесь быть не должно.': 'NO debe haber max-height NI overflow aquí.',
  'position: sticky живёт только в пределах СВОЕГО контейнера, а контейнер\n     шапки, вкладок и пульта статистики - это body. Пока у body стояла высота\n     600px, липкие элементы держались ровно до конца этой коробки: прокрутил\n     ниже - и шапка уехала вверх вместе с концом body. Выглядело это как\n     «на определённом месте прокрутки шапка исчезает».\n     Окно попапа Chrome и так ограничено 600px по высоте и само даёт\n     прокрутку - ограничивать body второй раз незачем.':
    'position: sticky solo vive dentro de SU contenedor; el contenedor de la cabecera, pestañas y panel de estadísticas es el body. Mientras el body tenía 600px de alto, los elementos fijos se mantenían hasta el final de esa caja: al desplazarse, la cabecera subía con el final del body. Parecía que «en cierto punto del scroll la cabecera desaparece». La ventana popup de Chrome ya limita la altura a 600px y hace scroll; no hace falta limitar el body otra vez.',
  'открыто отдельной вкладкой — можно занять всю ширину': 'abierto en pestaña aparte: puede ocupar todo el ancho',
  'В отдельной вкладке шире и без потолка ширины попапа. Высоту и прокрутку\n   здесь не трогаем вовсе: ими распоряжается документ - см. правило body выше.':
    'En pestaña aparte es más ancho y sin límite de ancho del popup. No tocamos altura ni scroll aquí: los controla el documento (véase la regla body arriba).',
  'шапка': 'cabecera',
  'Строка объявления в шапке.': 'Línea de anuncio en la cabecera.',
  'min-width: 0 обязателен: без него длинный текст не сжимается, а РАСТАЛКИВАЕТ\n   шапку, и кнопки справа уезжают за край окна.':
    'min-width: 0 es obligatorio: sin él el texto largo no se comprime y EMPUJA la cabecera, y los botones de la derecha se salen de la ventana.',
  'Текст сжимается первым - кнопка и крестик важнее и обязаны остаться видимыми.':
    'El texto se comprime primero; el botón y la cruz son más importantes y deben seguir visibles.',
  'Домен, куда уводит кнопка. Ссылки в объявлениях не ограничены белым списком,\n   и это единственное, что показывает человеку, куда он идёт.':
    'Dominio al que lleva el botón. Los enlaces en anuncios no están limitados por lista blanca, y es lo único que muestra al usuario adónde va.',
  'Крутится СТРЕЛКА, а не сама кнопка: вращающийся квадрат читается как «экран крутится».':
    'Gira la FLECHA, no el botón: un cuadrado girando se lee como «la pantalla gira».',
};

css = css.replace(/\/\*[\s\S]*?\*\//g, (comment) => {
  let inner = comment.slice(2, -2);
  for (const [ru, es] of Object.entries(map).sort((a, b) => b[0].length - a[0].length)) {
    if (inner.includes(ru)) inner = inner.split(ru).join(es);
  }
  return '/*' + inner + '*/';
});

fs.writeFileSync('app.css', css, 'utf8');
console.log('Cyrillic left:', (css.match(/[а-яА-ЯёЁ]/g) || []).length);
