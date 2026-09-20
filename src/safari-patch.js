import { TAGS, CLASSES, MEDIA, ATTRS, MEDIA_DIMENSIONS } from './core/constants.js'
import store from './core/store.js'
import { gpuAccel } from './utils/gpu-accel.js'
import { wasmPool } from './utils/wasm-pool.js'
import { localMediaCache } from './utils/local-media-cache.js'
import { wasmMediaThreads } from './utils/wasm-media-threads.js'
import safariCarouselStyles from './sass/safari-carousel.scss?inline'
import safariMediaStyles from './sass/safari-media.scss?inline'

// ── 1. Mark HTML element with Safari class ────────────────────────────────────
if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.classList.add(CLASSES.IS_SAFARI)
}

// ── 2. Disable GPU compositor layer bloat & WebGL textures on Safari/iOS ───────
// On iOS Safari, forcing will-change: transform/opacity and translate3d on 100+
// elements exhausts GPU backing store memory and crashes the WebKit process
// ("A problem repeatedly occurred on this webpage").
gpuAccel.accelerateElementGPU = function () {}

gpuAccel.processTextureGPU = function () {}

gpuAccel.processImageGPU = function () {}

gpuAccel.processBitmapGPU = function () {}

gpuAccel.processVideoGPU = function () {}

// ── 3. Bypass WASM worker pool & memory-heavy caches on Safari/iOS ─────────────
// Prevents worker thread memory spikes and createImageBitmap / DataCloneError
// in Safari (especially in Private Browsing mode).
wasmPool.dispatch = function () {
  return Promise.resolve(null)
}

localMediaCache.fetchOrGetLocalMedia = function (url) {
  return Promise.resolve(url)
}

localMediaCache.getLocalMedia = function () {
  return Promise.resolve(null)
}

localMediaCache.storeLocalMedia = function (url) {
  return Promise.resolve(url)
}

wasmMediaThreads.decodeMediaInSeparateThread = function () {
  return Promise.resolve(null)
}

// ── 4. Retroactive cleanup of any existing DOM elements ───────────────────────
if (typeof document !== 'undefined') {
  const existingFigures = document.querySelectorAll(TAGS.MEDIA_FIGURE)

  existingFigures.forEach((mf) => {
    mf.style.willChange = ''
    mf.style.transform = ''
    mf.style.backfaceVisibility = ''
  })
}

