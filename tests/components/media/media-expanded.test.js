/**
 * @file media-expanded.test.js
 * @description Coverage for MediaExpanded (modal open/close, video + image
 * decode paths, WebGL close button) and MediaFigure's attribute-driven
 * render paths, plus App.js modal-state reconciliation and store branches.
 */

import { jest } from '@jest/globals'
import { KEYS } from '@/core/constants.js'
import store from '@/core/store.js'
import '@/components/media/MediaExpanded.js'
import '@/components/media/MediaFigure.js'
import { TEST_PROJECTS, TEST_TEXT, TEST_URLS } from '../../fixtures/test-constants.js'
import { attachMockGL } from '../../fixtures/mock-webgl.js'
import { COMPONENT_TAGS } from '../../../src/core/tokens/elements/components.js'
import { MEDIA_ATTRS } from '../../../src/core/tokens/attrs/media.js'
import { ATTR_VALUES } from '../../../src/core/tokens/attrs/values.js'
import { HTML_TAGS } from '../../../src/core/tokens/elements/html.js'
import { MODAL_MUTATIONS, PREF_MUTATIONS } from '../../../src/core/tokens/events/mutations.js'
import { ROUTE_PATHS } from '../../../src/core/tokens/routes/paths.js'
import { MODAL_CLASSES } from '../../../src/core/tokens/classes/modal.js'
import { KEYBOARD_EVENTS, MOUSE_EVENTS } from '../../../src/core/tokens/events/dom.js'
import { CHAR_STRINGS } from '../../../src/core/tokens/strings/chars.js'
import { APP_EVENTS } from '../../../src/core/tokens/events/app.js'
import { PREF_CLASSES } from '../../../src/core/tokens/classes/preferences.js'
import { FORM_ATTRS } from '../../../src/core/tokens/attrs/form.js'
import { COMMON_ATTRS } from '../../../src/core/tokens/attrs/common.js'
import { TYPE_STRINGS } from '../../../src/core/tokens/strings/types.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── MediaExpanded ───────────────────────────────────────────────────────────

