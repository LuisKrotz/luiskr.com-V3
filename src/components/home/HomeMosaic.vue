<template>
  <section class="home-portfolio-section">
    <h2 class="home-section-title">
      <DrawText v-if="translations" :text="translations.featured" />
      <span
        v-else
        class="skeleton--shimmer"
        style="display: inline-block; width: 40%; height: 1em; border-radius: 4px"
      ></span>
    </h2>

    <div
      v-if="processedItems.length"
      ref="mosaicEl"
      class="home-mosaic"
      :style="{ position: 'relative', width: '100%', height: containerH }"
    >
      <div
        v-for="(item, i) in processedItems"
        :key="i"
        class="home-mosaic-item"
        :class="{ 'home-mosaic-item--featured': item.featured }"
        :style="cards[i] && cards[i].card"
        @mouseenter="onHover(i)"
        @mouseleave="onLeave()"
        @click="onClick(item, i)"
      >
        <div class="home-mosaic-media" :style="cards[i] && cards[i].media">
          <img
            :decoding="i < 2 ? 'sync' : 'async'"
            :loading="i < 2 ? 'eager' : 'lazy'"
            :fetchpriority="i < 2 ? 'high' : 'auto'"
            class="home-mosaic-img"
            :src="storage + 'covers/' + item.image + ext"
            :alt="item.label"
            width="800"
            height="450"
          />
          <div class="home-mosaic-title-overlay">
            <h3 class="home-mosaic-title">{{ item.label }}</h3>
          </div>
        </div>
        <div class="home-mosaic-bottom" :style="cards[i] && cards[i].bottom">
          <div class="home-mosaic-details" :data-index="i">
            <p v-if="item.description" class="home-mosaic-desc">
              <DrawText
                v-if="hoveredIdx === i || touchIdx === i"
                :text="item.description"
                :delay="8"
              />
            </p>
            <button class="home-mosaic-btn">
              {{ (translations && translations.explore) || 'Check out' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      :style="{ position: 'relative', width: '100%', height: skeletonH, marginTop: '2rem' }"
    >
      <div v-for="n in 7" :key="n" class="skeleton--shimmer" :style="skeletonStyle(n)"></div>
    </div>
  </section>
</template>

<script>
import DrawText from '../DrawText.vue'

const FEAT_MULT = 0.48
const COMP_MULTS = [0.56, 0.58, 0.54, 0.57, 0.55]

export default {
  name: 'HomeMosaic',
  components: { DrawText },

  props: {
    processedItems: {
      type: Array,
      required: true,
      default: () => [],
    },
    translations: {
      type: [Object, Boolean],
      default: false,
    },
    storage: {
      type: String,
      required: true,
    },
    ext: {
      type: String,
      default: '.jpg',
    },
    hasTouch: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      hoveredIdx: null,
      touchIdx: null,
      cards: [],
      containerH: '0px',
      bottomHMap: {},
    }
  },

  computed: {
    skeletonH() {
      const vw = typeof window !== 'undefined' ? window.innerWidth : 375
      const pad =
        vw < 320 ? 13 : vw < 540 ? 21 : vw < 768 ? 34 : vw < 1024 ? 55 : vw < 1680 ? 89 : 144
      const W = vw - pad * 2
      const N =
        vw < 540
          ? 1
          : vw < 960
            ? 2
            : vw < 1440
              ? 3
              : vw < 1920
                ? 4
                : vw < 2100
                  ? 5
                  : vw < 2560
                    ? 6
                    : 7
      const gap = 16
      const colW = Math.floor((W - gap * (N - 1)) / N)
      const ITEMS = 12
      const colH = Array(N).fill(0)
      for (let i = 0; i < ITEMS; i++) {
        const imageH = Math.round(colW * COMP_MULTS[i % COMP_MULTS.length])
        let best = 0
        for (let c = 1; c < N; c++) if (colH[c] < colH[best]) best = c
        colH[best] += imageH + gap
      }
      return Math.max(...colH) - gap + 'px'
    },
  },

  watch: {
    processedItems: {
      immediate: true,
      handler(v) {
        if (!v || !v.length) return
        this.quickLayout()
        this.scheduleLayout()
      },
    },
  },

  methods: {
    scheduleLayout() {
      if (this._rafId) cancelAnimationFrame(this._rafId)
      this._rafId = requestAnimationFrame(this.layout)
    },

    quickLayout() {
      const vw = typeof window !== 'undefined' ? window.innerWidth : 0
      if (!vw || !this.processedItems.length) return

      const pad =
        vw < 320 ? 13 : vw < 540 ? 21 : vw < 768 ? 34 : vw < 1024 ? 55 : vw < 1680 ? 89 : 144
      const W = vw - pad * 2
      const gap = 16
      const N =
        vw < 540
          ? 1
          : vw < 960
            ? 2
            : vw < 1440
              ? 3
              : vw < 1920
                ? 4
                : vw < 2100
                  ? 5
                  : vw < 2560
                    ? 6
                    : 7
      const colW = Math.floor((W - gap * (N - 1)) / N)
      const colH = Array(N).fill(0)

      this.processedItems.forEach((item, i) => {
        const span = item.featured && N > 1 ? 2 : 1
        const itemW = span * colW + (span - 1) * gap
        const mult = item.featured ? FEAT_MULT : COMP_MULTS[i % COMP_MULTS.length]
        const imageH = Math.round(itemW * mult)

        let bestCol = 0,
          bestTop = Infinity
        for (let c = 0; c <= N - span; c++) {
          let top = 0
          for (let s = 0; s < span; s++) top = Math.max(top, colH[c + s])
          if (top < bestTop) {
            bestTop = top
            bestCol = c
          }
        }
        for (let s = 0; s < span; s++) colH[bestCol + s] = bestTop + imageH + gap
      })

      this.containerH = Math.max(...colH) - gap + 'px'
    },

    layout() {
      const el = this.$refs.mosaicEl
      if (!el || !this.processedItems.length) return
      const W = el.getBoundingClientRect().width
      if (!W) {
        this.scheduleLayout()
        return
      }

      const gap = 16
      const vw = window.innerWidth
      const N =
        vw < 540
          ? 1
          : vw < 960
            ? 2
            : vw < 1440
              ? 3
              : vw < 1920
                ? 4
                : vw < 2100
                  ? 5
                  : vw < 2560
                    ? 6
                    : 7
      const colW = Math.floor((W - gap * (N - 1)) / N)
      const colH = Array(N).fill(0)

      this.cards = this.processedItems.map((item, i) => {
        const active = this.hoveredIdx === i || this.touchIdx === i
        const bottomH = active ? (this.bottomHMap[i] ?? 130) : 0

        const span = item.featured && N > 1 ? 2 : 1
        const itemW = span * colW + (span - 1) * gap
        const mult = item.featured ? FEAT_MULT : COMP_MULTS[i % COMP_MULTS.length]
        const imageH = Math.round(itemW * mult)
        const totalH = imageH + bottomH

        let bestCol = 0,
          bestTop = Infinity
        for (let c = 0; c <= N - span; c++) {
          let top = 0
          for (let s = 0; s < span; s++) top = Math.max(top, colH[c + s])
          if (top < bestTop) {
            bestTop = top
            bestCol = c
          }
        }

        const top = bestTop
        const left = bestCol * (colW + gap)
        for (let s = 0; s < span; s++) colH[bestCol + s] = top + totalH + gap

        return {
          bottomH,
          card: {
            position: 'absolute',
            top: top + 'px',
            left: left + 'px',
            width: itemW + 'px',
            height: totalH + 'px',
            overflow: 'hidden',
          },
          media: {
            position: 'relative',
            width: '100%',
            height: imageH + 'px',
            overflow: 'hidden',
            flexShrink: '0',
          },
          bottom: { width: '100%', height: bottomH + 'px', overflow: 'hidden' },
        }
      })

      this.containerH = Math.max(...colH) - gap + 'px'
    },

    measureBottomH(i) {
      requestAnimationFrame(() => {
        const el = this.$el?.querySelector(`.home-mosaic-details[data-index="${i}"]`)
        if (el) {
          const h = el.scrollHeight
          if (h > 0) this.bottomHMap = { ...this.bottomHMap, [i]: h + 24 }
        }
      })
    },

    onHover(i) {
      this.hoveredIdx = i
      this.layout()
    },

    onLeave() {
      this.hoveredIdx = null
      this.layout()
    },

    onClick(item, i) {
      const isTouch = 'ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches
      const locale = this.$store.getters.getLang
      const prefix = locale && locale !== 'en' ? '/' + locale : ''
      const dest = prefix + '/portfolio/' + item.link

      if (isTouch) {
        if (this.touchIdx !== i) {
          this.touchIdx = i
          this.layout()
        } else {
          this.$router.push(dest)
        }
      } else {
        this.$router.push(dest)
      }
    },

    skeletonStyle(n) {
      const vw = window.innerWidth
      const pad =
        vw < 320 ? 13 : vw < 540 ? 21 : vw < 768 ? 34 : vw < 1024 ? 55 : vw < 1680 ? 89 : 144
      const W = vw - pad * 2
      const N = vw < 540 ? 1 : vw < 960 ? 2 : vw < 1440 ? 3 : vw < 1920 ? 4 : vw < 2560 ? 5 : 6
      const gap = 16
      const colW = Math.floor((W - gap * (N - 1)) / N)
      const col = (n - 1) % N
      const row = Math.floor((n - 1) / N)
      return {
        position: 'absolute',
        top: row * (180 + gap) + 'px',
        left: col * (colW + gap) + 'px',
        width: colW + 'px',
        height: '180px',
        borderRadius: '16px',
      }
    },
  },

  mounted() {
    let _layoutTimer = null
    this._debouncedLayout = () => {
      clearTimeout(_layoutTimer)
      _layoutTimer = setTimeout(() => this.layout(), 150)
    }
    window.addEventListener('resize', this._debouncedLayout, { passive: true })
    this.$nextTick(() => this.layout())
  },

  beforeUnmount() {
    window.removeEventListener('resize', this._debouncedLayout)
  },
}
</script>

<style lang="scss">
@import '../../sass/home-mosaic';
</style>
