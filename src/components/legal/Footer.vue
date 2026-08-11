<template>
  <footer class="internal-footer">
    <div class="internal-footer-items" v-if="translations">
      <template v-for="(item, n) in translations.links" :key="n">
        <router-link class="internal-footer-items-link contact-other-link" :to="item.link">{{ item.page }}</router-link>
        <span v-if="n < translations.links.length - 1" class="internal-footer-items-separator contact-other-separator">•</span>
      </template>
    </div>
    <div v-else>
      <span class="internal-footer-items-link contact-other-link" data-no-snippet>{{ loading }}</span>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Legal Footer',
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
        this.translations = this.$store.getters.getlang.components['legal-footer']
      },
    },
  },
}
</script>
