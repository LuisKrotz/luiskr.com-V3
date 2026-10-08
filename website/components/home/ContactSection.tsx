/**
 * @file ContactSection.js
 * @description <contact-section> — the home page's contact footer: heading,
 * email/social links and the CTA copy, rendered over the dark contact band
 * the nav's --on-dark variant keys off.
 */

import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { A11Y_CLASSES } from '@core/tokens/classes/a11y.js'
import { CONTACT_CLASSES } from '@core/tokens/classes/contact.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'
import { CMS_KEYS } from '@core/tokens/data/cms-keys.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { LOCALES } from '@core/tokens/locales.js'
import { DB_PATHS } from '@core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import { appText, componentText } from '@core/locale/ui-text.js'
import { h, Fragment } from '@core/jsx.js'
import contactStyles from '@core/sass/components/home/contact.scss?inline'

import { fetchFirebaseDb } from '@core/utils/data/db.js'
import { SECTION_COMPONENT_KEYS } from '@core/tokens/data/component-keys.js'
import { devError } from '@core/devlog.js'

interface ContactLink {
  link: string
  description?: string
}

interface ContactTranslation {
  title?: string
  line1?: ContactLink[]
}

type ComponentsMap = Record<string, ContactTranslation | undefined>

/**
 * contacts section.
 */
export class ContactSection extends BaseComponent {
  constructor() {
    super(contactStyles)
  }

  override onMounted() {
    this.subscribe(store)

    const components = store.getters.getlang()?.components as ComponentsMap | undefined

    if (!components?.contact) {
      const lang = store.getters.getlang()
      const locale = lang?.locale || LOCALES.EN

      const dbpath = `${lang?.database || DB_PATHS.TRANSLATIONS}${locale}/components`

      fetchFirebaseDb(dbpath)
        .then((snapshot) => {
          if (snapshot?.exists()) {
            store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, snapshot.val())
          }
        })
        .catch(devError)
    }
  }

  override onStoreUpdate() {
    this._updateDom()
  }

  /** JSX template for the component's shadow DOM. */

  override render() {
    const translations = (store.getters.getlang().components as ComponentsMap | undefined)?.contact

    if (!translations) {
      return (
        <footer className={CONTACT_CLASSES.CONTACT}>
          <h2 className={CONTACT_CLASSES.CONTACT_TITLE}>
            <span
              {...{ [ARIA_ATTRS.ARIA_HIDDEN]: ATTR_VALUES.TRUE }}
              className={`${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_TITLE_SM}`}
            />
            <span className={A11Y_CLASSES.SR_ONLY}>{appText(CMS_KEYS.CONTACT)}</span>
          </h2>
          <div className={CONTACT_CLASSES.CONTACT_SOCIAL}>
            {Array.from({ length: 4 }, (_, i) => (
              <span
                key={i}
                className={`${CONTACT_CLASSES.CONTACT_SOCIAL_LINK} ${SKELETON_CLASSES.SKELETON_FOOTER_LINK}`}
              />
            ))}
          </div>
        </footer>
      )
    }

    const line1 = translations.line1 || []

    return (
      <footer className={CONTACT_CLASSES.CONTACT}>
        <h2 className={CONTACT_CLASSES.CONTACT_TITLE}>
          <span>{translations.title || componentText(SECTION_COMPONENT_KEYS.CONTACT_TITLE)}</span>
        </h2>
        <div className={CONTACT_CLASSES.CONTACT_SOCIAL}>
          {line1.map((item, n) => (
            <Fragment key={item.link}>
              <a
                href={item.link}
                target={DOM_STRINGS.BLANK}
                rel={DOM_STRINGS.NOOPENER}
                className={CONTACT_CLASSES.CONTACT_SOCIAL_LINK}
              >
                {item.description}
              </a>
              {n < line1.length - 1 && (
                <span className={CONTACT_CLASSES.CONTACT_SEPARATOR}>{CHAR_STRINGS.DOT_SEP}</span>
              )}
            </Fragment>
          ))}
        </div>
      </footer>
    )
  }
}

if (!customElements.get(COMPONENT_TAGS.CONTACT_SECTION)) {
  customElements.define(COMPONENT_TAGS.CONTACT_SECTION, ContactSection)
}
