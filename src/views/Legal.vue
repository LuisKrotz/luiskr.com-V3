<template>
  <article id="#main" class="legal" :key="this.$store.getters.getlang.locale + this.$route.meta.translation">
    <h2 class="internal-title">{{ translations.title }}</h2>
    <section class="internal-description" v-for="section, key in translations.sections" :key="key">
      <h3 class="internal-description-text" v-html="section.title"></h3>
      <p class="internal-description-text" v-for="paragraph, key in section.content" :key="key" v-html="paragraph"></p>
    </section>

    <Footer />
  </article>
</template>

<script>
import { getDatabase, ref, child, get } from "firebase/database";
import Footer                           from'../components/legal/Footer'

export default {
  data() {
    return {
      translations: false
    }
  },
  components: {
    Footer
  },
  created() {
    this.loadData();
  },
  watch:{
    $route () {
        this.loadData();

        this.$smoothScroll({
          duration: 1000,
          updateHistory: true,
          scrollTo: 0,
          hash: ''
        });
    }
  },
  methods: {
    loadData() {
      let lang = this.$store.getters.getlang;
      document.title = this.$route.meta.title;

      get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation)).then((snapshot) => {
        if (snapshot.exists()) {
          this.translations = snapshot.val();
        } else {
          console.log('ERROR: could\'t find data at');
        }
      }).catch((error) => {
        console.error(error);
      });
    }
  },
  mounted() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  },
  name: 'Legal',
}
</script>

<style lang="scss">
@import '../sass/internals';
</style>