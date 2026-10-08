/**
 * @file media/expanded-close.ts
 * @description Dismissal sequence for <media-expanded>: the class add
 * starts the CSS zoom-out, then a 320ms timeout (matching the transition
 * duration) does the teardown AFTER the animation lands — strip the
 * media slug from the URL (undo MediaFigure.openModal's deep-link),
 * close the native <dialog> (releasing the top layer + focus trap), and
 * restore the scroll position saved in modal.transform.
 */

import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { EXPAND_MODAL_CLASSES, MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { MODAL_MUTATIONS } from '@core/tokens/events/mutations.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import store from '@core/store.js'
import type { MediaExpanded } from '../MediaExpanded.js'

/**
 * Starts expanded close.
 * @param el — the element
 */
export function startExpandedClose(el: MediaExpanded): void {
  if (el.isClosing) return

  el.isClosing = true

  const content = el.$(`.${EXPAND_MODAL_CLASSES.EXPAND_MODAL_CONTENT}`)

  if (content) content.classList.add(EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSING)

  const scroll = Number(store.getters.getModal().transform) || 0

  setTimeout(() => {
    // 1. Restore URL by removing image slug
    const currentPath = window.location.pathname.replace(/\/$/, ATTR_VALUES.EMPTY)

    const segments = currentPath.split(CHAR_STRINGS.SLASH)

    const portIdx = segments.indexOf(ROUTE_PATHS.PORTFOLIO_SEGMENT)

    if (portIdx !== -1 && segments.length > portIdx + 2) {
      const basePath = segments.slice(0, portIdx + 2).join(CHAR_STRINGS.SLASH)

      window.history.replaceState({}, ATTR_VALUES.EMPTY, basePath)
    }

    // 2. Native dialog close
    const dialog =
      (el.closest(HTML_TAGS.DIALOG) as HTMLDialogElement | null) ||
      (document.querySelector(
        `${HTML_TAGS.DIALOG}.${MODAL_CLASSES.MODAL_ABOVE}`
      ) as HTMLDialogElement | null)

    if (dialog && typeof dialog.close === TYPE_STRINGS.FUNCTION && dialog.open) {
      dialog.close()
    }

    // 3. Restore document scroll position and modal state cleanly
    window.scrollTo(0, scroll)

    store.commit(MODAL_MUTATIONS.SET_MODAL, {
      transform: 0,
      class: ATTR_VALUES.EMPTY,
      open: false,
      media: {
        source: ATTR_VALUES.EMPTY,
        thumb: ATTR_VALUES.EMPTY,
        alt: ATTR_VALUES.EMPTY,
        width: 0,
        height: 0,
        isVideo: false,
      },
    })
  }, 320)
}
