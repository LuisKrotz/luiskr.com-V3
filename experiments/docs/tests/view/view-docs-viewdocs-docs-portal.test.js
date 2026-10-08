/**
 * @file view-docs-viewdocs-docs-portal.test.js
 * @description Split from view-docs.test.js — covers the "ViewDocs — docs portal" describe.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { ViewDocs } from '@docs/Docs.js'
import { mount } from '@tests/fixtures/test-constants.js'
import router from '@core/router/router.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { ROUTE_NAMES } from '@core/tokens/routes/names.js'
import { DOCS_CLASSES } from '@core/tokens/classes/docs.js'
import { DOCS_IDS } from '@core/tokens/ids/docs.js'
import { DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { DOCS_SELECTORS } from '@core/tokens/selectors/docs.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { SCHEMA_STRINGS } from '@core/tokens/strings/schema.js'
import { CLIPBOARD_EVENTS, KEYBOARD_EVENTS } from '@core/tokens/events/dom.js'
import { KEYS } from '@core/tokens/primitives.js'
import { SOCIAL_URLS } from '@core/tokens/media/urls.js'

const makePayload = (over = {}) => ({
  name: 'website.md',
  path: 'docs/architecture/website.md',
  format: 'markdown',
  html: '<article><h1>Website</h1><p>rendered</p></article>',
  media: null,
  mtime: '2024-06-01T12:00:00.000Z',
  ...over,
})

const docsRoute = (docsPath = '') => ({
  name: ROUTE_NAMES.DOCS,
  view: VIEW_TAGS.VIEW_DOCS,
  lang: 'en',
  path: `${ROUTE_PATHS.DOCS}${docsPath ? `/${docsPath}` : ''}`,
  meta: { docsRoute: true },
  params: { docsPath },
})

describe('ViewDocs — docs portal', () => {
  let view
  let cleanup
  let pushSpy
  let origRoute
  let origFetch
  let pushed

  const flush = () => new Promise((r) => setTimeout(r, 0))

  beforeEach(() => {
    origRoute = router.currentRoute
    origFetch = globalThis.fetch
    pushed = []

    pushSpy = jest.spyOn(router, 'push').mockImplementation(async (p) => {
      pushed.push(p)

      const docsPath =
        p === ROUTE_PATHS.DOCS ? CHAR_STRINGS.EMPTY : p.slice(ROUTE_PATHS.DOCS.length + 1)

      view?.onRouteParamChange({ params: { docsPath } })
    })

    router.currentRoute = docsRoute()

    view = new ViewDocs()
    cleanup = mount(view)
  })

  afterEach(() => {
    cleanup?.()

    pushSpy.mockRestore()

    router.currentRoute = origRoute
    globalThis.fetch = origFetch
  })

  test('registers as a custom element', () => {
    expect(customElements.get(VIEW_TAGS.VIEW_DOCS)).toBe(ViewDocs)
  })

  test('root render: title, stamp, tree, crumb input, grid, scene + legal footer', () => {
    const $ = (sel) => view.shadowRoot.querySelector(sel)

    expect($(`.${DOCS_CLASSES.DOCS_TITLE}`).textContent).toBe(DOCS_STRINGS.TITLE)
    expect($(`.${DOCS_CLASSES.DOCS_UPDATED}`).getAttribute('datetime')).toBe(
      '2024-06-01T12:00:00.000Z'
    )
    expect($(`.${DOCS_CLASSES.DOCS_TREE}`)).toBeTruthy()
    expect($(`.${DOCS_CLASSES.DOCS_CRUMB_EDIT}`)).toBeTruthy()
    expect($(`#${DOCS_IDS.GL}`)).toBeTruthy()
    expect($(`#${DOCS_IDS.SCENE}`)).toBeTruthy()
    expect($(`.${DOCS_CLASSES.DOCS_GRID}`).children.length).toBe(3)
    expect(view.shadowRoot.querySelector('legal-footer')).toBeFalsy()
  })

  test('root grid renders the three manifest buckets with generated folder art', () => {
    const cards = view.shadowRoot.querySelectorAll(`.${DOCS_CLASSES.DOCS_CARD}`)

    expect(cards.length).toBe(3)
    expect(cards[0].querySelector(`.${DOCS_CLASSES.DOCS_CARD_ART} svg`)).toBeTruthy()
  })

  test('GL strip falls back when canvas has no webgl context', () => {
    expect(view.classList.contains(DOCS_CLASSES.DOCS_GL_FALLBACK)).toBe(true)
  })

  test('scene canvas hidden via fallback class when webgl2 is unavailable', () => {
    const scene = view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_SCENE}`)

    expect(scene.classList.contains(DOCS_CLASSES.DOCS_SCENE_OFF)).toBe(true)
  })

  test('pickNode on a dir expands it and navigates', async () => {
    const dir = view.rootsAsNodes()[0]

    view.pickNode(dir)
    await flush()

    expect(pushed).toContain(`${ROUTE_PATHS.DOCS}/docs`)
    expect(view.isDirOpen('docs')).toBe(true)
    expect(view.node?.type).toBe('dir')
    expect(view.node?.name).toBe('Documentation')
  })

  test('crumb input shows / at the portal root', () => {
    const input = view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_CRUMB_EDIT}`)

    expect(input.value).toBe(CHAR_STRINGS.SLASH)
  })

  test('re-clicking an open tree dir collapses it; inside → back to parent', async () => {
    const treeBtns = () => view.shadowRoot.querySelectorAll(`.${DOCS_CLASSES.DOCS_TREE_ITEM}`)

    treeBtns()[0].click() // open + navigate into 'docs'
    await flush()

    expect(view.isDirOpen('docs')).toBe(true)
    expect(view.docsPath).toBe('docs')

    treeBtns()[0].click() // re-click collapses — and leaves the folder
    await flush()

    expect(view.isDirOpen('docs')).toBe(false)
    expect(pushed).toContain(ROUTE_PATHS.DOCS)
    expect(view.docsPath).toBe(CHAR_STRINGS.EMPTY)
  })

  test('re-clicking an open non-current dir collapses without navigating', async () => {
    const dir = view.rootsAsNodes()[0]

    view.pickTreeNode(dir)
    await flush()

    expect(view.isDirOpen('docs')).toBe(true)

    pushed.length = 0

    // Open 'reports' so the viewer sits outside 'docs' — collapsing it
    // must not yank the page back.
    view.pickNode(view.rootsAsNodes()[1])
    await flush()

    view.pickTreeNode(dir)
    await flush()

    expect(view.isDirOpen('docs')).toBe(false)
    expect(view.docsPath).toBe('reports')
  })

  test('a dir with index.html auto-opens the index (except under src)', async () => {
    view.onRouteParamChange({ params: { docsPath: 'docs/sassdoc' } })
    await flush()

    expect(pushed).toContain(`${ROUTE_PATHS.DOCS}/docs/sassdoc/index.html`)

    pushed.length = 0

    // The src root stays a browsable source tree — no index auto-open.
    view.onRouteParamChange({ params: { docsPath: 'src' } })
    await flush()

    expect(pushed.length).toBe(0)
    expect(view.node?.type).toBe('dir')
  })

  test('internal payload links reroute inside /docs; external links pass through', async () => {
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () =>
        makePayload({
          html:
            '<article><p><span>plain</span><a>hrefless</a><a href="#frag">frag</a>' +
            '<a href="/docs/reports/axe-report.json">in</a>' +
            '<a href="https://example.com/x">out</a></p></article>',
        }),
    }))

    view.onRouteParamChange({ params: { docsPath: 'docs/architecture/website.md' } })
    await flush()
    await flush()

    const box = view.shadowRoot.querySelector(DOCS_SELECTORS.CONTENT)
    const [_frag, internal, external] = box.querySelectorAll(DOCS_SELECTORS.CONTENT_LINK)

    internal.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await flush()

    expect(pushed).toContain(`${ROUTE_PATHS.DOCS}/reports/axe-report.json`)

    pushed.length = 0

    external.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

    expect(pushed.length).toBe(0)

    // Non-anchor target → closest() misses → early return.
    box
      .querySelector('span')
      .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

    // href-less anchor → `|| ''` + !href return.
    box
      .querySelector('a:not([href])')
      .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

    // Hash-only href → same-page fragment, left to the browser.
    _frag.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

    // Non-Element event target (no closest) → optional chain falls to undefined.
    view._onContentLink({ target: {} })

    expect(pushed.length).toBe(0)
  })

  test('mermaid blocks render through the mermaid module', async () => {
    const { __mermaidState } = await import('mermaid')

    __mermaidState.ranNodes = 0

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () =>
        makePayload({ html: `<div class="${DOCS_CLASSES.DOCS_MERMAID}">flowchart TB</div>` }),
    }))

    view.onRouteParamChange({ params: { docsPath: 'docs/architecture/website.md' } })
    await flush()
    await flush()

    const block = view.shadowRoot.querySelector(DOCS_SELECTORS.MERMAID)

    expect(block.getAttribute('data-processed')).toBe('true')
    expect(__mermaidState.ranNodes).toBeGreaterThan(0)
  })

  test('coverage reports get istanbul keyboard nav on document keydown', async () => {
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () =>
        makePayload({
          format: 'html',
          html: '<div class="coverage"><span class="cline-no">x</span><span class="cline-no">y</span></div>',
        }),
    }))

    const scrollCalls = []

    view.onRouteParamChange({ params: { docsPath: 'docs/README.md' } })
    await flush()
    await flush()

    view.shadowRoot
      .querySelectorAll('.cline-no')
      .forEach((el) => (el.scrollIntoView = () => scrollCalls.push(el.textContent)))

    document.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: 'n' }))
    document.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: 'n' }))
    document.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: 'p' }))
    document.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: 'x' }))
    // Modifier chords stay browser-owned — happy-dom ignores ctrlKey in
    // the init dict, so the flag lands via a patched own-property.
    const ctrl = new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: 'n' })

    Object.defineProperty(ctrl, 'ctrlKey', { value: true, configurable: true })

    document.dispatchEvent(ctrl)

    expect(scrollCalls).toEqual(['x', 'y', 'x'])
  })

  test('navigating into a dir renders its children in the grid', async () => {
    view.pickNode(view.rootsAsNodes()[0])
    await flush()

    const cards = view.shadowRoot.querySelectorAll(`.${DOCS_CLASSES.DOCS_CARD}`)

    expect(cards.length).toBe(3)
  })

  test('navigating to a file fetches its payload and paints the viewer', async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => makePayload() }))

    view.onRouteParamChange({ params: { docsPath: 'docs/architecture/website.md' } })
    await flush()
    await flush()

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${DOCS_STRINGS.ASSET_BASE}docs/architecture/website.md${DOCS_STRINGS.ASSET_EXT}`
    )
    expect(view.filePayload?.html).toContain('Website')

    const content = view.shadowRoot.querySelector(DOCS_SELECTORS.CONTENT)

    expect(content.innerHTML).toContain('rendered')
    expect(view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_VIEWER}`)).toBeTruthy()
  })

  test('src-root files get the protected class; docs files do not', async () => {
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => makePayload({ format: 'code', path: 'src/App.tsx', name: 'App.tsx' }),
    }))

    view.onRouteParamChange({ params: { docsPath: 'src/App.tsx' } })
    await flush()
    await flush()

    const viewer = view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_VIEWER}`)

    expect(viewer.classList.contains(DOCS_CLASSES.DOCS_PROTECTED)).toBe(true)
    expect(view.isProtectedView()).toBe(true)
  })

  test('html payloads render inline inside the viewer content', async () => {
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () =>
        makePayload({ format: 'html', html: '<div class="docs-html"><p>report</p></div>' }),
    }))

    view.onRouteParamChange({ params: { docsPath: 'docs/architecture/website.md' } })
    await flush()
    await flush()

    const content = view.shadowRoot.querySelector(DOCS_SELECTORS.CONTENT)

    expect(content.querySelector('.docs-html')).toBeTruthy()
    expect(content.textContent).toContain('report')
  })

  test('media payloads render an <img>; oversized media shows the GitHub pointer', async () => {
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () =>
        makePayload({ format: 'media', media: 'data:image/png;base64,x', html: null }),
    }))

    view.onRouteParamChange({ params: { docsPath: 'src/binary.png' } })
    await flush()
    await flush()

    const content = view.shadowRoot.querySelector(DOCS_SELECTORS.CONTENT)

    expect(content.querySelector('img')).toBeTruthy()

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => makePayload({ format: 'media', media: null, html: null }),
    }))

    view.onRouteParamChange({ params: { docsPath: 'src/binary.png' } })
    await flush()
    await flush()

    expect(view.shadowRoot.querySelector(DOCS_SELECTORS.CONTENT).textContent).toBe(
      DOCS_STRINGS.MEDIA_UNAVAILABLE
    )
  })

  test('failed payload fetch clears loading and leaves no viewer', async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: false, json: async () => null }))

    view.onRouteParamChange({ params: { docsPath: 'docs/architecture/website.md' } })
    await flush()
    await flush()

    expect(view.fileLoading).toBe(false)
    expect(view.filePayload).toBe(null)
    expect(view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_VIEWER}`)).toBeFalsy()
  })

  test('fetch throw lands on the same empty state', async () => {
    globalThis.fetch = jest.fn(async () => {
      throw new Error('net down')
    })

    view.onRouteParamChange({ params: { docsPath: 'docs/architecture/website.md' } })
    await flush()
    await flush()

    expect(view.filePayload).toBe(null)
  })

  test('closeFile navigates to the parent folder', async () => {
    view.onRouteParamChange({ params: { docsPath: 'docs/architecture/website.md' } })

    view.closeFile()
    await flush()

    expect(pushed).toContain(`${ROUTE_PATHS.DOCS}/docs/architecture`)
  })

  test('editable breadcrumb: Enter commits the typed path, Escape restores', async () => {
    const input = view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_CRUMB_EDIT}`)

    input.value = 'docs/architecture'
    input.blur = jest.fn()

    view.onCrumbKey({ key: KEYS.ENTER, target: input })
    await flush()

    expect(pushed).toContain(`${ROUTE_PATHS.DOCS}/docs/architecture`)
    expect(input.blur).toHaveBeenCalled()

    input.value = 'junk'

    view.onCrumbKey({ key: KEYS.ESCAPE, target: input })

    expect(input.value).toBe(`${CHAR_STRINGS.SLASH}${view.docsPath}`)
  })

  test('crumb buttons navigate to their path', async () => {
    view.onRouteParamChange({ params: { docsPath: 'docs/architecture/website.md' } })
    await flush()

    const crumbs = view.shadowRoot.querySelectorAll(`.${DOCS_CLASSES.DOCS_CRUMB}`)

    crumbs[1].click()
    await flush()

    expect(pushed).toContain(`${ROUTE_PATHS.DOCS}/docs`)
  })

  test('tree buttons expand + navigate; file buttons navigate', async () => {
    const treeBtns = view.shadowRoot.querySelectorAll(`.${DOCS_CLASSES.DOCS_TREE_ITEM}`)

    treeBtns[0].click()
    await flush()

    expect(pushed.length).toBeGreaterThan(0)
  })

  test('grid card click navigates into the node', async () => {
    const card = view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_CARD}`)

    card.click()
    await flush()

    expect(pushed).toContain(`${ROUTE_PATHS.DOCS}/docs`)
  })

  test('root crumb button returns to the portal root', async () => {
    view.onRouteParamChange({ params: { docsPath: 'docs/architecture' } })
    await flush()

    const crumbs = view.shadowRoot.querySelectorAll(`.${DOCS_CLASSES.DOCS_CRUMB}`)

    crumbs[0].click()
    await flush()

    expect(pushed).toContain(ROUTE_PATHS.DOCS)
    expect(view.docsPath).toBe('')
  })

  test('crumb input handles real keydown + focus events', async () => {
    const input = view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_CRUMB_EDIT}`)

    input.value = 'reports'
    input.blur = jest.fn()
    input.select = jest.fn()

    input.dispatchEvent(new Event('focus', { bubbles: false }))
    expect(input.select).toHaveBeenCalled()

    input.dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ENTER, bubbles: true })
    )
    await flush()

    expect(pushed).toContain(`${ROUTE_PATHS.DOCS}/reports`)
  })

  test('viewer back button returns to the parent folder', async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => makePayload() }))

    view.onRouteParamChange({ params: { docsPath: 'docs/architecture/website.md' } })
    await flush()
    await flush()

    const back = view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_VIEWER_BACK}`)

    back.click()
    await flush()

    expect(pushed).toContain(`${ROUTE_PATHS.DOCS}/docs/architecture`)
  })

  test('pickNode on a file navigates without touching the open-set', () => {
    const file = { type: 'file', name: 'README.md', path: 'docs/README.md', id: 'docs:README.md' }

    view.pickNode(file)

    expect(view._openDirs.has('docs/README.md')).toBe(false)
  })

  test('onCrumbKey ignores keys that are neither Enter nor Escape', () => {
    const input = view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_CRUMB_EDIT}`)

    input.value = 'typed'

    view.onCrumbKey({ key: 'x', target: input })

    expect(input.value).toBe('typed')
    expect(pushed.length).toBe(0)
  })

  test('a dir node without children renders the empty grid arm', async () => {
    view.docsPath = 'src/empty'
    view.node = { type: 'dir', name: 'empty', path: 'src/empty' }
    view._updateDom()

    expect(view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_GRID}`)).toBeFalsy()
  })

  test('toast text resolves through the component dictionary', () => {
    expect(typeof view._toastText()).toBe('string')
    expect(view._toastText().length).toBeGreaterThan(0)
  })

  test('unresolvable path shows the not-found note', async () => {
    view.onRouteParamChange({ params: { docsPath: 'docs/never/there' } })
    await flush()

    expect(view.node).toBe(null)
    expect(view.shadowRoot.textContent).toContain(DOCS_STRINGS.NOT_FOUND_PATH)
  })

  test('navigating off a file clears the payload', async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => makePayload() }))

    view.onRouteParamChange({ params: { docsPath: 'docs/architecture/website.md' } })
    await flush()
    await flush()

    view.onRouteParamChange({ params: { docsPath: 'docs' } })
    await flush()

    expect(view.filePayload).toBe(null)
    expect(view.fileLoading).toBe(false)
  })

  test('copy on an unprotected docs page is left alone', async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => makePayload() }))

    view.onRouteParamChange({ params: { docsPath: 'docs/architecture/website.md' } })
    await flush()
    await flush()

    const calls = globalThis.fetch.mock.calls.length

    const e = new Event(CLIPBOARD_EVENTS.COPY, { bubbles: true, cancelable: true })

    e.clipboardData = { setData: jest.fn() }

    view.shadowRoot.dispatchEvent(e)

    expect(e.clipboardData.setData).not.toHaveBeenCalled()
    expect(globalThis.fetch.mock.calls.length).toBe(calls)
  })

  test('copy on a protected src page hijacks the clipboard to the GitHub URL + telemeters', async () => {
    const posted = []

    globalThis.fetch = jest.fn(async (url) => {
      posted.push(url)

      return {
        ok: true,
        json: async () => makePayload({ format: 'code', path: 'src/App.tsx', name: 'App.tsx' }),
      }
    })

    view.onRouteParamChange({ params: { docsPath: 'src/App.tsx' } })
    await flush()
    await flush()

    const e = new Event(CLIPBOARD_EVENTS.COPY, { bubbles: true, cancelable: true })

    e.clipboardData = { setData: jest.fn() }

    view.shadowRoot.dispatchEvent(e)

    expect(e.defaultPrevented).toBe(true)
    expect(e.clipboardData.setData).toHaveBeenCalledWith('text/plain', SOCIAL_URLS.GITHUB_REPO)

    const telemetry = posted.filter((u) => String(u).includes('copy-attempts'))

    expect(telemetry.length).toBe(1)
  })

  test('contextmenu on a protected page is blocked; selectstart + dragstart too', async () => {
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => makePayload({ format: 'code', path: 'src/App.tsx' }),
    }))

    view.onRouteParamChange({ params: { docsPath: 'src/App.tsx' } })
    await flush()
    await flush()

    const menu = new Event('contextmenu', { bubbles: true, cancelable: true })

    view.shadowRoot.dispatchEvent(menu)
    expect(menu.defaultPrevented).toBe(true)

    const sel = new Event('selectstart', { bubbles: true, cancelable: true })

    view.shadowRoot.dispatchEvent(sel)
    expect(sel.defaultPrevented).toBe(true)

    const drag = new Event('dragstart', { bubbles: true, cancelable: true })

    view.shadowRoot.dispatchEvent(drag)
    expect(drag.defaultPrevented).toBe(true)
  })

  test('PrintScreen keyup on a protected page fires telemetry', async () => {
    const posted = []

    globalThis.fetch = jest.fn(async (url) => {
      posted.push(url)

      return { ok: true, json: async () => makePayload({ format: 'code' }) }
    })

    view.onRouteParamChange({ params: { docsPath: 'src/App.tsx' } })
    await flush()
    await flush()

    posted.length = 0

    document.dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYUP, { key: DOCS_STRINGS.KEY_PRINT_SCREEN })
    )

    const telemetry = posted.filter((u) => String(u).includes('copy-attempts'))

    expect(telemetry.length).toBe(1)
  })

  test('nav toggle flips the mobile nav-open class on the root', () => {
    const root = () => view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS}`)
    const toggle = view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_NAV_TOGGLE}`)

    expect(root().classList.contains(DOCS_CLASSES.DOCS_NAV_OPEN)).toBe(false)

    toggle.click()

    expect(view.navOpen).toBe(true)
    expect(root().classList.contains(DOCS_CLASSES.DOCS_NAV_OPEN)).toBe(true)

    view.toggleNav()

    expect(view.navOpen).toBe(false)
    expect(root().classList.contains(DOCS_CLASSES.DOCS_NAV_OPEN)).toBe(false)
  })

  test('treeview arrow keys move focus and expand/collapse dirs in place', async () => {
    const items = () => view.shadowRoot.querySelectorAll(`.${DOCS_CLASSES.DOCS_TREE_ITEM}`)

    const first = items()[0] // 'docs' bucket — closed dir

    first.focus()

    // → on a closed dir expands in place (no navigation).
    first.dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_RIGHT, bubbles: true })
    )
    await flush()

    expect(view.isDirOpen('docs')).toBe(true)
    expect(pushed.length).toBe(0)

    // Focus was restored to the expanded row after re-render.
    const reopened = items()[0]

    expect(reopened.getAttribute('aria-expanded')).toBe('true')

    // → on an open dir descends to the first child.
    reopened.dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_RIGHT, bubbles: true })
    )
    await flush()

    expect(view.shadowRoot.activeElement).toBe(items()[1])

    // ↑ returns to the parent row.
    items()[1].dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_UP, bubbles: true })
    )
    await flush()

    expect(view.shadowRoot.activeElement).toBe(items()[0])

    // ← on an open dir collapses it in place.
    items()[0].dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_LEFT, bubbles: true })
    )
    await flush()

    expect(view.isDirOpen('docs')).toBe(false)
  })

  test('← on a child row focuses its parent dir', async () => {
    view.pickNode(view.rootsAsNodes()[0]) // expand + navigate into 'docs'
    await flush()

    const items = view.shadowRoot.querySelectorAll(`.${DOCS_CLASSES.DOCS_TREE_ITEM}`)
    const child = items[1] // first child under the open 'docs' dir

    child.dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_LEFT, bubbles: true })
    )
    await flush()

    expect(view.shadowRoot.activeElement).toBe(items[0])
  })

  test('grid arrow keys rove between cards', async () => {
    const cards = () => view.shadowRoot.querySelectorAll(`.${DOCS_CLASSES.DOCS_CARD}`)

    cards()[0].dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_RIGHT, bubbles: true })
    )
    await flush()

    expect(view.shadowRoot.activeElement).toBe(cards()[1])
  })

  test('Escape backs out of an open file, then closes the nav panel', async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => makePayload() }))

    view.onRouteParamChange({ params: { docsPath: 'docs/architecture/website.md' } })
    await flush()
    await flush()

    view.shadowRoot
      .querySelector(`.${DOCS_CLASSES.DOCS}`)
      .dispatchEvent(
        new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ESCAPE, bubbles: true })
      )
    await flush()

    expect(pushed).toContain(`${ROUTE_PATHS.DOCS}/docs/architecture`)

    view.navOpen = true
    view.filePayload = null

    view.onViewKey({ key: KEYS.ESCAPE })

    expect(view.navOpen).toBe(false)

    // Non-Escape keys are ignored.
    view.onViewKey({ key: KEYS.ENTER })

    expect(pushed.length).toBeGreaterThan(0)
  })

  test('re-clicking an open dir collapses it — inside subtree navigates to parent', async () => {
    const docsDir = view.rootsAsNodes()[0]

    view.pickNode(docsDir) // open + land inside 'docs'
    await flush()

    pushed.length = 0

    view.pickTreeNode(docsDir) // docsPath === node.path → parent nav

    expect(view.isDirOpen('docs')).toBe(false)
    expect(pushed).toContain(ROUTE_PATHS.DOCS)
  })

  test('re-clicking an open dir from a nested path still collapses to parent', async () => {
    view.onRouteParamChange({ params: { docsPath: 'docs/sassdoc' } })
    await flush()
    await flush()

    pushed.length = 0

    view.pickTreeNode(view.rootsAsNodes()[0]) // startsWith('docs/') → inside

    expect(view.isDirOpen('docs')).toBe(false)
    expect(pushed).toContain(ROUTE_PATHS.DOCS)
  })

  test('re-clicking an open dir while outside it only re-renders (no nav)', async () => {
    view.onRouteParamChange({ params: { docsPath: 'reports/axe-report.json' } })
    await flush()
    await flush()

    view.toggleDir('docs') // open in place without navigating

    pushed.length = 0

    view.pickTreeNode(view.rootsAsNodes()[0])

    expect(view.isDirOpen('docs')).toBe(false)
    expect(pushed.length).toBe(0)
  })

  test('keydowns on the nav container (not a row) are ignored', () => {
    const nav = view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_NAV}`)

    nav.dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_DOWN, bubbles: true })
    )

    expect(view.shadowRoot.activeElement).not.toBe(nav)
  })

  test('↓ moves to the next tree row; non-arrow keys fall through untouched', async () => {
    const items = () => view.shadowRoot.querySelectorAll(`.${DOCS_CLASSES.DOCS_TREE_ITEM}`)

    items()[0].dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_DOWN, bubbles: true })
    )
    await flush()

    expect(view.shadowRoot.activeElement).toBe(items()[1])

    // Unrelated key → no branch matches, nothing moves.
    items()[1].dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ENTER, bubbles: true })
    )
    await flush()

    expect(view.shadowRoot.activeElement).toBe(items()[1])
  })

  test('Escape with nothing open is a silent no-op', () => {
    view.onViewKey({ key: KEYS.ESCAPE })

    expect(view.navOpen).toBe(false)
    expect(view.filePayload).toBe(null)
    expect(pushed.length).toBe(0)
  })

  test('→ on a file tree row focuses the next row', async () => {
    view.pickNode(view.rootsAsNodes()[0])
    await flush()

    const items = () => view.shadowRoot.querySelectorAll(`.${DOCS_CLASSES.DOCS_TREE_ITEM}`)

    // 'docs/sassdoc' rows are dirs; find the first file row (no aria-expanded).
    const fileRow = [...items()].find((b) => !b.hasAttribute('aria-expanded'))

    fileRow.dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_RIGHT, bubbles: true })
    )
    await flush()

    expect(view.shadowRoot.activeElement).toBeTruthy()
  })

  test('grid keydown on non-card, Enter (delta 0) and ← (delta -1)', async () => {
    const grid = view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS_GRID}`)
    const cards = () => view.shadowRoot.querySelectorAll(`.${DOCS_CLASSES.DOCS_CARD}`)

    // Non-card target → early return.
    grid.dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_RIGHT, bubbles: true })
    )

    // Unrelated key → delta 0 → no move.
    cards()[0].dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ENTER, bubbles: true })
    )
    await flush()

    expect(view.shadowRoot.activeElement).not.toBe(cards()[1])

    // ← wraps to the previous card (index 1 → 0).
    cards()[1].dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_LEFT, bubbles: true })
    )
    await flush()

    expect(view.shadowRoot.activeElement).toBe(cards()[0])

    // ↓ steps forward like →.
    cards()[0].dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_DOWN, bubbles: true })
    )
    await flush()

    expect(view.shadowRoot.activeElement).toBe(cards()[1])
  })

  test('route param change and mount tolerate a missing docsPath param', () => {
    router.currentRoute = {
      path: ROUTE_PATHS.DOCS,
      meta: { docsRoute: true },
      params: {},
    }

    view.onMounted()

    expect(view.docsPath).toBe(CHAR_STRINGS.EMPTY)

    view.onRouteParamChange({ params: {} })

    expect(view.docsPath).toBe(CHAR_STRINGS.EMPTY)

    view.onRouteParamChange()

    expect(view.docsPath).toBe(CHAR_STRINGS.EMPTY)
  })

  test('unmounting disposes the copy guard — no telemetry after destroy', async () => {
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => makePayload({ format: 'code' }),
    }))

    view.onRouteParamChange({ params: { docsPath: 'src/App.tsx' } })
    await flush()
    await flush()

    cleanup()
    cleanup = null

    const e = new Event(CLIPBOARD_EVENTS.COPY, { bubbles: true, cancelable: true })

    e.clipboardData = { setData: jest.fn() }

    view.shadowRoot.dispatchEvent(e)

    expect(e.clipboardData.setData).not.toHaveBeenCalled()
  })

  test('JSON-LD + title + microdata: CollectionPage at root, TechArticle on file open, cleared on destroy', async () => {
    const jsonLd = () => document.getElementById(SCHEMA_STRINGS.JSON_LD_SCRIPT_ID)
    const graph = () => JSON.parse(jsonLd().textContent)['@graph']

    // Portal root — CollectionPage, breadcrumb with just the docs crumb.
    expect(document.title).toContain(DOCS_STRINGS.TITLE)
    expect(graph()[1]['@type']).toBe('CollectionPage')
    expect(graph()[0].itemListElement).toHaveLength(1)
    expect(view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS}`).getAttribute('itemtype')).toBe(
      `${SCHEMA_STRINGS.SCHEMA_CONTEXT}/CollectionPage`
    )

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => makePayload({ format: 'markdown' }),
    }))

    view.onRouteParamChange({ params: { docsPath: 'docs/README.md' } })
    await flush()
    await flush()

    expect(graph()[1]['@type']).toBe('TechArticle')
    expect(graph()[0].itemListElement.length).toBeGreaterThan(1)
    expect(view.shadowRoot.querySelector(`.${DOCS_CLASSES.DOCS}`).getAttribute('itemtype')).toBe(
      `${SCHEMA_STRINGS.SCHEMA_CONTEXT}/TechArticle`
    )
    expect(document.title).toContain('README.md')

    cleanup()
    cleanup = null

    expect(jsonLd()).toBeNull()
  })
})
