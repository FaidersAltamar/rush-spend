/**
 * Apply es-full-map.json to app.js (string literals only) + locale fixes.
 */
const fs = require('fs');
const { execSync } = require('child_process');

const original = fs.readFileSync('app.js', 'utf8');

function isGood(ru, es) {
  if (!es || es === ru) return false;
  if (/YOU USED ALL|MYMEMORY/i.test(es)) return false;
  if (/clase=|identificación del botón|clase div=/i.test(es)) return false;
  if (!original.includes(ru)) return false;
  return true;
}

function sanitizeEs(es) {
  return es
    .replace(/"([^"]+)"/g, '«$1»')
    .replace(/"([^"]+)"/g, '«$1»');
}

function escapeReplacement(es, quote, inner, ru) {
  const pos = inner.indexOf(ru);
  let text = sanitizeEs(es);
  const before = inner.slice(Math.max(0, pos - 8), pos);

  if (quote === '`') {
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
    .filter((k) => isGood(k, map[k]))
    .sort((a, b) => b.length - a.length);

  let applied = 0;
  const out = content.replace(
    /(`(?:\\[\s\S]|[^`\\])*`|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')/g,
    (literal) => {
      const quote = literal[0];
      let inner = literal.slice(1, -1);
      let changed = false;
      for (const ru of sorted) {
        if (inner.includes(ru)) {
          const es = escapeReplacement(map[ru], quote, inner, ru);
          inner = inner.split(ru).join(es);
          changed = true;
          applied++;
        }
      }
      return changed ? quote + inner + quote : literal;
    }
  );
  return { out, applied };
}

const map = JSON.parse(fs.readFileSync('es-full-map.json', 'utf8'));
let content = fs.readFileSync('app.js', 'utf8');

const beforeCyr = (content.match(/[а-яА-ЯёЁ]/g) || []).length;
const { out, applied } = replaceInStringLiterals(content, map);
content = out;

content = content.replace(/ru-RU/g, 'es-ES');
content = content.replace(/new Intl\.DisplayNames\(\["ru"\]/g, 'new Intl.DisplayNames(["es"]');
content = content.replace(/localeCompare\(([^,]+),\s*"ru"\)/g, 'localeCompare($1, "es")');

fs.writeFileSync('app.js', content, 'utf8');

const afterCyr = (content.match(/[а-яА-ЯёЁ]/g) || []).length;
const ru = JSON.parse(fs.readFileSync('ru-strings.json', 'utf8'));
const remaining = ru.filter((s) => content.includes(s));

console.log('Replacements in literals:', applied);
console.log('Cyrillic before:', beforeCyr, 'after:', afterCyr);
console.log('RU strings remaining:', remaining.length, '/', ru.length);

try {
  execSync('node --check app.js', { stdio: 'pipe' });
  console.log('Syntax: OK');
} catch (e) {
  console.log('Syntax error:', String(e.stderr || e.message).slice(0, 500));
}
