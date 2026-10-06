/**
 * @file CookieBanner.js
 * @description <cookie-banner> — consent notice bar: accept/decline
 * persisted to localStorage; hidden once answered or when consent exists.
 */

import { FORM_ATTRS } from '@/core/tokens/attrs/form.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { COOKIE_CLASSES } from '@/core/tokens/classes/cookies.js'
import { COOKIE_UI_KEYS } from '@/core/tokens/data/ui-keys.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { APP_EVENTS } from '@/core/tokens/events/app.js'
import { MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import { COOKIE_SELECTORS } from '@/core/tokens/selectors/cookies.js'
import { h } from '@/core/jsx.js'
import { BaseComponent } from '@/core/Component.js'
import { appText } from '@/core/locale/ui-text.js'
import appStyles from '@/sass/components/chrome/app.scss?inline'
import { PREF_STORAGE_KEYS } from '@/core/tokens/data/storage.js'

interface CookieCopy {
  message?: string
  accept?: string
  refuse?: string
}

interface CookieTranslations {
  cookies?: CookieCopy
}

/**
 * The CookieBanner — banner class.
 */
export class CookieBanner extends BaseComponent {
  private _translations: CookieTranslations | null = null

  constructor() {
    super(appStyles)

    this.hidden = false
  }

  /** Setter/getter — APP translations for the banner copy. */

  set translations(val: CookieTranslations | null) {
    this._translations = val

    if (this._isMounted) {
      this._updateDom()

      this._bindEvents()
    }
  }

  get translations(): CookieTranslations | null {
    return this._translations
  }

  override onMounted() {
    const isConsentGiven = localStorage.getItem(PREF_STORAGE_KEYS.COOKIE)

    if (isConsentGiven !== null) {
      this.hidden = true

      this.style.display = ATTR_VALUES.NONE

      this._updateDom()
    } else {
      this._bindEvents()
    }
  }

  /** Wires accept/decline button clicks. */

  _bindEvents() {
    const acceptBtn = this.$(COOKIE_SELECTORS.COOKIES_BUTTONS_ACCEPT)

    const refuseBtn = this.$(COOKIE_SELECTORS.COOKIES_BUTTONS_REFUSE)

    if (acceptBtn) {
      this.addScopedListener(acceptBtn, MOUSE_EVENTS.CLICK, () => this.handleAction(true))
    }

    if (refuseBtn) {
      this.addScopedListener(refuseBtn, MOUSE_EVENTS.CLICK, () => this.handleAction(false))
    }
  }

  /** Persists the consent answer and hides the banner. */

  handleAction(accepted: boolean): void {
    localStorage.setItem(PREF_STORAGE_KEYS.COOKIE, JSON.stringify(accepted))

    document.dispatchEvent(new Event(APP_EVENTS.COOKIE_ACTION))

    this.hidden = true

    this.style.display = ATTR_VALUES.NONE

    this._updateDom()
  }

  /** JSX template for the component's shadow DOM. */

  override render() {
    if (this.hidden || !this.translations?.cookies) {
      this.style.display = ATTR_VALUES.NONE

      return null
    }

    this.style.display = ATTR_VALUES.BLOCK

    const c = this.translations.cookies

    return (
      <aside className={COOKIE_CLASSES.COOKIES}>
        <p
          className={COOKIE_CLASSES.COOKIES_INFO}
          dangerouslySetInnerHTML={{ __html: c.message || ATTR_VALUES.EMPTY }}
        />

        <div className={COOKIE_CLASSES.COOKIES_BUTTONS}>
          <button className={COOKIE_CLASSES.COOKIES_BUTTONS_ACCEPT} type={FORM_ATTRS.BUTTON}>
            {c.accept || appText(COOKIE_UI_KEYS.COOKIES_ACCEPT)}
          </button>

          <button className={COOKIE_CLASSES.COOKIES_BUTTONS_REFUSE} type={FORM_ATTRS.BUTTON}>
            {c.refuse || appText(COOKIE_UI_KEYS.COOKIES_REFUSE)}
          </button>
        </div>
      </aside>
    )
  }
}

if (!customElements.get(COMPONENT_TAGS.COOKIE_BANNER)) {
  customElements.define(COMPONENT_TAGS.COOKIE_BANNER, CookieBanner)
}
