/**
 * @file tokens/strings/css.js
 * @description CSS-token string tokens (var() references, tokenizer kinds) —
 * token group.
 */

/**
 * CSS-token string tokens (var() references, tokenizer kinds) Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const CSS_STRINGS = Object.freeze({
  CSS_VAR_PREFIX: '--',
  VAR_RADIUS_FULL: 'var(--radius-full)',
  VAR_RADIUS_2XS: 'var(--radius-2xs)',
  TOKEN_WORD: 'word',
  TOKEN_SPACE: 'space',
  TOKEN_BR: 'br',
  TOKEN_TAG: 'tag',
})
