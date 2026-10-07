/**
 * @file constants.js
 * @description Single source of truth for every shared constant in the
 * codebase — the enforcement mechanism behind the zero-hardcoding governance
 * rules (AGENTS.md rules 4/5). Nothing here renders anything by itself; these
 * values decide how the UI *looks* and *behaves*: which CSS class paints a
 * skeleton shimmer, which Firebase path supplies a paragraph, which suffix
 * picks a CDN thumbnail, how many pixels a swipe needs before the carousel
 * advances. Import from here — never re-declare in component files.
 *
 * This file is a barrel: every token group lives in a domain module under
 * `./tokens/` (each further decomposed into per-component group files under
 * `./tokens/<domain>/`) and is re-exported here so existing import sites
 * keep working with identical (frozen) object identities. For tree-shaking,
 * prefer importing a granular group from `@/core/tokens/<domain>/<group>.js`.
 * There are no composed mega-registries — only granular `*_CLASSES`,
 * `*_ATTRS`, `*_STRINGS`, `*_EVENTS`, `*_SELECTORS`, `*_IDS`, `*_PATHS`,
 * `*_KEYS`, `*_PARAMS`, `*_CSS_PROPS`, `*_DIMENSIONS`, … group objects.
 *
 * Export map (searchable):
 *   MEDIA / IMAGE_SIZES / LAYOUT   → CDN filename grammar + mosaic geometry
 *   CAROUSEL_* / ANIMATION_*       → motion timing shared with SCSS
 *   SKELETON_* / GPU_* / FLAG_TEXTURE → WebGL skeleton + renderer classification
 *   *_TAGS / *_CLASSES / *_ATTRS / *_IDS / *_SELECTORS → DOM vocabulary (BEM)
 *   *_STRINGS / *_TEXT / KEYS / *_EVENTS → primitives, copy, keycodes, events
 *   *_PATHS / *_URLS / ROUTE_* / TRANSLATION_KEYS / CMS_*_KEYS / *_UI_KEYS
 *                                 → routing + Firebase path grammar
 *   SPACE / BREAKPOINTS / GRID_GAP / MOSAIC_COLS → layout math (Fibonacci)
 *   SP_* / EARTH_TEXTURES / DEFAULT_SP_GUI   → Earth Playground defaults
 *   *_STORAGE_KEYS / *_CSS_PROPS / IDB_CONFIG / CACHE_CONFIG → persistence
 *   WASM_ACTIONS / *_DIMENSIONS / MEDIA_QUERIES / PREFETCH_CONFIG
 *   LOCALES (re-export) / *_MUTATIONS / BASE_HOST_STYLES (re-export)
 */
/* istanbul ignore file — pure re-export barrel: there are no statements to
   cover, and counting re-export lines would falsely penalize the gate. */

// ─── Media asset grammar + persistence ───────────────────────────────────────
export * from './tokens/media.js'

// ─── Layout math ─────────────────────────────────────────────────────────────
export * from './tokens/layout.js'

// ─── Shared composites (page sections) ───────────────────────────────────────
export { SECTIONS } from './tokens/base.js'

// ─── Motion & renderer tuning ────────────────────────────────────────────────
export * from './tokens/motion.js'

// ─── Theming ─────────────────────────────────────────────────────────────────
export * from './tokens/theme.js'

// ─── DOM vocabulary ──────────────────────────────────────────────────────────
export * from './tokens/attrs.js'
export * from './tokens/elements.js'
export * from './tokens/classes.js'
export * from './tokens/selectors.js'
export * from './tokens/ids.js'

// ─── Primitives: strings, media queries, copy, keycodes ──────────────────────
export * from './tokens/primitives.js'

// ─── Routing + Firebase path grammar ─────────────────────────────────────────
export * from './tokens/routes.js'

// ─── Playground defaults ─────────────────────────────────────────────────────
export * from './tokens/playground.js'

// ─── Data layer: translation keys, CMS keys, storage, WASM actions ───────────
export * from './tokens/data.js'

// ─── CSS custom properties set/read from JS ──────────────────────────────────
export * from './tokens/css.js'

// ─── Events & store mutations ────────────────────────────────────────────────
export * from './tokens/events.js'

// ─── Locales & base host styles (pre-existing token modules) ─────────────────
export { LOCALES } from './tokens/locales.js'
export { BASE_HOST_STYLES } from './tokens/styles.js'
