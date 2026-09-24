import { h, Fragment } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import { CAROUSEL, CLASSES, SELECTORS, TAGS, ATTRS, EVENTS, STRINGS, CSS_PROPS } from '../core/constants.js'
import { calcCarouselRingOffset } from '../utils/wasm-layout.js'
import carouselStyles from '../sass/carousel.scss?inline'
import carouselHostStyles from '../sass/carousel-host.scss?inline'
import internalStyles from '../sass/internals.scss?inline'
import './MediaFigure.js'

// ─── ES6 Calculation Helpers ────────────────────────────────────────────────
const calcSlideCenterOffset = (track, slide) => {
  const trackRect = track.getBoundingClientRect()

  const slideRect = slide.getBoundingClientRect()

  if (!trackRect.width || !slideRect.width) return null

  return track.scrollLeft + slideRect.left - trackRect.left - (trackRect.width - slideRect.width) / 2
}

const isNearCenter = (childRect, center) =>
  Math.abs(childRect.left + childRect.width / 2 - center) < 10

export class CustomCarousel extends BaseComponent {
  constructor() {
    super(`${carouselStyles}\n${internalStyles}\n${carouselHostStyles}`)

    this._items = []

    this._folder = ATTRS.EMPTY

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

    this._isSideBySide = false

    this._fitObserver = null

    this.isMobile =
      typeof window !== STRINGS.UNDEFINED
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
    this._folder = val || ATTRS.EMPTY
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
    if (this._forceActive) return this.items.length > 1

    return this.items.length > 1 && !this._isSideBySide
  }

  onMounted() {
    if (this.items && this.items.length) {
      this._updateDom()
    }

    this._markAdjacentLoaded(0)

    this._setupAfterRender()

    this.addScopedListener(window, EVENTS.RESIZE, () => {
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

    const isModal = Boolean(store.getters.getModal()?.open)

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

      requestAnimationFrame(() => {
        this._measureFit()
      })
    })
  }

