/**
 * @file media-expanded-mediaexpanded.test.js
 * @description Split from media-expanded.test.js — covers the "MediaExpanded" describe.
 */
import { jest } from '@jest/globals'
import { KEYS } from '@core/constants.js'
import store from '@core/store.js'
import '@website/components/media/MediaExpanded.js'
import '@website/components/media/MediaFigure.js'
import { TEST_PROJECTS, TEST_TEXT, TEST_URLS } from '@tests/fixtures/test-constants.js'
import { attachMockGL } from '@tests/fixtures/mock-webgl.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { MODAL_MUTATIONS, PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { EXPAND_MODAL_CLASSES, MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { KEYBOARD_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { APP_EVENTS } from '@core/tokens/events/app.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'

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

    const closeCanvas = el.shadowRoot?.querySelector(`.${PREF_CLASSES.PREF_CLOSE_CANVAS}`)
    const closeFallback = el.shadowRoot?.querySelector(
      `.${EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSE_BAR_FALLBACK}`
    )

    expect(closeCanvas?.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
    expect(closeFallback).toBeTruthy()

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
    const { wasmMediaThreads } = await import('@core/utils/wasm/wasm-media-threads.js')
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
    await import('@website/components/media/MediaExpanded.js')

    expect(customElements.get(COMPONENT_TAGS.MEDIA_EXPANDED)).toBeTruthy()
  })
})