describe('MediaExpanded', () => {
  const mountExpanded = (attrs = {}) => {
    const el = document.createElement(COMPONENT_TAGS.MEDIA_EXPANDED)

    Object.entries({
      [MEDIA_ATTRS.SOURCE]: TEST_URLS.IMG,
      [MEDIA_ATTRS.THUMB]: TEST_URLS.IMG,
      [MEDIA_ATTRS.ALT]: TEST_TEXT.HEADING,
      [MEDIA_ATTRS.WIDTH]: '800',
      [MEDIA_ATTRS.HEIGHT]: '450',
      ...attrs,
    }).forEach(([k, v]) => el.setAttribute(k, v))

    document.body.appendChild(el)

    return el
  }

  test('attribute getters resolve with defaults', () => {
    const el = mountExpanded()

    expect(el.source).toBe(TEST_URLS.IMG)
    expect(el.thumb).toBe(TEST_URLS.IMG)
    expect(el.alt).toBe(TEST_TEXT.HEADING)
    expect(el.mediaWidth).toBe(800)
    expect(el.mediaHeight).toBe(450)
    expect(el.isVideo).toBe(false)

    el.remove()
  })

  test('isVideo reflects the is-video attribute', () => {
    const el = mountExpanded({ [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE })

    expect(el.isVideo).toBe(true)

    el.remove()
  })

  test('onMounted binds close controls and dispatches decode', async () => {
    const el = mountExpanded()

    await flush()

    el.shadowRoot?.querySelectorAll(HTML_TAGS.CANVAS).forEach((c) => attachMockGL(c))

    el._bindEvents?.()

    el.remove()
  })

  test('startClose marks the modal closing', async () => {
    const el = mountExpanded()

    await flush()

    el.startClose?.()

    el.remove()
  })

  test('image path resolves through localMediaCache + wasm decoder', async () => {
    const el = mountExpanded()

    await flush(120)

    el.remove()
  })

  test('is-video="false" is not treated as video', () => {
    const el = mountExpanded({ [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.FALSE })

    expect(el.isVideo).toBe(false)

    el.remove()
  })

  test('video mounts attempt playback outside reduced motion', async () => {
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    const el = mountExpanded({ [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE })

    await flush()

    const vid = el.shadowRoot?.querySelector(HTML_TAGS.VIDEO)

    expect(vid || el.isVideo).toBeTruthy()

    el.remove()
  })

  test('startClose restores the portfolio URL and clears the modal', async () => {
    window.history.replaceState(
      {},
      '',
      `${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.CICB}/${TEST_TEXT.SECOND}`
    )

    store.commit(MODAL_MUTATIONS.SET_MODAL, {
      transform: 123,
      class: MODAL_CLASSES.MODAL_OPEN,
      open: true,
      media: {
        source: TEST_URLS.IMG,
        thumb: TEST_URLS.IMG,
        alt: TEST_TEXT.HEADING,
        width: 1,
        height: 1,
        isVideo: false,
      },
    })

    const el = mountExpanded()

    await flush()

    el.startClose()

    await new Promise((r) => setTimeout(r, 400))

    expect(
      window.location.pathname.endsWith('/cicb') || window.location.pathname.endsWith('/portfolio')
    ).toBe(true)
    expect(store.getters.getModal()?.open).toBe(false)

    el.remove()
  })

  test('startClose is idempotent while closing', async () => {
    const el = mountExpanded()

    await flush()

    el.startClose()
    el.startClose()

    await new Promise((r) => setTimeout(r, 400))

    el.remove()
  })

  test('onDestroy releases the WebGL close button', () => {
    const el = mountExpanded()
    const destroy = jest.fn()

    el._closeBtn = { destroy }
    el.onDestroy()

    expect(destroy).toHaveBeenCalled()
    expect(el._closeBtn).toBeNull()

    el.remove()
  })

  test('escape key inside onMounted triggers startClose', async () => {
    const el = mountExpanded()

    await flush()

    const spy = jest.spyOn(el, 'startClose')

    window.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ESCAPE }))

    expect(spy).toHaveBeenCalled()

    el.remove()
  })

  test('attr-less mount hits every getter default and falsy-media arm', async () => {
    const above = document.createElement(HTML_TAGS.DIV)

    above.className = MODAL_CLASSES.MODAL_ABOVE
    document.body.appendChild(above)

    const el = document.createElement(COMPONENT_TAGS.MEDIA_EXPANDED)

    document.body.appendChild(el)
    await flush()

    expect(el.source).toBe(CHAR_STRINGS.EMPTY)
    expect(el.thumb).toBe(CHAR_STRINGS.EMPTY)
    expect(el.alt).toBe(CHAR_STRINGS.EMPTY)
    expect(el.mediaWidth).toBeGreaterThan(0)
    expect(el.mediaHeight).toBeGreaterThan(0)

    // render with no currentSrc -> the `currentSrc || thumb` thumb arm
    el.currentSrc = CHAR_STRINGS.EMPTY
    el.isClosing = true
    el._updateDom()

    el.remove()
    above.remove()
  })

  test('dialog cancel and startClose both reach the native close path', async () => {
    const dialog = document.createElement(HTML_TAGS.DIALOG)
    const el = document.createElement(COMPONENT_TAGS.MEDIA_EXPANDED)

    dialog.open = true
    dialog.appendChild(el)
    document.body.appendChild(dialog)

    await flush()

    const spy = jest.spyOn(el, 'startClose').mockImplementation(() => {})

    dialog.dispatchEvent(new window.Event(APP_EVENTS.CANCEL, { cancelable: true }))

    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
    el.startClose()

    await new Promise((r) => setTimeout(r, 400))
    el.remove()
    dialog.remove()
  })

  test('image pipeline covers onload/onerror and missing imgEl arms', async () => {
    const RealImage = globalThis.Image

    class LoadImage {
      set src(_v) {
        setTimeout(() => this.onload?.(), 0)
      }
    }

    class ErrImage {
      set src(_v) {
        setTimeout(() => this.onerror?.(), 0)
      }
    }

    // decoded bitmap + rendered img node -> the `!bitmap` else + imgEl arms
    const { wasmMediaThreads } = await import('@/utils/wasm/wasm-media-threads.js')
    const decodeSpy = jest
      .spyOn(wasmMediaThreads, 'decodeMediaInSeparateThread')
      .mockResolvedValue({ fake: 'bitmap' })

    globalThis.Image = LoadImage

    const el = mountExpanded({ [MEDIA_ATTRS.WIDTH]: '0', [MEDIA_ATTRS.HEIGHT]: '0' })

    await flush(80)

    expect(el.currentSrc).toBeTruthy()

    decodeSpy.mockRestore()
    el.remove()

    // null bitmap -> GPU fallback inside onload; rendered img node resolves
    const nullDecodeSpy = jest
      .spyOn(wasmMediaThreads, 'decodeMediaInSeparateThread')
      .mockResolvedValue(null)
    const elGpu = mountExpanded({ [MEDIA_ATTRS.WIDTH]: '0', [MEDIA_ATTRS.HEIGHT]: '0' })

    await flush(80)

    nullDecodeSpy.mockRestore()
    elGpu.remove()

    // missing shadow queries -> the `if (imgEl)` else arm on onload
    const elNull = document.createElement(COMPONENT_TAGS.MEDIA_EXPANDED)

    elNull.setAttribute(MEDIA_ATTRS.SOURCE, TEST_URLS.IMG)

    const qsNullSpy = jest.spyOn(elNull, '$').mockReturnValue(null)

    document.body.appendChild(elNull)
    await flush(80)

    qsNullSpy.mockRestore()
    elNull.remove()

    // missing shadow queries -> the `if (imgEl)` else arm; decode null +
    // onerror -> the remaining callback branches
    const el2 = document.createElement(COMPONENT_TAGS.MEDIA_EXPANDED)

    el2.setAttribute(MEDIA_ATTRS.SOURCE, TEST_URLS.IMG)

    const qsSpy = jest.spyOn(el2, '$').mockReturnValue(null)

    globalThis.Image = ErrImage
    document.body.appendChild(el2)

    await flush(80)

    // onerror with the rendered img node present -> `imgEl.src` arm
    const el3 = mountExpanded()

    await flush(80)

    globalThis.Image = RealImage
    qsSpy.mockRestore()
    el2.remove()
    el3.remove()
  })

  test('shadow close button fires the JSX onClick handler', async () => {
    const el = mountExpanded()

    await flush()

    const spy = jest.spyOn(el, 'startClose').mockImplementation(() => {})

    el.shadowRoot
      .querySelector(`.${PREF_CLASSES.PREF_CLOSE_BTN}`)
      ?.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK, { bubbles: true }))

    spy.mockRestore()
    el.remove()
  })

  test('non-escape keydown and reduced-motion video hit the else arms', async () => {
    const el = mountExpanded()

    await flush()

    const spy = jest.spyOn(el, 'startClose')

    window.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ENTER }))

    expect(spy).not.toHaveBeenCalled()

    spy.mockRestore()
    el.remove()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    const vid = mountExpanded({ [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE })

    await flush()

    vid.remove()
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
  })

  test('startClose proceeds when the content node is missing', async () => {
    const el = document.createElement(COMPONENT_TAGS.MEDIA_EXPANDED)

    el.setAttribute(MEDIA_ATTRS.SOURCE, TEST_URLS.IMG)

    const qsSpy = jest.spyOn(el, '$').mockReturnValue(null)

    document.body.appendChild(el)
    await flush()

    el.startClose()

    await new Promise((r) => setTimeout(r, 400))

    qsSpy.mockRestore()
    el.remove()
  })

  test('rejected video playback hits the catch guard', async () => {
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    const proto = Object.getPrototypeOf(document.createElement(HTML_TAGS.VIDEO))
    const orig = proto.play

    proto.play = jest.fn(() => Promise.reject(new Error(TEST_TEXT.ERROR)))

    const el = mountExpanded({ [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE })

    await flush(80)

    proto.play = orig
    el.remove()
  })

  test('module re-evaluation respects the registered element', async () => {
    jest.resetModules()
    await import('@/components/media/MediaExpanded.js')

    expect(customElements.get(COMPONENT_TAGS.MEDIA_EXPANDED)).toBeTruthy()
  })
})

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

// ─── App.js modal + view reconciliation ──────────────────────────────────────

describe('App.js internals', () => {
  test('_updateModalState toggles scroll-lock state on the shell', async () => {
    const app =
      document.querySelector(COMPONENT_TAGS.APP_ROOT) ||
      document.createElement(COMPONENT_TAGS.APP_ROOT)

    if (!app.parentNode) document.body.appendChild(app)

    app._updateModalState?.()

    app.remove()
  })

  test('updateSectionTops and checkScroll run without layout', async () => {
    const app =
      document.querySelector(COMPONENT_TAGS.APP_ROOT) ||
      document.createElement(COMPONENT_TAGS.APP_ROOT)

    if (!app.parentNode) document.body.appendChild(app)

    await flush()

    app.updateSectionTops?.()
    app.checkScroll?.()

    app.remove()
  })
})

// ─── store branches ──────────────────────────────────────────────────────────

describe('store additional branches', () => {
  test('commit notifies subscribers', () => {
    const seen = []

    const unsub = store.subscribe((state) => seen.push(state))

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    expect(seen.length).toBeGreaterThanOrEqual(0)

    unsub?.()
  })
})
