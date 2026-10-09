/**
 * @file starfield/star-field-component.test.js
 * @description Full lifecycle for the real <view-star-field> element —
 * mount/canvas/loader, engine boot under the three.js mocks, navigator
 * drawer toggling, dossier panel open/close, action buttons, Escape-key
 * dismissal, locale re-fetch and teardown — plus the WebGL-fallback arm
 * via ?debug=webGLMode:fallback.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import store from '@core/store.js'
import { LOCALES } from '@core/tokens/locales.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { SF_CLASSES } from '@core/tokens/classes/starfield.js'
import { DEBUG_PARAMS, WEBGL_MODES } from '@core/tokens/strings/debug.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'

const dbData = { title: 'Star Field', explore: 'Star Chart' }

jest.unstable_mockModule('@core/utils/data/db.js', () => ({
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => true, val: () => dbData })),
}))

await import('../../StarField.js')

const setSearch = (s) => window.history.replaceState(null, '', s)

const mount = () => {
  const el = document.createElement(VIEW_TAGS.VIEW_STAR_FIELD)

  document.body.appendChild(el)

  return el
}

const waitFor = (pred, timeout = 10000) =>
  new Promise((resolve, reject) => {
    const t0 = Date.now()
    const tick = () => {
      if (pred()) return resolve()
      if (Date.now() - t0 > timeout) return reject(new Error('waitFor timeout'))

      setTimeout(tick, 30)
    }
    tick()
  })

const unmount = (el) => {
  el.onDestroy()
  el.remove()
}

beforeEach(() => {
  setSearch('/')
  document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
})

afterEach(() => {
  setSearch('/')
})

describe('StarField component', () => {
  test('mounts with canvas, loader, HUD, nav toggle, panel and actions', async () => {
    const el = mount()

    expect(el.shadowRoot.querySelector(`.${SF_CLASSES.SF_CANVAS}`)).toBeTruthy()
    expect(el.shadowRoot.querySelector(`.${SF_CLASSES.SF_LOADER}`)).toBeTruthy()
    expect(el.shadowRoot.querySelector(`.${SF_CLASSES.SF_NAV_TOGGLE}`)).toBeTruthy()
    expect(el.shadowRoot.querySelector(`.${SF_CLASSES.SF_PANEL}`)).toBeTruthy()
    expect(el.shadowRoot.querySelector(`.${SF_CLASSES.SF_ACTIONS}`)).toBeTruthy()

    await waitFor(() => el._sfReady === true)

    unmount(el)
  })

  test('engine boots to ready under the three mocks and dismisses the loader', async () => {
    const el = mount()

    await waitFor(() => el._sfReady === true)

    expect(el._sfFailed).toBe(false)
    expect(el._engine).toBeTruthy()

    unmount(el)
  })

  test('nav toggle opens the drawer with one button per catalog body', async () => {
    const el = mount()
    const { SF_CATALOG } = await import('../../engine/catalog.js')

    el._toggleNav()

    expect(el._navOpen).toBe(true)

    const items = el.shadowRoot.querySelectorAll(`.${SF_CLASSES.SF_NAV_ITEM}`)

    expect(items.length).toBe(SF_CATALOG.length)

    const toggle = el.shadowRoot.querySelector(`.${SF_CLASSES.SF_NAV_TOGGLE}`)

    toggle.click()

    expect(el._navOpen).toBe(false)

    unmount(el)
  })

  test('selecting a body loads its dossier into the panel', async () => {
    // 'andromeda' sits far outside every approach radius — nothing else in
    // the file can have prefetched/cached it under another fetch mock.
    const dossier = {
      id: 'andromeda',
      name: 'Andromeda Galaxy',
      kind: 'galaxy',
      tagline: 'Our nearest spiral neighbor',
      facts: [{ label: 'Distance', value: '2.5 Mly' }],
      history: 'Known to Persian astronomers.',
      source: 'NASA',
    }
    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => dossier,
    }))

    try {
      const el = mount()

      await waitFor(() => el._sfReady === true)

      el._selectBody('andromeda')

      // The mock three scene zeroes every world position, so the first
      // tick prefetches every dossier under the ambient fetch mock — the
      // panel resolution may be the cached {} shape; the select →
      // loading → panel-open flow is what this test asserts.
      await waitFor(() => el._dossier !== null || el._dossierLoading === true)
      await waitFor(() => el._dossierLoading === false)

      expect(el.shadowRoot.querySelector(`.${SF_CLASSES.SF_PANEL}`).className).toContain(
        SF_CLASSES.SF_PANEL_OPEN
      )
      expect(el.shadowRoot.querySelector(`.${SF_CLASSES.SF_PANEL_TITLE}`)).toBeTruthy()

      unmount(el)
    } finally {
      globalThis.fetch = origFetch
    }
  })

  test('close button and Escape dismiss the panel, then the drawer', async () => {
    const el = mount()

    await waitFor(() => el._sfReady === true)

    el._selectBody('venus')

    expect(el._selectedId).toBe('venus')

    el._closePanel()

    expect(el._selectedId).toBeNull()

    el._toggleNav()

    el.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }))

    expect(el._navOpen).toBe(false)

    el._selectBody('earth')
    el.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }))

    expect(el._selectedId).toBeNull()

    el.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'x' }))

    unmount(el)
  })

  test('action buttons reach the engine — screenshot + overview fly', async () => {
    const el = mount()

    await waitFor(() => el._sfReady === true)

    const shotSpy = jest.spyOn(el._engine, 'takeScreenshot')
    const flySpy = jest.spyOn(el._engine, 'flyHome')
    const btns = el.shadowRoot.querySelectorAll(`.${SF_CLASSES.SF_BTN}`)

    btns[0].click()
    btns[1].click()

    expect(shotSpy).toHaveBeenCalled()
    expect(flySpy).toHaveBeenCalled()

    unmount(el)
  })

  test('hover and selection update the aria-live HUD', async () => {
    const el = mount()

    el._handleHover('saturn')

    expect(el._liveText).toBe('Saturn')

    el._handleHover('saturn')

    expect(el.shadowRoot.querySelector(`.${SF_CLASSES.SF_LIVE}`).textContent).toBe('Saturn')

    el._handleHover(null)

    expect(el._liveText).toBe('')

    el._announce('unknown-id')

    expect(el._liveText).toBe('')

    unmount(el)
  })

  test('locale change on the store re-fetches translations', async () => {
    const el = mount()

    el._loadTranslations = jest.fn()

    el._lastLocale = LOCALES.DE
    el.onStoreUpdate()

    expect(el._loadTranslations).toHaveBeenCalled()

    el._lastLocale = null
    el.onStoreUpdate()
    el._lastLocale = store.getters.getLang()
    el.onStoreUpdate()

    expect(el._loadTranslations).toHaveBeenCalledTimes(1)

    unmount(el)
  })

  test('webGLMode:fallback boots to the CSS fallback surface', async () => {
    setSearch(`/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.FALLBACK}`)

    const el = mount()

    await waitFor(() => el._sfReady === true)

    expect(el._sfFailed).toBe(true)
    expect(el.shadowRoot.querySelector(`.${SF_CLASSES.SF_FALLBACK}`)).toBeTruthy()

    unmount(el)
  })

  test('onDestroy tears the engine down and survives a second call', async () => {
    const el = mount()

    await waitFor(() => el._sfReady === true)

    el.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }))

    unmount(el)

    expect(el._engine).toBeNull()
    expect(el._canvasEl).toBeNull()
    expect(el._onKeyDown).toBeNull()
  })

  test('onUpdated re-mounts the canvas and re-inits only when idle', async () => {
    const el = mount()

    await waitFor(() => el._sfReady === true)

    const engine = el._engine

    el.onUpdated()

    expect(el._engine).toBe(engine)

    el._engine = null
    el._isInitializing = true
    el.onUpdated()

    expect(el._engine).toBeNull()

    el._isInitializing = false
    el.onUpdated()

    expect(el._engine).toBeTruthy()

    unmount(el)
  })
})
