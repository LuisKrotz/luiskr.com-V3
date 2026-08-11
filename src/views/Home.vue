<template>
  <article :class="has_touch ? 'has_touch' : ''">
    <div id="home">
      <section class="home-portfolio-section">
        <h2 class="home-section-title">
          <DrawText v-if="translations" :text="translations.featured" />
          <span v-else class="skeleton--shimmer" style="display:inline-block;width:40%;height:1em;border-radius:4px"></span>
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
                :decoding="i === 0 ? 'sync' : 'async'"
                :loading="i === 0 ? 'eager' : 'lazy'"
                :fetchpriority="i === 0 ? 'high' : 'auto'"
                class="home-mosaic-img"
                :src="storage + 'covers/' + item.image + ext"
                :alt="item.label"
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

        <div v-else style="position:relative;width:100%;height:500px;margin-top:2rem">
          <div v-for="n in 7" :key="n" class="skeleton--shimmer" :style="skeletonStyle(n)"></div>
        </div>
      </section>
    </div>

    <section id="about" class="about">
      <h2 class="about-title">
        <DrawText v-if="aboutTranslations" :text="aboutTranslations.title" trigger="viewport" />
        <span v-else class="skeleton--shimmer" style="display:inline-block;width:40%;height:1em;border-radius:4px"></span>
      </h2>
      <div class="about-profile-section">
        <div class="about-profile-picture">
          <img v-if="aboutTranslations && profilePicture" decoding="async" loading="lazy" class="about-profile-picture-img"
            :src="optimizedProfilePicture" :srcset="profilePictureSrcset" sizes="200px" :alt="aboutTranslations.title" width="200" height="200" />
          <div v-else class="about-profile-picture-placeholder"></div>
        </div>
        <div class="about-profile-text">
          <div class="about-profile-text-col">
            <template v-if="aboutTranslations">
              <p class="about-item-text" v-for="item in aboutDrawData.col1" :key="item.key">
                <DrawText :text="item.text" :delay="aboutDrawData.charDelay" :offset="item.offset" trigger="viewport" />
              </p>
            </template>
            <div v-else>
              <p class="about-item-text skeleton--shimmer" style="width:100%;height:1.4em;border-radius:4px;margin-bottom:.6em"></p>
              <p class="about-item-text skeleton--shimmer" style="width:88%;height:1.4em;border-radius:4px;margin-bottom:.6em"></p>
              <p class="about-item-text skeleton--shimmer" style="width:70%;height:1.4em;border-radius:4px"></p>
            </div>
          </div>
          <div class="about-profile-text-col">
            <template v-if="aboutTranslations">
              <p class="about-item-text" v-for="item in aboutDrawData.col2" :key="item.key">
                <DrawText :text="item.text" :delay="aboutDrawData.charDelay" :offset="item.offset" trigger="viewport" />
              </p>
            </template>
            <div v-else>
              <p class="about-item-text skeleton--shimmer" style="width:95%;height:1.4em;border-radius:4px;margin-bottom:.6em"></p>
              <p class="about-item-text skeleton--shimmer" style="width:80%;height:1.4em;border-radius:4px"></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div id="contact"><Contact /></div>
    <AwardsMentions :title="mentions.title" :items="mentions.items" />
  </article>
</template>

<script>
import { fetchFirebaseDb } from '../firebase.js'
import Contact from '../components/Contact.vue'
import AwardsMentions from '../components/AwardsMentions.vue'
import DrawText from '../components/DrawText.vue'

// ── Masonry constants ─────────────────────────────────────────────────────────
// ALL geometry is JS-only. CSS only handles colours, fonts, border-radius, etc.
//
// 12-unit base grid at desktop:
//   Featured items span 4 units → 1/3 of row (3 featured fit per full row)
//   Compact  items span 3 units → 1/4 of row (4 compact  fit per full row)
//
// Heights = itemWidth × multiplier — always landscape, never square or strip.
// FEAT_MULT applied to featured itemW (~356px) → proper landscape card
// COMP_MULTS applied to compact itemW (~263px) → slightly shorter compact card
const FEAT_MULT  = 0.48   // 2.08:1 ratio — wider, less tall than 16:9
const COMP_MULTS = [0.56, 0.58, 0.54, 0.57, 0.55]  // same 16:9 aspect, smaller because narrower column
// BOTTOM_H is measured dynamically from the DOM — see measureBottomH()

