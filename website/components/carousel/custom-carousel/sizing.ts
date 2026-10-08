/**
 * @file carousel-sizing.ts
 * @description Fit/height measurement for CustomCarousel — the
 * ResizeObserver that re-fits slides, the side-by-side fit projection
 * (≤2 items, no landscape, ≥960px viewport, total width ≤ host), and the
 * --carousel-item-height publisher that keeps every slide the same
 * aspect-corrected height.
 */

import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { CAROUSEL_CSS_PROPS } from '@core/tokens/css/carousel.js'
import { CAROUSEL_SELECTORS } from '@core/tokens/selectors/carousel.js'
import { GENERIC_DIMENSIONS } from '@core/tokens/media/dimensions.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import type { CustomCarousel } from '../CustomCarousel.js'
import { CAROUSEL_LAYOUT } from '@core/tokens/motion/carousel.js'

/**
 * Wires a ResizeObserver on the host that re-runs _measureFit on width
 * changes. Reports under FIT_EPS_PX of the last width are dropped —
 * scrollbars appearing/disappearing and sub-pixel reflow would otherwise
 * re-fit on every layout pass. The measurement defers one RAF so it runs
 * post-layout, and ResizeObserver absence (old engines) degrades to the
 * one-shot window-resize path.
 * @param c The CustomCarousel element.
 */
export function startFitObserver(c: CustomCarousel) {
  if (typeof ResizeObserver === TYPE_STRINGS.UNDEFINED) return

  c._fitObserver = new ResizeObserver((entries) => {
    const width = entries[0]?.contentRect?.width || 0

    if (Math.abs(width - (c._lastObservedWidth || 0)) < CAROUSEL_LAYOUT.FIT_EPS_PX) return

    c._lastObservedWidth = width

    requestAnimationFrame(() => {
      c._measureFit(width)
    })
  })

  c._fitObserver.observe(c)
}

/**
 * Decides whether the items fit side-by-side (no carousel chrome) or need
 * the scroll track. Side-by-side requires: ≤2 items, viewport
 * ≥ SIDE_BY_SIDE_BREAKPOINT, and projected total width ≤ host width.
 * The projection mirrors the shadow-DOM contract in media-figure.scss +
 * carousel-host.scss exactly: strip height is --mf-h (70dvh minus a pad
 * under 1024, fixed $space-* steps above), media width is
 * ratio·stripH floored at MEDIA_MIN_WIDTH on ≥375px viewports and capped
 * by the regular gutter cap or the landscape --mf-max-w ladder, and each
 * item adds its breakpoint padding + desktop side margin. Items missing
 * intrinsic sizes use GENERIC_DIMENSIONS defaults (conservative portrait)
 * so a partial CMS row can't silently flip to scroll mode.
 * @param c The CustomCarousel element.
 * @param observedWidth Fresh RO width when known — avoids a layout read.
 */
