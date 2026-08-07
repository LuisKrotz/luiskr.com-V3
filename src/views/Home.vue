<template>
  <article :class="has_touch ? 'has_touch' : ''">
    <div id="home">
      <!-- ── Selected Work ───────────────────────────────────────────── -->
      <section class="home-section home-section--selected">
        <h2 class="home-section-title">
          <span v-if="translations">{{ translations.featured }}</span>
          <span v-else class="skeleton" style="display: block; width: 220px; height: 1.2em"></span>
        </h2>

        <HomeCarousel
          v-if="translations?.portfoliolist && featuredItems.length"
          :items="featuredItems"
          variant="selected"
          :duration="30000"
        >
          <template #default="{ item }">
            <router-link class="home-item-link" :to="'/portfolio/' + item.link">
              <div class="hc-cover">
                <img
                  decoding="async"
                  class="hc-cover-img"
                  v-lazy="{
                    src: storage + 'covers/' + item.image + ext,
                    loading: storage + 'covers/' + item.image + loadext + ext,
                  }"
                  :src="storage + 'covers/' + item.image + ext"
                  :alt="item.label"
                  :width="item.width ? item.width[0] : undefined"
                  :height="item.height ? item.height[0] : undefined"
                />
              </div>
              <div class="hc-label">
                <h3 class="hc-label-title">{{ item.label }}</h3>
                <p class="hc-label-desc">{{ item.description }}</p>
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

      <!-- ── Explore More / Archive ──────────────────────────────────── -->
      <section class="home-section home-section--archive">
        <h2 class="home-section-title home-section-title--archive">
          <span v-if="translations">{{ translations.archive }}</span>
          <span v-else class="skeleton" style="display: block; width: 160px; height: 1em"></span>
        </h2>

        <HomeCarousel
          v-if="translations?.portfoliolist && archiveItems.length"
          :items="archiveItems"
          variant="explore"
          :duration="30000"
        >
          <template #default="{ item }">
            <router-link class="hc-card" :to="'/portfolio/' + item.link">
              <div class="hc-card-cover">
                <img
                  decoding="async"
                  class="hc-card-cover-img"
                  v-lazy="{
                    src: storage + 'covers/' + item.image + ext,
                    loading: storage + 'covers/' + item.image + loadext + ext,
                  }"
                  :src="storage + 'covers/' + item.image + ext"
                  :alt="item.label"
                  :width="item.width ? item.width[0] : undefined"
                  :height="item.height ? item.height[0] : undefined"
                />
              </div>
              <div class="hc-card-label">
                <h3 class="hc-card-label-title">{{ item.label }}</h3>
                <p class="hc-card-label-desc">{{ item.description }}</p>
              </div>
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

    <Contact />
  </article>
</template>

<script>
import { getDatabase, ref, child, get } from 'firebase/database'
import Contact from '../components/Contact.vue'
import HomeCarousel from '../components/HomeCarousel.vue'

export default {
  name: 'Home',
  components: { Contact, HomeCarousel },

  data() {
    return {
      loading: this.$store.getters.getlang.loading,
      storage: this.$store.getters.getStorage,
      translations: false,
      has_touch: this.$store.getters.getTouch,
      loadext: '-mozjpg3-MSSIM-tuned-kodak',
      ext: '.jpg',
      featuredLinks: new Set(),
    }
  },

  computed: {
    featuredItems() {
      if (!this.translations?.portfoliolist) return []
      return this.translations.portfoliolist.filter((i) => this.featuredLinks.has(i.link))
    },
    archiveItems() {
      if (!this.translations?.portfoliolist) return []
      return this.translations.portfoliolist.filter((i) => !this.featuredLinks.has(i.link))
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
  },

  mounted() {
    setTimeout(() => window.scrollTo(0, 0), 500)
  },
}
</script>

<style lang="scss">
@import '../sass/home';
</style>
