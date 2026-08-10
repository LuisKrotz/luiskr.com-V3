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

// Non-featured: compact tiles — clearly smaller than featured
const COMPACT_HEIGHTS = [155, 175, 140, 165, 150]

// Featured: 2.5x taller than compact — obviously bigger, same column width
const FEATURED_HEIGHT = 380

// Extra height when hovered/expanded
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

      // Tag each item
      const tagged = raw.map((item) => ({ ...item, featured: this.isFeatured(item) }))

      // Separate featured from non-featured
      const featured = tagged.filter((i) => i.featured)
      const compact = tagged.filter((i) => !i.featured)

      // Interleave: insert one featured item every ~3 compact items
      // so featured are evenly distributed throughout the masonry, not all at the end
      const result = []
      let fi = 0
      let ci = 0
      const step = Math.max(2, Math.floor(compact.length / Math.max(featured.length, 1)))
      while (fi < featured.length || ci < compact.length) {
        // Insert featured item
        if (fi < featured.length) result.push(featured[fi++])
        // Insert `step` compact items
        for (let s = 0; s < step && ci < compact.length; s++) {
          result.push(compact[ci++])
        }
      }

      return result
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

    // Returns base card height (cover image + small padding) before expansion.
    baseHeight(item, idx) {
      if (item.featured) return FEATURED_HEIGHT
      return COMPACT_HEIGHTS[idx % COMPACT_HEIGHTS.length]
    },

    // Returns the total rendered height of a card (base + expansion if active).
    cardHeight(item, idx) {
      return this.baseHeight(item, idx) + (this.isActive(idx) ? EXPAND_DELTA : 0)
    },

    layoutMasonry() {
      const container = this.$refs.mosaicContainer
      if (!container || !this.processedItems.length) return
      const W = container.clientWidth
      if (!W) { setTimeout(() => this.layoutMasonry(), 50); return }

      // 4 equal columns on desktop, 3 tablet, 2 small tablet, 1 mobile
      // ALL items are 1-col wide — this is the ONLY way to have zero height gaps.
      // Featured items are 2.5x taller (380px vs 140-175px), not wider.
      const cols = W >= 900 ? 4 : W >= 640 ? 3 : W >= 480 ? 2 : 1
      const gap = 16
      const colW = Math.floor((W - gap * (cols - 1)) / cols)
      const colH = Array(cols).fill(0)

      this.itemStyles = this.processedItems.map((item, idx) => {
        // Shortest-column bin-packing: always fills the lowest column, zero gaps
        let col = 0
        for (let i = 1; i < cols; i++) {
          if (colH[i] < colH[col]) col = i
        }
        const top = colH[col]
        const left = col * (colW + gap)
        const h = this.cardHeight(item, idx)
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
