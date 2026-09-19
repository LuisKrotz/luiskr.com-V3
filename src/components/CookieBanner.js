import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import { TAGS } from '../core/constants.js'
import appStyles from '../sass/app.scss?inline'

const COOKIE_KEY = 'cookie'
const COOKIE_EVENT = 'cookieAction'

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
    const isConsentGiven = localStorage.getItem(COOKIE_KEY)
    if (isConsentGiven !== null) {
      this.hidden = true
      this.style.display = 'none'
      this._updateDom()
    } else {
      this._bindEvents()
    }
  }

  _bindEvents() {
    const acceptBtn = this.$('.cookies-buttons-accept')
    const refuseBtn = this.$('.cookies-buttons-refuse')

    if (acceptBtn) {
      this.addScopedListener(acceptBtn, 'click', () => this.handleAction(true))
    }
    if (refuseBtn) {
      this.addScopedListener(refuseBtn, 'click', () => this.handleAction(false))
    }
  }

  handleAction(accepted) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(accepted))
    document.dispatchEvent(new Event(COOKIE_EVENT))
    this.hidden = true
    this.style.display = 'none'
    this._updateDom()
  }

  render() {
    if (this.hidden || !this.translations?.cookies) {
      this.style.display = 'none'
      return null
    }
    this.style.display = 'block'

    const c = this.translations.cookies

    return (
      <aside className="cookies">
        <p className="cookies-info">{c.message || ''}</p>
        <div className="cookies-buttons">
          <button className="cookies-buttons-accept" type="button">{c.accept || 'Accept'}</button>
          <button className="cookies-buttons-refuse" type="button">{c.refuse || 'Refuse'}</button>
        </div>
      </aside>
    )
  }
}

if (!customElements.get(TAGS.COOKIE_BANNER)) {
  customElements.define(TAGS.COOKIE_BANNER, CookieBanner)
}
