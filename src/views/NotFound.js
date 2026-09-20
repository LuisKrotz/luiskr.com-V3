/** @jsx h */
import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import router from '../core/router.js'
import { fetchFirebaseDb } from '../utils/db.js'
import notFoundStyles from '../sass/not-found.scss?inline'
import '../components/DrawText.js'
import { CLASSES, TAGS } from '../core/constants.js'

export class ViewNotFound extends BaseComponent {
  constructor() {
    super(notFoundStyles)
    this.translations = null
  }

  get emojiLine() {
    if (!this.translations?.title) return ''
    return this.translations.title.split('<br>')[0] || ''
  }

  get subtitle() {
    if (!this.translations?.title) return ''
    return this.translations.title.split('<br>')[1] || ''
  }

  get homePath() {
    const locale = store.getters.getLang()
    return locale && locale !== 'en' ? '/' + locale : '/'
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
      this.addScopedListener(link, 'click', (e) => {
        e.preventDefault()
        router.push(this.homePath)
      })
    }
  }

  loadData() {
    const lang = store.getters.getlang()
    const currentLocale = lang.locale || 'en'
    const dbpath = `${lang.database}${currentLocale}${lang.pagesPath}not-found`

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
      <div id="main" className={CLASSES.NOT_FOUND}>
        {this.translations?.title ? (
          <div>
            <h2 className={CLASSES.NOT_FOUND_TITLE}>
              <span aria-hidden="true">{this.emojiLine}</span>
              <span className={CLASSES.NOT_FOUND_SUBTITLE}>
                <draw-text text={this.subtitle} delay="30" trigger="auto" />
              </span>
            </h2>
            <a className={CLASSES.NOT_FOUND_LINK} href={this.homePath}>
              {this.translations.link || 'Home'}
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
