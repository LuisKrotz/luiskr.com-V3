<template>
  <article>
    <div
      id="main"
      class="project modal-below"
      :style="'transform: translateY(-' + modal.transform + 'px);'"
    >
      <h2 class="internal-title">
        <DrawText v-if="translations" :text="translations.title" trigger="viewport" :key="'ttl1'" />
        <span
          v-else
          class="skeleton--shimmer"
          style="display: inline-block; width: 45%; height: 1em; border-radius: 4px"
          :key="'ttl2'"
        ></span>
      </h2>
      <div class="internal-main">
        <Media
          v-if="translations"
          classes="internal-main-item"
          :src="translations.folder + translations.cover.src"
          :width="translations.cover.size[0]"
          :height="translations.cover.size[1]"
          :isVideo="translations.cover?.isVideo ?? false"
          :autoPlay="true"
          :label="translations.cover.label"
          :key="this.$store.getters.getlang.locale + this.$route.meta.translation"
        />
        <!-- Cover skeleton while data loads -->
        <div
          v-else
          class="render-media skeleton--shimmer internal-main-item"
          key="'skelCover'"
          style="width: 100%; aspect-ratio: 1920 / 798; border-radius: 16px"
        ></div>
      </div>

      <transition name="fade">
        <div v-if="translations?.sections" :key="'section-data'">
          <section v-for="parentKey in translations.sections.length" :key="parentKey">
            <template
              v-for="(child, childkey) in translations.sections[parentKey - 1]"
              :key="childkey"
            >
              <div v-if="typeof child[0] === 'string'" class="internal-description">
                <template v-for="(item, itemkey) in child" :key="itemkey">
                  <h3 v-if="childkey === 0 && itemkey < 1" class="internal-description-text">
                    <DrawText
                      :text="item"
                      trigger="viewport"
                      :delay="textDelay(child)"
                      :offset="textOffset(child, itemkey)"
                    />
                  </h3>
                  <p v-else class="internal-description-text">
                    <DrawText
                      :text="item"
                      trigger="viewport"
                      :delay="textDelay(child)"
                      :offset="textOffset(child, itemkey)"
                    />
                  </p>
                </template>
              </div>
              <Carousel v-else :items="child" :force-active="isLandscapeGroup(child)">
                <template #default="slotProps">
                  <div
                    v-if="slotProps?.item"
                    :class="'internal-extra-item ' + (slotProps.item?.class ?? '')"
                  >
                    <Media
                      v-if="slotProps.isVisible"
                      :src="translations.folder + slotProps.item.src"
                      :width="slotProps.item.size[0]"
                      :height="slotProps.item.size[1]"
                      :canExpand="slotProps.item?.canExpand ?? false"
                      :isVideo="slotProps.item?.isVideo ?? false"
                      :label="slotProps.item.label"
                    />
                    <!-- Non-visible slide: reserve space with correct aspect ratio,
                                     then show centered spinner. No network requests fired. -->
                    <!-- Non-visible carousel slide: reserve aspect-ratio space with skeleton -->
                    <figure v-else class="render-placeholder-figure">
                      <img
                        class="render-placeholder"
                        :src="svgPlaceholder(slotProps.item.size[0], slotProps.item.size[1])"
                        :width="slotProps.item.size[0]"
                        :height="slotProps.item.size[1]"
                        aria-hidden="true"
                        alt=""
                      />
                      <div class="render-media skeleton--media"></div>
                    </figure>
                  </div>
                </template>
              </Carousel>
            </template>
          </section>
        </div>
        <div v-else :key="'load-data'">
          <div class="internal-description">
            <h3
              class="internal-description-text skeleton--shimmer"
              style="width: 40%; height: 1.2em; border-radius: 4px; margin-bottom: 1em"
            ></h3>
            <p
              class="internal-description-text skeleton--shimmer"
              style="width: 100%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"
            ></p>
            <p
              class="internal-description-text skeleton--shimmer"
              style="width: 94%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"
            ></p>
            <p
              class="internal-description-text skeleton--shimmer"
              style="width: 65%; height: 1.4em; border-radius: 4px"
            ></p>
          </div>
          <!-- Skeleton carousel placeholders -->
          <div class="internal-extra">
            <div class="internal-extra-scroll">
              <div class="internal-extra-item" v-for="n in 3" :key="n">
                <div
                  class="render-media skeleton--shimmer"
                  style="aspect-ratio: 16/9; width: 100%; border-radius: 16px"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <Related />
    </div>

    <div id="#modal" class="modal-above" v-if="modal.open">
      <MediaExpanded
        :source="modal.media.source"
        :thumb="modal.media.thumb"
        :alt="modal.media.alt"
        :width="modal.media.width"
        :height="modal.media.height"
        :autoPlay="true"
        :isVideo="modal.media.isVideo"
      />
    </div>
  </article>
</template>

<script>
import { fetchFirebaseDb } from '../utils/db.js'
import Media from '../components/Media.vue'
import MediaExpanded from '../components/MediaExpanded.vue'

import Related from '../components/portfolio/Related.vue'
import Carousel from '../components/Carousel.vue'
import DrawText from '../components/DrawText.vue'

