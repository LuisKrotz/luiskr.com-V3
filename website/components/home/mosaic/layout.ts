/**
 * @file mosaic-layout.ts — packing passes for <home-mosaic>.
 *
 * Two entry points share the geometry in mosaic-pack.ts:
 *   quickLayout — synchronous, for urgent repaints (data/resize/hover).
 *   layout      — the full pass: also kicks the WASM batch-layout worker,
 *                 which returns the wall height computed off-thread.
 */

import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { HOME_MOSAIC_CLASSES } from '@core/tokens/classes/mosaic.js'
import { LAYOUT } from '@core/tokens/layout/masonry.js'
import { MOSAIC_SELECTORS } from '@core/tokens/selectors/mosaic.js'
import { WASM_STRINGS } from '@core/tokens/strings/wasm.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { calcColsForWidth, calcResponsivePadding } from '@core/utils/wasm/wasm-layout.js'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { computeMosaicLayout } from './pack.js'
import type { HomeMosaic } from '../HomeMosaic.js'

/** Details-panel height used while the real measurement is pending. */
const PROVISIONAL_BOTTOM_H = 130

/** Expanded-card bottom height callback shared by both packing passes. */
function bottomHFor(host: HomeMosaic): (i: number) => number {
  return (i) =>
    host.hoveredIdx === i || host.touchIdx === i ? (host.bottomHMap[i] ?? PROVISIONAL_BOTTOM_H) : 0
}

/** Debounced re-layout (resize/data changes). */
export function scheduleLayout(host: HomeMosaic): void {
  if (host._rafId) cancelAnimationFrame(host._rafId)

  host._rafId = requestAnimationFrame(() => host.layout())
}

/**
 * Synchronous layout pass for urgent repaints. Same packing math as
 * layout() but skips the WASM round-trip so the DOM never waits on a
 * worker. See layout() for the packing geometry notes.
 */
export function quickLayout(host: HomeMosaic): void {
  const vw = typeof window !== TYPE_STRINGS.UNDEFINED ? window.innerWidth : 0

  if (!vw || !host.processedItems.length) return

  const packed = computeMosaicLayout(vw, host.processedItems, bottomHFor(host))

  if (!packed) return

  host.cards = packed.cards

  host.containerH = packed.height + COMMON_ATTRS.PX

  const mosaicEl = host.$<HTMLElement>(MOSAIC_SELECTORS.HOME_MOSAIC)

  if (mosaicEl) {
    mosaicEl.style.height = host.containerH

    applyCardStyles(host)
  }
}

/** Full masonry pass: measures, assigns columns, positions cards via WASM math. */
export function layout(host: HomeMosaic): void {
  const el = host.$<HTMLElement>(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC}`)

  if (!el || !host.processedItems.length) return

  const vw = typeof window !== TYPE_STRINGS.UNDEFINED ? window.innerWidth : 0

  if (!vw) return

  const pad = calcResponsivePadding(vw)

  const W = Math.floor(vw - pad * 2)

  if (!W || W <= 0) {
    host.quickLayout()

    host.scheduleLayout()

    return
  }

  // WASM worker path: the batch-layout worker computes the same packing
  // off-thread and returns only the total height (individual positions
  // still come from the JS pass below). Skipped while a card is expanded
  // — expansion heights are DOM-measured and can't be serialized.
  if (host.hoveredIdx === null && host.touchIdx === null) {
    wasmPool
      .dispatch(WASM_STRINGS.BATCH_LAYOUT, {
        items: host.processedItems.map((item) => ({ featured: !!item.featured })),
        cols: calcColsForWidth(vw),
        containerW: W,
        gap: LAYOUT.GAP,
      })
      .then((res) => {
        const r = res as { totalHeight?: number } | null

        if (host.hoveredIdx === null && host.touchIdx === null && r?.totalHeight) {
          host.containerH = r.totalHeight + COMMON_ATTRS.PX

          el.style.height = host.containerH
        }
      })
  }

  // Non-null here: the W≤0 and empty-items cases both returned above —
  // those are exactly computeMosaicLayout's null conditions.
  const packed = computeMosaicLayout(vw, host.processedItems, bottomHFor(host))!

  host.cards = packed.cards

  host.containerH = packed.height + COMMON_ATTRS.PX

  el.style.height = host.containerH

  applyCardStyles(host)
}

/** Writes computed card positions/sizes into DOM styles. */
export function applyCardStyles(host: HomeMosaic): void {
  const cardEls = host.$$<HTMLElement>(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM}`)

  cardEls.forEach((cardEl, i) => {
    const c = host.cards[i]

    if (c?.card) {
      Object.assign(cardEl.style, c.card)

      const media = cardEl.querySelector<HTMLElement>(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_MEDIA}`)

      if (media && c.media) Object.assign(media.style, c.media)

      const bottom = cardEl.querySelector<HTMLElement>(`.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_BOTTOM}`)

      if (bottom && c.bottom) Object.assign(bottom.style, c.bottom)
    }
  })
}
