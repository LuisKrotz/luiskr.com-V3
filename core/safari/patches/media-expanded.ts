/**
 * @file safari/patches/media-expanded.ts
 * @description MediaExpanded patch: explicit touchend close on every close target
 * (click is unreliable on iOS) plus muted playsinline autoplay for
 * expanded videos and direct full-res img src assignment.
 */

import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { EXPAND_MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { MOUSE_EVENTS, TOUCH_EVENTS } from '@core/tokens/events/dom.js'
import type { PatchableCtor, SafariPatchableEl } from '../types.js'

/**
 * Installs the MediaExpanded patch once the element registers: wraps
 * `onMounted` to (a) bind click + touchend on every close target —
 * iOS click synthesis on fixed overlays is unreliable, so touchend with
 * preventDefault drives the close directly — (b) assign the full-res
 * `src` straight onto the expanded img (no lazy ladder inside the modal),
 * and (c) force expanded videos muted/playsinline + play() so autoplay
 * survives Safari's gesture policy.
 */
export function patchMediaExpanded(): void {
  // ── MediaExpanded (Full-res image & touch close for Safari) ─────────────────
  customElements.whenDefined(COMPONENT_TAGS.MEDIA_EXPANDED).then(() => {
    const MediaExpandedClass = customElements.get(COMPONENT_TAGS.MEDIA_EXPANDED) as
      PatchableCtor | undefined

    if (!MediaExpandedClass) return

    const originalExpandedMounted = MediaExpandedClass.prototype.onMounted

    MediaExpandedClass.prototype.onMounted = function (this: SafariPatchableEl) {
      originalExpandedMounted?.call(this)

      const closeBtns = this.$$(
        `.${EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSE_BAR_BUTTON}, .${EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSE_BOTTOM}, .${EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSE_AREA}`
      )

      closeBtns.forEach((btn) => {
        const handleClose = (e: Event) => {
          if (e && e.type === TOUCH_EVENTS.TOUCHEND) {
            e.preventDefault()

            e.stopPropagation()
          }

          this.startClose?.()
        }

        this.addScopedListener(btn, MOUSE_EVENTS.CLICK, handleClose)

        this.addScopedListener(btn, TOUCH_EVENTS.TOUCHEND, handleClose, { passive: false })
      })

      if (!this.isVideo && this.source) {
        const imgEl = this.$(
          `.${EXPAND_MODAL_CLASSES.EXPAND_MODAL_MEDIA_ITEM}`
        ) as HTMLImageElement | null

        if (imgEl) {
          imgEl.src = this.source
        }
      } else if (this.isVideo) {
        const vid = this.$(HTML_TAGS.VIDEO) as HTMLVideoElement | null

        if (vid) {
          vid.defaultMuted = true

          vid.muted = true

          vid.setAttribute(MEDIA_ATTRS.MUTED, ATTR_VALUES.EMPTY)

          vid.setAttribute(MEDIA_ATTRS.PLAYSINLINE, ATTR_VALUES.EMPTY)

          vid.setAttribute(MEDIA_ATTRS.WEBKIT_PLAYSINLINE, ATTR_VALUES.EMPTY)

          vid.play().catch(() => {})
        }
      }
    }
  })
}
