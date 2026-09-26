import { h } from './core/jsx.js'
import { BaseComponent } from './core/Component.js'
import store from './core/store.js'
import router from './core/router.js'
import { deepQuerySelector } from './core/dom.js'
import { fetchFirebaseDb } from './utils/db.js'
import { TAGS, STRINGS, CLASSES, ATTRS, IDS, EVENTS, MUTATIONS, THEME, SECTIONS, ROUTE_PREFIXES, PATHS, URLS } from './core/constants.js'


// Route depth: home = 0, all other views = 1


import appStyles from './sass/components/app.scss?inline'
import './components/AppNav.js'
import './components/PreferencesModal.js'
import './components/LangDialog.js'
import './components/CookieBanner.js'
import './components/StatsHud.js'
import './components/DrawText.js'
import './views/Home.js'
import { IntroLoader } from './utils/canvas/intro-loader.js'

export class AppRoot extends BaseComponent {
  constructor() {
    super(appStyles)
    this.translations = null
    this.routeLoading = false
    this.activeSection = SECTIONS.HOME
    this.onBottom = false
    this.currentViewTag = TAGS.VIEW_HOME
    this._aboutTop = 600
    this._contactTop = 1500

  }

  get modal() {
    return store.getters.getModal()
  }

  get locale() {
    return store.getters.getLang()
  }

