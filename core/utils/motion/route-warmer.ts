/**
 * @file route-warmer.js
 * @description Post-load route-chunk warming.
 *
 * After `window.load` fires, the remaining route bundles are imported one
 * per idle slice — the browser fetches each ESM chunk into the module cache
 * at low priority, so a later navigation resolves instantly without paying
 * any cost during the critical loading window.
 *
 * The WebGPU playground chunk is deliberately excluded: it pulls ~1.3 MB of
 * three.js and is already prefetched on real navigation intent by the
 * PredictiveLoader + router's dynamic import.
 */
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { PREFETCH_CONFIG } from '@core/tokens/motion/prefetch.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

/** Small route chunks safe to warm during idle time. */
const ROUTE_CHUNKS = [
  () => import('@website/views/home/Home.js'),
  () => import('@website/views/project/Project.js'),
  () => import('@website/views/legal/Legal.js'),
  () => import('@website/views/not-found/NotFound.js'),
]

let _started = false
let _stopped = false

/**
 * Runs `cb` at the next idle slice — requestIdleCallback with a bounded
 * timeout when available, a short setTimeout fallback otherwise. Evaluated
 * per call so the probe reflects the live environment in tests.
 * @param {Function} cb — the unit of warm work to defer
 */
const _schedule = (cb: () => void) => {
  if (typeof window.requestIdleCallback === TYPE_STRINGS.FUNCTION) {
    window.requestIdleCallback(cb, { timeout: PREFETCH_CONFIG.IDLE_TIMEOUT })
  } else {
    setTimeout(cb, PREFETCH_CONFIG.FALLBACK_DELAY)
  }
}

/**
 * Schedules the next route chunk import. Stops early when warming was
 * halted or the chain is exhausted; each chunk resolves or rejects into
 * `advance` so a failed chunk never stalls the rest of the chain.
 * @param {number} index — position into ROUTE_CHUNKS
 */
const _warmNext = (index: number) => {
  if (_stopped || index >= ROUTE_CHUNKS.length) return

  _schedule(() => {
    if (_stopped) return

    // import() never throws synchronously — failures surface via the promise.
    // `then(advance, advance)` continues the chain whether the chunk resolved
    // or rejected, and needs no separate empty catch handler.
    const advance = () => _warmNext(index + 1)

    ROUTE_CHUNKS[index]().then(advance, advance)
  })
}

/** Halts the idle warm chain — any pending scheduled imports are skipped. */
export const stopRouteWarming = () => {
  _stopped = true
}

/**
 * Starts idle warming once `load` has fired (or immediately if it already has).
 */
export const startRouteWarming = () => {
  if (_started || typeof window === TYPE_STRINGS.UNDEFINED) return

  _started = true

  const begin = () => _warmNext(0)

  if (document.readyState === 'complete') {
    _schedule(begin)
  } else {
    window.addEventListener(WINDOW_EVENTS.LOAD, () => _schedule(begin), { once: true })
  }
}
