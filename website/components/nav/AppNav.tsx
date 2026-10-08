/**
 * @file AppNav.js
 * @description <app-nav> — the persistent top navigation bar: logo, burger
 * button opening the fullscreen menu overlay, locale flag trigger for the
 * language dialog, and the preferences trigger. Hosts the WebGL burger,
 * menu-background and flag widgets, tracks scroll section state for the
 * --on-dark variant over the dark contact band, and owns the genie-open
 * origin for both dialogs.
 */

import { KEYS } from '@core/tokens/primitives.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { SECTIONS } from '@core/tokens/base.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { KEYBOARD_EVENTS } from '@core/tokens/events/dom.js'
import { ROUTE_NAMES, ROUTE_PREFIXES } from '@core/tokens/routes/names.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { h } from '@core/jsx.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { LANG_OPTIONS, LANG_SLUGS } from '@core/i18n.js'
import { predictiveLoader } from '@core/predictive-loader.js'
import type { FlagWebGL } from '@core/utils/canvas/widgets/flag-webgl.js'
import type { MenuBackgroundWebGL } from '@core/utils/canvas/loaders/menu-background-webgl.js'
import type { CloseButtonWebGL } from '@core/utils/canvas/widgets/close-button.js'
import type { BurgerButtonWebGL } from '@core/utils/canvas/widgets/burger-button-webgl.js'
import { destroyNavFlag, mountNavFlag, navFlagCanvas, renderNavLocaleFlag } from './flag.js'
import { goToAbout, scrollToContact, scrollToTop } from './scroll.js'
import {
  captureOrigin,
  handleAbout,
  handleAction,
  handleLang,
  handleLogo,
  handlePreferences,
} from './handlers.js'
import { renderAppNav } from './render.js'
import {
  closeNavMenu,
  mountNavBurgerWebGL,
  mountNavMenuWebGL,
  navBurgerCanvas,
  navMenuCanvas,
  navMenuCloseCanvas,
  openNavMenu,
  toggleNavMenu,
} from './menu.js'
import appStyles from '@core/sass/components/shell/app.scss?inline'

/**
 * Pre-computed set of every locale's localized earth-playground slug —
 * `isPlaygroundPage` needs O(1) membership tests on the last URL segment
 * (the route resolver may not have run yet when the getter first fires),
 * so all 16 locales' `earthPlayground` values are flattened once at module
 * load rather than re-built per check.
 */
const _PLAYGROUND_SLUGS = new Set(
  Object.values(LANG_SLUGS)
    .map((s) => s.earthPlayground)
    .filter(Boolean)
)

/**
 * The slice of the APP translation dictionary the nav template reads —
 * all fields optional since the dictionary arrives incrementally and the
 * template falls back to English snapshot copy per key.
 */
interface AppNavTranslations {
  title?: string
  about?: { description?: string }
  contact?: string
  scrollup?: string
  related?: string
  menu?: string
  close?: string
  earthPlayground?: string
  preferences?: string
}

/**
 * <app-nav> — persistent top bar (logo, burger, locale flag, preferences
 * trigger) plus the fullscreen menu overlay. Owns four WebGL widgets
 * (burger, menu background, menu close, locale flag) on persistent
 * canvases that are never re-created by re-renders — one GL context per
 * widget for the element's lifetime.
 */
export class AppNav extends BaseComponent {
  /** APP dictionary pushed by <app-root>; null until first fetch lands. */
  _translations: AppNavTranslations | null = null
  /** Locale the pushed `_translations` were fetched for — the getter returns null on mismatch so stale copy never renders mid-switch. */
  _translationsLocale: string | null = null
  /** Home anchor the scroll position sits in — drives nav-active styles. */
  activeSection: string = SECTIONS.HOME
  /** Within 200px of document bottom — flips CTA to "scroll up". */
  onBottom = false
  /** Live FlagWebGL widgets (currently max one — the menu flag). */
  _navFlags: FlagWebGL[] = []
  /** True while the nav floats over a dark section — drives the --on-dark variant for contrast inversion. */
  _onDark = false

