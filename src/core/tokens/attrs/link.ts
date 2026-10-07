/**
 * @file tokens/attrs/link.js
 * @description Anchor/link attribute tokens — token group. The `href`
 * token is also the predictive-loader's route source (see
 * predictive-loader.ts — it reads `getAttribute(HREF)` before falling
 * back to `data-route`).
 */

export const LINK_ATTRS = Object.freeze({
  /** `href` — link target; read by predictive-loader and link builders. */
  HREF: 'href',
  /** `target` — browsing context (`_blank` for external links). */
  TARGET: 'target',
  /** `rel` — link relationship (`noopener`/`noreferrer` on external links per MDN: window.opener exposure otherwise). */
  REL: 'rel',
})
