<template>
  <figure
    :class="canExpand ? 'internal-expand' : ''"
    @click="openModal"
    :style="styles"
    :title="label"
  >
    <img
      decoding="async"
      class="render-placeholder"
      :src="placeholder(width, height)"
      :width="width"
      :height="height"
      alt=""
      aria-hidden="true"
    />

    <img
      decoding="async"
      v-if="!isVideo"
      v-wasm-lazy="storage + src + q50"
      ref="mediaImg"
      :class="['render-media', classes, { 'render-media--loaded': isLoaded }]"
      :width="width"
      :height="height"
      :alt="label"
      :src="currentSrc"
    />

    <video
      v-else
      ref="mediaVideo"
      :class="'render-media ' + classes"
      :poster="poster[0]"
      :width="displayWidth"
      :height="displayHeight"
      :alt="label"
      :preload="autoPlay || classes.includes('internal-main-item') ? 'metadata' : 'none'"
      playsinline
      loop
      muted
      :controls="isReducedMotion"
      @mouseenter="play($event)"
      @mouseover="play($event)"
      @mouseleave="pause($event)"
      @mouseout="pause($event)"
      @mousedown="play($event)"
      @loadeddata="onVideoLoaded($event)"
      @error="onVideoError($event)"
    >
      <source :src="videoSrcMain" type="video/mp4" />
    </video>

    <template v-if="canExpand">
      <button class="expand-modal-open-1" data-no-snippet>
        {{ action }} {{ translations?.toOpen }}
      </button>
      <button class="expand-modal-open-2" aria-hidden="true" tabindex="-1" data-no-snippet></button>
    </template>
  </figure>
</template>

<script>
import { gpuAccel } from '../utils/gpu-accel.js'
import { calcAspectScaled } from '../utils/wasm-layout.js'
import { localMediaCache } from '../utils/local-media-cache.js'

const moz = '-mozjpg',
  extension = '.jpg',
  videoExtension = '.mp4',
  vidPlaceholderExt = videoExtension + '.jpg-thumb.jpg',
  scale = '.mp4-scaledown-2x'

