import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import router from '../core/router.js'
import { deepQuerySelector } from '../core/dom.js'
import { localePath, LANG_OPTIONS } from '../core/i18n.js'
import { wasmSmoothScroll } from '../utils/wasm-scroll.js'
import { TAGS, CLASSES, URLS, STRINGS, ATTRS } from '../core/constants.js'
import appStyles from '../sass/app.scss?inline'

export class AppNav extends BaseComponent {
  constructor() {
    super(appStyles)
    this._translations = null
    this.activeSection = 'home'
    this.onBottom = false
  }

  set translations(val) {
    this._translations = val
    if (this._isMounted) this._updateDom()
  }

  get translations() {
    return this._translations
  }

  get currentRoute() {
    return router.currentRoute
  }

  get isHomePage() {
    const name = this.currentRoute?.name || 'Home'
    return name.startsWith('Home') || name.startsWith('About') || name.startsWith('Contact')
  }

  get isAdminRoute() {
    const path = typeof window !== STRINGS.UNDEFINED ? window.location.pathname : ATTRS.EMPTY
    return path.startsWith('/admin') || path.startsWith('/cms')
  }

  get locale() {
    return store.getters.getLang()
  }

  get currentLang() {
    return LANG_OPTIONS.find((l) => l.code === this.locale) ?? null
  }

  get currentLangLabel() {
    return this.currentLang?.label ?? this.locale.toUpperCase()
  }

  renderLocaleFlag() {
    const lang = this.currentLang

    if (!lang) return this.locale.toUpperCase()

    if (lang.cc2) {
      return (
        <span className={CLASSES.FLAG_SPLIT}>
          <img
            className={CLASSES.FLAG_IMG}
            src={`${URLS.FLAG_CDN}${lang.cc}.svg`}
            alt={lang.label}
            loading="lazy"
          />
          <img
            className={CLASSES.FLAG_IMG}
            src={`${URLS.FLAG_CDN}${lang.cc2}.svg`}
            alt=""
            loading="lazy"
          />
        </span>
      )
    }

    return (
      <img
        className={CLASSES.FLAG_IMG}
        src={`${URLS.FLAG_CDN}${lang.cc}.svg`}
        alt={lang.label}
        loading="lazy"
      />
    )
  }

  onMounted() {
    this.subscribe(store)
    this.subscribeRouter()
    this._bindEvents()
  }

  subscribeRouter() {
    router.subscribe(() => {
      this._updateDom()
    })
  }

  onStoreUpdate() {
    this._updateDom()
  }

  updateScrollState(activeSection, onBottom) {
    if (this.activeSection === activeSection && this.onBottom === onBottom) {
      return
    }
    this.activeSection = activeSection
    this.onBottom = onBottom
    this._updateDom()
  }

  _bindEvents() {
    // Delegated click handler on shadowRoot — survives all re-renders without re-binding.
    this.addScopedListener(this.shadowRoot, 'click', (e) => {
      const path = typeof e.composedPath === STRINGS.FUNCTION ? e.composedPath() : []
      const btn =
        (e.target instanceof Element ? e.target : e.target?.parentElement)?.closest('button, a') ||
        path.find((el) => el instanceof Element && (el.tagName === 'BUTTON' || el.tagName === 'A'))
      if (!btn) return

      if (btn.classList.contains('nav-logo-btn')) {
        this.handleLogo(e)
        return
      }

      if (btn.classList.contains('nav-about-btn')) {
        this.handleAbout(e)
        return
      }

      if (btn.classList.contains('nav-action-btn')) {
        this.handleAction(e)
        return
      }

      if (btn.classList.contains('nav-pref-btn')) {
        this.handlePreferences(e)
        return
      }

      if (btn.classList.contains('nav-lang-open-btn')) {
        this.handleLang(e)
        return
      }
    })
  }

  scrollTop() {
    if (this.isHomePage) {
      this.activeSection = 'home'
      const root = localePath('', this.locale)
      if (typeof window !== STRINGS.UNDEFINED && window.location.pathname !== root) {
        window.history.pushState({}, '', root)
      }
    }
    const isReduced = store.getters.getReducedMotion()
    try {
      window.scrollTo({ top: 0, behavior: isReduced ? 'instant' : 'smooth' })
    } catch {
      window.scrollTo(0, 0)
    }
    wasmSmoothScroll({
      duration: isReduced ? 2500 : 1000,
      updateHistory: true,
      scrollTo: 0,
    })
  }

  goToAbout() {
    this.activeSection = 'about'
    const el = deepQuerySelector('#about') || deepQuerySelector(TAGS.ABOUT_SECTION)
    if (el) {
      const targetY = window.scrollY + el.getBoundingClientRect().top
      const isReduced = store.getters.getReducedMotion()
      try {
        window.scrollTo({ top: targetY, behavior: isReduced ? 'instant' : 'smooth' })
      } catch {
        window.scrollTo(0, targetY)
      }
      wasmSmoothScroll({
        duration: isReduced ? 2500 : 1000,
        updateHistory: true,
        scrollTo: targetY,
      })
    }
    const target = localePath('about', this.locale)
    if (typeof window !== STRINGS.UNDEFINED && window.location.pathname !== target) {
      window.history.pushState({}, '', target)
    }
  }

