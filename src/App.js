import { h } from './core/jsx.js'
import { BaseComponent } from './core/Component.js'
import store from './core/store.js'
import router from './core/router.js'
import { deepQuerySelector } from './core/dom.js'
import { fetchFirebaseDb } from './utils/db.js'
import { TAGS } from './core/constants.js'

// Route depth: home = 0, all other views = 1
const _routeDepth = (tag) => (tag === TAGS.VIEW_HOME ? 0 : 1)

import appStyles from './sass/app.scss?inline'
import './components/AppNav.js'
import './components/PreferencesModal.js'
import './components/LangDialog.js'
import './components/CookieBanner.js'
import './components/StatsHud.js'
import './views/Home.js'
import './views/Project.js'
import './views/Legal.js'
import './views/NotFound.js'
import './views/AdminLogin.js'
import './views/CmsDashboard.js'

export class AppRoot extends BaseComponent {
  constructor() {
    super(appStyles)
    this.translations = null
    this.routeLoading = false
    this.activeSection = 'home'
    this.onBottom = false
    this.currentViewTag = 'view-home'
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
    store.commit('initTheme')
    store.commit('initReducedMotion')
    this.initInputListeners()
    this.loadData()

    if (store.getters.getShowGrid()) {
      document.documentElement.classList.add('show-grid')
    }

    this.subscribe(store)

    // Listen to open-preferences-modal from app-nav
    const openPref = () => {
      const pref = this.$('preferences-modal')
      if (pref) pref.open = true
    }
    this.addScopedListener(this, 'open-preferences-modal', openPref)
    this.addScopedListener(window, 'open-preferences-modal', openPref)

    // Listen to open-lang-dialog from app-nav
    const openLang = () => {
      const dialog = this.$('lang-dialog')
      if (dialog) dialog.open = true
    }
    this.addScopedListener(this, 'open-lang-dialog', openLang)
    this.addScopedListener(window, 'open-lang-dialog', openLang)

    // Subscribe to router
    router.subscribe((to, from) => {
      this.routeLoading = true
      const pBar = this.$('.progress-bar')
      if (pBar) pBar.classList.add('progress-bar--active')

      this.currentViewTag = to.view
      this._updateViewContent(to, from)
      this.loadData()

      setTimeout(() => {
        this.routeLoading = false
        if (pBar) pBar.classList.remove('progress-bar--active')
      }, 450)
    })


    // Initial view
    if (router.currentRoute) {
      this.currentViewTag = router.currentRoute.view
      this._updateViewContent()
    }

    // Scroll listeners
    requestAnimationFrame(() => {
      this.updateSectionTops()
      this.checkScroll()
    })

    this.addScopedListener(window, 'scroll', () => this.checkScroll(), { passive: true })

    let resizeTimer = null
    this.addScopedListener(
      window,
      'resize',
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
        window.matchMedia('(prefers-color-scheme: dark)'),
        'change',
        () => {
          if (store.getters.getTheme() === 'system') {
            store.commit('applyTheme')
          }
        }
      )
    }
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
    const wrapper = this.$('[data-app-wrapper]')
    const mainEl = this.$('#main-content')
    const modal = store.getters.getModal()
    const isOpen = !!modal?.open

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('modal-open', isOpen)
      document.body.classList.toggle('modal-open', isOpen)
    }

    if (wrapper) {
      wrapper.className = modal?.class || ''
    }
    if (modal?.open) {
      // Apply iOS Safari scroll lock: position:fixed on main prevents rubber-band scroll
      const scrollY = modal.transform || 0
      document.documentElement.style.setProperty('--modal-top', `-${scrollY}px`)
      if (mainEl) {
        mainEl.style.position = 'fixed'
        mainEl.style.top = `-${scrollY}px`
        mainEl.style.width = '100%'
        mainEl.style.left = '0'
      }
    } else {
      // Restore scroll position when modal closes
      if (mainEl) {
        const top = mainEl.style.top
        mainEl.style.position = ''
        mainEl.style.top = ''
        mainEl.style.width = ''
        mainEl.style.left = ''
        if (top) {
          const scrollY = Math.abs(parseInt(top, 10)) || 0
          window.scrollTo(0, scrollY)
        }
      }
    }
  }


  initInputListeners() {
    const setTouch = () => {
      if (store.getters.getInputMethod() !== 'touch') store.commit('setInputMethod', 'touch')
    }
    const setPointer = () => {
      if (store.getters.getInputMethod() !== 'pointer') store.commit('setInputMethod', 'pointer')
    }

    if (window.PointerEvent) {
      this.addScopedListener(
        window,
        'pointerdown',
        (e) => {
          if (e.pointerType === 'touch') setTouch()
          else if (e.pointerType === 'mouse' || e.pointerType === 'pen') setPointer()
        },
        { passive: true }
      )
    } else {
      this.addScopedListener(window, 'touchstart', setTouch, { passive: true })
      this.addScopedListener(window, 'mousedown', setPointer, { passive: true })
    }
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
        fetchFirebaseDb(`${dbpath}/APP`).then((snapshot) => {
          if (snapshot.exists()) {
            this.translations = snapshot.val()
            store.commit('setClickOrTap', {
              click: this.translations.actions?.click,
              tap: this.translations.actions?.tap,
            })
            const nav = this.$('app-nav')
            if (nav) nav.translations = this.translations
            const cookie = this.$('cookie-banner')
            if (cookie) cookie.translations = this.translations
            const pref = this.$('preferences-modal')
            if (pref) pref.pref = this.translations.pref

            if (this.translations.carousel) {
              store.commit('setCarouselLang', this.translations.carousel)
            }

            if (this.translations.statsHud) {
              store.commit('setStatsHudLang', this.translations.statsHud)
            }
          }
        })
      )
    }

    if (!store.getters.getlang()?.components) {
      promises.push(
        fetchFirebaseDb(`${dbpath}/components`).then((snapshot) => {
          if (snapshot.exists()) {
            store.commit('setComponentLang', snapshot.val())
          }
        })
      )
    }

    Promise.all(promises).catch(console.error)
  }

  updateSectionTops() {
    const aboutEl = deepQuerySelector('#about')
    const contactEl = deepQuerySelector('#contact')
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
      router.currentRoute?.name?.startsWith('Home') ||
      router.currentRoute?.name?.startsWith('About') ||
      router.currentRoute?.name?.startsWith('Contact')

    if (!isHomePage) {
      const nav = this.$('app-nav')
      if (nav) nav.updateScrollState(this.activeSection, this.onBottom)
      return
    }

    const aboutTop = this._aboutTop ?? 600
    const contactTop = this._contactTop ?? 1500

    let newSection
    if (y >= contactTop || this.onBottom) {
      newSection = 'contact'
    } else if (y >= aboutTop) {
      newSection = 'about'
    } else {
      newSection = 'home'
    }

    if (this.activeSection !== newSection) {
      this.activeSection = newSection
    }

    const nav = this.$('app-nav')
    if (nav) nav.updateScrollState(this.activeSection, this.onBottom)
  }

  _updateViewContent(to) {
    const outlet = this.$('#view-outlet')
    if (!outlet) return

    const current = outlet.firstElementChild
    if (current && current.tagName.toLowerCase() === this.currentViewTag.toLowerCase()) {
      if (typeof current.onRouteParamChange === 'function') {
        current.onRouteParamChange(to || router.currentRoute)
      }
      return
    }

    this._flipToView(outlet, to)
  }

  _flipToView(outlet, to) {
    const reduced = store.getters.getReducedMotion()
    const fromTag = outlet.firstElementChild?.tagName?.toLowerCase() || TAGS.VIEW_HOME
    const toTag   = this.currentViewTag

    const fromDepth = _routeDepth(fromTag)
    const toDepth   = _routeDepth(toTag)
    const isForward = toDepth >= fromDepth
    const dirOut    = isForward ? 'page-flip-out-fwd'  : 'page-flip-out-bwd'
    const dirIn     = isForward ? 'page-flip-in-fwd'   : 'page-flip-in-bwd'
    const DURATION  = 3000 // ms — must match CSS (3s total = 1.5s out + 1.5s in)

    if (reduced || !outlet.firstElementChild) {
      // Instant swap — no animation
      outlet.replaceChildren(document.createElement(toTag))
      return
    }

    const outgoing = outlet.firstElementChild
    outgoing.classList.add(dirOut)

    setTimeout(() => {
      const incoming = document.createElement(toTag)
      incoming.classList.add(dirIn)
      outlet.replaceChildren(incoming)

      // Trigger reflow then remove the class so the element animates in
      void incoming.offsetHeight
      incoming.classList.remove(dirIn)
    }, DURATION / 2)
  }

  render() {
    const modalClass = this.modal?.class || ''
    const AppNav = TAGS.APP_NAV
    const PreferencesModal = TAGS.PREFERENCES_MODAL
    const LangDialog = TAGS.LANG_DIALOG
    const CookieBanner = TAGS.COOKIE_BANNER
    const StatsHud = TAGS.STATS_HUD
    const CurrentView = this.currentViewTag

    return (
      <div data-app-wrapper className={modalClass}>
        <div className={`progress-bar ${this.routeLoading ? 'progress-bar--active' : ''}`} />

        <AppNav />

        <PreferencesModal />
        <LangDialog />

        <main id="main-content">
          <div id="view-outlet">
            <CurrentView />
          </div>
        </main>

        <CookieBanner />
        <StatsHud />
      </div>
    )
  }

  onUpdated() {
    const nav = this.$('app-nav')
    if (nav) nav.translations = this.translations
    const cookie = this.$('cookie-banner')
    if (cookie) cookie.translations = this.translations
    const pref = this.$('preferences-modal')
    if (pref) pref.pref = this.translations?.pref
    this._updateModalState()
  }
}

if (!customElements.get(TAGS.APP_ROOT)) {
  customElements.define(TAGS.APP_ROOT, AppRoot)
}
