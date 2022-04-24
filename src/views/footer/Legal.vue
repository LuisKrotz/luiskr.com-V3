<template>
  <article id="#main" class="legal">
    <h2 class="internal-title">{{ translations.title }}</h2>
    <section class="internal-description" v-for="section, key in translations.sections" :key="key">
      <h3 class="internal-description-text" v-html="section.title"></h3>
      <p class="internal-description-text" v-for="paragraph, key in section.content" :key="key" v-html="paragraph"></p>
    </section>

    <Footer />
  </article>
</template>

<script>
import Footer from'../../components/abouts/Footer'

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
    let lang = this.$store.getters.getlang;
    document.title = this.$route.meta.title;

    fetch(lang.prefix + this.$route.meta.translation + lang.suffix)
    .then((response) => {
        return response.json();
    }).then((data) => {
        this.translations = data;
    });
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
@import '../../sass/internals';
</style>