#!/usr/bin/env python3
"""
restore-and-patch-translations.py
Reads database.json (the authoritative local backup), merges ALL new missing
translation keys (devTools, closeLabel, carousel, statsHud) into it, then
writes translations-full.json — a complete /translations node ready for
`firebase database:set /translations translations-full.json`.
"""
import json
import copy

# ── New keys to add / update ──────────────────────────────────────────────────
NEW_KEYS = {
    'en': {
        'closeLabel': 'Close preferences',
        'devTools': {
            'title': 'Developer Tools',
            'statsForNerds': 'Stats for Nerds',
            'statsForNerdsDesc': 'Live FPS, network, memory HUD — bottom-right corner',
            'showGrid': 'Show Grid',
            'showGridDesc': 'Overlay columns, gutters and max-area at every breakpoint',
            'reducedMotion': 'Reduced Motion',
            'reducedMotionDesc': 'Disable animations and transitions',
        },
        'carousel': {'prev': 'Previous item', 'next': 'Next item', 'ofLabel': 'of'},
        'statsHud': {
            'title': 'Performance', 'fps': 'FPS', 'cpu': 'CPU',
            'memory': 'Memory', 'network': 'Network', 'latency': 'Latency', 'gpu': 'GPU',
        },
    },
    'br': {
        'closeLabel': 'Fechar preferências',
        'devTools': {
            'title': 'Ferramentas de Dev',
            'statsForNerds': 'Stats para Nerds',
            'statsForNerdsDesc': 'HUD de FPS, rede e memória — canto inferior direito',
            'showGrid': 'Mostrar Grade',
            'showGridDesc': 'Sobrepor colunas, calhas e área máxima em cada breakpoint',
            'reducedMotion': 'Movimento Reduzido',
            'reducedMotionDesc': 'Desativar animações e transições',
        },
        'carousel': {'prev': 'Item anterior', 'next': 'Próximo item', 'ofLabel': 'de'},
        'statsHud': {
            'title': 'Desempenho', 'fps': 'FPS', 'cpu': 'CPU',
            'memory': 'Memória', 'network': 'Rede', 'latency': 'Latência', 'gpu': 'GPU',
        },
    },
    'es': {
        'closeLabel': 'Cerrar preferencias',
        'devTools': {
            'title': 'Herramientas de Dev',
            'statsForNerds': 'Stats para Nerds',
            'statsForNerdsDesc': 'HUD de FPS, red y memoria — esquina inferior derecha',
            'showGrid': 'Mostrar Cuadrícula',
            'showGridDesc': 'Superponer columnas, márgenes y área máx en cada breakpoint',
            'reducedMotion': 'Movimiento Reducido',
            'reducedMotionDesc': 'Desactivar animaciones y transiciones',
        },
        'carousel': {'prev': 'Elemento anterior', 'next': 'Elemento siguiente', 'ofLabel': 'de'},
        'statsHud': {
            'title': 'Rendimiento', 'fps': 'FPS', 'cpu': 'CPU',
            'memory': 'Memoria', 'network': 'Red', 'latency': 'Latencia', 'gpu': 'GPU',
        },
    },
    'de': {
        'closeLabel': 'Einstellungen schließen',
        'devTools': {
            'title': 'Entwicklerwerkzeuge',
            'statsForNerds': 'Stats für Nerds',
            'statsForNerdsDesc': 'Live FPS, Netzwerk, RAM HUD — unten rechts',
            'showGrid': 'Raster anzeigen',
            'showGridDesc': 'Spalten, Abstände und Max-Bereich einblenden',
            'reducedMotion': 'Reduzierte Bewegung',
            'reducedMotionDesc': 'Animationen und Übergänge deaktivieren',
        },
        'carousel': {'prev': 'Vorheriges Element', 'next': 'Nächstes Element', 'ofLabel': 'von'},
        'statsHud': {
            'title': 'Leistung', 'fps': 'FPS', 'cpu': 'CPU',
            'memory': 'RAM', 'network': 'Netzwerk', 'latency': 'Latenz', 'gpu': 'GPU',
        },
    },
    'it': {
        'closeLabel': 'Chiudi preferenze',
        'devTools': {
            'title': 'Strumenti Dev',
            'statsForNerds': 'Stats per Nerd',
            'statsForNerdsDesc': 'HUD FPS, rete e memoria — angolo in basso a destra',
            'showGrid': 'Mostra griglia',
            'showGridDesc': 'Sovrapponi colonne, margini e area max ad ogni breakpoint',
            'reducedMotion': 'Movimento ridotto',
            'reducedMotionDesc': 'Disabilita animazioni e transizioni',
        },
        'carousel': {'prev': 'Elemento precedente', 'next': 'Elemento successivo', 'ofLabel': 'di'},
        'statsHud': {
            'title': 'Prestazioni', 'fps': 'FPS', 'cpu': 'CPU',
            'memory': 'Memoria', 'network': 'Rete', 'latency': 'Latenza', 'gpu': 'GPU',
        },
    },
    'fr': {
        'closeLabel': 'Fermer les préférences',
        'devTools': {
            'title': 'Outils Développeur',
            'statsForNerds': 'Stats pour Nerds',
            'statsForNerdsDesc': 'HUD FPS, réseau et mémoire — coin inférieur droit',
            'showGrid': 'Afficher la grille',
            'showGridDesc': 'Superposer colonnes, gouttières et zone max à chaque breakpoint',
            'reducedMotion': 'Mouvement réduit',
            'reducedMotionDesc': 'Désactiver les animations et transitions',
        },
        'carousel': {'prev': 'Élément précédent', 'next': 'Élément suivant', 'ofLabel': 'sur'},
        'statsHud': {
            'title': 'Performances', 'fps': 'FPS', 'cpu': 'CPU',
            'memory': 'Mémoire', 'network': 'Réseau', 'latency': 'Latence', 'gpu': 'GPU',
        },
    },
    'ru': {
        'closeLabel': 'Закрыть настройки',
        'devTools': {
            'title': 'Инструменты разработчика',
            'statsForNerds': 'Статистика для гиков',
            'statsForNerdsDesc': 'HUD с FPS, сетью и памятью — правый нижний угол',
            'showGrid': 'Показать сетку',
            'showGridDesc': 'Наложение колонок, отступов и макс. области',
            'reducedMotion': 'Уменьшить движение',
            'reducedMotionDesc': 'Отключить анимации и переходы',
        },
        'carousel': {'prev': 'Предыдущий', 'next': 'Следующий', 'ofLabel': 'из'},
        'statsHud': {
            'title': 'Производительность', 'fps': 'FPS', 'cpu': 'CPU',
            'memory': 'Память', 'network': 'Сеть', 'latency': 'Задержка', 'gpu': 'GPU',
        },
    },
}
FALLBACK_LANGS = ['hrk', 'cas', 'riv', 'gn', 'tln']
for lang in FALLBACK_LANGS:
    NEW_KEYS[lang] = NEW_KEYS['en']

