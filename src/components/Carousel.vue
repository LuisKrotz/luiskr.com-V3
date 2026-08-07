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
        <div
            class="carousel-track"
            ref="track"
            @scroll.passive="onScroll"
        >
            <!-- Clone of last item (for infinite loop) -->
            <div
                class="carousel-slide carousel-slide--clone"
                ref="cloneLast"
                aria-hidden="true"
            >
                <slot :item="items[items.length - 1]" :index="-1" />
            </div>

            <!-- Real items -->
            <div
                v-for="(item, idx) in items"
                :key="idx"
                class="carousel-slide"
                :class="{ 'carousel-slide--active': currentIndex === idx }"
                :ref="el => setSlideRef(el, idx)"
                role="group"
                :aria-label="`${idx + 1} of ${items.length}`"
                :aria-roledescription="'slide'"
            >
                <slot :item="item" :index="idx" :isVisible="isSlideVisible(idx)" />
            </div>

            <!-- Clone of first item (for infinite loop) -->
            <div
                class="carousel-slide carousel-slide--clone"
                ref="cloneFirst"
                aria-hidden="true"
            >
                <slot :item="items[0]" :index="items.length" />
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
                    <circle
                        class="carousel-btn-ring-fill"
                        cx="22" cy="22" r="19"
                        :style="ringStyle"
                    />
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
                    />
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
                    <circle
                        class="carousel-btn-ring-fill"
                        cx="22" cy="22" r="19"
                        :style="ringStyle"
                    />
                </svg>
                <span class="carousel-btn-arrow" aria-hidden="true">&#8594;</span>
            </button>
        </div>
    </div>

    <!-- Fallback: plain flex row when threshold not met -->
    <div v-else class="carousel-fallback">
        <slot v-for="(item, idx) in items" :item="item" :index="idx" :isVisible="true" :key="idx" />
    </div>
</template>

<script>
const AUTOPLAY_DURATION = 10000; // ms
const CIRCUMFERENCE = 2 * Math.PI * 19; // r=19
const MOBILE_BREAKPOINT = 768;
const MOBILE_MIN_ITEMS = 1;
const DESKTOP_MIN_ITEMS = 2;

