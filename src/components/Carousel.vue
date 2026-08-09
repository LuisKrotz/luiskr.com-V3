<template>
  <div
    v-if="isActive"
    class="carousel"
    :class="{ 'carousel--autoplay': autoplayRunning }"
    ref="carouselRoot"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- ── Track ──────────────────────────────────────────────────── -->
    <div class="carousel-track" ref="track" @scroll.passive="onScroll">
      <!-- Clone of last item (for infinite loop) -->
      <div class="carousel-slide carousel-slide--clone" ref="cloneLast" aria-hidden="true">
        <!-- Clones always render: they are the adjacent wrap-around slides -->
        <slot :item="items[items.length - 1]" :index="-1" :isVisible="true"></slot>
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
      <div class="carousel-slide carousel-slide--clone" ref="cloneFirst" aria-hidden="true">
        <!-- Clones always render: they are the adjacent wrap-around slides -->
        <slot :item="items[0]" :index="items.length" :isVisible="true"></slot>
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
      <div class="carousel-indicators" aria-hidden="true">
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
const AUTOPLAY_DURATION = 10000 // ms
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
      touchStartX: 0,
      slideRefs: [],
      // Monotonic loaded-state: once true, NEVER goes back to false.
      // Prevents Media from unmounting when a slide scrolls out of the ±1 window,
      // which caused blink + layout shift as the placeholder figure replaced the image.
      slideLoaded: [],
      isMobile: window.innerWidth < MOBILE_BREAKPOINT,
      circumference: CIRCUMFERENCE,
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
      if (!this.isModalOpen) this._startAutoplay()
      this._setHeightVar()
    })
    window.addEventListener('resize', this._onResize)
  },

  watch: {
    // Every time the active slide changes, permanently mark the new adjacent slides.
    // Once slideLoaded[i] is true it stays true — no flicker, no remount.
    currentIndex(newVal) {
      this._markAdjacentLoaded(newVal)
    },
    isModalOpen(isOpen) {
      if (isOpen) {
        this._stopAutoplay()
      } else if (this.isActive) {
        this._startAutoplay()
      }
    },
  },

  beforeUnmount() {
    this._stopAutoplay()
    if (this.teleportTimer) clearTimeout(this.teleportTimer)
    window.removeEventListener('resize', this._onResize)
  },

  methods: {
    // ── Slide ref tracking ────────────────────────────────────────────
    setSlideRef(el, idx) {
      if (el) this.slideRefs[idx] = el
    },

    isSlideVisible(idx) {
      // Returns true if this slide has EVER been in the ±1 window.
      // Once loaded, stays loaded — prevents unmount flicker on navigation.
      return this.slideLoaded[idx] === true
    },

    // Mark slide idx and its circular neighbours as permanently loaded
    _markAdjacentLoaded(centerIdx) {
      const len = this.items.length
      for (let i = 0; i < len; i++) {
        const direct = Math.abs(i - centerIdx)
        const wrapped = len - direct
        if (Math.min(direct, wrapped) <= 1) {
          this.slideLoaded[i] = true
        }
      }
    },

    // ── Navigation ────────────────────────────────────────────────────
    goTo(idx) {
      const len = this.items.length
      const newIndex = ((idx % len) + len) % len
      this.currentIndex = newIndex
      this.$emit('change', newIndex)

      if (idx >= len) {
        // Went past the LAST item → smooth scroll to cloneFirst (physically on the
        // right, adjacent), then instantly teleport to real first item.
        // This is how an infinite carousel avoids scrolling back through all slides.
        this._scrollToElement(this.$refs.cloneFirst)
        this._scheduleTeleport(0)
      } else if (idx < 0) {
        // Went before the FIRST item → smooth scroll to cloneLast (physically on
        // the left, adjacent), then instantly teleport to real last item.
        this._scrollToElement(this.$refs.cloneLast)
        this._scheduleTeleport(len - 1)
      } else {
        this._scrollToSlide(newIndex)
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

    // After smooth scroll animation completes (~350ms), silently teleport to the real slide
    _scheduleTeleport(targetIdx) {
      if (this.teleportTimer) clearTimeout(this.teleportTimer)
      this.teleportTimer = setTimeout(() => {
        this._jumpToSlide(targetIdx)
        this.teleportTimer = null
      }, 380)
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
      clearTimeout(this.scrollTimeout)
      this.scrollTimeout = setTimeout(() => {
        this._checkInfiniteLoop()
      }, 50)
    },

    _checkInfiniteLoop() {
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
      if (
        Math.abs(cloneLastRect.left + cloneLastRect.width / 2 - center) <
        cloneLastRect.width / 3
      ) {
        this.currentIndex = this.items.length - 1
        this._jumpToSlide(this.currentIndex)
        return
      }

      // If clone-first is centered → jump to real first
      if (
        Math.abs(cloneFirstRect.left + cloneFirstRect.width / 2 - center) <
        cloneFirstRect.width / 3
      ) {
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
    _startAutoplay() {
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
      this.ringProgress = Math.min(elapsed / AUTOPLAY_DURATION, 1)

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
