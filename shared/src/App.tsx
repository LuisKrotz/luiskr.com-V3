/**
 * @file App.js
 * @description <app-root> — the application's shell custom element.
 *
 * Owns the persistent chrome around the routed <main> outlet:
 *   <app-nav>, <preferences-modal>, <lang-dialog>, <cookie-banner>,
 *   <stats-hud>, the top progress bar, and #view-outlet which hosts the
 *   current route's view element (view-home, view-project, view-legal,
 *   view-not-found, view-space-playground).
 *
 * Responsibilities:
 *   - Locale data bootstrap: fetches APP / components / slugs nodes and
 *     pushes them into the store + child components (SWR pattern).
 *   - Router wiring: swaps the view element on navigation with a
 *     fade-out/fade-in transition (skipped under reduced motion).
 *   - Scroll tracking: measures #about / #contact positions and feeds
 *     active-section state to the nav (drives its --on-dark variant).
 *   - Modal scroll-lock: applies the iOS-safe fixed-position technique on
 *     <main> while a modal is open and restores scroll on close.
 *   - Input-method detection (pointer vs touch) for :hover-less devices.
 *   - Theme listener: re-applies THEME.SYSTEM when the OS scheme changes.
 */

import { SECTIONS } from '@core/tokens/base.js'
import { APP_CLASSES } from '@core/tokens/classes/app.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { APP_IDS } from '@core/tokens/ids/app.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { h } from '@core/jsx.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import type { IntroLoader } from '@core/utils/canvas/loaders/intro-loader.js'
import { mountAppShell } from './app/boot.js'
import { loadAppData } from './app/data.js'
import { initAppInputListeners } from './app/input.js'
import { updateAppModalState } from './app/modal.js'
import { checkAppScroll, updateAppSectionTops } from './app/scroll.js'
import type { AppNavEl, AppTranslations, CookieBannerEl, PrefModalEl } from './app/types.js'
import { flipAppView, updateAppViewContent } from './app/view.js'
import type { RouteDescriptor } from '@core/router/router.js'

// Route depth: home = 0, all other views = 1

import appStyles from '@core/sass/components/shell/app.scss?inline'
import '@website/components/nav/AppNav.js'
import '@website/components/feedback/CookieBanner.js'

/**
 * Application shell element. Extends the shared BaseComponent (shadow DOM,
 * scoped listeners, store subscription, _updateDom re-render pipeline).
 */
export class AppRoot extends BaseComponent {
  // The locale's APP dictionary — fanned out to nav/cookie/pref children.
  translations: AppTranslations | null = null
  // Drives the top progress bar while a route swap is in flight.
  routeLoading = false
  // Which home anchor the scroll position is inside (home/about/contact).
  activeSection: string = SECTIONS.HOME
  // True within 200px of document bottom — nav forces dark-mode styling.
  onBottom = false
  // Tag name of the routed view element inside #view-outlet.
  currentViewTag: string = router.currentRoute?.view || VIEW_TAGS.VIEW_HOME
  // Scroll positions of the #about / #contact markers (fallback values
  // until updateSectionTops() can measure the live view).
  _aboutTop = 600
  _contactTop = 1500
  _sectionsMeasured = false
  _lastMeasureAttempt = 0
  _loadedLang: string | null = null
  _introLoader: IntroLoader | null = null
  /** Watches document height so onBottom/activeSection never go stale. */
  _docObserver: ResizeObserver | null = null

  constructor() {
    super(appStyles)
  }

  /** Current modal descriptor from the store ({ open, class, transform }). */
  get modal() {
    return store.getters.getModal()
  }

  /** Active locale code (en, pt, gl, …). */
  get locale() {
    return store.getters.getLang()
  }

  /**
   * Lifecycle: runs once when <app-root> connects to the DOM.
   * Applies persisted preferences, boots data loading, wires the router
   * subscription, scroll/resize/theme listeners, and lazily imports the
   * modal/dialog/HUD chunks so they aren't on the critical path.
   */
  override onMounted() {
    mountAppShell(this)
  }

  /** Lifecycle: releases the intro loader + document observer when the element disconnects. */
  override onDestroy() {
    this._introLoader?.destroy()

    this._docObserver?.disconnect()
  }

  /**
   * Store-subscription callback: reloads locale data when the language
   * changes and re-applies modal open/close state to the shell.
   */
  override onStoreUpdate() {
    const currentLocale = store.getters.getLang()

    if (this._loadedLang && this._loadedLang !== currentLocale) {
      this.loadData()
    }

    // Update modal class on the root wrapper imperatively (no full DOM wipe)
    this._updateModalState()
  }

