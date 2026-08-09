<template>
  <div class="expand-modal-content" :class="{ 'expand-modal--closing': isClosing }">
    <div class="expand-modal-close-bar">
      <span class="expand-modal-close-bar-title">{{ alt }}</span>
      <button class="expand-modal-close-bar-button" @click="startClose">
        {{ translations.close }}
      </button>
    </div>
    <div class="expand-modal-close-area" @click="startClose"></div>
    <figure class="expand-modal-media-figure">
      <img
        decoding="async"
        class="expand-modal-media-placeholder"
        :src="placeholder(width, height)"
        :width="width"
        :height="height"
        aria-hidden="true"
        tabindex="-1"
        data-nosnippet
      />

      <img
        decoding="async"
        v-if="!isVideo"
        class="expand-modal-media-item"
        :width="width"
        :height="height"
        :alt="alt"
        :src="source"
        v-lazy="{ src: source, loading: thumb }"
      />
      <video
        decoding="async"
        v-else
        class="expand-modal-media-item"
        :width="width"
        :height="height"
        :poster="thumb"
        :alt="alt"
        playsinline
        autoplay
        loop
        muted
        controls
      >
        <source :src="source" type="video/mp4" />
      </video>
    </figure>

    <!-- Close button below the content, outside figure -->
    <button class="expand-modal-close-bottom" @click="startClose">
      {{ translations.close }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'MediaExpanded',
  data() {
    return {
      translations: this.$store.getters.getlang.components.media,
      isClosing: false,
    }
  },
  props: {
    source: {
      type: String,
      required: true,
    },
    thumb: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
      required: false,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    isVideo: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  methods: {
    placeholder(width, height) {
      return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" %3E%3C/svg%3E`
    },
    startClose() {
      if (this.isClosing) return
      this.isClosing = true

      const scroll = this.$store.getters.getModal.transform

      // Wait for zoom-out animation to finish
      setTimeout(() => {
        // 1. Restore scroll position BEFORE removing fixed layout
        window.scrollTo({ top: scroll, behavior: 'instant' })

        // 2. Restore URL to portfolio base path (remove slug)
        const routeSlug = this.$route.params?.slug
        if (routeSlug) {
          const currentPath = this.$route.path.replace(/\/$/, '')
          const basePath = currentPath.slice(0, currentPath.length - routeSlug.length - 1)
          this.$router.replace(basePath)
        }

        // 3. Reset modal store state
        this.$store.commit('setModal', {
          transform: 0,
          class: '',
          open: false,
          media: {
            source: undefined,
            thumb: undefined,
            alt: undefined,
            width: undefined,
            height: undefined,
            isVideo: undefined,
          },
        })
      }, 400) // matches zoom-out animation duration
    },
  },
}
</script>
