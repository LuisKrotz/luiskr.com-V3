<template>
  <div :class="modal.class">
    <div id="#main" class="internal modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h1 class="internal-title">MOR</h1>
      <div class="internal-main">
          <Media
            classes="internal-main-item"
            src="mor/site/mor.com.br-31-03-19"
            :width="1947"
            :height="976"
            :isVideo="true"
            label="MOR: homepage full tour"/>
      </div>

      <section class="internal-description">
        <h2 class="internal-description-text">
          MOR's website was developed at transa.
        </h2>
        <p class="internal-description-text">
          It uses Vanilla JS, Less and Laravel (PHP).
        </p>
        <p class="internal-description-text">
          The goal of the project was to build a fast and beautifull experience connecting MOR's channels and community in one place.
        </p>
        <p class="internal-description-text">
          The JS and CSS are both less than 50k in size for the entire website to be loaded at blazing fast speeds and engage with MOR's community.
        </p>
        <p class="internal-description-text">
          The main challenge was to code a feed with articles and links to MOR's vtex store, wich was also re-designed by Transa, creating a cohesive eperience between the store and the website.
        </p>
      </section>
      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item">
                <Media
                  src="mor/site/mor.com.br-31-03-19-1-mobile"
                  :width="1920"
                  :height="4167"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="mor/site/mor-article--mor-explica-como-cuidar-da-sua-piscina"
                  :width="1920"
                  :height="5996"
                  :canExpand="true"
                  label=""/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="mor/site/mor-article--cada-doçura-da-linha-baby"
                  :width="1920"
                  :height="4318"
                  :canExpand="true"
                  label=""/>
            </div>
        </div>
      </section>

      <section class="internal-description">
        <p class="internal-description-text">
         The store was re-stylized, changing the entire identity inside the already build store using the VTEX e-commerce platform.
        </p>
      </section>


      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="mor/loja/mor-lojamor-tour"
                  :width="1939"
                  :height="976"
                  :canExpand="true"
                  :isVideo="true"
                  label="MOR: store tour "/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="mor/loja/https-www.lojamor.com.br-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="MOR: store mobile tour "/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="mor/loja/mor-lojamor--categoria-isotermicos-2020-12-15"
                  :width="1920"
                  :height="5017"
                  :canExpand="true"
                  label="MOR: store - category page screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="mor/loja/mor-lojamor--produto-sombrinha-joy-sortida-3778-verde-p-2020-12-15"
                  :width="1920"
                  :height="5112"
                  :canExpand="true"
                  label="MOR: store - product page screenshoot"/>
            </div>
        </div>
      </section>


      <section class="internal-description">
        <p class="internal-description-text">
         Working at Transa, we also built a where to find for the brand, listing it's main locations using the Google Maps API.
        </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="mor/where-to-find/mor-onde-encontrar"
                  :width="1947"
                  :height="976"
                  :canExpand="true"
                  :isVideo="true"
                  label="MOR: where to find tour"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="mor/where-to-find/mor.com.br-onde-encontrar-31-03-19-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="MOR: where to find mobile tour"/>
            </div>
        </div>
      </section>


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
import Media from'../../components/Media';
import MediaExpanded from'../../components/MediaExpanded';
import Related from'../../components/portfolio/Related';

export default {
  data() {
    return {
      modal: this.$store.getters.getModal
    }
  },
  created() {
    document.title = this.$route.meta.title;
  },
  components: {
    Media,
    MediaExpanded,
    Related
  },
  name: 'Mor',
}
</script>

<style lang="scss">
@import '../../sass/internals';
@import '../../sass/modal';
</style>