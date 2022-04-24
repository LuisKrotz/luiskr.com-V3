<template>
  <article id="#main" class="legal">
    <h2 class="internal-title">{{ translations.title }}</h2>
    <section class="internal-description">
      <h3 class="internal-description-text">{{ translations.subtitle }}</h3>
      <p class="internal-description-text" v-for="item, key in translations.content" :key="key" v-html="item"></p>
    </section>
    <Footer />
  </article>
</template>

<script>
import Footer from'../../components/abouts/Footer'

export default {
  data() {
    return {
      translations:         Object,
    }
  },
  components: {
    Footer
  },
  created() {
    document.title = this.$route.meta.title;
  },
  mounted() {
      let lang = this.$store.getters.getlang;

    fetch(`${lang.prefix}/GDPR${lang.suffix}`)
    .then((response) => {
        return response.json();
    }).then((data) => {
        this.translations = data;
    });


    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  },
  name: 'GDPR',
}
</script>

<style lang="scss">
@import '../../sass/internals';
</style>