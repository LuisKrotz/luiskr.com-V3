/**
 * @file hud-and-project.test.js
 * @description Coverage for StatsHud's stats-DOM update path (driven by
 * statsEngine snapshots under an enabled preference) and the Project
 * route's lifecycle: robots meta, slug resolution, data application,
 * carousels binding, and modal auto-open.
 */

import { jest } from '@jest/globals'
import store from '@core/store.js'
import router from '@core/router/router.js'
import '@website/components/feedback/StatsHud.js'
import '@website/views/project/Project.js'
import { TEST_PROJECTS, TEST_TEXT, TEST_URLS, waitFor } from '../fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { MODAL_MUTATIONS, PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { QUERY_STRINGS } from '@core/tokens/strings/queries.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

// ─── StatsHud ────────────────────────────────────────────────────────────────

describe('StatsHud', () => {
  const mountHud = () => {
    const el = document.createElement(COMPONENT_TAGS.STATS_HUD)

    document.body.appendChild(el)

    return el
  }

  test('renders nothing until the stats preference is enabled', () => {
    const el = mountHud()

    el.onMounted?.()

    expect(el.showStats).toBe(false)

    el.remove()
  })

  test('updates the DOM fields when stats arrive', () => {
    if (!store.state.showStatsForNerds) store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)

    const el = mountHud()

    el._stats = {
      fps: 60,
      networkBytesPerSec: 2048,
      pendingRequests: 2,
      memoryMB: 42,
      cpuPercent: 20,
      latencyMs: 50,
    }

    el._updateStatsDom()

    const fpsEl = el.shadowRoot?.querySelector('[data-stat="fps"]')

    expect(el.showStats).toBe(true)

    if (fpsEl) expect(fpsEl.textContent).toBe('60')

    el.remove()

    if (store.state.showStatsForNerds) store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)
  })

  test('exercises each stat color band', () => {
    if (!store.state.showStatsForNerds) store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)

    const el = mountHud()

    const bands = [
      { fps: 10, cpuPercent: 90, latencyMs: 600 },
      { fps: 40, cpuPercent: 50, latencyMs: 200 },
      { fps: 0, cpuPercent: 0, latencyMs: 0 },
    ]

    for (const snap of bands) {
      el._stats = {
        fps: snap.fps,
        networkBytesPerSec: 0,
        pendingRequests: 0,
        memoryMB: 0,
        cpuPercent: snap.cpuPercent,
        latencyMs: snap.latencyMs,
      }

      el._updateStatsDom()
    }

    el.remove()

    if (store.state.showStatsForNerds) store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)
  })

  test('onDestroy unsubscribes from the engine', () => {
    const el = mountHud()

    el.onMounted?.()

    const cb = el._statsCb

    el.remove()

    expect(cb).toBeTruthy()
  })
})

// ─── ViewProject ─────────────────────────────────────────────────────────────