  _startFitObserver() {
    if (typeof ResizeObserver === STRINGS.UNDEFINED) return

    this._fitObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width || 0

      if (Math.abs(width - (this._lastObservedWidth || 0)) < 4) return

      this._lastObservedWidth = width

      requestAnimationFrame(() => {
        this._measureFit(width)
      })
    })

    this._fitObserver.observe(this)
  }

  _measureFit(observedWidth) {
    if (this._forceActive) return

    if (this.items.length < 2) return

    // Groups with more than 2 items or containing any landscape items cannot fit side-by-side.
    if (this.items.length > 2 || this.items.some((i) => i?.class === 'landscape')) {
      if (this._isSideBySide) {
        this._isSideBySide = false

        this._updateDom()

        this._setupAfterRender()
      }

      return
    }

    if (typeof window !== STRINGS.UNDEFINED && window.innerWidth < 960) {
      if (this._isSideBySide) {
        this._isSideBySide = false

        this._updateDom()
      }

      return
    }

    const hostW = observedWidth || this.clientWidth || 0

    if (hostW <= 0) return

    const maxH = typeof window !== STRINGS.UNDEFINED ? Math.round(window.innerHeight * 0.7) : 600

    let totalW = 0

    for (const item of this.items) {
      const w = item.size?.[0] || 800

      const h = item.size?.[1] || 1200

      const ratio = w / h

      totalW += ratio * maxH + 32
    }

    const fits = totalW > 0 && totalW <= hostW

    const changed = fits !== this._isSideBySide

    if (changed) {
      this._isSideBySide = fits

      this._updateDom()

      if (!fits) {
        this._setupAfterRender()
      }
    }
  }

  _onResize() {
    this.isMobile = typeof window !== STRINGS.UNDEFINED ? window.innerWidth < 960 : false

    this._setHeightVar()
  }

  _setHeightVar() {
    const firstSlide = this.$(SELECTORS.CAROUSEL_SLIDES_NOT_CLONE)

    if (!firstSlide) return

    const firstItem = this.items?.[0]

    let slideH = 0

    if (firstItem?.size?.[0] && firstItem?.size?.[1]) {
      const hostW = this.clientWidth || (typeof window !== STRINGS.UNDEFINED ? window.innerWidth : 800)

      slideH = Math.round((firstItem.size[1] / firstItem.size[0]) * hostW)
    } else {
      slideH = firstSlide.clientHeight || 0
    }

    if (slideH <= 0) return

    const maxH = typeof window !== STRINGS.UNDEFINED ? Math.round(window.innerHeight * 0.7) : slideH

    const section = this.closest(ATTRS.SECTION)

    if (section) {
      const currentH = section.style.getPropertyValue(CSS_PROPS.CAROUSEL_ITEM_HEIGHT)

      const nextH = `${Math.min(slideH, maxH)}${ATTRS.PX}`

      if (currentH !== nextH) {
        section.style.setProperty(CSS_PROPS.CAROUSEL_ITEM_HEIGHT, nextH)
      }
    }
  }

  _bindControls() {
    const prevBtn = this.$(SELECTORS.CAROUSEL_BTN_PREV)

    const nextBtn = this.$(SELECTORS.CAROUSEL_BTN_NEXT)

    const track = this.$(SELECTORS.CAROUSEL_TRACK)

    if (prevBtn) this.addScopedListener(prevBtn, EVENTS.CLICK, () => this.onPrevClick())

    if (nextBtn) this.addScopedListener(nextBtn, EVENTS.CLICK, () => this.onNextClick())

    const dots = this.$$(SELECTORS.CAROUSEL_DOT)

    dots.forEach((dot, idx) => {
      this.addScopedListener(dot, EVENTS.CLICK, () => this.onDotClick(idx))
    })

    if (track) {
      this.addScopedListener(track, EVENTS.SCROLL, () => this.onScroll(), { passive: true })

      this.addScopedListener(
        track,
        EVENTS.TOUCHSTART,
        (e) => {
          this.touchStartX = e.touches[0].clientX
        },
        { passive: true }
      )

      this.addScopedListener(
        track,
        EVENTS.TOUCHEND,
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

    this.addScopedListener(window, EVENTS.RESIZE, () => this._onResize(), { passive: true })
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

    const activeFig = this.$$(SELECTORS.CAROUSEL_SLIDES_NOT_CLONE)[newIndex]?.querySelector(TAGS.MEDIA_FIGURE)

    if (activeFig && typeof activeFig.loadHighRes === STRINGS.FUNCTION) {
      activeFig.loadHighRes()
    }

    this.isNavigating = true

    const cloneFirst = this.$(SELECTORS.CAROUSEL_SLIDE_CLONE_FIRST)

    const cloneLast = this.$(SELECTORS.CAROUSEL_SLIDE_CLONE_LAST)

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
    const slides = this.$$(SELECTORS.CAROUSEL_SLIDES_NOT_CLONE)

    slides.forEach((slide, i) => {
      slide.classList.toggle(CLASSES.CAROUSEL_SLIDE_ACTIVE, i === this.currentIndex)
    })

    const dots = this.$$(SELECTORS.CAROUSEL_DOT)

    dots.forEach((dot, i) => {
      dot.classList.toggle(CLASSES.CAROUSEL_DOT_ACTIVE, i === this.currentIndex)
    })

    const counter = this.$(SELECTORS.CAROUSEL_COUNTER)

    if (counter) {
      const lang = store.getters.getCarouselLang()

      counter.textContent = `${this.currentIndex + 1} ${lang.ofLabel} ${this.items.length}`
    }
  }

  _scrollToElement(el) {
    const track = this.$(SELECTORS.CAROUSEL_TRACK)

    if (!track || !el) return

    const scrollLeft = calcSlideCenterOffset(track, el)

    if (scrollLeft !== null) {
      track.scrollTo({ left: scrollLeft, behavior: ATTRS.SMOOTH })
    }
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
    const track = this.$(SELECTORS.CAROUSEL_TRACK)

    const slide = track?.children[idx + 1]

    if (!slide || !track) return

    const scrollLeft = calcSlideCenterOffset(track, slide)

    if (scrollLeft !== null) {
      track.scrollTo({ left: scrollLeft, behavior: ATTRS.SMOOTH })
    }
  }

  _jumpToSlide(idx, smooth = false) {
    const track = this.$(SELECTORS.CAROUSEL_TRACK)

    const slide = track?.children[idx + 1]

    if (!slide || !track) return

    const scrollLeft = calcSlideCenterOffset(track, slide)

    if (scrollLeft === null) {
      requestAnimationFrame(() => this._jumpToSlide(idx, smooth))

      return
    }

    track.scrollTo({ left: scrollLeft, behavior: smooth ? ATTRS.SMOOTH : ATTRS.INSTANT })
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

    const track = this.$(SELECTORS.CAROUSEL_TRACK)

    const cloneLast = this.$(SELECTORS.CAROUSEL_SLIDE_CLONE_LAST)

    const cloneFirst = this.$(SELECTORS.CAROUSEL_SLIDE_CLONE_FIRST)

    if (!track || !cloneLast || !cloneFirst) return

    const trackRect = track.getBoundingClientRect()

    const cloneLastRect = cloneLast.getBoundingClientRect()

    const cloneFirstRect = cloneFirst.getBoundingClientRect()

    const center = trackRect.left + trackRect.width / 2

    if (isNearCenter(cloneLastRect, center)) {
      this.currentIndex = this.items.length - 1

      this._jumpToSlide(this.currentIndex)

      this._updateActiveClasses()
    } else if (isNearCenter(cloneFirstRect, center)) {
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
    const root = this.$(SELECTORS.CAROUSEL)

    if (!root) return

    if (typeof IntersectionObserver === STRINGS.UNDEFINED) {
      root.classList.add(CLASSES.CAROUSEL_IN_VIEW)

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

            root.classList.add(CLASSES.CAROUSEL_IN_VIEW)
          }

          const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.15

          this.isFullyVisible = isVisible

          if (isVisible) {
            if (!store.getters.getReducedMotion() && !store.getters.getModal()?.open) {
              this._startAutoplay()
            }
          } else {
            this._stopAutoplay()
          }
        })
      },
      { threshold: [0, 0.15, 0.5, 1.0] }
    )

    this.observer.observe(root)
  }

  _startAutoplay() {
    if (this.autoplayRunning) return

    this.autoplayRunning = true

    this.autoplayStart = performance.now() - this.autoplayElapsed

    this.rafId = requestAnimationFrame((ts) => this._tick(ts))
  }

  _stopAutoplay() {
    if (!this.autoplayRunning) return

    this.autoplayRunning = false

    if (this.rafId) {
      cancelAnimationFrame(this.rafId)

      this.rafId = null
    }
  }

  _tick(timestamp) {
    if (!this.autoplayRunning) return

    this.autoplayElapsed = timestamp - this.autoplayStart

    this.ringProgress = Math.min(this.autoplayElapsed / CAROUSEL.AUTOPLAY_DURATION, 1)

    this._updateRingDom()

    if (this.autoplayElapsed >= CAROUSEL.AUTOPLAY_DURATION) {
      this.autoplayElapsed = 0

      this.ringProgress = 0

      this._updateRingDom()

      this.goTo(this.currentIndex + 1)

      this.autoplayStart = performance.now()
    }

    this.rafId = requestAnimationFrame((ts) => this._tick(ts))
  }

  _updateRingDom() {
    const fills = this.$$(SELECTORS.CAROUSEL_BTN_RING_FILL)

    const offset = calcCarouselRingOffset(this.ringProgress, this.circumference)

    fills.forEach((fill) => {
      fill.style.strokeDashoffset = `${offset}`
    })
  }

  renderSlide(item) {
    if (!item) return null

    const folder = this.folder || ATTRS.EMPTY

    const src = folder + item.src

    const itemW = item.size ? item.size[0] : 800

    const itemH = item.size ? item.size[1] : 450

    const canExpand = item.canExpand ?? false

    const isVideo = item.isVideo ?? false

    const label = item.label || ATTRS.EMPTY

    const itemClass = item.class || ATTRS.EMPTY

    const MediaFigure = TAGS.MEDIA_FIGURE

    return (
      <div className={`${CLASSES.INTERNAL_EXTRA_ITEM} ${itemClass}`}>
        <MediaFigure
          src={src}
          width={itemW}
          height={itemH}
          can-expand={canExpand}
          is-video={isVideo}
          label={label}
          classes={itemClass}
          class={itemClass}
        />
      </div>
    )
  }

  render() {
    if (!this.isActive) {
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
      <div className={`${CLASSES.CAROUSEL} ${this.isEnteredViewport ? CLASSES.CAROUSEL_IN_VIEW : ATTRS.EMPTY}`}>
        <div className={CLASSES.CAROUSEL_TRACK}>
          <div className={`${CLASSES.CAROUSEL_SLIDE} ${CLASSES.CAROUSEL_SLIDE_CLONE_LAST}`} aria-hidden={ATTRS.TRUE} inert>
            {this.renderSlide(lastItem)}
          </div>

          {this.items.map((item, idx) => (
            <div
              key={idx}
              className={`${CLASSES.CAROUSEL_SLIDE} ${this.currentIndex === idx ? CLASSES.CAROUSEL_SLIDE_ACTIVE : ATTRS.EMPTY}`}
              role="group"
              aria-label={`${idx + 1} of ${this.items.length}`}
            >
              {this.renderSlide(item)}
            </div>
          ))}

          <div className={`${CLASSES.CAROUSEL_SLIDE} ${CLASSES.CAROUSEL_SLIDE_CLONE_FIRST}`} aria-hidden={ATTRS.TRUE} inert>
            {this.renderSlide(firstItem)}
          </div>
        </div>

        <div className={CLASSES.CAROUSEL_CONTROLS}>
          {(() => {
            const lang = store.getters.getCarouselLang()

            return (
              <Fragment>
                <button className={CLASSES.CAROUSEL_BTN_PREV} aria-label={lang.prev} type={ATTRS.BUTTON}>
                  <svg className={CLASSES.CAROUSEL_BTN_RING} viewBox={ATTRS.RING_VIEWBOX} aria-hidden={ATTRS.TRUE}>
                    <circle className={CLASSES.CAROUSEL_BTN_RING_TRACK} cx={ATTRS.RING_CX} cy={ATTRS.RING_CY} r={ATTRS.RING_R} />

                    <circle
                      className={CLASSES.CAROUSEL_BTN_RING_FILL}
                      cx={ATTRS.RING_CX}
                      cy={ATTRS.RING_CY}
                      r={ATTRS.RING_R}
                      style={{
                        strokeDasharray: `${this.circumference}`,
                        strokeDashoffset: `${this.circumference}`,
                      }}
                    />
                  </svg>

                  <span className={CLASSES.CAROUSEL_BTN_ARROW} aria-hidden={ATTRS.TRUE}>&#8592;</span>
                </button>

                <div className={CLASSES.CAROUSEL_INDICATORS}>
                  <span className={CLASSES.CAROUSEL_COUNTER}>{this.currentIndex + 1} {lang.ofLabel} {this.items.length}</span>

                  <div className={CLASSES.CAROUSEL_DOTS}>
                    {this.items.map((_, idx) => (
                      <button
                        key={idx}
                        className={`${CLASSES.CAROUSEL_DOT} ${this.currentIndex === idx ? CLASSES.CAROUSEL_DOT_ACTIVE : ATTRS.EMPTY}`}
                        aria-label={`${idx + 1} ${lang.ofLabel} ${this.items.length}`}
                        type={ATTRS.BUTTON}
                      />
                    ))}
                  </div>
                </div>

                <button className={CLASSES.CAROUSEL_BTN_NEXT} aria-label={lang.next} type={ATTRS.BUTTON}>
                  <svg className={CLASSES.CAROUSEL_BTN_RING} viewBox={ATTRS.RING_VIEWBOX} aria-hidden={ATTRS.TRUE}>
                    <circle className={CLASSES.CAROUSEL_BTN_RING_TRACK} cx={ATTRS.RING_CX} cy={ATTRS.RING_CY} r={ATTRS.RING_R} />

                    <circle
                      className={CLASSES.CAROUSEL_BTN_RING_FILL}
                      cx={ATTRS.RING_CX}
                      cy={ATTRS.RING_CY}
                      r={ATTRS.RING_R}
                      style={{
                        strokeDasharray: `${this.circumference}`,
                        strokeDashoffset: `${this.circumference}`,
                      }}
                    />
                  </svg>

                  <span className={CLASSES.CAROUSEL_BTN_ARROW} aria-hidden={ATTRS.TRUE}>&#8594;</span>
                </button>
              </Fragment>
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
