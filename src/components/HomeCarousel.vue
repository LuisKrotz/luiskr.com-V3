<template>
  <div
    class="hc"
    :class="[`hc--${variant}`, { 'hc--autoplay': autoplayRunning }]"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- ── Controls row: ABOVE image ──────────────────────────────────── -->
    <div class="hc-controls">
      <button class="hc-btn hc-btn--prev" aria-label="Previous" @click="onPrevClick">
        <svg class="hc-btn-ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle class="hc-btn-ring-track" cx="22" cy="22" r="19" />
          <circle class="hc-btn-ring-fill" cx="22" cy="22" r="19" :style="ringStyle" />
        </svg>
        <span class="hc-btn-arrow" aria-hidden="true">&#8592;</span>
      </button>

      <!-- dots (only when showDots) -->
      <div v-if="showDots" class="hc-dots" aria-hidden="true">
        <button
          v-for="(_, idx) in items"
          :key="idx"
          class="hc-dot"
          :class="{ 'hc-dot--active': currentIndex === idx }"
          :aria-label="`Go to item ${idx + 1}`"
          @click="onDotClick(idx)"
        ></button>
      </div>
      <div v-else class="hc-spacer"></div>

      <button class="hc-btn hc-btn--next" aria-label="Next" @click="onNextClick">
        <svg class="hc-btn-ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle class="hc-btn-ring-track" cx="22" cy="22" r="19" />
          <circle class="hc-btn-ring-fill" cx="22" cy="22" r="19" :style="ringStyle" />
        </svg>
        <span class="hc-btn-arrow" aria-hidden="true">&#8594;</span>
      </button>
    </div>

    <!-- ── Slide track ─────────────────────────────────────────────────── -->
    <div class="hc-track" ref="track">
      <!-- Clone of last item -->
      <div class="hc-slide hc-slide--clone" aria-hidden="true">
        <slot :item="items[items.length - 1]" :index="-1"></slot>
      </div>

      <!-- Real items -->
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="hc-slide"
        :class="{ 'hc-slide--active': currentIndex === idx }"
        :ref="(el) => setSlideRef(el, idx)"
        role="group"
        :aria-label="`${idx + 1} of ${items.length}`"
      >
        <slot :item="item" :index="idx"></slot>
      </div>

      <!-- Clone of first item -->
      <div class="hc-slide hc-slide--clone" aria-hidden="true">
        <slot :item="items[0]" :index="items.length"></slot>
      </div>
    </div>
  </div>
</template>

<script>
const CIRCUMFERENCE = 2 * Math.PI * 19

export default {
  name: 'HomeCarousel',

  props: {
    items: {
      type: Array,
      required: true,
    },
    // 'selected' | 'explore' | 'awards'
    variant: {
      type: String,
      default: 'selected',
    },
    // autoplay duration in ms
    duration: {
      type: Number,
      default: 30000,
    },
    showDots: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      currentIndex: 0,
      autoplayRunning: true,
      autoplayStart: null,
      autoplayElapsed: 0,
      ringProgress: 0,
      rafId: null,
      teleportTimer: null,
      touchStartX: 0,
      slideRefs: [],
      circumference: CIRCUMFERENCE,
    }
  },

  computed: {
    ringStyle() {
      const offset = this.circumference * (1 - this.ringProgress)
      return {
        strokeDasharray: `${this.circumference}`,
        strokeDashoffset: `${offset}`,
        transition: 'none',
      }
    },
  },

  mounted() {
    this.$nextTick(() => {
      this._jumpToSlide(0)
      this._startAutoplay()
    })
    window.addEventListener('resize', this._onResize)
  },

  beforeUnmount() {
    this._stopAutoplay()
    if (this.teleportTimer) clearTimeout(this.teleportTimer)
    window.removeEventListener('resize', this._onResize)
  },

  methods: {
    setSlideRef(el, idx) {
      if (el) this.slideRefs[idx] = el
    },

    // ── Navigation ───────────────────────────────────────────────────────
    goTo(idx) {
      const len = this.items.length
      const newIndex = ((idx % len) + len) % len
      this.currentIndex = newIndex

      if (idx >= len) {
        this._scrollToEl(this.$refs.track?.lastElementChild)
        this._scheduleTeleport(0)
      } else if (idx < 0) {
        this._scrollToEl(this.$refs.track?.firstElementChild)
        this._scheduleTeleport(len - 1)
      } else {
        this._scrollToSlide(newIndex)
      }
    },

    _scrollToEl(el) {
      const track = this.$refs.track
      if (!track || !el) return
      const tr = track.getBoundingClientRect()
      const er = el.getBoundingClientRect()
      const left = track.scrollLeft + er.left - tr.left - (tr.width - er.width) / 2
      track.scrollTo({ left, behavior: 'smooth' })
    },

    _scrollToSlide(idx) {
      const track = this.$refs.track
      const slide = track?.children[idx + 1] // +1 for clone-last
      if (!slide) return
      const tr = track.getBoundingClientRect()
      const sr = slide.getBoundingClientRect()
      const left = track.scrollLeft + sr.left - tr.left - (tr.width - sr.width) / 2
      track.scrollTo({ left, behavior: 'smooth' })
    },

    _jumpToSlide(idx) {
      const track = this.$refs.track
      const slide = track?.children[idx + 1]
      if (!slide) return
      const tr = track.getBoundingClientRect()
      const sr = slide.getBoundingClientRect()
      const left = track.scrollLeft + sr.left - tr.left - (tr.width - sr.width) / 2
      track.scrollTo({ left, behavior: 'instant' })
    },

    _scheduleTeleport(targetIdx) {
      if (this.teleportTimer) clearTimeout(this.teleportTimer)
      this.teleportTimer = setTimeout(() => {
        this._jumpToSlide(targetIdx)
        this.teleportTimer = null
      }, 380)
    },

    // ── Button / dot handlers ─────────────────────────────────────────────
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

    // ── Touch / swipe ─────────────────────────────────────────────────────
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

    // ── Autoplay + countdown ring ─────────────────────────────────────────
    _startAutoplay() {
      this.autoplayRunning = true
      this.autoplayStart = performance.now()
      this.autoplayElapsed = 0
      this._tickRing()
    },

    _stopAutoplay() {
      this.autoplayRunning = false
      if (this.rafId) cancelAnimationFrame(this.rafId)
      this.rafId = null
      this.ringProgress = 0
    },

    _tickRing() {
      if (!this.autoplayRunning) return
      const elapsed = performance.now() - this.autoplayStart + this.autoplayElapsed
      this.ringProgress = Math.min(elapsed / this.duration, 1)

      if (elapsed >= this.duration) {
        this.goTo(this.currentIndex + 1)
        this.autoplayElapsed = 0
        this.autoplayStart = performance.now()
        this.ringProgress = 0
      }

      this.rafId = requestAnimationFrame(() => this._tickRing())
    },

    _onResize() {
      this._jumpToSlide(this.currentIndex)
    },
  },
}
</script>

<style lang="scss">
@import '../sass/home-carousel';
</style>
