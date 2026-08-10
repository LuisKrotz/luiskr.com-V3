<template>
  <article :class="has_touch ? 'has_touch' : ''">
    <div id="home">
      <section class="home-portfolio-section">
        <h2 class="home-section-title">
          <DrawText v-if="translations" :text="translations.featured" />
          <span v-else class="skeleton--shimmer" style="display:inline-block;width:40%;height:1em;border-radius:4px"></span>
        </h2>

        <!-- ── Masonry grid — ALL geometry set by layoutMasonry() in JS ── -->
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
            <!-- Image cover — height set entirely by JS -->
            <div class="home-mosaic-media" :style="cards[i] && cards[i].media">
              <img
                decoding="async"
                loading="lazy"
                class="home-mosaic-img"
                :src="storage + 'covers/' + item.image + ext"
                :alt="item.label"
              />
              <div class="home-mosaic-title-overlay">
                <h3 class="home-mosaic-title">{{ item.label }}</h3>
              </div>
            </div>

            <!-- Description panel — height set entirely by JS -->
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

        <!-- Loading skeleton -->
        <div v-else style="position:relative;width:100%;height:500px;margin-top:2rem">
          <div
            v-for="n in 7"
            :key="n"
            class="skeleton--shimmer"
            :style="skeletonStyle(n)"
          ></div>
        </div>
      </section>
    </div>

    <!-- About -->
    <section id="about" class="about">
      <h2 class="about-title">
        <DrawText v-if="aboutTranslations" :text="aboutTranslations.title" trigger="viewport" />
        <span v-else class="skeleton--shimmer" style="display:inline-block;width:40%;height:1em;border-radius:4px"></span>
      </h2>
      <div class="about-profile-section">
        <div class="about-profile-picture">
          <img v-if="aboutTranslations && profilePicture" decoding="async" class="about-profile-picture-img" :src="profilePicture" :alt="aboutTranslations.title" width="400" height="400" />
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

//
// ── Masonry constants ────────────────────────────────────────────────────────
//
// ALL sizing is JS-only. CSS only handles colours, fonts, border-radius, etc.
//
// imageH  = colW * multiplier  →  landscape aspect ratio, never square
// featured uses a taller multiplier so it clearly stands out
// BOTTOM_H is the fixed-height description panel shown on hover/tap
//
// Featured span 2 cols so their width is ~2x colW.
// FEAT_MULT applies to itemW (the 2-col width), not colW.
// 0.40 × 750px = 300px → 2.5:1 cinematic widescreen, clearly landscape, not square.
const FEAT_MULT  = 0.40
const COMP_MULTS = [0.34, 0.38, 0.32, 0.36, 0.33] // compact   image heights (vary for masonry stagger)
const BOTTOM_H     = 130                            // px, description panel when expanded

export default {
  name: 'Home',
  components: { Contact, AwardsMentions, DrawText },

  data() {
    return {
      storage:      this.$store.getters.getStorage,
      translations: false,
      has_touch:    this.$store.getters.getTouch,
      ext:          '.jpg',
      featuredLinks: new Set(),
      hoveredIdx:   null,
      touchIdx:     null,
      aboutTranslations: false,
      profilePicture:    null,
      // Layout engine outputs
      cards:       [],   // [{ card, media, bottom, bottomH }]
      containerH:  '0px',
    }
  },

  computed: {
    mentions()       { return this.$store.getters.getMentions },
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

    // ── Core masonry engine ───────────────────────────────────────────────
    // ALL geometry (position, width, height) computed entirely in JS.
    // CSS only handles transitions and visuals.
    layout() {
      const el = this.$refs.mosaicEl
      if (!el || !this.processedItems.length) return
      const W = el.clientWidth
      if (!W) { setTimeout(this.layout, 50); return }

      const cols  = W >= 1100 ? 3 : W >= 700 ? 2 : 1
      const gap   = 16
      const colW  = Math.floor((W - gap * (cols - 1)) / cols)
      const colH  = Array(cols).fill(0)

      this.cards = this.processedItems.map((item, i) => {
        const active  = this.hoveredIdx === i || this.touchIdx === i
        const bottomH = active ? BOTTOM_H : 0

        // Featured span 2 cols when ≥2 cols available — both width AND height differ
        const span   = (item.featured && cols >= 2) ? 2 : 1
        const itemW  = span === 2 ? colW * 2 + gap : colW
        const mult   = item.featured ? FEAT_MULT : COMP_MULTS[i % COMP_MULTS.length]
        const imageH = Math.round(itemW * mult)
        const totalH = imageH + bottomH

        let top, left

        if (span === 2) {
          // Find adjacent pair with lowest combined top
          let bestPair = 0
          let bestTop  = Math.max(colH[0], colH[1])
          for (let c = 0; c <= cols - 2; c++) {
            const t = Math.max(colH[c], colH[c + 1])
            if (t < bestTop) { bestTop = t; bestPair = c }
          }
          top  = bestTop
          left = bestPair * (colW + gap)
          colH[bestPair]     = top + totalH + gap
          colH[bestPair + 1] = top + totalH + gap
        } else {
          // Shortest single column
          let col = 0
          for (let c = 1; c < cols; c++) if (colH[c] < colH[col]) col = c
          top  = colH[col]
          left = col * (colW + gap)
          colH[col] = top + totalH + gap
        }

        return {
          bottomH,
          card: {
            position: 'absolute',
            top:      top + 'px',
            left:     left + 'px',
            width:    itemW + 'px',
            height:   totalH + 'px',
            overflow: 'hidden',
          },
          media: {
            position:   'relative',
            width:      '100%',
            height:     imageH + 'px',
            overflow:   'hidden',
            flexShrink: '0',
          },
          bottom: {
            width:    '100%',
            height:   bottomH + 'px',
            overflow: 'hidden',
          },
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
      const cols = W >= 1100 ? 3 : W >= 700 ? 2 : 1
      const gap  = 16
      const colW = Math.floor((W - gap * (cols - 1)) / cols)
      const col  = (n - 1) % cols
      const row  = Math.floor((n - 1) / cols)
      return { position:'absolute', top:row*(200+gap)+'px', left:col*(colW+gap)+'px', width:colW+'px', height:'200px', borderRadius:'16px' }
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
