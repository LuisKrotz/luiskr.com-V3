/**
 * @file draw-text/dom.ts — shadow-DOM update: shared sheet adoption,
 * content wrapper, state classes, and content swap.
 */

import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { DRAW_TEXT_CLASSES } from '@core/tokens/classes/draw-text.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import drawTextStyles from '@core/sass/components/media/draw-text.scss?inline'
import type { DrawText } from '../DrawText.js'
import { renderContent } from './render.js'
import { getSharedSheet } from './sheet.js'

/** Re-renders the shadow DOM for current props. */
export function updateDom(host: DrawText): void {
  const visibleClass =
    host._isVisible && !host._hasAnimated ? DRAW_TEXT_CLASSES.DRAW_TEXT_VISIBLE : ATTR_VALUES.EMPTY

  const doneClass = host._hasAnimated ? DRAW_TEXT_CLASSES.DRAW_TEXT_DONE : ATTR_VALUES.EMPTY

  const pendingClass =
    !host._isVisible && !host._hasAnimated ? DRAW_TEXT_CLASSES.DRAW_TEXT_PENDING : ATTR_VALUES.EMPTY

  if (host.hasAttribute(ARIA_ATTRS.ARIA_LABEL)) {
    host.removeAttribute(ARIA_ATTRS.ARIA_LABEL)
  }

  if (!host._styleEl) {
    const sheet = getSharedSheet()

    if (sheet) {
      host.shadowRoot!.adoptedStyleSheets = [sheet]

      host._styleEl = sheet
    } else {
      host._styleEl = document.createElement(HTML_TAGS.STYLE)

      host._styleEl.textContent = drawTextStyles

      host.shadowRoot!.appendChild(host._styleEl)
    }
  }

  if (!host._contentEl) {
    host._contentEl = document.createElement(HTML_TAGS.SPAN)

    host.shadowRoot!.appendChild(host._contentEl)
  }

  host._contentEl.className =
    `${DRAW_TEXT_CLASSES.DRAW_TEXT} ${visibleClass} ${doneClass} ${pendingClass}`.trim()

  host._contentEl.innerHTML = renderContent(
    host.text,
    host.delay,
    host.offset,
    host._needsCharSpans
  )
}
