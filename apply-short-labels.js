/**
 * Apply remaining short label translations (literal-aware only).
 */
const fs = require('fs');
const { execSync } = require('child_process');

const merged = {
  ...JSON.parse(fs.readFileSync('es-map.json', 'utf8')),
  ...JSON.parse(fs.readFileSync('es-full-map.json', 'utf8')),
};

const labels = {
  'Опросили ${lt(o.asked,': 'Consultadas ${lt(o.asked,',
  'Сегодня': 'Hoy',
  '30 дней': '30 días',
  'Всё в $': 'Todo en $',
  'пиксель': 'píxel',
  'Пиксель': 'Píxel',
  'Периоды': 'Períodos',
  'реклама': 'publicidad',
  'Валюта': 'Moneda',
  'Баланс': 'Balance',
  '7 дней': '7 días',
  'Период': 'Período',
  'Статус': 'Estado',
  'Готово': 'Listo',
  'правил': 'reglas',
  'Лимит': 'Límite',
  'Вчера': 'Ayer',
  'дней': 'días',
  'Пол': 'Género',
  'дня': 'día',
  'Ещё': 'Más',
  'Вс': 'Dom',
  'БМ': 'BM',
  ')} с расходом за период (из ${O.rows.length}). Дальше страны берутся из памяти, пока открыто это окно: переключение APP':
    ')} con gasto en el período (de ${O.rows.length}). Luego los países se toman de la memoria mientras esta ventana esté abierta: cambiar APP',
  '}. Их можно показывать - это частая причина «кампания встала ночью». Раз чтение открыто, скорее всего откроется и':
    '}. Se pueden mostrar: es una causa frecuente de «la campaña se detuvo de noche». Si la lectura está abierta, probablemente también se abrirá la',
  ')} не ответили в основном проходе - их страны здесь нет, и суммы по странам занижены. Это не «они не лили»: про них про':
    ')} no respondieron en el paso principal: sus países no están aquí y las sumas por país son menores. No es que «no gastaron»: simplemente no se sabe de ellos',
  ')} сразу в нескольких бизнес-менеджерах - здесь они посчитаны по одному разу, поэтому итог меньше суммы по карточкам.':
    ')} a la vez en varios Business Managers: aquí se contaron una sola vez, por eso el total es menor que la suma de las tarjetas.',
  'Суммы - в валюте каждого кабинета (колонка «Divisa»). На экране они пересчитаны в ${u.display}${e.usdAuto?':
    'Las sumas están en la moneda de cada cuenta (columna «Divisa»). En pantalla se recalculan a ${u.display}${e.usdAuto?',
  'Пиксель «${a.pixelName}» (${a.pixelId}) из БМ «${a.bmName}» будет подключён к ${lt(c.length,':
    'Píxel «${a.pixelName}» (${a.pixelId}) del BM «${a.bmName}» se conectará a ${lt(c.length,',
  ')} Facebook показал НЕ ВСЕ страны (ответ не поместился в одну страницу) - их суммы неполные.':
    ')} Facebook mostró NO TODOS los países (la respuesta no cabió en una página): sus sumas están incompletas.',
  'Один и тот же объект бывает виден сразу в нескольких бизнес-менеджерах. Нашли ${lt(I,':
    'El mismo objeto puede verse a la vez en varios Business Managers. Encontramos ${lt(I,',
  'Поля приняты, но у проверенного объявления претензий нет (состояние ${n?.effective_status||':
    'Campos aceptados, pero el anuncio comprobado no tiene reclamos (estado ${n?.effective_status||',
  ')} скрыты переключателем «Ocultar bloqueadas». Снимите галочку - они вернутся.':
    ')} ocultas por el interruptor «Ocultar bloqueadas». Quite la casilla y volverán.',
  ')} из ${m.asked}. Суммы по странам занижены: молчащие кабинеты в них не вошли.':
    ')} de ${m.asked}. Las sumas por países son menores: las cuentas que no respondieron no entraron.',
  'Ни один из ответивших кабинетов не тратил за этот период. Ещё ${U} ${$e(U,':
    'Ninguna de las cuentas que respondieron gastó en este período. Aún ${U} ${$e(U,',
  'валюта кабинета, суммы сложены без пересчёта${b.present.length>1?':
    'moneda de la cuenta, sumas sin conversión${b.present.length>1?',
  'Категорию или подписчиков Facebook не отдал по ${lt(D.length,':
    'Facebook no devolvió categoría ni seguidores para ${lt(D.length,',
  '>Перехватить из сессии Facebook</button>\n        <button id=':
    '>Capturar de la sesión de Facebook</button>\n        <button id=',
  '>Capturar из sesiones de facebook</button>\n        <button id=':
    '>Capturar de la sesión de Facebook</button>\n        <button id=',
  'У кабинетов ${b.present.length} валюты (${b.present.join(':
    'Las cuentas tienen ${b.present.length} monedas (${b.present.join(',
  ')}, к которым пиксель уже подключён (показаны первые 5).':
    ')}, a los que el píxel ya está conectado (se muestran los primeros 5).',
  ' (курс дня от ${new Date(X.at).toLocaleDateString(':
    ' (tipo de cambio del día del ${new Date(X.at).toLocaleDateString(',
  ' (курс día от ${new Date(X.at).toLocaleDateString(':
    ' (tipo de cambio del día del ${new Date(X.at).toLocaleDateString(',
  'Работает: по одной кампании пришло ${lt(i.length,':
    'Funciona: llegó por campaña ${lt(i.length,',
  'Работает: по одной campañas пришло ${lt(i.length,':
    'Funciona: llegó por campaña ${lt(i.length,',
  'Отклонено объявлений: ${i.ads.length}${i.partial?':
    'Anuncios rechazados: ${i.ads.length}${i.partial?',
  'Отклонено anuncios: ${i.ads.length}${i.partial?':
    'Anuncios rechazados: ${i.ads.length}${i.partial?',
  'Готово: пиксель подключён к ${lt(a.run.total,':
    'Listo: píxel conectado a ${lt(a.run.total,',
  'Готово: пиксель conectado к ${lt(a.run.total,':
    'Listo: píxel conectado a ${lt(a.run.total,',
  'за 7 дней ${W(B.week,B)}${J?':
    'en 7 días ${W(B.week,B)}${J?',
  'за 7 dias ${W(B.week,B)}${J?':
    'en 7 días ${W(B.week,B)}${J?',
  ')} за 30 дней${r.length?':
    ')} por 30 días${r.length?',
  ')} por 30 дней${r.length?':
    ')} por 30 días${r.length?',
  ')} - пикселей в них нет.':
    ')} - no tienen píxeles.',
  ')} - píxeles в них нет.':
    ')} - no tienen píxeles.',
  'Oculto ${$} ${Ot($,': 'Oculto ${$} ${Ot($,',
  'Ocultoо ${$} ${Ot($,': 'Oculto ${$} ${Ot($,',
  'счётчика в нём нет': 'no tiene contador',
  'подходящий кабинет': 'cuenta adecuada',
  'подходящий cuenta': 'cuenta adecuada',
  ')} за неделю${o?':
    ')} por semana${o?',
  ')} por неделю${o?':
    ')} por semana${o?',
  ')} за фильтрами': ')} filtradas',
  ')} por фильтрами': ')} filtradas',
  'бизнес-менеджере': 'Business Manager',
  'бизнес-менеджер': 'Business Manager',
  'кабинет остался': 'cuenta restante',
  'cuenta остался': 'cuenta restante',
  'неизвестен': 'desconocido',
  'забаненный': 'bloqueada',
  'заbanенный': 'bloqueada',
  'включён ✓': 'activado ✓',
  'претензию': 'reclamo',
  'без кода': 'sin código',
  'страница': 'página',
  'paísesа': 'país',
  '(пусто)': '(vacío)',
  'запись': 'registro',
  'Перехватить из сессии Facebook': 'Capturar de la sesión de Facebook',
  'из sesiones de facebook': 'de la sesión de Facebook',
  'conectado к': 'conectado a',
};

