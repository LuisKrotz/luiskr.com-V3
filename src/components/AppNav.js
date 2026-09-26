import { h, Fragment } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import router from '../core/router.js'
import { deepQuerySelector } from '../core/dom.js'
import { localePath, LANG_OPTIONS } from '../core/i18n.js'
import { wasmSmoothScroll } from '../utils/wasm-scroll.js'
import { TAGS, CLASSES, URLS, STRINGS, ATTRS, MEDIA_DIMENSIONS, ROUTE_NAMES, ROUTE_PREFIXES, SECTIONS, TEXT, EVENTS, PATHS, MUTATIONS, BASE_TITLE, SELECTORS, IDS } from '../core/constants.js'
import { predictiveLoader } from '../core/predictive-loader.js'
import { FlagWebGL } from '../utils/canvas/flag-webgl.js'
import appStyles from '../sass/components/app.scss?inline'

export class AppNav extends BaseComponent {
  constructor() {
    super(appStyles)
    this._translations = null
    this.activeSection = SECTIONS.HOME
    this.onBottom = false
    this._navFlag = null
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
    const name = this.currentRoute?.name || ROUTE_NAMES.HOME

    return name.startsWith(ROUTE_PREFIXES.HOME) || name.startsWith(ROUTE_PREFIXES.ABOUT) || name.startsWith(ROUTE_PREFIXES.CONTACT)
  }

  get isPlaygroundPage() {
    const name = this.currentRoute?.name

    if (name === ROUTE_NAMES.EARTH_PLAYGROUND || name === ROUTE_NAMES.SPACE_PLAYGROUND) return true

    const path = typeof window !== STRINGS.UNDEFINED ? window.location.pathname : ATTRS.EMPTY

    return path.includes(PATHS.EARTH_PLAYGROUND_SEGMENT) || path.includes(PATHS.SPACE_PLAYGROUND_SEGMENT)
  }

  get isAdminRoute() {
    const path = typeof window !== STRINGS.UNDEFINED ? window.location.pathname : ATTRS.EMPTY
    return path.startsWith(PATHS.ADMIN) || path.startsWith(PATHS.CMS)
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

    return (
      <span className={CLASSES.NAV_FLAG_WRAPPER}>
        <canvas className={`${CLASSES.FLAG_CANVAS} ${CLASSES.FLAG_CANVAS_NAV}`} />
        {lang.cc2 ? (
          <span className={CLASSES.FLAG_SPLIT}>
            <img
              className={CLASSES.FLAG_IMG}
              src={`${URLS.FLAG_CDN}${lang.cc}${STRINGS.SVG_EXT}`}
              alt={lang.label}
              width={MEDIA_DIMENSIONS.FLAG_NAV_SPLIT_WIDTH}
              height={MEDIA_DIMENSIONS.FLAG_NAV_HEIGHT}
              decoding={ATTRS.DECODING_ASYNC}
              loading={ATTRS.LOADING_EAGER}
            />
            <img
              className={CLASSES.FLAG_IMG}
              src={`${URLS.FLAG_CDN}${lang.cc2}${STRINGS.SVG_EXT}`}
              alt=""
              width={MEDIA_DIMENSIONS.FLAG_NAV_SPLIT_WIDTH}
              height={MEDIA_DIMENSIONS.FLAG_NAV_HEIGHT}
              decoding={ATTRS.DECODING_ASYNC}
              loading={ATTRS.LOADING_EAGER}
            />
          </span>
        ) : (
          <img
            className={CLASSES.FLAG_IMG}
            src={`${URLS.FLAG_CDN}${lang.cc}${STRINGS.SVG_EXT}`}
            alt={lang.label}
            width={MEDIA_DIMENSIONS.FLAG_NAV_WIDTH}
            height={MEDIA_DIMENSIONS.FLAG_NAV_HEIGHT}
            decoding={ATTRS.DECODING_ASYNC}
            loading={ATTRS.LOADING_EAGER}
          />
        )}
      </span>
    )
  }

  onMounted() {
    this.subscribe(store)

    this.subscribeRouter()

    this._bindEvents()

    predictiveLoader.scanAndObserve(this.shadowRoot)

    this._mountNavFlag()
  }

