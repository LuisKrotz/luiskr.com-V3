<template>
  <article>
    <div id="main" class="legal">
      <h2 class="internal-title">
          <span v-if="translations" v-html="translations.title" :key="'ttl1'"></span>
          <span v-else :key="'ttl2'">{{ loading.msg1 }}</span>
      </h2>
      <template v-if="translations">
        <section class="internal-description" v-for="section, key in translations.sections" :key="key">
          <h3 class="internal-description-text" v-html="section.title"></h3>
          <p class="internal-description-text" v-for="paragraph, key in section.content" :key="key" v-html="paragraph"></p>
        </section>
      </template>
      <div v-else class="internal-description" :key="'data-load'">
        <p class="internal-description-text" >{{ loading.msg3 }}</p>
      </div>
    </div>
  <Footer />
  </article>
</template>

<script>
import { getDatabase, ref, child, get } from "firebase/database";
import Footer                           from'../components/legal/Footer'

export default {
  data() {
    return {
      loading:      this.$store.getters.getlang.loading,
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
    $route (to) {
      const wait =  1000;

        if (to.meta?.legalRoute) {
          this.loadData(wait);

          this.$smoothScroll({
            duration: 1000,
            updateHistory: true,
            scrollTo: 0,
            hash: ''
          });
        }
    }
  },
  methods: {
    loadData(wait) {
      let lang = this.$store.getters.getlang;
      document.title = this.$route.meta.title;
      this.translations =  false;

      // get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation)).then((snapshot) => {
      //   if (snapshot.exists()) {
      //     if(!wait) {
      //       this.translations = snapshot.val();
      //     } else {
      //       setTimeout(() => {
      //         this.translations = snapshot.val();
      //       }, wait);
      //     }
      //   } else {
      //     console.log('%cERROR: could\'t find PAGE DATA', this.$sharedData.styles.info);
      //   }
      // }).catch((error) => {
      //   console.error(error);
      // });
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