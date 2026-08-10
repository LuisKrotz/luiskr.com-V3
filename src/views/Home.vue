<template>
  <article :class="has_touch ? 'has_touch' : ''">
    <div id="home">
      <!-- ── Portfolio Showcase Grid ─────────────────────────────────── -->
      <section class="home-portfolio-section">
        <h2 class="home-section-title">
          <DrawText v-if="translations" :text="translations.featured" />
          <span v-else class="skeleton--shimmer" style="display: inline-block; width: 40%; height: 1em; border-radius: 4px"></span>
        </h2>

        <!-- Mosaic Grid of Home Portfolio Items -->
        <div v-if="translations?.portfoliolist?.length" class="home-mosaic">
          <router-link
            v-for="(item, itemkey) in translations.portfoliolist"
            :key="itemkey"
            :to="'/portfolio/' + item.link"
            class="home-mosaic-item"
            :class="{
              'home-mosaic-item--featured': isFeatured(item),
              'home-mosaic-item--hovered': hoveredIndex === itemkey
            }"
            @mouseenter="hoveredIndex = itemkey"
            @mouseleave="hoveredIndex = null"
          >
            <div class="home-mosaic-media">
              <img
                decoding="async"
                loading="lazy"
                class="home-mosaic-img"
                :src="storage + 'covers/' + item.image + ext"
                :alt="item.label"
              />
              <div class="home-mosaic-overlay"></div>
            </div>

            <div class="home-mosaic-content">
              <h3 class="home-mosaic-title">{{ item.label }}</h3>

              <transition name="home-desc-expand">
                <div v-if="hoveredIndex === itemkey" class="home-mosaic-details">
                  <p v-if="item.description" class="home-mosaic-desc">
                    <DrawText :text="item.description" :delay="20" />
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
        <div v-else class="home-mosaic">
          <div
            v-for="n in 6"
            :key="n"
            class="home-mosaic-item skeleton--shimmer"
            :class="{ 'home-mosaic-item--featured': n === 1 || n === 4 }"
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
      aboutTranslations: false,
      profilePicture: null,
    }
  },

  computed: {
    mentions() {
      return this.$store.getters.getMentions
    },
  },

  methods: {
    isFeatured(item) {
      if (!item) return false
      return this.featuredLinks.has(item.link) || item.featured === true
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
  },
}
</script>

<style lang="scss">
@import '../sass/home';
@import '../sass/about';
@import '../sass/contact';
@import '../sass/awards-footer';
</style>
