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
      <h2 class="not-found-title" v-html="translations.title"></h2>
      <router-link class="not-found-link" to="/">{{ translations.link }}</router-link>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, child, get } from 'firebase/database'

export default {
  data() {
    return {
      marquee: Number,
      translations: false,
    }
  },
  name: 'Not Found',
  created() {
    let lang = this.$store.getters.getlang

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
        } else {
          console.log("%cERROR: could't find 404 DATA", this.$sharedData.styles.info)
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
