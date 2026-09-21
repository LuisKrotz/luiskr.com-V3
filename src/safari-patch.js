import { TAGS, CLASSES, MEDIA, ATTRS, MEDIA_DIMENSIONS, EVENTS, STRINGS } from './core/constants.js'
import store from './core/store.js'
import { gpuAccel } from './utils/gpu-accel.js'
import { wasmPool } from './utils/wasm-pool.js'
import { localMediaCache } from './utils/local-media-cache.js'
import { wasmMediaThreads } from './utils/wasm-media-threads.js'
import safariCarouselStyles from './sass/safari-carousel.scss?inline'
import safariMediaStyles from './sass/safari-media.scss?inline'

// ── 1. Mark HTML element with Safari class ────────────────────────────────────
if (typeof document !== STRINGS.UNDEFINED && document.documentElement) {
  document.documentElement.classList.add(CLASSES.IS_SAFARI)
}

// ── 2. Disable GPU compositor layer bloat & WebGL textures on Safari/iOS ───────
gpuAccel.accelerateElementGPU = () => {}

gpuAccel.processTextureGPU = () => {}

gpuAccel.processImageGPU = () => {}

gpuAccel.processBitmapGPU = () => {}

gpuAccel.processVideoGPU = () => {}

// ── 3. Bypass WASM worker pool & memory-heavy caches on Safari/iOS ─────────────
wasmPool.dispatch = () => Promise.resolve(null)

localMediaCache.fetchOrGetLocalMedia = (url) => Promise.resolve(url)

localMediaCache.getLocalMedia = () => Promise.resolve(null)

localMediaCache.storeLocalMedia = (url) => Promise.resolve(url)

wasmMediaThreads.decodeMediaInSeparateThread = () => Promise.resolve(null)

// ── 4. Retroactive cleanup of any existing DOM elements ───────────────────────
if (typeof document !== STRINGS.UNDEFINED) {
  const existingFigures = document.querySelectorAll(TAGS.MEDIA_FIGURE)

  existingFigures.forEach((mf) => {
    mf.style.willChange = ATTRS.EMPTY

    mf.style.transform = ATTRS.EMPTY

    mf.style.backfaceVisibility = ATTRS.EMPTY
  })
}

