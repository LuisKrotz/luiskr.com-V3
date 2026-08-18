<template>
  <div
    v-if="isActive"
    class="carousel"
    :class="{ 'carousel--autoplay': autoplayRunning, 'carousel--in-view': isEnteredViewport }"
    ref="carouselRoot"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- ── Track ──────────────────────────────────────────────────── -->
    <div class="carousel-track" ref="track" @scroll.passive="onScroll">
      <!-- Clone of last item (for infinite loop) -->
      <div class="carousel-slide carousel-slide--clone" ref="cloneLast" aria-hidden="true" inert>
        <!-- Clones are non-interactive wrap-around visuals -->
        <slot :item="items[items.length - 1]" :index="-1" :isVisible="isSlideVisible(items.length - 1)"></slot>
      </div>

      <!-- Real items -->
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="carousel-slide"
        :class="{ 'carousel-slide--active': currentIndex === idx }"
        :ref="(el) => setSlideRef(el, idx)"
        role="group"
        :aria-label="`${idx + 1} of ${items.length}`"
        :aria-roledescription="'slide'"
      >
        <slot :item="item" :index="idx" :isVisible="isSlideVisible(idx)"></slot>
      </div>

      <!-- Clone of first item (for infinite loop) -->
      <div class="carousel-slide carousel-slide--clone" ref="cloneFirst" aria-hidden="true" inert>
        <!-- Clones are non-interactive wrap-around visuals -->
        <slot :item="items[0]" :index="items.length" :isVisible="isSlideVisible(0)"></slot>
      </div>
    </div>

    <!-- ── Navigation buttons ──────────────────────────────────────── -->
    <div class="carousel-controls">
      <button
        class="carousel-btn carousel-btn--prev"
        :aria-label="`Previous item`"
        @click="onPrevClick"
        ref="prevBtn"
      >
        <!-- Countdown SVG ring -->
        <svg class="carousel-btn-ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle class="carousel-btn-ring-track" cx="22" cy="22" r="19" />
          <circle class="carousel-btn-ring-fill" cx="22" cy="22" r="19" :style="ringStyle" />
        </svg>
        <span class="carousel-btn-arrow" aria-hidden="true">&#8592;</span>
      </button>

      <!-- ── Dots + counter ──────────────────────────────────────── -->
      <div class="carousel-indicators">
        <span class="carousel-counter">{{ currentIndex + 1 }} of {{ items.length }}</span>
        <div class="carousel-dots">
          <button
            v-for="(_, idx) in items"
            :key="idx"
            class="carousel-dot"
            :class="{ 'carousel-dot--active': currentIndex === idx }"
            :aria-label="`Go to item ${idx + 1}`"
            @click="onDotClick(idx)"
          ></button>
        </div>
      </div>

      <button
        class="carousel-btn carousel-btn--next"
        :aria-label="`Next item`"
        @click="onNextClick"
        ref="nextBtn"
      >
        <!-- Countdown SVG ring -->
        <svg class="carousel-btn-ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle class="carousel-btn-ring-track" cx="22" cy="22" r="19" />
          <circle class="carousel-btn-ring-fill" cx="22" cy="22" r="19" :style="ringStyle" />
        </svg>
        <span class="carousel-btn-arrow" aria-hidden="true">&#8594;</span>
      </button>
    </div>
  </div>

  <!-- Fallback: plain flex row when threshold not met -->
  <div v-else class="carousel-fallback">
    <slot
      v-for="(item, idx) in items"
      :item="item"
      :index="idx"
      :isVisible="true"
      :key="idx"
    ></slot>
  </div>
</template>

<script>
import { calcCarouselRingOffset } from '../utils/wasm-layout.js'

const AUTOPLAY_DURATION = 5000
const CIRCUMFERENCE = 2 * Math.PI * 19 // r=19
const MOBILE_BREAKPOINT = 768
const MOBILE_MIN_ITEMS = 1
const DESKTOP_MIN_ITEMS = 1

