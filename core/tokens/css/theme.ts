/**
 * @file tokens/css/theme.js
 * @description Theme/ink CSS custom-property names — grouped subset of
 * CSS_PROPS.
 */

/**
 * Theme/ink CSS custom-property names. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const THEME_CSS_PROPS = Object.freeze({
  TEXT_PRIMARY: '--text-primary',
  BG_PRIMARY: '--bg-primary',
  BG_SECONDARY: '--bg-secondary',
  BG_DARK: '--bg-dark',
  BG_DARKER: '--bg-darker',
  TEXT_SECONDARY: '--text-secondary',
  TEXT_MUTED: '--text-muted',
  TEXT_MUTED_ON_DARK: '--text-muted-on-dark',
  MENU_BG: '--menu-bg',
  WHITE: '--white',
  BORDER_COLOR: '--border-color',
  COLOR_ACCENT: '--color-accent',
  COLOR_ACCENT_CONTRAST: '--color-accent-contrast',
  FOCUS_RING: '--focus-ring',
})
