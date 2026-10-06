/**
 * @file tokens/routes.js
 * @description Routing tokens — URL path segments, route names, localized
 * title prefixes, Firebase translation keys and legacy slug aliases.
 * Decomposed into per-domain group objects under `tokens/routes/`; import a
 * group directly for tree-shaking.
 */

export * from './routes/paths.js'
export * from './routes/aliases.js'
export * from './routes/names.js'
export * from './routes/translation-keys.js'

// ─── Application constants ────────────────────────────────────────────────────
/**
 * The BASE_TITLE constant.
 */
export const BASE_TITLE = 'Luis Krötz'

// ─── Path constants ───────────────────────────────────────────────────
// URL path segments and Firebase path suffixes — never inline in components.
