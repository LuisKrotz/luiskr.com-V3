/**
 * @file menu-background-theme.ts — ink sampling for the menu background:
 * reads --menu-ink / --menu-ink-2 from the document root each open and
 * records the theme so the frame loop can detect a mid-animation flip.
 */

import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { MENU_CSS_PROPS } from '@/core/tokens/css/menu.js'
import type { MenuBackgroundWebGL } from '../menu-background-webgl.js'

/**
 * Reads the --menu-ink / --menu-ink-2 custom properties from the
 * document root and converts them into shader ink colors. Missing or
 * unparseable tokens fall back to white-on-dark / black-on-light.
 * _darkAtStart records the theme so _renderFrame can detect a flip.
 */
export function sampleTheme(host: MenuBackgroundWebGL): void {
  const isDark = document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)

  let parsed: number[] | null
  let parsed2: number[] | null

  try {
    const style = getComputedStyle(document.documentElement)

    parsed = host._parseCssColor(style.getPropertyValue(MENU_CSS_PROPS.MENU_INK))
    parsed2 = host._parseCssColor(style.getPropertyValue(MENU_CSS_PROPS.MENU_INK_2))
  } catch {
    parsed = parsed2 = null
  }

  host._color = parsed || (isDark ? [1, 1, 1] : [0, 0, 0])
  host._color2 = parsed2 || host._color

  host._darkAtStart = isDark
}
