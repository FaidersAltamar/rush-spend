const fs = require('fs');

function escapeForQuote(text, quote) {
  if (quote === '`') return text;
  let out = text.replace(/\\/g, '\\\\');
  if (quote === '"') return out.replace(/"/g, '\\"');
  return out;
}

const ru = 'Сначала загрузите кабинеты на вкладке «Кабинеты».';
const es = 'Primero, cargue las cuentas en la pestaña "Cuentas".';
const inner = ru;
const newInner = inner.split(ru).join(escapeForQuote(es, '"'));
const code = 'const x = "' + newInner + '"; x';
console.log('code:', code);
const x = eval(code.replace('const x = "', '').replace('"; x', ''));
console.log('value:', x);
