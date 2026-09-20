import { h, Fragment } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import router from '../core/router.js'
import { CLASSES, EVENTS } from '../core/constants.js'
import awardsFooterStyles from '../sass/awards-footer.scss?inline'
import './HomeCarousel.js'

import { fetchFirebaseDb } from '../utils/db.js'

const DEFAULT_LEGAL_LINKS = [
  { link: '/privacy-policy', page: 'Privacy Policy' },
  { link: '/gdpr', page: 'GDPR' },
  { link: '/terms-of-use', page: 'Terms of Use' },
]

import { getFallbackLegalLinks } from './legal/Footer.js'

export class AwardsMentions extends BaseComponent {
  constructor() {
    super(awardsFooterStyles)
    this._title = 'Some mentions'
    this._items = null
    this._lastLocale = null
    this._duration = 10000
  }

  set title(val) {
    const newTitle = val || 'Some mentions'
    if (this._title === newTitle) return
    this._title = newTitle
    if (this._isMounted) this._updateDom()
  }

  get title() {
    return this._title
  }

  set items(val) {
    if (this._items === val) return
    this._items = val
    if (this._isMounted) {
      const hc = this.$('home-carousel')
      if (hc) {
        hc.items = this.items
      } else {
        this._updateDom()
        this._setupCarousel()
      }
    }
  }

  get items() {
    return this._items
  }

  get legalLinks() {
    const all = store.getters.getlang()?.components?.['legal-footer']?.links || []
    const filtered = all.filter((l) => l.link && !l.link.match(/^\/[a-z]{0,3}\/?$/))
    if (filtered.length) return filtered
    const locale = store.getters.getLang()
    const fallbacks = getFallbackLegalLinks(locale).filter((l) => l.link && !l.link.match(/^\/[a-z]{0,3}\/?$/))
    return fallbacks.length ? fallbacks : DEFAULT_LEGAL_LINKS
  }

  onMounted() {
    this._lastLocale = store.getters.getLang()
    this.subscribe(store)
    this._ensureData()
    this._setupCarousel()
    this._bindLinks()
  }

  onStoreUpdate() {
    const currentLocale = store.getters.getLang()
    if (this._lastLocale !== currentLocale) {
      this._lastLocale = currentLocale
      this._updateDom()
      this._setupCarousel()
    }
  }

  _ensureData() {
    const lang = store.getters.getlang()
    const locale = lang?.locale || 'en'
    const dbpath = `${lang?.database || 'translations/'}${locale}/components`
    fetchFirebaseDb(dbpath)
      .then((snapshot) => {
        if (snapshot?.exists()) {
          store.commit('setComponentLang', snapshot.val())
        }
      })
      .catch(console.error)
  }

  onUpdated() {
    this._setupCarousel()
  }

  _setupCarousel() {
    const hc = this.$('home-carousel')
    if (hc && this.items) {
      hc.variant = 'awards'
      hc.duration = this._duration
      hc.showDots = true
      hc.items = this.items

      this.addScopedListener(hc, EVENTS.SLIDE_CHANGE, () => {
        this._showProgress()
        this._restartProgressAnimation()
      })

      this.addScopedListener(hc, EVENTS.AUTOPLAY_STOP, () => {
        this._hideProgress()
      })

      // Start the first animation after the carousel is initialised
      requestAnimationFrame(() => this._restartProgressAnimation())
    }
  }

  _showProgress() {
    const bar = this.$(`.${CLASSES.AWARDS_FOOTER_PROGRESS}`)
    if (bar) bar.classList.remove(CLASSES.AWARDS_FOOTER_PROGRESS_HIDDEN)
  }

  _hideProgress() {
    const bar = this.$(`.${CLASSES.AWARDS_FOOTER_PROGRESS}`)
    if (bar) bar.classList.add(CLASSES.AWARDS_FOOTER_PROGRESS_HIDDEN)
  }

  _restartProgressAnimation() {
    const fill = this.$(`.${CLASSES.AWARDS_FOOTER_PROGRESS_FILL}`)
    if (!fill) return

    const runningClass = CLASSES.AWARDS_FOOTER_PROGRESS_FILL_RUNNING

    // Sync animation duration with carousel duration
    fill.style.setProperty('--progress-duration', `${this._duration / 1000}s`)

    // Remove class → force reflow → re-add: CSS @keyframes restarts from 0%
    fill.classList.remove(runningClass)
    void fill.offsetHeight // intentional reflow to reset animation
    fill.classList.add(runningClass)
  }

  _bindLinks() {
    // Delegated click handler on shadowRoot: handles all legal links across DOM re-renders
    this.addScopedListener(this.shadowRoot, 'click', (e) => {
      const path = typeof e.composedPath === 'function' ? e.composedPath() : []
      const a =
        (e.target instanceof Element ? e.target : e.target?.parentElement)?.closest(`.${CLASSES.AWARDS_FOOTER_ITEM}`) ||
        path.find((el) => el instanceof Element && el.classList?.contains(CLASSES.AWARDS_FOOTER_ITEM))
      if (a) {
        e.preventDefault()
        const href = a.getAttribute('href')
        if (href) router.push(href)
      }
    })
  }

  render() {
    const links = this.legalLinks

    return (
      <footer className={CLASSES.AWARDS_FOOTER}>
        <div className={CLASSES.AWARDS_FOOTER_HEADER}>
          <h2 className={CLASSES.AWARDS_FOOTER_TITLE}>{this.title}</h2>

          <div className={CLASSES.AWARDS_FOOTER_PROGRESS} role="progressbar" aria-label="Time until next award" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div className={CLASSES.AWARDS_FOOTER_PROGRESS_FILL} />
          </div>
        </div>

        {this.items && this.items.length ? (
          <home-carousel className="hc--awards" />
        ) : (
          <div className="awards-footer-skel">
            <span className={CLASSES.SKELETON_BADGE} />
            <span className={CLASSES.SKELETON_BADGE} />
            <span className={CLASSES.SKELETON_BADGE} />
          </div>
        )}

        <nav className={CLASSES.AWARDS_FOOTER_LINKS} aria-label="Legal">
          {links.map((link, i) => (
            <Fragment key={link.link || i}>
              <a
                className={CLASSES.AWARDS_FOOTER_ITEM}
                href={link.link}
                onClick={(e) => {
                  e.preventDefault()
                  if (link.link) router.push(link.link)
                }}
              >
                {link.page}
              </a>
              {i < links.length - 1 && (
                <span className={CLASSES.AWARDS_FOOTER_SEP}>•</span>
              )}
            </Fragment>
          ))}
        </nav>
      </footer>
    )
  }
}

if (!customElements.get('awards-mentions')) {
  customElements.define('awards-mentions', AwardsMentions)
}