export default {
  name: 'Media',
  data() {
    return {
      storage: this.$store.getters.getStorage,
      thumb: moz + '3-MSSIM-tuned-kodak' + extension,
      q50: moz + '-50' + extension,
      q100: moz + '-uncompressed' + extension,
      high: false,
      styles: '',
      poster: [],
      video: [],
      currentSrc: '',
      isLoaded: false,
      observer: null,
      imgObserver: null,
      translations: this.$store.getters.getlang.components?.media ?? {},
    }
  },
  props: {
    classes: { type: String, default: '', required: false },
    src: { type: String, required: true },
    label: { type: String, default: '', required: false },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    canExpand: { type: Boolean, default: false, required: false },
    isVideo: { type: Boolean, default: false, required: false },
    autoPlay: { type: Boolean, default: false, required: false },
  },
  computed: {
    action() {
      return this.$store.getters.getClickOrTap
    },
    // Computed so the src is always a defined string, never undefined
    videoSrcMain() {
      return this.video.length >= 2 ? this.video[1] : ''
    },
    isReducedMotion() {
      return this.$store.getters.getReducedMotion
    },
    // Cap video HTML width/height attrs at 1920px to prevent the browser from
    // treating a 3840×2160 native resolution as the intrinsic display size —
    // which causes the poster image (used as LCP candidate) to be fetched at
    // 4K resolution even when displayed at ~400px. Capping to 1920 still
    // provides a sharp poster on any real display without the 84 KiB penalty.
    displayWidth() {
      const MAX = 1920
      if (!this.isVideo || this.width <= MAX) return this.width
      return MAX
    },
    displayHeight() {
      const MAX = 1920
      if (!this.isVideo || this.width <= MAX) return this.height
      return calcAspectScaled(this.width, this.height, MAX)
    },
  },
  created() {
    if (this.isVideo) {
      const base = this.storage + this.src
      const urls = [
        [base + vidPlaceholderExt, base + videoExtension],
        [base + scale + vidPlaceholderExt, base + scale + videoExtension],
      ]
      this.poster = urls.map((a) => a[0])
      this.video = urls.map((a) => a[1])
    } else {
      this.currentSrc = this.storage + this.src + this.thumb
    }
  },
  mounted() {
    if (this.$el) gpuAccel.accelerateElementGPU(this.$el)
    if (this.canExpand) this.styles = { position: 'relative' }

    // Auto-play videos automatically when they scroll into the viewport (unless Reduced Motion is enabled)
    if (this.isVideo) {
      if (!this.isReducedMotion) {
        this.$nextTick(() => {
          const vid = this.$refs.mediaVideo
          if (!vid) return

          this.observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  vid.play().catch(() => {})
                } else {
                  vid.pause()
                }
              })
            },
            { threshold: 0.15 }
          )
          this.observer.observe(vid)
        })
      }
    } else {
      // Native Progressive Image Lazyloader:
      // Starts with low-res `thumb` placeholder instantly, then preloads high-res `q50`
      // 200px before scrolling into viewport (both vertical page scroll & horizontal carousel).
      this.$nextTick(() => {
        const target = this.$refs.mediaImg || this.$el
        if (!target) return

        this.imgObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !this.isLoaded) {
                this.loadHighRes()
                if (this.imgObserver) {
                  this.imgObserver.disconnect()
                  this.imgObserver = null
                }
              }
            })
          },
          { rootMargin: '100px 50px', threshold: 0.01 }
        )
        this.imgObserver.observe(target)
      })
    }
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  },
  methods: {
    play(e) {
      if (!this.isReducedMotion && e.target?.play) {
        e.target
          .play()
          .then(() => {
            gpuAccel.processVideoGPU(e.target, this.displayWidth || 640, this.displayHeight || 360)
          })
          .catch(() => {})
      }
    },
    pause(e) {
      if (!this.isReducedMotion && e.target?.pause) {
        e.target.pause()
      }
    },
    onVideoLoaded(e) {
      if (e?.target) {
        gpuAccel.processVideoGPU(e.target, this.displayWidth || 640, this.displayHeight || 360)
      }
    },
    onVideoError(e) {
      if (e?.target?.hasAttribute?.('poster')) {
        e.target.removeAttribute('poster')
      }
    },
    placeholder(width, height) {
      return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"%3E%3C/svg%3E`
    },
    async loadHighRes() {
      const targetUrl = this.storage + this.src + this.q50
      const localUrl = await localMediaCache.fetchOrGetLocalMedia(targetUrl)

      const img = new Image()
      img.src = localUrl
      const applySource = () => {
        this.currentSrc = localUrl
        this.isLoaded = true
      }
      img.onload = () => {
        gpuAccel.processTextureGPU(img, this.displayWidth, this.displayHeight)
        if (img.decode) {
          img.decode().then(applySource).catch(applySource)
        } else {
          applySource()
        }
      }
    },
    slugify(text) {
      return (text || '')
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/--+/g, '-')
    },
    openModal() {
      if (!this.canExpand) return
      const scrollY = window.scrollY
      this.$store.commit('setModal', {
        transform: scrollY,
        class: 'modal-open',
        open: true,
        media: {
          source: this.isVideo ? this.video[0] : this.storage + this.src + this.q100,
          thumb: this.isVideo ? this.poster[0] : this.storage + this.src + this.thumb,
          alt: this.label,
          width: this.width,
          height: this.height,
          isVideo: this.isVideo,
        },
      })
      // Push slug to URL: /portfolio/project/image-slug
      const slug = this.slugify(this.label)
      if (slug) {
        // Build the project base path (strip existing slug param if present)
        const routeSlug = this.$route.params?.slug
        const currentPath = this.$route.path.replace(/\/$/, '')
        const basePath = routeSlug
          ? currentPath.slice(0, currentPath.length - routeSlug.length - 1) // remove /slug
          : currentPath
        const newPath = basePath + '/' + slug
        if (currentPath !== newPath) {
          history.replaceState({}, '', newPath)
        }
      }
    },
  },
}
</script>
