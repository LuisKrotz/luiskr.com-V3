<template>
  <article :class="has_touch ? 'has_touch' : ''">
    <div id="home">
      <!-- ── Portfolio Showcase Grid ─────────────────────────────────── -->
      <section class="home-portfolio-section">
        <h2 class="home-section-title">
          <DrawText v-if="translations" :text="translations.featured" />
          <span v-else class="skeleton--shimmer" style="display: inline-block; width: 40%; height: 1em; border-radius: 4px"></span>
        </h2>

        <!-- Mosaic Grid of Home Portfolio Items (Equal-Width Vertical Masonry) -->
        <div
          v-if="processedItems.length"
          ref="mosaicContainer"
          class="home-mosaic"
          :style="{ height: containerHeight }"
        >
          <router-link
            v-for="(item, itemkey) in processedItems"
            :key="item.link || itemkey"
            :to="'/portfolio/' + item.link"
            class="home-mosaic-item"
            :class="[
              'home-mosaic-item--' + item.variant,
              {
                'home-mosaic-item--featured': item.featured,
                'home-mosaic-item--expanded': activeTouchIndex === item.link || hoveredIndex === item.link
              }
            ]"
            :style="itemStyles[itemkey] || {}"
            @mouseenter="onHover(item.link)"
            @mouseleave="onLeave()"
            @click="handleItemClick($event, item, item.link)"
          >
            <!-- Top Section: Cover Image -->
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

            <!-- Bottom Section BELOW Image: Description & Button -->
            <div class="home-mosaic-bottom">
              <transition name="home-desc-expand">
                <div v-if="activeTouchIndex === item.link || hoveredIndex === item.link" class="home-mosaic-details">
                  <p v-if="item.description" class="home-mosaic-desc">
                    <DrawText :text="item.description" :delay="8" />
                  </p>
                  <button class="home-mosaic-btn">
                    {{ translations.explore || 'Check out' }}
                  </button>
                </div>
              </transition>
            </div>
          </router-link>
        </div>

        <!-- Loading Skeleton Grid -->
        <div v-else class="home-mosaic" style="min-height: 400px">
          <div
            v-for="n in 6"
            :key="n"
            class="home-mosaic-item skeleton--shimmer"
            style="height: 260px; position: relative"
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

export default {
  name: 'Home',
  components: { Contact, AwardsMentions, DrawText },

  data() {
    return {
      loading: this.$store.getters.getlang.loading,
      storage: this.$store.getters.getStorage,
      translations: false,
      has_touch: this.$store.getters.getTouch,
      clickortap: this.$store.getters.getClickOrTap,
      loadext: '-mozjpg3-MSSIM-tuned-kodak',
      ext: '.jpg',
      featuredLinks: new Set(),
      hoveredIndex: null,
      activeTouchIndex: null,
      aboutTranslations: false,
      profilePicture: null,
      itemStyles: [],
      containerHeight: 'auto',
    }
  },

  computed: {
    mentions() {
      return this.$store.getters.getMentions
    },

    processedItems() {
      if (!this.translations?.portfoliolist) return []
      const list = Array.isArray(this.translations.portfoliolist)
        ? this.translations.portfoliolist
        : Object.values(this.translations.portfoliolist)

      return list.map((item, idx) => {
        const featured = this.isFeatured(item)
        const variant = featured ? 'featured' : idx % 2 === 0 ? 'tall' : 'compact'

        return {
          ...item,
          featured,
          variant,
        }
      })
    },
  },

  watch: {
    processedItems() {
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

    onHover(link) {
      this.hoveredIndex = link
      this.layoutMasonry()
    },

    onLeave() {
      this.hoveredIndex = null
      this.layoutMasonry()
    },

    handleItemClick(e, item, itemlink) {
      const isTouch = this.has_touch || ('ontouchstart' in window) || window.matchMedia('(pointer: coarse)').matches

      if (isTouch) {
        if (this.activeTouchIndex !== itemlink) {
          // Tap 1: Prevent immediate navigation and trigger card expansion animation
          e.preventDefault()
          e.stopPropagation()
          this.activeTouchIndex = itemlink
          this.layoutMasonry()
          return false
        }
        // Tap 2: Card is already expanded, proceed to project page!
      }
    },

    layoutMasonry() {
      const container = this.$refs.mosaicContainer
      if (!container || !this.processedItems.length) return

      const containerWidth = container.clientWidth
      if (!containerWidth) return

      // 3 equal columns on desktop (> 768px), 2 cols on tablet (> 500px), 1 col mobile
      const cols = containerWidth >= 768 ? 3 : containerWidth >= 500 ? 2 : 1
      const gap = 20

      const colWidth = (containerWidth - gap * (cols - 1)) / cols
      const colHeights = Array(cols).fill(0)

      this.itemStyles = this.processedItems.map((item) => {
        // EVERY SINGLE ITEM IS EXACTLY 1 COLUMN WIDE (NO 2-COLUMN WIDE ITEMS EVER!)
        let targetCol = 0
        let minH = colHeights[0]

        for (let i = 1; i < cols; i++) {
          if (colHeights[i] < minH) {
            minH = colHeights[i]
            targetCol = i
          }
        }

        const top = minH
        const left = targetCol * (colWidth + gap)
        const width = colWidth

        // Featured items are distinguished by taller cover image height (360px vs 220px)
        let baseHeight = item.featured ? 360 : item.variant === 'tall' ? 290 : 220

        if (this.hoveredIndex === item.link || this.activeTouchIndex === item.link) {
          baseHeight += 110
        }

        colHeights[targetCol] = top + baseHeight + gap

        return {
          position: 'absolute',
          top: top + 'px',
          left: left + 'px',
          width: width + 'px',
        }
      })

      this.containerHeight = Math.max(...colHeights) + 'px'
    },
  },

  created() {
    const lang = this.$store.getters.getlang
    document.title = this.$route.meta.title

    get(
      child(
        ref(getDatabase()),
        lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.translations = snapshot.val()
          if (this.translations?.portfoliolist) {
            this.$store.commit('setPortfolioList', this.translations.portfoliolist)
          }
          this.$nextTick(this.layoutMasonry)
        } else console.log('%cERROR: HOME DATA not found', this.$sharedData.styles.info)
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

    // Fetch About data
    get(
      child(
        ref(getDatabase()),
        lang.database + lang.locale + lang.pagesPath + 'about'
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) this.aboutTranslations = snapshot.val()
      })
      .catch(console.error)

    get(
      child(
        ref(getDatabase()),
        lang.database + lang.locale + lang.pagesPath + 'about/profilePicture'
      )
    )
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
    this.$nextTick(this.layoutMasonry)
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
