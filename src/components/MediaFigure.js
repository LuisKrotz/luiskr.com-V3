import { h, Fragment } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import { MEDIA, CLASSES, TAGS, MEDIA_DIMENSIONS, ATTRS, EVENTS, STRINGS, TEXT, MUTATIONS, PATHS } from '../core/constants.js'
import { svgPlaceholder, slugify } from '@core/utils'
import { gpuAccel } from '../utils/gpu-accel.js'
import { calcAspectScaled } from '../utils/wasm-layout.js'
import { localMediaCache } from '../utils/local-media-cache.js'
import { wasmMediaThreads } from '../utils/wasm-media-threads.js'
import mediaFigureStyles from '../sass/media-figure.scss?inline'
import internalStyles from '../sass/internals.scss?inline'
import modalStyles from '../sass/modal.scss?inline'

export class MediaFigure extends BaseComponent {
  static get observedAttributes() {
    return [
      ATTRS.SRC,
      ATTRS.LABEL,
      ATTRS.WIDTH,
      ATTRS.HEIGHT,
      ATTRS.CAN_EXPAND,
      ATTRS.IS_VIDEO,
      ATTRS.AUTO_PLAY,
      ATTRS.CLASSES,
    ]
  }

  constructor() {
    super(`${mediaFigureStyles}\n${internalStyles}\n${modalStyles}`)

    this.thumbSrc = ATTRS.EMPTY

    this.highResSrc = ATTRS.EMPTY

    this.isLoaded = false

    this.poster = []

    this.video = []

    this.observer = null

    this.imgObserver = null

    this.isIntersecting = false
  }

  get canExpand() {
    return this.hasAttribute(ATTRS.CAN_EXPAND) && this.getAttribute(ATTRS.CAN_EXPAND) !== ATTRS.FALSE
  }

  get isVideo() {
    return this.hasAttribute(ATTRS.IS_VIDEO) && this.getAttribute(ATTRS.IS_VIDEO) !== ATTRS.FALSE
  }

  get autoPlay() {
    return this.hasAttribute(ATTRS.AUTO_PLAY) && this.getAttribute(ATTRS.AUTO_PLAY) !== ATTRS.FALSE
  }

  get mediaWidth() {
    return parseInt(this.getAttribute(ATTRS.WIDTH) || String(MEDIA_DIMENSIONS.DEFAULT_WIDTH), 10)
  }

  get mediaHeight() {
    return parseInt(this.getAttribute(ATTRS.HEIGHT) || String(MEDIA_DIMENSIONS.DEFAULT_HEIGHT), 10)
  }

  get label() {
    return this.getAttribute(ATTRS.LABEL) || ATTRS.EMPTY
  }

  get mediaSrc() {
    return this.getAttribute(ATTRS.SRC) || ATTRS.EMPTY
  }

  get classes() {
    return this.getAttribute(ATTRS.CLASSES) || ATTRS.EMPTY
  }

  get displayWidth() {
    const MAX = MEDIA_DIMENSIONS.FHD_WIDTH

    if (!this.isVideo || this.mediaWidth <= MAX) return this.mediaWidth

    return MAX
  }

  get displayHeight() {
    const MAX = MEDIA_DIMENSIONS.FHD_WIDTH

    if (!this.isVideo || this.mediaWidth <= MAX) return this.mediaHeight

    return calcAspectScaled(this.mediaWidth, this.mediaHeight, MAX)
  }

  get videoSrcMain() {
    return this.video[0] || ATTRS.EMPTY
  }

  get videoSrcFallback() {
    return this.video.length >= 2 ? this.video[1] : ATTRS.EMPTY
  }