  onUpdated() {
    predictiveLoader.scanAndObserve(this.shadowRoot)

    this._mountNavFlag()
  }

  onDestroy() {
    this._destroyNavFlag()
  }

  _mountNavFlag() {
    if (typeof window === STRINGS.UNDEFINED) return

    const canvas = this.$(`.${CLASSES.FLAG_CANVAS_NAV}`)

    if (!canvas) return

    if (this._navFlag && this._navFlag.canvas !== canvas) {
      this._navFlag.destroy()

      this._navFlag = null
    }

    if (!this._navFlag) {
      const currentLang = this.currentLang

      if (currentLang) {
        this._navFlag = new FlagWebGL(canvas, currentLang)
      }
    }
  }

  _destroyNavFlag() {
    if (this._navFlag) {
      this._navFlag.destroy()

      this._navFlag = null
    }
  }

  subscribeRouter() {
    router.subscribe(() => {
      this._updateDom()

      this._mountNavFlag()
    })
  }

  onStoreUpdate() {
    this._updateDom()

    this._mountNavFlag()

    this._navFlag?.setReducedMotion(store.getters.getReducedMotion())
  }

  updateScrollState(activeSection, onBottom) {
    if (this.activeSection === activeSection && this.onBottom === onBottom) {
      return
    }

    this.activeSection = activeSection

    this.onBottom = onBottom

    this._updateDom()

    this._mountNavFlag()
  }

  _bindEvents() {
    // Delegated click handler on shadowRoot — survives all re-renders without re-binding.
    this.addScopedListener(this.shadowRoot, 'click', (e) => {
      const path = typeof e.composedPath === STRINGS.FUNCTION ? e.composedPath() : []
      const btn =
        (e.target instanceof Element ? e.target : e.target?.parentElement)?.closest(SELECTORS.BUTTON_OR_ANCHOR) ||
        path.find((el) => el instanceof Element && (el.tagName === TAGS.TAG_BUTTON_UC || el.tagName === TAGS.TAG_A_UC))
      if (!btn) return

      if (btn.classList.contains(CLASSES.NAV_LOGO_BTN)) {
        this.handleLogo(e)
        return
      }

      if (btn.classList.contains(CLASSES.NAV_ABOUT_BTN)) {
        this.handleAbout(e)
        return
      }

      if (btn.classList.contains(CLASSES.NAV_ACTION_BTN)) {
        this.handleAction(e)
        return
      }

      if (btn.classList.contains(CLASSES.NAV_PREF_BTN)) {
        this.handlePreferences(e)
        return
      }

      if (btn.classList.contains(CLASSES.NAV_LANG_OPEN_BTN)) {
        this.handleLang(e)
        return
      }
    })
  }

  scrollTop() {
    if (this.isHomePage) {
      this.activeSection = SECTIONS.HOME
      const root = localePath('', this.locale)
      if (typeof window !== STRINGS.UNDEFINED && window.location.pathname !== root) {
        window.history.pushState({}, '', root)
      }
    }
    const isReduced = store.getters.getReducedMotion()
    try {
      window.scrollTo({ top: 0, behavior: isReduced ? ATTRS.INSTANT : ATTRS.SMOOTH })
    } catch {
      window.scrollTo(0, 0)
    }
    wasmSmoothScroll({
      duration: isReduced ? MEDIA_DIMENSIONS.SCROLL_DURATION_REDUCED : MEDIA_DIMENSIONS.SCROLL_DURATION_FULL,
      updateHistory: true,
      scrollTo: 0,
    })
  }