  onMounted() {
    store.commit(MUTATIONS.INIT_THEME)
    store.commit(MUTATIONS.INIT_REDUCED_MOTION)
    this.initInputListeners()
    this.loadData()

    if (store.getters.getShowGrid()) {
      document.documentElement.classList.add(CLASSES.SHOW_GRID)
    }

    this.subscribe(store)

    // Listen to open-preferences-modal from app-nav
    const openPref = () => {
      const pref = this.$(TAGS.PREFERENCES_MODAL)
      if (pref) pref.open = true
    }
    this.addScopedListener(this, EVENTS.OPEN_PREFERENCES_MODAL, openPref)
    this.addScopedListener(window, EVENTS.OPEN_PREFERENCES_MODAL, openPref)

    // Listen to open-lang-dialog from app-nav
    const openLang = () => {
      const dialog = this.$(TAGS.LANG_DIALOG)
      if (dialog) dialog.open = true
    }
    this.addScopedListener(this, EVENTS.OPEN_LANG_DIALOG, openLang)
    this.addScopedListener(window, EVENTS.OPEN_LANG_DIALOG, openLang)

    // Subscribe to router
    router.subscribe((to, from) => {
      this.routeLoading = true
      const pBar = this.$(`.${CLASSES.PROGRESS_BAR}`)
      if (pBar) pBar.classList.add(CLASSES.PROGRESS_BAR_ACTIVE)

      this.currentViewTag = to.view
      this._updateViewContent(to, from)
      this.loadData()

      setTimeout(() => {
        this.routeLoading = false
        if (pBar) pBar.classList.remove(CLASSES.PROGRESS_BAR_ACTIVE)
      }, 450)
    })


    // Initial view
    if (router.currentRoute) {
      this.currentViewTag = router.currentRoute.view
      this._updateViewContent()
    }

    // Scroll listeners
    const deferInitScroll = typeof window !== STRINGS.UNDEFINED && window.requestIdleCallback ? window.requestIdleCallback : (cb) => setTimeout(cb, 100)

    deferInitScroll(() => {
      this.updateSectionTops()
      this.checkScroll()
    })

    this.addScopedListener(window, EVENTS.SCROLL, () => this.checkScroll(), { passive: true })

    let resizeTimer = null
    this.addScopedListener(
      window,
      EVENTS.RESIZE,
      () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          this.updateSectionTops()
          this.checkScroll()
        }, 150)
      },
      { passive: true }
    )

    if (window.matchMedia) {
      this.addScopedListener(
        window.matchMedia(STRINGS.DARK_SCHEME_QUERY),
        EVENTS.CHANGE,
        () => {
          if (store.getters.getTheme() === THEME.SYSTEM) {
            store.commit(MUTATIONS.APPLY_THEME)
          }
        }
      )
    }

    this._introLoader = new IntroLoader(document.body)

  }

  onDestroy() {
    this._introLoader?.destroy()
  }

  onStoreUpdate() {
    const currentLocale = store.getters.getLang()

    if (this._loadedLang && this._loadedLang !== currentLocale) {
      this.loadData()
    }

    // Update modal class on the root wrapper imperatively (no full DOM wipe)
    this._updateModalState()


  }

  _updateModalState() {
    const wrapper = this.$(`[${ATTRS.DATA_APP_WRAPPER}]`)
    const mainEl = this.$(`#${IDS.MAIN_CONTENT}`)
    const modal = store.getters.getModal()
    const isOpen = !!modal?.open

    if (typeof document !== STRINGS.UNDEFINED) {
      document.documentElement.classList.toggle(CLASSES.MODAL_OPEN, isOpen)
      document.body.classList.toggle(CLASSES.MODAL_OPEN, isOpen)
    }

    if (wrapper) {
      wrapper.className = modal?.class || ATTRS.EMPTY
    }
    if (modal?.open) {
      // Apply iOS Safari scroll lock: position:fixed on main prevents rubber-band scroll
      const scrollY = modal.transform || 0
      document.documentElement.style.setProperty('--modal-top', `-${scrollY}${STRINGS.PX}`)
      if (mainEl) {
        mainEl.style.position = STRINGS.FIXED
        mainEl.style.top = `-${scrollY}${STRINGS.PX}`
        mainEl.style.width = STRINGS.PERCENT_100
        mainEl.style.left = STRINGS.ZERO
      }
    } else {
      // Restore scroll position when modal closes
      if (mainEl) {
        const top = mainEl.style.top
        mainEl.style.position = STRINGS.EMPTY
        mainEl.style.top = STRINGS.EMPTY
        mainEl.style.width = STRINGS.EMPTY
        mainEl.style.left = STRINGS.EMPTY
        if (top) {
          const scrollY = Math.abs(parseInt(top, 10)) || 0
          window.scrollTo(0, scrollY)
        }
      }
    }
  }


  initInputListeners() {
    const setTouch = () => {
      if (store.getters.getInputMethod() !== STRINGS.TOUCH) store.commit(MUTATIONS.SET_INPUT_METHOD, STRINGS.TOUCH)
    }
    const setPointer = () => {
      if (store.getters.getInputMethod() !== STRINGS.POINTER) store.commit(MUTATIONS.SET_INPUT_METHOD, STRINGS.POINTER)
    }

    if (window.PointerEvent) {
      this.addScopedListener(
        window,
        EVENTS.POINTERDOWN,
        (e) => {
          if (e.pointerType === STRINGS.TOUCH) setTouch()
          else if (e.pointerType === STRINGS.MOUSE || e.pointerType === STRINGS.PEN) setPointer()
        },
        { passive: true }
      )
    } else {
      this.addScopedListener(window, EVENTS.TOUCHSTART, setTouch, { passive: true })
      this.addScopedListener(window, EVENTS.MOUSEDOWN, setPointer, { passive: true })
    }

    this.addScopedListener(window, EVENTS.CONTEXTMENU, (e) => {
      if (e.target?.closest?.('img, video, audio')) {
        e.preventDefault()
      }
    })

    this.addScopedListener(window, EVENTS.DRAGSTART, (e) => {
      if (e.target?.closest?.('img, video, audio')) {
        e.preventDefault()
      }
    })
  }

  loadData() {
    const currentLocale = store.getters.getLang()
    if (this._loadedLang && this._loadedLang !== currentLocale) {
      this.translations = null
    }
    this._loadedLang = currentLocale
    const dbpath = store.getters.getlang().database + currentLocale

    const promises = []

    if (!this.translations) {
      promises.push(
        fetchFirebaseDb(`${dbpath}${PATHS.SLASH}APP`).then((snapshot) => {
          if (snapshot.exists()) {
            this.translations = snapshot.val()
            store.commit(MUTATIONS.SET_CLICK_OR_TAP, {
              click: this.translations.actions?.click,
              tap: this.translations.actions?.tap,
            })
            const nav = this.$(TAGS.APP_NAV)
            if (nav) nav.translations = this.translations
            const cookie = this.$(TAGS.COOKIE_BANNER)
            if (cookie) cookie.translations = this.translations
            const pref = this.$(TAGS.PREFERENCES_MODAL)
            if (pref) pref.pref = this.translations.pref

            if (this.translations.carousel) {
              store.commit(MUTATIONS.SET_CAROUSEL_LANG, this.translations.carousel)
            }

            if (this.translations.statsHud) {
              store.commit(MUTATIONS.SET_STATS_HUD_LANG, this.translations.statsHud)
            }
          }
        })
      )
    }

    if (!store.getters.getlang()?.components) {
      promises.push(
        fetchFirebaseDb(`${dbpath}${PATHS.COMPONENTS}`).then((snapshot) => {
          if (snapshot.exists()) {
            store.commit(MUTATIONS.SET_COMPONENT_LANG, snapshot.val())
          }
        })
      )
    }

    Promise.all(promises).catch(console.error)
  }

  updateSectionTops() {
    const aboutEl = deepQuerySelector(`#${IDS.ABOUT}`)
    const contactEl = deepQuerySelector(`#${IDS.CONTACT}`)
    if (aboutEl) {
      const rect = aboutEl.getBoundingClientRect()
      this._aboutTop = rect.top + window.scrollY - 250
    }
    if (contactEl) {
      const rect = contactEl.getBoundingClientRect()
      this._contactTop = rect.top + window.scrollY - 250
    }
  }

  checkScroll() {
    const y = window.scrollY
    const scrollH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
    this.onBottom = scrollH - y <= window.innerHeight + 200

    const isHomePage =
      router.currentRoute?.name?.startsWith(ROUTE_PREFIXES.HOME) ||
      router.currentRoute?.name?.startsWith(ROUTE_PREFIXES.ABOUT) ||
      router.currentRoute?.name?.startsWith(ROUTE_PREFIXES.CONTACT)

    if (!isHomePage) {
      const nav = this.$(TAGS.APP_NAV)
      if (nav) nav.updateScrollState(this.activeSection, this.onBottom)
      return
    }

    const aboutTop = this._aboutTop ?? 600
    const contactTop = this._contactTop ?? 1500

    let newSection
    if (y >= contactTop || this.onBottom) {
      newSection = SECTIONS.CONTACT
    } else if (y >= aboutTop) {
      newSection = SECTIONS.ABOUT
    } else {
      newSection = SECTIONS.HOME
    }

    if (this.activeSection !== newSection) {
      this.activeSection = newSection
    }

    const nav = this.$(TAGS.APP_NAV)
    if (nav) nav.updateScrollState(this.activeSection, this.onBottom)
  }

  _updateViewContent(to) {
    const outlet = this.$(`#${IDS.VIEW_OUTLET}`)
    if (!outlet) return

    const current = outlet.firstElementChild
    if (current && current.tagName.toLowerCase() === this.currentViewTag.toLowerCase()) {
      if (typeof current.onRouteParamChange === STRINGS.FUNCTION) {
        current.onRouteParamChange(to || router.currentRoute)
      }
      return
    }

    this._flipToView(outlet, to)
  }

  async _flipToView(outlet, to) {
    const reduced = store.getters.getReducedMotion()
    const toTag   = this.currentViewTag
    const FADE_MS = 350 // half-duration: fade-out then fade-in

    if (toTag === TAGS.VIEW_LEGAL) {
      await import('./views/Legal.js')
    } else if (toTag === TAGS.VIEW_PROJECT) {
      await import('./views/Project.js')
    } else if (toTag === TAGS.VIEW_NOT_FOUND) {
      await import('./views/NotFound.js')
    } else if (toTag === TAGS.VIEW_ADMIN_LOGIN) {
      await import('./views/AdminLogin.js')
    } else if (toTag === TAGS.VIEW_CMS_DASHBOARD) {
      await import('./views/CmsDashboard.js')
    } else if (toTag === TAGS.VIEW_SPACE_PLAYGROUND) {
      await import('./views/SpacePlayground.js')
    }

    if (reduced || !outlet.firstElementChild) {
      // Instant swap — no animation
      outlet.replaceChildren(document.createElement(toTag))
      return
    }

    const outgoing = outlet.firstElementChild

    outgoing.classList.add(CLASSES.PAGE_FADE_OUT)

    setTimeout(() => {
      const incoming = document.createElement(toTag)

      incoming.classList.add(CLASSES.PAGE_FADE_IN)
      outlet.replaceChildren(incoming)

      void incoming.offsetHeight

      incoming.classList.remove(CLASSES.PAGE_FADE_IN)
    }, FADE_MS)
  }

  render() {
    const modalClass = this.modal?.class || STRINGS.EMPTY
    const AppNav = TAGS.APP_NAV
    const PreferencesModal = TAGS.PREFERENCES_MODAL
    const LangDialog = TAGS.LANG_DIALOG
    const CookieBanner = TAGS.COOKIE_BANNER
    const StatsHud = TAGS.STATS_HUD
    const CurrentView = this.currentViewTag

    return (
      <div data-app-wrapper className={modalClass}>
        <div className={`${CLASSES.PROGRESS_BAR} ${this.routeLoading ? CLASSES.PROGRESS_BAR_ACTIVE : STRINGS.EMPTY}`} />

        <AppNav />

        <PreferencesModal />
        <LangDialog />

        <main id={IDS.MAIN_CONTENT}>
          <div id={IDS.VIEW_OUTLET}>
            <CurrentView />
          </div>
        </main>

        <CookieBanner />
        <StatsHud />
      </div>
    )
  }

  onUpdated() {
    const nav = this.$(TAGS.APP_NAV)
    if (nav) nav.translations = this.translations
    const cookie = this.$(TAGS.COOKIE_BANNER)
    if (cookie) cookie.translations = this.translations
    const pref = this.$(TAGS.PREFERENCES_MODAL)
    if (pref) {
      pref.pref = this.translations?.pref
    }
    this._updateModalState()
  }
}

if (!customElements.get(TAGS.APP_ROOT)) {
  customElements.define(TAGS.APP_ROOT, AppRoot)
}