// ── 5. Component Patches ──────────────────────────────────────────────────────
if (typeof customElements !== STRINGS.UNDEFINED) {
  // ── CustomCarousel ─────────────────────────────────────────────────────────
  customElements.whenDefined(TAGS.CUSTOM_CAROUSEL).then(() => {
    const CustomCarouselClass = customElements.get(TAGS.CUSTOM_CAROUSEL)

    if (!CustomCarouselClass || !CustomCarouselClass.prototype) return

    CustomCarouselClass.prototype._measureFit = () => {}

    const originalRenderInitial = CustomCarouselClass.prototype._renderInitial

    CustomCarouselClass.prototype._renderInitial = function () {
      originalRenderInitial.call(this)

      const safariStyle = document.createElement('style')

      safariStyle.textContent = safariCarouselStyles

      this.shadowRoot.appendChild(safariStyle)
    }
  })

  // ── MediaFigure ────────────────────────────────────────────────────────────
  customElements.whenDefined(TAGS.MEDIA_FIGURE).then(() => {
    const MediaFigureClass = customElements.get(TAGS.MEDIA_FIGURE)

    if (!MediaFigureClass || !MediaFigureClass.prototype) return

    const originalMediaRenderInitial = MediaFigureClass.prototype._renderInitial

    MediaFigureClass.prototype._renderInitial = function () {
      originalMediaRenderInitial.call(this)

      const safariStyle = document.createElement('style')

      safariStyle.textContent = safariMediaStyles

      this.shadowRoot.appendChild(safariStyle)
    }

    MediaFigureClass.prototype.loadHighRes = function () {
      if (this.isLoaded) return

      const height = this.mediaHeight || 0

      const width = this.mediaWidth || 0

      if (height > 4096 || width > 4096) {
        return
      }

      const storage = store.getters.getStorage()

      const targetUrl = storage + this.mediaSrc + MEDIA.MOZ + MEDIA.Q50 + MEDIA.EXT

      this.highResSrc = targetUrl

      const highEl = this.$(`.${CLASSES.RENDER_MEDIA_HIGH}`)

      if (highEl) {
        highEl.src = targetUrl

        const onFinish = () => {
          this.isLoaded = true

          highEl.classList.add(CLASSES.RENDER_MEDIA_LOADED)

          const thumbEl = this.$(`.${CLASSES.RENDER_MEDIA_THUMB}`)

          if (thumbEl) {
            thumbEl.style.display = ATTRS.NONE
          }
        }

        if (highEl.complete && highEl.naturalWidth > 0) {
          onFinish()
        } else {
          highEl.onload = () => {
            onFinish()
          }

          highEl.onerror = () => {
            this.isLoaded = true
          }
        }
      } else if (this._isMounted) {
        this.isLoaded = true

        this._updateDom()
      }
    }

    const originalMediaOnMounted = MediaFigureClass.prototype.onMounted

    MediaFigureClass.prototype.onMounted = function () {
      originalMediaOnMounted.call(this)

      this.style.willChange = ATTRS.EMPTY

      this.style.transform = ATTRS.EMPTY

      this.style.backfaceVisibility = ATTRS.EMPTY

      const isHero =
        (this.classes && this.classes.includes(CLASSES.INTERNAL_MAIN_ITEM)) ||
        this.classList.contains(CLASSES.INTERNAL_MAIN_ITEM) ||
        this.hasAttribute(ATTRS.AUTO_PLAY) ||
        this.autoPlay

      const thumb = this.$(`.${CLASSES.RENDER_MEDIA_THUMB}`)

      if (thumb && !isHero) {
        thumb.setAttribute('loading', ATTRS.LOADING_LAZY)
      }

      const fig = this.$(TAGS.FIGURE)

      const vid = this.$(TAGS.VIDEO)

      if (this.isVideo && vid) {
        vid.defaultMuted = true

        vid.muted = true

        vid.setAttribute('muted', ATTRS.EMPTY)

        vid.setAttribute('playsinline', ATTRS.EMPTY)

        vid.setAttribute('webkit-playsinline', ATTRS.EMPTY)

        vid.setAttribute('autoplay', ATTRS.EMPTY)

        vid.autoplay = true

        const isMobileSafari =
          typeof window !== STRINGS.UNDEFINED &&
          (window.innerWidth <= 960 || /iPhone|iPad|iPod/i.test(navigator.userAgent))

        if (isMobileSafari && this.video && this.video.length >= 2) {
          const scaledSrc = this.video[1]

          if (scaledSrc) {
            const srcEl = vid.querySelector(ATTRS.SOURCE)

            if (srcEl && srcEl.src !== scaledSrc) {
              srcEl.src = scaledSrc
            }
          }
        }

        const startPlay = () => {
          if (store.getters.getReducedMotion() || !store.getters.getVideoAutoplay()) return

          vid.defaultMuted = true

          vid.muted = true

          vid.setAttribute('autoplay', ATTRS.EMPTY)

          vid.autoplay = true

          const doPlay = () => {
            if (store.getters.getReducedMotion() || !store.getters.getVideoAutoplay()) return

            const p = vid.play()

            if (p && typeof p.catch === STRINGS.FUNCTION) {
              p.catch(() => {
                const onFirstTouch = () => {
                  if (store.getters.getVideoAutoplay()) {
                    vid.play().catch(() => {})
                  }
                }

                window.addEventListener(EVENTS.TOUCHSTART, onFirstTouch, { once: true, passive: true })
              })
            }
          }

          if (vid.readyState >= 2) {
            doPlay()
          } else {
            const onCanPlay = () => {
              vid.removeEventListener('canplay', onCanPlay)

              doPlay()
            }

            vid.addEventListener('canplay', onCanPlay, { once: true })

            if (vid.readyState === 0) {
              vid.load()
            }
          }
        }

        if (isHero) {
          startPlay()
        }

        if (this.observer) {
          this.observer.disconnect()

          this.observer = null
        }

        if (typeof IntersectionObserver !== STRINGS.UNDEFINED) {
          this.observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                this.isIntersecting = entry.isIntersecting

                if (entry.isIntersecting) {
                  if (vid.paused) {
                    startPlay()
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

          this.observer.observe(fig || vid)
        }
      }

      if (this.canExpand) {
        let touchMoved = false

        let startX = 0

        let startY = 0

        const onTouchStart = (e) => {
          touchMoved = false

          if (e.touches && e.touches[0]) {
            startX = e.touches[0].clientX

            startY = e.touches[0].clientY
          }
        }

        const onTouchMove = (e) => {
          if (touchMoved) return

          if (e.touches && e.touches[0]) {
            const dx = Math.abs(e.touches[0].clientX - startX)

            const dy = Math.abs(e.touches[0].clientY - startY)

            if (dx > 10 || dy > 10) {
              touchMoved = true
            }
          }
        }

        const onTouchEnd = (e) => {
          if (!touchMoved) {
            if (e.cancelable) e.preventDefault()

            e.stopPropagation()

            this.openModal()
          }
        }

        const targets = [fig, this.$(`.${CLASSES.EXPAND_MODAL_OPEN_1}`), vid].filter(Boolean)

        targets.forEach((target) => {
          this.addScopedListener(target, EVENTS.TOUCHSTART, onTouchStart, { passive: true })

          this.addScopedListener(target, EVENTS.TOUCHMOVE, onTouchMove, { passive: true })

          this.addScopedListener(target, EVENTS.TOUCHEND, onTouchEnd, { passive: false })

          this.addScopedListener(target, EVENTS.CLICK, (e) => {
            e.stopPropagation()

            this.openModal()
          })
        })
      }

      if (isHero) {
        this.loadHighRes()
      }

      if (!this.isVideo && !this.isLoaded && !isHero) {
        const target = fig || this

        if (target && typeof IntersectionObserver !== STRINGS.UNDEFINED) {
          if (this.imgObserver) {
            this.imgObserver.disconnect()
          }

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
            { rootMargin: ATTRS.ROOT_MARGIN_50, threshold: 0.01 }
          )

          this.imgObserver.observe(target)
        }
      }
    }
  })

  // ── ViewProject (Modal Open/Close in ShadowRoot for Safari) ─────────────────
  customElements.whenDefined(TAGS.VIEW_PROJECT).then(() => {
    const ViewProjectClass = customElements.get(TAGS.VIEW_PROJECT)

    if (!ViewProjectClass || !ViewProjectClass.prototype) return

    ViewProjectClass.prototype._updateModalDOM = function () {
      const modal = store.getters.getModal()

      const above =
        this.$(`dialog.${CLASSES.MODAL_ABOVE}`) ||
        this.$(`.${CLASSES.MODAL_ABOVE}`) ||
        document.querySelector(`dialog.${CLASSES.MODAL_ABOVE}`) ||
        document.querySelector(`.${CLASSES.MODAL_ABOVE}`)

      const below = this.$(`.${CLASSES.MODAL_BELOW}`)

      if (modal?.open) {
        if (below) {
          below.style.transform = `translateY(-${modal.transform || 0}px)`
        }

        if (above) {
          if (!document.body.contains(above)) {
            document.body.appendChild(above)
          }

          above.style.position = 'fixed'

          above.style.inset = '0'

          above.style.top = '0'

          above.style.left = '0'

          above.style.width = '100vw'

          above.style.height = '100vh'

          above.style.height = '100dvh'

          above.style.zIndex = '999999'

          above.style.display = 'block'

          above.style.background = 'var(--bg-dark)'

          above.style.overflowY = 'auto'

          above.style.webkitOverflowScrolling = 'touch'

          above.style.margin = '0'

          above.style.padding = '0'

          above.style.border = ATTRS.NONE

          above.setAttribute('open', ATTRS.EMPTY)

          above.open = true

          const existing = above.querySelector(TAGS.MEDIA_EXPANDED)

          const src = modal.media?.source || ATTRS.EMPTY

          if (!existing || existing.getAttribute(ATTRS.SOURCE) !== src) {
            const expandedEl = document.createElement(TAGS.MEDIA_EXPANDED)

            expandedEl.setAttribute(ATTRS.SOURCE, modal.media?.source || ATTRS.EMPTY)

            expandedEl.setAttribute(ATTRS.THUMB, modal.media?.thumb || ATTRS.EMPTY)

            expandedEl.setAttribute(ATTRS.ALT, modal.media?.alt || ATTRS.EMPTY)

            expandedEl.setAttribute(ATTRS.WIDTH, String(modal.media?.width || MEDIA_DIMENSIONS.DEFAULT_WIDTH))

            expandedEl.setAttribute(ATTRS.HEIGHT, String(modal.media?.height || MEDIA_DIMENSIONS.DEFAULT_HEIGHT))

            expandedEl.setAttribute(ATTRS.IS_VIDEO, modal.media?.isVideo ? ATTRS.TRUE : ATTRS.FALSE)

            above.replaceChildren(expandedEl)
          }
        }
      } else {
        if (below) {
          below.style.transform = ATTRS.EMPTY
        }

        if (above) {
          try {
            if (typeof above.close === STRINGS.FUNCTION && above.open) {
              above.close()
            }
          } catch {}

          above.removeAttribute('open')

          above.open = false

          above.style.display = ATTRS.NONE

          above.replaceChildren()

          if (this.shadowRoot && !this.shadowRoot.contains(above)) {
            this.shadowRoot.appendChild(above)
          }
        }
      }
    }

    const originalProjectDestroy = ViewProjectClass.prototype.onDestroy

    ViewProjectClass.prototype.onDestroy = function () {
      if (typeof originalProjectDestroy === STRINGS.FUNCTION) {
        originalProjectDestroy.call(this)
      }

      const orphaned = document.body.querySelector(`dialog.${CLASSES.MODAL_ABOVE}, .${CLASSES.MODAL_ABOVE}`)

      if (orphaned) {
        orphaned.remove()
      }
    }
  })

  // ── MediaExpanded (Full-res image & touch close for Safari) ─────────────────
  customElements.whenDefined(TAGS.MEDIA_EXPANDED).then(() => {
    const MediaExpandedClass = customElements.get(TAGS.MEDIA_EXPANDED)

    if (!MediaExpandedClass || !MediaExpandedClass.prototype) return

    const originalExpandedMounted = MediaExpandedClass.prototype.onMounted

    MediaExpandedClass.prototype.onMounted = function () {
      originalExpandedMounted.call(this)

      const closeBtns = this.$$(
        `.${CLASSES.EXPAND_MODAL_CLOSE_BAR_BUTTON}, .${CLASSES.EXPAND_MODAL_CLOSE_BOTTOM}, .${CLASSES.EXPAND_MODAL_CLOSE_AREA}`
      )

      closeBtns.forEach((btn) => {
        const handleClose = (e) => {
          if (e && e.type === EVENTS.TOUCHEND) {
            e.preventDefault()

            e.stopPropagation()
          }

          this.startClose()
        }

        this.addScopedListener(btn, EVENTS.CLICK, handleClose)

        this.addScopedListener(btn, EVENTS.TOUCHEND, handleClose, { passive: false })
      })

      if (!this.isVideo && this.source) {
        const imgEl = this.$(`.${CLASSES.EXPAND_MODAL_MEDIA_ITEM}`)

        if (imgEl) {
          imgEl.src = this.source
        }
      } else if (this.isVideo) {
        const vid = this.$(TAGS.VIDEO)

        if (vid) {
          vid.defaultMuted = true

          vid.muted = true

          vid.setAttribute('muted', ATTRS.EMPTY)

          vid.setAttribute('playsinline', ATTRS.EMPTY)

          vid.setAttribute('webkit-playsinline', ATTRS.EMPTY)

          vid.play().catch(() => {})
        }
      }
    }
  })
}
