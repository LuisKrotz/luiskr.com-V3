/**
 * @file media-progressive-mediafigure-tails.test.js
 * @description Split from media-progressive.test.js — covers the "MediaFigure tails" describe.
 */
import { jest } from '@jest/globals'
import '@website/components/media/MediaFigure.js'
import store from '@core/store.js'
import { TEST_PROJECTS, TEST_TEXT, TEST_URLS } from '@tests/fixtures/test-constants.js'
import { CDN_URLS } from '@core/tokens/media/urls.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { IMAGE_DIMENSIONS } from '@core/tokens/media/dimensions.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { INTERNAL_CLASSES } from '@core/tokens/classes/project.js'
import { MEDIA_CLASSES } from '@core/tokens/classes/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { MEDIA_EVENTS, MOUSE_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'

// Get the actual storage URL the store is configured with
// (production Firebase Storage URL — not a mock)
const _ACTUAL_STORAGE = store.getters.getStorage?.() || CDN_URLS.CDN_BASE

// ─── MediaFigure tails ───────────────────────────────────────────────────────
describe('MediaFigure tails', () => {
  const mount = (attrs = {}) => {
    const el = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)

    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)

    document.body.appendChild(el)

    return el
  }

  const videoAttrs = () => ({
    [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE,
    [MEDIA_ATTRS.SRC]: TEST_TEXT.SECOND,
    [MEDIA_ATTRS.CAN_EXPAND]: ATTR_VALUES.TRUE,
    [FORM_ATTRS.LABEL]: TEST_TEXT.HEADING,
  })

  const stubPaused = (vid, value) => {
    try {
      Object.defineProperty(vid, 'paused', { value, writable: true, configurable: true })
    } catch {
      vid.paused = value
    }
  }

  test('video listeners drive play, pause, loadeddata and error arms', async () => {
    const el = mount({ ...videoAttrs(), [MEDIA_ATTRS.WIDTH]: '0', [MEDIA_ATTRS.HEIGHT]: '0' })
    const vid = el.$(HTML_TAGS.VIDEO)

    expect(vid).toBeTruthy()

    vid.play = () => Promise.resolve()
    vid.pause = () => {}
    vid.load = () => {}

    vid.dispatchEvent(new window.Event(MOUSE_EVENTS.MOUSEENTER))
    await Promise.resolve()
    await Promise.resolve()

    vid.play = () => Promise.reject(new Error(CHAR_STRINGS.EMPTY))
    vid.dispatchEvent(new window.Event(MOUSE_EVENTS.MOUSEENTER))
    await Promise.resolve()
    await Promise.resolve()

    vid.dispatchEvent(new window.Event(MOUSE_EVENTS.MOUSELEAVE))
    vid.dispatchEvent(new window.Event(MEDIA_EVENTS.LOADEDDATA))

    vid.removeAttribute(MEDIA_ATTRS.POSTER)
    vid.dispatchEvent(new window.Event(WINDOW_EVENTS.ERROR))

    vid.setAttribute(MEDIA_ATTRS.POSTER, TEST_URLS.A)
    vid.dispatchEvent(new window.Event(WINDOW_EVENTS.ERROR))

    el.remove()
  })

  test('_ensureVideoSource covers early return, append and no-fallback arms', () => {
    const el = mount(videoAttrs())
    const vid = el.$(HTML_TAGS.VIDEO)

    vid.load = () => {}

    el._ensureVideoSource(vid)
    el._ensureVideoSource(null)

    vid.querySelectorAll(MEDIA_ATTRS.SOURCE).forEach((s) => s.remove())
    el._ensureVideoSource(vid)

    expect(vid.querySelectorAll(MEDIA_ATTRS.SOURCE).length).toBe(2)

    el.video = [TEST_URLS.A]

    vid.querySelectorAll(MEDIA_ATTRS.SOURCE).forEach((s) => s.remove())
    el._ensureVideoSource(vid)

    expect(vid.querySelectorAll(MEDIA_ATTRS.SOURCE).length).toBe(1)

    el.remove()
  })

  test('video observer arms: intersecting, leaving, paused guards', () => {
    const el = mount(videoAttrs())
    const vid = el.$(HTML_TAGS.VIDEO)

    vid.play = () => Promise.resolve()
    vid.pause = () => {}
    vid.load = () => {}

    const obs = el.observer

    expect(obs).toBeTruthy()

    stubPaused(vid, false)
    obs.callback([{ isIntersecting: false, target: vid }])
    obs.callback([{ isIntersecting: true, target: vid }])

    stubPaused(vid, true)
    obs.callback([{ isIntersecting: false, target: vid }])

    vid.play = () => Promise.reject(new Error(CHAR_STRINGS.EMPTY))
    obs.callback([{ isIntersecting: true, target: vid }])

    el.remove()
  })

  test('video mount under reduced motion skips the observer', () => {
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    const el = mount(videoAttrs())

    expect(el.observer).toBeNull()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    el.remove()
  })

  test('onStoreUpdate handles autoplay toggles and missing video', () => {
    const el = mount(videoAttrs())
    const vid = el.$(HTML_TAGS.VIDEO)

    vid.play = () => Promise.resolve()
    vid.pause = () => {}
    vid.load = () => {}

    el.playVideo(null)
    el.pauseVideo(null)

    const bareVid = mount(videoAttrs())
    const origVidQ = bareVid.$

    bareVid.$ = () => null
    bareVid.onMounted()
    bareVid.$ = origVidQ
    bareVid.remove()

    stubPaused(vid, false)
    store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, false)

    stubPaused(vid, true)
    el.onStoreUpdate()

    store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, true)

    vid.play = () => Promise.reject(new Error(CHAR_STRINGS.EMPTY))

    el.isIntersecting = true
    el.onStoreUpdate()

    el.isIntersecting = false
    el.onStoreUpdate()

    const origQ = el.$

    el.$ = () => null
    el.onStoreUpdate()
    el.$ = origQ

    const img = mount({ [MEDIA_ATTRS.SRC]: TEST_TEXT.SECOND })

    img.onStoreUpdate()
    img.remove()
    el.remove()
  })

  test('image observer arms: non-intersecting, loaded, disconnect guard', async () => {
    const el = mount({ [MEDIA_ATTRS.SRC]: TEST_TEXT.SECOND })
    const obs = el.imgObserver

    expect(obs).toBeTruthy()

    obs.callback([{ isIntersecting: false, target: el }])

    el.isLoaded = false
    obs.callback([{ isIntersecting: true, target: el }])

    el.isLoaded = true
    obs.callback([{ isIntersecting: true, target: el }])

    el.isLoaded = false
    el.imgObserver = null
    obs.callback([{ isIntersecting: true, target: el }])

    el.remove()

    const bare = mount({ [MEDIA_ATTRS.SRC]: TEST_TEXT.SECOND })
    const origQ = bare.$

    bare.$ = (sel) => (sel === `.${MEDIA_CLASSES.RENDER_MEDIA_HIGH}` ? null : origQ.call(bare, sel))
    bare.onMounted()

    bare.$ = () => null
    bare.onMounted()

    bare.remove()
  })

  test('loadHighRes covers every guard and finish arm', async () => {
    const overBudgetEdge = String(Math.sqrt(IMAGE_DIMENSIONS.MAX_DECODE_PIXELS) + 1)
    const el = mount({
      [MEDIA_ATTRS.SRC]: TEST_TEXT.SECOND,
      [MEDIA_ATTRS.WIDTH]: overBudgetEdge,
      [MEDIA_ATTRS.HEIGHT]: overBudgetEdge,
    })

    el.isLoaded = false
    await el.loadHighRes()

    const vid = mount(videoAttrs())

    vid.isLoaded = false
    await vid.loadHighRes()

    const loaded = mount({ [MEDIA_ATTRS.SRC]: TEST_TEXT.SECOND })

    loaded.isLoaded = true
    await loaded.loadHighRes()
    loaded.remove()

    const nan = mount({
      [MEDIA_ATTRS.SRC]: TEST_TEXT.SECOND,
      [MEDIA_ATTRS.WIDTH]: 'nan-x',
      [MEDIA_ATTRS.HEIGHT]: 'nan-y',
    })
    const origImage = window.Image
    let inst = null

    window.Image = class {
      constructor() {
        inst = this
      }
    }

    try {
      nan.isLoaded = false
      await nan.loadHighRes()

      nan.$(`.${MEDIA_CLASSES.RENDER_MEDIA_THUMB}`)?.remove()
      inst.onload()

      expect(nan.isLoaded).toBe(true)

      nan.isLoaded = false
      await nan.loadHighRes()
      inst.onerror()

      expect(nan.isLoaded).toBe(true)

      nan.isLoaded = false
      delete globalThis.Image

      await nan.loadHighRes()
    } finally {
      window.Image = origImage
      globalThis.Image = origImage
    }

    nan.remove()
    vid.remove()
    el.remove()
  })

  test('loadHighRes accepts tall narrow screenshots within the pixel budget', async () => {
    const squareEdge = Math.sqrt(IMAGE_DIMENSIONS.MAX_DECODE_PIXELS)
    const width = squareEdge / 2
    const height = IMAGE_DIMENSIONS.MAX_DECODE_PIXELS / width
    const el = mount({
      [MEDIA_ATTRS.SRC]: TEST_PROJECTS.NATHALIA_BOND,
      [MEDIA_ATTRS.WIDTH]: String(width),
      [MEDIA_ATTRS.HEIGHT]: String(height),
    })

    el.isLoaded = false
    await el.loadHighRes()

    expect(el.highResSrc).toContain(TEST_PROJECTS.NATHALIA_BOND)

    el.remove()
  })

  test('loadHighRes finish() takes the updateDom arms without a high element', async () => {
    const el = mount({ [MEDIA_ATTRS.SRC]: TEST_TEXT.SECOND })
    const origQ = el.$
    const origImage = window.Image
    let inst = null

    window.Image = class {
      constructor() {
        inst = this
      }
    }

    el.$ = (sel) => (sel === `.${MEDIA_CLASSES.RENDER_MEDIA_HIGH}` ? null : origQ.call(el, sel))

    try {
      el.isLoaded = false
      await el.loadHighRes()
      inst.onload()

      el.isLoaded = false
      el._isMounted = false

      await el.loadHighRes()
      inst.onload()
    } finally {
      el.$ = origQ
      window.Image = origImage
    }

    el.remove()
  })

  test('loadHighRes resolves without an Image constructor', async () => {
    const el = mount({ [MEDIA_ATTRS.SRC]: TEST_TEXT.SECOND })
    const origImage = window.Image
    const origGlobalImage = globalThis.Image
    let inst = null

    window.Image = null
    delete globalThis.Image

    try {
      el.isLoaded = false
      await el.loadHighRes()

      expect(el.isLoaded).toBe(true)

      globalThis.Image = class {
        constructor() {
          inst = this
        }
      }

      el.isLoaded = false
      await el.loadHighRes()
      inst?.onerror?.()
    } finally {
      window.Image = origImage
      globalThis.Image = origGlobalImage
    }

    el.remove()
  })

  test('openModal expands, deep-links and guards its branches', () => {
    const plain = mount({ [MEDIA_ATTRS.SRC]: TEST_TEXT.SECOND })

    plain.openModal()

    const vid = mount(videoAttrs())

    window.history.replaceState({}, '', `${ROUTE_PATHS.PORTFOLIO}${TEST_TEXT.SECOND}/media-old`)
    vid.openModal()

    const slug = vid.slugify(TEST_TEXT.HEADING)

    window.history.replaceState({}, '', `${ROUTE_PATHS.PORTFOLIO}${TEST_TEXT.SECOND}/${slug}`)
    vid.openModal()

    window.history.replaceState({}, '', ROUTE_PATHS.ABOUT)
    vid.openModal()

    window.history.replaceState({}, '', '/portfolio')
    vid.openModal()

    vid.removeAttribute(FORM_ATTRS.LABEL)
    vid.openModal()

    const img = mount({
      [MEDIA_ATTRS.SRC]: TEST_TEXT.SECOND,
      [MEDIA_ATTRS.CAN_EXPAND]: ATTR_VALUES.TRUE,
      [FORM_ATTRS.LABEL]: TEST_TEXT.HEADING,
    })

    img.openModal()

    vid.remove()
    img.remove()
    plain.remove()
  })

  test('render arms: hero classes, video preload and missing poster/fallback', () => {
    const hero = mount({
      ...videoAttrs(),
      [COMMON_ATTRS.CLASSES]: ` ${INTERNAL_CLASSES.INTERNAL_MAIN_ITEM} ${STATE_CLASSES.ACTIVE} `,
      [MEDIA_ATTRS.AUTO_PLAY]: ATTR_VALUES.TRUE,
    })

    hero.$(HTML_TAGS.FIGURE)?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    hero._updateDom()

    hero.video = [TEST_URLS.A]
    hero.poster = []
    hero._updateDom()

    hero.onInit()

    const wide = mount({
      ...videoAttrs(),
      [MEDIA_ATTRS.WIDTH]: '4000',
      [MEDIA_ATTRS.HEIGHT]: '2000',
    })

    expect(wide.displayHeight).toBeLessThan(2000)

    wide.remove()

    const img = mount({
      [MEDIA_ATTRS.SRC]: TEST_TEXT.SECOND,
      [COMMON_ATTRS.CLASSES]: ` ${INTERNAL_CLASSES.INTERNAL_MAIN_ITEM} ${STATE_CLASSES.ACTIVE} `,
      [FORM_ATTRS.LABEL]: TEST_TEXT.HEADING,
      [MEDIA_ATTRS.CAN_EXPAND]: ATTR_VALUES.TRUE,
    })

    img._updateDom()

    img.isLoaded = true
    img._updateDom()

    hero.remove()
    img.remove()
  })

  test('onDestroy disconnects live observers', () => {
    const vid = mount(videoAttrs())
    const img = mount({ [MEDIA_ATTRS.SRC]: TEST_TEXT.SECOND })

    vid.onDestroy()
    img.onDestroy()

    expect(vid.observer).toBeNull()
    expect(img.imgObserver).toBeNull()

    vid.remove()
    img.remove()
  })

  test('registration guard respects an existing custom element', async () => {
    jest.resetModules()

    await import('@website/components/media/MediaFigure.js')
  })
})