function sanitizeEs(es) {
  return es.replace(/"([^"]+)"/g, '«$1»');
}

function replaceInStringLiterals(content, map) {
  const sorted = Object.keys(map)
    .filter((k) => map[k] && content.includes(k))
    .sort((a, b) => b.length - a.length);
  let applied = 0;
  const out = content.replace(
    /(`(?:\\[\s\S]|[^`\\])*`|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')/g,
    (literal) => {
      const quote = literal[0];
      let inner = literal.slice(1, -1);
      let changed = false;
      for (const ruKey of sorted) {
        if (inner.includes(ruKey)) {
          inner = inner.split(ruKey).join(sanitizeEs(map[ruKey]));
          changed = true;
          applied++;
        }
      }
      return changed ? quote + inner + quote : literal;
    }
  );
  return { out, applied };
}

let c = fs.readFileSync('app.js', 'utf8');
const before = (c.match(/[а-яА-ЯёЁ]/g) || []).length;
const { out, applied } = replaceInStringLiterals(c, labels);
c = out;

// Global for long unique strings only
const long = Object.keys(labels).filter((k) => k.length >= 40);
for (const k of long.sort((a, b) => b.length - a.length)) {
  if (c.includes(k)) c = c.split(k).join(sanitizeEs(labels[k]));
}

fs.writeFileSync('app.js', c, 'utf8');
const after = (c.match(/[а-яА-ЯёЁ]/g) || []).length;
console.log('Applied:', applied);
console.log('Cyrillic before:', before, 'after:', after);
try {
  execSync('node --check app.js', { stdio: 'pipe' });
  console.log('Syntax: OK');
} catch (e) {
  console.log('Syntax error:', String(e.stderr || e.message).slice(0, 300));
}
