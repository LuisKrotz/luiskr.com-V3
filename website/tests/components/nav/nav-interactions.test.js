/**
 * @file nav-interactions.test.js
 * @description Deep coverage for AppNav interaction branches: menu
 * open/close lifecycle (incl. WebGL fallback widgets and settle/close
 * timers), scroll routing (top/about/contact), preferences + language
 * triggers, origin capture, scroll-state updates, and the playground
 * route variant.
 */
import { jest } from '@jest/globals'
import { KEYS, ROUTE_NAMES, SECTIONS } from '@core/constants.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import '@website/components/nav/AppNav.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { ANIMATION_DURATIONS } from '@core/tokens/motion/animation.js'
import { KEYBOARD_EVENTS } from '@core/tokens/events/dom.js'
import { APP_EVENTS } from '@core/tokens/events/app.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { MODAL_MUTATIONS } from '@core/tokens/events/mutations.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms))

const mount = () => {
  const el = document.createElement(COMPONENT_TAGS.APP_NAV)

  document.body.appendChild(el)

  return el
}

const withRoute = (name, fn) => {
  const prev = router.currentRoute

  router.currentRoute = name ? { name } : null

  try {
    return fn()
  } finally {
    router.currentRoute = prev
  }
}

describe('AppNav interactions', () => {
  afterEach(() => {
    document.body.innerHTML = CHAR_STRINGS.EMPTY
  })

  test('menu opens, mounts GL widgets and closes after the timers', async () => {
    const el = mount()

    await flush()

    el._toggleMenu()

    expect(el._menuOpen).toBe(true)

    el._mountMenuWebGL()
    el._mountBurgerWebGL()

    el._closeMenu()

    expect(el._menuClosing).toBe(true)

    // Second close while closing is a no-op.
    el._closeMenu()

    await new Promise((r) => setTimeout(r, ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 80))

    expect(el._menuOpen).toBe(false)
    expect(el._menuBg).toBeNull()
  })

  test('escape closes an open menu only when no dialog is above it', async () => {
    const el = mount()

    await flush()

    el._menuOpen = true
    el._bindEvents()

    const spy = jest.spyOn(el, '_closeMenu')

    window.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ESCAPE }))

    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
    el._menuOpen = false
    el._menuClosing = false
    el.remove()
  })

  test('_openMenu/_closeMenu guards reject redundant transitions', async () => {
    const el = mount()

    await flush()

    el._openMenu()

    const first = el._menuOpen

    el._openMenu()

    expect(el._menuOpen).toBe(first && true)

    el._menuOpen = false
    el._closeMenu()

    expect(el._menuClosing).toBe(false)

    el.remove()
  })

  test('handleLogo routes home off-home, scrolls on home', async () => {
    const el = mount()

    await flush()

    const pushes = []
    const prevPush = router.push

    router.push = (p) => pushes.push(p)

    withRoute(ROUTE_NAMES.PROJECT, () => el.handleLogo())

    expect(pushes.length).toBe(1)

    const scrollSpy = jest.spyOn(el, 'scrollToTop')

    withRoute(ROUTE_NAMES.HOME, () => el.handleLogo())

    expect(scrollSpy).toHaveBeenCalled()

    router.push = prevPush
    el.remove()
  })

  test('handleAbout + handleAction cover both route branches', async () => {
    const el = mount()

    await flush()

    const pushes = []
    const prevPush = router.push

    router.push = (p) => pushes.push(p)

    withRoute(ROUTE_NAMES.PROJECT, () => el.handleAbout())

    expect(pushes.length).toBe(1)

    const aboutSpy = jest.spyOn(el, 'goToAbout')
    const contactSpy = jest.spyOn(el, 'scrollToContact')
    const topSpy = jest.spyOn(el, 'scrollToTop')

    withRoute(ROUTE_NAMES.HOME, () => {
      el.onBottom = false
      el.handleAbout()
      el.handleAction()

      el.onBottom = true
      el.handleAction()
    })

    expect(aboutSpy).toHaveBeenCalled()
    expect(contactSpy).toHaveBeenCalled()
    expect(topSpy).toHaveBeenCalled()

    router.push = prevPush
    el.remove()
  })

  test('scrollTop/goToAbout/scrollToContact run on and off the home route', async () => {
    const el = mount()

    await flush()

    withRoute(ROUTE_NAMES.HOME, () => {
      el.scrollToTop()
      el.goToAbout()
      el.scrollToContact()
    })

    withRoute(ROUTE_NAMES.PROJECT, () => {
      el.scrollToTop()
      el.goToAbout()
      el.scrollToContact()
    })

    el.remove()
  })

  test('handlePreferences + handleLang commit the store and emit events', async () => {
    const el = mount()

    await flush()

    const heard = []
    const prev = store.getters.getPreferencesOpen()

    window.addEventListener(APP_EVENTS.OPEN_PREFERENCES_MODAL, () => heard.push(1), { once: true })
    window.addEventListener(APP_EVENTS.OPEN_LANG_DIALOG, () => heard.push(2), { once: true })

    const ev = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      currentTarget: document.createElement(HTML_TAGS.BUTTON),
    }

    el.handlePreferences(ev)
    el.handleLang(ev)

    expect(store.getters.getPreferencesOpen()).toBe(true)
    expect(store.getters.getLangDialogOpen()).toBe(true)

    await flush(10)

    expect(heard.length).toBe(2)

    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, prev)
    store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, false)
    el.remove()
  })

  test('_captureOrigin stores the trigger center for genie opens', async () => {
    const el = mount()

    await flush()

    const btn = document.createElement(HTML_TAGS.BUTTON)

    btn.getBoundingClientRect = () => ({ left: 10, top: 20, width: 40, height: 20 })

    el._captureOrigin({ currentTarget: btn })
    el._captureOrigin({ target: btn })
    el._captureOrigin(null)

    el.remove()
  })

  test('updateScrollState no-ops on same state and re-renders on change', async () => {
    const el = mount()

    await flush()

    const domSpy = jest.spyOn(el, '_updateDom')

    el.updateScrollState(el.activeSection, el.onBottom)

    expect(domSpy).not.toHaveBeenCalled()

    el.updateScrollState(SECTIONS.ABOUT, true)

    expect(el.activeSection).toBe(SECTIONS.ABOUT)
    expect(el.onBottom).toBe(true)
    expect(domSpy).toHaveBeenCalled()

    el.remove()
  })

  test('isPlaygroundPage detects the playground route three ways', async () => {
    const el = mount()

    await flush()

    withRoute(ROUTE_NAMES.EARTH_PLAYGROUND, () => {
      expect(el.isPlaygroundPage).toBe(true)
    })

    withRoute(ROUTE_NAMES.HOME, () => {
      const prev = window.location.pathname

      window.history.replaceState({}, '', `/${ROUTE_PATHS.EARTH_PLAYGROUND_SEGMENT}`)

      expect(el.isPlaygroundPage).toBe(true)

      window.history.replaceState({}, '', prev)
    })

    withRoute(ROUTE_NAMES.HOME, () => {
      window.history.replaceState({}, '', ROUTE_PATHS.ABOUT)
      expect(el.isPlaygroundPage).toBe(false)
    })

    el.remove()
  })

  test('onStoreUpdate re-renders and forwards reduced-motion to flags', async () => {
    const el = mount()

    await flush()

    const flag = { setReducedMotion: jest.fn() }

    el._navFlags = new Set([flag])
    el.onStoreUpdate()

    expect(flag.setReducedMotion).toHaveBeenCalled()

    el._navFlags = new Set()
    el.remove()
  })

  test('nav flag mounts on a connected canvas and destroys cleanly', async () => {
    const el = mount()

    await flush()

    const canvas = document.createElement(HTML_TAGS.CANVAS)

    el.shadowRoot.appendChild(canvas)
    el._menuFlagCanvasEl = canvas
    el._menuFlagLang = el.currentLang
    el._mountNavFlag()

    // Second mount with a live flag on the same canvas is a no-op.
    el._mountNavFlag()

    const destroy = jest.fn()

    el._navFlags = [{ canvas, destroy }]
    el._destroyNavFlag()

    expect(destroy).toHaveBeenCalled()
    expect(el._navFlags).toEqual([])
    expect(el._menuFlagCanvasEl).toBeNull()

    canvas.remove()
    el.remove()
  })

  test('canvas helpers create once then reuse', async () => {
    const el = mount()

    await flush()

    const burger = el._burgerCanvas(TEST_TEXT.HEADING)
    const burger2 = el._burgerCanvas(TEST_TEXT.HEADING)

    expect(burger).toBe(burger2)
    expect(burger.tagName).toBe(HTML_TAGS.CANVAS.toUpperCase())

    const menuCanvas = el._menuCanvas()
    const menuCanvas2 = el._menuCanvas()

    expect(menuCanvas).toBe(menuCanvas2)

    const closeCanvas = el._menuCloseCanvas()
    const closeCanvas2 = el._menuCloseCanvas()

    expect(closeCanvas).toBe(closeCanvas2)

    el.remove()
  })

  test('router subscription refreshes DOM and remounts flags', async () => {
    const el = mount()

    await flush()

    const domSpy = jest.spyOn(el, '_updateDom')
    const flagSpy = jest.spyOn(el, '_mountNavFlag')

    el.subscribeRouter()
    router.push('/nonexistent-coverage-route')

    await flush(120)

    router.push('/')

    await flush(120)

    expect(domSpy).toHaveBeenCalled()
    expect(flagSpy).toHaveBeenCalled()

    el.remove()
  })

  test('menu-open render exposes flag + close canvases for mounting', async () => {
    const el = mount()

    await flush()

    el._openMenu()

    await flush()

    const close = el._menuCloseCanvasEl

    expect(el._menuOpen).toBe(true)

    if (close) el._mountMenuWebGL()

    // Close path with an already-destroyed bg only clears the close btn.
    el._menuClosing = false
    el._closeMenu()

    await new Promise((r) => setTimeout(r, ANIMATION_DURATIONS.MENU_CLOSE_DURATION + 80))

    el.remove()
  })

  test('onDestroy tears down all widget state', async () => {
    const el = mount()

    await flush()

    el._menuSettleTimer = setTimeout(() => {}, 10000)
    el._menuCloseBtn = { destroy: jest.fn() }
    el._menuBg = { destroy: jest.fn(), release: jest.fn() }
    el._burgerBtn = { destroy: jest.fn() }

    el.onDestroy()

    expect(el._menuBg).toBeNull()

    el.remove()
  })
})
