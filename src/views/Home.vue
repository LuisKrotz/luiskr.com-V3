<template>
  <article :class="has_touch ? 'has_touch' : ''">
    <div id="home">
      <!-- ── Selected Work ───────────────────────────────────────────── -->
      <section class="home-section home-section--selected">
        <h2 class="home-section-title" :key="'sel-' + selectedSlideKey">
          <DrawText v-if="translations" :text="translations.featured" />
          <span v-else class="skeleton" style="display: block; width: 220px; height: 1.2em"></span>
        </h2>

        <HomeCarousel
          v-if="translations?.portfoliolist && featuredItems.length"
          :items="featuredItems"
          variant="selected"
          :duration="30000"
          @slide-change="selectedSlideKey++"
        >
          <template #default="{ item }">
            <router-link class="home-item-link" :to="'/portfolio/' + item.link">
              <div class="hc-cover">
                <img
                  decoding="async"
                  class="hc-cover-img"
                  :src="storage + 'covers/' + item.image + ext"
                  :alt="item.label"
                  :width="item.width ? item.width[0] : undefined"
                  :height="item.height ? item.height[0] : undefined"
                />
              </div>
              <div class="hc-label">
                <h3 class="hc-label-title"><DrawText :text="item.label" /></h3>
                <p class="hc-label-desc"><DrawText :text="item.description" :delay="30" :offset="descriptionOffset(item.label)" /></p>
                <button class="hc-label-action" :style="{ '--action-delay': actionOffset(item.label, item.description) + 'ms' }">{{ translations.explore }}</button>
              </div>
            </router-link>
          </template>
        </HomeCarousel>

        <!-- Loading skeleton -->
        <div v-else class="home-skel-selected">
          <div class="hc-cover hc-cover--skel"></div>
          <div style="padding: var(--space-sm) 0 var(--space-xl)">
            <span
              class="skeleton"
              style="display: block; width: 55%; height: 1.4em; margin-bottom: var(--space-xs)"
            ></span>
            <span class="skeleton" style="display: block; width: 75%; height: 0.9em"></span>
          </div>
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

    <div id="home-explore">
      <!-- ── Explore More / Archive ──────────────────────────────────── -->
      <section class="home-section home-section--archive">
        <h2 class="home-section-title home-section-title--archive" :key="'exp-' + exploreSlideKey">
          <DrawText v-if="translations" :text="translations.archive" />
          <span v-else class="skeleton--shimmer" style="display: inline-block; width: 45%; height: 1em; border-radius: 4px"></span>
        </h2>

        <HomeCarousel
          v-if="translations?.portfoliolist && archiveItems.length"
          :items="archiveItems"
          variant="explore"
          :duration="30000"
          @slide-change="exploreSlideKey++"
        >
          <template #default="{ item }">
            <router-link class="hc-card" :to="'/portfolio/' + item.link">
              <div class="hc-card-cover">
                <img
                  decoding="async"
                  class="hc-card-cover-img"
                  :src="storage + 'covers/' + item.image + ext"
                  :alt="item.label"
                  :width="item.width ? item.width[0] : undefined"
                  :height="item.height ? item.height[0] : undefined"
                />
                <img
                  decoding="async"
                  class="hc-card-cover-reflection"
                  :src="storage + 'covers/' + item.image + ext"
                  alt=""
                  aria-hidden="true"
                />
              </div>
              <div class="hc-card-label">
                <h3 class="hc-card-label-title"><DrawText :text="item.label" /></h3>
                <p class="hc-card-label-desc"><DrawText :text="item.description" :delay="30" :offset="descriptionOffset(item.label)" /></p>
              </div>
              <button class="hc-card-action" :style="{ '--action-delay': actionOffset(item.label, item.description) + 'ms' }">{{ translations.explore }}</button>
            </router-link>
          </template>
        </HomeCarousel>

        <!-- Loading skeleton: 6 ghost cards -->
        <div v-else class="hc--explore" style="overflow: hidden">
          <div style="display: flex; gap: var(--space-lg); padding: var(--space-md) 0">
            <div v-for="n in 4" :key="n" class="hc-card" style="min-width: 80vw; flex-shrink: 0">
              <div class="hc-card-cover hc-card-cover--skel"></div>
              <div class="hc-card-label">
                <span
                  class="skeleton"
                  style="display: block; width: 60%; height: 1em; margin-bottom: var(--space-xs)"
                ></span>
                <span class="skeleton" style="display: block; width: 80%; height: 0.8em"></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div id="contact">
      <Contact />
    </div>
    <AwardsMentions :title="mentions.title" :items="mentions.items" />
  </article>
</template>

<script>
import { getDatabase, ref, child, get } from 'firebase/database'
import Contact from '../components/Contact.vue'
import HomeCarousel from '../components/HomeCarousel.vue'
import AwardsMentions from '../components/AwardsMentions.vue'
import DrawText from '../components/DrawText.vue'

export default {
  name: 'Home',
  components: { Contact, HomeCarousel, AwardsMentions, DrawText },

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
      selectedSlideKey: 0,
      exploreSlideKey: 0,
      aboutTranslations: false,
      profilePicture: null,
    }
  },

  computed: {
    mentions() {
      return this.$store.getters.getMentions
    },
    featuredItems() {
      if (!this.translations?.portfoliolist) return []
      return this.translations.portfoliolist.filter((i) => this.featuredLinks.has(i.link))
    },
    archiveItems() {
      if (!this.translations?.portfoliolist) return []
      return this.translations.portfoliolist.filter((i) => !this.featuredLinks.has(i.link))
    },
  },

  methods: {
    // Strip HTML tags and return character count
    charCount(text) {
      return text.replace(/<[^>]+>/g, '').length
    },

    // Description starts when title is ~70% drawn
    descriptionOffset(titleText) {
      return Math.round(this.charCount(titleText) * 100 * 0.7)
    },

    // Action starts after description finishes
    actionOffset(titleText, descText) {
      const descOffset = this.descriptionOffset(titleText)
      const descDuration = this.charCount(descText) * 30 + 400
      return descOffset + descDuration
    },

    calcCoverHeight() {
      // Reserve space for: nav (~55px) + title (~80px) + label text (~120px) + breathing room
      const reserved = 260
      const maxH = Math.max(window.innerHeight - reserved, 300)
      const homeEl = document.getElementById('home')
      if (homeEl) {
        homeEl.style.setProperty('--cover-max-h', `${maxH}px`)
      }
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
        if (snapshot.exists()) this.translations = snapshot.val()
        else console.log('%cERROR: HOME DATA not found', this.$sharedData.styles.info)
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
    // Only scroll to top if no scrollTo route meta (handled by router scrollBehavior)
    if (!this.$route.meta?.scrollTo) {
      setTimeout(() => window.scrollTo(0, 0), 500)
    }
    this.calcCoverHeight()
    window.addEventListener('resize', this.calcCoverHeight)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.calcCoverHeight)
  },
}
</script>

<style lang="scss">
@import '../sass/home';
@import '../sass/about';
@import '../sass/contact';
@import '../sass/awards-footer';
</style>
