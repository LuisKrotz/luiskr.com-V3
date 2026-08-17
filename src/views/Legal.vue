<template>
  <article>
    <div id="main" class="legal">
      <h2 class="internal-title">
        <span v-if="translations" v-html="translations.title" :key="'ttl1'"></span>
        <span
          v-else
          class="skeleton--shimmer"
          style="display: inline-block; width: 35%; height: 1em; border-radius: 4px"
          :key="'ttl2'"
        ></span>
      </h2>
      <template v-if="translations">
        <section
          class="internal-description"
          v-for="(section, key) in translations.sections"
          :key="key"
        >
          <h3 class="internal-description-text" v-html="section.title"></h3>
          <p
            class="internal-description-text"
            v-for="(paragraph, key) in section.content"
            :key="key"
            v-html="paragraph"
          ></p>
        </section>
      </template>
      <div v-else :key="'data-load'">
        <section class="internal-description" v-for="n in 3" :key="n">
          <h3
            class="internal-description-text skeleton--shimmer"
            style="width: 35%; height: 1.2em; border-radius: 4px; margin-bottom: 1em"
          ></h3>
          <p
            class="internal-description-text skeleton--shimmer"
            style="width: 100%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"
          ></p>
          <p
            class="internal-description-text skeleton--shimmer"
            style="width: 94%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"
          ></p>
          <p
            class="internal-description-text skeleton--shimmer"
            style="width: 98%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"
          ></p>
          <p
            class="internal-description-text skeleton--shimmer"
            style="width: 65%; height: 1.4em; border-radius: 4px"
          ></p>
        </section>
      </div>
    </div>
    <LegalFooter />
  </article>
</template>

<script>
import { fetchFirebaseDb } from '../utils/db.js'
import LegalFooter from '../components/legal/Footer.vue'

export default {
  data() {
    return {
      loading: this.$store.getters.getlang.loading,
      translations: false,
    }
  },
  components: {
    LegalFooter,
  },
  created() {
    this.loadData()
  },
  watch: {
    $route(to) {
      const wait = 1000

      if (to.meta?.legalRoute) {
        this.loadData(wait)

        this.$smoothScroll({
          duration: 1000,
          updateHistory: true,
          scrollTo: 0,
          hash: '',
        })
      }
    },
  },
  methods: {
    loadData(wait) {
      const lang = this.$store.getters.getlang
      document.title = this.$route.meta.title
      this.translations = false

      fetchFirebaseDb(lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation)
        .then((snapshot) => {
          if (snapshot.exists()) {
            if (!wait) {
              this.translations = snapshot.val()
            } else {
              setTimeout(() => {
                this.translations = snapshot.val()
              }, wait)
            }
          } else {
            console.log("%cERROR: could't find PAGE DATA", this.$sharedData.styles.info)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
  mounted() {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 500)
  },
  name: 'Legal',
}
</script>

<style lang="scss">
@import '../sass/internals';
@import '../sass/awards-footer';
</style>
