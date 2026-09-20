import { h, Fragment } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import { MEDIA, CLASSES, TAGS, MEDIA_DIMENSIONS, ATTRS } from '../core/constants.js'
import { gpuAccel } from '../utils/gpu-accel.js'
import { calcAspectScaled } from '../utils/wasm-layout.js'
import { localMediaCache } from '../utils/local-media-cache.js'
import { wasmMediaThreads } from '../utils/wasm-media-threads.js'
import mediaFigureStyles from '../sass/media-figure.scss?inline'
import internalStyles from '../sass/internals.scss?inline'
import modalStyles from '../sass/modal.scss?inline'

// All media URL suffix constants imported from core/constants.js — no duplication.

export class MediaFigure extends BaseComponent {
  static get observedAttributes() {
    return ['src', 'label', 'width', 'height', 'can-expand', 'is-video', 'auto-play', 'classes']
  }

  constructor() {
    // SCSS files provide ALL styles — no JS-injected style strings.
    super(`${mediaFigureStyles}\n${internalStyles}\n${modalStyles}`)
    this.thumbSrc = ''
    this.highResSrc = ''
    this.isLoaded = false
    this.poster = []
    this.video = []
    this.observer = null
    this.imgObserver = null
  }

  get canExpand() {
    return this.hasAttribute('can-expand') && this.getAttribute('can-expand') !== ATTRS.FALSE
  }

  get isVideo() {
    return this.hasAttribute('is-video') && this.getAttribute('is-video') !== ATTRS.FALSE
  }

  get autoPlay() {
    return this.hasAttribute('auto-play') && this.getAttribute('auto-play') !== ATTRS.FALSE
  }

  get mediaWidth() {
    return parseInt(this.getAttribute('width') || String(MEDIA_DIMENSIONS.DEFAULT_WIDTH), 10)
  }

  get mediaHeight() {
    return parseInt(this.getAttribute('height') || String(MEDIA_DIMENSIONS.DEFAULT_HEIGHT), 10)
  }

  get label() {
    return this.getAttribute('label') || ''
  }

  get mediaSrc() {
    return this.getAttribute('src') || ''
  }

  get classes() {
    return this.getAttribute('classes') || ''
  }

  get displayWidth() {
    const MAX = 1920
    if (!this.isVideo || this.mediaWidth <= MAX) return this.mediaWidth
    return MAX
  }

  get displayHeight() {
    const MAX = 1920
    if (!this.isVideo || this.mediaWidth <= MAX) return this.mediaHeight
    return calcAspectScaled(this.mediaWidth, this.mediaHeight, MAX)
  }

  // Returns highest-quality video src (index 0 = original, index 1 = scaled-down fallback)
  get videoSrcMain() {
    return this.video[0] || ''
  }

