/**
 * Polish remaining bad Spanish translations in app.js.
 */
const fs = require('fs');
const { execSync } = require('child_process');

let c = fs.readFileSync('app.js', 'utf8');

const fixes = [
  ['Cargando armarios...', 'Cargando cuentas...'],
  ['Interceptar token automáticamente cuando se abre', 'Capturar token automáticamente al abrir'],
  ['«Interceptar token»', '«Capturar token»'],
  ['Token interceptado de', 'Token capturado de'],
  ['No hay ninguna ficha.', 'No hay ningún token.'],
  ['title="Mostrar ficha"', 'title="Mostrar token"'],
  ['cuenta izquierda', 'cuenta restante'],
  ['El guión de fondo no respondió', 'El script en segundo plano no respondió'],
  ['El guión de fondo no respondió.', 'El script en segundo plano no respondió.'],
  ['Ocultar prohibido', 'Ocultar bloqueadas'],
  ['Oculto ${Z} prohibido: el interruptor «Ocultar prohibido»', 'Ocultas ${Z} bloqueadas: el interruptor «Ocultar bloqueadas»'],
  ['Todas las categorias', 'Todas las categorías'],
  [' · Dirige ${S(_.values.leads,"count")} · Precio del plomo ${S(_.values.cost_per_lead,"money")} · Regí ${S(_.values.registrations,"count")}',
    ' · Leads ${S(_.values.leads,"count")} · Precio por lead ${S(_.values.cost_per_lead,"money")} · Registros ${S(_.values.registrations,"count")}'],
  ['${_.meta.failed} cab. no respondieron', '${_.meta.failed} cuentas no respondieron'],
  ['Algunos cursos no están establecidos', 'Faltan algunos tipos de cambio'],
  ['Establecer cursos', 'Establecer tipos de cambio'],
  ['Enviado: ${u} ok', 'Enviado: ${u} correctos'],
  ['sesiones de facebook', 'sesión de Facebook'],
  ['«Prohibido»', '«Bloqueada»'],
  ['con un problema', 'con incidencia'],
  ['en el archivo', 'archivada'],
  ['Las campañas están activas.', 'Campañas activas'],
  ['insertado manualmente', 'introducido manualmente'],
  ['no disponsible', 'no disponible'],
  ['no disponsible', 'no disponible'],
  ['diferencial para los días', 'gasto para los días'],
  ['Oculto ${Z} prohibido: el interruptor «Ocultar bloqueadas» está activado', 'Ocultas ${Z} bloqueadas: el interruptor «Ocultar bloqueadas» está activado'],
  ['ningún diferencial para los días', 'ningún gasto para los días'],
  // Stats column labels
  ['label:"Dirige",short:"Dirige"', 'label:"Leads",short:"Leads"'],
  ['label:"Precio del plomo",short:"Precio del plomo"', 'label:"Precio por lead",short:"Precio por lead"'],
  ['label:"Registro",short:"Regí"', 'label:"Registros",short:"Regis"'],
  ['label:"Precio de inscripción",short:"precio real"', 'label:"Precio de registro",short:"Precio reg."'],
  ['label:"Configuración de la aplicación"', 'label:"Instalaciones de app"'],
  ['label:"Cheque de depósito promedio"', 'label:"Ticket medio de depósito"'],
  ['{k:"leads",label:"Dirige"', '{k:"leads",label:"Leads"'],
  // Pixel event labels
  ['{key:"Lead",label:"Dirigir"}', '{key:"Lead",label:"Lead"}'],
  ['{key:"InitiateCheckout",label:"Inicio del pago"}', '{key:"InitiateCheckout",label:"Inicio de pago"}'],
  ['{key:"AddToCart",label:"Cesta"}', '{key:"AddToCart",label:"Carrito"}'],
  // Banned / hidden accounts
  ['Ot($,"bloqueada cuenta","cuenta prohibido","cuentas prohibidas")', 'Ot($,"cuenta bloqueada","cuentas bloqueadas","cuentas bloqueadas")'],
  ['$e(Z,"bloqueada","prohibido","prohibido")', '$e(Z,"bloqueada","bloqueadas","bloqueadas")'],
  ['`prohibido ${tt}`', '`bloqueadas ${tt}`'],
  ['con un hechizo hoy', 'con gasto hoy'],
  ['["Oculto prohibido"', '["Ocultas bloqueadas"'],
  ['(prohibido de forma oculta:', '(ocultas bloqueadas:'],
  ['no se incluirá archivada)', 'no se incluirán en el total)'],
  // Token masking
  ['/<ficha>/g', '/<token>/g'],
  ['"ninguna razón dada"', '"sin motivo indicado"'],
  ['las fichas de cero', 'los ceros'],
  // Spend / ROAS wording
  ['el diferencial se toma de todos', 'el gasto se toma de todos'],
  ['para todo el diferencial', 'para todo el gasto'],
  ['${b.fee}%: el diferencial y todo', '${b.fee}%: el gasto y todo'],
  // Misc UI
  ['`Cable ${b.length}`', '`${b.length} cuentas`'],
  ['Primero necesitas un token: interceptarlo', 'Primero necesita un token: captúrelo'],
  ['No se pudo interceptar el token', 'No se pudo capturar el token'],
  ['en el fichero y no estaban incluidos', 'en el archivo y no estaban incluidos'],
  ['["¿Por qué no están archivada?"', '["¿Por qué no están en el archivo?"'],
  ['Ot(E,"cuenta restante","cuenta restante","cuentas restantes")', 'Ot(E,"cuenta restante","cuentas restantes","cuentas restantes")'],
  // Remaining ficha/token and stats labels
  ['g,"<ficha>"', 'g,"<token>"'],
  ['No contiene fichas.', 'No contiene tokens.'],
  ['Necesito una ficha', 'Necesito un token'],
  ['`Cable ${m.meta.noData} sin datos', '`${m.meta.noData} cuentas sin datos'],
  ['c==="pwa"?"Depósitos":"Regí"', 'c==="pwa"?"Depósitos":"Registros"'],
  ['c==="pwa"?"Precio de depósito":"precio real"', 'c==="pwa"?"Precio de depósito":"Precio reg."'],
  // RUSH branding
  ['ADStip Spend', 'RUSH Spend'],
  ['Consejos. Herramientas. Tráfico.', 'Comunidad · Escuela · Tráfico.'],
  ['adstip-stats-', 'rush-stats-'],
  ['adstip-spend-', 'rush-spend-'],
  ['#0050f0","#1fa85c', '#FFE600","#1fa85c'],
  ['#F97316","#1fa85c', '#FFE600","#1fa85c'],
];

let applied = 0;
for (const [from, to] of fixes) {
  if (c.includes(from)) {
    c = c.split(from).join(to);
    applied++;
  }
}

fs.writeFileSync('app.js', c, 'utf8');
console.log('Polish fixes applied:', applied);
console.log('Cyrillic:', (c.match(/[а-яА-ЯёЁ]/g) || []).length);

try {
  execSync('node --check app.js', { stdio: 'pipe' });
  console.log('Syntax: OK');
} catch (e) {
  console.log('Syntax error:', String(e.stderr || e.message).slice(0, 400));
}
