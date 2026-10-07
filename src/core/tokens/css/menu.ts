/**
 * @file tokens/css/menu.js
 * @description Menu ink CSS custom-property names — grouped subset of
 * CSS_PROPS.
 */

/**
 * Menu ink CSS custom-property names. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const MENU_CSS_PROPS = Object.freeze({
  MENU_INK: '--menu-ink',
  MENU_INK_2: '--menu-ink-2',
  // Per-item ms until the label's letters finish drawing — the item
  // underline's transition-delay keys off it.
  DRAW_MS: '--draw-ms',
})
