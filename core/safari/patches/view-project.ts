/**
 * @file safari/patches/view-project.ts
 * @description ViewProject patch: manual modal positioning — iOS doesn't layer
 * <dialog> correctly inside shadow DOM, so the expand dialog is lifted
 * into document.body and styled fixed/100dvh by hand; onDestroy reaps
 * orphaned dialogs.
 */

import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { THEME_CSS_PROPS } from '@core/tokens/css/theme.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { VENDOR_STRINGS } from '@core/tokens/strings/vendor.js'
import store from '@core/store.js'
import type { PatchableCtor, SafariPatchableEl } from '../types.js'
import { GENERIC_DIMENSIONS } from '@core/tokens/media/dimensions.js'

/**
 * Installs the view-project Safari patch once the element registers:
 * replaces `_updateModalDOM` with the lifted-dialog variant and wraps
 * `onDestroy` so a modal lifted into document.body is reaped when the
 * view unmounts (otherwise it orphans on top of the next page).
 */
export function patchViewProject(): void {
  // ── ViewProject (Modal Open/Close in ShadowRoot for Safari) ─────────────────
  customElements.whenDefined(VIEW_TAGS.VIEW_PROJECT).then(() => {
    const ViewProjectClass = customElements.get(VIEW_TAGS.VIEW_PROJECT) as PatchableCtor | undefined

    if (!ViewProjectClass) return

    // iOS can't reliably layer <dialog> inside shadow DOM — the native
    // top-layer breaks under WebKit's compositing. This override lifts the
    // dialog into document.body and hand-styles it as a fixed fullscreen
    // overlay (100dvh covers the dynamic-toolbar viewport; zIndex 999999
    // outranks every stacked context the app creates).
    ViewProjectClass.prototype._updateModalDOM = function (this: SafariPatchableEl) {
      const modal = store.getters.getModal()

      const above = (this.$(`dialog.${MODAL_CLASSES.MODAL_ABOVE}`) ||
        this.$(`.${MODAL_CLASSES.MODAL_ABOVE}`) ||
        document.querySelector(`dialog.${MODAL_CLASSES.MODAL_ABOVE}`) ||
        document.querySelector(`.${MODAL_CLASSES.MODAL_ABOVE}`)) as HTMLDialogElement | null

      const below = this.$(`.${MODAL_CLASSES.MODAL_BELOW}`)

      if (modal?.open) {
        if (below) {
          below.style.transform = `translateY(-${modal.transform || 0}${CHAR_STRINGS.PX})`
        }

        if (above) {
          if (!document.body.contains(above)) {
            document.body.appendChild(above)
          }

          above.style.position = STATE_STRINGS.FIXED

          above.style.inset = CHAR_STRINGS.ZERO

          above.style.top = CHAR_STRINGS.ZERO

          above.style.left = CHAR_STRINGS.ZERO

          above.style.width = CHAR_STRINGS.VW_100

          above.style.height = CHAR_STRINGS.VH_100

          // dvh assigned after vh so older WebKit keeps the vh fallback
          // while modern Safari uses the dynamic-toolbar-aware unit.
          above.style.height = CHAR_STRINGS.DVH_100

          // Intentionally a literal: must outrank the SCSS z-scale's top
          // ($z-top = 9999) since the lifted dialog lives in document.body
          // outside shadow-root stacking confinement.
          above.style.zIndex = '999999'

          above.style.display = STATE_STRINGS.BLOCK

          above.style.background = `var(${THEME_CSS_PROPS.BG_DARK})`

          above.style.overflowY = STATE_STRINGS.AUTO

          above.style.setProperty(
            VENDOR_STRINGS.WEBKIT_OVERFLOW_SCROLLING,
            VENDOR_STRINGS.OVERFLOW_TOUCH
          )

          above.style.margin = CHAR_STRINGS.ZERO

          above.style.padding = CHAR_STRINGS.ZERO

          above.style.border = ATTR_VALUES.NONE

          above.setAttribute(COMMON_ATTRS.OPEN, ATTR_VALUES.EMPTY)

          above.open = true

          const existing = above.querySelector(COMPONENT_TAGS.MEDIA_EXPANDED)

          const src = modal.media?.source || ATTR_VALUES.EMPTY

          if (!existing || existing.getAttribute(MEDIA_ATTRS.SOURCE) !== src) {
            const expandedEl = document.createElement(COMPONENT_TAGS.MEDIA_EXPANDED)

            expandedEl.setAttribute(MEDIA_ATTRS.SOURCE, modal.media?.source || ATTR_VALUES.EMPTY)

            expandedEl.setAttribute(MEDIA_ATTRS.THUMB, modal.media?.thumb || ATTR_VALUES.EMPTY)

            expandedEl.setAttribute(MEDIA_ATTRS.ALT, modal.media?.alt || ATTR_VALUES.EMPTY)

            expandedEl.setAttribute(
              MEDIA_ATTRS.WIDTH,
              String(modal.media?.width || GENERIC_DIMENSIONS.DEFAULT_WIDTH)
            )

            expandedEl.setAttribute(
              MEDIA_ATTRS.HEIGHT,
              String(modal.media?.height || GENERIC_DIMENSIONS.DEFAULT_HEIGHT)
            )

            expandedEl.setAttribute(
              MEDIA_ATTRS.IS_VIDEO,
              modal.media?.isVideo ? ATTR_VALUES.TRUE : ATTR_VALUES.FALSE
            )

            above.replaceChildren(expandedEl)
          }
        }
      } else {
        if (below) {
          below.style.transform = ATTR_VALUES.EMPTY
        }

        if (above) {
          try {
            if (typeof above.close === TYPE_STRINGS.FUNCTION && above.open) {
              above.close()
            }
          } catch {
            // details polyfill close() may throw on detached nodes
          }

          above.removeAttribute(COMMON_ATTRS.OPEN)

          above.open = false

          above.style.display = ATTR_VALUES.NONE

          above.replaceChildren()

          if (this.shadowRoot && !this.shadowRoot.contains(above)) {
            this.shadowRoot.appendChild(above)
          }
        }
      }
    }

    const originalProjectDestroy = ViewProjectClass.prototype.onDestroy

    ViewProjectClass.prototype.onDestroy = function (this: SafariPatchableEl) {
      originalProjectDestroy?.call(this)

      const orphaned = document.body.querySelector(
        `dialog.${MODAL_CLASSES.MODAL_ABOVE}, .${MODAL_CLASSES.MODAL_ABOVE}`
      )

      if (orphaned) {
        orphaned.remove()
      }
    }
  })
}
