/**
 * @file scroll-state.js
 * @description Global "is the window currently scrolling" flag plus an
 * onScrollStop() one-shot registry — used to defer expensive work (layout
 * reads, lazy swaps, decoding) until a scroll gesture settles. Uses the
 * native scrollend event where available, else a 120ms debounce.
 */
import { WINDOW_EVENTS } from '@/core/tokens/events/dom.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'

let isWindowScrolling = false

let scrollStopTimer: ReturnType<typeof setTimeout> | null = null

const scrollStopCallbacks = new Set<() => void>()

/** Fires when scrolling settles: clears the flag and drains pending callbacks. */
const handleScrollStop = () => {
  isWindowScrolling = false

  if (scrollStopTimer) {
    clearTimeout(scrollStopTimer)

    scrollStopTimer = null
  }

  const callbacks = Array.from(scrollStopCallbacks)

  scrollStopCallbacks.clear()

  callbacks.forEach((cb) => {
    try {
      cb()
    } catch {
      // listener errors must not break the scroll pipeline
    }
  })
}

/** Marks scrolling as active and arms the 120ms debounce fallback for scrollend. */
const handleScroll = () => {
  isWindowScrolling = true

  if (scrollStopTimer) {
    clearTimeout(scrollStopTimer)
  }

  scrollStopTimer = setTimeout(handleScrollStop, 120)
}

if (typeof window !== TYPE_STRINGS.UNDEFINED) {
  window.addEventListener(WINDOW_EVENTS.SCROLL, handleScroll, { passive: true })

  if ('onscrollend' in window) {
    window.addEventListener(WINDOW_EVENTS.SCROLLEND, handleScrollStop, { passive: true })
  }
}

/** True while a window scroll gesture is in progress. */
export const isScrolling = () => isWindowScrolling

/**
 * Queues a one-shot callback for the next scroll stop; fires immediately
 * when the window isn't scrolling right now.
 */
export const onScrollStop = (callback: () => void) => {
  if (typeof callback !== TYPE_STRINGS.FUNCTION) return

  if (!isWindowScrolling) {
    callback()

    return
  }

  scrollStopCallbacks.add(callback)
}
