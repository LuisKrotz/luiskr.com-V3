<template>
  <article :class="has_touch ? 'has_touch' : ''">
    <div id="home">
      <HomeMosaic
        :processed-items="processedItems"
        :translations="translations"
        :storage="storage"
        :ext="ext"
        :has-touch="has_touch"
      />
    </div>

    <AboutSection :about-translations="aboutTranslations" :profile-picture="profilePicture" />

    <div id="contact"><Contact /></div>
    <AwardsMentions :title="mentions.title" :items="mentions.items" />
  </article>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { fetchFirebaseDb } from '../firebase.js'
import HomeMosaic from '../components/home/HomeMosaic.vue'

export default {
  name: 'Home',
  components: {
    HomeMosaic,
    AboutSection: defineAsyncComponent(() => import('../components/home/AboutSection.vue')),
    Contact: defineAsyncComponent(() => import('../components/Contact.vue')),
    AwardsMentions: defineAsyncComponent(() => import('../components/AwardsMentions.vue')),
  },

  data() {
    return {
      storage: this.$store.getters.getStorage,
      translations: false,
      has_touch: this.$store.getters.getTouch,
      ext: '.jpg',
      featuredLinks: new Set(),
      aboutTranslations: false,
      profilePicture: null,
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
      return raw.map((item) => ({ ...item, featured: this.isFeatured(item) }))
    },
  },

  methods: {
    isFeatured(item) {
      if (!item) return false
      if (item.featured === true || item.featured === 'true' || item.featured === 1) return true
      return item.link && this.featuredLinks.has(item.link)
    },
  },

  created() {
    const lang = this.$store.getters.getlang
    document.title = this.$route.meta.title
    const basePath = lang.database + lang.locale

    // Parallel fetch for all Home data dependencies
    Promise.all([
      fetchFirebaseDb(basePath + lang.pagesPath + this.$route.meta.translation),
      fetchFirebaseDb(basePath + '/components/related/projects'),
      fetchFirebaseDb(basePath + lang.pagesPath + 'about'),
      fetchFirebaseDb(basePath + lang.pagesPath + 'about/profilePicture'),
    ])
      .then(([homeSnap, projectsSnap, aboutSnap, picSnap]) => {
        if (homeSnap?.exists()) {
          this.translations = homeSnap.val()
          if (this.translations?.portfoliolist) {
            this.$store.commit('setPortfolioList', this.translations.portfoliolist)
          }
        }
        if (projectsSnap?.exists()) {
          const links = new Set()
          Object.values(projectsSnap.val()).forEach((p) => {
            if (p.featured === true && p.link) links.add(p.link)
          })
          this.featuredLinks = links
        }
        if (aboutSnap?.exists()) {
          const about = aboutSnap.val()
          this.aboutTranslations = about
          this.$store.commit('setMentions', {
            title: about.mentions ?? 'Some mentions',
            items: about.mention_items ?? [],
          })
        }
        if (picSnap?.exists()) {
          this.profilePicture = picSnap.val()
        }
      })
      .catch(console.error)
  },

  mounted() {
    if (!this.$route.meta?.scrollTo) setTimeout(() => window.scrollTo(0, 0), 500)
  },
}
</script>

<style lang="scss">
@import '../sass/home';
</style>
