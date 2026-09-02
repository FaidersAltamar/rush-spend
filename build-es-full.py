#!/usr/bin/env python3
"""Build es-full-map.json from ru-strings.json using Google Translate via deep-translator."""
import json
import re
import time
import sys
import os
from pathlib import Path
from deep_translator import GoogleTranslator

# Windows console UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
os.environ.setdefault('PYTHONIOENCODING', 'utf-8')

ROOT = Path(__file__).parent
DELAY = 0.35
CHUNK = 4500

translator = GoogleTranslator(source='ru', target='es')

def is_good(ru, es):
    if not es or es == ru:
        return False
    if re.search(r'YOU USED ALL|MYMEMORY', es, re.I):
        return False
    if re.search(r'sección|clase de sección|clase div=', es, re.I):
        return False
    return True

def post_process(es: str) -> str:
    t = es
    t = re.sub(r'<clase de sección=', '<section class=', t, flags=re.I)
    t = re.sub(r'</sección>', '</section>', t, flags=re.I)
    t = re.sub(r'<clase div=', '<div class=', t, flags=re.I)
    t = re.sub(r'\boficina(s)?\b', lambda m: ('Cuenta' if m.group(0)[0]=='O' else 'cuenta') + ('s' if m.group(0).endswith('s') else ''), t, flags=re.I)
    t = re.sub(r'\bgabinete(s)?\b', lambda m: ('Cuenta' if m.group(0)[0]=='G' else 'cuenta') + ('s' if m.group(0).endswith('s') else ''), t, flags=re.I)
    t = re.sub(r'\bspread\b', 'gasto', t, flags=re.I)
    t = re.sub(r'\bdesenroscar\b', 'gastar', t, flags=re.I)
    t = re.sub(r'\bpor ruso\b', 'en español', t, flags=re.I)
    t = re.sub(r'«([^»]+)»', r'"\1"', t)
    t = re.sub(r'\bpor ruso\b', 'en español', t, flags=re.I)
    t = re.sub(r'\bGabinetes\b', 'Cuentas', t)
    t = re.sub(r'\bEstadísticas\b', 'Estadística', t)
    replacements = [
        (r'\bAdministrador de eventos\b', 'Events Manager'),
        (r'\badministrador de eventos\b', 'Events Manager'),
        (r'\bAdministrador de anuncios\b', 'Ads Manager'),
        (r'\badministrador de anuncios\b', 'Ads Manager'),
        (r'\badministrador(es)? comercial(es)?\b', 'Business Manager'),
        (r'\bgerente(s)? comercial(es)?\b', 'Business Manager'),
        (r'\bGabinetes\b', 'Cuentas'),
        (r'\bgabinetes\b', 'cuentas'),
        (r'\bprohibición\b', 'ban'),
        (r'\bestado: prohibición\b', 'status:ban'),
        (r'\bPUBLICIDAD\b', 'ADVERTISE'),
        (r'\bANUNCIAR\b', 'ADVERTISE'),
        (r'\bconjunto de anuncios\b', 'ad set'),
        (r'\bgrupo de anuncios\b', 'ad set'),
        (r'\bgrupos de anuncios\b', 'ad sets'),
        (r'\bregistraciones\b', 'registros'),
        (r'\bregistración\b', 'registro'),
        (r'\bdepa\b', 'depósito'),
        (r'\bdepas\b', 'depósitos'),
    ]
    for pat, rep in replacements:
        t = re.sub(pat, rep, t, flags=re.I)
    return t

def protect_templates(text):
    placeholders = []
    def repl(m):
        key = f'__PH{len(placeholders)}__'
        placeholders.append((key, m.group(0)))
        return key
    protected = re.sub(r'\$\{[^}]+\}', repl, text)
    return protected, placeholders

def restore_templates(text, placeholders):
    for key, val in placeholders:
        text = text.replace(key, val)
    return text

def translate_one(text, attempt=0):
    protected, ph = protect_templates(text)
    try:
        # deep-translator has length limits; split if needed
        if len(protected) <= CHUNK:
            raw = translator.translate(protected)
        else:
            parts = []
            for i in range(0, len(protected), CHUNK):
                parts.append(translator.translate(protected[i:i+CHUNK]))
                time.sleep(DELAY)
            raw = ''.join(parts)
        out = post_process(restore_templates(raw, ph))
        if not is_good(text, out):
            raise ValueError('bad output')
        return out
    except Exception as e:
        if attempt < 4:
            time.sleep(3 * (attempt + 1))
            return translate_one(text, attempt + 1)
        raise e

def load_seed():
    m = {}
    es_map = ROOT / 'es-map.json'
    if es_map.exists():
        for ru, es in json.loads(es_map.read_text(encoding='utf-8')).items():
            if is_good(ru, es):
                m[ru] = post_process(es)
    full = ROOT / 'es-full-map.json'
    if full.exists():
        for ru, es in json.loads(full.read_text(encoding='utf-8')).items():
            if is_good(ru, es):
                m[ru] = es
    return m

def apply_to_app(m):
    app_path = ROOT / 'app.js'
    content = app_path.read_text(encoding='utf-8')
    keys = sorted([k for k, v in m.items() if is_good(k, v)], key=len, reverse=True)
    applied = 0
    for k in keys:
        if k in content:
            content = content.replace(k, m[k])
            applied += 1
    content = content.replace('ru-RU', 'es-ES')
    content = re.sub(r'new Intl\.DisplayNames\(\["ru"\]', 'new Intl.DisplayNames(["es"]', content)
    content = re.sub(r'localeCompare\(([^,]+),\s*"ru"\)', r'localeCompare(\1, "es")', content)
    app_path.write_text(content, encoding='utf-8')
    cyr = len(re.findall(r'[а-яА-ЯёЁ]', content))
    return applied, cyr

def main():
    ru_list = json.loads((ROOT / 'ru-strings.json').read_text(encoding='utf-8'))
    ru_unique = list(dict.fromkeys(ru_list))
    m = load_seed()
    pending = [s for s in ru_unique if s not in m or not is_good(s, m.get(s, ''))]
    print(f'Seed: {len(m)}, pending: {len(pending)} / {len(ru_unique)}', flush=True)

    for i, s in enumerate(pending):
        if i % 20 == 0:
            preview = s[:55].replace('\n', ' ').encode('ascii', 'replace').decode('ascii')
            print(f'{i+1}/{len(pending)}: {preview}...', flush=True)
        try:
            m[s] = translate_one(s)
        except Exception as e:
            print(f'FAIL {s[:40]}: {e}', flush=True)
            m[s] = s
        if (i + 1) % 50 == 0:
            (ROOT / 'es-full-map.json').write_text(json.dumps(m, ensure_ascii=False, indent=2), encoding='utf-8')
            print('  checkpoint', flush=True)
        time.sleep(DELAY)

    for s in ru_unique:
        if s not in m:
            m[s] = s

    (ROOT / 'es-full-map.json').write_text(json.dumps(m, ensure_ascii=False, indent=2), encoding='utf-8')
    good = sum(1 for k, v in m.items() if is_good(k, v))
    print(f'Done: {len(m)} keys, {good} translated', flush=True)

    if '--apply' in sys.argv:
        applied, cyr = apply_to_app(m)
        print(f'Applied: {applied}, Cyrillic remaining: {cyr}', flush=True)

if __name__ == '__main__':
    main()
