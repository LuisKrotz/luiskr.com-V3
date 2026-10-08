/**
 * @file boot-tails.test.js — coverage tails for src/app/boot.ts:
 * mountAppShell's initial-view arm (router.currentRoute set at mount) and
 * the document ResizeObserver callback that re-measures scroll state when
 * async content grows the page.
 */

import { jest } from '@jest/globals'
import { mountAppShell } from '@/app/boot.js'
import router from '@core/router/router.js'
import { APP_CLASSES } from '@core/tokens/classes/app.js'
import { ANIMATION_DURATIONS } from '@core/tokens/motion/animation.js'
import { ROUTE_NAMES } from '@core/tokens/routes/names.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'

const flush = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms))

describe('app boot tails', () => {
  test('mountAppShell — resolves the boot view + re-measures on document growth', () => {
    // Capture the ResizeObserver callback so the body-growth path can be
    // driven deterministically instead of racing happy-dom's resize loop.
    const savedRO = globalThis.ResizeObserver
    let roCb = null
    let observedEl = null

    globalThis.ResizeObserver = class {
      constructor(cb) {
        roCb = cb
      }
      observe(el) {
        observedEl = el
      }
      unobserve() {}
      disconnect() {}
    }

    const c = {
      initInputListeners: jest.fn(),
      loadData: jest.fn(),
      subscribe: jest.fn(),
      $: jest.fn(() => null),
      addScopedListener: jest.fn(),
      _updateViewContent: jest.fn(),
      updateSectionTops: jest.fn(),
      checkScroll: jest.fn(),
      routeLoading: false,
      currentViewTag: null,
    }

    const prevRoute = router.currentRoute

    router.currentRoute = { view: VIEW_TAGS.VIEW_HOME }

    try {
      mountAppShell(c)

      // Initial view arm: the boot mounts the already-resolved route.
      expect(c.currentViewTag).toBe(VIEW_TAGS.VIEW_HOME)
      expect(c._updateViewContent).toHaveBeenCalled()
      expect(observedEl).toBe(document.body)

      // Document growth re-runs the scroll bookkeeping — this is what
      // keeps first-load nav ink correct once async content arrives.
      roCb()

      expect(c.checkScroll).toHaveBeenCalled()
    } finally {
      router.currentRoute = prevRoute

      if (savedRO === undefined) delete globalThis.ResizeObserver
      else globalThis.ResizeObserver = savedRO
    }
  })

  test('route subscriber — bar completes even when the view swap throws mid-notify', async () => {
    // Regression: the completion timer is armed BEFORE the view swap/data
    // fan-out, so an exception downstream (swallowed by router.notify) can
    // no longer leave the bar stuck in --active on first load.
    const pBar = document.createElement('div')

    pBar.className = APP_CLASSES.PROGRESS_BAR

    const c = {
      initInputListeners: jest.fn(),
      loadData: jest.fn(),
      subscribe: jest.fn(),
      $: jest.fn((sel) => (sel.includes(APP_CLASSES.PROGRESS_BAR) ? pBar : null)),
      addScopedListener: jest.fn(),
      _updateViewContent: jest.fn(() => {
        throw new Error('boom')
      }),
      updateSectionTops: jest.fn(),
      checkScroll: jest.fn(),
      routeLoading: false,
      currentViewTag: null,
    }

    const prevRoute = router.currentRoute

    router.currentRoute = null

    try {
      mountAppShell(c)

      router.notify({ name: ROUTE_NAMES.TERMS, view: VIEW_TAGS.VIEW_LEGAL, meta: {} }, null)

      expect(pBar.classList.contains(APP_CLASSES.PROGRESS_BAR_ACTIVE)).toBe(true)
      expect(c._updateViewContent).toHaveBeenCalled()

      await flush(ANIMATION_DURATIONS.ROUTE_DURATION + 50)

      expect(c.routeLoading).toBe(false)
      expect(pBar.classList.contains(APP_CLASSES.PROGRESS_BAR_DONE)).toBe(true)

      await flush(ANIMATION_DURATIONS.PROGRESS_BAR_RESET + 50)

      expect(pBar.classList.contains(APP_CLASSES.PROGRESS_BAR_DONE)).toBe(false)
    } finally {
      router.currentRoute = prevRoute
    }
  })

  test('route subscriber — done lands on the live bar when the node was re-created mid-flight', async () => {
    // Regression: if a re-render swaps the progress-bar node between
    // nav-start and the completion tick, --done must land on the node the
    // user can actually see, not the detached one.
    const stale = document.createElement('div')
    const live = document.createElement('div')

    stale.className = `${APP_CLASSES.PROGRESS_BAR} ${APP_CLASSES.PROGRESS_BAR_ACTIVE}`
    live.className = `${APP_CLASSES.PROGRESS_BAR} ${APP_CLASSES.PROGRESS_BAR_ACTIVE}`

    let which = stale

    const c = {
      initInputListeners: jest.fn(),
      loadData: jest.fn(),
      subscribe: jest.fn(),
      $: jest.fn((sel) => (sel.includes(APP_CLASSES.PROGRESS_BAR) ? which : null)),
      addScopedListener: jest.fn(),
      _updateViewContent: jest.fn(() => {
        which = live
      }),
      updateSectionTops: jest.fn(),
      checkScroll: jest.fn(),
      routeLoading: false,
      currentViewTag: null,
    }

    const prevRoute = router.currentRoute

    router.currentRoute = null

    try {
      mountAppShell(c)

      router.notify({ name: ROUTE_NAMES.HOME, view: VIEW_TAGS.VIEW_HOME, meta: {} }, null)

      expect(stale.classList.contains(APP_CLASSES.PROGRESS_BAR_ACTIVE)).toBe(true)

      await flush(ANIMATION_DURATIONS.ROUTE_DURATION + 50)

      // The stale node never sees --done; the live replacement does.
      expect(stale.classList.contains(APP_CLASSES.PROGRESS_BAR_DONE)).toBe(false)
      expect(live.classList.contains(APP_CLASSES.PROGRESS_BAR_DONE)).toBe(true)
      expect(c.routeLoading).toBe(false)
    } finally {
      router.currentRoute = prevRoute
    }
  })
})