  // Menu overlay state machine: open → (settling) → settled → closing →
  // closed. _menuSettled marks the end of the open animation — the close
  // button's X is snapped to fully-drawn on reopen if a previous open
  // already completed.
  /** Menu overlay is open. */
  _menuOpen = false
  /** Close animation in flight — blocks re-entry/double-close. */
  _menuClosing = false
  /** Open animation completed — close X can snap to drawn state on reopen. */
  _menuSettled = false
  /** Handle for the settle delay; cleared on destroy so no timer outlives the element. */
  _menuSettleTimer: ReturnType<typeof setTimeout> | null = null

  /** MenuBackgroundWebGL instance — owns the fullscreen contour canvas. */
  _menuBg: MenuBackgroundWebGL | null = null
  /** CloseButtonWebGL on the menu's X. */
  _menuCloseBtn: CloseButtonWebGL | null = null
  /** BurgerButtonWebGL on the persistent burger canvas. */
  _burgerBtn: BurgerButtonWebGL | null = null

  // Persistent canvas elements — created once, never re-created by
  // re-renders, so each keeps one GL context for its widget's lifetime.
  /** Burger button canvas host. */
  _burgerCanvasEl: HTMLCanvasElement | null = null
  /** Fullscreen menu background canvas host. */
  _menuCanvasEl: HTMLCanvasElement | null = null
  /** Menu close-X canvas host. */
  _menuCloseCanvasEl: HTMLCanvasElement | null = null
  /** Menu flag canvas + the locale it was built for (rebuilt on change). */
  _menuFlagCanvasEl: HTMLCanvasElement | null = null
  _menuFlagLang: string | null = null

  /**
   * Snapshot of the store inputs the template actually consumes —
   * compared in onStoreUpdate so unrelated commits (dialog open/close,
   * modal origin, scroll flags) don't force a DOM wipe that replays the
   * draw-text letter animation.
   */
  _navStoreSig: {
    locale: unknown
    app: unknown
    components: unknown
    slugs: unknown
    modalOpen: boolean
    reduced: boolean
  } | null = null

  constructor() {
    super(appStyles)
  }

  /** Setter/getter — the APP translation dictionary pushed by <app-root>. */

  set translations(val: AppNavTranslations | null) {
    this._translations = val

    this._translationsLocale = this.locale

    if (this._isMounted) this._updateDom()
  }

  get translations() {
    if (this._translationsLocale && this._translationsLocale !== this.locale) {
      return null
    }

    return this._translations
  }

  /** The router's active route descriptor. */

  get currentRoute() {
    return router.currentRoute
  }

  /** True on home/about/contact routes (nav shows section links). */

  get isHomePage() {
    const name = this.currentRoute?.name || ROUTE_NAMES.HOME

    return (
      name.startsWith(ROUTE_PREFIXES.HOME) ||
      name.startsWith(ROUTE_PREFIXES.ABOUT) ||
      name.startsWith(ROUTE_PREFIXES.CONTACT)
    )
  }

  /**
   * True on the playground route (nav renders in its alternate variant).
   * Three checks, in order: the resolved route name (fast path), the raw
   * last URL segment vs the canonical English segments (covers the window
   * before the first navigation resolves), and the precomputed set of all
   * 16 locales' localized playground slugs.
   */
  get isPlaygroundPage() {
    const name = this.currentRoute?.name

    if (name === ROUTE_NAMES.EARTH_PLAYGROUND) return true

    const path =
      typeof window !== TYPE_STRINGS.UNDEFINED ? window.location.pathname : ATTR_VALUES.EMPTY

    const segments = path.split(CHAR_STRINGS.SLASH).filter(Boolean)

    const last = segments[segments.length - 1]

    if (
      last === ROUTE_PATHS.EARTH_PLAYGROUND_SEGMENT ||
      last === ROUTE_PATHS.SPACE_PLAYGROUND_SEGMENT
    )
      return true

    return _PLAYGROUND_SLUGS.has(last)
  }

  /** Active locale code. */

  get locale() {
    return store.getters.getLang()
  }

  /** The active LANG_OPTIONS entry (code + label + flag). */

