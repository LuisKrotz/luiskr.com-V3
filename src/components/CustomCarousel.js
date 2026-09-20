import { h, Fragment } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import { CAROUSEL, CLASSES, TAGS, ATTRS } from '../core/constants.js'
import { isSafari } from '../utils/browser.js'
import { calcCarouselRingOffset } from '../utils/wasm-layout.js'
import carouselStyles from '../sass/carousel.scss?inline'
import carouselHostStyles from '../sass/carousel-host.scss?inline'
import internalStyles from '../sass/internals.scss?inline'
import './MediaFigure.js'

// All carousel constants imported from core/constants.js — no duplication.

export class CustomCarousel extends BaseComponent {
  constructor() {
    // All styles come from SCSS files — no JS-injected style strings.
    super(`${carouselStyles}\n${internalStyles}\n${carouselHostStyles}`)
    this._items = []
    this._folder = ''
    this.forceActive = false
    this.currentIndex = 0
    this.autoplayRunning = false
    this.autoplayStart = null
    this.autoplayElapsed = 0
    this.ringProgress = 0
    this.rafId = null
    this.scrollTimeout = null
    this.teleportTimer = null
    this.isNavigating = false
    this.touchStartX = 0
    this.slideLoaded = []
    this.circumference = CAROUSEL.CIRCUMFERENCE
    this.isFullyVisible = false
    this.isEnteredViewport = false
    this.observer = null
    // Dynamic fit detection: true when all items fit side-by-side in the viewport
    this._isSideBySide = false
    this._fitObserver = null
    this.isMobile =
      typeof window !== 'undefined'
        ? window.innerWidth < CAROUSEL.MOBILE_BREAKPOINT
        : false
  }

  set items(val) {
    this._items = Array.isArray(val) ? val : []
    this._markAdjacentLoaded(0)
    if (this._isMounted) {
      this._updateDom()
      this._setupAfterRender()
    }
  }

  get items() {
    return this._items
  }

  set folder(val) {
    this._folder = val || ''
  }

  get folder() {
    return this._folder
  }

  set forceActive(val) {
    this._forceActive = Boolean(val)
    if (this._isMounted) {
      this._updateDom()
      this._setupAfterRender()
    }
  }

  get forceActive() {
    return this._forceActive || false
  }

  get isActive() {
    // Never show carousel UI for a single item.
    if (this._forceActive) return this.items.length > 1

    // Never show carousel UI when all items fit side-by-side in the viewport.
    return this.items.length > 1 && !this._isSideBySide
  }

  onMounted() {
    if (this.items && this.items.length) {
      this._updateDom()
    }
    this._markAdjacentLoaded(0)
    this._setupAfterRender()
    this.addScopedListener(window, 'resize', () => {
      this.isMobile = window.innerWidth < CAROUSEL.MOBILE_BREAKPOINT
    })

    this._startFitObserver()
    this.subscribe(store)
  }

  onUnmounted() {
    if (this._fitObserver) {
      this._fitObserver.disconnect()
      this._fitObserver = null
    }
  }

  onStoreUpdate() {
    const isReduced = store.getters.getReducedMotion()
    const isModal = !!store.getters.getModal()?.open
    if (isReduced || isModal) {
      this._stopAutoplay()
    } else if (this.isActive && this.isFullyVisible) {
      this._startAutoplay()
    }
  }

  _setupAfterRender() {
    if (!this.isActive) return

    this._bindControls()
    requestAnimationFrame(() => {
      this._jumpToSlide(0, false)
      this._setupIntersectionObserver()
      this._setHeightVar()
      // After initial render, check if items fit side-by-side
      this._measureFit()
    })
  }

  // ── Fit Detection ─────────────────────────────────────────────────────────
  // Observes host width. When all items fit without scrolling, we switch to
  // the side-by-side fallback layout (no controls, centered flex row).
  _startFitObserver() {
    if (typeof ResizeObserver === 'undefined') return

    this._fitObserver = new ResizeObserver(() => {
      this._measureFit()
    })

    this._fitObserver.observe(this)
  }

