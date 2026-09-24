import { h, Fragment } from '../../core/jsx.js'
import { BaseComponent } from '../../core/Component.js'
import store from '../../core/store.js'
import router from '../../core/router.js'
import { CLASSES, TAGS, CMS_KEYS, STRINGS, LOCALES, TEXT, PATHS, ATTRS, EVENTS, MUTATIONS } from '../../core/constants.js'
import internalStyles from '../../sass/internals.scss?inline'

import { LANG_SLUGS } from '../../core/i18n.js'
import { fetchFirebaseDb } from '../../utils/db.js'

export function getFallbackLegalLinks(locale = LOCALES.EN) {
  const slugs = LANG_SLUGS[locale] || LANG_SLUGS.en

  const base = locale === LOCALES.EN ? STRINGS.EMPTY : `${PATHS.ROOT}${locale}`

  const homeLabel = locale === LOCALES.BR ? TEXT.INICIO : (locale === LOCALES.ES || locale === LOCALES.CAS) ? TEXT.INICIO_ES : locale === LOCALES.DE ? TEXT.STARTSEITE : TEXT.HOME

  const privLabel = locale === LOCALES.BR ? TEXT.POLITICA_DE_PRIVACIDADE : (locale === LOCALES.ES || locale === LOCALES.CAS) ? TEXT.POLITICA_DE_PRIVACIDAD : locale === LOCALES.DE ? TEXT.DATENSCHUTZ : TEXT.PRIVACY_POLICY

  const termsLabel = locale === LOCALES.BR ? TEXT.TERMOS_DE_USO : (locale === LOCALES.ES || locale === LOCALES.CAS) ? TEXT.TERMINOS_DE_USO : locale === LOCALES.DE ? TEXT.NUTZUNGSBEDINGUNGEN : TEXT.TERMS_OF_USE

  return [
    { link: `${base}${PATHS.ROOT}`, page: homeLabel },
    { link: `${base}${PATHS.ROOT}${slugs.privacy || STRINGS.PRIVACY_POLICY}`, page: privLabel },
    { link: `${base}${PATHS.ROOT}${slugs.gdpr || STRINGS.GDPR}`, page: TEXT.GDPR },
    { link: `${base}${PATHS.ROOT}${slugs.terms || STRINGS.TERMS_OF_USE}`, page: termsLabel },
  ]
}

export class LegalFooter extends BaseComponent {
  constructor() {
    super(internalStyles)
    this._unsubRouter = null
  }

  onMounted() {
    this.subscribe(store)

    this._ensureData()

    this._unsubRouter = router.subscribe(() => {
      this._updateDom()
    })

    // Delegated click handler on shadowRoot
    this.addScopedListener(this.shadowRoot, EVENTS.CLICK, (e) => {
      const a = e.target.closest(TAGS.A)

      if (a) {
        e.preventDefault()

        const href = a.getAttribute(ATTRS.HREF)

        if (href) router.push(href)
      }
    })
  }

  _ensureData() {
    const lang = store.getters.getlang()

    const locale = lang?.locale || LOCALES.EN

    const dbpath = `${lang?.database || PATHS.TRANSLATIONS}${locale}${PATHS.COMPONENTS}`

    fetchFirebaseDb(dbpath)
      .then((snapshot) => {
        if (snapshot?.exists()) {
          store.commit(MUTATIONS.SET_COMPONENT_LANG, snapshot.val())

          this._updateDom()
        }
      })
      .catch(console.error)
  }

  onDestroy() {
    if (typeof this._unsubRouter === STRINGS.FUNCTION) {
      this._unsubRouter()

      this._unsubRouter = null
    }
  }

  onStoreUpdate() {
    this._updateDom()
  }

  render() {
    const locale = store.getters.getLang()

    const rawLinks = store.getters.getlang()?.components?.[CMS_KEYS.LEGAL_FOOTER]?.links

    const links = rawLinks && rawLinks.length ? rawLinks : getFallbackLegalLinks(locale)

    const currentPath = router.currentRoute?.path || STRINGS.EMPTY

    return (
      <footer className={CLASSES.INTERNAL_FOOTER}>
        <div className={CLASSES.INTERNAL_FOOTER_ITEMS}>
          {links.map((item, n) => {
            const isActive = currentPath === item.link || (item.link !== PATHS.ROOT && currentPath.endsWith(item.link))

            const activeClass = isActive ? `${CLASSES.ROUTER_LINK_EXACT_ACTIVE} ${CLASSES.ROUTER_LINK_ACTIVE} ${CLASSES.ACTIVE}` : STRINGS.EMPTY

            return (
              <Fragment key={item.link || n}>
                <a
                  className={`${CLASSES.INTERNAL_FOOTER_ITEMS_LINK} ${CLASSES.CONTACT_OTHER_LINK} ${activeClass}`}
                  href={item.link}
                  onClick={(e) => {
                    e.preventDefault()

                    if (item.link) router.push(item.link)
                  }}
                >
                  {item.page}
                </a>
                {n < links.length - 1 && (
                  <span className={`${CLASSES.INTERNAL_FOOTER_ITEMS_SEP} ${CLASSES.CONTACT_SEPARATOR}`}>
                    {TEXT.DOT_SEP}
                  </span>
                )}
              </Fragment>
            )
          })}
        </div>
      </footer>
    )
  }
}

if (!customElements.get(TAGS.LEGAL_FOOTER)) {
  customElements.define(TAGS.LEGAL_FOOTER, LegalFooter)
}

