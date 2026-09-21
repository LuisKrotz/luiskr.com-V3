import { h, Fragment } from '../../core/jsx.js'
import { BaseComponent } from '../../core/Component.js'
import store from '../../core/store.js'
import router from '../../core/router.js'
import { CLASSES, URLS, PATHS, ATTRS, STRINGS } from '../../core/constants.js'
import { fetchFirebaseDb } from '../../utils/db.js'
import internalStyles from '../../sass/internals.scss?inline'
import '../DrawText.js'

export class PortfolioRelated extends BaseComponent {
  constructor() {
    super(internalStyles)
    this.translations = {}
    this.homePortfolio = []
  }

  get storage() {
    return store.getters.getStorage() || URLS.CDN_BASE
  }

  get projectsList() {
    if (!this.translations?.projects) return []

    const rawProjects = Array.isArray(this.translations.projects)
      ? this.translations.projects
      : Object.values(this.translations.projects)

    const basePath = this.translations.path || '/portfolio/'
    const homeList = store.state.portfoliolist?.length
      ? store.state.portfoliolist
      : this.homePortfolio

    return rawProjects.map((p) => {
      const cleanLink = p.link
        ? p.link.replace(/^(\/projects\/|\/portfolio\/|\/)/, '').replace(/\/$/, '')
        : ''

      const homeMatch = homeList.find((h) => {
        if (!h) return false
        const hLink = (h.link || '').toLowerCase().replace(/[^a-z0-9]/g, '')
        const hImg = (h.image || '').toLowerCase().replace(/[^a-z0-9]/g, '')
        const hLabel = (h.label || h.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')
        const cLink = cleanLink.toLowerCase().replace(/[^a-z0-9]/g, '')
        const pPage = (p.page || p.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')

        if (hLink && cLink && (hLink === cLink || hImg === cLink)) return true
        if (hLink && (cLink.includes(hLink) || hLink.includes(cLink))) return true
        if (hImg && (cLink.includes(hImg) || hImg.includes(cLink))) return true
        if (hLabel && pPage && (hLabel.includes(pPage) || pPage.includes(hLabel))) return true
        return false
      })

      const image = homeMatch?.image || p.image || cleanLink
      const locale = store.getters.getLang()
      const locPfx = locale && locale !== 'en' ? '/' + locale : ''
      const baseFull =
        locPfx +
        (basePath.startsWith('/') ? '' : '/') +
        basePath.replace(/\/$/, '') +
        '/' +
        cleanLink

      return {
        page: p.page || homeMatch?.label || homeMatch?.title || cleanLink,
        link: cleanLink,
        fullPath: baseFull,
        featured: p.featured === true,
        imageSrc: `${this.storage}${PATHS.COVERS}${image}.jpg`,
        description: homeMatch?.description || p.description || '',
      }
    })
  }

  onMounted() {
    this.subscribe(store)
    this._unsubRouter = router.subscribe(() => {
      this._updateDom()
    })
    if (!this.translations?.title) {
      this.translations = store.getters.getlang()?.components?.related || {}
    }
    this.fetchData()
  }

  onDestroy() {
    if (typeof this._unsubRouter === STRINGS.FUNCTION) {
      this._unsubRouter()
      this._unsubRouter = null
    }
  }

  onStoreUpdate() {
    if (!this.translations?.title) {
      this.translations = store.getters.getlang()?.components?.related || {}
    }
    this._updateDom()
  }

  onUpdated() {}

  fetchData() {
    const lang = store.getters.getlang()
    const locale = lang.locale || 'en'
    const dbpath = lang.database + locale + lang.pagesPath + 'HOME'
    const relatedPath = lang.database + locale + PATHS.COMPONENTS_RELATED

    Promise.all([
      fetchFirebaseDb(dbpath),
      fetchFirebaseDb(relatedPath),
    ])
      .then(([homeSnap, relatedSnap]) => {
        if (relatedSnap?.exists()) {
          this.translations = relatedSnap.val()
        }
        if (homeSnap?.exists()) {
          const data = homeSnap.val()
          if (data.portfoliolist) {
            const list = Array.isArray(data.portfoliolist)
              ? data.portfoliolist
              : Object.values(data.portfoliolist)
            this.homePortfolio = list
            store.commit('setPortfolioList', list)
          }
        }
        this._updateDom()
      })
      .catch(console.error)
  }


  render() {
    const projects = this.projectsList
    const socials = this.translations?.socials || []
    const currentPath = typeof window !== STRINGS.UNDEFINED ? window.location.pathname.replace(/\/$/, '') : ATTRS.EMPTY

    return (
      <footer className={CLASSES.INTERNAL_FOOTER}>
        <h2 className={CLASSES.INTERNAL_FOOTER_TITLE}>
          {this.translations?.title ? (
            <span key="ttl1" dangerouslySetInnerHTML={{ __html: this.translations.title }} />
          ) : (
            <span key="ttl2" className={CLASSES.SKELETON_TITLE_SM} />
          )}
        </h2>

        <div className={CLASSES.INTERNAL_FOOTER_RELATED}>
          {projects.length ? (
            <div className={CLASSES.RELATED_MOSAIC}>
              {projects.map((project, projectkey) => {
                const isCurrent =
                  project.link &&
                  (currentPath.endsWith('/' + project.link) || currentPath.endsWith('/' + project.page))
                const activeClass = isCurrent ? CLASSES.ROUTER_LINK_ACTIVE : ATTRS.EMPTY

                return (
                  <a
                    key={projectkey}
                    href={project.fullPath}
                    className={`${CLASSES.RELATED_MOSAIC_ITEM} ${project.featured ? CLASSES.RELATED_MOSAIC_ITEM_FEATURED : ''} ${activeClass}`}
                    onClick={(e) => {
                      e.preventDefault()
                      if (project.fullPath) router.push(project.fullPath)
                    }}
                  >
                    <div className={CLASSES.RELATED_MOSAIC_MEDIA}>
                      {project.imageSrc ? (
                        <img
                          src={project.imageSrc}
                          alt={ATTRS.EMPTY}
                          aria-hidden={ATTRS.TRUE}
                          className={CLASSES.RELATED_MOSAIC_IMG}
                          loading={ATTRS.LOADING_LAZY}
                          decoding={ATTRS.DECODING_ASYNC}
                        />
                      ) : (
                        <div className={CLASSES.SKELETON_MEDIA} />
                      )}
                      <div className={CLASSES.RELATED_MOSAIC_OVERLAY} />
                    </div>
                    <div className={CLASSES.RELATED_MOSAIC_INFO}>
                      <span className={CLASSES.RELATED_MOSAIC_TITLE}>{project.page}</span>
                      {project.description ? (
                        <div className={CLASSES.RELATED_MOSAIC_DESC}>
                          <draw-text text={project.description} delay="25" />
                        </div>
                      ) : null}
                    </div>
                  </a>
                )
              })}
            </div>
          ) : (
            <div className={CLASSES.RELATED_MOSAIC}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className={`${CLASSES.RELATED_MOSAIC_ITEM} ${CLASSES.SKELETON_SHIMMER} ${n === 1 || n === 4 ? CLASSES.RELATED_MOSAIC_ITEM_FEATURED : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        {this.translations?.socials ? (
          <div className={CLASSES.INTERNAL_FOOTER_ITEMS}>
            {socials.map((social, socialkey) => (
              <Fragment key={socialkey}>
                <a
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CLASSES.INTERNAL_FOOTER_ITEMS_LINK}
                >
                  {social.network}
                </a>
                {socialkey < socials.length - 1 && (
                  <span className={CLASSES.INTERNAL_FOOTER_ITEMS_SEP}>•</span>
                )}
              </Fragment>
            ))}
            <p
              className={CLASSES.INTERNAL_FOOTER_ITEMS_NOTE}
              dangerouslySetInnerHTML={{ __html: this.translations.note || '' }}
            />
          </div>
        ) : (
          <div className={CLASSES.INTERNAL_FOOTER_ITEMS} data-nosnippet>
            <span className={`${CLASSES.INTERNAL_FOOTER_ITEMS_LINK} ${CLASSES.SKELETON_FOOTER_LINK}`} />
            <span className={CLASSES.INTERNAL_FOOTER_ITEMS_SEP}>•</span>
            <span className={`${CLASSES.INTERNAL_FOOTER_ITEMS_LINK} ${CLASSES.SKELETON_FOOTER_LINK}`} />
            <span className={CLASSES.INTERNAL_FOOTER_ITEMS_SEP}>•</span>
            <span className={`${CLASSES.INTERNAL_FOOTER_ITEMS_LINK} ${CLASSES.SKELETON_FOOTER_LINK}`} />
            <span className={CLASSES.INTERNAL_FOOTER_ITEMS_SEP}>•</span>
            <span className={`${CLASSES.INTERNAL_FOOTER_ITEMS_LINK} ${CLASSES.SKELETON_FOOTER_LINK}`} />
            <p className={`${CLASSES.INTERNAL_FOOTER_ITEMS_NOTE} ${CLASSES.SKELETON_FOOTER_NOTE_1}`} />
            <p className={`${CLASSES.INTERNAL_FOOTER_ITEMS_NOTE} ${CLASSES.SKELETON_FOOTER_NOTE_2}`} />
          </div>
        )}
      </footer>
    )
  }
}

if (!customElements.get('portfolio-related')) {
  customElements.define('portfolio-related', PortfolioRelated)
}