  _measureFit() {
    if (this._forceActive) return

    // Never switch to side-by-side if there are more than 3 items
    if (this.items.length !== 2 && this.items.length !== 3) return

    // On Safari or mobile devices, keep carousel active to prevent layout breakages
    if (isSafari || (typeof window !== 'undefined' && window.innerWidth < CAROUSEL.MOBILE_BREAKPOINT)) return

    const hostW = this.getBoundingClientRect().width

    if (hostW <= 0) return

    let totalW = 0

    if (this._isSideBySide) {
      // Currently in fallback mode — measure direct children of the fallback div
      const fallbackEl = this.$('.carousel-fallback')

      if (!fallbackEl) return

      const children = Array.from(fallbackEl.children)

      totalW = children.reduce((sum, child) => sum + child.getBoundingClientRect().width, 0)
    } else {
      // Currently in carousel mode — measure non-clone slides in the track
      const slides = this.$$('.carousel-slide:not(.carousel-slide--clone)')

      totalW = Array.from(slides).reduce((sum, slide) => sum + slide.getBoundingClientRect().width, 0)
    }

    // 16px tolerance for gaps between items
    const fits = totalW > 0 && totalW <= hostW + 16
    const changed = fits !== this._isSideBySide

    if (changed) {
      this._isSideBySide = fits
      this._updateDom()

      if (!fits) {
        // Re-entering carousel mode — rebind controls and re-setup
        this._setupAfterRender()
      }
    }
  }

  _onResize() {
    this.isMobile = typeof window !== 'undefined' ? window.innerWidth < 960 : false
    this._setHeightVar()
  }

