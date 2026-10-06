/**
 * @file @core/tokens/jsx.js
 * @description Centralized tokens and dictionaries for JSX compilation and
 * native DOM hydration — the lookup tables `h()` in ../jsx.js consults when
 * deciding whether a prop becomes an attribute, a property, a listener, or
 * a namespaced SVG node. Decomposed into per-domain group objects under
 * `tokens/jsx/`; import a group directly for tree-shaking.
 */
/* istanbul ignore file */

export * from './jsx/svg.js'
export * from './jsx/props.js'
