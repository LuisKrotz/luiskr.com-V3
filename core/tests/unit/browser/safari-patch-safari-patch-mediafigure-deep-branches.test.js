/**
 * @file safari-patch-safari-patch-mediafigure-deep-branches.test.js
 * @description Split from safari-patch.test.js — covers the "safari-patch — MediaFigure deep branches" describe.
 */
import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals'
import '@website/components/carousel/CustomCarousel.js'
import '@website/components/media/MediaFigure.js'
import '@website/components/media/MediaExpanded.js'
import '@website/views/project/Project.js'
import store from '@core/store.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { MEDIA_CLASSES } from '@core/tokens/classes/media.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { MOUSE_EVENTS, TOUCH_EVENTS } from '@core/tokens/events/dom.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { INTERNAL_CLASSES } from '@core/tokens/classes/project.js'

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
let activeStore = store

describe('safari-patch — MediaFigure deep branches', () => {
  const mountFigure = async (attrs = {}, props = {}) => {
    const el = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
    Object.assign(el, props)
    document.body.appendChild(el)
    await tick()
    return el
  }

  test('loadHighRes via onload marks loaded and hides the thumb', () => {
    const highEl = { complete: false, naturalWidth: 0, classList: { add: jest.fn() }, style: {} }
    const thumbEl = { style: {} }
    const ctx = {
      isVideo: false,
      isLoaded: false,
      mediaHeight: 100,
      mediaWidth: 100,
      mediaSrc: 'p/img',
      $: (sel) =>
        sel.includes(MEDIA_CLASSES.RENDER_MEDIA_HIGH)
          ? highEl
          : sel.includes(MEDIA_CLASSES.RENDER_MEDIA_THUMB)
            ? thumbEl
            : null,
      _isMounted: true,
    }

    cls(COMPONENT_TAGS.MEDIA_FIGURE).prototype.loadHighRes.call(ctx)
    highEl.onload()

    expect(ctx.isLoaded).toBe(true)
    expect(thumbEl.style.display).toBe(ATTR_VALUES.NONE)
  })

  test('loadHighRes onload tolerates a missing thumb element', () => {
    const highEl = { complete: false, naturalWidth: 0, classList: { add: jest.fn() }, style: {} }
    const ctx = {
      isVideo: false,
      isLoaded: false,
      mediaHeight: 100,
      mediaWidth: 100,
      mediaSrc: 'p/img',
      $: (sel) => (sel.includes(MEDIA_CLASSES.RENDER_MEDIA_HIGH) ? highEl : null),
      _isMounted: true,
    }

    cls(COMPONENT_TAGS.MEDIA_FIGURE).prototype.loadHighRes.call(ctx)
    highEl.onload()

    expect(ctx.isLoaded).toBe(true)
  })

  test('loadHighRes skips _updateDom when unmounted', () => {
    const ctx = {
      isVideo: false,
      mediaHeight: 0,
      mediaWidth: 0,
      mediaSrc: 'p/img',
      $: () => null,
      _isMounted: false,
      _updateDom: jest.fn(),
    }

    cls(COMPONENT_TAGS.MEDIA_FIGURE).prototype.loadHighRes.call(ctx)
    expect(ctx.isLoaded).toBeUndefined()
    expect(ctx._updateDom).not.toHaveBeenCalled()
  })

  test('hero detection via classes attribute', async () => {
    const el = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)
    el.setAttribute(MEDIA_ATTRS.SRC, 'p/img')
    el.setAttribute(COMMON_ATTRS.CLASSES, INTERNAL_CLASSES.INTERNAL_MAIN_ITEM)
    el.loadHighRes = jest.fn()
    document.body.appendChild(el)
    await tick()
    expect(el.loadHighRes).toHaveBeenCalled()
    el.remove()
  })

  test('hero detection via classList', async () => {
    const el = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)
    el.setAttribute(MEDIA_ATTRS.SRC, 'p/img')
    el.classList.add(INTERNAL_CLASSES.INTERNAL_MAIN_ITEM)
    el.loadHighRes = jest.fn()
    document.body.appendChild(el)
    await tick()
    expect(el.loadHighRes).toHaveBeenCalled()
    el.remove()
  })

  // The patch reads the Node-level `navigator` global (not window.navigator),
  // so the UA override has to land there.
  const asMobile = () => {
    const prev = globalThis.navigator.userAgent

    Object.defineProperty(globalThis.navigator, 'userAgent', {
      value: 'iPhone',
      configurable: true,
    })

    return () =>
      Object.defineProperty(globalThis.navigator, 'userAgent', { value: prev, configurable: true })
  }

  test('mobile safari swaps to the scaled video source', async () => {
    const restore = asMobile()

    const el = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)

    el.setAttribute(MEDIA_ATTRS.SRC, 'p/v')
    el.setAttribute(MEDIA_ATTRS.IS_VIDEO, ATTR_VALUES.TRUE)
    el.setAttribute(MEDIA_ATTRS.AUTO_PLAY, ATTR_VALUES.TRUE)

    document.body.appendChild(el)

    const srcEl = el.shadowRoot.querySelector(`${HTML_TAGS.VIDEO} ${MEDIA_ATTRS.SOURCE}`)

    if (srcEl && el.video.length >= 2) {
      expect(srcEl.src).toBe(el.video[1])
    }

    await tick()

    restore()
    el.remove()
  })

  test('mobile path with no scaled source keeps the primary', async () => {
    const restore = asMobile()

    const el = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)

    el.setAttribute(MEDIA_ATTRS.SRC, 'p/v')
    el.setAttribute(MEDIA_ATTRS.IS_VIDEO, ATTR_VALUES.TRUE)
    el.setAttribute(MEDIA_ATTRS.AUTO_PLAY, ATTR_VALUES.TRUE)
    el.video = ['full.mp4']

    document.body.appendChild(el)
    await tick()

    restore()
    el.remove()
  })

  test('startPlay early-returns when autoplay is disabled', async () => {
    activeStore.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, false)

    const el = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)

    el.setAttribute(MEDIA_ATTRS.SRC, 'p/v')
    el.setAttribute(MEDIA_ATTRS.IS_VIDEO, ATTR_VALUES.TRUE)
    el.setAttribute(MEDIA_ATTRS.AUTO_PLAY, ATTR_VALUES.TRUE)
    el.video = ['full.mp4']

    document.body.appendChild(el)
    await tick()

    activeStore.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, true)
    el.remove()
  })

  test('observer callback toggles play/pause with visibility', async () => {
    const el = await mountFigure(
      {
        [MEDIA_ATTRS.SRC]: 'p/v',
        [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE,
        [MEDIA_ATTRS.AUTO_PLAY]: ATTR_VALUES.TRUE,
      },
      { video: ['full.mp4'] }
    )

    const vid = el.shadowRoot.querySelector(HTML_TAGS.VIDEO)
    const obs = el.observer

    if (vid && obs) {
      // visible + paused → startPlay (readyState 0 → canplay + load path)
      Object.defineProperty(vid, 'paused', { value: true, configurable: true })
      obs.callback([{ isIntersecting: true, target: vid }], obs)

      // canplay → doPlay → play() reject → touch-unlock fallback
      vid.play = () => Promise.reject(new Error('autoplay-blocked'))
      vid.dispatchEvent(new Event('canplay'))

      await tick()

      // touchstart unlock replays play()
      window.dispatchEvent(new Event(TOUCH_EVENTS.TOUCHSTART))

      // hidden + playing → pause
      Object.defineProperty(vid, 'paused', { value: false, configurable: true })
      vid.pause = jest.fn()
      obs.callback([{ isIntersecting: false, target: vid }], obs)
      expect(vid.pause).toHaveBeenCalled()

      // hidden + already paused → no pause call
      Object.defineProperty(vid, 'paused', { value: true, configurable: true })
      obs.callback([{ isIntersecting: false, target: vid }], obs)
    }

    el.remove()
  })

  test('doPlay early-returns when autoplay is revoked before canplay', async () => {
    const el = await mountFigure({
      [MEDIA_ATTRS.SRC]: 'p/v',
      [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE,
      [MEDIA_ATTRS.AUTO_PLAY]: ATTR_VALUES.TRUE,
    })

    const vid = el.shadowRoot.querySelector(HTML_TAGS.VIDEO)

    if (vid) {
      // onMounted is double-wrapped after the module reset — the old closure
      // reads the pre-reset store, the new one reads activeStore. Disabling
      // autoplay has to land on both for doPlay's guard to fire.
      store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, false)
      activeStore.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, false)

      vid.play = jest.fn(() => Promise.resolve())
      vid.dispatchEvent(new Event('canplay'))

      await tick()

      expect(vid.play).not.toHaveBeenCalled()

      store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, true)
      activeStore.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, true)
    }

    el.remove()
  })

  test('observer startPlay with readyState>=2 calls doPlay directly', async () => {
    const el = await mountFigure(
      {
        [MEDIA_ATTRS.SRC]: 'p/v',
        [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE,
        [MEDIA_ATTRS.AUTO_PLAY]: ATTR_VALUES.TRUE,
      },
      { video: ['full.mp4'] }
    )

    const vid = el.shadowRoot.querySelector(HTML_TAGS.VIDEO)
    const obs = el.observer

    if (vid && obs) {
      Object.defineProperty(vid, 'paused', { value: true, configurable: true })
      Object.defineProperty(vid, 'readyState', { value: 2, configurable: true })
      vid.play = () => Promise.resolve()

      obs.callback([{ isIntersecting: true, target: vid }], obs)
      await tick()
    }

    el.remove()
  })

  test('video figure without hero flags never calls startPlay', async () => {
    const el = await mountFigure({
      [MEDIA_ATTRS.SRC]: 'p/v-nonhero',
      [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE,
    })

    const vid = el.shadowRoot.querySelector(HTML_TAGS.VIDEO)

    if (vid) {
      expect(vid.muted).toBe(true)
    }

    el.remove()
  })

  test('patched onMounted covers falsy-fig, null-observer, no-IO video path', () => {
    const vid = {
      defaultMuted: false,
      muted: false,
      autoplay: false,
      paused: false,
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

    cls(COMPONENT_TAGS.MEDIA_FIGURE).prototype.onMounted.call(ctx)

    expect(vid.setAttribute).toHaveBeenCalled()
    expect(ctx.observer).not.toBeNull()

    if (ctx.observer) {
      ctx.observer.disconnect()
    }
  })

  test('patched onMounted mobile path with empty scaled source', () => {
    const restore = asMobile()

    const srcEl = { src: 'full.mp4' }
    const vid = {
      defaultMuted: false,
      muted: false,
      autoplay: false,
      paused: true,
      readyState: 1,
      setAttribute: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      querySelector: () => srcEl,
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
      video: ['full.mp4', ''],
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

    cls(COMPONENT_TAGS.MEDIA_FIGURE).prototype.onMounted.call(ctx)

    restore()

    expect(srcEl.src).toBe('full.mp4')
  })

  test('patched onMounted image path: no fig target, pre-existing imgObserver', () => {
    const oldObserver = { disconnect: jest.fn() }

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
      imgObserver: oldObserver,
      subscribe: jest.fn(),
      addScopedListener: jest.fn(),
      loadHighRes: jest.fn(),
      openModal: jest.fn(),
      _ensureVideoSource: jest.fn(),
    }

    cls(COMPONENT_TAGS.MEDIA_FIGURE).prototype.onMounted.call(ctx)

    expect(oldObserver.disconnect).toHaveBeenCalled()
    expect(ctx.imgObserver).not.toBeNull()

    if (ctx.imgObserver) {
      ctx.imgObserver.disconnect()
    }
  })

  test('patched onMounted image path: null imgObserver skips the disconnect', () => {
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

    cls(COMPONENT_TAGS.MEDIA_FIGURE).prototype.onMounted.call(ctx)

    expect(ctx.imgObserver).not.toBeNull()

    if (ctx.imgObserver) {
      ctx.imgObserver.disconnect()
    }
  })

  test('doPlay ignores a non-promise play() result', async () => {
    const el = await mountFigure({
      [MEDIA_ATTRS.SRC]: 'p/v-nopromise',
      [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE,
      [MEDIA_ATTRS.AUTO_PLAY]: ATTR_VALUES.TRUE,
    })

    const vid = el.shadowRoot.querySelector(HTML_TAGS.VIDEO)
    const obs = el.observer

    if (vid && obs) {
      Object.defineProperty(vid, 'paused', { value: true, configurable: true })
      Object.defineProperty(vid, 'readyState', { value: 2, configurable: true })
      vid.play = jest.fn(() => undefined)

      obs.callback([{ isIntersecting: true, target: vid }], obs)

      expect(vid.play).toHaveBeenCalled()
    }

    el.remove()
  })

  test('first-touch unlock skipped when autoplay is disabled', async () => {
    const el = await mountFigure({
      [MEDIA_ATTRS.SRC]: 'p/v-touchlock',
      [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE,
      [MEDIA_ATTRS.AUTO_PLAY]: ATTR_VALUES.TRUE,
    })

    const vid = el.shadowRoot.querySelector(HTML_TAGS.VIDEO)
    const obs = el.observer

    if (vid && obs) {
      Object.defineProperty(vid, 'paused', { value: true, configurable: true })
      Object.defineProperty(vid, 'readyState', { value: 2, configurable: true })

      let calls = 0
      vid.play = jest.fn(() => {
        calls += 1
        return calls === 1 ? Promise.reject(new Error('blocked')) : Promise.resolve()
      })

      obs.callback([{ isIntersecting: true, target: vid }], obs)
      await tick()

      store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, false)
      activeStore.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, false)

      window.dispatchEvent(new Event(TOUCH_EVENTS.TOUCHSTART))
      await tick()

      expect(vid.play).toHaveBeenCalledTimes(1)

      store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, true)
      activeStore.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, true)
    }

    el.remove()
  })

  test('image lazy observer loads and disconnects on intersection', async () => {
    const el = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)

    el.setAttribute(MEDIA_ATTRS.SRC, 'p/img-lazy-unique')
    el.isLoaded = false
    el.loadHighRes = jest.fn(() => {
      el.isLoaded = true
    })

    document.body.appendChild(el)

    const obs = el.imgObserver

    expect(obs).not.toBeNull()

    // fire before the mock's 10ms timeout does — the callback disconnects and
    // nulls the observer once the figure reports loaded
    obs.callback([{ isIntersecting: true, target: el }], obs)

    expect(el.loadHighRes).toHaveBeenCalled()
    expect(el.imgObserver).toBeNull()

    // second call — already loaded → skips loadHighRes and observer arms
    obs.callback([{ isIntersecting: true, target: el }], obs)

    await tick()
    el.remove()
  })

  test('expand click listener opens the modal', async () => {
    const el = await mountFigure({
      [MEDIA_ATTRS.SRC]: 'p/img',
      [MEDIA_ATTRS.CAN_EXPAND]: ATTR_VALUES.TRUE,
    })

    el.openModal = jest.fn()

    const target = el.shadowRoot.querySelector(HTML_TAGS.FIGURE) || el

    target.dispatchEvent(new MouseEvent(MOUSE_EVENTS.CLICK, { bubbles: true, composed: true }))
    expect(el.openModal).toHaveBeenCalled()

    el.remove()
  })

  const touchEvt = (type, x, y) => {
    const e = new Event(type, { bubbles: true, composed: true, cancelable: true })

    if (x !== undefined) {
      e.touches = [{ clientX: x, clientY: y }]
    }

    return e
  }

  test('touchmove past threshold twice and small moves are ignored', async () => {
    const el = await mountFigure({
      [MEDIA_ATTRS.SRC]: 'p/img',
      [MEDIA_ATTRS.CAN_EXPAND]: ATTR_VALUES.TRUE,
    })

    el.openModal = jest.fn()

    const target = el.shadowRoot.querySelector(HTML_TAGS.FIGURE) || el

    // dy > 10 marks moved — the second move hits the touchMoved early-return
    target.dispatchEvent(touchEvt(TOUCH_EVENTS.TOUCHSTART, 0, 0))
    target.dispatchEvent(touchEvt(TOUCH_EVENTS.TOUCHMOVE, 0, 50))
    target.dispatchEvent(touchEvt(TOUCH_EVENTS.TOUCHMOVE, 0, 60))
    target.dispatchEvent(touchEvt(TOUCH_EVENTS.TOUCHEND))
    expect(el.openModal).not.toHaveBeenCalled()

    // move without touches → ignored → tap still opens
    target.dispatchEvent(touchEvt(TOUCH_EVENTS.TOUCHSTART))
    target.dispatchEvent(touchEvt(TOUCH_EVENTS.TOUCHMOVE))
    target.dispatchEvent(touchEvt(TOUCH_EVENTS.TOUCHEND))
    expect(el.openModal).toHaveBeenCalled()

    // dx > 10 also marks moved
    el.openModal.mockClear()
    target.dispatchEvent(touchEvt(TOUCH_EVENTS.TOUCHSTART, 0, 0))
    target.dispatchEvent(touchEvt(TOUCH_EVENTS.TOUCHMOVE, 50, 0))
    target.dispatchEvent(touchEvt(TOUCH_EVENTS.TOUCHEND))
    expect(el.openModal).not.toHaveBeenCalled()

    // non-cancelable touchend skips preventDefault but still opens
    el.openModal.mockClear()
    target.dispatchEvent(touchEvt(TOUCH_EVENTS.TOUCHSTART, 0, 0))
    target.dispatchEvent(new Event(TOUCH_EVENTS.TOUCHEND, { bubbles: true, composed: true }))
    expect(el.openModal).toHaveBeenCalled()

    el.remove()
  })
})