export default {
    name: 'Carousel',
    props: {
        items: {
            type: Array,
            required: true,
        },
    },
    emits: ['change'],

    data() {
        return {
            currentIndex:    0,
            autoplayRunning: true,
            autoplayTimer:   null,
            autoplayStart:   null,
            autoplayElapsed: 0,        // ms elapsed in current cycle for ring animation
            ringProgress:    0,        // 0-1 progress for ring fill
            rafId:           null,
            scrollTimeout:   null,
            isScrolling:     false,
            touchStartX:     0,
            slideRefs:       [],
            isMobile:        window.innerWidth < MOBILE_BREAKPOINT,
            circumference:   CIRCUMFERENCE,
        };
    },

    computed: {
        isActive() {
            const threshold = this.isMobile ? MOBILE_MIN_ITEMS : DESKTOP_MIN_ITEMS;
            return this.items.length > threshold;
        },

        ringStyle() {
            // Countdown ring: starts full, drains to 0 over AUTOPLAY_DURATION
            // stroke-dashoffset goes from 0 → circumference
            const offset = this.circumference * (1 - this.ringProgress);
            return {
                strokeDasharray:  `${this.circumference}`,
                strokeDashoffset: `${offset}`,
                transition:       'none',
            };
        },
    },

    mounted() {
        if (!this.isActive) return;
        this.$nextTick(() => {
            this._jumpToSlide(0, false);
            this._startAutoplay();
            this._setHeightVar();
        });
        window.addEventListener('resize', this._onResize);
    },

    beforeUnmount() {
        this._stopAutoplay();
        window.removeEventListener('resize', this._onResize);
    },

    methods: {
        // ── Slide ref tracking ────────────────────────────────────────────
        setSlideRef(el, idx) {
            if (el) this.slideRefs[idx] = el;
        },

        isSlideVisible(idx) {
            // Preload ±1 slide around current (for lazy loading content inside slides)
            return Math.abs(idx - this.currentIndex) <= 1;
        },

        // ── Navigation ────────────────────────────────────────────────────
        goTo(idx) {
            this.currentIndex = ((idx % this.items.length) + this.items.length) % this.items.length;
            this._scrollToSlide(this.currentIndex);
            this.$emit('change', this.currentIndex);
        },

        _scrollToSlide(idx) {
            const track = this.$refs.track;
            // Offset +1 because of the clone-last at index 0 in the DOM
            const slide = track?.children[idx + 1];
            if (!slide) return;
            const trackRect  = track.getBoundingClientRect();
            const slideRect  = slide.getBoundingClientRect();
            const scrollLeft = track.scrollLeft + slideRect.left - trackRect.left
                             - (trackRect.width - slideRect.width) / 2;
            track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        },

        _jumpToSlide(idx, smooth = false) {
            const track = this.$refs.track;
            const slide = track?.children[idx + 1];
            if (!slide) return;
            const trackRect  = track.getBoundingClientRect();
            const slideRect  = slide.getBoundingClientRect();
            const scrollLeft = track.scrollLeft + slideRect.left - trackRect.left
                             - (trackRect.width - slideRect.width) / 2;
            track.scrollTo({ left: scrollLeft, behavior: smooth ? 'smooth' : 'instant' });
        },

        // ── Infinite loop: handle scroll to clones ────────────────────────
        onScroll() {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this._checkInfiniteLoop();
            }, 50);
        },

        _checkInfiniteLoop() {
            const track = this.$refs.track;
            if (!track) return;

            const cloneLast  = this.$refs.cloneLast;
            const cloneFirst = this.$refs.cloneFirst;
            if (!cloneLast || !cloneFirst) return;

            const trackRect      = track.getBoundingClientRect();
            const cloneLastRect  = cloneLast.getBoundingClientRect();
            const cloneFirstRect = cloneFirst.getBoundingClientRect();

            const center = trackRect.left + trackRect.width / 2;

            // If clone-last is centered → jump to real last
            if (Math.abs(cloneLastRect.left + cloneLastRect.width / 2 - center) < cloneLastRect.width / 3) {
                this.currentIndex = this.items.length - 1;
                this._jumpToSlide(this.currentIndex);
                return;
            }

            // If clone-first is centered → jump to real first
            if (Math.abs(cloneFirstRect.left + cloneFirstRect.width / 2 - center) < cloneFirstRect.width / 3) {
                this.currentIndex = 0;
                this._jumpToSlide(this.currentIndex);
                return;
            }
        },

        // ── Button & dot handlers ─────────────────────────────────────────
        onPrevClick() {
            this._stopAutoplay();
            this.goTo(this.currentIndex - 1);
        },

        onNextClick() {
            this._stopAutoplay();
            this.goTo(this.currentIndex + 1);
        },

        onDotClick(idx) {
            this._stopAutoplay();
            this.goTo(idx);
        },

        // ── Touch / swipe ─────────────────────────────────────────────────
        onTouchStart(e) {
            this.touchStartX = e.touches[0].clientX;
        },

        onTouchEnd(e) {
            const delta = e.changedTouches[0].clientX - this.touchStartX;
            if (Math.abs(delta) > 40) {
                this._stopAutoplay();
                if (delta < 0) this.goTo(this.currentIndex + 1);
                else            this.goTo(this.currentIndex - 1);
            }
        },

        // ── Autoplay & countdown ring ─────────────────────────────────────
        _startAutoplay() {
            this.autoplayRunning = true;
            this.autoplayStart   = performance.now();
            this.autoplayElapsed = 0;
            this._tickRing();
        },

        _stopAutoplay() {
            this.autoplayRunning = false;
            if (this.rafId) cancelAnimationFrame(this.rafId);
            if (this.autoplayTimer) clearTimeout(this.autoplayTimer);
            this.rafId = null;
            this.autoplayTimer = null;
            this.ringProgress = 0;
        },

        _tickRing() {
            if (!this.autoplayRunning) return;

            const now     = performance.now();
            const elapsed = now - this.autoplayStart + this.autoplayElapsed;
            this.ringProgress = Math.min(elapsed / AUTOPLAY_DURATION, 1);

            if (elapsed >= AUTOPLAY_DURATION) {
                // Advance slide
                this.currentIndex = (this.currentIndex + 1) % this.items.length;
                this._scrollToSlide(this.currentIndex);
                this.$emit('change', this.currentIndex);
                // Reset ring
                this.autoplayElapsed = 0;
                this.autoplayStart   = performance.now();
                this.ringProgress    = 0;
            }

            this.rafId = requestAnimationFrame(() => this._tickRing());
        },

        // ── Resize ────────────────────────────────────────────────────────
        _onResize() {
            this.isMobile = window.innerWidth < MOBILE_BREAKPOINT;
            this._setHeightVar();
        },

        // ── Height CSS variable (for internal-description min-height) ─────
        _setHeightVar() {
            const firstSlide = this.slideRefs[0];
            if (!firstSlide) return;
            const h = firstSlide.getBoundingClientRect().height;
            if (h <= 0) return;
            // Set on the closest <section> ancestor
            const section = this.$el?.closest('section');
            if (section) {
                section.style.setProperty('--carousel-item-height', `${h}px`);
            }
        },
    },
};
</script>

<style lang="scss">
@import '../sass/_variables';
@import '../sass/_mixins';
@import '../sass/_placeholders';

