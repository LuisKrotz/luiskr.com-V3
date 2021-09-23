<template>
  <div :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h1 class="project-title">Marco Almeida</h1>
      <div class="project-main">
            <Media
              classes="project-main-item"
              src="aboutmarco/home/aboutmarco.com-2020-full-page-home-tour"
              :width="1462"
              :height="784"
              :isVideo="true"
              label="aboutmarco.com - homepage full tour"/>
      </div>

      <section class="project-description">
        <h2 class="project-description-text">
          Marco's Portfolio was developed as a Freelancing project in 2021.
        </h2>
        <p class="project-description-text">
          It uses Vue.JS and Sass.
        </p>
        <p class="project-description-text">
          All animations are done in css.
        </p>
        <p class="project-description-text">
          The main goal to achieve was to create a pixel perfect project, with smooth animations and a pixel perfect UI.
        </p>
        <p class="project-description-text">
          I also did the server setup at Digital Ocean.
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 6.5, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item">
                <Media
                  src="aboutmarco/home/aboutmarco.com-mobile-mobile"
                  :width="830"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label="aboutmarco.com - mobile tour"/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="aboutmarco/home/aboutmarco.com-2020-home"
                  :width="1920"
                  :height="3003"
                  :canExpand="true"
                  label="aboutmarco.com - homepage"/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item">
                <Media
                  src="aboutmarco/pages/aboutmarco.com-pages--melissa-insider-2020-12-15"
                  :width="1920"
                  :height="10094"
                  :canExpand="true"
                  label="aboutmarco.com - melissa insider"/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
              <Media
                src="aboutmarco/pages/aboutmarco.com-pages--melissa-2020-12-15"
                :width="1920"
                :height="10229"
                :canExpand="true"
                label="aboutmarco.com - melissa"/>
            </div>
          </slide>
          <slide key="5">
            <div class="project-extra-item">
              <Media
                src="aboutmarco/pages/aboutmarco.com-pages--coza-2020-12-15"
                :width="1920"
                :height="26871"
                :canExpand="true"
                label="aboutmarco.com - coza"/>
            </div>
          </slide>
          <slide key="6">
            <div class="project-extra-item">
              <Media
                src="aboutmarco/pages/aboutmarco.com-pages--brazilian-leather-2020-12-15"
                :width="1920"
                :height="16075"
                :canExpand="true"
                label="aboutmarco.com - brazilian leather"/>
            </div>
          </slide>
          <slide key="7">
            <div class="project-extra-item">
              <Media
                src="aboutmarco/about/aboutmarco.com-me-2020-12-15-23_29_35"
                :width="1920"
                :height="7137"
                :canExpand="true"
                label="aboutmarco.com - me"/>
            </div>
          </slide>
          <slide key="8">
            <div class="project-extra-item">
              <Media
                src="aboutmarco/about/aboutmarco.com-archive-2020-12-15-23_31_53"
                :width="1920"
                :height="3788"
                :canExpand="true"
                label="aboutmarco.com - archive"/>
            </div>
          </slide>

          <template #addons>
            <navigation />
            <pagination />
          </template>
        </carousel>
      </section>


        <section class="project-description">
          <h2 class="project-description-text">
            Check below for some of the awards received by Marco's porfolio.
          </h2>
        </section>


        <section class="project-extra">
          <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 5.5, snapAlign: 'center'}}">
            <slide key="1">
              <div class="project-extra-item landscape">
                  <Media
                    src="aboutmarco/awards/aboutmarco.com-awards--admiretheweb"
                    :width="1440"
                    :height="820"
                    label="aboutmarco.com - admiretheweb"/>
              </div>
            </slide>
            <slide key="2">
              <div class="project-extra-item landscape">
                  <Media
                    src="aboutmarco/awards/aboutmarco.com-awards--cssawards"
                    :width="1440"
                    :height="740"
                    label="aboutmarco.com - css awards"/>
              </div>
            </slide>
            <slide key="3">
              <div class="project-extra-item landscape">
                  <Media
                    src="aboutmarco/awards/aboutmarco.com-awards--csswinner"
                    :width="1440"
                    :height="652"
                    label="aboutmarco.com - css awards winner"/>
              </div>
            </slide>
            <slide key="4">
              <div class="project-extra-item landscape">
                  <Media
                    src="aboutmarco/awards/aboutmarco.com-awards--hm"
                    :width="920"
                    :height="654"
                    label="aboutmarco.com - Honorable Mention"/>
              </div>
            </slide>
            <slide key="5">
              <div class="project-extra-item landscape">
                  <Media
                    src="aboutmarco/awards/aboutmarco.com-awards--me"
                    :width="1440"
                    :height="652"
                    label="aboutmarco.com - ME"/>
              </div>
            </slide>
            <slide key="6">
              <div class="project-extra-item landscape">
                  <Media
                    src="aboutmarco/awards/aboutmarco.com-awards--mindspark"
                    :width="677"
                    :height="722"
                    label="aboutmarco.com - mindspark"/>
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
  name: 'Marco Almeida',
}
</script>

<style lang="scss">
@import '../../sass/projects';
@import '../../sass/modal';
</style>