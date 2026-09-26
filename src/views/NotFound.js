/** @jsx h */
import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import router from '../core/router.js'
import { fetchFirebaseDb } from '../utils/db.js'
import notFoundStyles from '../sass/views/not-found.scss?inline'
import '../components/DrawText.js'
import {
  CLASSES,
  TAGS,
  STRINGS,
  LOCALES,
  PATHS,
  EVENTS,
  IDS,
  ATTRS,
  TEXT,
} from '../core/constants.js'

export class ViewNotFound extends BaseComponent {
  constructor() {
    super(notFoundStyles)
    this.translations = null
  }

  get emojiLine() {
    if (!this.translations?.title) return STRINGS.EMPTY
    return this.translations.title.split(STRINGS.BR_TAG)[0] || STRINGS.EMPTY
  }

  get subtitle() {
    if (!this.translations?.title) return STRINGS.EMPTY
    return this.translations.title.split(STRINGS.BR_TAG)[1] || STRINGS.EMPTY
  }

  get homePath() {
    const locale = store.getters.getLang()
    return locale && locale !== LOCALES.EN ? `${PATHS.ROOT}${locale}` : PATHS.ROOT
  }

  onMounted() {
    this.subscribe(store)
    this.loadData()
    this._bindLinks()
  }

  onUpdated() {
    this._bindLinks()
  }

  _bindLinks() {
    const link = this.$(`.${CLASSES.NOT_FOUND_LINK}`)
    if (link) {
      this.addScopedListener(link, EVENTS.CLICK, (e) => {
        e.preventDefault()
        router.push(this.homePath)
      })
    }
  }

  loadData() {
    const lang = store.getters.getlang()
    const currentLocale = lang.locale || LOCALES.EN
    const dbpath = `${lang.database}${currentLocale}${lang.pagesPath}${PATHS.NOT_FOUND}`

    fetchFirebaseDb(dbpath)
      .then((snapshot) => {
        if (snapshot?.exists()) {
          this.translations = snapshot.val()
          this._updateDom()
        }
      })
      .catch(console.error)
  }

  render() {
    return (
      <div id={IDS.MAIN} className={CLASSES.NOT_FOUND}>
        {this.translations?.title ? (
          <div>
            <h2 className={CLASSES.NOT_FOUND_TITLE}>
              <span aria-hidden={ATTRS.TRUE}>{this.emojiLine}</span>
              <span className={CLASSES.NOT_FOUND_SUBTITLE}>
                <draw-text text={this.subtitle} delay={STRINGS.DELAY_30} trigger={ATTRS.AUTO} />
              </span>
            </h2>
            <a className={CLASSES.NOT_FOUND_LINK} href={this.homePath}>
              {this.translations.link || TEXT.HOME}
            </a>
          </div>
        ) : null}
      </div>
    )
  }
}

if (!customElements.get(TAGS.VIEW_NOT_FOUND)) {
  customElements.define(TAGS.VIEW_NOT_FOUND, ViewNotFound)
}
