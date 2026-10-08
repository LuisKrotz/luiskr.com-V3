/**
 * @file NotFound.js
 * @description <view-not-found> — the 404 route: the "signal lost" page with
 * the emoji line + draw-animated message and a link back home.
 */

/** @jsx h */
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { NOT_FOUND_CLASSES } from '@core/tokens/classes/legal.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { APP_IDS } from '@core/tokens/ids/app.js'
import { LOCALES } from '@core/tokens/locales.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { TRANSLATION_KEYS } from '@core/tokens/routes/translation-keys.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'
import { h } from '@core/jsx.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { fetchFirebaseDb } from '@core/utils/data/db.js'
import { stripHtml } from '@core/utils/index.js'
import notFoundStyles from './not-found.scss?inline'
import '@website/components/media/DrawText.js'
import { FALLBACK_PAGES } from '@core/locale/fallback.js'
import { devError } from '@core/devlog.js'

interface NotFoundNode {
  title?: string
  link?: string
}

/**
 * The ViewNotFound — not found class.
 */
export class ViewNotFound extends BaseComponent {
  /**
   * Seeded with the build-time English snapshot so the 404 renders
   * meaningful copy instantly — and still renders when the Firebase fetch
   * fails or the locale node is missing. Replaced by the live translation
   * once `loadData()` resolves.
   */
  translations: NotFoundNode | null = FALLBACK_PAGES[
    TRANSLATION_KEYS.NOT_FOUND
  ] as NotFoundNode | null

  constructor() {
    super(notFoundStyles)
  }

  /** The decorative emoji/symbol row above the message. */

  get emojiLine() {
    if (!this.translations?.title) return CHAR_STRINGS.EMPTY
    return this.translations.title.split(DOM_STRINGS.BR_TAG)[0] || CHAR_STRINGS.EMPTY
  }

  /** Localized 404 message. */

  get subtitle() {
    if (!this.translations?.title) return CHAR_STRINGS.EMPTY
    return this.translations.title.split(DOM_STRINGS.BR_TAG)[1] || CHAR_STRINGS.EMPTY
  }

  /** Localized home URL for the back link. */

  get homePath() {
    const locale = store.getters.getLang()
    return locale && locale !== LOCALES.EN ? `${ROUTE_PATHS.ROOT}${locale}` : ROUTE_PATHS.ROOT
  }

  /** Lifecycle: loads translations. */

  override onMounted() {
    this.subscribe(store)
    this.loadData()
    this._bindLinks()
  }

  /** Lifecycle: re-binds links after render. */

  override onUpdated() {
    this._bindLinks()
  }

  /** Wires the home link through the SPA router. */

  private _bindLinks(): void {
    const link = this.$(`.${NOT_FOUND_CLASSES.NOT_FOUND_LINK}`)
    if (link) {
      this.addScopedListener(link, MOUSE_EVENTS.CLICK, (e) => {
        e.preventDefault()
        router.push(this.homePath)
      })
    }
  }

  /** Loads the not-found translation node via SWR. */

  loadData(): void {
    const lang = store.getters.getlang()
    const currentLocale = lang.locale || LOCALES.EN
    const dbpath = `${lang.database}${currentLocale}${lang.pagesPath}${TRANSLATION_KEYS.NOT_FOUND}`

    fetchFirebaseDb(dbpath)
      .then((snapshot) => {
        if (snapshot?.exists()) {
          this.translations = snapshot.val() as NotFoundNode
          this._updateDom()
        }
      })
      .catch(devError)
  }

  /** JSX template for the view's shadow DOM. */

  override render() {
    return (
      <div id={APP_IDS.MAIN} className={NOT_FOUND_CLASSES.NOT_FOUND}>
        {this.translations?.title ? (
          <div>
            <h1
              className={NOT_FOUND_CLASSES.NOT_FOUND_TITLE}
              aria-label={stripHtml(this.translations.title)}
            >
              <span aria-hidden={ATTR_VALUES.TRUE}>{this.emojiLine}</span>
              <span className={NOT_FOUND_CLASSES.NOT_FOUND_SUBTITLE}>
                <draw-text
                  text={this.subtitle}
                  delay={CHAR_STRINGS.DELAY_30}
                  trigger={ATTR_VALUES.AUTO}
                  fit={ATTR_VALUES.EMPTY}
                />
              </span>
            </h1>
            <a className={NOT_FOUND_CLASSES.NOT_FOUND_LINK} href={this.homePath}>
              {this.translations.link ||
                (FALLBACK_PAGES[TRANSLATION_KEYS.NOT_FOUND] as { link?: string } | undefined)?.link}
            </a>
          </div>
        ) : null}
      </div>
    )
  }
}

if (!customElements.get(VIEW_TAGS.VIEW_NOT_FOUND)) {
  customElements.define(VIEW_TAGS.VIEW_NOT_FOUND, ViewNotFound)
}
