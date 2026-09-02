/**
 * Restore HTML tags corrupted by naive translation of attribute names (id, class, type, etc.)
 */
const fs = require('fs');
const { execSync } = require('child_process');

let c = fs.readFileSync('app.js', 'utf8');
const before = c.length;

const fixes = [
  ['<tipo de botón=', '<button type='],
  ['<identificación del área de texto=', '<textarea id='],
  ['<identificación de entrada=', '<input id='],
  ['<identificación del intervalo="ver"</span>', '<span id="ver"></span>'],
  ['<identificación del intervalo=', '<span id='],
  ['<id de entrada=', '<input id='],
  ['<clase abarcada=', '<span class='],
  ['<id.div=', '<div id='],
  ['<etiqueta>', '<label>'],
  ['</etiqueta>', '</label>'],
  ['<seleccionar identificación=', '<select id='],
  ['<seleccionar id=', '<select id='],
  ['</seleccionar>', '</select>'],
  ['</opción>', '</option>'],
  ['<valor de opción=', '<option value='],
];

let applied = 0;
for (const [from, to] of fixes) {
  const n = c.split(from).length - 1;
  if (n) {
    c = c.split(from).join(to);
    applied += n;
  }
}

fs.writeFileSync('app.js', c, 'utf8');
console.log('HTML fixes applied:', applied);

// Verify critical selectors exist
const checks = [
  '#assets-q', '#pixel-note', '#changes-note', '#s-geo-state',
  '#usd-host', '#card-view-host', '#token-src', '#grab-state',
  '#refresh', '#ver', '#bn-level', '#bt-date', '#s-attn',
];
for (const sel of checks) {
  const id = sel.slice(1);
  const ok = c.includes(`id="${id}"`) || c.includes(`id='${id}'`);
  console.log(ok ? 'OK' : 'MISSING', sel);
}

try {
  execSync('node --check app.js', { stdio: 'pipe' });
  console.log('Syntax: OK');
} catch (e) {
  console.log('Syntax error:', String(e.stderr || e.message).slice(0, 400));
}
