/**
 * @file draw-text/fit.ts — opt-in fit-to-width scaling (`fit` attribute).
 *
 * Long single words in some locales (e.g. Dutch "GESELECTEERD") are wider
 * than a phone viewport at the display-title ramp size. Words render as
 * `white-space: nowrap` spans so they can never break mid-word — the only
 * way to keep them inside the column is to scale the font down.
 *
 * Mechanism:
 *   1. Clear any inline `font-size`/`letter-spacing` we previously applied
 *      so measurement always starts from the stylesheet's base ramp.
 *   2. Available width  = parentElement's content box (clientWidth minus
 *      its horizontal padding) — the host is inline-block so its own width
 *      is the overflowing content width, not the constraint.
 *   3. Constraint       = the widest `.draw-text__word` span — spaces are
 *      breakable so multi-word lines already wrap; only a single word can
 *      force horizontal overflow.
 *   4. scale = avail / widest (only applied when < 1); the scaled
 *      `font-size` + `letter-spacing` are written on the host — `:host`
 *      inherits `font`/`letter-spacing` into the shadow tree, so every
 *      word/char span shrinks together and kerning ratios are preserved.
 *
 * Refits happen on: attribute/text changes (via `_updateDom`), parent
 * resizes (ResizeObserver — orientation, window drag, grid breakpoints),
 * and `document.fonts.ready` (late webfont swaps change glyph widths).
 */

import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { DRAW_TEXT_SELECTORS } from '@core/tokens/selectors/draw-text.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import type { DrawText } from '../DrawText.js'

/**
 * Returns the parent's horizontal content-box width in px — the space the
 * title is actually allowed to occupy. Falls back to the host's own
 * clientWidth when the element has no parent (detached / test mounts).
 * @param host — the draw-text element
 * @returns available width in px, `0` when unmeasurable
 */
function availableWidth(host: DrawText): number {
  const parent = host.parentElement

  if (!parent) return host.clientWidth

  const style = getComputedStyle(parent)

  return (
    parent.clientWidth -
    parseFloat(style.paddingLeft || CHAR_STRINGS.ZERO) -
    parseFloat(style.paddingRight || CHAR_STRINGS.ZERO)
  )
}

/**
 * Returns the widest word span inside the shadow root in px. Words are
 * `inline-block` + `nowrap`, so their rect is the true overflow source —
 * the line itself wraps legally at the space tokens.
 * @param host — the draw-text element
 * @returns widest `.draw-text__word` width in px
 */
function widestWord(host: DrawText): number {
  let widest = 0

  host.shadowRoot?.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD).forEach((word) => {
    widest = Math.max(widest, word.getBoundingClientRect().width)
  })

  return widest
}

/**
 * Measures and (only when overflowing) scales the host's font size and
 * letter spacing so the widest word fits the parent's content box.
 * Clears the inline overrides first so re-measurement is always relative
 * to the stylesheet ramp. No-ops without the `fit` attribute, without a
 * measurable box, or when the text already fits.
 * @param host — the draw-text element
 */
export function fitText(host: DrawText): void {
  if (!host.hasAttribute(COMMON_ATTRS.FIT)) return

  host.style.fontSize = ATTR_VALUES.EMPTY
  host.style.letterSpacing = ATTR_VALUES.EMPTY

  const avail = availableWidth(host)

  const widest = widestWord(host)

  if (!avail || !widest || widest <= avail) return

  const scale = avail / widest

  const computed = getComputedStyle(host)

  const baseFont = parseFloat(computed.fontSize || CHAR_STRINGS.ZERO)

  // `letter-spacing: normal` parses as NaN — treat it as zero tracking.
  const baseSpacing = parseFloat(computed.letterSpacing || CHAR_STRINGS.ZERO) || 0

  if (!baseFont) return

  host.style.fontSize = `${baseFont * scale}${CHAR_STRINGS.PX}`

  if (baseSpacing) host.style.letterSpacing = `${baseSpacing * scale}${CHAR_STRINGS.PX}`
}

/**
 * Installs the fit pipeline for a fitted host: immediate measure, a
 * ResizeObserver on the parent (the sizing constraint) for breakpoint /
 * orientation changes, and a one-shot refit once webfonts finish loading
 * (late font swaps can widen the same word by several percent).
 * @param host — the draw-text element
 */
export function setupFit(host: DrawText): void {
  if (!host.hasAttribute(COMMON_ATTRS.FIT)) return

  fitText(host)

  if (typeof ResizeObserver !== TYPE_STRINGS.UNDEFINED && !host._fitObserver) {
    host._fitObserver = new ResizeObserver(() => fitText(host))

    host._fitObserver.observe(host.parentElement || host)
  }

  document.fonts?.ready.then(() => fitText(host)).catch((): void => undefined)
}

/**
 * Disconnects the fit observer and restores the stylesheet font sizing —
 * called on disconnect and when the `fit` attribute is removed.
 * @param host — the draw-text element
 */
export function teardownFit(host: DrawText): void {
  if (host._fitObserver) {
    host._fitObserver.disconnect()

    host._fitObserver = null
  }

  host.style.fontSize = ATTR_VALUES.EMPTY
  host.style.letterSpacing = ATTR_VALUES.EMPTY
}
