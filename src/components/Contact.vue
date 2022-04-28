<template>
    <footer class="contact" v-if="translations">
      <h2 id="contact" class="contact-title" ref="contact">{{ translations.title }}</h2>
      <div class="contact-social">
        <template v-for="item, n in translations.line1" :key="n">
          <a :href="item.link" target="_blank" class="contact-social-link">{{ item.description }}</a>
          <span v-if="n < translations.line1.length - 1" class="contact-social-separator">•</span>
        </template>
      </div>
      <div class="contact-other">
        <template v-for="item, n in translations.line2" :key="n">
          <router-link class="contact-other-link" :to="item.link">{{ item.description }}</router-link>
          <span v-if="n < translations.line2.length - 1" class="contact-social-separator">•</span>
        </template>
      </div>
    </footer>
</template>

<script>

export default {
  name: 'Contact',
  data() {
    return {
        translations:   this.$store.getters.getlang.components.contact
    }
  }
}
</script>


<style lang="scss">
@import '../sass/contact';
</style>