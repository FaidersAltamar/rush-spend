/**
 * Final patches: CSV headers, plural forms, HTML typos, remaining fragments.
 */
const fs = require('fs');
const { execSync } = require('child_process');

let c = fs.readFileSync('app.js', 'utf8');
const before = (c.match(/[а-яА-ЯёЁ]/g) || []).length;

const patches = [
  [
    '["Nombre","ID","Статус","Валюта","País de la cuenta","Сегодня","Вчера","7 дней","30 дней","Лимит","Total gastado","Баланс","Método de pago","Las campañas están activas.","En pausa","con un problema","en el archivo","Categoría"]',
    '["Nombre","ID","Estado","Moneda","País de la cuenta","Hoy","Ayer","7 días","30 días","Límite","Total gastado","Balance","Método de pago","Campañas activas","En pausa","Con problema","En archivo","Categoría"]',
  ],
  ['"день","día","días"', '"día","día","días"'],
  ['Опросили ${lt(o.asked,', 'Consultadas ${lt(o.asked,'],
  ['галочкой «Всё в $»', 'casilla «Todo en $»'],
  ['</botón>', '</button>'],
  ['`Cable ${u}`', '`${u} cuentas`'],
  ['· Cable ${i}.', '· Fallo ${i}.'],
  ['Interceptar»', 'Capturar»'],
  ['«Interceptar»', '«Capturar»'],
  ['gerentes de negocios', 'Business Managers'],
  ['conectado к ', 'conectado a '],
  [')} с расходом por период (из ${O.rows.length}). Дальше países берутся из памяти, пока открыто это окно: переключение APP',
    ')} con gasto en el período (de ${O.rows.length}). Luego los países se toman de la memoria mientras esta ventana esté abierta: cambiar APP'],
  [')}: en las cifras de arriba se contaron UNA vez, por eso el total es menor que la suma de las tarjetas. Los duplicados s',
    ')}: en las cifras de arriba se contaron UNA vez, por eso el total es menor que la suma de las tarjetas. Los duplicados solo se ven entre lo ya cargado'],
  [')}). Se ve de qué sitios llegan eventos de verdad: detecta desincronización del puente y tráfico ajeno en su píxel. Vent',
    ')}). Se ve de qué sitios llegan eventos de verdad: detecta desincronización del puente y tráfico ajeno en su píxel. La ventana de Facebook es de máximo 7 días. Vent'],
  ['}. Их можно показывать - это частая причина «campaña встала ночью». Раз чтение открыто, скорее всего откроется и',
    '}. Se pueden mostrar: es una causa frecuente de «la campaña se detuvo de noche». Si la lectura está abierta, probablemente también se abrirá la'],
  [')} de ${s.length}${c}. Solo en ellas la extensión pide publicaciones patrocinadas; el resto no se toca en absoluto, y as',
    ')} de ${s.length}${c}. Solo en ellas la extensión pide publicaciones patrocinadas; el resto no se toca en absoluto, y así lo indica'],
  [')} не ответили в основном проходе - их países здесь нет, и суммы по paísм занижены. Это не «они не лили»: про них просто',
    ')} no respondieron en el paso principal: sus países no están aquí y las sumas por país son menores. No es que «no gastaron»: simplemente no se sabe de ellos'],
  [')} сразу в нескольких Business Managers - здесь они посчитаны по одному разу, поэтому итог меньше суммы по карточкам.',
    ')} a la vez en varios Business Managers: aquí se contaron una sola vez, por eso el total es menor que la suma de las tarjetas.'],
  ['Суммы - в валюте каждого cuenta (колонка «Divisa»). На экране они пересчитаны в ${u.display}${e.usdAuto?',
    'Las sumas están en la moneda de cada cuenta (columna «Divisa»). En pantalla se recalculan a ${u.display}${e.usdAuto?'],
  ['Пиксель «${a.pixelName}» (${a.pixelId}) из БМ «${a.bmName}» будет conectado a ${lt(c.length,',
    'Píxel «${a.pixelName}» (${a.pixelId}) del BM «${a.bmName}» se conectará a ${lt(c.length,'],
  [')} Facebook показал НЕ ВСЕ países (ответ не поместился в одну página) - их суммы неполные.',
    ')} Facebook mostró NO TODOS los países (la respuesta no cabió en una página): sus sumas están incompletas.'],
  ['Поля приняты, но у проверенного anuncios reclamos нет (состояние ${n?.effective_status||',
    'Campos aceptados, pero el anuncio comprobado no tiene reclamos (estado ${n?.effective_status||'],
  ['Один и тот же объект бывает виден сразу в нескольких Business Managers. Нашли ${lt(I,',
    'El mismo objeto puede verse a la vez en varios Business Managers. Encontramos ${lt(I,'],
  [')} из ${m.asked}. Суммы по paísм занижены: молчащие cuentas в них не вошли.',
    ')} de ${m.asked}. Las sumas por países son menores: las cuentas que no respondieron no entraron.'],
  ['Ни один из ответивших cuentas не тратил por этот период.',
    'Ninguna de las cuentas que respondieron gastó en este período.'],
  ['валюта cuenta, суммы сложены без пересчёта${b.present.length>1?',
    'moneda de la cuenta, sumas sin conversión${b.present.length>1?'],
  ['Категорию или suscriptores Facebook не отдал по ${lt(D.length,',
    'Facebook no devolvió categoría ni seguidores para ${lt(D.length,'],
  ['У cuentas ${b.present.length} валюты (${b.present.join(',
    'Las cuentas tienen ${b.present.length} monedas (${b.present.join('],
  [')}, к которым пиксель ya conectado (показаны первые 5).',
    ')}, a los que el píxel ya está conectado (se muestran los primeros 5).'],
  [')} por 30 дней${r.length?', ')} por 30 días${r.length?'],
  [')} - píxeles в них нет.', ')} - no tienen píxeles.'],
  [')} por неделю${o?', ')} por semana${o?'],
  [' · ${J} у cuenta', ' · ${J} en la cuenta'],
  ['без кода', 'sin código'],
  ['"Пиксель"', '"Píxel"'],
  ['"пиксель"', '"píxel"'],
  ['"Валюта"', '"Moneda"'],
  ['"Периоды"', '"Períodos"'],
  ['"Период"', '"Período"'],
  ['"Пол"', '"Género"'],
  ['"Ещё"', '"Más"'],
  ['"30 дней"', '"30 días"'],
  ['"реклама"', '"publicidad"'],
  ['"правил"', '"reglas"'],
  ['"дней"', '"días"'],
  ['"БМ"', '"BM"'],
  ['lt(I,"такой повтор","tal repetición","tales repeticiones")', 'lt(I,"tal repetición","tal repetición","tales repeticiones")'],
  ['lt(i.length,"pautaа","pauta","pauta")', 'lt(i.length,"campaña","campaña","campañas")'],
  ['lt(i.length,"событие","eventos","eventos")', 'lt(i.length,"evento","evento","eventos")'],
  [' ellos неизвестно.', ' ellos.'],
  ['} из ${i.total}', '} de ${i.total}'],
  ['Los duplicados solo se ven entre lo ya cargadoженного - раскройте остальные', 'Los duplicados solo se ven entre lo ya cargado: despliegue el resto'],
  ['abierta: cambiar APP/PWA, категорий и валюты запрос', 'abierta: cambiar APP/PWA, categorías y moneda no vuelve a pedir'],
  ['ventana de Facebook es de máximo 7 días. Ventana у Facebook - максимум 7 суток.', 'ventana de Facebook es de máximo 7 días.'],
  ['probablemente también se abrirá la Creación правил на стороне Facebook.', 'probablemente también se abrirá la creación de reglas en Facebook.'],
  ['y así lo indicaывает.', 'y así lo indica.'],
];

let applied = 0;
for (const [from, to] of patches) {
  if (c.includes(from)) {
    c = c.split(from).join(to);
    applied++;
  }
}

fs.writeFileSync('app.js', c, 'utf8');
const after = (c.match(/[а-яА-ЯёЁ]/g) || []).length;
const ru = require('./ru-strings.json');
console.log('Patches applied:', applied);
console.log('Cyrillic before:', before, 'after:', after);
console.log('RU strings left:', ru.filter((s) => c.includes(s)).length);

try {
  execSync('node --check app.js', { stdio: 'pipe' });
  console.log('Syntax: OK');
} catch (e) {
  console.log('Syntax error:', String(e.stderr || e.message).slice(0, 500));
}
