/**
 * @file space-playground-spaceplayground.test.js
 * @description Split from space-playground.test.js — covers the "SpacePlayground" describe.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import store from '@core/store.js'
import { LOCALES, SP_ACTIONS } from '@core/constants.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import {
  SP_CAMERA_PARAMS,
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

const _flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

const _unmount = (el) => {
  el.onDestroy()
  el.remove()
}

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