  _setHeightVar() {
    const firstSlide = this.$('.carousel-slide:not(.carousel-slide--clone)')
    if (!firstSlide) return
    const slideH = firstSlide.getBoundingClientRect().height
    if (slideH <= 0) return
    // Cap at 70vh so --carousel-item-height never causes runaway layout heights
    const maxH = typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.7) : slideH
    const section = this.closest('section')
    if (section) {
      section.style.setProperty('--carousel-item-height', `${Math.min(slideH, maxH)}px`)
    }
  }

  _bindControls() {
    const prevBtn = this.$('.carousel-btn--prev')
    const nextBtn = this.$('.carousel-btn--next')
    const track = this.$('.carousel-track')

    if (prevBtn) this.addScopedListener(prevBtn, 'click', () => this.onPrevClick())
    if (nextBtn) this.addScopedListener(nextBtn, 'click', () => this.onNextClick())

    const dots = this.$$('.carousel-dot')
    dots.forEach((dot, idx) => {
      this.addScopedListener(dot, 'click', () => this.onDotClick(idx))
    })

    if (track) {
      this.addScopedListener(track, 'scroll', () => this.onScroll(), { passive: true })
      this.addScopedListener(
        track,
        'touchstart',
        (e) => {
          this.touchStartX = e.touches[0].clientX
        },
        { passive: true }
      )
      this.addScopedListener(
        track,
        'touchend',
        (e) => {
          const delta = e.changedTouches[0].clientX - this.touchStartX
          if (Math.abs(delta) > CAROUSEL.SWIPE_THRESHOLD) {
            this._stopAutoplay()
            if (delta < 0) this.goTo(this.currentIndex + 1)
            else this.goTo(this.currentIndex - 1)
          }
        },
        { passive: true }
      )
    }

    this.addScopedListener(window, 'resize', () => this._onResize(), { passive: true })
  }

  onDestroy() {
    this._stopAutoplay()
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    if (this.teleportTimer) clearTimeout(this.teleportTimer)
  }

  _markAdjacentLoaded(centerIdx) {
    const len = this.items.length
    if (!len) return
    for (let i = 0; i < len; i++) {
      const direct = Math.abs(i - centerIdx)
      const wrapped = len - direct
      if (Math.min(direct, wrapped) <= 2) {
        this.slideLoaded[i] = true
      }
    }
    if (centerIdx === 0) this.slideLoaded[len - 1] = true
    if (centerIdx === len - 1) this.slideLoaded[0] = true
  }

  goTo(idx) {
    const len = this.items.length
    if (!len) return
    const newIndex = ((idx % len) + len) % len
    this.currentIndex = newIndex
    this._markAdjacentLoaded(newIndex)
    this._updateActiveClasses()

    this.isNavigating = true

    const cloneFirst = this.$('.carousel-slide--clone-first')
    const cloneLast = this.$('.carousel-slide--clone-last')

    if (idx >= len && cloneFirst) {
      this._scrollToElement(cloneFirst)
      this._scheduleTeleport(0)
    } else if (idx < 0 && cloneLast) {
      this._scrollToElement(cloneLast)
      this._scheduleTeleport(len - 1)
    } else {
      this._scrollToSlide(newIndex)
      if (this.teleportTimer) clearTimeout(this.teleportTimer)
      this.teleportTimer = setTimeout(() => {
        this.isNavigating = false
      }, 400)
    }
  }

  _updateActiveClasses() {
    const slides = this.$$('.carousel-slide:not(.carousel-slide--clone)')
    slides.forEach((slide, i) => {
      slide.classList.toggle('carousel-slide--active', i === this.currentIndex)
    })

    const dots = this.$$('.carousel-dot')
    dots.forEach((dot, i) => {
      dot.classList.toggle('carousel-dot--active', i === this.currentIndex)
    })

    const counter = this.$('.carousel-counter')
    if (counter) {
      const lang = store.getters.getCarouselLang()
      counter.textContent = `${this.currentIndex + 1} ${lang.ofLabel} ${this.items.length}`
    }
  }

  _scrollToElement(el) {
    const track = this.$('.carousel-track')
    if (!track || !el) return
    const trackRect = track.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const left =
      track.scrollLeft + elRect.left - trackRect.left - (trackRect.width - elRect.width) / 2
    track.scrollTo({ left, behavior: 'smooth' })
  }

  _scheduleTeleport(targetIdx) {
    if (this.teleportTimer) clearTimeout(this.teleportTimer)
    this.teleportTimer = setTimeout(() => {
      this._jumpToSlide(targetIdx, false)
      this.isNavigating = false
      this.teleportTimer = null
    }, CAROUSEL.TELEPORT_DELAY)
  }

  _scrollToSlide(idx) {
    const track = this.$('.carousel-track')
    const slide = track?.children[idx + 1]
    if (!slide || !track) return
    const trackRect = track.getBoundingClientRect()
    const slideRect = slide.getBoundingClientRect()
    if (!trackRect.width || !slideRect.width) return
    const scrollLeft =
      track.scrollLeft + slideRect.left - trackRect.left - (trackRect.width - slideRect.width) / 2
    track.scrollTo({ left: scrollLeft, behavior: 'smooth' })
  }

  _jumpToSlide(idx, smooth = false) {
    const track = this.$('.carousel-track')
    const slide = track?.children[idx + 1]
    if (!slide || !track) return
    const trackRect = track.getBoundingClientRect()
    const slideRect = slide.getBoundingClientRect()
    if (!trackRect.width || !slideRect.width) {
      requestAnimationFrame(() => this._jumpToSlide(idx, smooth))
      return
    }
    const scrollLeft =
      track.scrollLeft + slideRect.left - trackRect.left - (trackRect.width - slideRect.width) / 2
    track.scrollTo({ left: scrollLeft, behavior: smooth ? 'smooth' : 'instant' })
  }

  onScroll() {
    if (this.isNavigating) return
    clearTimeout(this.scrollTimeout)
    this.scrollTimeout = setTimeout(() => {
      this._checkInfiniteLoop()
    }, 150)
  }

  _checkInfiniteLoop() {
    if (this.isNavigating) return
    const track = this.$('.carousel-track')
    const cloneLast = this.$('.carousel-slide--clone-last')
    const cloneFirst = this.$('.carousel-slide--clone-first')
    if (!track || !cloneLast || !cloneFirst) return

    const trackRect = track.getBoundingClientRect()
    const cloneLastRect = cloneLast.getBoundingClientRect()
    const cloneFirstRect = cloneFirst.getBoundingClientRect()
    const center = trackRect.left + trackRect.width / 2

    if (Math.abs(cloneLastRect.left + cloneLastRect.width / 2 - center) < 10) {
      this.currentIndex = this.items.length - 1
      this._jumpToSlide(this.currentIndex)
      this._updateActiveClasses()
    } else if (Math.abs(cloneFirstRect.left + cloneFirstRect.width / 2 - center) < 10) {
      this.currentIndex = 0
      this._jumpToSlide(this.currentIndex)
      this._updateActiveClasses()
    }
  }

  onPrevClick() {
    this._stopAutoplay()
    this.goTo(this.currentIndex - 1)
  }

  onNextClick() {
    this._stopAutoplay()
    this.goTo(this.currentIndex + 1)
  }

  onDotClick(idx) {
    this._stopAutoplay()
    this.goTo(idx)
  }

  _setupIntersectionObserver() {
    const root = this.$('.carousel')
    if (!root) return

    if (typeof IntersectionObserver === 'undefined') {
      root.classList.add('carousel--in-view')
      this.isEnteredViewport = true
      this.isFullyVisible = true
      if (!store.getters.getReducedMotion()) this._startAutoplay()
      return
    }

    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.isEnteredViewport = true
            root.classList.add('carousel--in-view')
          }
          const isFullyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.6
          this.isFullyVisible = isFullyVisible

          if (isFullyVisible) {
            if (!store.getters.getReducedMotion() && !store.getters.getModal()?.open) {
              this._startAutoplay()
            }
          } else {
            this._stopAutoplay()
          }
        })
      },
      { threshold: [0, 0.6, 1.0] }
    )
    this.observer.observe(this)
  }

  _startAutoplay() {
    if (store.getters.getReducedMotion() || !this.isFullyVisible) {
      this._stopAutoplay()
      return
    }
    this.autoplayRunning = true
    this.autoplayStart = performance.now()
    this.autoplayElapsed = 0
    this._tickRing()
  }

  _stopAutoplay() {
    this.autoplayRunning = false
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = null
    this.ringProgress = 0
    this._updateRing()
  }

  _tickRing() {
    if (!this.autoplayRunning) return
    const now = performance.now()
    const elapsed = now - this.autoplayStart + this.autoplayElapsed
    // WASM-accelerated ring fill calculation
    this.ringProgress = Math.min(
      calcCarouselRingOffset(elapsed, CAROUSEL.AUTOPLAY_DURATION, 1),
      1
    )
    this._updateRing()

    if (elapsed >= CAROUSEL.AUTOPLAY_DURATION) {
      this.goTo(this.currentIndex + 1)
      this.autoplayElapsed = 0
      this.autoplayStart = performance.now()
      this.ringProgress = 0
      this._updateRing()
    }

    this.rafId = requestAnimationFrame(() => this._tickRing())
  }

  _updateRing() {
    const fills = this.$$('.carousel-btn-ring-fill')
    const offset = this.circumference * (1 - this.ringProgress)
    fills.forEach((fill) => {
      fill.style.strokeDashoffset = `${offset}`
    })
  }

  renderSlide(item) {
    if (!item) return null
    const folder = this.folder || ''
    const src = folder + item.src
    const itemW = item.size ? item.size[0] : 800
    const itemH = item.size ? item.size[1] : 450
    const canExpand = item.canExpand ?? false
    const isVideo = item.isVideo ?? false
    const label = item.label || ''
    const itemClass = item.class || ''
    const MediaFigure = TAGS.MEDIA_FIGURE
    const extraClass = `${CLASSES.INTERNAL_EXTRA_ITEM} ${itemClass}`.trim()

    return (
      <div className={extraClass}>
        <MediaFigure
          src={src}
          width={itemW}
          height={itemH}
          can-expand={canExpand}
          is-video={isVideo}
          label={label}
          classes={extraClass}
          class={extraClass}
        />
      </div>
    )
  }

  render() {
    if (!this.isActive) {
      // Use the side-by-side modifier when items fit the viewport (2+ items)
      const fallbackClass = this._isSideBySide ? CLASSES.CAROUSEL_FALLBACK_SIDE : CLASSES.CAROUSEL_FALLBACK

      return (
        <div className={fallbackClass}>
          {this.items.map((item) => this.renderSlide(item))}
        </div>
      )
    }

    const lastItem = this.items[this.items.length - 1]
    const firstItem = this.items[0]

    return (
      <div className={`${CLASSES.CAROUSEL} ${this.isEnteredViewport ? 'carousel--in-view' : ''}`}>
        <div className={CLASSES.CAROUSEL_TRACK}>
          <div className={`${CLASSES.CAROUSEL_SLIDE} ${CLASSES.CAROUSEL_SLIDE_CLONE_LAST}`} aria-hidden="true" inert>
            {this.renderSlide(lastItem)}
          </div>
          {this.items.map((item, idx) => (
            <div
              key={idx}
              className={`${CLASSES.CAROUSEL_SLIDE} ${this.currentIndex === idx ? CLASSES.CAROUSEL_SLIDE_ACTIVE : ''}`}
              role="group"
              aria-label={`${idx + 1} of ${this.items.length}`}
            >
              {this.renderSlide(item)}
            </div>
          ))}
          <div className={`${CLASSES.CAROUSEL_SLIDE} ${CLASSES.CAROUSEL_SLIDE_CLONE_FIRST}`} aria-hidden="true" inert>
            {this.renderSlide(firstItem)}
          </div>
        </div>

        <div className={CLASSES.CAROUSEL_CONTROLS}>
          {(() => {
            const lang = store.getters.getCarouselLang()
            return (
              <>
                <button className={CLASSES.CAROUSEL_BTN_PREV} aria-label={lang.prev} type="button">
                  <svg className={CLASSES.CAROUSEL_BTN_RING} viewBox="0 0 44 44" aria-hidden="true">
                    <circle className={CLASSES.CAROUSEL_BTN_RING_TRACK} cx="22" cy="22" r="19" />
                    <circle
                      className={CLASSES.CAROUSEL_BTN_RING_FILL}
                      cx="22"
                      cy="22"
                      r="19"
                      style={{
                        strokeDasharray: `${this.circumference}`,
                        strokeDashoffset: `${this.circumference}`,
                      }}
                    />
                  </svg>
                  <span className={CLASSES.CAROUSEL_BTN_ARROW} aria-hidden="true">&#8592;</span>
                </button>

                <div className={CLASSES.CAROUSEL_INDICATORS}>
                  <span className={CLASSES.CAROUSEL_COUNTER}>{this.currentIndex + 1} {lang.ofLabel} {this.items.length}</span>
                  <div className={CLASSES.CAROUSEL_DOTS}>
                    {this.items.map((_, idx) => (
                      <button
                        key={idx}
                        className={`${CLASSES.CAROUSEL_DOT} ${this.currentIndex === idx ? CLASSES.CAROUSEL_DOT_ACTIVE : ''}`}
                        aria-label={`${idx + 1} ${lang.ofLabel} ${this.items.length}`}
                        type="button"
                      />
                    ))}
                  </div>
                </div>

                <button className={CLASSES.CAROUSEL_BTN_NEXT} aria-label={lang.next} type="button">
                  <svg className={CLASSES.CAROUSEL_BTN_RING} viewBox="0 0 44 44" aria-hidden="true">
                    <circle className={CLASSES.CAROUSEL_BTN_RING_TRACK} cx="22" cy="22" r="19" />
                    <circle
                      className={CLASSES.CAROUSEL_BTN_RING_FILL}
                      cx="22"
                      cy="22"
                      r="19"
                      style={{
                        strokeDasharray: `${this.circumference}`,
                        strokeDashoffset: `${this.circumference}`,
                      }}
                    />
                  </svg>
                  <span className={CLASSES.CAROUSEL_BTN_ARROW} aria-hidden="true">&#8594;</span>
                </button>
              </>
            )
          })()}
        </div>
      </div>
    )
  }
}

if (!customElements.get(TAGS.CUSTOM_CAROUSEL)) {
  customElements.define(TAGS.CUSTOM_CAROUSEL, CustomCarousel)
}

