/**
 * @file webgl-pool-observer-repeat-tails.test.js
 * @description Coverage tails for utils/canvas/webgl-pool.ts — the
 * already-inactive observer arm (a second non-intersecting entry must not
 * re-purge) and the initRecoverySignals one-shot latch on repeat calls.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { webglPool } from '@core/utils/canvas/webgl-pool.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

describe('webgl-pool observer repeat tails', () => {
  test('a repeat offscreen entry skips purge when already inactive', () => {
    let captured

    class CapturingObserver {
      constructor(cb) {
        captured = cb
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    const IO = globalThis.IntersectionObserver

    globalThis.IntersectionObserver = window.IntersectionObserver = CapturingObserver
    webglPool.initObserver()

    const el = document.createElement(HTML_TAGS.CANVAS)
    const instance = { useWebGL: true, purge: jest.fn(), restore: jest.fn() }

    webglPool.register(el, instance)

    const offscreen = [{ isIntersecting: false, intersectionRatio: 0, target: el }]
    const onscreen = [{ isIntersecting: true, intersectionRatio: 1, target: el }]

    captured(offscreen)
    captured(offscreen)

    expect(instance.purge).toHaveBeenCalledTimes(1)

    // Re-entry on an inactive entry takes the restore arm; a repeat
    // onscreen entry must not re-restore (already-active skip arm).
    captured(onscreen)
    captured(onscreen)

    expect(instance.restore).toHaveBeenCalledTimes(1)

    webglPool.unregister(el)
    globalThis.IntersectionObserver = window.IntersectionObserver = IO
    webglPool.initObserver()
  })

  test('retryFallbacks skips entries that fail the active/fallback guard', () => {
    let captured

    class CapturingObserver {
      constructor(cb) {
        captured = cb
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    const IO = globalThis.IntersectionObserver

    globalThis.IntersectionObserver = window.IntersectionObserver = CapturingObserver
    webglPool.initObserver()

    // A live fallback widget without retryWebGL takes the purge+restore arm;
    // a widget already on WebGL fails the guard and hits the continue arm.
    const retryEl = document.createElement(HTML_TAGS.CANVAS)
    const retryInst = { useWebGL: false, purge: jest.fn(), restore: jest.fn() }

    const skipEl = document.createElement(HTML_TAGS.CANVAS)
    const skipInst = { useWebGL: true, purge: jest.fn(), restore: jest.fn() }

    webglPool.register(retryEl, retryInst)
    webglPool.register(skipEl, skipInst)

    // The inactive-first-operand arm: offscreen the fallback widget, then
    // retry — the `!isActive` side of the guard must skip it entirely.
    captured([{ isIntersecting: false, intersectionRatio: 0, target: retryEl }])

    const purgeCalls = retryInst.purge.mock.calls.length

    // Every entry fails the guard → hasRetryableFallbacks walks the else
    // arms to `return false`, so the retry is never scheduled.
    webglPool.scheduleFallbackRetry()
    webglPool.retryFallbacks()

    expect(retryInst.purge.mock.calls.length).toBe(purgeCalls)
    expect(skipInst.purge).not.toHaveBeenCalled()

    // Back onscreen → the same retry now drives purge+restore (the
    // no-retryWebGL else arm) while the WebGL entry keeps skipping.
    captured([{ isIntersecting: true, intersectionRatio: 1, target: retryEl }])
    retryInst.purge.mockClear()
    retryInst.restore.mockClear()

    webglPool.retryFallbacks()

    expect(retryInst.purge).toHaveBeenCalledTimes(1)
    expect(retryInst.restore).toHaveBeenCalledTimes(1)
    expect(skipInst.purge).not.toHaveBeenCalled()

    webglPool.unregister(retryEl)
    webglPool.unregister(skipEl)
    globalThis.IntersectionObserver = window.IntersectionObserver = IO
    webglPool.initObserver()
  })

  test('initRecoverySignals early-returns once the latch is set', () => {
    // The singleton constructor already armed the signals — a second call
    // must take the early-return arm without double-binding listeners.
    webglPool.initRecoverySignals()

    expect(webglPool.recoverySignalsReady).toBe(true)
  })
})