# ── Load original database backup ─────────────────────────────────────────────
with open('database.json', encoding='utf-8') as f:
    db = json.load(f)

orig_translations = db.get('translations', {})
result = copy.deepcopy(orig_translations)

# ── Deep-merge helper ─────────────────────────────────────────────────────────
def deep_merge(base, patch):
    """Recursively merge patch into base (non-destructive)."""
    out = dict(base)
    for k, v in patch.items():
        if k in out and isinstance(out[k], dict) and isinstance(v, dict):
            out[k] = deep_merge(out[k], v)
        else:
            out[k] = v
    return out

# ── Merge new keys into each locale ──────────────────────────────────────────
added = 0
for locale, new_data in NEW_KEYS.items():
    if locale not in result:
        result[locale] = {}
    if 'APP' not in result[locale]:
        result[locale]['APP'] = {}

    app = result[locale]['APP']

    # Merge pref.closeLabel and pref.devTools
    if 'pref' not in app:
        app['pref'] = {}
    app['pref']['closeLabel'] = new_data['closeLabel']
    app['pref']['devTools']   = new_data['devTools']
    added += 1 + len(new_data['devTools'])

    # Merge carousel
    if 'carousel' not in app:
        app['carousel'] = {}
    app['carousel'].update(new_data['carousel'])
    added += len(new_data['carousel'])

    # Merge statsHud
    if 'statsHud' not in app:
        app['statsHud'] = {}
    app['statsHud'].update(new_data['statsHud'])
    added += len(new_data['statsHud'])

# ── Verify en.APP.pref still has all original keys ────────────────────────────
en_pref = result.get('en', {}).get('APP', {}).get('pref', {})
required = {'title', 'done', 'appearance', 'motion', 'closeLabel', 'devTools'}
missing  = required - set(en_pref.keys())
if missing:
    print(f'⚠️  en.APP.pref still missing: {missing}')
else:
    print(f'✅ en.APP.pref has all keys: {sorted(en_pref.keys())}')

# ── Write output ─────────────────────────────────────────────────────────────
out = 'scripts/translations-full.json'
with open(out, 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f'✅ Wrote {out}: {len(result)} locales, ~{added} new leaf keys added.')
print(f'   en.APP keys: {sorted(result["en"]["APP"].keys())}')
