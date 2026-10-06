/**
 * @file routes/views/project/carousels.ts
 * @description Carousel binding for ViewProject — configures each <custom-carousel> from the section data, eagerly for the first few and in idle batches for the rest.
 */

import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import type { ViewProject } from './Project.js'
import type { CustomCarouselElement, ProjectMediaItem } from './types.js'
import { CAROUSEL_LOADING } from '@/core/tokens/motion/carousel.js'

/**
 * Binds project carousels.
 * @param view — the view
 */
export function bindProjectCarousels(view: ViewProject): void {
  const carousels = view.$$<CustomCarouselElement>(COMPONENT_TAGS.CUSTOM_CAROUSEL)

  const configure = (c: CustomCarouselElement) => {
    const idx = parseInt(c.getAttribute(DATA_ATTRS.DATA_CAROUSEL_IDX) || '0', 10)

    const secIdx = parseInt(c.getAttribute(DATA_ATTRS.DATA_SEC_IDX) || '0', 10)

    const items = view.translations?.sections?.[secIdx]?.[idx] as ProjectMediaItem[] | undefined

    if (!items) return

    c.configure({
      items,
      folder: view.translations?.folder || ATTR_VALUES.EMPTY,
      forceActive:
        view.isLandscapeGroup(items) ||
        items.length > 2 ||
        items.some((i) => i?.class === STATE_STRINGS.LANDSCAPE),
    })
  }

  // The first carousels can be in the initial viewport: render them now.
  // The rest (below the fold) are rendered in small idle batches so one
  // frame never has to lay out a dozen carousels at once.
  const eager = carousels.slice(0, CAROUSEL_LOADING.EAGER_COUNT)

  const deferred = carousels.slice(CAROUSEL_LOADING.EAGER_COUNT)

  eager.forEach(configure)

  if (view._bindIdle) {
    if (typeof cancelIdleCallback === TYPE_STRINGS.FUNCTION) cancelIdleCallback(view._bindIdle)

    clearTimeout(view._bindIdle)
  }

  const schedule = (fn: () => void): number =>
    typeof requestIdleCallback === TYPE_STRINGS.FUNCTION
      ? requestIdleCallback(fn, { timeout: CAROUSEL_LOADING.DEFERRED_TIMEOUT })
      : setTimeout(fn, CAROUSEL_LOADING.DEFERRED_TIMEOUT)

  const step = () => {
    if (!view._isMounted) return

    deferred.splice(0, CAROUSEL_LOADING.BATCH_SIZE).forEach(configure)

    view._bindIdle = deferred.length ? schedule(step) : null
  }

  view._bindIdle = deferred.length ? schedule(step) : null
}