  get currentLang() {
    return LANG_OPTIONS.find((l) => l.code === this.locale) ?? null
  }

  /** Display label for the active locale in the flag button. */

  get currentLangLabel() {
    return this.currentLang?.label ?? this.locale.toUpperCase()
  }

  /**
   * Returns the persistent flag canvas for the current locale, rebuilding
   * it only when the locale changed. The element survives re-renders so
   * the WebGL context is created once per language, not per render.
   * @returns {HTMLCanvasElement}
   */
  _flagCanvas(): HTMLCanvasElement {
    return navFlagCanvas(this)
  }

  /** Mounts the FlagWebGL widget onto the nav flag button (theme + reduced-motion aware). */

  renderLocaleFlag() {
    return renderNavLocaleFlag(this)
  }

  /** Lifecycle: wires store subscription, scroll/nav event listeners, router subscription and mounts the WebGL nav widgets. */

  override onMounted() {
    this.subscribe(store)

    this.subscribeRouter()

    this._bindEvents()

    predictiveLoader.scanAndObserve(this.shadowRoot)

    this._mountNavFlag()

    this._mountBurgerWebGL()

    this._mountMenuWebGL()
  }

  /** Lifecycle: after re-render, re-mounts WebGL widgets that the new DOM replaced. */

  override onUpdated() {
    predictiveLoader.scanAndObserve(this.shadowRoot)

    this._mountNavFlag()

    this._mountBurgerWebGL()

    this._mountMenuWebGL()
  }

  /** Lifecycle: destroys the burger/menu/flag GL widgets and unbinds listeners. */

  override onDestroy() {
    this._destroyNavFlag()

    if (this._menuSettleTimer) {
      clearTimeout(this._menuSettleTimer)

      this._menuSettleTimer = null
    }

    if (this._burgerBtn) {
      this._burgerBtn.destroy()

      this._burgerBtn = null
    }

    if (this._menuCloseBtn) {
      this._menuCloseBtn.destroy()

      this._menuCloseBtn = null
    }

    if (this._menuBg) {
      this._menuBg.destroy?.()

      this._menuBg = null
    }
  }

  /** Creates the FlagWebGL instance on the flag button's canvas. */

  _mountNavFlag() {
    mountNavFlag(this)
  }

  /** Tears down the FlagWebGL instance. */

  _destroyNavFlag() {
    destroyNavFlag(this)
  }

  /** Subscribes to route changes so nav state/links refresh per page. */

  subscribeRouter() {
    router.subscribe(() => {
      this._updateDom()

      this._mountNavFlag()
    })
  }

  /**
   * Store change → re-render only when a value the template consumes
   * actually moved: the locale, the live dictionaries `appText` resolves
   * against (app/components/slugs — mutations replace them wholesale, so
   * identity comparison works), the media-modal open flag (nav renders
   * empty behind it) and reduced-motion. Dialog open/close, modal-origin
   * and other commits leave the DOM alone — critically, while the menu
   * is open behind a dialog this keeps every <draw-text> label mounted
   * and already-drawn instead of replaying the letter animation.
   * Reduced-motion still reaches live flag widgets on every commit so
   * they freeze without waiting for a rebuild.
   */
  override onStoreUpdate() {
    const lang = store.getters.getlang()

    const modalOpen = store.getters.getModal()?.open === true

    const reduced = store.getters.getReducedMotion()

    const prev = this._navStoreSig

    if (
      !prev ||
      lang.locale !== prev.locale ||
      lang.app !== prev.app ||
      lang.components !== prev.components ||
      lang.slugs !== prev.slugs ||
      modalOpen !== prev.modalOpen ||
      reduced !== prev.reduced
    ) {
      this._navStoreSig = {
        locale: lang.locale,
        app: lang.app,
        components: lang.components,
        slugs: lang.slugs,
        modalOpen,
        reduced,
      }

      this._updateDom()

      this._mountNavFlag()
    }

    this._navFlags.forEach((f) => f.setReducedMotion(reduced))
  }

