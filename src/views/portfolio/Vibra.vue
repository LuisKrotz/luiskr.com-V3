<template>
  <div :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h1 class="project-title">Vibra</h1>
      <div class="project-main">
          <Media
            classes="project-main-item"
            src="vibra/vibra.com.br-a-empresa-mais-inovadora-do-segmento-no-brasil-tour"
            :width="1438"
            :height="784"
            :isVideo="true"
            label=""/>
      </div>

      <section class="project-description">
        <h2 class="project-description-text">
           // TODO
        </h2>
        <p class="project-description-text">
          // TODO
        </p>
      </section>
      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item">
                <Media
                  src="vibra/https-www.vibra.com.br-mobile"
                  :width="832"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="vibra/vibra.com.br-a-empresa-mais-inovadora-do-segmento-no-brasil-production-and-distributuon-business-full-page"
                  :width="1920"
                  :height="2695"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item">
                <Media
                  src="vibra/vibra.com.br-a-empresa-mais-inovadora-do-segmento-no-brasil-our-brands-full-page"
                  :width="1920"
                  :height="32491"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
                <Media
                  src="vibra/vibra.com.br-a-empresa-mais-inovadora-do-segmento-no-brasil-more-than-five-decades-of-experience-and-tradition-in-aviculture-about-us-full-page"
                  :width="1920"
                  :height="7244"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <template #addons>
            <navigation />
            <pagination />
          </template>
        </carousel>
      </section>

      <router-view/>


      <Related />
    </div>

    <aside id="#modal" class="modal-above" v-if="modal.open">
      <MediaExpanded
        :source="modal.media.source"
        :thumb="modal.media.thumb"
        :alt="modal.media.alt"
        :width="modal.media.width"
        :height="modal.media.height"
        :isVideo="modal.media.isVideo"/>
    </aside>
  </div>
</template>

<script>
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

import Media from'../../components/Media';
import MediaExpanded from'../../components/MediaExpanded';
import Related from'../../components/portfolio/Related';

export default {
  data() {
    return {
      modal: this.$store.getters.getModal
    }
  },
  components: {
    Media,
    MediaExpanded,
    Related,
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  mounted() {
    window.scrollTo(0,0);
  },
  name: 'Vibra',
}
</script>

<style lang="scss">
@import '../../sass/projects';
@import '../../sass/modal';
</style>