// ── 5. Component Patches ──────────────────────────────────────────────────────
if (typeof customElements !== 'undefined') {
  // ── CustomCarousel ─────────────────────────────────────────────────────────
  customElements.whenDefined(TAGS.CUSTOM_CAROUSEL).then(() => {
    const CustomCarouselClass = customElements.get(TAGS.CUSTOM_CAROUSEL)

    if (!CustomCarouselClass || !CustomCarouselClass.prototype) return

    CustomCarouselClass.prototype._measureFit = function () {
      // Disabled on Safari to prevent false-positive side-by-side collapse
    }

    const originalRenderInitial = CustomCarouselClass.prototype._renderInitial

    CustomCarouselClass.prototype._renderInitial = function () {
      originalRenderInitial.call(this)

      const safariStyle = document.createElement('style')

      safariStyle.textContent = safariCarouselStyles

      this.shadowRoot.appendChild(safariStyle)
    }

    // No forced high-res loading in CustomCarousel — viewport IntersectionObserver manages loading
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

    // Native progressive loading for iOS/Safari:
    // Streams image directly into the DOM high-res image element so Safari's
    // progressive JPEG decoder renders as chunks arrive.
    MediaFigureClass.prototype.loadHighRes = function () {
      if (this.isLoaded) return

      const height = this.mediaHeight || 0

      const width = this.mediaWidth || 0

      // Protection against massive full-page images (>4096px) on iOS to prevent WebKit memory exhaustion
      if (height > 4096 || width > 4096) {
        return
      }

      const storage = store.getters.getStorage()

      const targetUrl = storage + this.mediaSrc + MEDIA.MOZ + MEDIA.Q50 + MEDIA.EXT

      this.highResSrc = targetUrl

      const highEl = this.$(`.${CLASSES.RENDER_MEDIA_HIGH}`)

      if (highEl) {
        highEl.src = targetUrl

        highEl.classList.add(CLASSES.RENDER_MEDIA_LOADED)

        if (highEl.complete) {
          this.isLoaded = true
        } else {
          highEl.onload = () => {
            this.isLoaded = true
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

      // Ensure no GPU layer bloat was set
      this.style.willChange = ''

      this.style.transform = ''

      this.style.backfaceVisibility = ''

      const isHero = this.classes && this.classes.includes(CLASSES.INTERNAL_MAIN_ITEM)

      const thumb = this.$(`.${CLASSES.RENDER_MEDIA_THUMB}`)

      if (thumb && !isHero) {
        thumb.setAttribute('loading', ATTRS.LOADING_LAZY)
      }

      const fig = this.$('figure')

      const vid = this.$('video')

      // Video autoplay and loading optimization on iOS Safari
      if (this.isVideo && vid) {
        vid.defaultMuted = true

        vid.muted = true

        vid.setAttribute('muted', '')

        vid.setAttribute('playsinline', '')

        vid.setAttribute('webkit-playsinline', '')

        const isMobileSafari =
          typeof window !== 'undefined' &&
          (window.innerWidth <= 960 || /iPhone|iPad|iPod/i.test(navigator.userAgent))

        if (isMobileSafari && this.video && this.video.length >= 2) {
          const scaledSrc = this.video[1]

          if (scaledSrc) {
            const srcEl = vid.querySelector('source')

            if (srcEl && srcEl.src !== scaledSrc) {
              srcEl.src = scaledSrc
            }
          }
        }

        const startPlay = () => {
          if (store.getters.getReducedMotion()) return

          vid.defaultMuted = true

          vid.muted = true

          if (vid.readyState === 0) {
            vid.load()
          }

          const p = vid.play()

          if (p && typeof p.catch === 'function') {
            p.catch(() => {
              const onFirstTouch = () => {
                vid.play().catch(() => {})
              }

              window.addEventListener('touchstart', onFirstTouch, { once: true, passive: true })
            })
          }
        }

        if (isHero) {
          startPlay()
        }

        if (typeof IntersectionObserver !== 'undefined') {
          const vidObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  startPlay()
                } else {
                  vid.pause()
                }
              })
            },
            { threshold: 0.1 }
          )

          vidObserver.observe(fig || vid)
        }
      }

      // Immediate touch response for tap-to-open over figures and videos
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
          this.addScopedListener(target, 'touchstart', onTouchStart, { passive: true })

          this.addScopedListener(target, 'touchmove', onTouchMove, { passive: true })

          this.addScopedListener(target, 'touchend', onTouchEnd, { passive: false })

          this.addScopedListener(target, 'click', (e) => {
            e.stopPropagation()

            this.openModal()
          })
        })
      }

      // If hero cover item, load high-res immediately
      if (isHero) {
        this.loadHighRes()
      }

      // On Safari, observe figure strictly with narrow margin so offscreen images never load high-res
      if (!this.isVideo && !this.isLoaded && !isHero) {
        const target = fig || this

        if (target && typeof IntersectionObserver !== 'undefined') {
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
            { rootMargin: '50px 0px', threshold: 0.01 }
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

          above.style.border = 'none'

          above.setAttribute('open', '')

          above.open = true

          const existing = above.querySelector(TAGS.MEDIA_EXPANDED)

          const src = modal.media?.source || ''

          if (!existing || existing.getAttribute('source') !== src) {
            const expandedEl = document.createElement(TAGS.MEDIA_EXPANDED)

            expandedEl.setAttribute('source', modal.media?.source || '')

            expandedEl.setAttribute('thumb', modal.media?.thumb || '')

            expandedEl.setAttribute('alt', modal.media?.alt || '')

            expandedEl.setAttribute('width', String(modal.media?.width || MEDIA_DIMENSIONS.DEFAULT_WIDTH))

            expandedEl.setAttribute('height', String(modal.media?.height || MEDIA_DIMENSIONS.DEFAULT_HEIGHT))

            expandedEl.setAttribute('is-video', modal.media?.isVideo ? ATTRS.TRUE : ATTRS.FALSE)

            above.replaceChildren(expandedEl)
          }
        }
      } else {
        if (below) {
          below.style.transform = ''
        }

        if (above) {
          try {
            if (typeof above.close === 'function' && above.open) {
              above.close()
            }
          } catch {}

          above.removeAttribute('open')

          above.open = false

          above.style.display = 'none'

          above.replaceChildren()

          if (this.shadowRoot && !this.shadowRoot.contains(above)) {
            this.shadowRoot.appendChild(above)
          }
        }
      }
    }

    const originalProjectDestroy = ViewProjectClass.prototype.onDestroy

    ViewProjectClass.prototype.onDestroy = function () {
      if (typeof originalProjectDestroy === 'function') {
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
          if (e && e.type === 'touchend') {
            e.preventDefault()

            e.stopPropagation()
          }

          this.startClose()
        }

        this.addScopedListener(btn, 'click', handleClose)

        this.addScopedListener(btn, 'touchend', handleClose, { passive: false })
      })

      if (!this.isVideo && this.source) {
        const imgEl = this.$(`.${CLASSES.EXPAND_MODAL_MEDIA_ITEM}`)

        if (imgEl) {
          imgEl.src = this.source
        }
      } else if (this.isVideo) {
        const vid = this.$('video')

        if (vid) {
          vid.defaultMuted = true

          vid.muted = true

          vid.setAttribute('muted', '')

          vid.setAttribute('playsinline', '')

          vid.setAttribute('webkit-playsinline', '')

          vid.play().catch(() => {})
        }
      }
    }
  })
}
