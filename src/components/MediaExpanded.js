import { h, Fragment } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import { CLASSES, TAGS, MEDIA_DIMENSIONS, ATTRS, STRINGS, EVENTS, KEYS, WASM_ACTIONS } from '../core/constants.js'
import { gpuAccel } from '../utils/gpu-accel.js'
import { wasmPool } from '../utils/wasm-pool.js'
import { localMediaCache } from '../utils/local-media-cache.js'
import { wasmMediaThreads } from '../utils/wasm-media-threads.js'
import modalStyles from '../sass/modal.scss?inline'

export class MediaExpanded extends BaseComponent {
  static get observedAttributes() {
    return [ATTRS.SOURCE, ATTRS.THUMB, ATTRS.ALT, ATTRS.WIDTH, ATTRS.HEIGHT, ATTRS.IS_VIDEO]
  }

  constructor() {
    super(modalStyles)
    this.isClosing = false
    this.currentSrc = ATTRS.EMPTY
  }

  get source() {
    return this.getAttribute(ATTRS.SOURCE) || ATTRS.EMPTY
  }

  get thumb() {
    return this.getAttribute(ATTRS.THUMB) || ATTRS.EMPTY
  }

  get alt() {
    return this.getAttribute(ATTRS.ALT) || ATTRS.EMPTY
  }

  get mediaWidth() {
    return parseInt(this.getAttribute(ATTRS.WIDTH) || String(MEDIA_DIMENSIONS.DEFAULT_WIDTH), 10)
  }

  get mediaHeight() {
    return parseInt(this.getAttribute(ATTRS.HEIGHT) || String(MEDIA_DIMENSIONS.DEFAULT_HEIGHT), 10)
  }

  get isVideo() {
    return this.hasAttribute(ATTRS.IS_VIDEO) && this.getAttribute(ATTRS.IS_VIDEO) !== ATTRS.FALSE
  }

  onInit() {
    this.currentSrc = this.thumb
  }

  onMounted() {
    window.scrollTo({ top: 0, behavior: ATTRS.INSTANT })

    const modalAbove = document.querySelector(`.${CLASSES.MODAL_ABOVE}`)
    if (modalAbove) modalAbove.scrollTop = 0

    // ESC key closes modal
    this.addScopedListener(window, EVENTS.KEYDOWN, (e) => {
      if (e.key === KEYS.ESCAPE) this.startClose()
    })

    // Native dialog cancel event
    const dialog = this.closest('dialog') || document.querySelector(`dialog.${CLASSES.MODAL_ABOVE}`)
    if (dialog) {
      this.addScopedListener(dialog, EVENTS.CANCEL, (e) => {
        e.preventDefault()
        this.startClose()
      })
    }

    // Click events
    const closeBtns = this.$$(
      `.${CLASSES.EXPAND_MODAL_CLOSE_BAR_BUTTON}, .${CLASSES.EXPAND_MODAL_CLOSE_BOTTOM}, .${CLASSES.EXPAND_MODAL_CLOSE_AREA}`
    )
    closeBtns.forEach((btn) => {
      this.addScopedListener(btn, EVENTS.CLICK, () => this.startClose())
    })

    wasmPool.dispatch(WASM_ACTIONS.PROCESS_MEDIA_ANALYTICS, {
      width: this.mediaWidth || 0,
      height: this.mediaHeight || 0,
      isVideo: this.isVideo,
    })

    if (this.isVideo) {
      const vid = this.$(TAGS.VIDEO)
      if (vid && !store.getters.getReducedMotion()) {
        vid.play().catch(() => {})
      }
    } else if (this.source) {
      localMediaCache.fetchOrGetLocalMedia(this.source).then(async (localUrl) => {
        const bitmap = await wasmMediaThreads.decodeMediaInSeparateThread(
          localUrl,
          this.mediaWidth || 800,
          this.mediaHeight || 450
        )
        const img = new Image()
        img.src = localUrl
        img.onload = () => {
          if (!bitmap) {
            gpuAccel.processImageGPU(img, this.mediaWidth || 800, this.mediaHeight || 450)
          }
          this.currentSrc = localUrl
          const imgEl = this.$(`.${CLASSES.EXPAND_MODAL_MEDIA_ITEM}`)
          if (imgEl) imgEl.src = localUrl
        }
        img.onerror = () => {
          this.currentSrc = localUrl
          const imgEl = this.$(`.${CLASSES.EXPAND_MODAL_MEDIA_ITEM}`)
          if (imgEl) imgEl.src = localUrl
        }
      })
    }
  }

