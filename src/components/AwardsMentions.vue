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
            :data-src="storage + item.media.path"
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

    <!-- Legal links — dynamically sourced from store (translated per language) -->
    <nav class="awards-footer-links" aria-label="Legal">
      <template v-for="(link, i) in legalLinks" :key="i">
        <router-link class="awards-footer-links-item" :to="link.link">
          {{ link.page }}
        </router-link>
        <span v-if="i < legalLinks.length - 1" class="awards-footer-links-sep">•</span>
      </template>
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
      observer: null,
    }
  },

  computed: {
    legalLinks() {
      const all = this.$store.getters.getlang?.components?.['legal-footer']?.links || []
      // Skip the first item (Home) — keep only legal page links
      return all.filter(l => l.link && !l.link.match(/^\/[a-z]{0,3}\/?$/))
    },
  },

  mounted() {
    this._initImageObserver()
  },

  updated() {
    // Re-observe any new images added after data loads
    this._observeImages()
  },

  beforeUnmount() {
    if (this.observer) this.observer.disconnect()
  },

  methods: {
    _initImageObserver() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target
              const src = img.getAttribute('data-src')
              if (src) {
                img.src = src
                img.removeAttribute('data-src')
              }
              this.observer.unobserve(img)
            }
          })
        },
        { rootMargin: '200px' }
      )
      this._observeImages()
    },

    _observeImages() {
      this.$nextTick(() => {
        const imgs = this.$el?.querySelectorAll('img[data-src]')
        if (imgs) {
          imgs.forEach((img) => this.observer.observe(img))
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import '../sass/awards-footer';
</style>