export default {
  name: 'Carousel',
  props: {
    items: {
      type: Array,
      required: true,
    },
    forceActive: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],

  data() {
    return {
      currentIndex: 0,
      autoplayRunning: true,
      autoplayTimer: null,
      autoplayStart: null,
      autoplayElapsed: 0, // ms elapsed in current cycle for ring animation
      ringProgress: 0, // 0-1 progress for ring fill
      rafId: null,
      scrollTimeout: null,
      teleportTimer: null, // timer for post-clone teleport
      isScrolling: false,
      isNavigating: false,
      touchStartX: 0,
      slideRefs: [],
      // Monotonic loaded-state: once true, NEVER goes back to false.
      // Prevents Media from unmounting when a slide scrolls out of the ±1 window,
      // which caused blink + layout shift as the placeholder figure replaced the image.
      slideLoaded: [],
      isMobile: window.innerWidth < MOBILE_BREAKPOINT,
      circumference: CIRCUMFERENCE,
      isFullyVisible: false,
      isEnteredViewport: false,
      observer: null,
    }
  },

  computed: {
    isActive() {
      if (this.forceActive) return this.items.length > 1
      const threshold = this.isMobile ? MOBILE_MIN_ITEMS : DESKTOP_MIN_ITEMS
      return this.items.length > threshold
    },

    isModalOpen() {
      return !!this.$store.getters.getModal?.open
    },
    isReducedMotion() {
      return this.$store.getters.getReducedMotion
    },
    ringStyle() {
      // Countdown ring: starts full, drains to 0 over AUTOPLAY_DURATION
      // stroke-dashoffset goes from 0 → circumference
      const offset = this.circumference * (1 - this.ringProgress)
      return {
        strokeDasharray: `${this.circumference}`,
        strokeDashoffset: `${offset}`,
        transition: 'none',
      }
    },
  },

  mounted() {
    if (!this.isActive) return
    // Pre-mark the initial visible window (slide 0 ± 1 with wrap)
    this._markAdjacentLoaded(0)
    this.$nextTick(() => {
      this._jumpToSlide(0, false)
      this._setHeightVar()
      this._setupIntersectionObserver()
    })
    window.addEventListener('resize', this._onResize)
  },

  watch: {
    // Every time the active slide changes, permanently mark the new adjacent slides.
    // Once slideLoaded[i] is true it stays true — no flicker, no remount.
    currentIndex(newVal) {
      this._markAdjacentLoaded(newVal)
    },
    isReducedMotion(isReduced) {
      if (isReduced) {
        this._stopAutoplay()
      } else if (!this.isModalOpen && this.isActive && this.isFullyVisible) {
        this._startAutoplay()
      }
    },
    isModalOpen(isOpen) {
      if (isOpen) {
        this._stopAutoplay()
      } else if (this.isActive && !this.isReducedMotion && this.isFullyVisible) {
        this._startAutoplay()
      }
    },
  },

  beforeUnmount() {
    this._stopAutoplay()
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    if (this.teleportTimer) clearTimeout(this.teleportTimer)
    window.removeEventListener('resize', this._onResize)
  },

  methods: {
    // ── Slide ref tracking ────────────────────────────────────────────
    setSlideRef(el, idx) {
      if (el) this.slideRefs[idx] = el
    },

    isSlideVisible(idx) {
      if (idx === -1) return this.slideLoaded[this.items.length - 1] === true
      if (idx >= this.items.length) return this.slideLoaded[0] === true
      return this.slideLoaded[idx] === true
    },

    // Mark slide idx and its circular neighbours as permanently loaded
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
      if (centerIdx === 0) {
        this.slideLoaded[len - 1] = true
      }
      if (centerIdx === len - 1) {
        this.slideLoaded[0] = true
      }
    },

    // ── Navigation ────────────────────────────────────────────────────
    goTo(idx) {
      const len = this.items.length
      const newIndex = ((idx % len) + len) % len
      this.currentIndex = newIndex
      this.$emit('change', newIndex)

      this.isNavigating = true

      if (idx >= len) {
        // Went past the LAST item → smooth scroll to cloneFirst (physically on the
        // right, adjacent), then silently teleport to real first item after animation completes.
        this._scrollToElement(this.$refs.cloneFirst)
        this._scheduleTeleport(0)
      } else if (idx < 0) {
        // Went before the FIRST item → smooth scroll to cloneLast (physically on
        // the left, adjacent), then silently teleport to real last item after animation completes.
        this._scrollToElement(this.$refs.cloneLast)
        this._scheduleTeleport(len - 1)
      } else {
        this._scrollToSlide(newIndex)
        if (this.teleportTimer) clearTimeout(this.teleportTimer)
        this.teleportTimer = setTimeout(() => {
          this.isNavigating = false
        }, 400)
      }
    },

    // Scroll any element to the center of the track (smooth)
    _scrollToElement(el) {
      const track = this.$refs.track
      if (!track || !el) return
      const trackRect = track.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const left =
        track.scrollLeft + elRect.left - trackRect.left - (trackRect.width - elRect.width) / 2
      track.scrollTo({ left, behavior: 'smooth' })
    },

    // After smooth scroll animation completes (~420ms), silently teleport to the real slide
    _scheduleTeleport(targetIdx) {
      if (this.teleportTimer) clearTimeout(this.teleportTimer)
      this.teleportTimer = setTimeout(() => {
        this._jumpToSlide(targetIdx, false)
        this.isNavigating = false
        this.teleportTimer = null
      }, 420)
    },

    _scrollToSlide(idx) {
      const track = this.$refs.track
      // Offset +1 because of the clone-last at index 0 in the DOM
      const slide = track?.children[idx + 1]
      if (!slide) return
      const trackRect = track.getBoundingClientRect()
      const slideRect = slide.getBoundingClientRect()
      const scrollLeft =
        track.scrollLeft + slideRect.left - trackRect.left - (trackRect.width - slideRect.width) / 2
      track.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    },

    _jumpToSlide(idx, smooth = false) {
      const track = this.$refs.track
      const slide = track?.children[idx + 1]
      if (!slide) return
      const trackRect = track.getBoundingClientRect()
      const slideRect = slide.getBoundingClientRect()
      const scrollLeft =
        track.scrollLeft + slideRect.left - trackRect.left - (trackRect.width - slideRect.width) / 2
      track.scrollTo({ left: scrollLeft, behavior: smooth ? 'smooth' : 'instant' })
    },

    // ── Infinite loop: handle scroll to clones ────────────────────────
    onScroll() {
      if (this.isNavigating) return
      clearTimeout(this.scrollTimeout)
      this.scrollTimeout = setTimeout(() => {
        this._checkInfiniteLoop()
      }, 150)
    },

    _checkInfiniteLoop() {
      if (this.isNavigating) return
      const track = this.$refs.track
      if (!track) return

      const cloneLast = this.$refs.cloneLast
      const cloneFirst = this.$refs.cloneFirst
      if (!cloneLast || !cloneFirst) return

      const trackRect = track.getBoundingClientRect()
      const cloneLastRect = cloneLast.getBoundingClientRect()
      const cloneFirstRect = cloneFirst.getBoundingClientRect()

      const center = trackRect.left + trackRect.width / 2

      // If clone-last is centered → jump to real last
      if (Math.abs(cloneLastRect.left + cloneLastRect.width / 2 - center) < 10) {
        this.currentIndex = this.items.length - 1
        this._jumpToSlide(this.currentIndex)
        return
      }

      // If clone-first is centered → jump to real first
      if (Math.abs(cloneFirstRect.left + cloneFirstRect.width / 2 - center) < 10) {
        this.currentIndex = 0
        this._jumpToSlide(this.currentIndex)
        return
      }
    },

    // ── Button & dot handlers ─────────────────────────────────────────
    onPrevClick() {
      this._stopAutoplay()
      this.goTo(this.currentIndex - 1)
    },

    onNextClick() {
      this._stopAutoplay()
      this.goTo(this.currentIndex + 1)
    },

    onDotClick(idx) {
      this._stopAutoplay()
      this.goTo(idx)
    },

    // ── Touch / swipe ─────────────────────────────────────────────────
    onTouchStart(e) {
      this.touchStartX = e.touches[0].clientX
    },

    onTouchEnd(e) {
      const delta = e.changedTouches[0].clientX - this.touchStartX
      if (Math.abs(delta) > 40) {
        this._stopAutoplay()
        if (delta < 0) this.goTo(this.currentIndex + 1)
        else this.goTo(this.currentIndex - 1)
      }
    },

    // ── Autoplay & countdown ring ─────────────────────────────────────
    _setupIntersectionObserver() {
      const target = this.$refs.carouselRoot || this.$el
      if (!target || typeof IntersectionObserver === 'undefined') {
        this.isFullyVisible = true
        if (!this.isModalOpen && !this.isReducedMotion) this._startAutoplay()
        return
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.isEnteredViewport = true
            }
            const isFullyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.95
            this.isFullyVisible = isFullyVisible

            if (isFullyVisible) {
              if (!this.isModalOpen && !this.isReducedMotion) {
                this._startAutoplay()
              }
            } else {
              this._stopAutoplay()
            }
          })
        },
        { threshold: [0, 0.95, 1.0] }
      )
      this.observer.observe(target)
    },

    _startAutoplay() {
      if (this.isReducedMotion || !this.isFullyVisible) {
        this._stopAutoplay()
        return
      }
      this.autoplayRunning = true
      this.autoplayStart = performance.now()
      this.autoplayElapsed = 0
      this._tickRing()
    },

    _stopAutoplay() {
      this.autoplayRunning = false
      if (this.rafId) cancelAnimationFrame(this.rafId)
      if (this.autoplayTimer) clearTimeout(this.autoplayTimer)
      this.rafId = null
      this.autoplayTimer = null
      this.ringProgress = 0
    },

    _tickRing() {
      if (!this.autoplayRunning) return

      const now = performance.now()
      const elapsed = now - this.autoplayStart + this.autoplayElapsed
      this.ringProgress = Math.min(calcCarouselRingOffset(elapsed, AUTOPLAY_DURATION, 1), 1)

      if (elapsed >= AUTOPLAY_DURATION) {
        // Advance through goTo() so the infinite loop clone strategy applies
        // (i.e. last→first uses cloneFirst, not a backwards scroll)
        this.goTo(this.currentIndex + 1)
        // Reset ring
        this.autoplayElapsed = 0
        this.autoplayStart = performance.now()
        this.ringProgress = 0
      }

      this.rafId = requestAnimationFrame(() => this._tickRing())
    },

    // ── Resize ────────────────────────────────────────────────────────
    _onResize() {
      this.isMobile = window.innerWidth < MOBILE_BREAKPOINT
      this._setHeightVar()
    },

    // ── Height CSS variable (for internal-description min-height) ─────
    _setHeightVar() {
      const firstSlide = this.slideRefs[0]
      if (!firstSlide) return
      const h = firstSlide.getBoundingClientRect().height
      if (h <= 0) return
      // Set on the closest <section> ancestor
      const section = this.$el?.closest('section')
      if (section) {
        section.style.setProperty('--carousel-item-height', `${h}px`)
      }
    },
  },
}
</script>

<style lang="scss">
@import '../sass/carousel';
</style>