  placeholder(width, height) {
    return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" %3E%3C/svg%3E`
  }

  startClose() {
    if (this.isClosing) return
    this.isClosing = true

    const content = this.$(`.${CLASSES.EXPAND_MODAL_CONTENT}`)
    if (content) content.classList.add(CLASSES.EXPAND_MODAL_CLOSING)

    const scroll = Number(store.getters.getModal().transform) || 0

    setTimeout(() => {
      // 1. Restore URL by removing image slug
      const currentPath = window.location.pathname.replace(/\/$/, '')

      const segments = currentPath.split('/')

      const portIdx = segments.indexOf('portfolio')

      if (portIdx !== -1 && segments.length > portIdx + 2) {
        const basePath = segments.slice(0, portIdx + 2).join('/')

        window.history.replaceState({}, '', basePath)
      }

      // 2. Native dialog close
      const dialog = this.closest('dialog') || document.querySelector(`dialog.${CLASSES.MODAL_ABOVE}`)

      if (dialog && typeof dialog.close === STRINGS.FUNCTION && dialog.open) {
        dialog.close()
      }

      // 3. Restore document scroll position and modal state cleanly
      window.scrollTo(0, scroll)

      store.commit('setModal', {
        transform: 0,
        class: '',
        open: false,
        media: {
          source: '',
          thumb: '',
          alt: '',
          width: 0,
          height: 0,
          isVideo: false,
        },
      })
    }, 320)
  }

  render() {
    const compMedia = store.getters.getlang().components?.media || {}
    const closeText = compMedia.close || 'Close'
    const isReduced = store.getters.getReducedMotion()
    const mediaW = this.mediaWidth
    const mediaH = this.mediaHeight

    return (
      <div
        className={`${CLASSES.EXPAND_MODAL_CONTENT} ${this.isClosing ? CLASSES.EXPAND_MODAL_CLOSING : ''} ${this.isVideo ? CLASSES.EXPAND_MODAL_CONTENT_VIDEO : ''}`}
      >
        <div className={CLASSES.EXPAND_MODAL_CLOSE_BAR}>
          <span className={CLASSES.EXPAND_MODAL_CLOSE_BAR_TITLE}>{this.alt}</span>
          <button
            className={CLASSES.EXPAND_MODAL_CLOSE_BAR_BUTTON}
            type="button"
            aria-label={closeText}
          >
            {closeText}
          </button>
        </div>
        <div className={CLASSES.EXPAND_MODAL_CLOSE_AREA} />
        <figure
          className={`${CLASSES.EXPAND_MODAL_MEDIA_FIGURE} ${this.isVideo ? CLASSES.EXPAND_MODAL_MEDIA_FIGURE_VIDEO : ''}`}
        >
          {!this.isVideo ? (
            <Fragment>
              <img
                decoding="async"
                className={CLASSES.EXPAND_MODAL_MEDIA_PLACEHOLDER}
                src={this.placeholder(mediaW, mediaH)}
                width={mediaW}
                height={mediaH}
                alt={ATTRS.EMPTY}
                aria-hidden={ATTRS.TRUE}
                tabIndex="-1"
                data-nosnippet
              />
              <img
                decoding="async"
                className={CLASSES.EXPAND_MODAL_MEDIA_ITEM}
                width={mediaW}
                height={mediaH}
                alt={this.alt}
                src={this.currentSrc || this.thumb}
              />
            </Fragment>
          ) : (
            <video
              decoding="async"
              className={`${CLASSES.EXPAND_MODAL_MEDIA_ITEM} ${CLASSES.EXPAND_MODAL_MEDIA_ITEM_VIDEO}`}
              width={mediaW}
              height={mediaH}
              poster={this.thumb}
              alt={this.alt}
              playsInline
              autoPlay={!isReduced}
              loop
              muted
              controls
            >
              <source src={this.source} type="video/mp4" />
            </video>
          )}
        </figure>

        <button className={CLASSES.EXPAND_MODAL_CLOSE_BOTTOM} type="button">
          {closeText}
        </button>
      </div>
    )
  }
}

if (!customElements.get(TAGS.MEDIA_EXPANDED)) {
  customElements.define(TAGS.MEDIA_EXPANDED, MediaExpanded)
}

