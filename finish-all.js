/**
 * Finish translation: literal-aware map apply + manual fixes + short fragments.
 */
const fs = require('fs');
const { execSync } = require('child_process');

const esFull = JSON.parse(fs.readFileSync('es-full-map.json', 'utf8'));
const esMap = JSON.parse(fs.readFileSync('es-map.json', 'utf8'));
const ru = JSON.parse(fs.readFileSync('ru-strings.json', 'utf8'));
const merged = { ...esMap, ...esFull };

function sanitizeEs(es) {
  return es.replace(/"([^"]+)"/g, '«$1»');
}

function escapeReplacement(es, quote, inner, ruStr) {
  let text = sanitizeEs(es);
  if (quote === '`') {
    const pos = inner.indexOf(ruStr);
    const slice = inner.slice(Math.max(0, pos - 24), pos);
    if (/\\"$/.test(slice) || /textContent=\\"$/.test(slice)) {
      return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }
    if (/title=\\"$/.test(slice) || /title="$/.test(slice)) {
      return text.replace(/"/g, '&quot;');
    }
    return text.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
  }
  let out = text.replace(/\\/g, '\\\\');
  if (quote === '"') return out.replace(/"/g, '\\"');
  if (quote === "'") return out.replace(/'/g, "\\'");
  return out;
}

function replaceInStringLiterals(content, map) {
  const sorted = Object.keys(map)
    .filter((k) => map[k] && map[k] !== k && content.includes(k))
    .filter((k) => !/YOU USED ALL|MYMEMORY/i.test(map[k]))
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
          const es = escapeReplacement(map[ruKey], quote, inner, ruKey);
          inner = inner.split(ruKey).join(es);
          changed = true;
          applied++;
        }
      }
      return changed ? quote + inner + quote : literal;
    }
  );
  return { out, applied };
}

// Manual translations for strings not in map or partial fragments
const manual = {
  ' Поля приняты, но у проверенного объявления претензий нет (состояние ${n?.effective_status||':
    ' Campos aceptados, pero el anuncio comprobado no tiene reclamos (estado ${n?.effective_status||',
  ' )}, порог(threshold_amount)=${l} (это минорные единицы, делятся на 100); adtrust_dsl=${s?c(':
    ' )}, umbral (threshold_amount)=${l} (unidades menores, se dividen entre 100); adtrust_dsl=${s?c(',
  ' Число ${d}: ${l}. Чтение набором («ids=») работает - десять страниц стоят один подзапрос.':
    ' Número ${d}: ${l}. La lectura por lote («ids=») funciona: diez páginas equivalen a una subconsulta.',
  ' Сбор данных включён: ${yn.filter(h=>s.fields.includes(h.key)).map(h=>h.label).join(':
    ' Recopilación de datos activada: ${yn.filter(h=>s.fields.includes(h.key)).map(h=>h.label).join(',
  ' Это отдельный запрос к Facebook: спросим ${m.length} ${$e(m.length,':
    ' Es una consulta aparte a Facebook: preguntaremos por ${m.length} ${$e(m.length,',
  ' валюта кабинета, суммы сложены без пересчёта${b.present.length>1?':
    ' moneda de la cuenta, sumas sin conversión${b.present.length>1?',
  ' Спросит Facebook про ${lt(Math.min((t.rows||[]).length,br),':
    ' Facebook consultará ${lt(Math.min((t.rows||[]).length,br),',
  ' Facebook не отдал журнал ни по одному кабинету: ${c||':
    ' Facebook no devolvió el registro de ninguna cuenta: ${c||',
  ' Facebook не отдал события ни по одному пикселю: ${u||':
    ' Facebook no devolvió eventos de ningún píxel: ${u||',
  '  · пример: HTTP ${p?.status||0} ${String(p?.text||':
    '  · ejemplo: HTTP ${p?.status||0} ${String(p?.text||',
  ' Работает: Facebook вернул ${s.length?lt(s.length,':
    ' Funciona: Facebook devolvió ${s.length?lt(s.length,',
  ' Работает: по одной кампании пришло ${lt(i.length,':
    ' Funciona: llegó por campaña ${lt(i.length,',
  ' У ${b.truncated.length} ${$e(b.truncated.length,':
    ' En ${b.truncated.length} ${$e(b.truncated.length,',
  '  (курс от ${new Date(j.at).toLocaleDateString(':
    '  (tipo de cambio del ${new Date(j.at).toLocaleDateString(',
  ' Депозит стоит ${Bt(L.values.cost_per_purchase,':
    ' El depósito cuesta ${Bt(L.values.cost_per_purchase,',
  ' Данные от ${new Date(n.at).toLocaleTimeString(':
    ' Datos de ${new Date(n.at).toLocaleTimeString(',
  ' Готово: пиксель подключён к ${lt(a.run.total,':
    ' Listo: píxel conectado a ${lt(a.run.total,',
  ' У ${m.tooMuch.length} ${$e(m.tooMuch.length,':
    ' En ${m.tooMuch.length} ${$e(m.tooMuch.length,',
  ' Потратили больше двух целевых цен (${Bt(Z,':
    ' Gastaron más del doble del precio objetivo (${Bt(Z,',
  ' Facebook не создал пиксель: ${k?.message||':
    ' Facebook no creó el píxel: ${k?.message||',
  ' }, средний чек ${Bt(L.values.avg_check,':
    ' }, ticket medio ${Bt(L.values.avg_check,',
  ' Задача ADVERTISE есть на ${lt(i.length,':
    ' La tarea ADVERTISE está en ${lt(i.length,',
  ' Работает, и прямо сейчас ${lt(s.length,':
    ' Funciona, y ahora mismo ${lt(s.length,',
  ' Ответили ${m.counted} ${$e(m.counted,':
    ' Respondieron ${m.counted} ${$e(m.counted,',
  ' Сбор данных (advanced matching): ${w?':
    ' Recopilación de datos (advanced matching): ${w?',
  ' спросить ${lt(Math.min(n.length,or),':
    ' consultar ${lt(Math.min(n.length,or),',
  ' Поля сбора на пикселе: ${y.join(':
    ' Campos de recopilación en el píxel: ${y.join(',
  ' Нет курса для ${E.missing.join(':
    ' Sin tipo de cambio para ${E.missing.join(',
  ' Источник ответил ${n?.status||':
    ' La fuente respondió ${n?.status||',
  ' Работает: видно ${lt(s.length,':
    ' Funciona: visible ${lt(s.length,',
  ' Не получилось: ${_?.message||':
    ' No se pudo: ${_?.message||',
  ' Не получилось: ${S?.message||':
    ' No se pudo: ${S?.message||',
  ' Проверит ${lt(Math.min($,yr),':
    ' Comprobará ${lt(Math.min($,yr),',
  ' Не получилось: ${o?.message||':
    ' No se pudo: ${o?.message||',
  ' Выбрано: ${lt(a.picked.size,':
    ' Seleccionado: ${lt(a.picked.size,',
  ' Отклонено ${ct}${H.partial?':
    ' Rechazado ${ct}${H.partial?',
  ' Сырьё (${r}): balance=${c(':
    ' Datos brutos (${r}): balance=${c(',
  ' Было ${Bt(tt,m.unit,S)??':
    ' Era ${Bt(tt,m.unit,S)??',
  ' Нет курса для ${X.join(':
    ' Sin tipo de cambio para ${X.join(',
  ' Объявление ${f.ad_id||':
    ' Anuncio ${f.ad_id||',
  ' , скрыто ${Z} ${$e(Z,':
    ' , oculto ${Z} ${$e(Z,',
  ' ответ ${n?.status||':
    ' respuesta ${n?.status||',
  ' за ': ' por ',
  'На паузе': 'En pausa',
  'В архиве': 'En archivo',
  'Сегодня': 'Hoy',
  'Вчера': 'Ayer',
  'Период': 'Período',
  'Периоды': 'Períodos',
  'Статус': 'Estado',
  'Готово': 'Listo',
  'Лимит': 'Límite',
  'Баланс': 'Balance',
  'Пиксель': 'Píxel',
  'пиксель': 'píxel',
  'события': 'eventos',
  'реклама': 'publicidad',
  'правил': 'reglas',
  'создание': 'creación',
  'кабинета': 'de la cuenta',
  'кабинет': 'cuenta',
  'кампании': 'campaña',
  'кампания': 'campaña',
  'страницы': 'páginas',
  'страниц': 'páginas',
  'Странице': 'Página',
  'Страниц': 'Páginas',
  'стран': 'países',
  'групп': 'grupos',
  'поста': 'publicación',
  'пост': 'publicación',
  'дня': 'día',
  'Пол': 'Género',
  'Все': 'Todos',
  'Ср': 'Mié',
  'Чт': 'Jue',
  'Сб': 'Sáb',
  'Вс': 'Dom',
  'БМ': 'BM',
};

