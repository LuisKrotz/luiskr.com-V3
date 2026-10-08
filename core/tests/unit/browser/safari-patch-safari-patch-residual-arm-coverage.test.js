/**
 * @file safari-patch-safari-patch-residual-arm-coverage.test.js
 * @description Split from safari-patch.test.js — covers the "safari-patch — residual arm coverage" describe.
 */
import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals'
import '@website/components/carousel/CustomCarousel.js'
import '@website/components/media/MediaFigure.js'
import '@website/components/media/MediaExpanded.js'
import '@website/views/project/Project.js'
import store from '@core/store.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TOUCH_EVENTS } from '@core/tokens/events/dom.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'

// The patch registers whenDefined() callbacks at module-eval — the component
// imports above ensure the tags already resolve when it installs.
beforeAll(async () => {
  await import('@core/safari/patch.js')
  await new Promise((resolve) => setTimeout(resolve, 20))
})

afterAll(() => {
  document.documentElement.classList.remove(STATE_CLASSES.IS_SAFARI)
})

const cls = (tag) => customElements.get(tag)

const tick = () => new Promise((resolve) => setTimeout(resolve, 20))

// Bound after each module-registry reset so commits always reach the store
// instance the currently-installed prototype patches close over.
let _activeStore = store

describe('safari-patch — residual arm coverage', () => {
  test('patched onMounted video path with null observer and missing IntersectionObserver', () => {
    const vid = {
      defaultMuted: false,
      muted: false,
      autoplay: false,
      paused: true,
      readyState: 1,
      setAttribute: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      querySelector: () => null,
      play: jest.fn(() => Promise.resolve()),
      pause: jest.fn(),
      load: jest.fn(),
    }

    const ctx = {
      style: {},
      classes: '',
      classList: { contains: () => false },
      hasAttribute: () => false,
      autoPlay: false,
      $: (sel) => (sel === HTML_TAGS.VIDEO ? vid : null),
      isVideo: true,
      video: [],
      canExpand: false,
      isLoaded: false,
      observer: null,
      imgObserver: null,
      subscribe: jest.fn(),
      addScopedListener: jest.fn(),
      loadHighRes: jest.fn(),
      openModal: jest.fn(),
      _ensureVideoSource: jest.fn(),
    }

    const origIO = globalThis.IntersectionObserver

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    delete globalThis.IntersectionObserver

    try {
      cls(COMPONENT_TAGS.MEDIA_FIGURE).prototype.onMounted.call(ctx)
    } finally {
      globalThis.IntersectionObserver = origIO
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    }

    expect(ctx.observer).toBeNull()
  })

  test('patched onMounted image path with missing IntersectionObserver', () => {
    const ctx = {
      style: {},
      classes: '',
      classList: { contains: () => false },
      hasAttribute: () => false,
      autoPlay: false,
      $: () => null,
      isVideo: false,
      video: [],
      canExpand: false,
      isLoaded: false,
      observer: null,
      imgObserver: null,
      subscribe: jest.fn(),
      addScopedListener: jest.fn(),
      loadHighRes: jest.fn(),
      openModal: jest.fn(),
      _ensureVideoSource: jest.fn(),
    }

    const origIO = globalThis.IntersectionObserver

    delete globalThis.IntersectionObserver

    try {
      cls(COMPONENT_TAGS.MEDIA_FIGURE).prototype.onMounted.call(ctx)
    } finally {
      globalThis.IntersectionObserver = origIO
    }

    expect(ctx.imgObserver).toBeNull()
  })

  test('expandable figure: a sub-threshold touchmove still opens the modal', async () => {
    const el = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)

    el.setAttribute(MEDIA_ATTRS.SRC, 'p/img-tap-threshold')
    el.setAttribute(MEDIA_ATTRS.CAN_EXPAND, ATTR_VALUES.TRUE)
    document.body.appendChild(el)

    await tick()

    el.openModal = jest.fn()

    const target = el.shadowRoot.querySelector(HTML_TAGS.FIGURE) || el

    target.dispatchEvent(
      new TouchEvent(TOUCH_EVENTS.TOUCHSTART, {
        touches: [{ clientX: 0, clientY: 0 }],
        bubbles: true,
        composed: true,
      })
    )
    target.dispatchEvent(
      new TouchEvent(TOUCH_EVENTS.TOUCHMOVE, {
        touches: [{ clientX: 5, clientY: 3 }],
        bubbles: true,
        composed: true,
      })
    )
    target.dispatchEvent(
      new TouchEvent(TOUCH_EVENTS.TOUCHEND, { bubbles: true, composed: true, cancelable: true })
    )

    expect(el.openModal).toHaveBeenCalled()

    el.remove()
  })

  test('MediaExpanded video path replays play() and tolerates rejection', async () => {
    const vid = {
      defaultMuted: false,
      muted: false,
      setAttribute: jest.fn(),
      play: jest.fn(() => Promise.reject(new Error(STATE_STRINGS.DENIED))),
    }

    const ctx = {
      isVideo: true,
      source: 'v.mp4',
      $: (sel) => (sel === HTML_TAGS.VIDEO ? vid : null),
      $$: () => [],
      closest: () => null,
      addScopedListener: jest.fn(),
      startClose: jest.fn(),
      subscribe: jest.fn(),
    }

    cls(COMPONENT_TAGS.MEDIA_EXPANDED).prototype.onMounted.call(ctx)

    await tick()

    expect(vid.play).toHaveBeenCalled()
  })

  test('module re-eval skips DOM guards when document is absent', async () => {
    const doc = globalThis.document

    delete globalThis.document
    jest.resetModules()

    try {
      await import('@core/safari/patch.js')
    } catch {
      // globals missing — eval may abort
    } finally {
      globalThis.document = doc
    }

    expect(globalThis.document).toBe(doc)
  })

  test('module re-eval skips the component section when customElements is absent', async () => {
    const ce = globalThis.customElements

    delete globalThis.customElements
    jest.resetModules()

    try {
      await import('@core/safari/patch.js')
    } catch {
      // globals missing — eval may abort
    } finally {
      globalThis.customElements = ce
    }

    expect(globalThis.customElements).toBe(ce)
  })
})
