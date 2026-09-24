import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import router from '../core/router.js'
import { PROJECT_ALIASES, MEDIA, CLASSES, TAGS, MEDIA_DIMENSIONS, ATTRS, STRINGS, LOCALES, MUTATIONS, TEXT } from '../core/constants.js'
import { fetchFirebaseDb } from '../utils/db.js'
import { calcDrawTextDelay, calcDrawTextOffset } from '../utils/wasm-layout.js'
import { wasmSmoothScroll } from '../utils/wasm-scroll.js'
import { stripHtml, svgPlaceholder, slugify, generateProjectArticleSchema, updateJsonLd } from '../core/utils/index.js'
import internalStyles from '../sass/internals.scss?inline'
import modalStyles from '../sass/modal.scss?inline'
import '../components/DrawText.js'
import '../components/MediaFigure.js'
import '../components/MediaExpanded.js'
import '../components/CustomCarousel.js'
import '../components/portfolio/Related.js'

export class ViewProject extends BaseComponent {

  constructor() {
    super(`${internalStyles}\n${modalStyles}`)
    this.translations = null
    this.projectSlug = ''
  }

  get modal() {
    return store.getters.getModal()
  }

  onMounted() {
    this.subscribe(store)
    this.initProject()
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, MEDIA_DIMENSIONS.SCROLL_INIT_DELAY)
  }

  onDestroy() {
    this.updateRobotsMeta(false)
  }

  updateRobotsMeta(noindex) {
    if (typeof document === STRINGS.UNDEFINED) return
    let meta = document.querySelector(STRINGS.META_ROBOTS)
    if (noindex) {
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'robots'
        document.head.appendChild(meta)
      }
      meta.content = STRINGS.NOINDEX_NOFOLLOW
    } else {
      if (meta) {
        meta.remove()
      }
    }
  }

  onRouteParamChange(to) {
    const nextSlug = to?.params?.projectSlug || ''
    if (nextSlug !== this.projectSlug) {
      this.projectSlug = nextSlug
      this.translations = null
      this._updateDom()
      wasmSmoothScroll({
        duration: MEDIA_DIMENSIONS.SCROLL_DURATION_FULL,
        updateHistory: false,
        scrollTo: 0,
      })
      this.loadData(MEDIA_DIMENSIONS.SCROLL_DURATION_FULL)
    } else {
      this.checkAutoOpenModal()
    }
  }

  onStoreUpdate() {
    const currentLocale = store.getters.getLang()
    if (this._lastLocale && this._lastLocale !== currentLocale) {
      this._lastLocale = currentLocale
      this.loadData()
      return
    }
    // Handle modal open/close imperatively to avoid destroying carousels
    this._updateModalDOM()
  }

  _updateModalDOM() {
    const modal = store.getters.getModal()
    const above = this.$(`dialog.${CLASSES.MODAL_ABOVE}`) || this.$(`.${CLASSES.MODAL_ABOVE}`)
    const below = this.$(`.${CLASSES.MODAL_BELOW}`)

    if (modal?.open) {
      // Apply scroll transform to main content
      if (below) below.style.transform = `translateY(-${modal.transform || 0}px)`

      if (above) {
        if (typeof above.showModal === STRINGS.FUNCTION && !above.open) {
          above.showModal()
        }
        // Check if media-expanded already mounted with same source
        const existing = above.querySelector(TAGS.MEDIA_EXPANDED)
        const src = modal.media?.source || ''
        if (!existing || existing.getAttribute('source') !== src) {
          above.replaceChildren(
            <media-expanded
              source={modal.media?.source || ''}
              thumb={modal.media?.thumb || ''}
              alt={modal.media?.alt || ''}
              width={modal.media?.width || MEDIA_DIMENSIONS.DEFAULT_WIDTH}
              height={modal.media?.height || MEDIA_DIMENSIONS.DEFAULT_HEIGHT}
              is-video={modal.media?.isVideo ? ATTRS.TRUE : ATTRS.FALSE}
            />
          )
        }
      }
    } else {
      // Restore scroll position and unmount expanded media
      if (below) below.style.transform = ''
      if (above) {
        if (typeof above.close === STRINGS.FUNCTION && above.open) {
          above.close()
        }
        above.replaceChildren()
      }
    }
  }

  initProject() {
    const route = router.currentRoute
    this.projectSlug = route?.params?.projectSlug || route?.params?.rawSlug || ''
    if (!this.projectSlug && typeof window !== STRINGS.UNDEFINED) {
      const match = window.location.pathname.match(/\/portfolio\/([^/?#]+)/)
      if (match) this.projectSlug = match[1]
    }
    this.loadData()
  }

  loadData(wait = false) {
    let projectKey = this.projectSlug
    if (!projectKey && typeof window !== STRINGS.UNDEFINED) {
      const match = window.location.pathname.match(/\/portfolio\/([^/?#]+)/)
      if (match) projectKey = match[1]
    }
    if (!projectKey) return
    const lang = store.getters.getlang()
    const currentLocale = lang.locale || LOCALES.EN
    this._lastLocale = currentLocale

    // Normalize legacy slugs using the shared aliases map from constants.js
    projectKey = PROJECT_ALIASES[projectKey] || projectKey

    const dbpath = `${lang.database}${currentLocale}${lang.projectPath}${projectKey}`

    fetchFirebaseDb(dbpath)
      .then((snap) => {
        if (snap?.exists()) {
          const data = snap.val()

          if (data.title) {
            document.title = TEXT.LK_TITLE_PREFIX + data.title
          }

          this.updateRobotsMeta(data.noindex === true)

          const schemaGraph = generateProjectArticleSchema(data, projectKey, currentLocale)

          updateJsonLd(schemaGraph)

          if (!wait) {
            this.translations = data

            this._updateDom()

            this._bindCarousels()

            this.checkAutoOpenModal()
          } else {
            setTimeout(() => {
              this.translations = data

              this._updateDom()

              this._bindCarousels()

              this.checkAutoOpenModal()
            }, wait)
          }
        }
      })
      .catch(console.error)
  }

  textDelay(items) {
    if (!Array.isArray(items)) return 14

    const totalChars =
      items.reduce((sum, str) => {
        return sum + stripHtml(str).length
      }, 0) || 1

    return calcDrawTextDelay(totalChars, 1500)
  }

  textOffset(items, idx) {
    if (!Array.isArray(items)) return 0

    const delay = this.textDelay(items)

    let charsBefore = 0

    for (let i = 0; i < idx; i++) {
      charsBefore += stripHtml(items[i]).length
    }

    return calcDrawTextOffset(idx, charsBefore, delay)
  }

  isLandscapeGroup(group) {
    return (
      Array.isArray(group) && group.length >= 1 && group.every((i) => i?.class === 'landscape')
    )
  }

  checkAutoOpenModal() {
    const route = router.currentRoute

    const slug = route?.params?.slug

    if (!slug || !this.translations) return

    const storage = store.getters.getStorage()

    const folder = this.translations.folder || ''

    for (const section of this.translations.sections || []) {
      for (const group of section) {
        if (!Array.isArray(group) || typeof group[0] === STRINGS.STRING) continue
        for (const item of group) {
          if (slugify(item.label) === slug) {
            const isVideo = item.isVideo ?? false
            const source = isVideo
              ? `${storage}${folder}${item.src}${MEDIA.VIDEO_EXT}`
              : `${storage}${folder}${item.src}${MEDIA.MOZ}${MEDIA.Q100}${MEDIA.EXT}`
            const thumb = isVideo
              ? `${storage}${folder}${item.src}${MEDIA.VIDEO_THUMB_EXT}`
              : `${storage}${folder}${item.src}${MEDIA.MOZ}${MEDIA.THUMB_SUFFIX}${MEDIA.EXT}`

            store.commit(MUTATIONS.SET_MODAL, {
              transform: window.scrollY,
              class: 'modal-open',
              open: true,
              media: {
                source,
                thumb,
                alt: item.label,
                width: item.size[0],
                height: item.size[1],
                isVideo,
              },
            })
            return
          }
        }
      }
    }
  }

  _bindCarousels() {
    const carousels = this.$$(TAGS.CUSTOM_CAROUSEL)
    carousels.forEach((c) => {
      const idx = parseInt(c.getAttribute('data-carousel-idx'), 10)
      const secIdx = parseInt(c.getAttribute('data-sec-idx'), 10)
      if (this.translations?.sections?.[secIdx]?.[idx]) {
        const items = this.translations.sections[secIdx][idx]
        c.forceActive = this.isLandscapeGroup(items)
        c.folder = this.translations.folder || ''
        c.items = items
      }
    })
  }

  render() {
    const t = this.translations

    return (
      <article>
        <div id="main" className={`${CLASSES.PROJECT} ${CLASSES.MODAL_BELOW}`}>
          <h2 className={CLASSES.INTERNAL_TITLE} aria-label={t?.title ? stripHtml(t.title) : undefined}>
            {t?.title ? (
              <draw-text text={t.title} trigger={ATTRS.TRIGGER_VIEWPORT} />
            ) : (
              <span className={CLASSES.SKELETON_TITLE_MD} />
            )}
          </h2>

          <div className={CLASSES.INTERNAL_MAIN}>
            {t?.cover ? (
              <media-figure
                className={CLASSES.INTERNAL_MAIN_ITEM}
                classes={CLASSES.INTERNAL_MAIN_ITEM}
                src={t.folder + t.cover.src}
                width={t.cover.size[0]}
                height={t.cover.size[1]}
                is-video={t.cover?.isVideo ?? false}
                auto-play="true"
                label={t.cover.label || ''}
              />
            ) : (
              <figure className={CLASSES.INTERNAL_MAIN_ITEM}>
                <img
                  decoding={ATTRS.DECODING_ASYNC}
                  className={CLASSES.RENDER_PLACEHOLDER}
                  src={svgPlaceholder(MEDIA_DIMENSIONS.COVER_WIDTH, MEDIA_DIMENSIONS.COVER_HEIGHT)}
                  width={MEDIA_DIMENSIONS.COVER_WIDTH}
                  height={MEDIA_DIMENSIONS.COVER_HEIGHT}
                  alt={ATTRS.EMPTY}
                  aria-hidden={ATTRS.TRUE}
                />
                <div
                  className={`${CLASSES.SKELETON_SHIMMER} ${CLASSES.INTERNAL_MAIN_ITEM} ${CLASSES.RENDER_MEDIA}`}
                />
              </figure>
            )}
          </div>

          {t?.sections ? (
            <div>
              {t.sections.map((section, parentKey) => (
                <section key={parentKey}>
                  {section.map((child, childKey) => {
                    if (typeof child[0] === STRINGS.STRING) {
                      return (
                        <div key={childKey} className={CLASSES.INTERNAL_DESCRIPTION}>
                          {child.map((item, itemKey) => {
                            const delay = this.textDelay(child)
                            const offset = this.textOffset(child, itemKey)

                            if (childKey === 0 && itemKey < 1) {
                              return (
                                <h3 key={itemKey} className={CLASSES.INTERNAL_DESCRIPTION_TEXT} aria-label={stripHtml(item)}>
                                  <draw-text text={item} trigger={ATTRS.TRIGGER_VIEWPORT} delay={delay} offset={offset} />
                                </h3>
                              )
                            }
                            return (
                              <p key={itemKey} className={CLASSES.INTERNAL_DESCRIPTION_TEXT}>
                                <draw-text text={item} trigger={ATTRS.TRIGGER_VIEWPORT} delay={delay} offset={offset} />
                              </p>
                            )
                          })}
                        </div>
                      )
                    } else {
                      return (
                        <custom-carousel
                          key={childKey}
                          data-sec-idx={parentKey}
                          data-carousel-idx={childKey}
                        />
                      )
                    }
                  })}
                </section>
              ))}
            </div>
          ) : (
            <div>
              <div className={CLASSES.INTERNAL_DESCRIPTION}>
                <div aria-hidden={ATTRS.TRUE} className={`${CLASSES.INTERNAL_DESCRIPTION_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_SECTION_TITLE}`} />
                <p className={`${CLASSES.INTERNAL_DESCRIPTION_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_PARA_FULL}`} />
                <p className={`${CLASSES.INTERNAL_DESCRIPTION_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_PARA_94}`} />
                <p className={`${CLASSES.INTERNAL_DESCRIPTION_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_PARA_65}`} />
              </div>
              <div className={CLASSES.INTERNAL_EXTRA}>
                <div className={CLASSES.INTERNAL_EXTRA_SCROLL}>
                  <div className={CLASSES.INTERNAL_EXTRA_ITEM}>
                    <figure>
                      <img
                        decoding={ATTRS.DECODING_ASYNC}
                        className={CLASSES.RENDER_PLACEHOLDER}
                        src={svgPlaceholder(MEDIA_DIMENSIONS.DEFAULT_WIDTH, MEDIA_DIMENSIONS.DEFAULT_HEIGHT)}
                        width={MEDIA_DIMENSIONS.DEFAULT_WIDTH}
                        height={MEDIA_DIMENSIONS.DEFAULT_HEIGHT}
                        alt={ATTRS.EMPTY}
                        aria-hidden={ATTRS.TRUE}
                      />
                      <div className={`${CLASSES.RENDER_MEDIA} ${CLASSES.SKELETON_MEDIA}`} />
                    </figure>
                  </div>
                  <div className={CLASSES.INTERNAL_EXTRA_ITEM}>
                    <figure>
                      <img
                        decoding={ATTRS.DECODING_ASYNC}
                        className={CLASSES.RENDER_PLACEHOLDER}
                        src={svgPlaceholder(MEDIA_DIMENSIONS.DEFAULT_WIDTH, MEDIA_DIMENSIONS.DEFAULT_HEIGHT)}
                        width={MEDIA_DIMENSIONS.DEFAULT_WIDTH}
                        height={MEDIA_DIMENSIONS.DEFAULT_HEIGHT}
                        alt={ATTRS.EMPTY}
                        aria-hidden={ATTRS.TRUE}
                      />
                      <div className={`${CLASSES.RENDER_MEDIA} ${CLASSES.SKELETON_MEDIA}`} />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          )}

          <portfolio-related />
        </div>

        {/* Modal above: native dialog populated imperatively by _updateModalDOM() */}
        <dialog className={CLASSES.MODAL_ABOVE} aria-label={TEXT.MEDIA_PREVIEW} />
      </article>
    )
  }

  onUpdated() {
    this._bindCarousels()
    this._updateModalDOM()
  }

}

if (!customElements.get(TAGS.VIEW_PROJECT)) {
  customElements.define(TAGS.VIEW_PROJECT, ViewProject)
}
