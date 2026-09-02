const fs = require('fs');
const { execSync } = require('child_process');

let c = fs.readFileSync('app.js', 'utf8');
const fixes = [
  [
    'entre lo ya cargadoolo se ven entre lo ya cargadoolo se ven entre lo ya cargadoженного - раскройте остальные бизнес-менеджеры, чтобы найти остальные.',
    'Los duplicados solo se ven entre lo ya cargado: despliegue el resto de Business Managers para encontrar los demás.',
  ],
  [
    'y así lo indicaí lo indicaí lo indicaисывает.',
    'y así lo indica.',
  ],
  ['"неизвестно"', '"desconocido"'],
  ['c.ok?"ок"', 'c.ok?"OK"'],
  [
    'cambiar APP/PWA, categorías y moneda no vuelve a pedirов не стоит. Если Facebook ответит отказом, пауза встанет на всё расширение - вкладка «Cuentas» тоже подождёт.',
    'cambiar APP/PWA, categorías y moneda no vuelve a pedir datos. Si Facebook responde con error, la pausa afectará a toda la extensión; la pestaña «Cuentas» también esperará.',
  ],
];

let n = 0;
for (const [from, to] of fixes) {
  if (c.includes(from)) {
    c = c.split(from).join(to);
    n++;
  }
}

fs.writeFileSync('app.js', c, 'utf8');
const left = (c.match(/[а-яА-ЯёЁ]/g) || []).length;
console.log('Fixed', n, 'corruptions. Cyrillic left:', left);
try {
  execSync('node --check app.js', { stdio: 'pipe' });
  console.log('Syntax: OK');
} catch (e) {
  console.log('Syntax error:', String(e.stderr || e.message).slice(0, 300));
}

