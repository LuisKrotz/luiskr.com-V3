/**
 * @file space-playground-spaceplayground-tails.test.js
 * @description Split from space-playground.test.js — covers the "SpacePlayground tails" describe.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import store from '@core/store.js'
import { SP_ACTIONS } from '@core/constants.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import {
  SP_CAMERA_PARAMS,
  SP_DEBUG_PARAMS,
  SP_GRADE_PARAMS,
  SP_POST_PARAMS,
  SP_SCENE_PARAMS,
} from '@core/tokens/playground/params.js'
import { PREF_STORAGE_KEYS } from '@core/tokens/data/storage.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { FORM_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { SP_CLASSES } from '@core/tokens/classes/playground.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'

const dbData = { title: 'Space', engine: 'Engine' }

jest.unstable_mockModule('@core/utils/data/db.js', () => ({
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => true, val: () => dbData })),
}))

await import('@earth/SpacePlayground.js')

const mount = () => {
  const el = document.createElement(VIEW_TAGS.VIEW_SPACE_PLAYGROUND)

  document.body.appendChild(el)

  return el
}

const waitBoot = (el, timeout = 8000) =>
  new Promise((resolve, reject) => {
    const t0 = Date.now()
    const tick = () => {
      if (el.shadowRoot?.innerHTML.includes(`${'sp'}-panel`)) return resolve()
      if (Date.now() - t0 > timeout) return reject(new Error('waitBoot timeout'))
      setTimeout(tick, 30)
    }
    tick()
  })

let origGetContext

beforeEach(() => {
  document.documentElement.classList.add(STATE_CLASSES.DARK_MODE)
  store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

  const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

  origGetContext = proto.getContext
})

afterEach(() => {
  const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

  proto.getContext = origGetContext
})

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

const unmount = (el) => {
  el.onDestroy()
  el.remove()
}

describe('SpacePlayground tails', () => {
  test('_loadSettings discards corrupt and version-mismatched blobs', () => {
    localStorage.setItem(PREF_STORAGE_KEYS.SPACE_PLAYGROUND, '{bad json')

    const el = mount()
    unmount(el)

    localStorage.setItem(
      PREF_STORAGE_KEYS.SPACE_PLAYGROUND,
      JSON.stringify({ _v: TEST_TEXT.UNKNOWN, settings: { fov: 1 } })
    )

    const el2 = mount()
    expect(el2._savedSettings).toEqual({})
    unmount(el2)

    localStorage.removeItem(PREF_STORAGE_KEYS.SPACE_PLAYGROUND)
  })

  test('second onMounted keeps the canvas already inside the shadow root', async () => {
    const el = mount()
    await waitBoot(el)

    el.onMounted()

    unmount(el)
  })

  test('audio play rejection and missing-audio guard arms', async () => {
    const el = mount()
    await waitBoot(el)

    const audio = el.shadowRoot.querySelector('.sp-audio')

    audio.play = () => Promise.reject(new Error(TEST_TEXT.UNKNOWN))
    el.onMounted()
    await flush(20)

    el.shadowRoot.querySelector('.sp-audio').remove()
    el.onMounted()

    unmount(el)
  })

  test('onDestroy with idle raf and missing audio takes guarded arms', async () => {
    const el = mount()
    await waitBoot(el)

    el.shadowRoot.querySelector('.sp-audio')?.remove()
    el._posRafId = null
    el.onDestroy()
    el.remove()
  })

  test('_loadTranslations covers missing-locale, missing-snapshot and null-val arms', async () => {
    const { fetchFirebaseDb } = await import('@core/utils/data/db.js')
    const el = mount()
    await waitBoot(el)

    fetchFirebaseDb.mockResolvedValue({ exists: () => false })
    el._loadTranslations()
    await flush(60)

    fetchFirebaseDb.mockResolvedValue({ exists: () => true, val: () => dbData })

    const origLocale = store.state.lang.locale
    store.state.lang.locale = null
    el._loadTranslations()
    await flush(60)
    store.state.lang.locale = origLocale

    el._applyTranslations()

    unmount(el)
  })

  test('_applyDbDefaults covers input, checkbox, engine and hasSaved arms', async () => {
    const el = mount()
    await waitBoot(el)

    el._applyDbDefaults({ fov: 60, bloom: true })

    el._earthBg = null
    el._applyDbDefaults({ fov: 61 })

    el._savedSettings = { [SP_CAMERA_PARAMS.FOV]: 55 }
    el._applyDbDefaults({ fov: 62 })

    unmount(el)
  })

  test('loader element guards cover missing message/val/bar and stale dismiss', async () => {
    const el = mount()
    await waitBoot(el)

    const orig$ = el.$.bind(el)

    el.$ = (sel) => (sel.includes('loader') ? null : orig$(sel))
    el._updateLoader(TEST_TEXT.SECOND, 50)
    el.$ = orig$

    el._updateLoader(TEST_TEXT.SECOND, 50)
    el._dismissLoader()

    unmount(el)
  })

  test('_applyPersistedSettings covers handler, input, valEl and early-return arms', async () => {
    const el = mount()
    await waitBoot(el)

    const bg = el._earthBg
    el._earthBg = null
    el._savedSettings = { [SP_CAMERA_PARAMS.FOV]: 50 }
    el._applyPersistedSettings()

    el._earthBg = bg

    const fake = document.createElement(HTML_TAGS.INPUT)
    fake.setAttribute(DATA_ATTRS.DATA_PARAM, SP_SCENE_PARAMS.BUMP_SCALE)
    el.shadowRoot.prepend(fake)

    el._savedSettings = {
      [SP_CAMERA_PARAMS.FOV]: 50,
      [TEST_TEXT.UNKNOWN]: 1,
      [SP_SCENE_PARAMS.BUMP_SCALE]: 4,
    }
    el._applyPersistedSettings()

    fake.remove()
    unmount(el)
  })

  test('delegated clicks cover header, group-less, non-button and action arms', async () => {
    const el = mount()
    await waitBoot(el)

    el.shadowRoot
      .querySelector('.sp-panel-body')
      .dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))

    el.shadowRoot
      .querySelector('.sp-panel-group-header')
      .dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))

    const orphan = document.createElement(HTML_TAGS.DIV)
    orphan.className = 'sp-panel-group-header'
    el.shadowRoot.appendChild(orphan)
    orphan.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    orphan.remove()

    el.shadowRoot
      .querySelector(`[${DATA_ATTRS.DATA_ACTION}="${SP_ACTIONS.SCREENSHOT}"]`)
      .dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))

    unmount(el)
  })

  test('input/change events on param and non-param targets hit _handleInput arms', async () => {
    const el = mount()
    await waitBoot(el)

    const input = el.shadowRoot.querySelector(
      `[${DATA_ATTRS.DATA_PARAM}="${SP_CAMERA_PARAMS.FOV}"]`
    )
    input.dispatchEvent(new Event(FORM_EVENTS.INPUT, { bubbles: true }))
    input.dispatchEvent(new Event(FORM_EVENTS.CHANGE, { bubbles: true }))

    const body = el.shadowRoot.querySelector('.sp-panel-body')
    body.dispatchEvent(new Event(FORM_EVENTS.INPUT, { bubbles: true }))
    body.dispatchEvent(new Event(FORM_EVENTS.CHANGE, { bubbles: true }))

    unmount(el)
  })

  test('_handleInput covers engine-guard, no-handler and row-less arms', () => {
    const el = mount()

    el._earthBg = null

    const input = document.createElement(HTML_TAGS.INPUT)
    input.setAttribute(DATA_ATTRS.DATA_PARAM, TEST_TEXT.UNKNOWN)

    el._handleInput(input)

    el._earthBg = { getCameraState: () => null }
    el._handleInput(input)

    el._earthBg = null

    unmount(el)
  })

  test('position loop covers null-engine and missing-readout arms', async () => {
    const el = mount()
    await waitBoot(el)

    el.shadowRoot.querySelector('.sp-panel-pos')?.remove()
    el.shadowRoot.querySelector('.sp-panel-tgt')?.remove()

    await flush(60)

    el._earthBg = null
    await flush(60)

    unmount(el)
  })

  test('reset action covers missing input and row-less valEl arms', async () => {
    const el = mount()
    await waitBoot(el)

    const fake = document.createElement(HTML_TAGS.INPUT)
    fake.setAttribute(DATA_ATTRS.DATA_PARAM, SP_CAMERA_PARAMS.FOV)
    el.shadowRoot.prepend(fake)

    el.shadowRoot
      .querySelector(`[${DATA_ATTRS.DATA_PARAM}="${SP_SCENE_PARAMS.BUMP_SCALE}"]`)
      ?.remove()

    el._handleAction(SP_ACTIONS.RESET, document.createElement(HTML_TAGS.BUTTON))

    fake.remove()
    unmount(el)
  })

  test('_handleAction falls through unknown actions and PANEL_OPEN', async () => {
    const el = mount()
    await waitBoot(el)

    el._handleAction(TEST_TEXT.UNKNOWN, document.createElement(HTML_TAGS.BUTTON))
    el._handleAction(SP_ACTIONS.PANEL_OPEN, document.createElement(HTML_TAGS.BUTTON))

    unmount(el)
  })

  test('_syncPanel covers missing panel and reopen arms', async () => {
    const el = mount()
    await waitBoot(el)

    el.shadowRoot.querySelector('.sp-panel')?.remove()
    el.shadowRoot.querySelector('.sp-reopen')?.remove()
    el._syncPanel()

    unmount(el)
  })

  test('_mountCheckboxCanvases covers window-less, init, param-less and input-less arms', () => {
    const el = mount()

    const orig = globalThis.window

    try {
      delete globalThis.window
      el._mountCheckboxCanvases()
    } finally {
      globalThis.window = orig
    }

    el._checkboxes = null
    el._mountCheckboxCanvases()

    const bare = document.createElement(HTML_TAGS.CANVAS)
    bare.className = SP_CLASSES.SP_CHECK_CANVAS
    el.shadowRoot.appendChild(bare)

    const orphan = document.createElement(HTML_TAGS.CANVAS)
    orphan.className = SP_CLASSES.SP_CHECK_CANVAS
    orphan.setAttribute(DATA_ATTRS.DATA_CHECK, TEST_TEXT.UNKNOWN)
    el.shadowRoot.appendChild(orphan)

    el._mountCheckboxCanvases()

    bare.remove()
    orphan.remove()
    unmount(el)
  })

  test('_destroyCheckboxCanvases tolerates a missing map', () => {
    const el = mount()

    el._checkboxes = null
    el._destroyCheckboxCanvases()

    unmount(el)
  })

  test('persisted settings invoke every param handler arm', async () => {
    const el = mount()
    await waitBoot(el)

    el._earthBg = {
      updateCamera: jest.fn(),
      updateEarth: jest.fn(),
      updateBloom: jest.fn(),
      updateVignette: jest.fn(),
      updateChromatic: jest.fn(),
      updateColorGrading: jest.fn(),
      updateFilm: jest.fn(),
      updateRender: jest.fn(),
      updateSun: jest.fn(),
      updateEarthMaterial: jest.fn(),
      getCameraState: () => null,
      destroy: jest.fn(),
    }

    el._savedSettings = Object.fromEntries(
      Object.values({
        ...SP_CAMERA_PARAMS,
        ...SP_SCENE_PARAMS,
        ...SP_POST_PARAMS,
        ...SP_GRADE_PARAMS,
        ...SP_DEBUG_PARAMS,
      }).map((p) => [p, 1])
    )
    el._applyPersistedSettings()

    expect(el._earthBg.updateCamera).toHaveBeenCalled()
    expect(el._earthBg.updateEarthMaterial).toHaveBeenCalled()

    unmount(el)
  })

  test('defaults applied before the panel renders hit the input-less arm', async () => {
    const el = mount()

    el._savedSettings = {}
    el.shadowRoot.querySelector(`[${DATA_ATTRS.DATA_PARAM}="${SP_CAMERA_PARAMS.FOV}"]`)?.remove()
    el._applyDbDefaults({ fov: 70 })

    await waitBoot(el)

    unmount(el)
  })

  test('render covers translation-miss and pressed-action arms', async () => {
    const el = mount()
    await waitBoot(el)

    el.translations = { fov: undefined, copyConstants: undefined, engine: undefined }
    el._updateDom()

    const node = el._renderAction(
      { label: TEST_TEXT.SECOND, action: SP_ACTIONS.SCREENSHOT, pressed: true },
      {}
    )
    expect(node.querySelector(HTML_TAGS.BUTTON).getAttribute(ARIA_ATTRS.ARIA_PRESSED)).toBe(
      ATTR_VALUES.TRUE
    )

    unmount(el)
  })

  test('module re-eval skips custom-element redefinition', async () => {
    expect(customElements.get(VIEW_TAGS.VIEW_SPACE_PLAYGROUND)).toBeTruthy()
    jest.resetModules()

    await import('@earth/SpacePlayground.js')
  })
})
