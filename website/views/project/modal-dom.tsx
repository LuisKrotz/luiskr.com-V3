/**
 * @file project/modal-dom.tsx
 * @description Imperative expand-modal sync for <view-project>: mirrors
 * the store's modal descriptor into the shadow DOM without re-rendering
 * (a re-render would destroy every mounted carousel). Open pins the page
 * via translateY(−scrollY) so the tapped media is the genie-zoom origin;
 * close clears the transform, closes the dialog and unmounts the media.
 */

import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { h } from '@core/jsx.js'
import store from '@core/store.js'
import type { ViewProject } from './Project.js'
import { GENERIC_DIMENSIONS } from '@core/tokens/media/dimensions.js'

/** Store → DOM modal sync (open: pin page + mount media; close: restore). */
export function updateModalDOM(view: ViewProject): void {
  const modal = store.getters.getModal()

  const above: HTMLDialogElement | null =
    view.$<HTMLDialogElement>(`dialog.${MODAL_CLASSES.MODAL_ABOVE}`) ||
    view.$<HTMLDialogElement>(`.${MODAL_CLASSES.MODAL_ABOVE}`)

  const below = view.$(`.${MODAL_CLASSES.MODAL_BELOW}`)

  if (modal?.open) {
    // Apply scroll transform to main content
    if (below) below.style.transform = `translateY(-${modal.transform || 0}px)`

    if (above) {
      if (typeof above.showModal === TYPE_STRINGS.FUNCTION && !above.open) {
        above.showModal()
      }

      // Check if media-expanded already mounted with same source
      const existing = above.querySelector(COMPONENT_TAGS.MEDIA_EXPANDED)

      const src = modal.media?.source || ATTR_VALUES.EMPTY

      if (!existing || existing.getAttribute(MEDIA_ATTRS.SOURCE) !== src) {
        above.replaceChildren(
          <media-expanded
            source={modal.media?.source || ATTR_VALUES.EMPTY}
            thumb={modal.media?.thumb || ATTR_VALUES.EMPTY}
            alt={modal.media?.alt || ATTR_VALUES.EMPTY}
            width={modal.media?.width || GENERIC_DIMENSIONS.DEFAULT_WIDTH}
            height={modal.media?.height || GENERIC_DIMENSIONS.DEFAULT_HEIGHT}
            is-video={modal.media?.isVideo ? ATTR_VALUES.TRUE : ATTR_VALUES.FALSE}
          />
        )
      }
    }
  } else {
    // Restore scroll position and unmount expanded media
    if (below) below.style.transform = ''

    if (above) {
      if (typeof above.close === TYPE_STRINGS.FUNCTION && above.open) {
        above.close()
      }

      above.replaceChildren()
    }
  }
}

/** Store change → reload on locale switch, otherwise sync modal DOM. */
export function onProjectStoreUpdate(view: ViewProject): void {
  const currentLocale = store.getters.getLang()

  if (view._lastLocale && view._lastLocale !== currentLocale) {
    view._lastLocale = currentLocale

    view.loadData()

    return
  }

  // Handle modal open/close imperatively to avoid destroying carousels
  view._updateModalDOM()
}
