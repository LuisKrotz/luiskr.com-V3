<template>
  <article :class="has_touch ? 'has_touch' : ''">
    <div id="home">
      <!-- ── Portfolio Showcase Grid ─────────────────────────────────── -->
      <section class="home-portfolio-section">
        <h2 class="home-section-title">
          <DrawText v-if="translations" :text="translations.featured" />
          <span v-else class="skeleton--shimmer" style="display: inline-block; width: 40%; height: 1em; border-radius: 4px"></span>
        </h2>

        <div
          v-if="processedItems.length"
          ref="mosaicContainer"
          class="home-mosaic"
          :style="{ height: containerHeight }"
        >
          <router-link
            v-for="(item, idx) in processedItems"
            :key="idx"
            :to="'/portfolio/' + item.link"
            class="home-mosaic-item"
            :class="{
              'home-mosaic-item--featured': item.featured,
              'home-mosaic-item--hovered': hoveredIndex === idx
            }"
            :style="itemStyles[idx] || {}"
            @mouseenter="onHover(idx)"
            @mouseleave="onLeave()"
            @click="handleItemClick($event, item, idx)"
          >
            <div class="home-mosaic-media">
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

            <div class="home-mosaic-bottom" :style="isActive(idx) ? activeBottomStyle : {}">
              <div v-if="isActive(idx)" class="home-mosaic-details">
                <p v-if="item.description" class="home-mosaic-desc">
                  <DrawText :text="item.description" :delay="8" />
                </p>
                <button class="home-mosaic-btn">
                  {{ (translations && translations.explore) || 'Check out' }}
                </button>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Skeleton while loading -->
        <div
          v-else
          class="home-mosaic"
          style="min-height: 500px; position: relative;"
        >
          <div
            v-for="n in 7"
            :key="n"
            class="skeleton--shimmer"
            :style="skeletonStyle(n)"
          ></div>
        </div>
      </section>
    </div>

    <!-- ── About Section ───────────────────────────────────────── -->
    <section id="about" class="about">
      <h2 class="about-title">
        <DrawText v-if="aboutTranslations" :text="aboutTranslations.title" trigger="viewport" />
        <span v-else class="skeleton--shimmer" style="display: inline-block; width: 40%; height: 1em; border-radius: 4px"></span>
      </h2>

      <div class="about-profile-section">
        <div class="about-profile-picture">
          <img
            v-if="aboutTranslations && profilePicture"
            decoding="async"
            class="about-profile-picture-img"
            :src="profilePicture"
            :alt="aboutTranslations.title"
            width="400"
            height="400"
          />
          <div v-else class="about-profile-picture-placeholder"></div>
        </div>

        <div class="about-profile-text">
          <div class="about-profile-text-col">
            <template v-if="aboutTranslations">
              <p
                class="about-item-text"
                v-for="(item, n) in aboutTranslations.col1"
                :key="'c1-' + n"
                v-html="item"
              ></p>
            </template>
            <div v-else>
              <p class="about-item-text skeleton--shimmer" style="width: 100%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"></p>
              <p class="about-item-text skeleton--shimmer" style="width: 92%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"></p>
              <p class="about-item-text skeleton--shimmer" style="width: 85%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"></p>
              <p class="about-item-text skeleton--shimmer" style="width: 60%; height: 1.4em; border-radius: 4px"></p>
            </div>
          </div>
          <div class="about-profile-text-col">
            <template v-if="aboutTranslations">
              <p
                class="about-item-text"
                v-for="(item, n) in aboutTranslations.col2"
                :key="'c2-' + n"
                v-html="item"
              ></p>
            </template>
            <div v-else>
              <p class="about-item-text skeleton--shimmer" style="width: 95%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"></p>
              <p class="about-item-text skeleton--shimmer" style="width: 88%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"></p>
              <p class="about-item-text skeleton--shimmer" style="width: 78%; height: 1.4em; border-radius: 4px"></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div id="contact">
      <Contact />
    </div>
    <AwardsMentions :title="mentions.title" :items="mentions.items" />
  </article>
</template>

<script>
import { getDatabase, ref, child, get } from 'firebase/database'
import Contact from '../components/Contact.vue'
import AwardsMentions from '../components/AwardsMentions.vue'
import DrawText from '../components/DrawText.vue'

// Heights are colW-proportional so they're NEVER square at any resolution.
// Featured: colW * 0.60 → 5:3 landscape (e.g. 356×214px at 1280 — clearly wide)
// Compact rotates through 0.40–0.50 multipliers → 2:1 to 2.5:1 widescreen
const FEATURED_MULT = 0.60
const COMPACT_MULTS = [0.48, 0.52, 0.44, 0.50, 0.46]
const EXPAND_DELTA = 130

