/**
 * @file skeleton-theme.ts — palette sampling for the skeleton layer:
 * reads --skel-* / theme tokens off the host (falling back to :root)
 * into normalized shader colors.
 */

import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { SKELETON_CSS_PROPS } from '@/core/tokens/css/skeleton.js'
import { THEME_CSS_PROPS } from '@/core/tokens/css/theme.js'
import type { SkeletonWebGL } from '../skeleton-webgl.js'
import { SKELETON_RENDER } from '@/core/tokens/motion/skeleton.js'

/**
 * Samples the skeleton palette tokens on the host as fallbacks for rects
 * whose own tokens cannot be parsed. Every candidate is a CSS custom
 * property — no literal colours live in this file.
 */
export function sampleTheme(host: SkeletonWebGL): void {
  const cs = getComputedStyle(host.host)

  const rootCs = getComputedStyle(document.documentElement)

  const read = (csObj: CSSStyleDeclaration, prop: string) =>
    host._parseCssColor(csObj.getPropertyValue(prop))

  const isDark = document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE)

  host.base =
    read(cs, SKELETON_CSS_PROPS.SKEL_BG_1) ||
    read(rootCs, SKELETON_CSS_PROPS.SKEL_BG_1) ||
    read(rootCs, THEME_CSS_PROPS.BG_SECONDARY) ||
    read(rootCs, THEME_CSS_PROPS.BORDER_COLOR) ||
    host.base

  host.ink =
    read(cs, SKELETON_CSS_PROPS.SKEL_INK) ||
    read(cs, THEME_CSS_PROPS.TEXT_PRIMARY) ||
    read(rootCs, THEME_CSS_PROPS.TEXT_PRIMARY) ||
    read(rootCs, THEME_CSS_PROPS.TEXT_SECONDARY) ||
    host.ink ||
    host.base

  host.inkAlpha = isDark ? SKELETON_RENDER.INK_ALPHA_DARK : SKELETON_RENDER.INK_ALPHA_LIGHT
}
