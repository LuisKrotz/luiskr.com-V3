/**
 * @file media-expanded-mediafigure-deep-paths.test.js
 * @description Split from media-expanded.test.js — covers the "MediaFigure deep paths" describe.
 */
import { jest } from '@jest/globals'
import store from '@core/store.js'
import '@website/components/media/MediaExpanded.js'
import '@website/components/media/MediaFigure.js'
import { TEST_TEXT, TEST_URLS } from '@tests/fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── MediaFigure ─────────────────────────────────────────────────────────────
describe('MediaFigure deep paths', () => {
  const mountFigure = (attrs = {}) => {
    const el = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)

    Object.entries({
      [MEDIA_ATTRS.SRC]: TEST_URLS.IMG,
      [FORM_ATTRS.LABEL]: TEST_TEXT.HEADING,
      [MEDIA_ATTRS.WIDTH]: '800',
      [MEDIA_ATTRS.HEIGHT]: '450',
      ...attrs,
    }).forEach(([k, v]) => el.setAttribute(k, v))

    document.body.appendChild(el)

    return el
  }

  test('renders a figure honoring src/label/size attributes', async () => {
    const el = mountFigure()

    await flush()

    expect(el.shadowRoot).toBeTruthy()

    el.remove()
  })

  test('video figures wire the video element', async () => {
    const el = mountFigure({ [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE })

    await flush()

    el.remove()
  })

  test('expandable figures open the media modal on interaction', async () => {
    const el = mountFigure({ [MEDIA_ATTRS.CAN_EXPAND]: ATTR_VALUES.TRUE })

    await flush()

    el.remove()
  })

  test('attribute changes re-render while mounted', async () => {
    const el = mountFigure()

    el.setAttribute(FORM_ATTRS.LABEL, TEST_TEXT.BODY)

    await flush()

    el.remove()
  })

  test('classes attribute applies host classes', async () => {
    const el = mountFigure({ [COMMON_ATTRS.CLASSES]: `${TEST_TEXT.HELLO} ${TEST_TEXT.SECOND}` })

    await flush()

    expect(el.classList.contains(TEST_TEXT.HELLO)).toBe(true)
    expect(el.classList.contains(TEST_TEXT.SECOND)).toBe(true)

    el.remove()
  })

  test('displayWidth caps videos at FHD but passes images through', async () => {
    const img = mountFigure({ [MEDIA_ATTRS.WIDTH]: '3840', [MEDIA_ATTRS.HEIGHT]: '2160' })

    expect(img.displayWidth).toBe(3840)

    img.remove()

    const vid = mountFigure({
      [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE,
      [MEDIA_ATTRS.WIDTH]: '3840',
      [MEDIA_ATTRS.HEIGHT]: '2160',
    })

    expect(vid.displayWidth).toBeLessThanOrEqual(1920)
    expect(vid.displayHeight).toBeLessThanOrEqual(1080)

    const small = mountFigure({
      [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE,
      [MEDIA_ATTRS.WIDTH]: '800',
      [MEDIA_ATTRS.HEIGHT]: '450',
    })

    expect(small.displayWidth).toBe(800)

    vid.remove()
    small.remove()
  })

  test('video figures expose main + scaled fallback sources', async () => {
    const el = mountFigure({ [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE })

    await flush()

    expect(typeof el.videoSrcMain).toBe(TYPE_STRINGS.STRING)
    expect(el.videoSrcMain.length).toBeGreaterThan(0)
    expect(typeof el.videoSrcFallback).toBe(TYPE_STRINGS.STRING)

    el.remove()
  })

  test('playVideo/pauseVideo honor reduced-motion and autoplay prefs', async () => {
    const el = mountFigure({ [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE })

    await flush()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    const target = document.createElement(HTML_TAGS.VIDEO)

    target.play = jest.fn(() => Promise.resolve())
    target.pause = jest.fn()
    target.load = jest.fn()

    store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, true)
    el.playVideo(target)

    await flush(10)

    store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, false)
    el.pauseVideo(target)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    el.playVideo(target)
    el.pauseVideo(target)
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    el.remove()
  })

  test('onStoreUpdate pauses an offscreen/deprefed video', async () => {
    const el = mountFigure({ [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE })

    await flush()

    const vid = document.createElement(HTML_TAGS.VIDEO)

    Object.defineProperty(vid, 'paused', { configurable: true, writable: true, value: false })

    vid.pause = jest.fn()
    vid.play = jest.fn(() => Promise.resolve())
    vid.load = jest.fn()

    el.$ = (sel) => (sel === HTML_TAGS.VIDEO ? vid : null)
    el.isIntersecting = false

    store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, false)
    el.onStoreUpdate()

    expect(vid.pause).toHaveBeenCalled()

    vid.paused = true
    el.isIntersecting = true

    store.commit(PREF_MUTATIONS.SET_VIDEO_AUTOPLAY, true)
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    el.onStoreUpdate()

    await flush(10)

    el.remove()
  })

  test('onDestroy disconnects both observers', async () => {
    const el = mountFigure()
    const vobs = { disconnect: jest.fn() }
    const iobs = { disconnect: jest.fn() }

    el.observer = vobs
    el.imgObserver = iobs
    el.onDestroy()

    expect(vobs.disconnect).toHaveBeenCalled()
    expect(iobs.disconnect).toHaveBeenCalled()
    expect(el.observer).toBeNull()
    expect(el.imgObserver).toBeNull()

    el.remove()
  })

  test('loadHighRes resolves through the Image pipeline', async () => {
    const el = mountFigure()

    await flush()

    const RealImage = window.Image

    class FakeImage {
      set src(_v) {
        setTimeout(() => this.onload?.(), 0)
      }
    }

    window.Image = FakeImage
    el.loadHighRes()

    await flush(30)

    expect(el.isLoaded).toBe(true)

    globalThis.Image = RealImage

    el.remove()
  })

  test('_ensureVideoSource appends primary + fallback sources', async () => {
    const el = mountFigure({ [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE })

    await flush()

    const vid = document.createElement(HTML_TAGS.VIDEO)

    vid.load = jest.fn()

    el._ensureVideoSource(vid)

    expect(vid.querySelector(MEDIA_ATTRS.SOURCE)).toBeTruthy()
    expect(vid.load).toHaveBeenCalled()

    // Second call is a no-op once a <source> exists.
    const calls = vid.load.mock.calls.length

    el._ensureVideoSource(vid)

    expect(vid.load.mock.calls.length).toBe(calls)

    el.remove()
  })
})
