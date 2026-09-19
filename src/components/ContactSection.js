import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import { CLASSES } from '../core/constants.js'
import { h, Fragment } from '../core/jsx.js'
import contactStyles from '../sass/contact.scss?inline'

import { fetchFirebaseDb } from '../utils/db.js'

export class ContactSection extends BaseComponent {
  constructor() {
    super(contactStyles)
  }

  onMounted() {
    this.subscribe(store)
    if (!store.getters.getlang()?.components?.contact) {
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
  }

  onStoreUpdate() {
    this._updateDom()
  }

  render() {
    const translations = store.getters.getlang().components?.contact

    if (!translations) {
      return (
        <footer className={CLASSES.CONTACT}>
          <h2 id="contact" className={CLASSES.CONTACT_TITLE}>
            <span aria-hidden="true" className={`${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_TITLE_SM}`} />
            <span className="sr-only">Contact</span>
          </h2>
          <div className={CLASSES.CONTACT_SOCIAL}>
            <span className={`${CLASSES.CONTACT_SOCIAL_LINK} ${CLASSES.SKELETON_FOOTER_LINK}`} />
            <span className={CLASSES.CONTACT_SEPARATOR}>•</span>
            <span className={`${CLASSES.CONTACT_SOCIAL_LINK} ${CLASSES.SKELETON_FOOTER_LINK}`} />
            <span className={CLASSES.CONTACT_SEPARATOR}>•</span>
            <span className={`${CLASSES.CONTACT_SOCIAL_LINK} ${CLASSES.SKELETON_FOOTER_LINK}`} />
            <span className={CLASSES.CONTACT_SEPARATOR}>•</span>
            <span className={`${CLASSES.CONTACT_SOCIAL_LINK} ${CLASSES.SKELETON_FOOTER_LINK}`} />
          </div>
        </footer>
      )
    }

    const line1 = translations.line1 || []

    return (
      <footer className={CLASSES.CONTACT}>
        <h2 id="contact" className={CLASSES.CONTACT_TITLE}>
          <span>{translations.title || 'Contact'}</span>
        </h2>
        <div className={CLASSES.CONTACT_SOCIAL}>
          {line1.map((item, n) => (
            <Fragment key={item.link}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={CLASSES.CONTACT_SOCIAL_LINK}
              >
                {item.description}
              </a>
              {n < line1.length - 1 && (
                <span className={CLASSES.CONTACT_SEPARATOR}>•</span>
              )}
            </Fragment>
          ))}
        </div>
      </footer>
    )
  }
}

if (!customElements.get('contact-section')) {
  customElements.define('contact-section', ContactSection)
}
