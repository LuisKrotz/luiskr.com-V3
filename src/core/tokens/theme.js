/**
 * @file @core/tokens/theme.js
 * @description Theme tokens, motion modes, media queries, and CSS property tokens.
 */

export const THEME = Object.freeze({
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
})

export const MOTION = Object.freeze({
  FULL: 'full',
  REDUCED: 'reduced',
})

export const MEDIA_QUERIES = Object.freeze({
  POINTER_FINE: '(pointer: fine)',
  POINTER_COARSE: '(pointer: coarse)',
  PREFERS_COLOR_DARK: '(prefers-color-scheme: dark)',
  PREFERS_REDUCED_MOTION: '(prefers-reduced-motion: reduce)',
})

export const CSS_PROPS = Object.freeze({
  CAROUSEL_ITEM_HEIGHT: '--carousel-item-height',
})
