<template>
  <footer class="contact">
    <h2 id="contact" class="contact-title" ref="contact">
      <span v-if="translations" v-html="translations.title"></span>
      <span
        v-else
        class="skeleton--shimmer"
        style="display: inline-block; width: 30%; height: 1em; border-radius: 4px"
      ></span>
    </h2>

    <div class="contact-social" v-if="translations">
      <template v-for="(item, n) in translations.line1" :key="n">
        <a :href="item.link" target="_blank" class="contact-social-link">{{ item.description }}</a>
        <span v-if="n < translations.line1.length - 1" class="contact-social-separator">•</span>
      </template>
    </div>
    <div class="contact-social" v-else>
      <span
        class="contact-social-link skeleton--shimmer"
        style="display: inline-block; width: 45px; height: 1em; border-radius: 2px"
      ></span>
      <span class="contact-social-separator">•</span>
      <span
        class="contact-social-link skeleton--shimmer"
        style="display: inline-block; width: 55px; height: 1em; border-radius: 2px"
      ></span>
      <span class="contact-social-separator">•</span>
      <span
        class="contact-social-link skeleton--shimmer"
        style="display: inline-block; width: 70px; height: 1em; border-radius: 2px"
      ></span>
      <span class="contact-social-separator">•</span>
      <span
        class="contact-social-link skeleton--shimmer"
        style="display: inline-block; width: 55px; height: 1em; border-radius: 2px"
      ></span>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      loading: this.$store.getters.getlang.loading,
      translations: false,
    }
  },
  watch: {
    '$store.state.lang.components': {
      immediate: true,
      handler() {
        this.translations = this.$store.getters.getlang.components.contact
      },
    },
  },
}
</script>

<style lang="scss">
@import '../sass/contact';
</style>
