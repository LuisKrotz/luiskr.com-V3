import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import router from '../core/router.js'
import { deepQuerySelector } from '../core/dom.js'
import { TAGS, PATHS, LOCALES, TEXT, ATTRS, MUTATIONS, CMS_KEYS } from '../core/constants.js'
import { generateWebsiteSchema, generateCarouselItemListSchema, updateJsonLd } from '../core/utils/index.js'
import { fetchFirebaseDb } from '../utils/db.js'
import homeStyles from '../sass/views/home.scss?inline'
import '../components/HomeMosaic.js'
import '../components/AboutSection.js'
import '../components/ContactSection.js'
import '../components/AwardsMentions.js'

export class ViewHome extends BaseComponent {
  constructor() {
    super(homeStyles)
    this.translations = null
    this.aboutTranslations = null
    this.profilePicture = null
    this.featuredLinks = new Set()
  }

  get storage() {
    return store.getters.getStorage()
  }

  get hasTouch() {
    return store.getters.getTouch()
  }

  get processedItems() {
    if (!this.translations?.portfoliolist) return []
    const raw = Array.isArray(this.translations.portfoliolist)
      ? this.translations.portfoliolist
      : Object.values(this.translations.portfoliolist)
    return raw.map((item) => ({ ...item, featured: this.isFeatured(item) }))
  }

  isFeatured(item) {
    if (!item) return false
    if (item.featured === true || item.featured === 'true' || item.featured === 1) return true
    return item.link && this.featuredLinks.has(item.link)
  }

  onRouteParamChange(to) {
    if (to?.meta?.scrollTo) {
      setTimeout(() => {
        const el = this.$('#' + to.meta.scrollTo) || deepQuerySelector('#' + to.meta.scrollTo)
        if (el) {
          const targetY = window.scrollY + el.getBoundingClientRect().top
          window.scrollTo({ top: targetY, behavior: ATTRS.SMOOTH })
        }
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: ATTRS.SMOOTH })
    }
  }

  onMounted() {
    this.loadData()
    this.subscribe(store)

    const route = router.currentRoute
    if (route?.meta?.scrollTo) {
      setTimeout(() => {
        const el = this.$('#' + route.meta.scrollTo) || deepQuerySelector('#' + route.meta.scrollTo)
        if (el) {
          const targetY = window.scrollY + el.getBoundingClientRect().top
          window.scrollTo({ top: targetY, behavior: ATTRS.SMOOTH })
        }
      }, 300)
    } else {
      setTimeout(() => window.scrollTo(0, 0), 500)
    }
  }

  onStoreUpdate() {
    // If locale changes, reload data
    const currentLocale = store.getters.getLang()
    if (this._lastLocale && this._lastLocale !== currentLocale) {
      this._lastLocale = currentLocale
      this.loadData()
    }
  }

  loadData() {
    const lang = store.getters.getlang()

    const currentLocale = lang.locale || LOCALES.EN

    this._lastLocale = currentLocale

    const basePath = lang.database + currentLocale

    const homePath = basePath + lang.pagesPath + CMS_KEYS.HOME

    const projectsPath = basePath + PATHS.COMPONENTS_RELATED_PROJECTS

    const aboutPath = basePath + lang.pagesPath + CMS_KEYS.ABOUT

    const picPath = basePath + lang.pagesPath + CMS_KEYS.ABOUT + '/profilePicture'

    fetchFirebaseDb(homePath)
      .then((homeSnap) => {
        if (homeSnap?.exists()) {
          this.translations = homeSnap.val()

          if (this.translations?.portfoliolist) {
            store.commit('setPortfolioList', this.translations.portfoliolist)
          }

          const carouselSchema = generateCarouselItemListSchema(this.processedItems)

          const homeGraph = [...generateWebsiteSchema()]

          if (carouselSchema) homeGraph.push(carouselSchema)

          updateJsonLd(homeGraph)

          this._updateDom()

          this._passDataToChildren()
        }
      })
      .catch(console.error)

    fetchFirebaseDb(projectsPath)
      .then((projectsSnap) => {
        if (projectsSnap?.exists()) {
          const links = new Set()

          Object.values(projectsSnap.val()).forEach((p) => {
            if (p.featured === true && p.link) links.add(p.link)
          })

          this.featuredLinks = links

          this._passDataToChildren()
        }
      })
      .catch(console.error)

    Promise.all([
      fetchFirebaseDb(aboutPath),
      fetchFirebaseDb(picPath),
    ])
      .then(([aboutSnap, picSnap]) => {
        if (aboutSnap?.exists()) {
          const about = aboutSnap.val()

          this.aboutTranslations = about

          store.commit(MUTATIONS.SET_MENTIONS, {
            title: about.mentions ?? TEXT.SOME_MENTIONS,
            items: about.mention_items ?? [],
          })
        }

        if (picSnap?.exists()) {
          this.profilePicture = picSnap.val()
        }

        this._updateDom()

        this._passDataToChildren()
      })
      .catch(console.error)
  }

  _passDataToChildren() {
    const mosaic = this.$(TAGS.HOME_MOSAIC)

    if (mosaic) {
      mosaic.processedItems = this.processedItems

      mosaic.translations = this.translations
    }

    const aboutSec = this.$(TAGS.ABOUT_SECTION)

    if (aboutSec) {
      aboutSec.aboutTranslations = this.aboutTranslations

      aboutSec.profilePicture = this.profilePicture
    }

    const awards = this.$(TAGS.AWARDS_MENTIONS)

    if (awards) {
      const mentions = store.getters.getMentions()

      awards.title = mentions.title

      awards.items = mentions.items
    }
  }

  render() {
    const HomeMosaic = TAGS.HOME_MOSAIC
    const AboutSection = TAGS.ABOUT_SECTION
    const ContactSection = TAGS.CONTACT_SECTION
    const AwardsMentions = TAGS.AWARDS_MENTIONS

    return (
      <article className={this.hasTouch ? 'has_touch' : ''}>
        <div id="home">
          <HomeMosaic />
        </div>

        <div id="about">
          <AboutSection />
        </div>

        <div id="contact">
          <ContactSection />
        </div>

        <AwardsMentions />
      </article>
    )
  }

  onUpdated() {
    this._passDataToChildren()
  }
}

if (!customElements.get(TAGS.VIEW_HOME)) {
  customElements.define(TAGS.VIEW_HOME, ViewHome)
}