  onInit() {
    if (this.classes) {
      this.classes.split(/\s+/).forEach((cls) => {
        if (cls) this.classList.add(cls)
      })
    }

    const storage = store.getters.getStorage()

    if (this.isVideo) {
      const base = storage + this.mediaSrc

      const urls = [
        [base + MEDIA.VIDEO_THUMB_EXT, base + MEDIA.VIDEO_EXT],
        [base + MEDIA.VIDEO_SCALE + MEDIA.VIDEO_THUMB_EXT, base + MEDIA.VIDEO_SCALE + MEDIA.VIDEO_EXT],
      ]

      this.poster = urls.map((a) => a[0])

      this.video = urls.map((a) => a[1])
    } else {
      this.thumbSrc = storage + this.mediaSrc + MEDIA.MOZ + MEDIA.THUMB_SUFFIX + MEDIA.EXT
    }
  }

  onMounted() {
    gpuAccel.accelerateElementGPU(this)

    this.subscribe(store)

    if (this.classes) {
      this.classes.split(/\s+/).forEach((cls) => {
        if (cls) this.classList.add(cls)
      })
    }

    const fig = this.$(TAGS.FIGURE)

    if (fig && this.canExpand) {
      this.addScopedListener(fig, EVENTS.CLICK, () => this.openModal())
    }

    if (this.isVideo) {
      const isReduced = store.getters.getReducedMotion()

      const vid = this.$(TAGS.VIDEO)

      if (vid) {
        const videoPlayEvents = [EVENTS.MOUSEENTER, EVENTS.MOUSEOVER, EVENTS.MOUSEDOWN]
        const videoPauseEvents = [EVENTS.MOUSELEAVE, EVENTS.MOUSEOUT]

        for (const evt of videoPlayEvents) {
          this.addScopedListener(vid, evt, (e) => this.playVideo(e.target))
        }

        for (const evt of videoPauseEvents) {
          this.addScopedListener(vid, evt, (e) => this.pauseVideo(e.target))
        }

        this.addScopedListener(vid, EVENTS.LOADEDDATA, (e) => {
          gpuAccel.processVideoGPU(e.target, this.displayWidth || MEDIA_DIMENSIONS.VIDEO_DEFAULT_WIDTH, this.displayHeight || MEDIA_DIMENSIONS.VIDEO_DEFAULT_HEIGHT)
        })

        this.addScopedListener(vid, EVENTS.ERROR, (e) => {
          if (e?.target?.hasAttribute(ATTRS.POSTER)) {
            e.target.removeAttribute(ATTRS.POSTER)
          }
        })

        if (!isReduced) {
          this.observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                this.isIntersecting = entry.isIntersecting

                if (entry.isIntersecting) {
                  this._ensureVideoSource(vid)

                  if (store.getters.getVideoAutoplay() && vid.paused) {
                    vid.play().catch(() => {})
                  }
                } else {
                  if (!vid.paused) {
                    vid.pause()
                  }
                }
              })
            },
            { threshold: 0.15 }
          )

