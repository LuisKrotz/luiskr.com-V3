/**
 * @file carousel-sizing.ts
 * @description Fit/height measurement for CustomCarousel — the
 * ResizeObserver that re-fits slides, the side-by-side fit projection
 * (≤2 items, no landscape, ≥960px viewport, total width ≤ host), and the
 * --carousel-item-height publisher that keeps every slide the same
 * aspect-corrected height.
 */

import { COMMON_ATTRS } from '@/core/tokens/attrs/common.js'
import { CAROUSEL_CSS_PROPS } from '@/core/tokens/css/carousel.js'
import { CAROUSEL_SELECTORS } from '@/core/tokens/selectors/carousel.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import type { CustomCarousel } from '../CustomCarousel.js'
import { CAROUSEL_LAYOUT } from '@/core/tokens/motion/carousel.js'

/**
 * Starts fit observer.
 * @param c — the component
 */
export function startFitObserver(c: CustomCarousel) {
  if (typeof ResizeObserver === TYPE_STRINGS.UNDEFINED) return

  c._fitObserver = new ResizeObserver((entries) => {
    const width = entries[0]?.contentRect?.width || 0

    if (Math.abs(width - (c._lastObservedWidth || 0)) < 4) return

    c._lastObservedWidth = width

    requestAnimationFrame(() => {
      c._measureFit(width)
    })
  })

  c._fitObserver.observe(c)
}

/**
 * measures fit.
 * @param c — the component
 * @param observedWidth — the value
 */
export function measureFit(c: CustomCarousel, observedWidth?: number) {
  if (c._forceActive) return

  if (c.items.length < 2) return

  // Groups with more than 2 items or containing any landscape items cannot fit side-by-side.
  if (c.items.length > 2 || c.items.some((i) => i?.class === STATE_STRINGS.LANDSCAPE)) {
    if (c._isSideBySide) {
      c._isSideBySide = false

      c._updateDom()

      c._setupAfterRender()
    }

    return
  }

  if (
    typeof window !== TYPE_STRINGS.UNDEFINED &&
    window.innerWidth < CAROUSEL_LAYOUT.SIDE_BY_SIDE_BREAKPOINT
  ) {
    if (c._isSideBySide) {
      c._isSideBySide = false

      c._updateDom()
    }

    return
  }

  const hostW = observedWidth || c.clientWidth || 0

  if (hostW <= 0) return

  const maxH = typeof window !== TYPE_STRINGS.UNDEFINED ? Math.round(window.innerHeight * 0.7) : 600

  let totalW = 0

  for (const item of c.items) {
    const w = item.size?.[0] || 800

    const h = item.size?.[1] || 1200

    const ratio = w / h

    totalW += ratio * maxH + 32
  }

  const fits = totalW > 0 && totalW <= hostW

  const changed = fits !== c._isSideBySide

  if (changed) {
    c._isSideBySide = fits

    c._updateDom()

    if (!fits) {
      c._setupAfterRender()
    }
  }
}

/**
 * The onCarouselResize value.
 * @param c — the component
 */
export function onCarouselResize(c: CustomCarousel) {
  c.isMobile =
    typeof window !== TYPE_STRINGS.UNDEFINED
      ? window.innerWidth < CAROUSEL_LAYOUT.SIDE_BY_SIDE_BREAKPOINT
      : false

  c._setHeightVar()
}

/**
 * Sets height var.
 * @param c — the component
 */
export function setHeightVar(c: CustomCarousel) {
  const firstSlide = c.$(CAROUSEL_SELECTORS.CAROUSEL_SLIDES_NOT_CLONE)

  if (!firstSlide) return

  const firstItem = c.items?.[0]

  let slideH

  if (firstItem?.size?.[0] && firstItem?.size?.[1]) {
    const hostW =
      c.clientWidth || (typeof window !== TYPE_STRINGS.UNDEFINED ? window.innerWidth : 800)

    slideH = Math.round((firstItem.size[1] / firstItem.size[0]) * hostW)
  } else {
    slideH = firstSlide.clientHeight || 0
  }

  if (slideH <= 0) return

  const maxH =
    typeof window !== TYPE_STRINGS.UNDEFINED
      ? Math.round((window.innerHeight * CAROUSEL_LAYOUT.MAX_HEIGHT_VH) / 100)
      : slideH

  const section = c.closest(COMMON_ATTRS.SECTION)

  if (section) {
    const currentH = section.style.getPropertyValue(CAROUSEL_CSS_PROPS.CAROUSEL_ITEM_HEIGHT)

    const nextH = `${Math.min(slideH, maxH)}${COMMON_ATTRS.PX}`

    if (currentH !== nextH) {
      section.style.setProperty(CAROUSEL_CSS_PROPS.CAROUSEL_ITEM_HEIGHT, nextH)
    }
  }
}