export default {
  name: 'Home',
  components: { Contact, AwardsMentions, DrawText },

  data() {
    return {
      loading: this.$store.getters.getlang.loading,
      storage: this.$store.getters.getStorage,
      translations: false,
      has_touch: this.$store.getters.getTouch,
      ext: '.jpg',
      featuredLinks: new Set(),
      hoveredIndex: null,
      activeTouchIndex: null,
      aboutTranslations: false,
      profilePicture: null,
      // Layout engine outputs:
      itemStyles: [],
      containerHeight: '600px',
    }
  },

  computed: {
    mentions() {
      return this.$store.getters.getMentions
    },

    processedItems() {
      if (!this.translations?.portfoliolist) return []
      const raw = Array.isArray(this.translations.portfoliolist)
        ? this.translations.portfoliolist
        : Object.values(this.translations.portfoliolist)
      // Preserve exact DB order — no sorting or interleaving
      return raw.map((item) => ({ ...item, featured: this.isFeatured(item) }))
    },

    activeBottomStyle() {
      return {
        maxHeight: '200px',
        padding: '16px 20px 24px',
        opacity: '1',
      }
    },
  },

  watch: {
    processedItems(val) {
      if (!val.length) return
      // Retry up to 5 times in case the container hasn't painted yet
      this.$nextTick(() => {
        this.layoutMasonry()
        setTimeout(() => this.layoutMasonry(), 50)
        setTimeout(() => this.layoutMasonry(), 150)
      })
    },
    featuredLinks() {
      this.$nextTick(this.layoutMasonry)
    },
  },

  methods: {
    isFeatured(item) {
      if (!item) return false
      if (item.featured === true || item.featured === 'true' || item.featured === 1) return true
      if (item.link && this.featuredLinks.has(item.link)) return true
      return false
    },

    isActive(idx) {
      return this.hoveredIndex === idx || this.activeTouchIndex === idx
    },

    baseHeight(item, idx, colW) {
      if (item.featured) return Math.round(colW * FEATURED_MULT)
      return Math.round(colW * COMPACT_MULTS[idx % COMPACT_MULTS.length])
    },

    cardHeight(item, idx, colW) {
      return this.baseHeight(item, idx, colW) + (this.isActive(idx) ? EXPAND_DELTA : 0)
    },

    layoutMasonry() {
      const container = this.$refs.mosaicContainer
      if (!container || !this.processedItems.length) return
      const W = container.clientWidth
      if (!W) { setTimeout(() => this.layoutMasonry(), 50); return }

      // Responsive column count — re-evaluated on every resize
      // More columns = narrower cards; fewer = wider cards.
      // Heights scale via aspect ratio so images always look right.
      const cols = W >= 1100 ? 3 : W >= 700 ? 2 : 1
      const gap = 16
      const colW = Math.floor((W - gap * (cols - 1)) / cols)
      const colH = Array(cols).fill(0)

      this.itemStyles = this.processedItems.map((item, idx) => {
        const h = this.cardHeight(item, idx, colW)

        // Shortest-column bin-packing: always fills the lowest column, zero gaps
        let col = 0
        for (let i = 1; i < cols; i++) {
          if (colH[i] < colH[col]) col = i
        }
        const top = colH[col]
        const left = col * (colW + gap)
        colH[col] = top + h + gap
        return { position: 'absolute', top: top + 'px', left: left + 'px', width: colW + 'px', height: h + 'px' }
      })

      this.containerHeight = Math.max(...colH) - gap + 'px'
    },

    onHover(idx) {
      this.hoveredIndex = idx
      this.layoutMasonry()
    },

    onLeave() {
      this.hoveredIndex = null
      this.layoutMasonry()
    },

    handleItemClick(e, item, idx) {
      const isTouch =
        this.has_touch ||
        'ontouchstart' in window ||
        window.matchMedia('(pointer: coarse)').matches

      if (isTouch && this.activeTouchIndex !== idx) {
        e.preventDefault()
        e.stopPropagation()
        this.activeTouchIndex = idx
        this.layoutMasonry()
        return false
      }
    },

    // Provide rough skeleton positions while loading
    skeletonStyle(n) {
      const W = window.innerWidth
      const cols = W >= 900 ? 3 : W >= 560 ? 2 : 1
      const gap = 20
      const colW = Math.floor((W - gap * (cols - 1)) / cols)
      const col = (n - 1) % cols
      const row = Math.floor((n - 1) / cols)
      return {
        position: 'absolute',
        top: row * (260 + gap) + 'px',
        left: col * (colW + gap) + 'px',
        width: colW + 'px',
        height: '260px',
        borderRadius: '16px',
      }
    },
  },

  created() {
    const lang = this.$store.getters.getlang
    document.title = this.$route.meta.title

    get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation))
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.translations = snapshot.val()
          if (this.translations?.portfoliolist) {
            this.$store.commit('setPortfolioList', this.translations.portfoliolist)
          }
        }
      })
      .catch(console.error)

    get(child(ref(getDatabase()), lang.database + lang.locale + '/components/related/projects'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const links = new Set()
          Object.values(snapshot.val()).forEach((p) => {
            if (p.featured === true && p.link) links.add(p.link)
          })
          this.featuredLinks = links
          this.$nextTick(this.layoutMasonry)
        }
      })
      .catch(console.error)

    get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + 'about'))
      .then((snapshot) => {
        if (snapshot.exists()) this.aboutTranslations = snapshot.val()
      })
      .catch(console.error)

    get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + 'about/profilePicture'))
      .then((snapshot) => {
        if (snapshot.exists()) this.profilePicture = snapshot.val()
      })
      .catch(console.error)
  },

  mounted() {
    if (!this.$route.meta?.scrollTo) {
      setTimeout(() => window.scrollTo(0, 0), 500)
    }
    window.addEventListener('resize', this.layoutMasonry)
    this.$nextTick(() => {
      this.layoutMasonry()
      setTimeout(() => this.layoutMasonry(), 100)
      setTimeout(() => this.layoutMasonry(), 300)
    })
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.layoutMasonry)
  },
}
</script>

<style lang="scss">
@import '../sass/home';
@import '../sass/about';
@import '../sass/contact';
@import '../sass/awards-footer';
</style>
