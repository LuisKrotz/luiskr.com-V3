import { h, Fragment } from '../../core/jsx.js'
import { BaseComponent } from '../../core/Component.js'
import store from '../../core/store.js'
import router from '../../core/router.js'
import { CLASSES, TAGS } from '../../core/constants.js'
import internalStyles from '../../sass/internals.scss?inline'

import { LANG_SLUGS } from '../../core/i18n.js'
import { fetchFirebaseDb } from '../../utils/db.js'

export function getFallbackLegalLinks(locale = 'en') {
  const slugs = LANG_SLUGS[locale] || LANG_SLUGS.en
  const base = locale === 'en' ? '' : '/' + locale
  const homeLabel = locale === 'br' ? 'Início' : locale === 'es' || locale === 'cas' ? 'Inicio' : locale === 'de' ? 'Startseite' : 'Home'
  const privLabel = locale === 'br' ? 'Política de Privacidade' : locale === 'es' || locale === 'cas' ? 'Política de Privacidad' : locale === 'de' ? 'Datenschutz' : 'Privacy Policy'
  const termsLabel = locale === 'br' ? 'Termos de Uso' : locale === 'es' || locale === 'cas' ? 'Términos de Uso' : locale === 'de' ? 'Nutzungsbedingungen' : 'Terms of Use'

  return [
    { link: base + '/', page: homeLabel },
    { link: `${base}/${slugs.privacy || 'privacy-policy'}`, page: privLabel },
    { link: `${base}/${slugs.gdpr || 'gdpr'}`, page: 'GDPR' },
    { link: `${base}/${slugs.terms || 'terms-of-use'}`, page: termsLabel },
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
    this.addScopedListener(this.shadowRoot, 'click', (e) => {
      const a = e.target.closest('a')
      if (a) {
        e.preventDefault()
        const href = a.getAttribute('href')
        if (href) router.push(href)
      }
    })
  }

  _ensureData() {
    const lang = store.getters.getlang()
    const locale = lang?.locale || 'en'
    const dbpath = `${lang?.database || 'translations/'}${locale}/components`
    fetchFirebaseDb(dbpath)
      .then((snapshot) => {
        if (snapshot?.exists()) {
          store.commit('setComponentLang', snapshot.val())
          this._updateDom()
        }
      })
      .catch(console.error)
  }

  onDestroy() {
    if (typeof this._unsubRouter === 'function') {
      this._unsubRouter()
      this._unsubRouter = null
    }
  }

  onStoreUpdate() {
    this._updateDom()
  }

  render() {
    const locale = store.getters.getLang()
    const rawLinks = store.getters.getlang()?.components?.['legal-footer']?.links
    const links = rawLinks && rawLinks.length ? rawLinks : getFallbackLegalLinks(locale)
    const currentPath = router.currentRoute?.path || ''

    return (
      <footer className={CLASSES.INTERNAL_FOOTER}>
        <div className={CLASSES.INTERNAL_FOOTER_ITEMS}>
          {links.map((item, n) => {
            const isActive = currentPath === item.link || (item.link !== '/' && currentPath.endsWith(item.link))
            const activeClass = isActive ? 'router-link-exact-active router-link-active active' : ''

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
                    •
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