// ─────────────────────────────────────────────────────────────────────────────
// Carousel
// ─────────────────────────────────────────────────────────────────────────────

$carousel-btn-size: to-rem($space-3xl);
$carousel-dot-size: to-rem($space-md);
$carousel-dot-pill: to-rem($space-xl);
$carousel-dot-gap:  to-rem($space-xs);
$ring-stroke:       2.5px;

.carousel {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    background-color: var(--black);

    // ── Track ──────────────────────────────────────────────────────────────
    &-track {
        display: flex;
        align-items: stretch;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none; // Firefox
        &::-webkit-scrollbar { display: none; } // Chrome/Safari
    }

    &-slide {
        flex: 0 0 auto;
        scroll-snap-align: center;
        display: flex;
        align-items: stretch;
        // Content outside viewport gets lazy-loaded via isVisible prop

        &--clone {
            pointer-events: none;
            user-select: none;
        }
    }

    // ── Controls row ───────────────────────────────────────────────────────
    &-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: to-rem($space-lg) to-rem($space-xl);
        gap: to-rem($space-lg);
        flex-wrap: wrap; // mobile: stacks gracefully if needed (no layout shift)
        min-height: calc(#{$carousel-btn-size} + #{to-rem($space-lg)} * 2);
        box-sizing: border-box;

        // Align to grid gutters on larger screens
        @include layout-768() {
            padding: to-rem($space-lg) to-rem(calc(($un-768 - $grid-max-area-768) / 2));
        }
        @include layout-1024() {
            padding: to-rem($space-lg) to-rem(calc(($un-1024 - $grid-max-area-1024) / 2));
        }
        @include layout-1440() {
            padding: to-rem($space-xl) to-rem(calc(($un-1440 - $grid-max-area-1440) / 2));
        }
        @include layout-1920() {
            padding: to-rem($space-xl) to-rem(calc(($un-1920 - $grid-max-area-1920) / 2));
        }
        @include layout-2560() {
            padding: to-rem($space-2xl) to-rem(calc(($un-2560 - $grid-max-area-2560) / 2));
        }
    }

    // ── Nav buttons ────────────────────────────────────────────────────────
    &-btn {
        @extend %RESETBTN;

        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width:  $carousel-btn-size;
        height: $carousel-btn-size;
        flex-shrink: 0;
        cursor: pointer;
        color: var(--grey);
        transition: color .2s ease;

        &:hover,
        &:focus {
            color: var(--white);
        }

        &-arrow {
            font-size: to-rem($space-lg);
            line-height: 1;
            position: relative;
            z-index: 1;
        }

        // Countdown ring SVG overlay
        &-ring {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            transform: rotate(-90deg); // start from top
            pointer-events: none;

            &-track {
                fill: none;
                stroke: var(--grey-3);
                stroke-width: $ring-stroke;
                opacity: .4;
            }

            &-fill {
                fill: none;
                stroke: var(--grey);
                stroke-width: $ring-stroke;
                stroke-linecap: round;
            }
        }
    }

    // ── Indicators (counter + dots) ────────────────────────────────────────
    &-indicators {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: to-rem($space-xs);
        flex: 1;
        min-width: 0;
    }

    &-counter {
        font-family: 'Raleway', sans-serif;
        font-weight: 200;
        font-size: to-rem($space-md);
        color: var(--grey);
        letter-spacing: to-rem($space-pixel);
        white-space: nowrap;

        @include layout-2560() {
            font-size: to-rem($space-lg);
        }
    }

    &-dots {
        display: flex;
        align-items: center;
        gap: $carousel-dot-gap;
        flex-wrap: wrap;
        justify-content: center;
    }

    &-dot {
        @extend %RESETBTN;

        display: block;
        height: $carousel-dot-size;
        width: $carousel-dot-size;
        border-radius: $carousel-dot-size;
        background: var(--grey-3);
        cursor: pointer;
        transition: width .25s ease, background .25s ease;

        &--active {
            width: $carousel-dot-pill;
            background: var(--grey);
        }

        &:hover:not(&--active) {
            background: var(--grey);
        }
    }

    // ── Fallback (below threshold) ─────────────────────────────────────────
    &-fallback {
        width: 100%;
        box-sizing: border-box;
        background-color: var(--black);
        overflow-x: scroll;
        scroll-snap-align: center;

        &::-webkit-scrollbar { height: to-rem($space-md); }
        &::-webkit-scrollbar-track { background: var(--black); }
        &::-webkit-scrollbar-thumb {
            border-radius: 3px;
            background: var(--grey-3);
            &:hover { background: var(--grey); }
        }

        // Mirror the original internal-extra-scroll padding
        display: block;
        white-space: nowrap;
        > * {
            display: inline-block;
        }
    }
}
</style>
