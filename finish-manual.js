/**
 * Final manual translations for remaining Russian fragments.
 */
const fs = require('fs');
const { execSync } = require('child_process');

function sanitizeEs(es) {
  return es.replace(/"([^"]+)"/g, '«$1»');
}

const manual = {
  // still-ru.json fragments
  'Работает: на пробном таргетинге (Бразилия, 25-45) Facebook оценил аудиторию в ${i.toLocaleString(':
    'Funciona: con segmentación de prueba (Brasil, 25-45) Facebook estimó la audiencia en ${i.toLocaleString(',
  ')}, порог(threshold_amount)=${l} (это минорные единицы, делятся на 100); adtrust_dsl=${s?c(':
    ')}, umbral (threshold_amount)=${l} (unidades menores, se dividen entre 100); adtrust_dsl=${s?c(',
  'Это отдельный запрос к Facebook: спросим ${m.length} ${$e(m.length,':
    'Es una consulta aparte a Facebook: preguntaremos por ${m.length} ${$e(m.length,',
  'Спросит Facebook про ${lt(Math.min((t.rows||[]).length,br),':
    'Facebook consultará ${lt(Math.min((t.rows||[]).length,br),',
  'Это тот же самый объект, что и в списке выше: ${s.map(i=>':
    'Es el mismo objeto que en la lista de arriba: ${s.map(i=>',
  'Считаю в долларах, но курса для ${t.stillMissing.join(':
    'Calculo en dólares, pero no hay tipo de cambio para ${t.stillMissing.join(',
  'Цифры замерены в ${new Date(O.at).toLocaleTimeString(':
    'Cifras tomadas a las ${new Date(O.at).toLocaleTimeString(',
  'Это ОДИН объект, а не ${n}: он виден сразу в ${lt(n,':
    'Es UN solo objeto, no ${n}: es visible a la vez en ${lt(n,',
  ' · пример: HTTP ${p?.status||0} ${String(p?.text||':
    ' · ejemplo: HTTP ${p?.status||0} ${String(p?.text||',
  'Работает: Facebook вернул ${s.length?lt(s.length,':
    'Funciona: Facebook devolvió ${s.length?lt(s.length,',
  'У ${b.truncated.length} ${$e(b.truncated.length,':
    'En ${b.truncated.length} ${$e(b.truncated.length,',
  ')} Посчитано в ${new Date(_).toLocaleTimeString(':
    ')} Calculado a las ${new Date(_).toLocaleTimeString(',
  ' (курс от ${new Date(j.at).toLocaleDateString(':
    ' (tipo de cambio del ${new Date(j.at).toLocaleDateString(',
  'Депозит стоит ${Bt(L.values.cost_per_purchase,':
    'El depósito cuesta ${Bt(L.values.cost_per_purchase,',
  'Данные от ${new Date(n.at).toLocaleTimeString(':
    'Datos de ${new Date(n.at).toLocaleTimeString(',
  '>Косты в трекер (Binom)</div>\n      <p class=':
    '>Costes en el tracker (Binom)</div>\n      <p class=',
  'У ${m.tooMuch.length} ${$e(m.tooMuch.length,':
    'En ${m.tooMuch.length} ${$e(m.tooMuch.length,',
  'Потратили больше двух целевых цен (${Bt(Z,':
    'Gastaron más del doble del precio objetivo (${Bt(Z,',
  'Проверено ${y.answered} из ${lt(y.asked,':
    'Comprobado ${y.answered} de ${lt(y.asked,',
  '}, средний чек ${Bt(L.values.avg_check,':
    '}, ticket medio ${Bt(L.values.avg_check,',
  'Ответили ${y.answered} из ${lt(y.asked,':
    'Respondieron ${y.answered} de ${lt(y.asked,',
  'Задача ADVERTISE есть на ${lt(i.length,':
    'La tarea ADVERTISE está en ${lt(i.length,',
  'Работает, и прямо сейчас ${lt(s.length,':
    'Funciona, y ahora mismo ${lt(s.length,',
  'Ответили ${m.counted} ${$e(m.counted,':
    'Respondieron ${m.counted} ${$e(m.counted,',
  'спросить ${lt(Math.min(n.length,or),':
    'consultar ${lt(Math.min(n.length,or),',
  'Нет курса для ${E.missing.join(':
    'Sin tipo de cambio para ${E.missing.join(',
  'Источник ответил ${n?.status||':
    'La fuente respondió ${n?.status||',
  'Работает: видно ${lt(s.length,':
    'Funciona: visible ${lt(s.length,',
  'Не получилось: ${_?.message||':
    'No se pudo: ${_?.message||',
  'Не получилось: ${S?.message||':
    'No se pudo: ${S?.message||',
  'Проверит ${lt(Math.min($,yr),':
    'Comprobará ${lt(Math.min($,yr),',
  'Не получилось: ${o?.message||':
    'No se pudo: ${o?.message||',
  'Выбрано: ${lt(a.picked.size,':
    'Seleccionado: ${lt(a.picked.size,',
  'Отклонено ${ct}${H.partial?':
    'Rechazado ${ct}${H.partial?',
  'Сырьё (${r}): balance=${c(':
    'Datos brutos (${r}): balance=${c(',
  'Открыл в фоне: ${a.name||':
    'Abierto en segundo plano: ${a.name||',
  'Было ${Bt(tt,m.unit,S)??':
    'Era ${Bt(tt,m.unit,S)??',
  'Нет курса для ${X.join(':
    'Sin tipo de cambio para ${X.join(',
  ', скрыто ${Z} ${$e(Z,':
    ', oculto ${Z} ${$e(Z,',
  'Посчитать ещё ${lt(R,':
    'Calcular ${lt(R,',
  ' - ещё ${E} ${Ot(E,':
    ' - más ${E} ${Ot(E,',
  'ответ ${n?.status||':
    'respuesta ${n?.status||',

  // Common remaining mixed strings
  ')} с расходом за период (из ${O.rows.length}). Дальше страны берутся из памяти, пока открыто это окно: переключение APP':
    ')} con gasto en el período (de ${O.rows.length}). Luego los países se toman de la memoria mientras esta ventana esté abierta: cambiar APP',
  ')}: в цифрах сверху они посчитаны ОДИН раз, поэтому итог меньше суммы по карточкам. Повторы видны только среди уже загру':
    ')}: en las cifras de arriba se contaron UNA vez, por eso el total es menor que la suma de las tarjetas. Los duplicados solo se ven entre lo ya cargado',
  ')}). Видно, с каких сайтов реально летят события - ловит рассинхрон прокладки и чужой трафик на вашем пикселе. О':
    ')}). Se ve de qué sitios llegan eventos de verdad: detecta desincronización del puente y tráfico ajeno en su píxel. V',
  'Включён переключатель «Esconder заbanенные» на вкладке «Cuentas». Доступ к ним не тронут, в Facebook ничего не менялось.':
    'Activado el interruptor «Ocultar bloqueadas» en la pestaña «Cuentas». El acceso no se ha tocado; en Facebook no cambió nada.',
  '}. Их можно показывать - это частая причина «кампания встала ночью». Раз чтение открыто, скорее всего откроется и':
    '}. Se pueden mostrar: es una causa frecuente de «la campaña se detuvo de noche». Si la lectura está abierta, probablemente también se abrirá la',
  ')} не ответили в основном проходе - их страны здесь нет, и суммы по странам занижены. Это не «они не лили»: про них про':
    ')} no respondieron en el paso principal: sus países no están aquí y las sumas por país son menores. No es que «no gastaron»: simplemente no se sabe de ellos',
  'С флагом include_inline_create Facebook отдал ${s} publicaciones. Сравнить с ответом без флага не вышло (${o.error?':
    'Con el flag include_inline_create Facebook devolvió ${s} publicaciones. No se pudo comparar con la respuesta sin flag (${o.error?',
  ')} из ${s.length}${c}. Именно у них расширение и спрашивает рекламные посты; остальные не трогает вовсе - и так и подп':
    ')} de ${s.length}${c}. Solo en ellas la extensión pide publicaciones patrocinadas; el resto no se toca en absoluto, y así lo indica',
  ')} сразу в нескольких бизнес-менеджерах - здесь они посчитаны по одному разу, поэтому итог меньше суммы по карточкам.':
    ')} a la vez en varios Business Managers: aquí se contaron una sola vez, por eso el total es menor que la suma de las tarjetas.',
  ')} Facebook отказался разбивать: слишком много данных за раз. Помогает период покороче, а не повтор.':
    ')} Facebook rechazó desglosar: demasiados datos de una vez. Ayuda un período más corto, no repetir.',
  'Работает: у ${o.length} из ${s.length} групп видна фаза (например «${i.status}»${i.conversions!==void 0?':
    'Funciona: en ${o.length} de ${s.length} grupos se ve la fase (por ejemplo «${i.status}»${i.conversions!==void 0?',
  'Суммы - в валюте каждого кабинета (колонка «Divisa»). На экране они пересчитаны в ${u.display}${e.usdAuto?':
    'Las sumas están en la moneda de cada cuenta (columna «Divisa»). En pantalla se recalculan a ${u.display}${e.usdAuto?',
  'Комиссия ${T}%: где Facebook списал 100, расширение покажет ${(100*(1+T/100)).toLocaleString(':
    'Comisión ${T}%: donde Facebook descontó 100, la extensión mostrará ${(100*(1+T/100)).toLocaleString(',
  ')} Facebook показал НЕ ВСЕ страны (ответ не поместился в одну страницу) - их суммы неполные.':
    ')} Facebook mostró NO TODOS los países (la respuesta no cabió en una página): sus sumas están incompletas.',
  'Recopilación de datos включён: ${yn.filter(h=>s.fields.includes(h.key)).map(h=>h.label).join(':
    'Recopilación de datos activada: ${yn.filter(h=>s.fields.includes(h.key)).map(h=>h.label).join(',
  ')} - ${e}. В сводке сверху он посчитан один раз, поэтому итог там меньше суммы по карточкам.':
    ')} - ${e}. En el resumen de arriba se contó una vez, por eso el total allí es menor que la suma de las tarjetas.',
  ')} - они не вошли ни в список, ни в суммы выше, ни в «Статистику», ни в выгрузку. ':
    ')} - no entraron ni en la lista, ni en las sumas de arriba, ni en «Estadística», ni en la exportación. ',
  'Píxel «${a.pixelName}» (${a.pixelId}) из BM «${a.bmName}» будет подключён к ${lt(c.length,':
    'Píxel «${a.pixelName}» (${a.pixelId}) del BM «${a.bmName}» se conectará a ${lt(c.length,',
  'Число ${d}: ${l}. Чтение набором («ids=») работает - десять страниц стоят один подзапрос.':
    'Número ${d}: ${l}. La lectura por lote («ids=») funciona: diez páginas equivalen a una subconsulta.',
  'Поля приняты, но у проверенного объявления претензий нет (состояние ${n?.effective_status||':
    'Campos aceptados, pero el anuncio comprobado no tiene reclamos (estado ${n?.effective_status||',
  'Один и тот же объект бывает виден сразу в нескольких бизнес-менеджерах. Нашли ${lt(I,':
    'El mismo objeto puede verse a la vez en varios Business Managers. Encontramos ${lt(I,',
  ' />\n          <span>Брать курс автоматически</span>\n        </label>\n        <button id=':
    ' />\n          <span>Tomar tipo de cambio automáticamente</span>\n        </label>\n        <button id=',
  ')} таргетится на то, что Facebook выпиливает. Такие связки перестанут крутиться сами.':
    ')} apunta a lo que Facebook elimina. Esas combinaciones dejarán de rotar solas.',
  'Работает: Facebook отдал разбивку по доменам за ${so} суток (${lt(i.length,':
    'Funciona: Facebook devolvió desglose por dominios en ${so} días (${lt(i.length,',
  ')} скрыты переключателем «Esconder забаненные». Снимите галочку - они вернутся.':
    ')} ocultas por el interruptor «Ocultar bloqueadas». Quite la casilla y volverán.',
  ')} из ${m.asked}. Суммы по странам занижены: молчащие кабинеты в них не вошли.':
    ')} de ${m.asked}. Las sumas por países son menores: las cuentas que no respondieron no entraron.',
  '>Перехватить токен</button>\n        </li>\n      </ol>\n      <p class=':
    '>Capturar token</button>\n        </li>\n      </ol>\n      <p class=',
  '} (adtrust_dsl приходит в ОСНОВНЫХ единицах - как есть); предоплатный=${c(':
    '} (adtrust_dsl llega en unidades PRINCIPALES, tal cual); prepago=${c(',
  'Ни один из ответивших кабинетов не тратил за этот период. Ещё ${U} ${$e(U,':
    'Ninguna de las cuentas que respondieron gastó en este período. Aún ${U} ${$e(U,',
  '>Перехватите токен из этой сессии</div>\n          <button id=':
    '>Capture el token de esta sesión</div>\n          <button id=',
  ')} из уже раскрытых на экране, за последние ${Hs} суток.':
    ')} de las ya desplegadas en pantalla, en los últimos ${Hs} días.',
  'валюта кабинета, суммы сложены без пересчёта${b.present.length>1?':
    'moneda de la cuenta, sumas sin conversión${b.present.length>1?',
  'Найдено через кабинеты: ${o.list.length}. Опрошено ${lt(o.asked,':
    'Encontrado vía cuentas: ${o.list.length}. Consultadas ${lt(o.asked,',
  'Категорию или подписчиков Facebook не отдал по ${lt(D.length,':
    'Facebook no devolvió categoría ni seguidores para ${lt(D.length,',
  ')}, к которым пиксель уже подключён (показаны первые 5).':
    ')}, a los que el píxel ya está conectado (se muestran los primeros 5).',
  'Работает: в одной кампании пришли окна ${[...i].join(':
    'Funciona: en una campaña llegaron ventanas ${[...i].join(',
  ')} не ответили - про них неизвестно, тратили они или нет.':
    ')} no respondieron: no se sabe si gastaron o no.',
  'У кабинетов ${b.present.length} валюты (${b.present.join(':
    'Las cuentas tienen ${b.present.length} monedas (${b.present.join(',
  'Facebook не отдал события ни по одному пикселю: ${u||':
    'Facebook no devolvió eventos de ningún píxel: ${u||',
  'Enviado. HTTP ${Jt.status} · ответ Binom: ${Jt.text||':
    'Enviado. HTTP ${Jt.status} · respuesta Binom: ${Jt.text||',
  'Facebook не отдал журнал ни по одному кабинету: ${c||':
    'Facebook no devolvió el registro de ninguna cuenta: ${c||',

  // fix-final safe replacements
  'Откройте Ads Manager под нужным аккаунтом': 'Abra Ads Manager con la cuenta correcta',
  'Открыть Ads Manager': 'Abrir Ads Manager',
  'Перехватить из сессии Facebook': 'Capturar de la sesión de Facebook',
  'Перехватить токен': 'Capturar token',
  'Перехватить': 'Capturar',
  'Косты в трекер (Binom)': 'Costes en el tracker (Binom)',
  'без категории': 'sin categoría',
  'Открыл в фоне': 'Abierto en segundo plano',
  ' за ': ' por ',
  'Скрыть забаненные': 'Ocultar bloqueadas',
  'Esconder заbanенные': 'Ocultar bloqueadas',
  'Esconder забаненные': 'Ocultar bloqueadas',
  '>Тест: держит ли Binom cost по ad.id без кликов</div>\n      <p class=':
    '>Prueba: si Binom mantiene el coste por ad.id sin clics</div>\n      <p class=',
  '>Отправить тестовый cost</button>\n        <button id=':
    '>Enviar coste de prueba</button>\n        <button id=',
  '>Добро пожаловать в ADStip Spend</h2>\n      <p class=':
    '>Bienvenido a ADStip Spend</h2>\n      <p class=',
  '>по умолчанию ${qt}</span>\n      </div>\n      <p class=':
    '>por defecto ${qt}</span>\n      </div>\n      <p class=',
  '>Сохранить</button>\n      </div>\n      <p class=':
    '>Guardar</button>\n      </div>\n      <p class=',
  '>Сводка</button>\n          <button type=':
    '>Resumen</button>\n          <button type=',
  '>О расширении</div>\n      <p class=':
    '>Sobre la extensión</div>\n      <p class=',
  'Сохранить': 'Guardar',
  'Сводка': 'Resumen',
  'О расширении': 'Sobre la extensión',
  'Добро пожаловать': 'Bienvenido',
  'по умолчанию': 'por defecto',
  'Отправить тестовый cost': 'Enviar coste de prueba',
  'Тест: держит ли Binom cost по ad.id без кликов': 'Prueba: si Binom mantiene el coste por ad.id sin clics',
  'К отправке: ${u} за ${o.length} ${Ot(o.length,':
    'Para enviar: ${u} por ${o.length} ${Ot(o.length,',
  'Готово: пиксель подключён к ${lt(a.run.total,':
    'Listo: píxel conectado a ${lt(a.run.total,',
  'Facebook не создал пиксель: ${k?.message||':
    'Facebook no creó el píxel: ${k?.message||',
  ')} - по одному лёгкому запросу на каждый.':
    ')} - una consulta ligera por cada uno.',
  'комментарии есть у ${lt(l.withComments,':
    'comentarios en ${lt(l.withComments,',
  '}. Глубже недели журнала нет вовсе.':
    '}. No hay registro más allá de una semana.',
  'Работает: в кабинете ${lt(s.length,':
    'Funciona: en la cuenta ${lt(s.length,',
  'Поля сбора на пикселе: ${y.join(':
    'Campos de recopilación en el píxel: ${y.join(',
  ')} из ${l.counted} посчитанных':
    ')} de ${l.counted} contados',
  'проверено ${i.got} ${Ot(i.got,':
    'comprobado ${i.got} ${Ot(i.got,',
  'за 7 дней ${W(B.week,B)}${J?':
    'en 7 días ${W(B.week,B)}${J?',
  ', конверсий ${i.conversions}':
    ', conversiones ${i.conversions}',
  'показаны все ${n} ${Ot(n,':
    'mostrados todos ${n} ${Ot(n,',
  'Отклонено объявлений: ${i.ads.length}${i.partial?':
    'Anuncios rechazados: ${i.ads.length}${i.partial?',
  'Работает: в одной строке пришли окна ${[...i].join(':
    'Funciona: en una fila llegaron ventanas ${[...i].join(',
  ' (курс дня от ${new Date(X.at).toLocaleDateString(':
    ' (tipo de cambio del día del ${new Date(X.at).toLocaleDateString(',
  'Работает: по одной кампании пришло ${lt(i.length,':
    'Funciona: llegó por campaña ${lt(i.length,',
  'С флагом include_inline_create Facebook отдал ${s} постов. Сравнить с ответом без флага не вышло (${o.error?yt(o.error):':
    'Con el flag include_inline_create Facebook devolvió ${s} publicaciones. No se pudo comparar con la respuesta sin flag (${o.error?yt(o.error):',
  'Пиксель «${a.pixelName}» (${a.pixelId}) из БМ «${a.bmName}» будет подключён к ${lt(c.length,':
    'Píxel «${a.pixelName}» (${a.pixelId}) del BM «${a.bmName}» se conectará a ${lt(c.length,',
  ')} скрыты переключателем «Ocultar bloqueadas». Снимите галочку - они вернутся.':
    ')} ocultas por el interruptor «Ocultar bloqueadas». Quite la casilla y volverán.',
  '>Перехватить из сессии Facebook</button>\n        <button id=':
    '>Capturar de la sesión de Facebook</button>\n        <button id=',
  'Отправлено. HTTP ${Jt.status} · ответ Binom: ${Jt.text||':
    'Enviado. HTTP ${Jt.status} · respuesta Binom: ${Jt.text||',
};

