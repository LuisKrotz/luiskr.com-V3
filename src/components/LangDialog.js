import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import router from '../core/router.js'
import { LANG_OPTIONS, LANG_SLUGS } from '../core/i18n.js'
import { TAGS, STRINGS, CLASSES, ATTRS, EVENTS, KEYS, URLS, MEDIA_DIMENSIONS } from '../core/constants.js'
import preferencesStyles from '../sass/preferences.scss?inline'

export class LangDialog extends BaseComponent {
  constructor() {
    super(preferencesStyles)
    this._isOpen = false
  }

  set open(val) {
    this._isOpen = !!val
    store.commit('toggleLangDialog', this._isOpen)
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
    this.addScopedListener(window, 'open-lang-dialog', () => {
      this.open = true
    })
  }

  _syncOpenState() {
    if (this.isOpen) {
      this.setAttribute('open', '')
      this.classList.add('is-open')
    } else {
      this.removeAttribute('open')
      this.classList.remove('is-open')
    }
  }

  onStoreUpdate() {
    this._syncOpenState()
    this._updateDom()
    this._bindEvents()
    if (this.isOpen) {
      requestAnimationFrame(() => {
        const backdrop = this.$('.pref-backdrop')
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
    store.commit('toggleLangDialog', false)
    this._syncOpenState()
    this.dispatchEvent(new CustomEvent(EVENTS.CLOSE))
  }

  selectLang(newLang) {
    const currentLang = store.getters.getLang()
    this.close()
    if (currentLang === newLang) return

    const route = router.currentRoute
    const routeName = route?.name || ''
    const s = LANG_SLUGS[newLang] || LANG_SLUGS.en
    const base = newLang === 'en' ? '' : '/' + newLang

    let newPath
    if (routeName.startsWith('Home')) newPath = base + '/'
    else if (routeName.startsWith('About')) newPath = base + '/' + s.about
    else if (routeName.startsWith('Contact')) newPath = base + '/' + s.contact
    else if (routeName.startsWith('Privacy')) newPath = base + '/' + s.privacy
    else if (routeName.startsWith('GDPR')) newPath = base + '/' + s.gdpr
    else if (routeName.startsWith('Terms')) newPath = base + '/' + s.terms
    else {
      // Project pages: strip language prefix if present
      const rawPath = window.location.pathname.replace(/^\/([a-z]{2,3})(\/|$)/, '/')
      newPath = base + (rawPath.startsWith('/') ? rawPath : '/' + rawPath)
    }

    store.commit('setLang', newLang)
    router.push(newPath)
  }

  render() {
    if (!this.isOpen) return null

    const currentLocale = store.getters.getLang()

    return (
      <div
        className="pref-backdrop"
        tabIndex="-1"
        onClick={(e) => {
          if (e.target === e.currentTarget) this.close()
        }}
      >
        <div className="pref-dialog lang-dialog" role="dialog" aria-modal="true" aria-labelledby="lang-dialog-title">
          <header className="pref-header">
            <h2 id="lang-dialog-title" className="pref-title">Language</h2>
            <button
              className="pref-close-btn"
              aria-label="Close language selector"
              type="button"
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
                  className={`${CLASSES.PREF_OPTION_BTN} ${currentLocale === l.code ? CLASSES.ACTIVE : ''}`}
                  data-lang={l.code}
                  type="button"
                  onClick={() => this.selectLang(l.code)}
                >
                  <span className={CLASSES.PREF_OPTION_ICON} aria-hidden="true">
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
                          alt=""
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
