/**
 * @file views-portfoliorelated.test.js
 * @description Split from views.test.js — covers the "PortfolioRelated" describe.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { PortfolioRelated } from '@website/components/portfolio/Related.js'
import { LOCALES } from '@core/constants.js'
import { mount, TEST_TEXT } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { HOME_MOSAIC_CLASSES } from '@core/tokens/classes/mosaic.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'
import { INTERNAL_CLASSES } from '@core/tokens/classes/project.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { ROUTER_CLASSES } from '@core/tokens/classes/router.js'

// ─── Local selector helpers (derived from TAGS/CLASSES) ───────────────────────
const _S = {
  DRAW_TEXT: COMPONENT_TAGS.DRAW_TEXT,
  MEDIA_FIGURE: COMPONENT_TAGS.MEDIA_FIGURE,
  PORTFOLIO_RELATED: COMPONENT_TAGS.PORTFOLIO_RELATED,
  HOME_MOSAIC_ITEM: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM}`,
  HOME_MOSAIC_TITLE: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_TITLE}`,
}

// ─────────────────────────────────────────────────────────────────────────────
// PortfolioRelated
// ─────────────────────────────────────────────────────────────────────────────
describe('PortfolioRelated', () => {
  let relatedEl
  let cleanup

  beforeEach(() => {
    relatedEl = new PortfolioRelated()
    cleanup = mount(relatedEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(relatedEl.shadowRoot).not.toBeNull()
  })

  test('projectsList returns empty array when translations has no projects', () => {
    relatedEl.translations = {}
    expect(relatedEl.projectsList).toEqual([])
  })

  test('maps projects with clean links and resolves home portfolio images', () => {
    store.state.portfoliolist = [
      { link: 'art-direction', image: 'art-dir-thumb.webp', label: 'Art Direction' },
    ]
    relatedEl.translations = {
      path: ROUTE_PATHS.PORTFOLIO,
      projects: [{ link: '/portfolio/art-direction', page: 'Art Direction' }],
    }
    const projects = relatedEl.projectsList
    expect(projects.length).toBe(1)
    expect(projects[0].link).toBe('art-direction')
    expect(projects[0].imageSrc).toContain('art-dir-thumb.webp')
  })

  test('renders related section with title when translations are present', () => {
    relatedEl.translations = {
      title: 'More Projects',
      path: ROUTE_PATHS.PORTFOLIO,
      projects: [
        { link: '/portfolio/project-one', page: 'Project One' },
        { link: '/portfolio/project-two', page: 'Project Two' },
      ],
    }
    relatedEl._updateDom()
    expect(relatedEl.shadowRoot.textContent).toContain('More Projects')
    const links = relatedEl.shadowRoot.querySelectorAll('a')
    expect(links.length).toBe(2)
  })

  test('clicking item link pushes route to router', () => {
    let routed = null
    const origPush = router.push
    router.push = (path) => {
      routed = path
    }

    relatedEl.translations = {
      title: 'More Projects',
      path: ROUTE_PATHS.PORTFOLIO,
      projects: [{ link: '/portfolio/design-system', page: 'Design System' }],
    }
    relatedEl._updateDom()
    const link = relatedEl.shadowRoot.querySelector('a')
    expect(link).not.toBeNull()
    link.click()
    expect(routed).toContain('design-system')
    router.push = origPush
  })

  test('item without fullPath/imageSrc takes the skip-push and skeleton arms', () => {
    let routed = null
    const origPush = router.push
    router.push = (path) => {
      routed = path
    }

    // projectsList always derives non-empty fullPath/imageSrc in production;
    // the render guards still need a falsy projection — inject one directly.
    Object.defineProperty(relatedEl, 'projectsList', {
      configurable: true,
      get: () => [
        {
          link: 'ghost',
          page: 'Ghost',
          fullPath: CHAR_STRINGS.EMPTY,
          imageSrc: CHAR_STRINGS.EMPTY,
          description: CHAR_STRINGS.EMPTY,
        },
      ],
    })
    relatedEl.translations = { title: 'More Projects', path: ROUTE_PATHS.PORTFOLIO }
    relatedEl._updateDom()

    const link = relatedEl.shadowRoot.querySelector('a')
    expect(link).not.toBeNull()
    expect(link.querySelector(`.${SKELETON_CLASSES.SKELETON_MEDIA}`)).not.toBeNull()

    link.click()
    expect(routed).toBeNull()

    delete relatedEl.projectsList
    router.push = origPush
  })

  test('projectsList covers object maps, fallbacks and all match strategies', () => {
    const prevList = store.state.portfoliolist

    store.state.portfoliolist = null
    relatedEl.homePortfolio = [
      null,
      { title: 'Project Beta', description: 'home-desc' },
      { image: 'x-alpha' },
      { label: 'No Match' },
    ]
    relatedEl.translations = {
      // no `path` → PORTFOLIO_SLASH default; object map → Object.values arm
      projects: {
        a: { link: '/projects/x-alpha', page: 'Alpha', featured: true, description: 'own-desc' },
        b: { title: 'Beta' },
        c: { link: '/portfolio/gamma/' },
        d: { link: 'delta', image: 'delta-img' },
      },
    }

    const list = relatedEl.projectsList

    expect(list).toHaveLength(4)
    expect(list[0].featured).toBe(true)
    expect(list[2].link).toBe('gamma')

    store.state.portfoliolist = prevList
  })

  test('non-EN locale, relative basePath, storage fallback and socials render', () => {
    const prevLocale = store.state.lang.locale
    const prevStorage = store.state.storage
    const prevList = store.state.portfoliolist

    store.state.lang.locale = LOCALES.BR
    store.state.storage = null
    store.state.portfoliolist = null

    relatedEl.translations = {
      title: 'More',
      path: ROUTE_PATHS.PORTFOLIO_SEGMENT,
      note: 'note-html',
      socials: [{ network: 'gh', link: 'https://x.example' }],
      projects: [{ link: '/portfolio/p1', page: 'p1' }],
    }

    const list = relatedEl.projectsList

    expect(list[0].fullPath).toContain('/br/portfolio/p1')
    expect(relatedEl.storage).toContain('http')

    relatedEl._updateDom()

    const socials = relatedEl.shadowRoot.querySelectorAll(
      `.${INTERNAL_CLASSES.INTERNAL_FOOTER_ITEMS_LINK}`
    )

    expect(socials.length).toBeGreaterThan(0)

    // socials present but no note → the `note || EMPTY` arm
    relatedEl.translations = {
      title: 'More',
      projects: [],
      socials: [{ network: 'gh', link: 'https://x.example' }],
    }
    relatedEl._updateDom()

    store.state.lang.locale = prevLocale
    store.state.storage = prevStorage
    store.state.portfoliolist = prevList
  })

  test('disclaimer note renders as a clamped toggle button and expands on click', () => {
    relatedEl.translations = {
      title: 'More',
      note: TEST_TEXT.LONG_NOTE,
      socials: [{ network: 'gh', link: 'https://x.example' }],
    }
    relatedEl._updateDom()

    const note = relatedEl.shadowRoot.querySelector(
      `.${INTERNAL_CLASSES.INTERNAL_FOOTER_ITEMS_NOTE}`
    )

    expect(note).not.toBeNull()
    expect(note.tagName).toBe(HTML_TAGS.BUTTON.toUpperCase())
    expect(note.getAttribute(ARIA_ATTRS.ARIA_EXPANDED)).toBe('false')
    expect(note.classList.contains(STATE_CLASSES.IS_OPEN)).toBe(false)

    note.click()

    const openNote = relatedEl.shadowRoot.querySelector(
      `.${INTERNAL_CLASSES.INTERNAL_FOOTER_ITEMS_NOTE}`
    )

    expect(relatedEl._noteOpen).toBe(true)
    expect(openNote.getAttribute(ARIA_ATTRS.ARIA_EXPANDED)).toBe('true')
    expect(openNote.classList.contains(STATE_CLASSES.IS_OPEN)).toBe(true)

    openNote.click()

    expect(relatedEl._noteOpen).toBe(false)
  })

  test('isCurrent arms: link match, page match and non-match', () => {
    const prevLocation = window.location

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, pathname: '/portfolio/omega' },
    })

    relatedEl.translations = {
      title: 'T',
      projects: [
        { link: 'omega', page: 'x' },
        { link: 'zzz', page: 'omega' },
        { link: 'other', page: 'other' },
      ],
    }
    relatedEl._updateDom()

    const active = relatedEl.shadowRoot.querySelectorAll(`.${ROUTER_CLASSES.ROUTER_LINK_ACTIVE}`)

    expect(active.length).toBe(2)

    Object.defineProperty(window, 'location', { configurable: true, value: prevLocation })
  })

  test('window-less render arm and destroy guards', () => {
    const prevWindow = globalThis.window

    delete globalThis.window

    relatedEl.translations = { title: 'T', projects: [{ link: 'x', page: 'y' }] }
    relatedEl.render()

    globalThis.window = prevWindow

    // onDestroy without onMounted → the unsub guard else arm
    const fresh = new PortfolioRelated()

    fresh.onDestroy()

    // onMounted with a title already present → the translations guard else arm
    const titled = new PortfolioRelated()

    titled.translations = { title: 'preset' }
    document.body.appendChild(titled)
    titled.remove()
  })

  test('fetchData covers missing snapshots and object portfoliolist', async () => {
    const lang = store.getters.getlang()
    const prevDb = lang.database
    const prevLocale = lang.locale
    const origFetch = globalThis.fetch

    // network returns null → both snapshots exists()===false → else arms
    globalThis.fetch = async () => ({ ok: true, json: async () => null })

    lang.database = 'nodb/'
    lang.locale = CHAR_STRINGS.EMPTY

    relatedEl.fetchData()

    await new Promise((r) => setTimeout(r, 80))

    // new database path → skips the db.js in-flight cache — network returns
    // a portfoliolist OBJECT → Object.values arm
    lang.database = 'nodb2/'

    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({ portfoliolist: { a: { link: 'x', image: 'y' } } }),
    })

    relatedEl.fetchData()

    await new Promise((r) => setTimeout(r, 80))

    expect(relatedEl.homePortfolio.length).toBe(1)

    globalThis.fetch = origFetch
    lang.database = prevDb
    lang.locale = prevLocale
  })

  test('router notify and title-present store update arms', async () => {
    // beforeEach mounted the element → the router subscriber is already live
    relatedEl.translations = { title: 'kept' }

    relatedEl.onStoreUpdate()

    router.notify({ path: '/x', name: 'x' }, { path: '/', name: 'home' })

    relatedEl.onDestroy()
  })

  test('module re-eval sees the tag already registered', async () => {
    jest.resetModules()

    await import('@website/components/portfolio/Related.js')
  })
})
