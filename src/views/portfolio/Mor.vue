<template>
  <div :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h1 class="project-title">MOR</h1>
      <div class="project-main">
          <Media
            classes="project-main-item"
            src="mor/site/mor.com.br-31-03-19"
            :width="1947"
            :height="976"
            :isVideo="true"
            label="mor.com.br - homepage full tour"/>
      </div>

      <section class="project-description">
        <h2 class="project-description-text">
          MOR's website was developed at transa.
        </h2>
        <p class="project-description-text">
          It uses Vanilla JS, Less and Laravel (PHP).
        </p>
        <p class="project-description-text">
          The goal of the project was to build a fast and beautifull experience connecting MOR's channels and community in one place.
        </p>
        <p class="project-description-text">
          The JS and CSS are both less than 50k in size for the entire website to be loaded at blazing fast speeds and engage with MOR's community.
        </p>
        <p class="project-description-text">
          The main challenge was to code a feed with articles and links to MOR's vtex store, wich was also re-designed by Transa, creating a cohesive eperience between the store and the website.
        </p>
      </section>
      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item">
                <Media
                  src="mor/site/mor.com.br-31-03-19-1-mobile"
                  :width="1920"
                  :height="4167"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="mor/site/mor-article--mor-explica-como-cuidar-da-sua-piscina"
                  :width="1920"
                  :height="5996"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item">
                <Media
                  src="mor/site/mor-article--cada-doçura-da-linha-baby"
                  :width="1920"
                  :height="4318"
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

      <section class="project-description">
        <p class="project-description-text">
         The store was re-stylized, changing the entire identity inside the already build store using the VTEX e-commerce platform.
        </p>
      </section>


      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 2.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="mor/loja/mor-lojamor-tour"
                  :width="1939"
                  :height="976"
                  :canExpand="true"
                  :isVideo="true"
                  label="mor.com.br - store tour "/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="mor/loja/https-www.lojamor.com.br-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="mor.com.br - store mobile tour "/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item">
                <Media
                  src="mor/loja/mor-lojamor--categoria-isotermicos-2020-12-15"
                  :width="1920"
                  :height="5017"
                  :canExpand="true"
                  label="mor.com.br - store - category page screenshoot"/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
                <Media
                  src="mor/loja/mor-lojamor--produto-sombrinha-joy-sortida-3778-verde-p-2020-12-15"
                  :width="1920"
                  :height="5112"
                  :canExpand="true"
                  label="mor.com.br - store - product page screenshoot"/>
            </div>
          </slide>

          <template #addons>
            <navigation />
            <pagination />
          </template>
        </carousel>
      </section>


      <section class="project-description">
        <p class="project-description-text">
         Working at Transa, we also built a where to find for the brand, listing it's main locations using the Google Maps API.
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="mor/where-to-find/mor-onde-encontrar"
                  :width="1947"
                  :height="976"
                  :canExpand="true"
                  :isVideo="true"
                  label="mor.com.br - where to find tour"/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="mor/where-to-find/mor.com.br-onde-encontrar-31-03-19-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="mor.com.br - where to find mobile tour"/>
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
  name: 'Mor',
}
</script>

<style lang="scss">
@import '../../sass/projects';
@import '../../sass/modal';
</style>