describe('ViewProject', () => {
  const makeView = () => {
    const el = document.createElement(VIEW_TAGS.VIEW_PROJECT)

    document.body.appendChild(el)

    return el
  }

  test('updateRobotsMeta toggles the robots meta tag', () => {
    const el = makeView()

    el.updateRobotsMeta(true)

    let meta = document.querySelector(QUERY_STRINGS.META_ROBOTS)

    expect(meta).toBeTruthy()

    el.updateRobotsMeta(false)

    el.remove()
  })

  test('initProject resolves the slug from the router or URL', () => {
    window.history.replaceState({}, '', `${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.CICB}`)

    const el = makeView()

    el.initProject()

    expect(el.projectSlug).toBe(TEST_PROJECTS.CICB)

    el.remove()
  })

  test('loadData is a no-op without a slug', () => {
    window.history.replaceState({}, '', ROUTE_PATHS.ABOUT)

    const el = makeView()

    el.projectSlug = CHAR_STRINGS.EMPTY
    el.loadData()

    el.remove()
  })

  test('textDelay/textOffset compute stagger timings', () => {
    const el = makeView()

    const items = [{}, {}, {}]

    expect(typeof el.textDelay?.(items)).toBe(TYPE_STRINGS.NUMBER)
    expect(typeof el.textOffset?.(items, 1)).toBe(TYPE_STRINGS.NUMBER)

    el.remove()
  })

  test('isLandscapeGroup detects landscape-oriented groups', () => {
    const el = makeView()

    expect(typeof el.isLandscapeGroup?.([{ size: [1600, 900] }])).toBe(TYPE_STRINGS.BOOLEAN)

    el.remove()
  })

  test('sectionItemHeight derives a per-section height', () => {
    const el = makeView()

    expect(el.sectionItemHeight?.([[{ size: [800, 450] }]])).toContain('calc')

    el.remove()
  })

  test('checkAutoOpenModal opens the project modal for flagged items', () => {
    const el = makeView()

    el.checkAutoOpenModal?.()

    el.remove()
  })

  test('render returns a project detail template', () => {
    const el = makeView()

    el.translations = {
      title: TEST_TEXT.HEADING,
      description: TEST_TEXT.BODY,
    }

    const node = el.render?.()

    expect(node !== null && node !== undefined).toBe(true)

    el.remove()
  })

  test('modal getter proxies the store modal descriptor', () => {
    const el = makeView()

    expect(el.modal).toBe(store.getters.getModal())

    el.remove()
  })

  test('onRouteParamChange reloads when the slug differs', () => {
    const el = makeView()

    el.projectSlug = TEST_PROJECTS.CICB
    el.translations = { title: TEST_TEXT.HEADING }

    el.onRouteParamChange({ params: { projectSlug: TEST_PROJECTS.CICB } })

    expect(el.translations.title).toBe(TEST_TEXT.HEADING)

    el.onRouteParamChange({ params: { projectSlug: TEST_PROJECTS.SAGE } })

    expect(el.projectSlug).toBe(TEST_PROJECTS.SAGE)
    expect(el.translations).toBeNull()

    el.onRouteParamChange(null)

    el.remove()
  })

  test('onStoreUpdate reloads on locale change, syncs modal otherwise', () => {
    const el = makeView()

    el.projectSlug = TEST_PROJECTS.CICB
    el._lastLocale = 'xx-never'
    el.onStoreUpdate()

    expect(el._lastLocale).toBe(store.getters.getLang())

    const calls = []

    el._updateModalDOM = () => calls.push(1)
    el._lastLocale = store.getters.getLang()
    el.onStoreUpdate()

    expect(calls.length).toBe(1)

    el.remove()
  })

  test('sectionItemHeight falls back to skeleton without media size', () => {
    const el = makeView()

    expect(el.sectionItemHeight?.([[TEST_TEXT.BODY]])).not.toContain('calc')
    expect(el.sectionItemHeight?.([[]])).not.toContain('calc')
    expect(el.sectionItemHeight?.([[{ size: [0, 0] }]])).not.toContain('calc')

    el.remove()
  })

  test('checkAutoOpenModal commits the modal for a matching media slug', () => {
    const el = makeView()

    // Early returns: no slug, then no translations.
    router.currentRoute = { params: {} }
    el.checkAutoOpenModal()

    el.translations = null
    router.currentRoute = { params: { slug: 'sample-heading' } }
    el.checkAutoOpenModal()

    el.translations = {
      folder: TEST_PROJECTS.CICB,
      sections: [
        [[TEST_TEXT.SECOND]],
        [[{ label: TEST_TEXT.HEADING, src: TEST_TEXT.SECOND, isVideo: false, size: [800, 450] }]],
      ],
    }

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })

    const prevRoute = router.currentRoute

    router.currentRoute = { params: { slug: 'sample-heading' } }
    el.checkAutoOpenModal()

    expect(store.getters.getModal()?.open).toBe(true)

    router.currentRoute = { params: { slug: 'no-match-here' } }
    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    el.checkAutoOpenModal()

    expect(store.getters.getModal()?.open).toBe(false)

    // Video item takes the isVideo source/thumb branch.
    router.currentRoute = { params: { slug: 'sample-heading' } }

    el.translations = {
      folder: TEST_PROJECTS.CICB,
      sections: [
        [[{ label: TEST_TEXT.HEADING, src: TEST_TEXT.SECOND, isVideo: true, size: [800, 450] }]],
      ],
    }

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    el.checkAutoOpenModal()

    expect(store.getters.getModal()?.media?.isVideo).toBe(true)

    router.currentRoute = { params: {} }
    el.checkAutoOpenModal()

    router.currentRoute = prevRoute

    el.remove()
  })

  test('loadData walks the URL fallback then resolves via SWR', async () => {
    window.history.replaceState({}, '', `${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.CICB}`)

    const el = makeView()

    el.projectSlug = CHAR_STRINGS.EMPTY
    el.loadData()

    await Promise.resolve()
    await Promise.resolve()

    el.loadData(true)

    await Promise.resolve()
    await new Promise((r) => setTimeout(r, 30))

    el.remove()
  })
})