export default {
  name: 'Home',
  components: { Contact, AwardsMentions, DrawText },

  data() {
    return {
      storage:           this.$store.getters.getStorage,
      translations:      false,
      has_touch:         this.$store.getters.getTouch,
      ext:               '.jpg',
      featuredLinks:     new Set(),
      hoveredIdx:        null,
      touchIdx:          null,
      aboutTranslations: false,
      profilePicture:    null,
      cards:             [],
      containerH:        '0px',
      bottomHMap:        {},   // per-card measured description height, keyed by item index
    }
  },

  computed: {
    mentions() { return this.$store.getters.getMentions },
    processedItems() {
      if (!this.translations?.portfoliolist) return []
      const raw = Array.isArray(this.translations.portfoliolist)
        ? this.translations.portfoliolist
        : Object.values(this.translations.portfoliolist)
      return raw.map(item => ({ ...item, featured: this.isFeatured(item) }))
    },

    optimizedProfilePicture() {
      if (!this.profilePicture) return ''
      if (typeof this.profilePicture === 'string' && this.profilePicture.includes('gravatar.com')) {
        return this.profilePicture.replace(/size=\d+/, 'size=400')
      }
      return this.profilePicture
    },
    profilePictureSrcset() {
      if (typeof this.profilePicture === 'string' && this.profilePicture.includes('gravatar.com')) {
        const base = this.profilePicture.replace(/(\?|&)size=\d+/, '')
        const sep = base.includes('?') ? '&' : '?'
        return `${base}${sep}size=200 1x, ${base}${sep}size=400 2x, ${base}${sep}size=600 3x`
      }
      return undefined
    },
    aboutDrawData() {
      const col1 = this.aboutTranslations?.col1 || []
      const col2 = this.aboutTranslations?.col2 || []
      const all  = [...col1, ...col2]

      const strip = s => s.replace(/<[^>]+>/g, '')  // strip HTML tags for char count
      const totalChars = all.reduce((s, t) => s + strip(t).length, 0)
      // charDelay: each char animates at this speed; clamp to 3–20ms
      const charDelay = totalChars > 0 ? Math.max(3, Math.min(20, Math.round(2000 / totalChars))) : 8

      let offset = 0
      const withOffsets = all.map((text, idx) => {
        const item = { key: idx, text, offset }
        offset += strip(text).length * charDelay
        return item
      })

      return {
        charDelay,
        col1: withOffsets.slice(0, col1.length),
        col2: withOffsets.slice(col1.length),
      }
    },
  },

  watch: {
    processedItems(v) {
      if (!v.length) return
      this.$nextTick(this.layout)
    },
    featuredLinks() { this.$nextTick(this.layout) },
  },

  methods: {
    isFeatured(item) {
      if (!item) return false
      if (item.featured === true || item.featured === 'true' || item.featured === 1) return true
      return item.link && this.featuredLinks.has(item.link)
    },

    // ── Simple N-column masonry ───────────────────────────────────────────────
    // ALL geometry (position, width, height) computed entirely in JS.
    //
    // Grid = N equal columns. Featured spans 2 cols. Compact spans 1 col.
    // Bin-packer scans N column heights and places each item at the lowest slot.
    // Gap is always exactly `gap` pixels between any two adjacent cards.
    layout() {
      const el = this.$refs.mosaicEl
      if (!el || !this.processedItems.length) return
      const W = el.clientWidth
      if (!W) { setTimeout(this.layout, 50); return }

      const gap = 16

      // ── N explicitly mapped to project CSS breakpoints ────────────────────
      // Mirrors _mixins.scss breakpoints: 540 / 960 / 1440 / 1920 / 2560
      // colW = (W - gap*(N-1)) / N  →  always fills the container exactly.
      // Featured spans 2 cols, compact 1.
      //
      // Resulting compact / featured widths (at key viewports):
      //   375px  (W≈333):  N=1  →  full-width
      //   768px  (W≈658):  N=2  →  compact≈321px   feat≈658px
      //   960px  (W≈850):  N=3  →  compact≈272px   feat≈560px
      //  1280px  (W≈1102): N=3  →  compact≈362px   feat≈740px
      //  1440px  (W≈1262): N=4  →  compact≈303px   feat≈622px
      //  1680px  (W≈1392): N=4  →  compact≈341px   feat≈698px
      //  1920px  (W≈1632): N=5  →  compact≈313px   feat≈642px
      //  2560px  (W≈2094): N=6  →  compact≈335px   feat≈686px
      const vw = window.innerWidth
      const N  = vw < 540  ? 1
               : vw < 960  ? 2
               : vw < 1440 ? 3
               : vw < 1920 ? 4
               : vw < 2100 ? 5   // 1920–2099px: 5 cols
               : vw < 2560 ? 6   // 2100–2559px: 6 cols → 3 featured per row at 2294px
               : 7
      const colW = Math.floor((W - gap * (N - 1)) / N)
      const colH = Array(N).fill(0)

      this.cards = this.processedItems.map((item, i) => {
        const active  = this.hoveredIdx === i || this.touchIdx === i
        const bottomH = active ? (this.bottomHMap[i] ?? 130) : 0

        // Featured: 2 cols wide (or 1 when N=1). Compact: always 1 col.
        const span   = (item.featured && N > 1) ? 2 : 1
        const itemW  = span * colW + (span - 1) * gap
        const mult   = item.featured ? FEAT_MULT : COMP_MULTS[i % COMP_MULTS.length]
        const imageH = Math.round(itemW * mult)
        const totalH = imageH + bottomH

        // Find lowest starting column for this span
        let bestCol = 0, bestTop = Infinity
        for (let c = 0; c <= N - span; c++) {
          let top = 0
          for (let s = 0; s < span; s++) top = Math.max(top, colH[c + s])
          if (top < bestTop) { bestTop = top; bestCol = c }
        }

        const top  = bestTop
        const left = bestCol * (colW + gap)
        for (let s = 0; s < span; s++) colH[bestCol + s] = top + totalH + gap

        return {
          bottomH,
          card:   { position:'absolute', top:top+'px', left:left+'px', width:itemW+'px', height:totalH+'px', overflow:'hidden' },
          media:  { position:'relative', width:'100%', height:imageH+'px', overflow:'hidden', flexShrink:'0' },
          bottom: { width:'100%', height:bottomH+'px', overflow:'hidden' },
        }
      })

      this.containerH = Math.max(...colH) - gap + 'px'
    },

    // Pre-measure ALL cards' description heights upfront via RAF batching.
    async measureAll() {
      await this.$nextTick()
      requestAnimationFrame(() => {
        const details = this.$el?.querySelectorAll('.home-mosaic-details')
        if (!details || !details.length) return
        const map = {}
        details.forEach(el => {
          const idx = parseInt(el.dataset.index)
          const h = el.scrollHeight
          if (!isNaN(idx) && h > 0) map[idx] = h + 24   // +24 padding buffer
        })
        this.bottomHMap = map
      })
    },

    // Per-card re-measure on hover
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
      this.$nextTick(() => { this.measureBottomH(i); this.layout() })
    },
    onLeave() {
      this.hoveredIdx = null
      this.layout()
    },

    onClick(item, i) {
      const isTouch = 'ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches
      const locale  = this.$store.getters.getLang
      const prefix  = locale && locale !== 'en' ? '/' + locale : ''
      const dest    = prefix + '/portfolio/' + item.link

      if (isTouch) {
        if (this.touchIdx !== i) {
          this.touchIdx = i
          this.$nextTick(() => { this.measureBottomH(i); this.layout() })
        } else {
          this.$router.push(dest)
        }
      } else {
        this.$router.push(dest)
      }
    },

    skeletonStyle(n) {
      const vw  = window.innerWidth
      const pad = vw < 320 ? 13 : vw < 540 ? 21 : vw < 768 ? 34 : vw < 1024 ? 55 : vw < 1680 ? 89 : 144
      const W   = vw - pad * 2
      const N   = vw < 540 ? 1 : vw < 960 ? 2 : vw < 1440 ? 3 : vw < 1920 ? 4 : vw < 2560 ? 5 : 6
      const gap = 16
      const colW = Math.floor((W - gap * (N - 1)) / N)
      const col  = (n - 1) % N
      const row  = Math.floor((n - 1) / N)
      return { position:'absolute', top:row*(180+gap)+'px', left:col*(colW+gap)+'px', width:colW+'px', height:'180px', borderRadius:'16px' }
    },
  },

  created() {
    const lang = this.$store.getters.getlang
    document.title = this.$route.meta.title

    fetchFirebaseDb(lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation)
      .then(s => {
        if (s.exists()) {
          this.translations = s.val()
          if (this.translations?.portfoliolist) this.$store.commit('setPortfolioList', this.translations.portfoliolist)
        }
      }).catch(console.error)

    fetchFirebaseDb(lang.database + lang.locale + '/components/related/projects')
      .then(s => {
        if (s.exists()) {
          const links = new Set()
          Object.values(s.val()).forEach(p => { if (p.featured === true && p.link) links.add(p.link) })
          this.featuredLinks = links
          this.$nextTick(this.layout)
        }
      }).catch(console.error)

    fetchFirebaseDb(lang.database + lang.locale + lang.pagesPath + 'about')
      .then(s => { if (s.exists()) this.aboutTranslations = s.val() }).catch(console.error)

    fetchFirebaseDb(lang.database + lang.locale + lang.pagesPath + 'about/profilePicture')
      .then(s => { if (s.exists()) this.profilePicture = s.val() }).catch(console.error)
  },

  mounted() {
    if (!this.$route.meta?.scrollTo) setTimeout(() => window.scrollTo(0, 0), 500)

    // Debounce resize \u2014 layout() is expensive, don't run it on every pixel of resize
    let _layoutTimer = null
    this._debouncedLayout = () => {
      clearTimeout(_layoutTimer)
      _layoutTimer = setTimeout(() => this.layout(), 150)
    }
    window.addEventListener('resize', this._debouncedLayout, { passive: true })

    this.$nextTick(() => {
      this.layout()
      setTimeout(this.layout, 100)
      setTimeout(this.layout, 350)
    })
  },

  beforeUnmount() { window.removeEventListener('resize', this._debouncedLayout) },
}
</script>

<style lang="scss">
@import '../sass/home';
@import '../sass/about';
@import '../sass/contact';
@import '../sass/awards-footer';
</style>