let c = fs.readFileSync('app.js', 'utf8');
const before = (c.match(/[а-яА-ЯёЁ]/g) || []).length;

const sorted = Object.keys(manual).sort((a, b) => b.length - a.length);
let applied = 0;
for (const k of sorted) {
  if (c.includes(k)) {
    c = c.split(k).join(sanitizeEs(manual[k]));
    applied++;
  }
}

// Fix corruption from bad "ок" -> "DE ACUERDO" replacements
const corruption = [
  ['pOKа', 'mientras'],
  ['OKно', 'ventana'],
  ['списOK', 'lista'],
  ['пOKазал', 'mostró'],
  ['пOKороче', 'más corto'],
  ['пOKазаны', 'mostrados'],
  ['тOKен', 'token'],
  ['Vкно', 'Ventana'],
  ['DE ACUERDOно', 'ventana'],
  ['DE ACUERDOазал', 'mostró'],
  ['DE ACUERDOазывать', 'mostrar'],
  ['DE ACUERDOажет', 'mostrará'],
  ['DE ACUERDOороче', 'más corto'],
  ['списDE ACUERDO', 'lista'],
  ['прDE ACUERDOладки', 'del puente'],
  ['сутDE ACUERDO', 'días'],
  ['тDE ACUERDOен', 'token'],
  ['Casarseавнить', 'Comparar'],
  ['Pisoя', 'Campos'],
  ['Jueение', 'Lectura'],
  ['rápidoы', 'publicaciones'],
  ['cuentaы', 'cuentas'],
  ['cuentaу', 'cuenta'],
  ['paginasу', 'página'],
  ['pautaе', 'campaña'],
  ['autoматически', 'automáticamente'],
  ['заbanенные', 'bloqueadas'],
  ['DE ACUERDOна', 'ventanas'],
];
for (const [from, to] of corruption) {
  if (c.includes(from)) {
    c = c.split(from).join(to);
    applied++;
  }
}

fs.writeFileSync('app.js', c, 'utf8');
const after = (c.match(/[а-яА-ЯёЁ]/g) || []).length;
const ru = require('./ru-strings.json');
const left = ru.filter((s) => c.includes(s)).length;
console.log('Applied:', applied);
console.log('Cyrillic before:', before, 'after:', after);
console.log('RU strings left:', left);

try {
  execSync('node --check app.js', { stdio: 'pipe' });
  console.log('Syntax: OK');
} catch (e) {
  console.log('Syntax error:', String(e.stderr || e.message).slice(0, 500));
}
