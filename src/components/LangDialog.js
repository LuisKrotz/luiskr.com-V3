import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import router from '../core/router.js'
import { LANG_OPTIONS, LANG_SLUGS } from '../core/i18n.js'
import {
  TAGS,
  STRINGS,
  CLASSES,
  ATTRS,
  EVENTS,
  KEYS,
  URLS,
  MEDIA_DIMENSIONS,
  LOCALES,
  MUTATIONS,
  TEXT,
  PATHS,
  ROUTE_PREFIXES,
  CMS_KEYS,
  IDS,
} from '../core/constants.js'
import preferencesStyles from '../sass/preferences.scss?inline'

export class LangDialog extends BaseComponent {
  constructor() {
    super(preferencesStyles)
    this._isOpen = false
  }

  set open(val) {
    this._isOpen = !!val
    store.commit(MUTATIONS.TOGGLE_LANG_DIALOG, this._isOpen)
    if (this._isMounted) {
      this._updateDom()
      this._bindEvents()
      if (this.isOpen) {
        requestAnimationFrame(() => {
          const backdrop = this.$(`.${CLASSES.PREF_BACKDROP}`)
          if (backdrop) backdrop.focus()
        })
      }
    }
  }

  get open() {
    return this.isOpen
  }

  get isOpen() {
    return typeof store.getters.getLangDialogOpen === STRINGS.FUNCTION
      ? store.getters.getLangDialogOpen()
      : this._isOpen
  }

  onMounted() {
    this.subscribe(store)
    this._syncOpenState()
    this._bindEvents()
    this.addScopedListener(window, EVENTS.OPEN_LANG_DIALOG, () => {
      this.open = true
    })
  }

  _syncOpenState() {
    if (this.isOpen) {
      this.setAttribute(ATTRS.OPEN, ATTRS.EMPTY)
      this.classList.add(CLASSES.IS_OPEN)
    } else {
      this.removeAttribute(ATTRS.OPEN)
      this.classList.remove(CLASSES.IS_OPEN)
    }
  }

  onStoreUpdate() {
    this._syncOpenState()
    this._updateDom()
    this._bindEvents()
    if (this.isOpen) {
      requestAnimationFrame(() => {
        const backdrop = this.$(`.${CLASSES.PREF_BACKDROP}`)
        if (backdrop) backdrop.focus()
      })
    }
  }

  onUpdated() {
    this._syncOpenState()
    this._bindEvents()
  }

  _bindEvents() {
    if (!this.isOpen) return

    const backdrop = this.$(`.${CLASSES.PREF_BACKDROP}`)
    if (backdrop) {
      this.addScopedListener(backdrop, EVENTS.CLICK, (e) => {
        if (e.target === backdrop) this.close()
      })
    }
    this.addScopedListener(window, EVENTS.KEYDOWN, (e) => {
      if (e.key === KEYS.ESCAPE) this.close()
    })

    const closeBtn = this.$(`.${CLASSES.PREF_CLOSE_BTN}`)
    if (closeBtn) this.addScopedListener(closeBtn, EVENTS.CLICK, () => this.close())

    const langBtns = this.$$(`[${ATTRS.DATA_LANG}]`)
    langBtns.forEach((btn) => {
      this.addScopedListener(btn, EVENTS.CLICK, () => {
        const langCode = btn.getAttribute(ATTRS.DATA_LANG)
        this.selectLang(langCode)
      })
    })
  }

  close() {
    this._isOpen = false
    store.commit(MUTATIONS.TOGGLE_LANG_DIALOG, false)
    this._syncOpenState()
    this.dispatchEvent(new CustomEvent(EVENTS.CLOSE))
  }

  selectLang(newLang) {
    const currentLang = store.getters.getLang()
    this.close()
    if (currentLang === newLang) return

    const route = router.currentRoute
    const routeName = route?.name || ATTRS.EMPTY
    const s = LANG_SLUGS[newLang] || LANG_SLUGS[LOCALES.EN]
    const base = newLang === LOCALES.EN ? ATTRS.EMPTY : `${PATHS.ROOT}${newLang}`

    let newPath
    if (routeName.startsWith(ROUTE_PREFIXES.HOME)) newPath = `${base}${PATHS.ROOT}`
    else if (routeName.startsWith(ROUTE_PREFIXES.ABOUT)) newPath = `${base}${PATHS.ROOT}${s.about}`
    else if (routeName.startsWith(ROUTE_PREFIXES.CONTACT)) newPath = `${base}${PATHS.ROOT}${s.contact}`
    else if (routeName.startsWith(ROUTE_PREFIXES.PRIVACY)) newPath = `${base}${PATHS.ROOT}${s.privacy}`
    else if (routeName.startsWith(ROUTE_PREFIXES.GDPR)) newPath = `${base}${PATHS.ROOT}${s.gdpr}`
    else if (routeName.startsWith(ROUTE_PREFIXES.TERMS)) newPath = `${base}${PATHS.ROOT}${s.terms}`
    else {
      // Project pages: strip language prefix if present
      const rawPath = window.location.pathname.replace(/^\/([a-z]{2,3})(\/|$)/, PATHS.ROOT)
      newPath = base + (rawPath.startsWith(PATHS.ROOT) ? rawPath : `${PATHS.ROOT}${rawPath}`)
    }

    store.commit(MUTATIONS.SET_LANG, newLang)
    router.push(newPath)
  }