  /**
   * Syncs modal state into the DOM without a full re-render:
   *   - toggles .modal-open on <html>/<body> (locks scroll via CSS)
   *   - copies the modal's modifier class onto the app wrapper
   *   - applies the iOS Safari scroll-lock: <main> becomes position:fixed
   *     at -scrollY so the page can't rubber-band behind the dialog
   *   - restores the scroll offset when the modal closes
   */
  _updateModalState() {
    updateAppModalState(this)
  }

  /**
   * Tracks the input method ('pointer' vs 'touch') in the store so styles
   * can suppress sticky hover states on touch devices. Prefers the unified
   * PointerEvent API, falls back to touchstart/mousedown.
   * Also blocks the context menu and drag on media elements (portfolio
   * imagery shouldn't be right-click-saved or dragged).
   */
  initInputListeners() {
    initAppInputListeners(this)
  }

  /**
   * Loads the locale's translation nodes (APP, slugs, components) via the
   * static-first SWR layer and pushes them into the store + already-mounted
   * children. Skips nodes already cached for the current locale.
   */
  loadData() {
    loadAppData(this)
  }

  /**
   * Measures the document offsets of the #about and #contact section markers
   * inside the home view's shadow DOM (deepQuerySelector pierces it) and
   * records whether both existed — a partial measure keeps
   * _sectionsMeasured false so checkScroll retries lazily.
   */
  updateSectionTops() {
    updateAppSectionTops(this)
  }

  /**
   * Scroll handler: computes near-bottom state and the active home section
   * (home/about/contact) from measured tops, then pushes both to <app-nav>
   * so it can switch to the --on-dark variant over the dark contact band.
   * No-ops on non-home routes except still feeding the nav its state.
   */
  checkScroll() {
    checkAppScroll(this)
  }

  /**
   * Reconciles #view-outlet with the target route's view tag. If the same
   * view type is already mounted (e.g. project→project), delegates to its
   * onRouteParamChange instead of remounting; otherwise flips the view.
   */
  _updateViewContent(to?: RouteDescriptor, _from?: RouteDescriptor | null) {
    updateAppViewContent(this, to, _from)
  }

  /**
   * Swaps the outlet's child for a new route view element. Dynamically
   * imports the route chunk first (each route is a separate lazy chunk),
   * then cross-fades: .page-fade-out on the outgoing view, swap after
   * 350ms, .page-fade-in on the incoming one. Reduced motion and
   * first-mount take the instant-swap path.
   */
  async _flipToView(outlet: Element, _to?: RouteDescriptor) {
    return flipAppView(this, outlet, _to)
  }

  /**
   * JSX template: persistent chrome + routed outlet. The view tag is a
   * dynamic component (CurrentView = this.currentViewTag).
   */
  override render() {
    const modalClass = this.modal?.class || CHAR_STRINGS.EMPTY
    const AppNav = COMPONENT_TAGS.APP_NAV
    const PreferencesModal = COMPONENT_TAGS.PREFERENCES_MODAL
    const LangDialog = COMPONENT_TAGS.LANG_DIALOG
    const CookieBanner = COMPONENT_TAGS.COOKIE_BANNER
    const StatsHud = COMPONENT_TAGS.STATS_HUD
    const CurrentView = this.currentViewTag

    return (
      <div data-app-wrapper className={modalClass}>
        <div
          className={`${APP_CLASSES.PROGRESS_BAR} ${this.routeLoading ? APP_CLASSES.PROGRESS_BAR_ACTIVE : CHAR_STRINGS.EMPTY}`}
        />

        <AppNav />

        <PreferencesModal />
        <LangDialog />

        <main id={APP_IDS.MAIN_CONTENT}>
          <div id={APP_IDS.VIEW_OUTLET}>
            <CurrentView />
          </div>
        </main>

        <CookieBanner />
        <StatsHud />
      </div>
    )
  }

  /** Lifecycle: after each re-render, re-pushes translations and modal state into children. */
  override onUpdated() {
    const nav = this.$<AppNavEl>(COMPONENT_TAGS.APP_NAV)
    if (nav) nav.translations = this.translations
    const cookie = this.$<CookieBannerEl>(COMPONENT_TAGS.COOKIE_BANNER)
    if (cookie) cookie.translations = this.translations
    const pref = this.$<PrefModalEl>(COMPONENT_TAGS.PREFERENCES_MODAL)
    if (pref) {
      pref.pref = this.translations?.pref
    }
    this._updateModalState()
  }
}

if (!customElements.get(COMPONENT_TAGS.APP_ROOT)) {
  customElements.define(COMPONENT_TAGS.APP_ROOT, AppRoot)
}