          this.observer.observe(vid)
        }
      }
    } else {
      const highImg = this.$(`.${CLASSES.RENDER_MEDIA_HIGH}`) || this.$(TAGS.FIGURE)

      if (highImg) {
        this.imgObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !this.isLoaded) {
                this.loadHighRes()

                if (this.imgObserver) {
                  this.imgObserver.disconnect()

                  this.imgObserver = null
                }
              }
            })
          },
          { rootMargin: ATTRS.ROOT_MARGIN_100, threshold: 0.01 }
        )

        this.imgObserver.observe(highImg)
      }
    }
  }

  _ensureVideoSource(vid) {
    if (!vid || vid.querySelector(ATTRS.SOURCE)) return

    const src1 = document.createElement(ATTRS.SOURCE)

    src1.src = this.videoSrcMain

    src1.type = ATTRS.VIDEO_MP4

    vid.appendChild(src1)

    if (this.videoSrcFallback) {
      const src2 = document.createElement(ATTRS.SOURCE)

      src2.src = this.videoSrcFallback

      src2.type = ATTRS.VIDEO_MP4

      vid.appendChild(src2)
    }

    vid.load()
  }

  onDestroy() {
    if (this.observer) {
      this.observer.disconnect()

      this.observer = null
    }

    if (this.imgObserver) {
      this.imgObserver.disconnect()

      this.imgObserver = null
    }
  }

  onStoreUpdate() {
    if (this.isVideo) {
      const vid = this.$(TAGS.VIDEO)

      if (vid) {
        if (!store.getters.getVideoAutoplay()) {
          if (!vid.paused) {
            vid.pause()
          }
        } else if (this.isIntersecting && vid.paused && !store.getters.getReducedMotion()) {
          this._ensureVideoSource(vid)

          vid.play().catch(() => {})
        }
      }
    }
  }

  playVideo(target) {
    if (!store.getters.getReducedMotion() && store.getters.getVideoAutoplay() && target?.play) {
      this._ensureVideoSource(target)

      target
        .play()
        .then(() => {
          gpuAccel.processVideoGPU(target, this.displayWidth || MEDIA_DIMENSIONS.VIDEO_DEFAULT_WIDTH, this.displayHeight || MEDIA_DIMENSIONS.VIDEO_DEFAULT_HEIGHT)
        })
        .catch(() => {})
    }
  }

  pauseVideo(target) {
    if (!store.getters.getReducedMotion() && target?.pause) {
      target.pause()
    }
  }

  placeholder(w, h) {
    return `${STRINGS.SVG_DATA_URI_PREFIX}%3Csvg xmlns="${STRINGS.SVG_XMLNS}" viewBox="0 0 ${w} ${h}"%3E%3C/svg%3E`
  }

  async loadHighRes() {
    if (this.isVideo || this.isLoaded) return

    const height = this.mediaHeight || 0

    const width = this.mediaWidth || 0

    if (height > 4096 || width > 4096) {
      return
    }

    const storage = store.getters.getStorage()

    const targetUrl = storage + this.mediaSrc + MEDIA.MOZ + MEDIA.Q50 + MEDIA.EXT

    this.highResSrc = targetUrl

    const highEl = this.$(`.${CLASSES.RENDER_MEDIA_HIGH}`)

    const finish = () => {
      this.isLoaded = true

      if (highEl) {
        highEl.src = targetUrl

        highEl.classList.add(CLASSES.RENDER_MEDIA_LOADED)

        const thumbEl = this.$(`.${CLASSES.RENDER_MEDIA_THUMB}`)

        if (thumbEl) {
          thumbEl.style.display = ATTRS.NONE
        }
      } else if (this._isMounted) {
        this._updateDom()
      }
    }

    const ImageClass =
      typeof window !== STRINGS.UNDEFINED && window.Image
        ? window.Image
        : typeof Image !== STRINGS.UNDEFINED
          ? Image
          : null

    if (!ImageClass) {
      finish()

      return
    }

    const img = new ImageClass()

    img.src = targetUrl

    img.onload = () => {
      gpuAccel.processTextureGPU(img, this.displayWidth, this.displayHeight)

      finish()
    }

    img.onerror = () => {
      this.isLoaded = true
    }
  }

  slugify(text) {
    return slugify(text)
  }

  openModal() {
    if (!this.canExpand) return

    const scrollY = window.scrollY

    const storage = store.getters.getStorage()

    store.commit(MUTATIONS.SET_MODAL, {
      transform: scrollY,
      class: CLASSES.MODAL_OPEN,
      open: true,
      media: {
        source: this.isVideo
          ? this.video[0]
          : storage + this.mediaSrc + MEDIA.MOZ + MEDIA.Q100 + MEDIA.EXT,
        thumb: this.isVideo
          ? this.poster[0]
          : storage + this.mediaSrc + MEDIA.MOZ + MEDIA.THUMB_SUFFIX + MEDIA.EXT,
        alt: this.label,
        width: this.mediaWidth,
        height: this.mediaHeight,
        isVideo: this.isVideo,
      },
    })

    const slug = this.slugify(this.label)

    if (slug) {
      const currentPath = window.location.pathname.replace(/\/$/, ATTRS.EMPTY)

      const segments = currentPath.split(PATHS.ROOT)

      const portIdx = segments.indexOf(STRINGS.PORTFOLIO)

      let basePath = currentPath

      if (portIdx !== -1 && segments.length > portIdx + 1) {
        basePath = segments.slice(0, portIdx + 2).join(PATHS.ROOT)
      }

      const newPath = `${basePath}${PATHS.ROOT}${slug}`

      if (window.location.pathname !== newPath) {
        window.history.replaceState({}, ATTRS.EMPTY, newPath)
      }
    }
  }

  render() {
    const mediaW = this.displayWidth

    const mediaH = this.displayHeight

    const action = store.getters.getClickOrTap()

    const compLang = store.getters.getlang().components?.media || {}

    const toOpen = compLang.toOpen || TEXT.TO_EXPAND

    const isHeroItem = this.classes.includes(CLASSES.INTERNAL_MAIN_ITEM)

    const shouldPreloadVideo = this.autoPlay || isHeroItem

    return (
      <figure
        className={this.canExpand ? CLASSES.INTERNAL_EXPAND : ATTRS.EMPTY}
        title={this.label}
      >
        <img
          decoding={ATTRS.DECODING_ASYNC}
          className={CLASSES.RENDER_PLACEHOLDER}
          src={this.placeholder(mediaW, mediaH)}
          width={mediaW}
          height={mediaH}
          alt={ATTRS.EMPTY}
          aria-hidden={ATTRS.TRUE}
        />

        {!this.isVideo ? (
          <Fragment>
            <img
              decoding={ATTRS.DECODING_ASYNC}
              loading={isHeroItem ? ATTRS.LOADING_EAGER : ATTRS.LOADING_LAZY}
              fetchpriority={isHeroItem ? ATTRS.FETCH_PRIORITY_HIGH : ATTRS.FETCH_PRIORITY_LOW}
              className={`${CLASSES.RENDER_MEDIA} ${CLASSES.RENDER_MEDIA_THUMB} ${this.classes}`}
              width={mediaW}
              height={mediaH}
              alt={this.label}
              src={this.thumbSrc}
            />

            <img
              decoding={ATTRS.DECODING_ASYNC}
              className={`${CLASSES.RENDER_MEDIA} ${CLASSES.RENDER_MEDIA_HIGH} ${this.classes} ${this.isLoaded ? CLASSES.RENDER_MEDIA_LOADED : ATTRS.EMPTY}`}
              width={mediaW}
              height={mediaH}
              alt={this.label}
              src={this.highResSrc || ATTRS.EMPTY}
            />
          </Fragment>
        ) : (
          <video
            className={`${CLASSES.RENDER_MEDIA} ${this.classes}`}
            poster={this.poster[0] || ATTRS.EMPTY}
            width={mediaW}
            height={mediaH}
            preload={shouldPreloadVideo ? ATTRS.METADATA : ATTRS.NONE}
            fetchpriority={isHeroItem ? ATTRS.FETCH_PRIORITY_HIGH : undefined}
            playsInline
            loop
            muted
            autoPlay={this.autoPlay}
            controls={store.getters.getReducedMotion()}
          >
            <track kind={ATTRS.CAPTIONS} />

            <source src={this.videoSrcMain} type={ATTRS.VIDEO_MP4} />

            {this.videoSrcFallback ? <source src={this.videoSrcFallback} type={ATTRS.VIDEO_MP4} /> : null}
          </video>
        )}

        {this.canExpand && (
          <Fragment>
            <button className={CLASSES.EXPAND_MODAL_OPEN_1} data-no-snippet type={ATTRS.BUTTON}>
              {action} {toOpen}
            </button>

            <button
              className={CLASSES.EXPAND_MODAL_OPEN_2}
              aria-label={`${action} ${toOpen}`}
              aria-hidden={ATTRS.TRUE}
              tabIndex={-1}
              data-no-snippet
              type={ATTRS.BUTTON}
            />
          </Fragment>
        )}
      </figure>
    )
  }
}

if (!customElements.get(TAGS.MEDIA_FIGURE)) {
  customElements.define(TAGS.MEDIA_FIGURE, MediaFigure)
}
