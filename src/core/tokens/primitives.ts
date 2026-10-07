/**
 * @file tokens/primitives.js
 * @description Primitive string tokens — typeof results, punctuation,
 * MIME types, protocol/schema strings, media queries and the small UI text
 * vocabulary (units, labels) that is not user-facing copy. Decomposed into
 * per-domain group objects under `tokens/strings/`; import a group directly
 * for tree-shaking.
 */

export * from './strings/chars.js'
export * from './strings/types.js'
export * from './strings/state.js'
export * from './strings/webgl.js'
export * from './strings/vendor.js'
export * from './strings/langs.js'
export * from './strings/routes.js'
export * from './strings/input.js'
export * from './strings/dom.js'
export * from './strings/queries.js'
export * from './strings/svg.js'
export * from './strings/net.js'
export * from './strings/schema.js'
export * from './strings/wasm.js'
export * from './strings/css.js'
export * from './strings/text.js'

// ─── Media Query Tokens ─────────────────────────────────────────────────────
/**
 * Frozen media media-query map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const MEDIA_QUERIES = Object.freeze({
  POINTER_FINE: '(pointer: fine)',
  POINTER_COARSE: '(pointer: coarse)',
  MAX_WIDTH_768: '(max-width: 768px)',
  PREFERS_COLOR_DARK: '(prefers-color-scheme: dark)',
  PREFERS_REDUCED_MOTION: '(prefers-reduced-motion: reduce)',
})

// ─── Keyboard Key Tokens ──────────────────────────────────────────────────────
/**
 * Frozen keys key map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const KEYS = Object.freeze({
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
})
