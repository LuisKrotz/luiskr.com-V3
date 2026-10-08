/**
 * @file tokens/playground/actions.js
 * @description Toolbar/panel action names dispatched by the playground UI.
 * @type {Readonly<Record<string, string>>}
 */

/**
 * Toolbar/panel action names dispatched by the playground UI. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const SP_ACTIONS = Object.freeze({
  RESET: 'reset',
  TOGGLE_ROTATE: 'toggle-rotate',
  PANEL_TOGGLE: 'panel-toggle',
  PANEL_OPEN: 'panel-open',
  SCREENSHOT: 'screenshot',
  COPY_CONSTANTS: 'copy-constants',
  TOGGLE_MUSIC: 'toggle-music',
})
