import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import router from '../core/router.js'
import { CLASSES, TAGS, STRINGS, ATTRS, TRANSLATION_KEYS, LOCALES } from '../core/constants.js'
import { fetchFirebaseDb } from '../utils/db.js'
import legalStyles from '../sass/views/legal.scss?inline'
import '../components/legal/Footer.js'

export class ViewLegal extends BaseComponent {
  constructor() {
    super(legalStyles)
    this.translations = null
    this._unsubRoute = null
  }

  onMounted() {
    this.subscribe(store)

    this._unsubRoute = router.subscribe((to) => {
      if (to?.meta?.legalRoute) {
        this.onRouteParamChange(to)
      }
    })

    this.loadData()

    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 500)
  }

  onRouteParamChange(to) {
    if (to?.meta?.legalRoute) {
      if (to?.meta?.title) {
        document.title = to.meta.title
      }
      this.translations = null
      this._updateDom()
      this.loadData()
      window.scrollTo({ top: 0, behavior: ATTRS.SMOOTH })
    }
  }

  onDestroy() {
    if (typeof this._unsubRoute === STRINGS.FUNCTION) {
      this._unsubRoute()
      this._unsubRoute = null
    }
  }

  onStoreUpdate() {
    const currentLocale = store.getters.getLang()
    if (this._lastLocale && this._lastLocale !== currentLocale) {
      this._lastLocale = currentLocale
      this.loadData()
    }
  }

  loadData(wait = 0) {
    const route = router.currentRoute
    if (route?.meta?.title) {
      document.title = route.meta.title
    }
    const translationKey = route?.meta?.translation || TRANSLATION_KEYS.PRIVACY_POLICY

    const lang = store.getters.getlang()

    const currentLocale = lang.locale || LOCALES.EN
    this._lastLocale = currentLocale

    const dbpath = `${lang.database}${currentLocale}${lang.pagesPath}${translationKey}`

    fetchFirebaseDb(dbpath)
      .then((snapshot) => {
        if (snapshot?.exists()) {
          const val = snapshot.val()
          if (!wait) {
            this.translations = val
            this._updateDom()
          } else {
            setTimeout(() => {
              this.translations = val
              this._updateDom()
            }, wait)
          }
        }
      })
      .catch(console.error)
  }

  render() {
    const t = this.translations
    const LegalFooter = TAGS.LEGAL_FOOTER

    return (
      <article>
        <div id="main" className={CLASSES.LEGAL}>
          <h2 className={CLASSES.INTERNAL_TITLE}>
            {t?.title ? (
              <span key="ttl1" dangerouslySetInnerHTML={{ __html: t.title }} />
            ) : (
              <span key="ttl2" className={`${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_TITLE_SM}`} />
            )}
          </h2>

          {t?.sections ? (
            <div>
              {t.sections.map((section, key) => (
                <section key={key} className={CLASSES.INTERNAL_DESCRIPTION}>
                  <h3
                    className={CLASSES.INTERNAL_DESCRIPTION_TEXT}
                    dangerouslySetInnerHTML={{ __html: section.title || '' }}
                  />
                  {(section.content || []).map((paragraph, pKey) => (
                    <p
                      key={pKey}
                      className={CLASSES.INTERNAL_DESCRIPTION_TEXT}
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                    />
                  ))}
                </section>
              ))}
            </div>
          ) : (
            <div key="data-load">
              {[1, 2, 3].map((n) => (
                <section key={n} className={CLASSES.INTERNAL_DESCRIPTION}>
                  <h3 aria-hidden="true" className={`${CLASSES.INTERNAL_DESCRIPTION_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_SECTION_TITLE}`} />
                  <p className={`${CLASSES.INTERNAL_DESCRIPTION_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_PARA_FULL}`} />
                  <p className={`${CLASSES.INTERNAL_DESCRIPTION_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_PARA_94}`} />
                  <p className={`${CLASSES.INTERNAL_DESCRIPTION_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_PARA_98}`} />
                  <p className={`${CLASSES.INTERNAL_DESCRIPTION_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_PARA_65}`} />
                </section>
              ))}
            </div>
          )}
        </div>

        <LegalFooter />
      </article>
    )
  }
}

if (!customElements.get(TAGS.VIEW_LEGAL)) {
  customElements.define(TAGS.VIEW_LEGAL, ViewLegal)
}

