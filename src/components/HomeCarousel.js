/** @jsx h */
import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import store from '../core/store.js'
import homeCarouselStyles from '../sass/components/home-carousel.scss?inline'
import { CLASSES, TAGS, EVENTS, STRINGS, ATTRS, TEXT } from '../core/constants.js'

export class HomeCarousel extends BaseComponent {
  constructor() {
    super(homeCarouselStyles)
    this._items = []
    this.variant = 'selected'
    this.duration = 30000
    this.showDots = false
    this.currentIndex = 0
    this.autoplayRunning = false
    this.autoplayStart = null
    this.autoplayElapsed = 0
    this.rafId = null
    this.teleportTimer = null
    this.touchStartX = 0
    this.isNavigating = false
    this.isEnteredViewport = false
    this.isFullyVisible = false
    this.observer = null
  }

  set items(val) {
    const newItems = Array.isArray(val) ? val : []
    if (this._items === newItems || (this._items.length === newItems.length && this._items.every((it, i) => it === newItems[i]))) {
      return
    }
    this._items = newItems
    if (this._isMounted) {
      this._updateDom()
      this._setupCarousel()
    }
  }

  get items() {
    return this._items
  }

  onMounted() {
    if (this.items && this.items.length) {
      this._updateDom()
    }
    this._setupCarousel()
    this._disableClonesFocus()
    this.subscribe(store)
  }

  onUpdated() {
    this._disableClonesFocus()
  }

  onStoreUpdate() {
    if (store.getters.getReducedMotion()) {
      this._stopAutoplay()
    }
  }

  _setupCarousel() {
    if (!this.items.length) return
    this._bindEvents()
    requestAnimationFrame(() => {
      this._jumpToSlide(0, false)
      this._setupObserver()
      this._disableClonesFocus()
    })
  }

  onDestroy() {
    this._stopAutoplay()
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    if (this.teleportTimer) clearTimeout(this.teleportTimer)
  }

