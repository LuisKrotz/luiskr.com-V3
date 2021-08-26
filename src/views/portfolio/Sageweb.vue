<template>
  <div :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h1 class="project-title">Sageweb</h1>
      <div class="project-main">
        <Media
          classes="project-main-item"
          src="genesysinf/genesysinf-sageweb-2015-atalhos"
          :width="1366"
          :height="649"
          label=""/>
      </div>

      <section class="project-description">
        <h2 class="project-description-text">Sage is a project developed by Genesysinf, at the city of Santana do Livramento, in Brazil, and is a fiscal software.</h2>
        <p class="project-description-text">I worked in the new version of Sage, the Sageweb in C# and Asp.net, in this Project I was working as fullstack developer, in the development team for a year. </p>
        <p class="project-description-text">The project consisted of porting the Sage for desktop software code to a new Web Version, with challenges like connecting fiscal printer drivers to a web application, generating and printing custom fiscal reports and developing an interface similar to the Sage desktop. </p>
      </section>

      <section class="project-extra">
        <carousel items-to-show="11.25" :wrapAround="true">
          <slide key="1">
          <div class="project-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-cadastros-sageweb"
                  :width="1352"
                  :height="649"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-color-picker"
                  :width="1353"
                  :height="650"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-filtros"
                  :width="1352"
                  :height="650"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-intro"
                  :width="1351"
                  :height="651"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="5">
            <div class="project-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-mapa-sageweb"
                  :width="1366"
                  :height="650"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="6">
            <div class="project-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-modulo-NFE"
                  :width="1352"
                  :height="650"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="7">
            <div class="project-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-orndenar-atalhos"
                  :width="1351"
                  :height="604"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="8">
            <div class="project-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-personalizar"
                  :width="1354"
                  :height="650"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="9">
            <div class="project-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-relatórios-gerenciais"
                  :width="1351"
                  :height="650"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="10">
            <div class="project-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-relatórios-gerenciais-por-mes"
                  :width="1350"
                  :height="649"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="11">
            <div class="project-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-sistema-de-pesquisas-em-jquery"
                  :width="1366"
                  :height="651"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="12">
            <div class="project-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-temas"
                  :width="1352"
                  :height="651"
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
  name: 'Sageweb',
}
</script>

<style lang="scss">
@import '../../sass/projects';
@import '../../sass/modal';
</style>