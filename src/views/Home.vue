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
              <img decoding="async" loading="lazy" class="home-mosaic-img"
                :src="storage + 'covers/' + item.image + ext" :alt="item.label" />
              <div class="home-mosaic-title-overlay">
                <h3 class="home-mosaic-title">{{ item.label }}</h3>
              </div>
            </div>
            <div class="home-mosaic-bottom" :style="cards[i] && cards[i].bottom">
              <div v-if="cards[i] && cards[i].bottomH > 0" class="home-mosaic-details">
                <p v-if="item.description" class="home-mosaic-desc">
                  <DrawText :text="item.description" :delay="8" />
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
          <img v-if="aboutTranslations && profilePicture" decoding="async" class="about-profile-picture-img"
            :src="profilePicture" :alt="aboutTranslations.title" width="400" height="400" />
          <div v-else class="about-profile-picture-placeholder"></div>
        </div>
        <div class="about-profile-text">
          <div class="about-profile-text-col">
            <template v-if="aboutTranslations">
              <p class="about-item-text" v-for="(t, n) in aboutTranslations.col1" :key="'c1-'+n" v-html="t"></p>
            </template>
            <div v-else>
              <p class="about-item-text skeleton--shimmer" style="width:100%;height:1.4em;border-radius:4px;margin-bottom:.6em"></p>
              <p class="about-item-text skeleton--shimmer" style="width:88%;height:1.4em;border-radius:4px;margin-bottom:.6em"></p>
              <p class="about-item-text skeleton--shimmer" style="width:70%;height:1.4em;border-radius:4px"></p>
            </div>
          </div>
          <div class="about-profile-text-col">
            <template v-if="aboutTranslations">
              <p class="about-item-text" v-for="(t, n) in aboutTranslations.col2" :key="'c2-'+n" v-html="t"></p>
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
import { getDatabase, ref, child, get } from 'firebase/database'
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
const FEAT_MULT  = 0.56
const COMP_MULTS = [0.56, 0.58, 0.54, 0.57, 0.55]  // same 16:9 aspect, smaller because narrower column
const BOTTOM_H   = 130

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
  },

  watch: {
    processedItems(v) {
      if (!v.length) return
      this.$nextTick(() => {
        this.layout()
        setTimeout(() => this.layout(), 60)
        setTimeout(() => this.layout(), 200)
      })
    },
    featuredLinks() { this.$nextTick(this.layout) },
  },

  methods: {
    isFeatured(item) {
      if (!item) return false
      if (item.featured === true || item.featured === 'true' || item.featured === 1) return true
      return item.link && this.featuredLinks.has(item.link)
    },

    // ── Variable-span masonry engine ─────────────────────────────────────────
    // ALL geometry (position, width, height) computed entirely in JS.
    // Uses a 12-unit base grid. Featured items span 4 units, compact 3 units.
    // Bin-packer finds the lowest available slot for each item's span.
    layout() {
      const el = this.$refs.mosaicEl
      if (!el || !this.processedItems.length) return
      const W = el.clientWidth
      if (!W) { setTimeout(this.layout, 50); return }

      const gap = 16

      // Responsive grid config
      let totalUnits, featUnits, compUnits
      if (W >= 900) {
        totalUnits = 12; featUnits = 4; compUnits = 2  // 3 feat/row, 6 comp/row
      } else if (W >= 580) {
        totalUnits = 6;  featUnits = 3; compUnits = 2  // 2 feat/row, 3 comp/row
      } else {
        totalUnits = 2;  featUnits = 2; compUnits = 1  // 1 feat/row, 2 comp/row
      }

      const unitW = Math.floor((W - gap * (totalUnits - 1)) / totalUnits)
      const colH  = Array(totalUnits).fill(0)

      this.cards = this.processedItems.map((item, i) => {
        const active  = this.hoveredIdx === i || this.touchIdx === i
        const bottomH = active ? BOTTOM_H : 0

        // Item width based on span
        const span   = item.featured ? featUnits : compUnits
        const itemW  = span * unitW + (span - 1) * gap
        const mult   = item.featured ? FEAT_MULT : COMP_MULTS[i % COMP_MULTS.length]
        const imageH = Math.round(itemW * mult)
        const totalH = imageH + bottomH

        // Find lowest available slot for this span
        let bestCol = 0, bestTop = Infinity
        for (let c = 0; c <= totalUnits - span; c++) {
          let top = 0
          for (let s = 0; s < span; s++) top = Math.max(top, colH[c + s])
          if (top < bestTop) { bestTop = top; bestCol = c }
        }

        const top  = bestTop
        const left = bestCol * (unitW + gap)
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

    onHover(i) { this.hoveredIdx = i; this.layout() },
    onLeave()  { this.hoveredIdx = null; this.layout() },

    onClick(item, i) {
      const isTouch = 'ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches
      if (isTouch) {
        if (this.touchIdx !== i) { this.touchIdx = i; this.layout() }
        else { this.$router.push('/portfolio/' + item.link) }
      } else {
        this.$router.push('/portfolio/' + item.link)
      }
    },

    skeletonStyle(n) {
      const W    = window.innerWidth
      const cols = W >= 900 ? 4 : W >= 580 ? 3 : 2
      const gap  = 16
      const colW = Math.floor((W - gap * (cols - 1)) / cols)
      const col  = (n - 1) % cols
      const row  = Math.floor((n - 1) / cols)
      return { position:'absolute', top:row*(180+gap)+'px', left:col*(colW+gap)+'px', width:colW+'px', height:'180px', borderRadius:'16px' }
    },
  },

  created() {
    const lang = this.$store.getters.getlang
    document.title = this.$route.meta.title

    get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation))
      .then(s => {
        if (s.exists()) {
          this.translations = s.val()
          if (this.translations?.portfoliolist) this.$store.commit('setPortfolioList', this.translations.portfoliolist)
        }
      }).catch(console.error)

    get(child(ref(getDatabase()), lang.database + lang.locale + '/components/related/projects'))
      .then(s => {
        if (s.exists()) {
          const links = new Set()
          Object.values(s.val()).forEach(p => { if (p.featured === true && p.link) links.add(p.link) })
          this.featuredLinks = links
          this.$nextTick(this.layout)
        }
      }).catch(console.error)

    get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + 'about'))
      .then(s => { if (s.exists()) this.aboutTranslations = s.val() }).catch(console.error)

    get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + 'about/profilePicture'))
      .then(s => { if (s.exists()) this.profilePicture = s.val() }).catch(console.error)
  },

  mounted() {
    if (!this.$route.meta?.scrollTo) setTimeout(() => window.scrollTo(0, 0), 500)
    window.addEventListener('resize', this.layout)
    this.$nextTick(() => {
      this.layout()
      setTimeout(this.layout, 100)
      setTimeout(this.layout, 350)
    })
  },

  beforeUnmount() { window.removeEventListener('resize', this.layout) },
}
</script>

<style lang="scss">
@import '../sass/home';
@import '../sass/about';
@import '../sass/contact';
@import '../sass/awards-footer';
</style>
