/**
 * @file docs/loader.ts
 * @description Boot-loader lifecycle for <view-docs> — mirrors the space
 * playground's `updateSpaceLoader`/`dismissSpaceLoader` pair with
 * docs-context stage copy. The overlay stays up until the portal reaches
 * its first usable state (manifest resolved, scene mount attempted, and
 * any in-flight file payload settled) so a broken WebGL path never leaves
 * the user stuck behind it.
 */

import { DOCS_CLASSES } from '@core/tokens/classes/docs.js'
import { ANIMATION_DURATIONS } from '@core/tokens/motion/animation.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import type { ViewDocs } from './Docs.js'

/**
 * Mirrors a docs boot stage into the loader overlay — stage message,
 * rounded percent text, and the bar's width style. The values also land
 * on the view's `_loaderMsg`/`_loaderPct` fields so a mid-boot re-render
 * (which rebuilds the shadow content) re-emits the current stage instead
 * of snapping back to the initial markup. All three nodes are
 * optional-chained so a partial loader render can't throw mid-boot.
 * @param view The ViewDocs element.
 * @param msg Stage message ('Indexing modules and reports', …).
 * @param pct Progress 0–100.
 */
export function updateDocsLoader(view: ViewDocs, msg: string, pct: number): void {
  view._loaderMsg = msg
  view._loaderPct = pct

  const loaderMsg = view.$(`.${DOCS_CLASSES.DOCS_LOADER_MSG}`)
  const loaderVal = view.$(`.${DOCS_CLASSES.DOCS_LOADER_VAL}`)
  const loaderBar = view.$(`.${DOCS_CLASSES.DOCS_LOADER_BAR_FILL}`)

  if (loaderMsg) loaderMsg.textContent = msg
  if (loaderVal) loaderVal.textContent = String(Math.round(pct))
  if (loaderBar) loaderBar.style.width = `${pct}${CHAR_STRINGS.PERCENT}`
}

/**
 * Fades the loader overlay to transparent, then removes it after the CSS
 * transition completes — removing earlier would clip the fade, removing
 * never would leave an invisible overlay intercepting pointer events.
 * @param view The ViewDocs element.
 */
export function dismissDocsLoader(view: ViewDocs): void {
  const loader = view.$<HTMLElement>(`.${DOCS_CLASSES.DOCS_LOADER}`)

  if (loader) {
    loader.style.opacity = CHAR_STRINGS.ZERO

    setTimeout(() => loader.remove(), ANIMATION_DURATIONS.LOADER_FADE_MS)
  }
}
