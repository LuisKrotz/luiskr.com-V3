/**
 * @file tokens/routes/aliases.js
 * @description Legacy project slug aliases — maps old URL slugs to canonical
 * project keys. Used in router and Project view.
 */

/**
 * Legacy project slug aliases. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const PROJECT_ALIASES = Object.freeze({
  'brazilian-leather': 'cicb',
  'clinica-de-desenvolvimento-nathalia-bond': 'nathalia-bond',
  'genesysinf-sageweb': 'sage',
  minimelissa: 'mini-melissa',
})
