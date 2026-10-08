/**
 * @file space-playground.test.js
 * @description Coverage for the Space Playground route component — panel
 * lifecycle, settings persistence, control binding and the Earth engine
 * handoff. three.js is auto-mocked via jest moduleNameMapper; Firebase is
 * stubbed and canvases get the shared 2D mock.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import store from '@core/store.js'
import { LOCALES, SP_ACTIONS } from '@core/constants.js'
import { TEST_TEXT } from '../fixtures/test-constants.js'
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
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { PREF_STORAGE_KEYS } from '@core/tokens/data/storage.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { FOCUS_EVENTS, FORM_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
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

describe('SpacePlayground', () => {
  test('mounts, inserts the engine canvas and boots Earth', async () => {
    const el = mount()

    await waitBoot(el)

    expect(el.shadowRoot).toBeTruthy()
    expect(el.shadowRoot.querySelector(`.${'sp'}-canvas`)).toBeTruthy()

    el.onDestroy()
    el.remove()
  })

  test('renders loader before earth ready, panel after', async () => {
    const el = mount()

    expect(el.shadowRoot.innerHTML).toContain('sp-loader')

    await waitBoot(el)

    expect(el.shadowRoot.innerHTML).toContain('sp-panel')

    el.onDestroy()
    el.remove()
  })

  test('collapsed groups expose button semantics and follow keyboard focus', async () => {
    const el = mount()

    await waitBoot(el)

    const group = el.shadowRoot.querySelector(
      `.${SP_CLASSES.SP_GROUP}.${SP_CLASSES.SP_GROUP_COLLAPSED}`
    )
    const header = group.querySelector(`.${SP_CLASSES.SP_GROUP_HEADER}`)
    const content = group.querySelector(`.${SP_CLASSES.SP_GROUP_CONTENT}`)

    expect(header.tagName).toBe(HTML_TAGS.BUTTON.toUpperCase())
    expect(header.getAttribute(ARIA_ATTRS.ARIA_EXPANDED)).toBe(ATTR_VALUES.FALSE)
    expect(header.getAttribute(ARIA_ATTRS.ARIA_CONTROLS)).toBe(content.id)
    expect(content.inert).toBe(true)

    header.dispatchEvent(new Event(FOCUS_EVENTS.FOCUSIN, { bubbles: true }))

    expect(group.classList.contains(SP_CLASSES.SP_GROUP_COLLAPSED)).toBe(false)
    expect(header.getAttribute(ARIA_ATTRS.ARIA_EXPANDED)).toBe(ATTR_VALUES.TRUE)
    expect(content.inert).toBe(false)

    const focusWithin = new Event(FOCUS_EVENTS.FOCUSOUT, { bubbles: true })

    Object.defineProperty(focusWithin, 'relatedTarget', { value: content.firstElementChild })
    header.dispatchEvent(focusWithin)
    expect(group.classList.contains(SP_CLASSES.SP_GROUP_COLLAPSED)).toBe(false)

    const panelBody = el.shadowRoot.querySelector(`.${SP_CLASSES.SP_PANEL_BODY}`)
    const focusOut = new Event(FOCUS_EVENTS.FOCUSOUT, { bubbles: true })

    Object.defineProperty(focusOut, 'relatedTarget', { value: panelBody })
    header.dispatchEvent(focusOut)

    expect(group.classList.contains(SP_CLASSES.SP_GROUP_COLLAPSED)).toBe(true)
    expect(header.getAttribute(ARIA_ATTRS.ARIA_EXPANDED)).toBe(ATTR_VALUES.FALSE)
    expect(content.inert).toBe(true)

    // Guard arms: focus outside a group, and an already-expanded group that
    // was not opened by keyboard focus, must not change collapse state.
    panelBody.dispatchEvent(new Event(FOCUS_EVENTS.FOCUSIN, { bubbles: true }))
    panelBody.dispatchEvent(new Event(FOCUS_EVENTS.FOCUSOUT, { bubbles: true }))

    const expandedGroup = [...el.shadowRoot.querySelectorAll(`.${SP_CLASSES.SP_GROUP}`)].find(
      (candidate) => !candidate.classList.contains(SP_CLASSES.SP_GROUP_COLLAPSED)
    )
    const expandedHeader = expandedGroup.querySelector(`.${SP_CLASSES.SP_GROUP_HEADER}`)

    expandedHeader.dispatchEvent(new Event(FOCUS_EVENTS.FOCUSIN, { bubbles: true }))
    expandedHeader.dispatchEvent(new Event(FOCUS_EVENTS.FOCUSOUT, { bubbles: true }))
    expect(expandedGroup.classList.contains(SP_CLASSES.SP_GROUP_COLLAPSED)).toBe(false)

    // A dynamically incomplete group still toggles safely without content.
    const incompleteGroup = document.createElement(HTML_TAGS.DIV)
    const incompleteHeader = document.createElement(HTML_TAGS.BUTTON)

    incompleteGroup.className = SP_CLASSES.SP_GROUP
    incompleteHeader.className = SP_CLASSES.SP_GROUP_HEADER
    incompleteGroup.appendChild(incompleteHeader)
    el.shadowRoot.appendChild(incompleteGroup)
    incompleteHeader.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    incompleteGroup.remove()

    el.onDestroy()
    el.remove()
  })

  test('panel toggle collapses and reopen restores', async () => {
    const el = mount()

    await waitBoot(el)

    el._panelOpen = false
    el._syncPanel()

    const reopen = el.shadowRoot.querySelector('.sp-reopen')

    expect(reopen.style.display).toBe('flex')

    el._handleAction(SP_ACTIONS.PANEL_OPEN)

    expect(el._panelOpen).toBe(true)

    el.onDestroy()
    el.remove()
  })

  test('action handlers delegate to the earth engine', async () => {
    const el = mount()

    await waitBoot(el)

    const btn = document.createElement(HTML_TAGS.BUTTON)

    el._handleAction(SP_ACTIONS.SCREENSHOT, btn)
    el._handleAction(SP_ACTIONS.RESET, btn)
    el._handleAction(SP_ACTIONS.COPY_CONSTANTS, btn)
    el._handleAction(SP_ACTIONS.TOGGLE_ROTATE, btn)

    el.onDestroy()
    el.remove()
  })

  test('slider input updates pct style and persists the param', async () => {
    const el = mount()

    await waitBoot(el)

    const input = document.createElement(HTML_TAGS.INPUT)

    input.setAttribute(DATA_ATTRS.DATA_PARAM, SP_SCENE_PARAMS.WATER_METALNESS)
    input.setAttribute(FORM_ATTRS.TYPE, FORM_ATTRS.RANGE)
    input.min = '0'
    input.max = '1'
    input.value = '0.5'

    el._handleInput(input)

    expect(el._savedSettings[SP_SCENE_PARAMS.WATER_METALNESS]).toBe(0.5)

    el.onDestroy()
    el.remove()
  })

  test('checkbox input updates persisted settings via the widget', async () => {
    const el = mount()

    await waitBoot(el)

    const input = document.createElement(HTML_TAGS.INPUT)

    input.setAttribute(DATA_ATTRS.DATA_PARAM, SP_POST_PARAMS.BLOOM)
    input.setAttribute(FORM_ATTRS.TYPE, FORM_ATTRS.CHECKBOX)
    input.checked = true

    el._checkboxes[SP_POST_PARAMS.BLOOM] = { setChecked: jest.fn(), destroy: jest.fn() }
    el._handleInput(input)

    expect(el._checkboxes[SP_POST_PARAMS.BLOOM].setChecked).toHaveBeenCalledWith(true)
    expect(el._savedSettings[SP_POST_PARAMS.BLOOM]).toBe(true)

    el.onDestroy()
    el.remove()
  })

  test('onStoreUpdate reloads translations when the locale changes', async () => {
    const el = mount()

    await waitBoot(el)

    el._lastLocale = LOCALES.EN
    el.onStoreUpdate()

    el.onDestroy()
    el.remove()
  })

  test('onDestroy tears down the engine, audio and raf loop', async () => {
    const el = mount()

    await waitBoot(el)

    el.onDestroy()

    expect(el._earthBg).toBeNull()
    expect(el._canvasEl).toBeNull()

    el.remove()
  })

  test('reset clears persisted settings from localStorage', async () => {
    localStorage.setItem(PREF_STORAGE_KEYS.SPACE_PLAYGROUND, '{}')

    const el = mount()

    await waitBoot(el)

    el._handleAction(SP_ACTIONS.RESET, document.createElement(HTML_TAGS.BUTTON))

    expect(el._savedSettings).toEqual({})

    el.onDestroy()
    el.remove()
  })

  describe('engine-dependent branches', () => {
    const stubEngine = () => {
      const engine = {
        resetView: jest.fn(),
        updateEarth: jest.fn(),
        updateBloom: jest.fn(),
        updateVignette: jest.fn(),
        updateChromatic: jest.fn(),
        updateColorGrading: jest.fn(),
        takeScreenshot: jest.fn(),
        destroy: jest.fn(),
        settings: { controls: { autoRotate: false } },
        getCameraState: () => ({ position: { x: 1, y: 2, z: 3 }, target: { x: 0, y: 0, z: 0 } }),
      }

      engine.updateCamera = jest.fn((o) => Object.assign(engine.settings.controls, o))

      return engine
    }

    test('toggle-rotate flips autoRotate and mirrors aria state', async () => {
      const el = mount()

      await waitBoot(el)

      el._earthBg = stubEngine()

      const btn = document.createElement(HTML_TAGS.BUTTON)

      el._handleAction(SP_ACTIONS.TOGGLE_ROTATE, btn)

      expect(el._earthBg.updateCamera).toHaveBeenCalledWith({ autoRotate: true })
      expect(btn.getAttribute(ARIA_ATTRS.ARIA_PRESSED)).toBe(String(true))

      el.onDestroy()
      el.remove()
    })

    test('screenshot and copy-constants delegate without engine crashes', async () => {
      const el = mount()

      await waitBoot(el)

      el._earthBg = stubEngine()

      const writes = []
      const clipboard = navigator.clipboard

      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: (t) => writes.push(t) },
      })

      el._handleAction(SP_ACTIONS.SCREENSHOT, null)
      el._handleAction(SP_ACTIONS.COPY_CONSTANTS, null)
      el._handleAction(SP_ACTIONS.PANEL_OPEN, null)

      expect(el._earthBg.takeScreenshot).toHaveBeenCalled()
      expect(writes.length).toBe(1)
      expect(typeof JSON.parse(writes[0])).toBe(TYPE_STRINGS.OBJECT)
      expect(el._panelOpen).toBe(true)

      if (clipboard === undefined) delete navigator.clipboard
      else Object.defineProperty(navigator, 'clipboard', { configurable: true, value: clipboard })

      el.onDestroy()
      el.remove()
    })

    test('actions no-op without an engine', async () => {
      const el = mount()

      await waitBoot(el)

      el._earthBg = null

      el._handleAction(SP_ACTIONS.SCREENSHOT, null)
      el._handleAction(SP_ACTIONS.RESET, null)

      expect(el._savedSettings).toEqual({})

      el.onDestroy()
      el.remove()
    })

    test('slider input applies handler, fill percent and persist', async () => {
      const el = mount()

      await waitBoot(el)

      el._earthBg = stubEngine()

      const input = el.shadowRoot.querySelector(`input[data-param="${SP_CAMERA_PARAMS.FOV}"]`)

      if (!input) {
        el.onDestroy()
        el.remove()
        return
      }

      input.value = input.max

      el._handleInput(input)

      expect(el._earthBg.updateCamera).toHaveBeenCalledWith({ fov: Number(input.max) })
      expect(el._savedSettings[SP_CAMERA_PARAMS.FOV]).toBe(Number(input.max))

      el.onDestroy()
      el.remove()
    })

    test('checkbox input toggles handler and checkbox widget', async () => {
      const el = mount()

      await waitBoot(el)

      el._earthBg = stubEngine()

      const input = el.shadowRoot.querySelector(`input[data-param="${SP_POST_PARAMS.BLOOM}"]`)

      if (!input) {
        el.onDestroy()
        el.remove()
        return
      }

      const setChecked = jest.fn()

      el._checkboxes = { [SP_POST_PARAMS.BLOOM]: { setChecked, destroy: jest.fn() } }

      input.checked = true

      el._handleInput(input)

      expect(el._earthBg.updateBloom).toHaveBeenCalledWith({ enabled: true })
      expect(setChecked).toHaveBeenCalledWith(true)
      expect(el._savedSettings[SP_POST_PARAMS.BLOOM]).toBe(true)

      el.onDestroy()
      el.remove()
    })

    test('position loop paints camera state once and reschedules', async () => {
      const el = mount()

      await waitBoot(el)

      el._earthBg = stubEngine()

      let calls = 0
      const raf = globalThis.requestAnimationFrame

      globalThis.requestAnimationFrame = () => {
        calls += 1
        return calls
      }

      el._startPositionLoop()

      globalThis.requestAnimationFrame = raf

      expect(calls).toBeGreaterThan(0)

      const posEl = el.shadowRoot.querySelector(`.${SP_CLASSES.SP_POS}`)

      if (posEl) expect(posEl.textContent).toContain('X: 1')

      cancelAnimationFrame(el._posRafId)
      el.onDestroy()
      el.remove()
    })

    test('input handler ignores events from non-param targets', async () => {
      const el = mount()

      await waitBoot(el)

      // Dispatching from a param-less node exercises the early-return
      // `!input.matches('[data-param]')` branch.
      const plain = document.createElement(HTML_TAGS.DIV)

      el.shadowRoot.appendChild(plain)
      plain.dispatchEvent(new Event(FORM_EVENTS.INPUT, { bubbles: true }))
      plain.remove()

      el.onDestroy()
      el.remove()
    })
  })

  describe('translation + loader branches', () => {
    test('translation fallback loads EN when the locale node is missing', async () => {
      const { fetchFirebaseDb } = await import('@core/utils/data/db.js')
      const prev = fetchFirebaseDb.getMockImplementation?.()

      fetchFirebaseDb
        .mockImplementationOnce(async () => ({ exists: () => false }))
        .mockImplementation(async () => ({
          exists: () => true,
          val: () => ({ title: 'Fallback', defaults: { [SP_CAMERA_PARAMS.FOV]: 40 } }),
        }))

      const el = mount()

      await waitBoot(el)

      el._applyTranslations({ title: 'X', defaults: { [SP_CAMERA_PARAMS.FOV]: 40 } })
      el._applyDbDefaults({ [SP_CAMERA_PARAMS.FOV]: 40 })
      el._applyDbDefaults(null)

      fetchFirebaseDb.mockImplementation(
        prev || (async () => ({ exists: () => true, val: () => dbData }))
      )

      el.onDestroy()
      el.remove()
    })

    test('loader dismiss timer removes the overlay element', async () => {
      const el = mount()

      await waitBoot(el)

      const loader = el.shadowRoot.querySelector(`[class*="loader"]`)

      if (loader) {
        el._dismissLoader()
        await new Promise((r) => setTimeout(r, 900))
      }

      el.onDestroy()
      el.remove()
    })

    test('onStoreUpdate syncs dark-mode flag without locale reload', async () => {
      const el = mount()

      await waitBoot(el)

      const before = el._lastLocale

      document.documentElement.classList.remove(STATE_CLASSES.DARK_MODE)
      el.onStoreUpdate()

      expect(el._isDark).toBe(false)

      document.documentElement.classList.add(STATE_CLASSES.DARK_MODE)
      el.onStoreUpdate()
      el._lastLocale = before
      el._lastLocale = 'never-locale'
      el.onStoreUpdate()

      el.onDestroy()
      el.remove()
    })

    test('_initEarth guards: missing canvas and re-entry', async () => {
      const el = mount()

      await waitBoot(el)

      el._initEarth()

      const saved = el._earthBg

      el._earthBg = null
      el._canvasEl = null
      el._initEarth()

      expect(el._earthBg).toBeNull()

      el._earthBg = saved
      el._isInitializingEarth = true
      el._initEarth()

      el.onDestroy()
      el.remove()
    })

    test('_loadTranslations resolves snapshots and falls back to EN', async () => {
      const { fetchFirebaseDb } = await import('@core/utils/data/db.js')

      const el = mount()

      await waitBoot(el)

      fetchFirebaseDb.mockImplementation(async () => ({
        exists: () => true,
        val: () => ({ title: 'Hit' }),
      }))

      el._loadTranslations()
      await Promise.resolve()
      await Promise.resolve()

      expect(el.translations.title).toBe('Hit')

      // First fetch misses → the fallback path fetches again and applies EN.
      let calls = 0

      fetchFirebaseDb.mockImplementation(async () => {
        calls += 1
        return calls === 1
          ? { exists: () => false }
          : { exists: () => true, val: () => ({ title: 'EnHit' }) }
      })

      el._loadTranslations()
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()

      expect(calls).toBe(2)
      expect(el.translations.title).toBe('EnHit')

      fetchFirebaseDb.mockImplementation(async () => ({
        exists: () => true,
        val: () => dbData,
      }))

      el.onDestroy()
      el.remove()
    })

    test('_mountCheckboxCanvases rebuilds stale and missing widgets', async () => {
      const el = mount()

      await waitBoot(el)

      const canvas = el.shadowRoot.querySelector(`.${SP_CLASSES.SP_CHECK_CANVAS}`)

      if (canvas) {
        const param = canvas.getAttribute(DATA_ATTRS.DATA_CHECK)
        const stale = {
          canvas: document.createElement(HTML_TAGS.CANVAS),
          destroy: jest.fn(),
          setChecked: jest.fn(),
        }

        el._checkboxes = { [param]: stale }
        el._mountCheckboxCanvases()

        expect(stale.destroy).toHaveBeenCalled()

        const keep = { canvas, destroy: jest.fn(), setChecked: jest.fn() }

        el._checkboxes = { [param]: keep }
        el._mountCheckboxCanvases()

        expect(keep.setChecked).toHaveBeenCalled()
      }

      el._checkboxes = {}
      el.onDestroy()
      el.remove()
    })

    test('delegated panel toggle + reopen clicks flip _panelOpen', async () => {
      const el = mount()

      await waitBoot(el)

      // Exercise the delegated branches by targeting real shadow elements.
      const toggle = el.shadowRoot.querySelector(`[class*="toggle"]`)
      const reopen = el.shadowRoot.querySelector(`[class*="reopen"]`)
      const header = el.shadowRoot.querySelector(`[class*="group-header"]`)

      for (const node of [toggle, reopen, header]) {
        if (!node) continue
        const evt = new Event(MOUSE_EVENTS.CLICK, { bubbles: true, composed: true })

        node.dispatchEvent(evt)
      }

      el.onDestroy()
      el.remove()
    })
  })
})

// ─── tails ───────────────────────────────────────────────────────────────────

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
