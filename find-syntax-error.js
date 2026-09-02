const fs = require('fs');
const { execSync } = require('child_process');

try {
  execSync('node --check app.js', { stdio: 'pipe' });
  console.log('OK');
} catch (e) {
  const msg = String(e.stderr || e.message);
  const lineMatch = msg.match(/app\.js:(\d+)/);
  if (lineMatch) {
    const line = Number(lineMatch[1]);
    const lines = fs.readFileSync('app.js', 'utf8').split('\n');
    console.log('Error line', line);
    console.log(lines[line - 1].slice(0, 500));
    console.log('...');
    console.log(lines[line - 1].slice(500, 1000));
  }
  console.log(msg.split('\n').slice(-3).join('\n'));
}
