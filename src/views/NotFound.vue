<template>
  <div class="not-found-decoration">
    <div
      v-for="n in marquee"
      :key="n"
      class="not-found-decoration-marquee"
      aria-hidden="true"
      data-no-snippet
    >
      <template v-for="n in 10" :key="n">404</template>
    </div>
  </div>
  <div id="main" class="not-found">
    <div v-if="translations?.title">
      <h2 class="not-found-title">
        <!-- Emoji line: static, rendered as-is via v-html -->
        <span v-html="emojiLine" aria-hidden="true"></span>
        <!-- Translated subtitle: draw animation -->
        <span class="not-found-subtitle">
          <DrawText v-if="subtitle" :text="subtitle" :delay="30" trigger="auto" />
        </span>
      </h2>
      <router-link class="not-found-link" :to="homePath">{{ translations.link }}</router-link>
    </div>
  </div>
</template>

<script>
import { fetchFirebaseDb } from '../utils/db.js'
import DrawText from '../components/DrawText.vue'

export default {
  name: 'Not Found',
  components: { DrawText },

  data() {
    return {
      marquee: Number,
      translations: false,
    }
  },

  computed: {
    // Split emoji line from the translated subtitle text
    emojiLine() {
      if (!this.translations?.title) return ''
      return this.translations.title.split('<br>')[0] || ''
    },
    subtitle() {
      if (!this.translations?.title) return ''
      return this.translations.title.split('<br>')[1] || ''
    },
    homePath() {
      const locale = this.$store.getters.getLang
      return locale && locale !== 'en' ? '/' + locale : '/'
    },
  },

  created() {
    const lang = this.$store.getters.getlang
    document.title = this.$route.meta.title

    fetchFirebaseDb(lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation)
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.translations = snapshot.val()
        } else {
          console.log("%cERROR: couldn't find 404 DATA", this.$sharedData.styles.info)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  },

  mounted() {
    this.$store.commit('setMarqueeAmount')
    this.marquee = this.$store.getters.getMarqueeAmount

    window.addEventListener(
      'resize',
      () => {
        this.$store.commit('setMarqueeAmount')
        this.marquee = this.$store.getters.getMarqueeAmount
      },
      true
    )
  },
}
</script>

<style lang="scss">
@import '../sass/not-found';
</style>