export function measureFit(c: CustomCarousel, observedWidth?: number) {
  if (c._forceActive) return

  if (c.items.length < 2) return

  // Groups with more than 2 items always need the scroll track + controls.
  if (c.items.length > 2) {
    if (c._isSideBySide) {
      c._isSideBySide = false

      c._updateDom()

      c._setupAfterRender()
    }

    return
  }

  const vw = typeof window !== TYPE_STRINGS.UNDEFINED ? window.innerWidth : 0

  if (vw < CAROUSEL_LAYOUT.SIDE_BY_SIDE_BREAKPOINT) {
    if (c._isSideBySide) {
      c._isSideBySide = false

      c._updateDom()
    }

    return
  }

  const hostW = observedWidth || c.clientWidth || 0

  if (hostW <= 0) return

  // Past the <960 guard window is provably defined — vh reads directly.
  const vh = window.innerHeight

  // --mf-h ladder (media-figure.scss / carousel-host.scss): 70dvh minus a
  // pad below 1024, fixed $space-* steps at 1024/1440/2560.
  const vh70 = Math.round((vh * CAROUSEL_LAYOUT.MAX_HEIGHT_VH) / 100)

  const stripH =
    vw >= 2560
      ? CAROUSEL_LAYOUT.STRIP_H_2560
      : vw >= 1440
        ? CAROUSEL_LAYOUT.STRIP_H_1440
        : vw >= CAROUSEL_LAYOUT.ITEM_MARGIN_VW
          ? CAROUSEL_LAYOUT.STRIP_H_1024
          : vh70 - CAROUSEL_LAYOUT.STRIP_SUB_TABLET

  // vw ≥ 960 > MEDIA_MIN_WIDTH_VW here — the 320px floor always applies.
  const mediaMinW = CAROUSEL_LAYOUT.MEDIA_MIN_WIDTH

  // Item horizontal padding (both sides) per breakpoint — mirrors the
  // .internal-extra-item padding-inline ladder; ≥960 always lands on the
  // ≥768 rung or above so the sub-768 default has no case here.
  const itemPad =
    vw >= 1920
      ? CAROUSEL_LAYOUT.ITEM_PAD_1920
      : vw >= 1440
        ? CAROUSEL_LAYOUT.ITEM_PAD_1440
        : CAROUSEL_LAYOUT.ITEM_PAD_768

  // Desktop-only item side margins — only ≥1024 viewports pay them.
  const itemMargin = vw >= CAROUSEL_LAYOUT.ITEM_MARGIN_VW ? CAROUSEL_LAYOUT.ITEM_MARGIN_PX * 2 : 0

  // Media max-width caps: landscape items use their own --mf-max-w ladder
  // at ≥1024; regular items get the viewport-gutter cap at ≥1024 and the
  // 90vw-minus-pad cap below.
  const landscapeCap =
    vw >= 1920
      ? vw - CAROUSEL_LAYOUT.LAND_CAP_SUB_1920
      : vw >= 1440
        ? vw - CAROUSEL_LAYOUT.LAND_CAP_SUB_1440
        : vw >= 1280
          ? vw - CAROUSEL_LAYOUT.LAND_CAP_SUB_1280
          : vw - CAROUSEL_LAYOUT.LAND_CAP_SUB_1024

  const regularCap =
    vw >= CAROUSEL_LAYOUT.ITEM_MARGIN_VW
      ? vw - CAROUSEL_LAYOUT.REG_CAP_SUB
      : vw * 0.9 - CAROUSEL_LAYOUT.STRIP_SUB_TABLET

  let totalW = 0

  for (const item of c.items) {
    const w = item.size?.[0] || GENERIC_DIMENSIONS.DEFAULT_WIDTH

    const h = item.size?.[1] || GENERIC_DIMENSIONS.ITEM_FALLBACK_HEIGHT

    const natural = (w / h) * stripH

    const cap = item?.class === STATE_STRINGS.LANDSCAPE ? landscapeCap : regularCap

    // CSS order: max-width clamps first, then min-width can override it —
    // a floored media keeps 320px even when the cap is smaller.
    const mediaW = Math.max(mediaMinW, Math.min(natural, cap))

    totalW += mediaW + itemPad + itemMargin + CAROUSEL_LAYOUT.ITEM_GAP_PX
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
 * Window-resize handler — refreshes the mobile flag against the
 * side-by-side breakpoint (mobile is defined by "can't pair items", not
 * by the generic 768 media breakpoint) and re-publishes the slide height.
 * @param c The CustomCarousel element.
 */
export function onCarouselResize(c: CustomCarousel) {
  c.isMobile =
    typeof window !== TYPE_STRINGS.UNDEFINED
      ? window.innerWidth < CAROUSEL_LAYOUT.SIDE_BY_SIDE_BREAKPOINT
      : false

  c._setHeightVar()
}

/**
 * Publishes --carousel-item-height on the enclosing <section>: the first
 * item's intrinsic ratio applied to the host width ((h/w)·hostW), capped
 * at MAX_HEIGHT_VH — aspect-correct heights before image decode so slides
 * never pop. When the item lacks a size the measured slide height is the
 * fallback; a ≤0 result bails rather than writing a 0px var. The
 * getPropertyValue read guards the setProperty — same-value writes would
 * still dirty the style recalc.
 * @param c The CustomCarousel element.
 */
export function setHeightVar(c: CustomCarousel) {
  const firstSlide = c.$(CAROUSEL_SELECTORS.CAROUSEL_SLIDES_NOT_CLONE)

  if (!firstSlide) return

  const firstItem = c.items?.[0]

  let slideH

  if (firstItem?.size?.[0] && firstItem?.size?.[1]) {
    const hostW =
      c.clientWidth ||
      (typeof window !== TYPE_STRINGS.UNDEFINED
        ? window.innerWidth
        : GENERIC_DIMENSIONS.DEFAULT_WIDTH)

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
