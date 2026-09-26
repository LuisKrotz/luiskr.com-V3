import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import { TAGS, CLASSES, SELECTORS, EVENTS, STORAGE_KEYS, ATTRS, TEXT } from '../core/constants.js'
import appStyles from '../sass/components/app.scss?inline'

export class CookieBanner extends BaseComponent {
  constructor() {
    super(appStyles)

    this._translations = null

    this.hidden = false
  }

  set translations(val) {
    this._translations = val

    if (this._isMounted) {
      this._updateDom()

      this._bindEvents()
    }
  }

  get translations() {
    return this._translations
  }

  onMounted() {
    const isConsentGiven = localStorage.getItem(STORAGE_KEYS.COOKIE)

    if (isConsentGiven !== null) {
      this.hidden = true

      this.style.display = ATTRS.NONE

      this._updateDom()
    } else {
      this._bindEvents()
    }
  }

  _bindEvents() {
    const acceptBtn = this.$(SELECTORS.COOKIES_BUTTONS_ACCEPT)

    const refuseBtn = this.$(SELECTORS.COOKIES_BUTTONS_REFUSE)

    if (acceptBtn) {
      this.addScopedListener(acceptBtn, EVENTS.CLICK, () => this.handleAction(true))
    }

    if (refuseBtn) {
      this.addScopedListener(refuseBtn, EVENTS.CLICK, () => this.handleAction(false))
    }
  }

  handleAction(accepted) {
    localStorage.setItem(STORAGE_KEYS.COOKIE, JSON.stringify(accepted))

    document.dispatchEvent(new Event(EVENTS.COOKIE_ACTION))

    this.hidden = true

    this.style.display = ATTRS.NONE

    this._updateDom()
  }

  render() {
    if (this.hidden || !this.translations?.cookies) {
      this.style.display = ATTRS.NONE

      return null
    }

    this.style.display = 'block'

    const c = this.translations.cookies

    return (
      <aside className={CLASSES.COOKIES}>
        <p className={CLASSES.COOKIES_INFO} dangerouslySetInnerHTML={{ __html: c.message || ATTRS.EMPTY }} />

        <div className={CLASSES.COOKIES_BUTTONS}>
          <button className={CLASSES.COOKIES_BUTTONS_ACCEPT} type={ATTRS.BUTTON}>
            {c.accept || TEXT.ACCEPT}
          </button>

          <button className={CLASSES.COOKIES_BUTTONS_REFUSE} type={ATTRS.BUTTON}>
            {c.refuse || TEXT.REFUSE}
          </button>
        </div>
      </aside>
    )
  }
}

if (!customElements.get(TAGS.COOKIE_BANNER)) {
  customElements.define(TAGS.COOKIE_BANNER, CookieBanner)
}
