/**
 * @file boot-tails.test.js — coverage tails for src/app/boot.ts:
 * mountAppShell's initial-view arm (router.currentRoute set at mount) and
 * the document ResizeObserver callback that re-measures scroll state when
 * async content grows the page.
 */

import { jest } from '@jest/globals'
import { mountAppShell } from '@/app/boot.js'
import router from '@/routes/router.js'
import { VIEW_TAGS } from '@/core/tokens/elements/views.js'

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
})