  _bindEvents() {
    const track = this.$(`.${CLASSES.HC_TRACK}`)

    const dots = this.$$(`.${CLASSES.HC_DOT}`)
    dots.forEach((dot, idx) => {
      this.addScopedListener(dot, 'click', () => this.onDotClick(idx))
    })

    if (track) {
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
          if (Math.abs(delta) > 40) {
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

  onDotClick(idx) {
    this._stopAutoplay()
    this.goTo(idx)
  }

  goTo(idx) {
    const len = this.items.length
    if (!len) return
    const newIndex = ((idx % len) + len) % len
    this.currentIndex = newIndex

    const slides = this.$$(`.${CLASSES.HC_SLIDE}:not(.${CLASSES.HC_SLIDE_CLONE})`)
    slides.forEach((s, i) => {
      s.classList.toggle(CLASSES.HC_SLIDE_ACTIVE, i === this.currentIndex)
    })

    const dots = this.$$(`.${CLASSES.HC_DOT}`)
    dots.forEach((d, i) => {
      d.classList.toggle(CLASSES.HC_DOT_ACTIVE, i === this.currentIndex)
    })

    this.dispatchEvent(new CustomEvent('slidechange', {
      bubbles: true,
      composed: true,
      detail: { index: this.currentIndex, total: len },
    }))
    this.isNavigating = true
    const cloneFirst = this.$(`.${CLASSES.HC_SLIDE_CLONE_FIRST}`)
    const cloneLast = this.$(`.${CLASSES.HC_SLIDE_CLONE_LAST}`)

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

  _scrollToElement(el) {
    const track = this.$(`.${CLASSES.HC_TRACK}`)
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
    }, 420)
  }

  _scrollToSlide(idx) {
    const track = this.$(`.${CLASSES.HC_TRACK}`)
    const slide = track?.children[idx + 1]
    if (!slide || !track) return
    const trackRect = track.getBoundingClientRect()
    const slideRect = slide.getBoundingClientRect()
    if (!trackRect.width || !slideRect.width) return
    const scrollLeft =
      track.scrollLeft + slideRect.left - trackRect.left - (trackRect.width - slideRect.width) / 2
    track.scrollTo({ left: scrollLeft, behavior: ATTRS.SMOOTH })
  }

  _jumpToSlide(idx, smooth = false) {
    const track = this.$(`.${CLASSES.HC_TRACK}`)
    const slide = track?.children[idx + 1]
    if (!slide || !track) return

    const trackWidth = track.clientWidth
    const slideWidth = slide.clientWidth
    if (!trackWidth || !slideWidth) {
      requestAnimationFrame(() => this._jumpToSlide(idx, smooth))
      return
    }

    const scrollLeft = slide.offsetLeft - (trackWidth - slideWidth) / 2
    track.scrollTo({ left: scrollLeft, behavior: smooth ? ATTRS.SMOOTH : ATTRS.INSTANT })
  }


  _setupObserver() {
    const root = this.$(`.${CLASSES.HC}`)
    if (!root) return

    if (typeof IntersectionObserver === STRINGS.UNDEFINED) {
      this.isFullyVisible = true
      this.isEnteredViewport = true
      root.classList.add(CLASSES.HC_IN_VIEW)
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
            root.classList.add(CLASSES.HC_IN_VIEW)
          }
          const isFullyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5
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
      { threshold: [0, 0.5] }
    )
    this.observer.observe(this)
  }

  _onResize() {
    this._jumpToSlide(this.currentIndex, false)
  }

  _disableClonesFocus() {
    const clones = this.$$(`.${CLASSES.HC_SLIDE_CLONE}`)
    clones.forEach((clone) => {
      clone.querySelectorAll('a, button, input, textarea, select').forEach((el) => {
        el.setAttribute('tabindex', '-1')
        el.setAttribute('aria-hidden', 'true')
      })
    })
  }

  _startAutoplay() {
    if (store.getters.getReducedMotion() || !this.isFullyVisible) {
      this._stopAutoplay()
      return
    }

    this.autoplayRunning = true
    this.autoplayStart = performance.now()
    this.autoplayElapsed = 0

    // Notify listeners (e.g. AwardsMentions progress bar) that autoplay is live
    this.dispatchEvent(new CustomEvent(EVENTS.AUTOPLAY_START, { bubbles: false }))

    this._tickAutoplay()
  }

  _stopAutoplay() {
    this.autoplayRunning = false

    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = null

    this.dispatchEvent(new CustomEvent(EVENTS.AUTOPLAY_STOP, { bubbles: false }))
  }

  _tickAutoplay() {
    if (!this.autoplayRunning) return

    const now = performance.now()
    const elapsed = now - this.autoplayStart + this.autoplayElapsed

    if (elapsed >= this.duration) {
      this.goTo(this.currentIndex + 1)
      this.autoplayElapsed = 0
      this.autoplayStart = performance.now()
    }

    this.rafId = requestAnimationFrame(() => this._tickAutoplay())
  }

  renderItem(item) {
    if (!item) return null
    const storage = store.getters.getStorage()

    if (this.variant === 'awards') {
      return (
        <a
          className={CLASSES.HC_AWARD}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {!item.media ? (
            <span className={CLASSES.HC_AWARD_MEDIA}>{item.icon || ''}</span>
          ) : (
            <img
              loading="lazy"
              decoding="async"
              className={CLASSES.HC_AWARD_IMG}
              src={storage + item.media.path}
              alt={item.description || ''}
              width={item.media.width || 60}
              height={item.media.height || 60}
            />
          )}
          <span
            className={CLASSES.HC_AWARD_TEXT}
            dangerouslySetInnerHTML={{ __html: item.description || '' }}
          />
        </a>
      )
    }

    return (
      <div className={CLASSES.HC_SLIDE_CONTENT}>
        {item.content || item.label || ''}
      </div>
    )
  }

  render() {
    if (!this.items.length) {
      return <div className={CLASSES.HC} />
    }

    const lastItem = this.items[this.items.length - 1]
    const firstItem = this.items[0]

    return (
      <div
        className={`${CLASSES.HC} ${CLASSES.HC}--${this.variant} ${this.isEnteredViewport ? CLASSES.HC_IN_VIEW : ''}`}
      >
        {this.variant === 'awards' && this.showDots ? (
          <div className={CLASSES.HC_CONTROLS}>
            <div className={CLASSES.HC_DOTS}>
              {this.items.map((_, idx) => (
                <button
                  key={idx}
                  type={ATTRS.BUTTON}
                  className={`${CLASSES.HC_DOT} ${this.currentIndex === idx ? CLASSES.HC_DOT_ACTIVE : ''}`}
                  aria-label={`${TEXT.GO_TO_SLIDE} ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        <div className={CLASSES.HC_TRACK}>
          <div
            className={`${CLASSES.HC_SLIDE} ${CLASSES.HC_SLIDE_CLONE} ${CLASSES.HC_SLIDE_CLONE_LAST}`}
            aria-hidden="true"
            inert
          >
            {this.renderItem(lastItem)}
          </div>
          {this.items.map((item, idx) => (
            <div
              key={idx}
              className={`${CLASSES.HC_SLIDE} ${this.currentIndex === idx ? CLASSES.HC_SLIDE_ACTIVE : ''}`}
              role="group"
              aria-label={`${idx + 1} of ${this.items.length}`}
            >
              {this.renderItem(item)}
            </div>
          ))}
          <div
            className={`${CLASSES.HC_SLIDE} ${CLASSES.HC_SLIDE_CLONE} ${CLASSES.HC_SLIDE_CLONE_FIRST}`}
            aria-hidden="true"
            inert
          >
            {this.renderItem(firstItem)}
          </div>
        </div>
      </div>
    )
  }
}

if (!customElements.get(TAGS.HOME_CAROUSEL)) {
  customElements.define(TAGS.HOME_CAROUSEL, HomeCarousel)
}
