/**
 * @file media/expanded-mount.ts
 * @description Mount wiring for <media-expanded>: scroll reset, Escape /
 * native-cancel / close-button affordances, the WebGL close widget, perf
 * telemetry dispatch, and the full-res pipeline (disk cache → WASM
 * decode → detached preload → blob swap → optional GPU upload).
 */

import { KEYS } from '@core/tokens/primitives.js'
import { EXPAND_MODAL_CLASSES, MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { APP_EVENTS } from '@core/tokens/events/app.js'
import { KEYBOARD_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { WASM_ACTIONS } from '@core/tokens/data/wasm.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import store from '@core/store.js'
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { localMediaCache } from '@core/utils/media/local-media-cache.js'
import { wasmMediaThreads } from '@core/utils/wasm/wasm-media-threads.js'
import { CloseButtonWebGL } from '@core/utils/canvas/widgets/close-button.js'
import type { MediaExpanded } from '../MediaExpanded.js'
import { VIDEO_DIMENSIONS } from '@core/tokens/media/dimensions.js'

/**
 * Full-res pipeline: thumb paints instantly → the disk-cached blob is
 * fetched → WASM threads attempt a decode (pre-warms the frame) → a
 * detached Image confirms load → the visible <img> swaps to the blob
 * URL (no second network trip, instant paint). GPU upload only runs when
 * the WASM decode produced no bitmap. Error path still swaps the src —
 * the browser shows the broken-image state rather than pinning the thumb.
 */
function loadFullRes(el: MediaExpanded): void {
  localMediaCache.fetchOrGetLocalMedia(el.source).then(async (localUrl) => {
    if (!localUrl) return

    const bitmap = await wasmMediaThreads.decodeMediaInSeparateThread(
      localUrl,
      el.mediaWidth || VIDEO_DIMENSIONS.VIDEO_DEFAULT_WIDTH,
      el.mediaHeight || VIDEO_DIMENSIONS.VIDEO_DEFAULT_HEIGHT
    )

    const img = new Image()

    const swap = () => {
      el.currentSrc = localUrl

      const imgEl = el.$<HTMLImageElement>(`.${EXPAND_MODAL_CLASSES.EXPAND_MODAL_MEDIA_ITEM}`)

      if (imgEl) imgEl.src = localUrl
    }

    img.src = localUrl

    img.onload = () => {
      if (!bitmap) {
        gpuAccel.processImageGPU(
          img,
          el.mediaWidth || VIDEO_DIMENSIONS.VIDEO_DEFAULT_WIDTH,
          el.mediaHeight || VIDEO_DIMENSIONS.VIDEO_DEFAULT_HEIGHT
        )
      }

      swap()
    }

    img.onerror = swap
  })
}

/** Mount lifecycle: listeners, close button, telemetry, media pipeline. */
export function mountMediaExpanded(el: MediaExpanded): void {
  window.scrollTo({ top: 0, behavior: ATTR_VALUES.INSTANT })

  const modalAbove = document.querySelector(`.${MODAL_CLASSES.MODAL_ABOVE}`)

  if (modalAbove) modalAbove.scrollTop = 0

  // ESC key closes modal
  el.addScopedListener(window, KEYBOARD_EVENTS.KEYDOWN, (e) => {
    if ((e as KeyboardEvent).key === KEYS.ESCAPE) el.startClose()
  })

  // Native dialog cancel event
  const dialog =
    (el.closest(HTML_TAGS.DIALOG) as HTMLDialogElement | null) ||
    (document.querySelector(
      `${HTML_TAGS.DIALOG}.${MODAL_CLASSES.MODAL_ABOVE}`
    ) as HTMLDialogElement | null)

  if (dialog) {
    el.addScopedListener(dialog, APP_EVENTS.CANCEL, (e) => {
      e.preventDefault()

      el.startClose()
    })
  }

  // Click events
  const closeBtns = el.$$(
    `.${PREF_CLASSES.PREF_CLOSE_BTN}, .${EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSE_BAR_BUTTON}, .${EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSE_BOTTOM}, .${EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSE_AREA}`
  )

  closeBtns.forEach((btn) => {
    el.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => el.startClose())
  })

  const closeCanvas = el.$<HTMLCanvasElement>(`.${PREF_CLASSES.PREF_CLOSE_CANVAS}`)

  if (closeCanvas) {
    el._closeBtn = new CloseButtonWebGL(closeCanvas, () => el.startClose())
  }

  // Telemetry: record the displayed media shape for the perf worker.
  wasmPool.dispatch(WASM_ACTIONS.PROCESS_MEDIA_ANALYTICS, {
    width: el.mediaWidth || 0,
    height: el.mediaHeight || 0,
    isVideo: el.isVideo,
  })

  if (el.isVideo) {
    const vid = el.$<HTMLVideoElement>(HTML_TAGS.VIDEO)

    if (vid && !store.getters.getReducedMotion()) {
      vid.play().catch(() => {})
    }
  } else if (el.source) {
    loadFullRes(el)
  }
}
