/**
 * @file tokens/data.js
 * @description Data-layer tokens — translation lookup paths (UI_KEYS,
 * COMPONENT_KEYS), CMS/Firebase node keys, localStorage keys, the WASM
 * worker action registry and toast severity levels. Decomposed into
 * per-domain group objects under `tokens/data/`; import a group directly
 * for tree-shaking.
 */
/* istanbul ignore file */

export * from './data/ui-keys.js'
export * from './data/component-keys.js'
export * from './data/cms-keys.js'
export * from './data/storage.js'
export * from './data/wasm.js'
export * from './data/notify.js'

// ─── UI copy keys (dotted paths into translations/<locale>/APP) ───────────────