  get videoSrcFallback() {
    return this.video.length >= 2 ? this.video[1] : ''
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

    if (this.classes) {
      this.classes.split(/\s+/).forEach((cls) => {
        if (cls) this.classList.add(cls)
      })
    }

    const fig = this.$('figure')
    if (fig && this.canExpand) {
      this.addScopedListener(fig, 'click', () => this.openModal())
    }

    if (this.isVideo) {
      const isReduced = store.getters.getReducedMotion()
      const vid = this.$('video')
      if (vid) {
        this.addScopedListener(vid, 'mouseenter', (e) => this.playVideo(e.target))
        this.addScopedListener(vid, 'mouseover', (e) => this.playVideo(e.target))
        this.addScopedListener(vid, 'mouseleave', (e) => this.pauseVideo(e.target))
        this.addScopedListener(vid, 'mouseout', (e) => this.pauseVideo(e.target))
        this.addScopedListener(vid, 'mousedown', (e) => this.playVideo(e.target))
        this.addScopedListener(vid, 'loadeddata', (e) => {
          gpuAccel.processVideoGPU(e.target, this.displayWidth || 640, this.displayHeight || 360)
        })
        this.addScopedListener(vid, 'error', (e) => {
          if (e?.target?.hasAttribute('poster')) {
            e.target.removeAttribute('poster')
          }
        })

        if (!isReduced) {
          this.observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  vid.play().catch(() => {})
                } else {
                  vid.pause()
                }
              })
            },
            { threshold: 0.15 }
          )
          this.observer.observe(vid)
        }
      }
    } else {
      const highImg = this.$(`.${CLASSES.RENDER_MEDIA_HIGH}`) || this.$('figure')
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
          { rootMargin: '100px 50px', threshold: 0.01 }
        )
        this.imgObserver.observe(highImg)
      }
    }
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

  playVideo(target) {
    if (!store.getters.getReducedMotion() && target?.play) {
      target
        .play()
        .then(() => {
          gpuAccel.processVideoGPU(target, this.displayWidth || 640, this.displayHeight || 360)
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
    return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"%3E%3C/svg%3E`
  }

  async loadHighRes() {
    const storage = store.getters.getStorage()
    const targetUrl = storage + this.mediaSrc + MEDIA.MOZ + MEDIA.Q50 + MEDIA.EXT
    const localUrl = await localMediaCache.fetchOrGetLocalMedia(targetUrl)

    const bitmap = await wasmMediaThreads.decodeMediaInSeparateThread(
      localUrl,
      this.displayWidth || 800,
      this.displayHeight || 450
    )

    const ImageClass =
      typeof window !== 'undefined' && window.Image
        ? window.Image
        : typeof Image !== 'undefined'
          ? Image
          : null

    const finish = () => {
      this.highResSrc = localUrl
      this.isLoaded = true
      const highEl = this.$(`.${CLASSES.RENDER_MEDIA_HIGH}`)
      if (highEl) {
        highEl.src = localUrl
        highEl.classList.add(CLASSES.RENDER_MEDIA_LOADED)
      }
    }

    if (!ImageClass) {
      finish()
      return
    }

    const img = new ImageClass()
    img.src = localUrl
    img.onload = () => {
      if (!bitmap) {
        gpuAccel.processTextureGPU(img, this.displayWidth, this.displayHeight)
      }
      finish()
    }
    img.onerror = () => {
      finish()
    }
  }

  slugify(text) {
    return (text || '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/--+/g, '-')
  }

  openModal() {
    if (!this.canExpand) return
    const scrollY = window.scrollY
    const storage = store.getters.getStorage()

    store.commit('setModal', {
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
      const currentPath = window.location.pathname.replace(/\/$/, '')
      const segments = currentPath.split('/')
      const portIdx = segments.indexOf('portfolio')
      let basePath = currentPath
      if (portIdx !== -1 && segments.length > portIdx + 1) {
        basePath = segments.slice(0, portIdx + 2).join('/')
      }
      const newPath = `${basePath}/${slug}`
      if (window.location.pathname !== newPath) {
        window.history.replaceState({}, '', newPath)
      }
    }
  }

  render() {
    const mediaW = this.displayWidth
    const mediaH = this.displayHeight
    const action = store.getters.getClickOrTap()
    const compLang = store.getters.getlang().components?.media || {}
    const toOpen = compLang.toOpen || 'to expand'

    return (
      <figure
        className={this.canExpand ? CLASSES.INTERNAL_EXPAND : ''}
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
              loading={this.classes.includes(CLASSES.INTERNAL_MAIN_ITEM) ? undefined : ATTRS.LOADING_LAZY}
              className={`${CLASSES.RENDER_MEDIA} ${CLASSES.RENDER_MEDIA_THUMB} ${this.classes}`}
              width={mediaW}
              height={mediaH}
              alt={this.label}
              src={this.thumbSrc}
            />

            <img
              decoding={ATTRS.DECODING_ASYNC}
              loading={ATTRS.LOADING_LAZY}
              className={`${CLASSES.RENDER_MEDIA} ${CLASSES.RENDER_MEDIA_HIGH} ${this.classes} ${this.isLoaded ? CLASSES.RENDER_MEDIA_LOADED : ''}`}
              width={mediaW}
              height={mediaH}
              alt={this.label}
              src={this.highResSrc || ''}
            />
          </Fragment>
        ) : (
          <video
            className={`${CLASSES.RENDER_MEDIA} ${this.classes}`}
            poster={this.poster[0] || ''}
            width={mediaW}
            height={mediaH}
            preload={this.autoPlay || this.classes.includes(CLASSES.INTERNAL_MAIN_ITEM) ? 'metadata' : ATTRS.NONE}
            playsInline
            loop
            muted
            controls={store.getters.getReducedMotion()}
          >
            <source src={this.videoSrcMain} type="video/mp4" />
            {this.videoSrcFallback ? <source src={this.videoSrcFallback} type="video/mp4" /> : null}
          </video>
        )}

        {this.canExpand && (
          <Fragment>
            <button className={CLASSES.EXPAND_MODAL_OPEN_1} data-no-snippet type="button">
              {action} {toOpen}
            </button>
            <button
              className={CLASSES.EXPAND_MODAL_OPEN_2}
              aria-label={`${action} ${toOpen}`}
              aria-hidden={ATTRS.TRUE}
              tabIndex="-1"
              data-no-snippet
              type="button"
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
