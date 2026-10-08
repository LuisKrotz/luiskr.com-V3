/**
 * @file mosaic-interactions.ts — hover expansion + two-tap activation
 * for <home-mosaic> cards.
 */

import { MEDIA_QUERIES } from '@core/tokens/primitives.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { HOME_MOSAIC_CLASSES } from '@core/tokens/classes/mosaic.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TOUCH_EVENTS } from '@core/tokens/events/dom.js'
import { LOCALES } from '@core/tokens/locales.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { MOSAIC_SELECTORS } from '@core/tokens/selectors/mosaic.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { WASM_STRINGS } from '@core/tokens/strings/wasm.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { npuPredict } from '@core/utils/gpu/npu-predict.js'
import type { MosaicItem } from './pack.js'
import type { HomeMosaic } from '../HomeMosaic.js'

/** Details-panel floor matching mosaic-layout's provisional height. */
const PROVISIONAL_BOTTOM_H = 130

/** Measured-height padding beyond the panel's scrollHeight. */
const DETAIL_H_PAD = 24

/** Resolves the mosaic card element + its data-index from a DOM event. */
export function cardIdxFromEvent(e: Event): { itemEl: Element; idx: number } | null {
  const itemEl = (e.target as Element | null)?.closest(MOSAIC_SELECTORS.HOME_MOSAIC_ITEM)

  if (!itemEl) return null

  const idx = parseInt(itemEl.getAttribute(DATA_ATTRS.DATA_INDEX) || CHAR_STRINGS.ZERO, 10)

  return { itemEl, idx }
}

/** The expanded details panel for card `i`, or null. */
function detailEl(host: HomeMosaic, i: number): Element | null {
  return host.$(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_DETAILS}[${DATA_ATTRS.DATA_INDEX}="${i}"]`)
}

/** Removes the hover-injected description paragraph from card `i`. */
function removeDesc(host: HomeMosaic, i: number): void {
  const detail = detailEl(host, i)

  const descEl = detail?.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_DESC}`)

  if (descEl) descEl.remove()
}

/**
 * Pointer-enter: expands the card's details region. Two-pass flow —
 * first layout() with a 130px provisional bottom, then after one frame
 * the real scrollHeight is measured into bottomHMap and the wall
 * reflows to its final geometry. npuPredict warms the likely route
 * (150ms debounce ≈ intentional hover vs cursor passing through).
 */
export function onHover(host: HomeMosaic, i: number): void {
  if (host.hasTouch) return

  host.hoveredIdx = i

  host.layout()

  npuPredict.predictTargetLikelihood(WASM_STRINGS.MOSAIC_CARD, null, 150)

  const item = host.processedItems[i]

  const detail = detailEl(host, i)

  if (detail && item?.description) {
    let descEl: Element | null = detail.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_DESC}`)

    if (!descEl) {
      descEl = document.createElement(HTML_TAGS.P)
      descEl.className = HOME_MOSAIC_CLASSES.HOME_MOSAIC_DESC

      const drawTextEl = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      drawTextEl.setAttribute(FORM_ATTRS.TEXT, item.description)
      drawTextEl.setAttribute(COMMON_ATTRS.DELAY, CHAR_STRINGS.DELAY_8)
      descEl.appendChild(drawTextEl)

      const btn = detail.querySelector(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_BTN}`)

      if (btn) detail.insertBefore(descEl, btn)
      else detail.appendChild(descEl)
    }
  }

  requestAnimationFrame(() => {
    const detail = detailEl(host, i)

    if (detail) {
      host.bottomHMap[i] = Math.max(detail.scrollHeight + DETAIL_H_PAD, PROVISIONAL_BOTTOM_H)
    }

    host.layout()
  })
}

/** Pointer-leave: clears hover state. */
export function onLeave(host: HomeMosaic): void {
  if (host.hasTouch) return

  const prevIdx = host.hoveredIdx
  host.hoveredIdx = null

  if (prevIdx !== null) {
    removeDesc(host, prevIdx)
  }

  host.layout()
}

/**
 * Builds the localized destination URL for one mosaic project card.
 * @param item project metadata containing the route slug
 * @returns localized portfolio URL, or an empty string without a slug
 */
export function projectHref(item: MosaicItem): string {
  if (!item.link) return ATTR_VALUES.EMPTY

  const lang = store.getters.getLang()
  const prefix = lang === LOCALES.EN ? ATTR_VALUES.EMPTY : `${ROUTE_PATHS.ROOT}${lang}`

  return `${prefix}${ROUTE_PATHS.PORTFOLIO}${item.link}`
}

/**
 * Card activation. Desktop: straight to the project route. Touch:
 * first tap expands the details (records bottomH so the wall reflows),
 * second tap on the SAME card navigates — the two-tap pattern gives
 * touch users the hover preview desktop users get for free.
 */
export function onClick(host: HomeMosaic, item: MosaicItem, i: number): void {
  const isTouch =
    Boolean(host.hasTouch) ||
    TOUCH_EVENTS.TOUCHSTART in window ||
    (window.matchMedia && window.matchMedia(MEDIA_QUERIES.POINTER_COARSE).matches)

  if (!item.link) return

  const dest = projectHref(item)

  if (isTouch && host.touchIdx !== i) {
    const prevIdx = host.touchIdx
    host.touchIdx = i

    if (prevIdx !== null && prevIdx !== i) {
      removeDesc(host, prevIdx)

      delete host.bottomHMap[prevIdx]
    }

    host._updateDom()

    requestAnimationFrame(() => {
      const d = detailEl(host, i)

      if (d) {
        const detailH = d.scrollHeight

        if (detailH > 0) host.bottomHMap[i] = detailH + DETAIL_H_PAD
      }

      host.layout()
    })
  } else {
    router.push(dest)
  }
}
