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
        <h2>
          Marco's Portfolio was developed as a Freelancing project.
        </h2>
        <p>
          It uses Vue.JS and Sass.
        </p>
        <p>
          All animations are done in css.
        </p>
        <p>
          The main goal to achieve was to create a pixel perfect project, with smooth animations and a pixel perfect UI.
        </p>
        <p>
          I also did the server setup at Digital Ocean.
        </p>
      </section>

      <section class="project-extra">
        <carousel items-to-show="5.5" :wrapAround="true">
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
                  src="aboutmarco/pages/aboutmarco.com-pages--melissa-insider-2020-12-15"
                  :width="800"
                  :height="1200"
                  :canExpand="true"
                  label="aboutmarco.com - melissa insider"/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item">
              <Media
                src="aboutmarco/pages/aboutmarco.com-pages--melissa-2020-12-15"
                :width="800"
                :height="1200"
                :canExpand="true"
                label="aboutmarco.com - melissa"/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
              <Media
                src="aboutmarco/pages/aboutmarco.com-pages--coza-2020-12-15"
                :width="800"
                :height="1200"
                :canExpand="true"
                label="aboutmarco.com - coza"/>
            </div>
          </slide>
          <slide key="5">
            <div class="project-extra-item">
              <Media
                src="aboutmarco/pages/aboutmarco.com-pages--brazilian-leather-2020-12-15"
                :width="800"
                :height="1200"
                :canExpand="true"
                label="aboutmarco.com - brazilian leather"/>
            </div>
          </slide>
          <slide key="6">
            <div class="project-extra-item">
              <Media
                src="aboutmarco/about/aboutmarco.com-me-2020-12-15-23_29_35"
                :width="800"
                :height="1200"
                :canExpand="true"
                label="aboutmarco.com - me"/>
            </div>
          </slide>
          <slide key="7">
            <div class="project-extra-item">
              <Media
                src="aboutmarco/about/aboutmarco.com-archive-2020-12-15-23_31_53"
                :width="800"
                :height="1200"
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
      <router-view/>


      <footer class="project-footer">
          <h2 class="project-footer-title">PROJECTS</h2>
          <ul class="project-footer-related">
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/metcha">metcha</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/transa">transa</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/melissa">melissa</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/minimelissa">minimelissa</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/mor">mor</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/coza">coza</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/brazilian-leather">brazilian leather</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/vibra">vibra</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/genesysinf-sageweb">genesysinf</router-link>
            </li>
          </ul>

        <div class="project-footer-contact">
            <a class="project-footer-contact-link">Mail</a>
            <span class="project-footer-contact-separator">•</span>
            <a class="project-footer-contact-link">Linkedin</a>
            <span class="project-footer-contact-separator">•</span>
            <a class="project-footer-contact-link">Github</a>
            <span class="project-footer-contact-separator">•</span>
            <a class="project-footer-contact-link">Instagram</a>
          </div>
      </footer>
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

export default {
  data() {
    return {
      modal: this.$store.getters.getModal
    }
  },
  components: {
    Media,
    MediaExpanded,
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  mounted() {
  },
  name: 'Marco Almeida',
}
</script>

<style lang="scss">
@import '../../sass/projects';
@import '../../sass/modal';
</style>