let content = fs.readFileSync('app.js', 'utf8');
const before = (content.match(/[а-яА-ЯёЁ]/g) || []).length;

// Pass 1: literal-aware full map
let totalApplied = 0;
for (let pass = 0; pass < 3; pass++) {
  const { out, applied } = replaceInStringLiterals(content, merged);
  content = out;
  totalApplied += applied;
  if (!applied) break;
}

// Pass 2: manual long strings (literal-aware)
const { out: out2, applied: applied2 } = replaceInStringLiterals(content, manual);
content = out2;
totalApplied += applied2;

// Pass 3: remaining ru-strings via global split (long only, >= 20 chars)
const pending = ru
  .filter((s) => content.includes(s) && merged[s] && merged[s] !== s && s.length >= 20)
  .sort((a, b) => b.length - a.length);
for (const k of pending) {
  content = content.split(k).join(sanitizeEs(merged[k]));
  totalApplied++;
}

// Pass 4: short manual in literals only
const shortManual = Object.fromEntries(
  Object.entries(manual).filter(([k]) => k.length < 20)
);
const { out: out3, applied: applied3 } = replaceInStringLiterals(content, shortManual);
content = out3;
totalApplied += applied3;

// Pass 5: any remaining from merged map in literals
const { out: out4, applied: applied4 } = replaceInStringLiterals(content, merged);
content = out4;
totalApplied += applied4;

fs.writeFileSync('app.js', content, 'utf8');

const after = (content.match(/[а-яА-ЯёЁ]/g) || []).length;
const left = ru.filter((s) => content.includes(s)).length;
console.log('Applied:', totalApplied);
console.log('Cyrillic before:', before, 'after:', after);
console.log('RU strings left:', left);

try {
  execSync('node --check app.js', { stdio: 'pipe' });
  console.log('Syntax: OK');
} catch (e) {
  console.log('Syntax error:', String(e.stderr || e.message).slice(0, 500));
}