  render() {
    if (!this.isOpen) return null

    const currentLocale = store.getters.getLang()
    const compLang = store.getters.getlang()?.components?.[CMS_KEYS.LANG_DIALOG] || {}
    const dialogTitle = compLang.title || TEXT.LANGUAGE
    const closeLabel = compLang.close || TEXT.CLOSE_LANG_SELECTOR

    return (
      <div
        className={CLASSES.PREF_BACKDROP}
        tabIndex={STRINGS.MINUS_ONE}
        onClick={(e) => {
          if (e.target === e.currentTarget) this.close()
        }}
      >
        <div
          className={`${CLASSES.PREF_DIALOG} ${CLASSES.LANG_DIALOG}`}
          role={ATTRS.ROLE_DIALOG}
          aria-modal={ATTRS.TRUE}
          aria-labelledby={IDS.LANG_DIALOG_TITLE}
        >
          <header className={CLASSES.PREF_HEADER}>
            <h2 id={IDS.LANG_DIALOG_TITLE} className={CLASSES.PREF_TITLE}>{dialogTitle}</h2>
            <button
              className={CLASSES.PREF_CLOSE_BTN}
              aria-label={closeLabel}
              type={ATTRS.BUTTON}
              onClick={() => this.close()}
            >
              ✕
            </button>
          </header>

          <div className={CLASSES.PREF_BODY}>
            <div className={CLASSES.PREF_OPTIONS_4}>
              {LANG_OPTIONS.map((l) => (
                <button
                  key={l.code}
                  className={`${CLASSES.PREF_OPTION_BTN} ${currentLocale === l.code ? CLASSES.ACTIVE : ATTRS.EMPTY}`}
                  data-lang={l.code}
                  type={ATTRS.BUTTON}
                  onClick={() => this.selectLang(l.code)}
                >
                  <span className={CLASSES.PREF_OPTION_ICON} aria-hidden={ATTRS.TRUE}>
                    {l.cc2 ? (
                      <span className={CLASSES.FLAG_SPLIT}>
                        <img
                          className={CLASSES.FLAG_IMG}
                          src={`${URLS.FLAG_CDN}${l.cc}.svg`}
                          alt={l.label}
                          width={MEDIA_DIMENSIONS.FLAG_DIALOG_SPLIT_WIDTH}
                          height={MEDIA_DIMENSIONS.FLAG_DIALOG_HEIGHT}
                          decoding={ATTRS.DECODING_ASYNC}
                          loading={ATTRS.LOADING_LAZY}
                        />
                        <img
                          className={CLASSES.FLAG_IMG}
                          src={`${URLS.FLAG_CDN}${l.cc2}.svg`}
                          alt={ATTRS.EMPTY}
                          width={MEDIA_DIMENSIONS.FLAG_DIALOG_SPLIT_WIDTH}
                          height={MEDIA_DIMENSIONS.FLAG_DIALOG_HEIGHT}
                          decoding={ATTRS.DECODING_ASYNC}
                          loading={ATTRS.LOADING_LAZY}
                        />
                      </span>
                    ) : (
                      <img
                        className={CLASSES.FLAG_IMG}
                        src={`${URLS.FLAG_CDN}${l.cc}.svg`}
                        alt={l.label}
                        width={MEDIA_DIMENSIONS.FLAG_DIALOG_WIDTH}
                        height={MEDIA_DIMENSIONS.FLAG_DIALOG_HEIGHT}
                        decoding={ATTRS.DECODING_ASYNC}
                        loading={ATTRS.LOADING_LAZY}
                      />
                    )}
                  </span>
                  <span className={CLASSES.PREF_OPTION_LABEL}>{l.short}</span>
                  <span className={CLASSES.PREF_OPTION_SUB}>{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

if (!customElements.get(TAGS.LANG_DIALOG)) {
  customElements.define(TAGS.LANG_DIALOG, LangDialog)
}