export default {
  data() {
    return {
      loading: this.$store.getters.getlang.loading,
      modal: this.$store.getters.getModal,
      translations: false,
    }
  },
  components: {
    Media,
    MediaExpanded,
    Related,
    Carousel,
    DrawText,
  },
  name: 'Render Project',
  created() {
    this.loadData()
  },
  mounted() {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 500)
  },

  watch: {
    $route(to) {
      const wait = 1000

      if (to.meta?.projectRoute) {
        this.$smoothScroll({
          duration: wait,
          updateHistory: false,
          scrollTo: 0,
        })

        this.loadData(wait)
      }
    },
    '$store.state.lang.locale'() {
      this.loadData(false)
    },
  },
  methods: {
    svgPlaceholder(w, h) {
      return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"%3E%3C/svg%3E`
    },

    // Dynamically calculate per-character delay so all paragraphs in the section finish in ~2.0s total
    textDelay(items) {
      if (!Array.isArray(items)) return 14
      const totalChars =
        items.reduce((sum, str) => {
          return sum + (typeof str === 'string' ? str.replace(/<[^>]+>/g, '').length : 0)
        }, 0) || 1
      // Target ~1800ms total section duration, clamped between 6ms (super fast) and 22ms
      return Math.max(6, Math.min(22, Math.round(1800 / totalChars)))
    },

    // Cumulative offset for sequential paragraph animation:
    // Paragraph i starts exactly when paragraph i-1 finishes!
    textOffset(items, idx) {
      if (!Array.isArray(items)) return 0
      const delay = this.textDelay(items)
      let offset = 0
      for (let i = 0; i < idx; i++) {
        const chars = items[i] ? items[i].replace(/<[^>]+>/g, '').length : 0
        offset += chars * delay + 30 // 30ms seamless gap after previous item finishes
      }
      return offset
    },
    // Returns true when every item in a child group is landscape-class.
    // Landscape carousels are always forced active (even with only 2 items),
    // since a plain row of 2 wide images overflows and looks bad.
    isLandscapeGroup(group) {
      return (
        Array.isArray(group) && group.length >= 1 && group.every((i) => i?.class === 'landscape')
      )
    },
    checkAutoOpenModal() {
      const slug = this.$route.params.slug
      if (!slug || !this.translations) return

      const slugify = (text) =>
        (text || '')
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/[\s_]+/g, '-')
          .replace(/--+/g, '-')

      const targetSlug = slugify(slug)

      let foundItem = null
      if (Array.isArray(this.translations.sections)) {
        for (const section of this.translations.sections) {
          if (!Array.isArray(section)) continue
          for (const block of section) {
            if (!Array.isArray(block)) continue
            for (const item of block) {
              if (item && typeof item === 'object' && item.label) {
                if (slugify(item.label) === targetSlug) {
                  foundItem = item
                  break
                }
              }
            }
            if (foundItem) break
          }
          if (foundItem) break
        }
      }

      if (foundItem) {
        const storage = this.$store.getters.getStorage
        const folder = this.translations.folder || ''
        const srcPath = folder + foundItem.src
        const isVideo = foundItem.isVideo ?? false
        const moz = '-mozjpg'
        const extension = '.jpg'

        const source = isVideo
          ? storage + srcPath + '.mp4'
          : storage + srcPath + moz + '-uncompressed' + extension
        const thumb = isVideo
          ? storage + srcPath + '.mp4.jpg-thumb.jpg'
          : storage + srcPath + moz + '3-MSSIM-tuned-kodak' + extension

        this.$store.commit('setModal', {
          transform: 0,
          class: 'modal-open',
          open: true,
          media: {
            source,
            thumb,
            alt: foundItem.label,
            width: foundItem.size ? foundItem.size[0] : 1920,
            height: foundItem.size ? foundItem.size[1] : 1080,
            isVideo,
          },
        })
      }
    },

    updateRobotsMeta(noindex) {
      let meta = document.querySelector('meta[name="robots"]')
      if (noindex) {
        if (!meta) {
          meta = document.createElement('meta')
          meta.name = 'robots'
          document.head.appendChild(meta)
        }
        meta.content = 'noindex, nofollow'
      } else {
        if (meta) {
          meta.remove()
        }
      }
    },

    loadData(wait = false) {
      const lang = this.$store.getters.getlang
      this.translations = false

      let projectKey = this.$route.params.projectSlug || this.$route.meta.translation
      if (projectKey === 'brazilian-leather') projectKey = 'cicb'
      if (projectKey === 'clinica-de-desenvolvimento-nathalia-bond') projectKey = 'nathalia-bond'
      if (projectKey === 'genesysinf-sageweb') projectKey = 'sage'
      if (projectKey === 'minimelissa') projectKey = 'mini-melissa'

      fetchFirebaseDb(lang.database + lang.locale + lang.projectPath + projectKey)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val()
            if (data.title) {
              document.title = 'Luis Krötz | ' + data.title
            }
            this.updateRobotsMeta(data.noindex === true)
            if (!wait) {
              this.translations = data
              this.$nextTick(() => this.checkAutoOpenModal())
            } else {
              setTimeout(() => {
                this.translations = data
                this.$nextTick(() => this.checkAutoOpenModal())
              }, wait)
            }
          } else {
            console.log(
              "%cERROR: could't find PROJECT DATA for " + projectKey,
              this.$sharedData.styles.info
            )
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },

  beforeUnmount() {
    this.updateRobotsMeta(false)
  },
}
</script>

<style lang="scss">
@import '../sass/internals';
@import '../sass/modal';
</style>