  scrollToContact() {
    if (this.isHomePage) {
      this.activeSection = 'contact'
      const el = deepQuerySelector('#contact') || deepQuerySelector('contact-section')
      if (el) {
        const targetY = window.scrollY + el.getBoundingClientRect().top
        const isReduced = store.getters.getReducedMotion()
        try {
          window.scrollTo({ top: targetY, behavior: isReduced ? 'instant' : 'smooth' })
        } catch {
          window.scrollTo(0, targetY)
        }
        wasmSmoothScroll({
          duration: isReduced ? 2500 : 1000,
          updateHistory: true,
          scrollTo: targetY,
        })
      }
      const target = localePath('contact', this.locale)
      if (typeof window !== STRINGS.UNDEFINED && window.location.pathname !== target) {
        window.history.pushState({}, '', target)
      }
    } else {
      const scrollHeight =
        typeof document !== STRINGS.UNDEFINED
          ? Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
          : 0
      const isReduced = store.getters.getReducedMotion()
      try {
        window.scrollTo({ top: scrollHeight, behavior: isReduced ? 'instant' : 'smooth' })
      } catch {
        window.scrollTo(0, scrollHeight)
      }
      wasmSmoothScroll({
        duration: isReduced ? 2500 : 1000,
        updateHistory: true,
        scrollTo: scrollHeight,
      })
    }
  }

  handleLogo(e) {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (!this.isHomePage) {
      router.push(localePath('', this.locale))
    } else {
      this.scrollTop()
    }
  }

  handleAbout(e) {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (!this.isHomePage) {
      router.push(localePath('about', this.locale))
    } else {
      this.goToAbout()
    }
  }

  handleAction(e) {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (this.onBottom) {
      this.scrollTop()
    } else {
      this.scrollToContact()
    }
  }

  handlePreferences(e) {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    store.commit('togglePreferencesModal', true)
    if (typeof window !== STRINGS.UNDEFINED) {
      window.dispatchEvent(new CustomEvent('open-preferences-modal'))
    }
  }

  handleLang(e) {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    store.commit('toggleLangDialog', true)
    if (typeof window !== STRINGS.UNDEFINED) {
      window.dispatchEvent(new CustomEvent('open-lang-dialog'))
    }
  }

  render() {
    const modal = store.getters.getModal()
    if (modal?.open === true || this.isAdminRoute) {
      return ATTRS.EMPTY
    }

    const t = this.translations
    const title = t?.title || 'LK'
    const aboutDesc = t?.about?.description || 'About'
    const isNotFound = this.currentRoute?.name === 'Not Found'
    const isProjectRoute = this.currentRoute?.meta?.projectRoute === true

    let actionLabel = t?.contact || 'Contact'
    if (this.onBottom) {
      actionLabel = t?.scrollup || 'Scroll up'
    } else if (isProjectRoute) {
      actionLabel = t?.related || 'Related'
    }

    let actionClasses = `${CLASSES.NAV_LINK} nav-action-btn`
    if (this.onBottom) {
      actionClasses += ' scroll-up'
    } else if (this.isHomePage) {
      if (this.activeSection === 'contact') actionClasses += ' active'
    } else {
      actionClasses += ' scroll-down'
    }

    const logoClasses = `${CLASSES.NAV_LINK} ${!this.isHomePage ? 'back' : ''} ${this.isHomePage && this.activeSection === 'home' ? 'active' : ''} nav-logo-btn`
    const aboutClasses = `${CLASSES.NAV_LINK} nav-about-btn ${this.isHomePage && this.activeSection === 'about' && !this.onBottom ? 'active' : ''}`

    return (
      <nav className={CLASSES.NAV} role="navigation">
        <button
          className={logoClasses}
          type="button"
          onClick={(e) => this.handleLogo(e)}
        >
          {title}
        </button>

        {!isNotFound && (
          <div className={CLASSES.NAV_DESKTOP}>
            <button
              className={aboutClasses}
              type="button"
              onClick={(e) => this.handleAbout(e)}
            >
              {aboutDesc}
            </button>

            <span className={CLASSES.NAV_SEPARATOR}>|</span>

            <button
              className={actionClasses}
              type="button"
              onClick={(e) => this.handleAction(e)}
            >
              {actionLabel}
            </button>

            <span className={CLASSES.NAV_SEPARATOR}>|</span>

            <button
              className={`${CLASSES.NAV_LINK} nav-pref-btn`}
              title="Site preferences (Theme & Motion)"
              type="button"
              onClick={(e) => this.handlePreferences(e)}
            >
              {t?.preferences || 'Preferences'}
            </button>

            <span className={CLASSES.NAV_SEPARATOR}>|</span>

            <button
              className={`${CLASSES.NAV_LINK} nav-lang-open-btn`}
              title={this.currentLangLabel}
              type="button"
              onClick={(e) => this.handleLang(e)}
            >
              {this.renderLocaleFlag()}
            </button>
          </div>
        )}

        {!isNotFound && (
          <div className={CLASSES.NAV_MOBILE_STRIP}>
            <button
              className={`${CLASSES.NAV_LINK} nav-pref-btn`}
              title="Preferences"
              type="button"
              onClick={(e) => this.handlePreferences(e)}
            >
              {t?.preferences || 'Preferences'}
            </button>
            <span className={CLASSES.NAV_SEPARATOR}>|</span>
            <button
              className={`${CLASSES.NAV_LINK} nav-lang-open-btn`}
              title={this.currentLangLabel}
              type="button"
              onClick={(e) => this.handleLang(e)}
            >
              {this.renderLocaleFlag()}
            </button>
          </div>
        )}
      </nav>
    )
  }
}

if (!customElements.get(TAGS.APP_NAV)) {
  customElements.define(TAGS.APP_NAV, AppNav)
}
