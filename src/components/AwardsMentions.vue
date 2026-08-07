<template>
  <footer class="awards-footer">
    <h2 class="awards-footer-title">
      {{ title }}
    </h2>

    <HomeCarousel
      v-if="items && items.length"
      :items="items"
      variant="awards"
      :duration="10000"
      :show-dots="true"
    >
      <template #default="{ item }">
        <a class="hc-award" :href="item.link" target="_blank" rel="noopener">
          <span class="hc-award-media" v-if="!item.media">{{ item.icon }}</span>
          <img
            v-else
            decoding="async"
            class="hc-award-img"
            :src="storage + item.media.path"
            v-lazy="{ src: storage + item.media.path }"
            :alt="item.description"
            :width="item.media.width"
            :height="item.media.height"
          />
          <span class="hc-award-text" v-html="item.description"></span>
        </a>
      </template>
    </HomeCarousel>

    <!-- Skeleton loading while items aren't ready -->
    <div v-else class="awards-footer-skel">
      <span
        v-for="n in 3"
        :key="n"
        class="skeleton"
        style="display: inline-block; width: 60px; height: 60px; border-radius: 50%; margin: 0 8px"
      ></span>
    </div>

    <!-- Legal links — same border/padding as .contact-social -->
    <nav class="awards-footer-links">
      <router-link class="awards-footer-links-item" to="/privacy-policy">
        Privacy Policy
      </router-link>
      <span class="awards-footer-links-sep">•</span>
      <router-link class="awards-footer-links-item" to="/gdpr">GDPR</router-link>
      <span class="awards-footer-links-sep">•</span>
      <router-link class="awards-footer-links-item" to="/terms-of-use">Terms of use</router-link>
    </nav>
  </footer>
</template>

<script>
import HomeCarousel from './HomeCarousel.vue'

export default {
  name: 'AwardsMentions',
  components: { HomeCarousel },

  props: {
    title: { type: String, default: 'Some mentions' },
    items: { type: Array, default: null },
  },

  data() {
    return {
      storage: this.$store.getters.getStorage,
    }
  },
}
</script>

<style lang="scss">
@import '../sass/awards-footer';
</style>