  /** Receives active-section + near-bottom flags from <app-root>'s scroll tracker and toggles the --on-dark variant. */

  updateScrollState(activeSection: string, onBottom: boolean): void {
    if (this.activeSection === activeSection && this.onBottom === onBottom) {
      return
    }

    this.activeSection = activeSection

    this.onBottom = onBottom

    this._updateDom()

    this._mountNavFlag()
  }

  /** Binds click/scroll/menu-toggle handlers inside the shadow root. */

  _bindEvents() {
    this.addScopedListener(window, KEYBOARD_EVENTS.KEYDOWN, (e) => {
      if (
        (e as KeyboardEvent).key === KEYS.ESCAPE &&
        this._menuOpen &&
        !store.getters.getPreferencesOpen() &&
        !store.getters.getLangDialogOpen()
      ) {
        this._closeMenu()
      }
    })
  }

  /** Smooth-scrolls the window back to the top. */

  scrollToTop() {
    scrollToTop(this)
  }

  /** Navigates to (or scrolls to) the about section — route-aware. */

  goToAbout() {
    goToAbout(this)
  }

  /** Navigates to (or scrolls to) the contact footer — route-aware. */

  scrollToContact() {
    scrollToContact(this)
  }

  /** Logo click: navigates home, or scrolls top when already on home. */

  handleLogo(e?: Event): void {
    handleLogo(this, e)
  }

  /** About link click: routes to the localized about slug. */

  handleAbout(e?: Event): void {
    handleAbout(this, e)
  }

  /** Contact/CTA click: routes to the localized contact slug. */

  handleAction(e?: Event): void {
    handleAction(this, e)
  }

  /**
   * Records the clicked button's center point in store.modalOrigin — the
   * preferences/lang dialogs read it to zoom their "genie" open animation
   * out from the trigger instead of from screen center.
   */
  _captureOrigin(e?: Event): void {
    captureOrigin(e)
  }

  /** Opens the preferences modal (fires open-preferences-modal after capturing origin). */

  handlePreferences(e?: Event): void {
    handlePreferences(this, e)
  }

  /** Opens the language dialog (fires open-lang-dialog after capturing origin). */

  handleLang(e?: Event): void {
    handleLang(this, e)
  }

  /**
   * JSX template: logo button, burger, and the fullscreen menu overlay —
   * the markup lives in nav-render.tsx; this delegates with `this`.
   */
  override render() {
    return renderAppNav(this)
  }

  /** Persistent burger canvas (aria-labeled) — created once, survives re-renders so its GL context does. */
  _burgerCanvas(label: string): HTMLCanvasElement {
    return navBurgerCanvas(this, label)
  }

  /** Canvas JSX for the WebGL menu background. */

  _menuCanvas(): HTMLCanvasElement {
    return navMenuCanvas(this)
  }

  /** Canvas JSX for the WebGL menu close (X) icon. */

  _menuCloseCanvas(): HTMLCanvasElement {
    return navMenuCloseCanvas(this)
  }

  /** Opens/closes the fullscreen menu overlay. */

  _toggleMenu() {
    toggleNavMenu(this)
  }

  /** Opens the menu (see nav-menu.ts for the state machine). */

  _openMenu() {
    openNavMenu(this)
  }

  /** Binds the WebGL layers to the persistent menu canvases. */

  _mountMenuWebGL() {
    mountNavMenuWebGL(this)
  }

  /** Attaches BurgerButtonWebGL to the persistent burger canvas. */

  _mountBurgerWebGL() {
    mountNavBurgerWebGL(this)
  }

  /**
   * Closes the menu through the full dissolve cycle (see nav-menu.ts).
   * The _menuClosing guard makes double-close (Esc + click) a no-op.
   */

  _closeMenu() {
    closeNavMenu(this)
  }
}

// Registration guard: customElements.define throws on a duplicate tag —
// the `get` check keeps module re-evaluation (HMR, coverage re-imports)
// safe since the registry is global, not per-module-instance.
if (!customElements.get(COMPONENT_TAGS.APP_NAV)) {
  customElements.define(COMPONENT_TAGS.APP_NAV, AppNav)
}
