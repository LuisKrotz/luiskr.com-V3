<template>
  <article>
    <div id="main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h2 class="internal-title">
          <span v-if="translations" v-html="translations.title" :key="'ttl1'"></span>
          <span v-else :key="'ttl2'">{{ loading.msg1 }}</span>
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
            :key="this.$store.getters.getlang.locale + this.$route.meta.translation"/>
            <LoadSVG v-else :classes="'load-svg internal-main-item'" :renderText="false" :key="'loadSVG1'"/>
      </div>

      <transition name="fade">
        <div v-if="translations?.sections" :key="'section-data'">
          <section v-for="parentKey in translations.sections.length" :key="parentKey">
                <template v-for="child, childkey  in translations.sections[parentKey - 1]" :key="childkey">
                    <div v-if="typeof child[0] === 'string'" class="internal-description">
                        <template v-for="item, itemkey in child" :key="itemkey">
                            <h3 v-if="childkey === 0 && itemkey < 1" class="internal-description-text" v-html="item"></h3>
                            <p v-else class="internal-description-text" v-html="item"></p>
                        </template>
                    </div>
                    <div v-else class="internal-extra">
                        <div class="internal-extra-scroll">
                            <div v-for="item, itemkey in child" :key="itemkey" :class="'internal-extra-item ' + (item?.class ?? '')">
                                <Media
                                :src="translations.folder + item.src"
                                :width="item.size[0]"
                                :height="item.size[1]"
                                :canExpand="item?.canExpand ?? false"
                                :isVideo="item?.isVideo ?? false"
                                :label="item.label"/>
                            </div>
                        </div>
                    </div>
                </template>
          </section>
        </div>
        <div v-else :key="'load-data'">
          <div class="internal-description">
            <p class="internal-description-text">{{ loading.msg3 }}</p>
          </div>
          <div class="internal-extra">
              <div class="internal-extra-scroll">
                <div class="internal-extra-item" v-for="n in 5" :key="n">
                  <figure>
                    <LoadSVG :classes="'load-svg render-media ' + (n % 2 === 0 ? 'flip': '')" :renderText="false" />
                  </figure>
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
        :isVideo="modal.media.isVideo"/>
    </div>
  </article>
</template>

<script>
import { getDatabase, ref, child, get } from "firebase/database";
import Media                            from'../components/Media';
import MediaExpanded                    from'../components/MediaExpanded';
import LoadSVG                          from'../components/LoadSVG';
import Related                          from'../components/portfolio/Related';


export default {
  data() {
    return {
      loading:      this.$store.getters.getlang.loading,
      modal:        this.$store.getters.getModal,
      translations: false
    }
  },
  components: {
    Media,
    MediaExpanded,
    Related,
    LoadSVG
  },
  name: 'Render Project',
  created() {
    this.loadData();
  },
  mounted() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  },
  watch:{
    $route (to) {
        const wait =  1000;

        if (to.meta?.projectRoute) {
          this.$smoothScroll({
            duration: wait,
            updateHistory: false,
            scrollTo: 0
          });

          this.loadData(wait);
        }
    }
  },
  methods: {
    loadData(wait = false) {
      let lang = this.$store.getters.getlang;
      document.title = this.$route.meta.title;
      this.translations =  false;

      get(child(ref(getDatabase()), lang.database + lang.locale + lang.projectPath + this.$route.meta.translation)).then((snapshot) => {
        if (snapshot.exists()) {
          if(!wait) {
            this.translations = snapshot.val();
          } else {
            setTimeout(() => {
              this.translations = snapshot.val();
            }, wait);
          }
        } else {
          console.log('%cERROR: could\'t find PROJECT DATA', this.$sharedData.styles.info);
        }
      }).catch((error) => {
        console.error(error);
      });
    }
  }
}
</script>

<style lang="scss">
@import '../sass/internals';
@import '../sass/modal';
</style>