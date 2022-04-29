<template>
    <footer class="contact">
      <h2 id="contact" class="contact-title" ref="contact">
        <span v-if="translations" v-html="translations.title"></span>
        <span v-else>{{ loading.msg1 }}</span>
      </h2>


      <div class="contact-social" v-if="translations">
        <template v-for="item, n in translations.line1" :key="n">
          <a :href="item.link" target="_blank" class="contact-social-link">{{ item.description }}</a>
          <span v-if="n < translations.line1.length - 1" class="contact-social-separator">•</span>
        </template>
      </div>
      <div class="contact-social" v-else>
        <span lass="contact-social-link">{{ loading.msg2 }}</span>
      </div>


      <div class="contact-other" v-if="translations">
        <template v-for="item, n in translations.line2" :key="n">
          <router-link class="contact-other-link" :to="item.link">{{ item.description }}</router-link>
          <span v-if="n < translations.line2.length - 1" class="contact-social-separator">•</span>
        </template>
      </div>
      <div class="contact-other" v-else>
        <span class="contact-other-link">{{ loading.msg3 }}</span>
      </div>
    </footer>
</template>

<script>

export default {
  name: 'Contact',
  data() {
      return {
          loading:        this.$store.getters.getlang.loading,
          translations:   false
      }
  },
  watch: {
      '$store.state.lang.components': {
          immediate: true,
              handler() {
              this.translations = this.$store.getters.getlang.components.contact;
          }
      }
  }
}
</script>


<style lang="scss">
@import '../sass/contact';
</style>