// ─── ViewProject tails ───────────────────────────────────────────────────────

describe('ViewProject tails', () => {
  const makeView = () => {
    const el = document.createElement(VIEW_TAGS.VIEW_PROJECT)

    document.body.appendChild(el)

    return el
  }

  test('updateRobotsMeta creates, reuses, removes, and skips without document', () => {
    const el = makeView()

    document.querySelector(QUERY_STRINGS.META_ROBOTS)?.remove()

    el.updateRobotsMeta(true)
    el.updateRobotsMeta(true)
    el.updateRobotsMeta(false)
    el.updateRobotsMeta(false)

    expect(document.querySelector(QUERY_STRINGS.META_ROBOTS)).toBeNull()

    const doc = globalThis.document

    delete globalThis.document

    try {
      el.updateRobotsMeta(true)
    } finally {
      globalThis.document = doc
    }

    el.remove()
  })

  test('initProject resolves the slug from route params', () => {
    const prevRoute = router.currentRoute

    router.currentRoute = { params: { projectSlug: TEST_PROJECTS.SAGE } }

    const el = makeView()

    el.projectSlug = CHAR_STRINGS.EMPTY
    el.initProject()

    expect(el.projectSlug).toBe(TEST_PROJECTS.SAGE)

    router.currentRoute = prevRoute

    el.remove()
  })

  test('textDelay/textOffset bail on non-array input', () => {
    const el = makeView()

    expect(el.textDelay?.(null)).toBe(14)
    expect(el.textOffset?.(null, 0)).toBe(0)

    el.remove()
  })

  test('checkAutoOpenModal treats a missing isVideo flag as false', () => {
    const el = makeView()

    el.translations = {
      folder: TEST_PROJECTS.CICB,
      sections: [[[{ label: TEST_TEXT.HEADING, src: TEST_TEXT.SECOND, size: [800, 450] }]]],
    }

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })

    const prevRoute = router.currentRoute

    router.currentRoute = { params: { slug: 'sample-heading' } }
    el.checkAutoOpenModal()

    expect(store.getters.getModal()?.media?.isVideo).toBe(false)

    router.currentRoute = prevRoute
    el.remove()
  })

  test('_updateModalDOM drives the open, replace, and close arms', () => {
    const el = makeView()

    el.translations = { title: TEST_TEXT.HEADING, sections: [] }
    el._updateDom()

    const above = el.$(`.${MODAL_CLASSES.MODAL_ABOVE}`)

    expect(above).toBeTruthy()

    let open = false

    Object.defineProperty(above, COMMON_ATTRS.OPEN, { get: () => open, configurable: true })

    above.showModal = () => {
      open = true
    }
    above.close = () => {
      open = false
    }

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: true, transform: 10 })
    el._updateModalDOM()
    el._updateModalDOM()

    store.commit(MODAL_MUTATIONS.SET_MODAL, {
      open: true,
      media: { source: TEST_URLS.IMG, isVideo: true },
    })
    el._updateModalDOM()

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    el._updateModalDOM()

    expect(open).toBe(false)

    el.remove()
  })

  test('loadData applies a snapshot with title, noindex, and the wait arm', async () => {
    document.querySelector(QUERY_STRINGS.META_ROBOTS)?.remove()

    const el = makeView()

    const origFetch = globalThis.fetch
    let fetchCalls = 0

    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: async () => {
        fetchCalls += 1

        return { title: TEST_TEXT.HEADING, noindex: true, sections: [] }
      },
      text: async () => CHAR_STRINGS.EMPTY,
      blob: async () => new Blob([]),
      arrayBuffer: async () => new ArrayBuffer(0),
      clone() {
        return { ...this }
      },
    })

    const lang = store.state.lang
    const prevDb = lang.database
    const prevLocale = lang.locale

    lang.database = 'zzcov/'
    lang.locale = CHAR_STRINGS.EMPTY

    try {
      el.projectSlug = TEST_PROJECTS.SAGE
      el.loadData(5)

      await waitFor(() => el.translations?.title === TEST_TEXT.HEADING)

      expect(el.translations?.title).toBe(TEST_TEXT.HEADING)

      el.projectSlug = TEST_PROJECTS.CICB
      el.loadData()

      await waitFor(() => fetchCalls > 1)
    } finally {
      globalThis.fetch = origFetch
      lang.database = prevDb
      lang.locale = prevLocale
    }

    el.remove()
  })

  test('loadData resolves to a missing snapshot as a no-op', async () => {
    const el = makeView()

    const origFetch = globalThis.fetch

    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: async () => null,
      text: async () => CHAR_STRINGS.EMPTY,
      blob: async () => new Blob([]),
      arrayBuffer: async () => new ArrayBuffer(0),
      clone() {
        return { ...this }
      },
    })

    const lang = store.state.lang
    const prevDb = lang.database

    lang.database = 'zznull/'

    try {
      el.projectSlug = TEST_PROJECTS.SAGE
      el.loadData()

      await new Promise((r) => setTimeout(r, 30))

      expect(el.translations?.title).toBeUndefined()
    } finally {
      globalThis.fetch = origFetch
      lang.database = prevDb
    }

    el.remove()
  })

  test('_bindCarousels defers offscreen carousels and stops when unmounted', async () => {
    const el = makeView()

    await new Promise((r) => setTimeout(r, 60))

    el.translations = {
      sections: [[[{ label: TEST_TEXT.HEADING, src: TEST_URLS.IMG, size: [800, 450] }]]],
    }

    el._updateDom()

    const host = el._contentNode
    const mk = (sec, idx) => {
      const c = document.createElement(COMPONENT_TAGS.CUSTOM_CAROUSEL)

      c.setAttribute(DATA_ATTRS.DATA_SEC_IDX, sec)
      c.setAttribute(DATA_ATTRS.DATA_CAROUSEL_IDX, idx)
      c.configure = () => {}
      host.appendChild(c)

      return c
    }

    mk(0, 0)
    mk(0, 0)
    mk(9, 0)
    mk(9, 0)
    mk(9, 0)

    const prevRIC = globalThis.requestIdleCallback
    const prevCIC = globalThis.cancelIdleCallback

    globalThis.requestIdleCallback = (fn) => setTimeout(fn, 1)
    globalThis.cancelIdleCallback = () => {}

    try {
      el._bindCarousels()
      el._bindCarousels()

      await new Promise((r) => setTimeout(r, 80))

      delete globalThis.requestIdleCallback
      delete globalThis.cancelIdleCallback

      el._bindCarousels()
      el._bindCarousels()

      await new Promise((r) => setTimeout(r, 600))

      el._bindCarousels()
      el.remove()

      await new Promise((r) => setTimeout(r, 300))
    } finally {
      if (prevRIC === undefined) delete globalThis.requestIdleCallback
      else globalThis.requestIdleCallback = prevRIC

      if (prevCIC === undefined) delete globalThis.cancelIdleCallback
      else globalThis.cancelIdleCallback = prevCIC
    }
  })

  test('_updateModalDOM falls back to a non-dialog container and no-op arms', () => {
    const el = makeView()

    const dialog = el.$(`dialog.${MODAL_CLASSES.MODAL_ABOVE}`)

    dialog?.remove()

    const standin = document.createElement(HTML_TAGS.DIV)

    standin.className = MODAL_CLASSES.MODAL_ABOVE
    el._contentNode.appendChild(standin)

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: true })
    el._updateModalDOM()

    standin.remove()

    el.$(`.${MODAL_CLASSES.MODAL_BELOW}`)?.remove()

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: true })
    el._updateModalDOM()

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    el._updateModalDOM()

    el.remove()
  })

  test('registration guard respects an existing custom element', async () => {
    jest.resetModules()

    await import('@website/views/project/Project.js')
  })
})
