<template>
  <article>
    <div
      id="main"
      class="project modal-below"
      :style="'transform: translateY(-' + modal.transform + 'px);'"
    >
      <h2 class="internal-title">
        <DrawText v-if="translations" :text="translations.title" trigger="viewport" :key="'ttl1'" />
        <span v-else class="skeleton--shimmer" style="display: inline-block; width: 45%; height: 1em; border-radius: 4px" :key="'ttl2'"></span>
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
                  <h3
                    v-if="childkey === 0 && itemkey < 1"
                    class="internal-description-text"
                  >
                    <DrawText :text="item" trigger="viewport" :delay="20" :offset="itemkey * 60" />
                  </h3>
                  <p v-else class="internal-description-text">
                    <DrawText :text="item" trigger="viewport" :delay="20" :offset="itemkey * 60" />
                  </p>
                </template>
              </div>
              <Carousel v-else :items="child" :force-active="isLandscapeGroup(child)">
                <template #default="{ item, isVisible }">
                  <div :class="'internal-extra-item ' + (item?.class ?? '')">
                    <Media
                      v-if="isVisible"
                      :src="translations.folder + item.src"
                      :width="item.size[0]"
                      :height="item.size[1]"
                      :canExpand="item?.canExpand ?? false"
                      :isVideo="item?.isVideo ?? false"
                      :label="item.label"
                    />
                    <!-- Non-visible slide: reserve space with correct aspect ratio,
                                     then show centered spinner. No network requests fired. -->
                    <!-- Non-visible carousel slide: reserve aspect-ratio space with skeleton -->
                    <figure v-else class="render-placeholder-figure">
                      <img
                        class="render-placeholder"
                        :src="svgPlaceholder(item.size[0], item.size[1])"
                        :width="item.size[0]"
                        :height="item.size[1]"
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
            <h3 class="internal-description-text skeleton--shimmer" style="width: 40%; height: 1.2em; border-radius: 4px; margin-bottom: 1em"></h3>
            <p class="internal-description-text skeleton--shimmer" style="width: 100%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"></p>
            <p class="internal-description-text skeleton--shimmer" style="width: 94%; height: 1.4em; border-radius: 4px; margin-bottom: 0.6em"></p>
            <p class="internal-description-text skeleton--shimmer" style="width: 65%; height: 1.4em; border-radius: 4px"></p>
          </div>
          <!-- Skeleton carousel placeholders -->
          <div class="internal-extra">
            <div class="internal-extra-scroll">
              <div class="internal-extra-item" v-for="n in 3" :key="n">
                <div class="render-media skeleton--shimmer" style="aspect-ratio: 16/9; width: 100%; border-radius: 16px"></div>
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
import { getDatabase, ref, child, get } from 'firebase/database'
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

  beforeUnmount() {
    if (this.parallaxObserver) {
      this.parallaxObserver.disconnect()
      this.parallaxObserver = null
    }
  },
  watch: {
    // Re-init parallax after translations load and sections render
    translations(val) {
      if (val) {
        this.$nextTick(() => this.initParallax())
      }
    },
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
  },
  methods: {
    svgPlaceholder(w, h) {
      return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"%3E%3C/svg%3E`
    },

    // Cumulative offset for sequential paragraph animation
    // First item (heading): delay=60, subsequent (paragraphs): delay=20
    textOffset(items, idx) {
      let offset = 0
      for (let i = 0; i < idx; i++) {
        const chars = items[i].replace(/<[^>]+>/g, '').length
        const delay = i === 0 ? 60 : 20
        offset += chars * delay + 300 // 300ms gap between paragraphs
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
    // Initialise IntersectionObserver for section parallax entrance animation
    initParallax() {
      const sections = this.$el?.querySelectorAll('section')
      if (!sections?.length) return

      this.parallaxObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('section--visible')
              // Once visible, stop observing (entrance is one-shot)
              this.parallaxObserver.unobserve(e.target)
            }
          })
        },
        { threshold: 0.08 }
      )

      sections.forEach((s) => this.parallaxObserver.observe(s))
    },
    loadData(wait = false) {
      const lang = this.$store.getters.getlang
      document.title = this.$route.meta.title
      this.translations = false

      get(
        child(
          ref(getDatabase()),
          lang.database + lang.locale + lang.projectPath + this.$route.meta.translation
        )
      )
        .then((snapshot) => {
          if (snapshot.exists()) {
            if (!wait) {
              this.translations = snapshot.val()
            } else {
              setTimeout(() => {
                this.translations = snapshot.val()
              }, wait)
            }
          } else {
            console.log("%cERROR: could't find PROJECT DATA", this.$sharedData.styles.info)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
}
</script>

<style lang="scss">
@import '../sass/internals';
@import '../sass/modal';
</style>
