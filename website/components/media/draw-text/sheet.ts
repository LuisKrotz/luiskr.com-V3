/**
 * @file draw-text/sheet.ts — one constructed stylesheet shared by every
 * instance (a project page mounts dozens).
 */

import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import drawTextStyles from '@core/sass/components/media/draw-text.scss?inline'

let sharedSheet: CSSStyleSheet | null = null

/**
 * Gets shared sheet.
 * @returns CSSStyleSheet | null
 */
export function getSharedSheet(): CSSStyleSheet | null {
  if (
    sharedSheet ||
    typeof CSSStyleSheet === TYPE_STRINGS.UNDEFINED ||
    !CSSStyleSheet.prototype.replaceSync
  )
    return sharedSheet

  sharedSheet = new CSSStyleSheet()

  sharedSheet.replaceSync(drawTextStyles)

  return sharedSheet
}
