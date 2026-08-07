<template>
  <article :class="has_touch ? 'has_touch' : ''">
    <div id="home">
      <!-- ── Selected Projects ──────────────────────────────────────── -->
      <section class="home-section home-section--selected">
        <h2 class="home-section-title">
          <span v-if="translations">{{ translations.featured }}</span>
          <template v-else>
            <span class="skeleton" style="display: block; width: 220px; height: 1.2em"></span>
          </template>
        </h2>

        <!-- Loaded -->
        <ul class="home-grid home-grid--selected" v-if="translations?.portfoliolist">
          <li class="home-item" v-for="item in featuredItems" :key="item.link">
            <router-link class="home-item-link" :to="'/portfolio/' + item.link">
              <div class="home-item-cover">
                <img
                  decoding="async"
                  class="home-item-cover-img"
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
              <div class="home-item-label home-item-label--selected">
                <h3 class="home-item-title home-item-title--selected">{{ item.label }}</h3>
                <p class="home-item-desc">{{ item.description }}</p>
              </div>
            </router-link>
          </li>
        </ul>

        <!-- Loading skeleton -->
        <ul class="home-grid home-grid--selected" v-else>
          <li class="home-item" v-for="n in 2" :key="n">
            <div class="home-item-cover skeleton home-item-cover--skel"></div>
            <div class="home-item-label home-item-label--selected">
              <span
                class="skeleton"
                style="display: block; width: 55%; height: 1.4em; margin-bottom: var(--space-xs)"
              ></span>
              <span class="skeleton" style="display: block; width: 75%; height: 0.9em"></span>
            </div>
          </li>
        </ul>
      </section>

      <!-- ── Know More / Archive ────────────────────────────────────── -->
      <section class="home-section home-section--archive">
        <h2 class="home-section-title home-section-title--archive">
          <span v-if="translations">{{ translations.archive }}</span>
          <template v-else>
            <span class="skeleton" style="display: block; width: 160px; height: 1em"></span>
          </template>
        </h2>

        <!-- Loaded -->
        <ul class="home-grid home-grid--archive" v-if="translations?.portfoliolist">
          <li class="home-item" v-for="item in archiveItems" :key="item.link">
            <router-link class="home-item-link" :to="'/portfolio/' + item.link">
              <div class="home-item-cover">
                <img
                  decoding="async"
                  class="home-item-cover-img"
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
              <div class="home-item-label home-item-label--archive">
                <h3 class="home-item-title home-item-title--archive">{{ item.label }}</h3>
                <p class="home-item-desc home-item-desc--archive">{{ item.description }}</p>
              </div>
            </router-link>
          </li>
        </ul>

        <!-- Loading skeleton: 6 cards in archive grid -->
        <ul class="home-grid home-grid--archive" v-else>
          <li class="home-item" v-for="n in 6" :key="n">
            <div class="home-item-cover skeleton home-item-cover--skel"></div>
            <div class="home-item-label home-item-label--archive">
              <span
                class="skeleton"
                style="display: block; width: 60%; height: 1em; margin-bottom: var(--space-xs)"
              ></span>
              <span class="skeleton" style="display: block; width: 80%; height: 0.8em"></span>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <Contact />
  </article>
</template>

<script>
import { getDatabase, ref, child, get } from 'firebase/database'
import Contact from '../components/Contact.vue'

export default {
  name: 'Home',
  components: { Contact },

  data() {
    return {
      loading: this.$store.getters.getlang.loading,
      storage: this.$store.getters.getStorage,
      translations: false,
      has_touch: this.$store.getters.getTouch,
      // Image extensions matching original convention
      loadext: '-mozjpg3-MSSIM-tuned-kodak',
      ext: '.jpg',
      // featured links cross-referenced from components/related/projects
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

    // Load HOME page data (portfoliolist, featured title, archive title)
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

    // Load related/projects to get the featured flags, cross-reference by link
    get(child(ref(getDatabase()), lang.database + lang.locale + '/components/related/projects'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const projects = snapshot.val()
          const links = new Set()
          // projects is an array-like object
          Object.values(projects).forEach((p) => {
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
