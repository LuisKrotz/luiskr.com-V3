/**
 * @file tokens/attrs.js
 * @description HTML attribute tokens — every `data-*` attribute, ARIA role,
 * media MIME type and common attribute value used by the component layer.
 * Decomposed into per-domain group objects under `tokens/attrs/`; import a
 * group directly for tree-shaking.
 */
/* istanbul ignore file */

export * from './attrs/values.js'
export * from './attrs/aria.js'
export * from './attrs/data.js'
export * from './attrs/media.js'
export * from './attrs/form.js'
export * from './attrs/link.js'
export * from './attrs/common.js'
export * from './attrs/svg.js'
