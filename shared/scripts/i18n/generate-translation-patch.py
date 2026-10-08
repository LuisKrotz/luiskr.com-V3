#!/usr/bin/env python3
"""
generate-translation-patch.py
Generates translation-patch.json — a Firebase RTDB PATCH payload with all
missing keys for all 12 locales:  closeLabel, devTools.*, carousel.*, statsHud.*
Usage: python3 scripts/generate-translation-patch.py
"""
import json

# ── Per-locale translations ───────────────────────────────────────────────────
TRANSLATIONS = {
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
        'carousel': { 'prev': 'Previous item', 'next': 'Next item', 'ofLabel': 'of' },
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
        'carousel': { 'prev': 'Item anterior', 'next': 'Próximo item', 'ofLabel': 'de' },
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
        'carousel': { 'prev': 'Elemento anterior', 'next': 'Elemento siguiente', 'ofLabel': 'de' },
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
        'carousel': { 'prev': 'Vorheriges Element', 'next': 'Nächstes Element', 'ofLabel': 'von' },
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
        'carousel': { 'prev': 'Elemento precedente', 'next': 'Elemento successivo', 'ofLabel': 'di' },
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
        'carousel': { 'prev': 'Élément précédent', 'next': 'Élément suivant', 'ofLabel': 'sur' },
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
        'carousel': { 'prev': 'Предыдущий', 'next': 'Следующий', 'ofLabel': 'из' },
        'statsHud': {
            'title': 'Производительность', 'fps': 'FPS', 'cpu': 'CPU',
            'memory': 'Память', 'network': 'Сеть', 'latency': 'Задержка', 'gpu': 'GPU',
        },
    },
}

# Langs that fall back to English for these utility strings
FALLBACK_TO_EN = ['hrk', 'cas', 'riv', 'gn', 'tln']

# Build RTDB patch — Firebase database:update merges this into the existing tree
patch = {}
all_langs = {**TRANSLATIONS}
for lang in FALLBACK_TO_EN:
    all_langs[lang] = TRANSLATIONS['en']

for locale, data in all_langs.items():
    base = f'translations/{locale}/APP'
    patch[f'{base}/pref/closeLabel']              = data['closeLabel']
    for k, v in data['devTools'].items():
        patch[f'{base}/pref/devTools/{k}']        = v
    for k, v in data['carousel'].items():
        patch[f'{base}/carousel/{k}']             = v
    for k, v in data['statsHud'].items():
        patch[f'{base}/statsHud/{k}']             = v

# Firebase database:update needs the root-relative patch as a nested object
# Rebuild as nested dict for the CLI PATCH format
def set_path(d, path, val):
    keys = path.split('/')
    for k in keys[:-1]:
        d = d.setdefault(k, {})
    d[keys[-1]] = val

nested = {}
for path, val in patch.items():
    set_path(nested, path, val)

out = 'scripts/translation-patch.json'
with open(out, 'w', encoding='utf-8') as f:
    json.dump(nested, f, ensure_ascii=False, indent=2)

print(f'✅ Generated {out} with {len(patch)} key paths across {len(all_langs)} locales.')
