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
        alt=""
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
        :src="currentSrc"
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
        :autoplay="!isReducedMotion"
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
import { gpuAccel } from '../utils/gpu-accel.js'
import { wasmPool } from '../utils/wasm-pool.js'

export default {
  name: 'MediaExpanded',
  data() {
    return {
      translations: this.$store.getters.getlang.components.media,
      isClosing: false,
      currentSrc: this.thumb,
    }
  },
  computed: {
    isReducedMotion() {
      return this.$store.getters.getReducedMotion
    },
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const modalAbove = document.querySelector('.modal-above')
    if (modalAbove) modalAbove.scrollTop = 0
    const modalContent = document.querySelector('.expand-modal-content')
    if (modalContent) modalContent.scrollTop = 0

    wasmPool.dispatch('PROCESS_MEDIA_ANALYTICS', {
      width: Number(this.width) || 0,
      height: Number(this.height) || 0,
      isVideo: !!this.isVideo,
    })

    if (!this.isVideo && this.source) {
      const img = new Image()
      img.src = this.source
      const applySource = () => {
        this.currentSrc = this.source
      }
      img.onload = () => {
        gpuAccel.processImageGPU(img, this.width || 800, this.height || 450)
        if (img.decode) {
          img.decode().then(applySource).catch(applySource)
        } else {
          applySource()
        }
      }
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

      const scroll = Number(this.$store.getters.getModal.transform) || 0

      // Wait for zoom-out animation to finish
      setTimeout(() => {
        // 1. Restore URL to portfolio base path (remove slug) without router navigation
        const routeSlug = this.$route.params?.slug
        if (routeSlug) {
          const currentPath = this.$route.path.replace(/\/$/, '')
          const basePath = currentPath.slice(0, currentPath.length - routeSlug.length - 1)
          history.replaceState({}, '', basePath)
        }

        // 2. Remove modal-open class while preserving transform offset
        this.$store.commit('setModal', {
          transform: scroll,
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

        // 3. Wait for Vue to flush DOM updates (class="modal-open" removed, document height restored)
        this.$nextTick(() => {
          // Document height is now restored! Scroll to exact saved position.
          window.scrollTo(0, scroll)

          // 4. Reset transform back to 0 on next tick
          this.$nextTick(() => {
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
          })
        })
      }, 400) // matches zoom-out animation duration
    },
  },
}
</script>
