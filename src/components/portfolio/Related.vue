<template>
  <footer class="internal-footer">
    <h2 class="internal-footer-title">
      <span v-if="translations?.title" v-html="translations.title" :key="'ttl1'"></span>
      <span v-else class="skeleton--shimmer" style="display: inline-block; width: 30%; height: 1em; border-radius: 4px" :key="'ttl2'"></span>
    </h2>
    <div class="internal-footer-related">
      <template v-if="translations?.projects">
        <router-link
          v-for="(project, projectkey) in translations.projects"
          class="internal-footer-related-link"
          :to="translations.path + project.link"
          :key="projectkey"
        >
          {{ project.page }}
        </router-link>
      </template>
      <template v-else>
        <span
          v-for="(w, idx) in ['70px', '70px', '140px', '50px', '50px', '80px', '110px', '130px', '120px', '80px', '60px', '95px']"
          class="internal-footer-related-link skeleton--shimmer"
          :style="{ width: w, pointerEvents: 'none' }"
          :key="idx"
        ></span>
      </template>
    </div>

    <div class="internal-footer-items" v-if="translations?.socials">
      <template v-for="(social, socialkey) in translations.socials" :key="socialkey">
        <a :href="social.link" target="_blank" class="internal-footer-items-link">
          {{ social.network }}
        </a>
        <span
          v-if="socialkey < translations.socials.length - 1"
          class="internal-footer-items-separator"
        >
          •
        </span>
      </template>

      <p class="internal-footer-items-note" v-html="translations.note"></p>
    </div>
    <div class="internal-footer-items" v-else data-nosnippet>
      <span class="internal-footer-items-link skeleton--shimmer" style="display: inline-block; width: 45px; height: 1em; border-radius: 2px"></span>
      <span class="internal-footer-items-separator">•</span>
      <span class="internal-footer-items-link skeleton--shimmer" style="display: inline-block; width: 55px; height: 1em; border-radius: 2px"></span>
      <span class="internal-footer-items-separator">•</span>
      <span class="internal-footer-items-link skeleton--shimmer" style="display: inline-block; width: 70px; height: 1em; border-radius: 2px"></span>
      <span class="internal-footer-items-separator">•</span>
      <span class="internal-footer-items-link skeleton--shimmer" style="display: inline-block; width: 55px; height: 1em; border-radius: 2px"></span>

      <p class="internal-footer-items-note skeleton--shimmer" style="width: 90%; height: 1.2em; border-radius: 4px; margin-top: 16px; margin-bottom: 6px"></p>
      <p class="internal-footer-items-note skeleton--shimmer" style="width: 75%; height: 1.2em; border-radius: 4px"></p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Related',
  data() {
    return {
      loading: this.$store.getters.getlang.loading,
      translations: {},
    }
  },
  watch: {
    '$store.state.lang.components': {
      immediate: true,
      handler() {
        this.translations = this.$store.getters.getlang.components.related
      },
    },
  },
}
</script>