  goToAbout() {
    this.activeSection = SECTIONS.ABOUT
    const el = deepQuerySelector(SELECTORS.ID_ABOUT) || deepQuerySelector(TAGS.ABOUT_SECTION)
    if (el) {
      const targetY = window.scrollY + el.getBoundingClientRect().top
      const isReduced = store.getters.getReducedMotion()
      try {
        window.scrollTo({ top: targetY, behavior: isReduced ? ATTRS.INSTANT : ATTRS.SMOOTH })
      } catch {
        window.scrollTo(0, targetY)
      }
      wasmSmoothScroll({
        duration: isReduced ? MEDIA_DIMENSIONS.SCROLL_DURATION_REDUCED : MEDIA_DIMENSIONS.SCROLL_DURATION_FULL,
        updateHistory: true,
        scrollTo: targetY,
      })
    }
    const target = localePath(STRINGS.ABOUT, this.locale)
    if (typeof window !== STRINGS.UNDEFINED && window.location.pathname !== target) {
      window.history.pushState({}, '', target)
    }
  }

  scrollToContact() {
    if (this.isHomePage) {
      this.activeSection = SECTIONS.CONTACT
      const el = deepQuerySelector(SELECTORS.ID_CONTACT) || deepQuerySelector(TAGS.CONTACT_SECTION)
      if (el) {
        const targetY = window.scrollY + el.getBoundingClientRect().top
        const isReduced = store.getters.getReducedMotion()
        try {
          window.scrollTo({ top: targetY, behavior: isReduced ? ATTRS.INSTANT : ATTRS.SMOOTH })
        } catch {
          window.scrollTo(0, targetY)
        }
        wasmSmoothScroll({
          duration: isReduced ? MEDIA_DIMENSIONS.SCROLL_DURATION_REDUCED : MEDIA_DIMENSIONS.SCROLL_DURATION_FULL,
          updateHistory: true,
          scrollTo: targetY,
        })
      }
      const target = localePath(STRINGS.CONTACT, this.locale)
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
        window.scrollTo({ top: scrollHeight, behavior: isReduced ? ATTRS.INSTANT : ATTRS.SMOOTH })
      } catch {
        window.scrollTo(0, scrollHeight)
      }
      wasmSmoothScroll({
        duration: isReduced ? MEDIA_DIMENSIONS.SCROLL_DURATION_REDUCED : MEDIA_DIMENSIONS.SCROLL_DURATION_FULL,
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
    store.commit(MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    if (typeof window !== STRINGS.UNDEFINED) {
      window.dispatchEvent(new CustomEvent(EVENTS.OPEN_PREFERENCES_MODAL))
    }
  }

  handleLang(e) {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    store.commit(MUTATIONS.TOGGLE_LANG_DIALOG, true)
    if (typeof window !== STRINGS.UNDEFINED) {
      window.dispatchEvent(new CustomEvent(EVENTS.OPEN_LANG_DIALOG))
    }
  }

  render() {
    const modal = store.getters.getModal()
    if (modal?.open === true || this.isAdminRoute) {
      return ATTRS.EMPTY
    }

    const t = this.translations
    const title = (t?.title && t.title !== TEXT.LK_MONOGRAM) ? t.title : BASE_TITLE

    const aboutDesc = t?.about?.description || TEXT.ABOUT

    const isNotFound = this.currentRoute?.name === ROUTE_NAMES.NOT_FOUND

    const isProjectRoute = this.currentRoute?.meta?.projectRoute === true

    let actionLabel = t?.contact || TEXT.CONTACT

    if (this.onBottom) {
      actionLabel = t?.scrollup || TEXT.SCROLL_UP_ALT
    } else if (isProjectRoute) {
      actionLabel = t?.related || TEXT.RELATED
    }

    let actionClasses = `${CLASSES.NAV_LINK} ${CLASSES.NAV_ACTION_BTN}`

    if (this.onBottom) {
      actionClasses += ` ${CLASSES.NAV_SCROLL_UP}`
    } else if (this.isHomePage) {
      if (this.activeSection === SECTIONS.CONTACT) actionClasses += ` ${CLASSES.NAV_ACTIVE}`
    } else {
      actionClasses += ` ${CLASSES.NAV_SCROLL_DOWN}`
    }

    const logoClasses = `${CLASSES.NAV_LINK} ${!this.isHomePage ? CLASSES.NAV_BACK : STRINGS.EMPTY} ${this.isHomePage && this.activeSection === SECTIONS.HOME ? CLASSES.NAV_ACTIVE : STRINGS.EMPTY} ${CLASSES.NAV_LOGO_BTN}`

    const aboutClasses = `${CLASSES.NAV_LINK} ${CLASSES.NAV_ABOUT_BTN} ${this.isHomePage && this.activeSection === SECTIONS.ABOUT && !this.onBottom ? CLASSES.NAV_ACTIVE : STRINGS.EMPTY}`

    return (
      <nav className={CLASSES.NAV} role={ATTRS.ROLE_NAVIGATION}>
        <button
          className={logoClasses}
          type={ATTRS.TYPE_BUTTON}
          onClick={(e) => this.handleLogo(e)}
        >
          {title}
        </button>

        {!isNotFound && (
          <div className={CLASSES.NAV_DESKTOP}>
            <button
              className={aboutClasses}
              type={ATTRS.TYPE_BUTTON}
              onClick={(e) => this.handleAbout(e)}
            >
              {aboutDesc}
            </button>

            <span className={CLASSES.NAV_SEPARATOR}>|</span>

            <button
              className={actionClasses}
              type={ATTRS.TYPE_BUTTON}
              onClick={(e) => this.handleAction(e)}
            >
              {actionLabel}
            </button>

            {!this.isPlaygroundPage && (
              <Fragment>
                <span className={CLASSES.NAV_SEPARATOR}>|</span>

                <button
                  className={CLASSES.NAV_LINK}
                  type={ATTRS.TYPE_BUTTON}
                  onClick={(e) => {
                    e.preventDefault()

                    router.push(PATHS.EARTH_PLAYGROUND)
                  }}
                >
                  {t?.earthPlayground || t?.spacePlayground || TEXT.EARTH_PLAYGROUND}
                </button>
              </Fragment>
            )}

            <span className={CLASSES.NAV_SEPARATOR}>|</span>

            <button
              className={`${CLASSES.NAV_LINK} ${CLASSES.NAV_PREF_BTN}`}
              title={TEXT.SITE_PREFERENCES}
              type={ATTRS.TYPE_BUTTON}
              onClick={(e) => this.handlePreferences(e)}
            >
              {t?.preferences || TEXT.PREFERENCES}
            </button>

            <span className={CLASSES.NAV_SEPARATOR}>|</span>

            <button
              className={`${CLASSES.NAV_LINK} ${CLASSES.NAV_LANG_OPEN_BTN}`}
              title={this.currentLangLabel}
              type={ATTRS.TYPE_BUTTON}
              onClick={(e) => this.handleLang(e)}
            >
              {this.renderLocaleFlag()}
            </button>
          </div>
        )}

        {!isNotFound && (
          <div className={CLASSES.NAV_MOBILE_STRIP}>
            <button
              className={`${CLASSES.NAV_LINK} ${CLASSES.NAV_PREF_BTN}`}
              title={TEXT.PREFERENCES}
              type={ATTRS.TYPE_BUTTON}
              onClick={(e) => this.handlePreferences(e)}
            >
              {t?.preferences || TEXT.PREFERENCES}
            </button>
            <span className={CLASSES.NAV_SEPARATOR}>|</span>
            <button
              className={`${CLASSES.NAV_LINK} ${CLASSES.NAV_LANG_OPEN_BTN}`}
              title={this.currentLangLabel}
              type={ATTRS.TYPE_BUTTON}
              onClick={(e) => this.handleLang(e)}
            >
              {this.renderLocaleFlag()}
            </button>
          </div>
        )}

        <svg
          width="0"
          height="0"
          style="position:absolute;width:0;height:0;pointer-events:none;overflow:hidden;"
          aria-hidden={ATTRS.TRUE}
        >
          <filter
            id={IDS.FILTER}
            color-interpolation-filters="linearRGB"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
          >
            <feDisplacementMap
              in="SourceGraphic"
              in2="SourceGraphic"
              scale="5"
              xChannelSelector="A"
              yChannelSelector="A"
              x="5"
              y="-5"
              width="100%"
              height="100%"
              result="displacementMap"
            />
          </filter>
        </svg>
      </nav>
    )
  }
}

if (!customElements.get(TAGS.APP_NAV)) {
  customElements.define(TAGS.APP_NAV, AppNav)
}
