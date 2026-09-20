import { TAGS, CLASSES, MEDIA, ATTRS } from './core/constants.js'
import store from './core/store.js'
import { gpuAccel } from './utils/gpu-accel.js'
import { wasmPool } from './utils/wasm-pool.js'
import safariCarouselStyles from './sass/safari-carousel.scss?inline'
import safariMediaStyles from './sass/safari-media.scss?inline'

// ── 1. Mark HTML element with Safari class ────────────────────────────────────
if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.classList.add(CLASSES.IS_SAFARI)
}

// ── 2. Disable GPU compositor layer bloat & WebGL textures on Safari/iOS ───────
// On iOS Safari, forcing will-change: transform/opacity and translate3d on 100+
// elements exhausts GPU backing store memory and crashes the WebKit process
// ("A problem repeatedly occurred on this webpage"). Native iOS rendering is
// already hardware accelerated.
gpuAccel.accelerateElementGPU = function () {}

gpuAccel.processTextureGPU = function () {}

gpuAccel.processImageGPU = function () {}

gpuAccel.processBitmapGPU = function () {}

gpuAccel.processVideoGPU = function () {}

// ── 3. Bypass WASM worker pool on Safari/iOS ──────────────────────────────────
// Prevents worker thread memory spikes and createImageBitmap / DataCloneError
// in Safari (especially in Private Browsing mode).
wasmPool.dispatch = function () {
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

    const originalGoTo = CustomCarouselClass.prototype.goTo

    CustomCarouselClass.prototype.goTo = function (idx) {
      originalGoTo.call(this, idx)

      const activeSlide = this.$(`.${CLASSES.CAROUSEL_SLIDE_ACTIVE}`)

      if (activeSlide) {
        const mf = activeSlide.querySelector(TAGS.MEDIA_FIGURE)

        if (mf && typeof mf.loadHighRes === 'function') {
          mf.loadHighRes()
        }

        const prevSlide = activeSlide.previousElementSibling
        const nextSlide = activeSlide.nextElementSibling

        if (prevSlide) {
          const prevMf = prevSlide.querySelector(TAGS.MEDIA_FIGURE)

          if (prevMf && typeof prevMf.loadHighRes === 'function') {
            prevMf.loadHighRes()
          }
        }

        if (nextSlide) {
          const nextMf = nextSlide.querySelector(TAGS.MEDIA_FIGURE)

          if (nextMf && typeof nextMf.loadHighRes === 'function') {
            nextMf.loadHighRes()
          }
        }
      }
    }

    const originalSetupAfterRender = CustomCarouselClass.prototype._setupAfterRender

    CustomCarouselClass.prototype._setupAfterRender = function () {
      originalSetupAfterRender.call(this)

      const firstSlide = this.$(`.${CLASSES.CAROUSEL_SLIDE_ACTIVE}`) || this.$(`.${CLASSES.CAROUSEL_SLIDE}`)

      if (firstSlide) {
        const mf = firstSlide.querySelector(TAGS.MEDIA_FIGURE)

        if (mf && typeof mf.loadHighRes === 'function') {
          mf.loadHighRes()
        }
      }
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

    // Native progressive loading for iOS/Safari:
    // Bypasses worker threads and IndexedDB cache (which fails in Private Browsing),
    // and uses standard native Image loading for 100% reliability and zero crash risk.
    MediaFigureClass.prototype.loadHighRes = function () {
      if (this.isLoaded) return

      const storage = store.getters.getStorage()
      const targetUrl = storage + this.mediaSrc + MEDIA.MOZ + MEDIA.Q50 + MEDIA.EXT

      const finish = () => {
        this.highResSrc = targetUrl
        this.isLoaded = true

        const highEl = this.$(`.${CLASSES.RENDER_MEDIA_HIGH}`)

        if (highEl) {
          highEl.src = targetUrl
          highEl.classList.add(CLASSES.RENDER_MEDIA_LOADED)
        } else if (this._isMounted) {
          this._updateDom()
        }
      }

      const ImageClass = typeof window !== 'undefined' && window.Image ? window.Image : Image
      const img = new ImageClass()

      img.decoding = ATTRS.DECODING_ASYNC
      img.src = targetUrl

      if (img.complete) {
        finish()
      } else {
        img.onload = () => finish()
        img.onerror = () => finish()
      }
    }

    const originalMediaOnMounted = MediaFigureClass.prototype.onMounted

    MediaFigureClass.prototype.onMounted = function () {
      originalMediaOnMounted.call(this)

      // Ensure no GPU layer bloat was set
      this.style.willChange = ''
      this.style.transform = ''
      this.style.backfaceVisibility = ''

      // If hero cover item, load immediately without waiting for observer
      if (this.classes && this.classes.includes(CLASSES.INTERNAL_MAIN_ITEM)) {
        this.loadHighRes()
      }

      // On Safari, observe the figure element which always has definite dimensions
      if (!this.isVideo && !this.isLoaded) {
        const fig = this.$('figure') || this

        if (fig && typeof IntersectionObserver !== 'undefined') {
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
            { rootMargin: '200px 100px', threshold: 0.01 }
          )

          this.imgObserver.observe(fig)
        }
      }
    }
  })
}
