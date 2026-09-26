import { h, Fragment } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import {
  CLASSES,
  TAGS,
  MEDIA_DIMENSIONS,
  ATTRS,
  STRINGS,
  EVENTS,
  KEYS,
  WASM_ACTIONS,
  TEXT,
  MUTATIONS,
  PATHS,
} from '../core/constants.js'
import { svgPlaceholder } from '../core/utils/dom.js'
import { gpuAccel } from '../utils/gpu-accel.js'
import { wasmPool } from '../utils/wasm-pool.js'
import { localMediaCache } from '../utils/local-media-cache.js'
import { wasmMediaThreads } from '../utils/wasm-media-threads.js'
import { CloseButtonWebGL } from '../utils/canvas/close-button.js'
import modalStyles from '../sass/components/modal.scss?inline'

export class MediaExpanded extends BaseComponent {
  static get observedAttributes() {
    return [ATTRS.SOURCE, ATTRS.THUMB, ATTRS.ALT, ATTRS.WIDTH, ATTRS.HEIGHT, ATTRS.IS_VIDEO]
  }

  constructor() {
    super(modalStyles)

    this.isClosing = false

    this.currentSrc = ATTRS.EMPTY

    this._closeBtn = null
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
    const dialog = this.closest(TAGS.DIALOG) || document.querySelector(`${TAGS.DIALOG}.${CLASSES.MODAL_ABOVE}`)
    if (dialog) {
      this.addScopedListener(dialog, EVENTS.CANCEL, (e) => {
        e.preventDefault()
        this.startClose()
      })
    }

    // Click events
    const closeBtns = this.$$(
      `.${CLASSES.PREF_CLOSE_BTN}, .${CLASSES.EXPAND_MODAL_CLOSE_BAR_BUTTON}, .${CLASSES.EXPAND_MODAL_CLOSE_BOTTOM}, .${CLASSES.EXPAND_MODAL_CLOSE_AREA}`
    )
    closeBtns.forEach((btn) => {
      this.addScopedListener(btn, EVENTS.CLICK, () => this.startClose())
    })

    const closeCanvas = this.$(`.${CLASSES.PREF_CLOSE_CANVAS}`)

    if (closeCanvas) {
      this._closeBtn = new CloseButtonWebGL(closeCanvas, () => this.startClose())
    }

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
    return svgPlaceholder(width, height)
  }

  startClose() {
    if (this.isClosing) return
    this.isClosing = true

    const content = this.$(`.${CLASSES.EXPAND_MODAL_CONTENT}`)
    if (content) content.classList.add(CLASSES.EXPAND_MODAL_CLOSING)

    const scroll = Number(store.getters.getModal().transform) || 0

    setTimeout(() => {
      // 1. Restore URL by removing image slug
      const currentPath = window.location.pathname.replace(/\/$/, ATTRS.EMPTY)

      const segments = currentPath.split(STRINGS.SLASH)

      const portIdx = segments.indexOf(PATHS.PORTFOLIO_SEGMENT)

      if (portIdx !== -1 && segments.length > portIdx + 2) {
        const basePath = segments.slice(0, portIdx + 2).join(STRINGS.SLASH)

        window.history.replaceState({}, ATTRS.EMPTY, basePath)
      }

      // 2. Native dialog close
      const dialog = this.closest(TAGS.DIALOG) || document.querySelector(`${TAGS.DIALOG}.${CLASSES.MODAL_ABOVE}`)

      if (dialog && typeof dialog.close === STRINGS.FUNCTION && dialog.open) {
        dialog.close()
      }

      // 3. Restore document scroll position and modal state cleanly
      window.scrollTo(0, scroll)

      store.commit(MUTATIONS.SET_MODAL, {
        transform: 0,
        class: ATTRS.EMPTY,
        open: false,
        media: {
          source: ATTRS.EMPTY,
          thumb: ATTRS.EMPTY,
          alt: ATTRS.EMPTY,
          width: 0,
          height: 0,
          isVideo: false,
        },
      })
    }, 320)
  }

  onDestroy() {
    if (this._closeBtn) {
      this._closeBtn.destroy()

      this._closeBtn = null
    }
  }

  render() {
    const compMedia = store.getters.getlang().components?.media || {}

    const closeText = compMedia.close || TEXT.CLOSE

    const isReduced = store.getters.getReducedMotion()

    const mediaW = this.mediaWidth

    const mediaH = this.mediaHeight

    return (
      <div
        className={`${CLASSES.EXPAND_MODAL_CONTENT} ${this.isClosing ? CLASSES.EXPAND_MODAL_CLOSING : ATTRS.EMPTY} ${this.isVideo ? CLASSES.EXPAND_MODAL_CONTENT_VIDEO : ATTRS.EMPTY}`}
      >
        <div className={CLASSES.EXPAND_MODAL_CLOSE_BAR}>
          <span className={CLASSES.EXPAND_MODAL_CLOSE_BAR_TITLE}>{this.alt}</span>

          <button
            className={CLASSES.PREF_CLOSE_BTN}
            type={ATTRS.BUTTON}
            aria-label={closeText}
            onClick={() => this.startClose()}
          >
            <canvas className={CLASSES.PREF_CLOSE_CANVAS} />
          </button>
        </div>
        <div className={CLASSES.EXPAND_MODAL_CLOSE_AREA} />
        <figure
          className={`${CLASSES.EXPAND_MODAL_MEDIA_FIGURE} ${this.isVideo ? CLASSES.EXPAND_MODAL_MEDIA_FIGURE_VIDEO : ATTRS.EMPTY}`}
        >
          {!this.isVideo ? (
            <Fragment>
              <img
                decoding={ATTRS.DECODING_ASYNC}
                className={CLASSES.EXPAND_MODAL_MEDIA_PLACEHOLDER}
                src={this.placeholder(mediaW, mediaH)}
                width={mediaW}
                height={mediaH}
                alt={ATTRS.EMPTY}
                aria-hidden={ATTRS.TRUE}
                tabIndex={STRINGS.MINUS_ONE}
                data-nosnippet
              />
              <img
                decoding={ATTRS.DECODING_ASYNC}
                className={CLASSES.EXPAND_MODAL_MEDIA_ITEM}
                width={mediaW}
                height={mediaH}
                alt={this.alt}
                src={this.currentSrc || this.thumb}
              />
            </Fragment>
          ) : (
            <video
              decoding={ATTRS.DECODING_ASYNC}
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
              controlsList={ATTRS.NO_DOWNLOAD}
              disablePictureInPicture
            >
              <source src={this.source} type={ATTRS.VIDEO_MP4} />
            </video>
          )}
        </figure>

        <button className={CLASSES.EXPAND_MODAL_CLOSE_BOTTOM} type={ATTRS.BUTTON}>
          {closeText}
        </button>
      </div>
    )
  }
}

if (!customElements.get(TAGS.MEDIA_EXPANDED)) {
  customElements.define(TAGS.MEDIA_EXPANDED, MediaExpanded)
}

