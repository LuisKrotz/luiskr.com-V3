<template>
  <div :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h1 class="project-title">Coza</h1>
      <div class="project-main">
          <Media
            classes="project-main-item"
            src="coza/feed+shop/coza.com.br-feed-2019-tour"
            :width="1943"
            :height="976"
            :isVideo="true"
            label="coza.com.br - homepage full tour"/>
      </div>

      <section class="project-description">
        <h2 class="project-description-text">
          Coza's website was developed at Transa from 2017 to 2019.
        </h2>
        <p class="project-description-text">
          It mainly used Vanilla JS, Less and Laravel (PHP). The goaf of the project was to create a fast, beautifull and pixel perfect experience that reflect's the new brading made by Transa for Coza.
        </p>
        <p class="project-description-text">
          Coza's main page was a feed of content created for the brand, with articles, galleries, photos and links to the online store.
        </p>
        <p class="project-description-text">
          The project also have a store front with a list of all the products listed on the online store, feeded by Ajax from the the back-end with the content updated constantly from the Brinox store.
        </p>
      </section>

      <section class="project-extra">
        <div class="project-extra-scroll">
            <div class="project-extra-item">
                <Media
                  src="coza/feed+shop/coza.com.br-31-03-19-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="coza.com.br - mobile full tour"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="coza/feed+shop/coza.com.br-feed-2019-full-page"
                  :width="1920"
                  :height="22418"
                  :canExpand="true"
                  label="coza.com.br - full page screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="coza/feed+shop/coza.com.br-en-2020-12-15-18-54"
                  :width="1920"
                  :height="4861"
                  :canExpand="true"
                  label="coza.com.br - english homepage"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="coza/articles+galleries+photo/coza-article--organização-coza-com-as-dicas-da-maysa"
                  :width="1920"
                  :height="2423"
                  :canExpand="true"
                  label="coza.com.br - article - Organização com as dicas da maysa."/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="coza/articles+galleries+photo/coza-article--image-gallery-a-cada-instante-da-rotina-mais-coza+pantone"
                  :width="1920"
                  :height="2249"
                  :canExpand="true"
                  label="coza.com.br - image gallery - A cada instante da rotina. Mais coza + pantone."/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="coza/articles+galleries+photo/coza-article--seu-banheiro-cheio-de-beleza"
                  :width="1920"
                  :height="2414"
                  :canExpand="true"
                  label="coza.com.br - article - Seu banheiro cheio de beleza."/>
            </div>
        </div>
      </section>


      <section class="project-description">
        <p class="project-description-text">
          And a Where to find page, listing all the locations where the Brand cand be found, using the Google Maps API.
        </p>
      </section>


      <section class="project-extra">
        <div class="project-extra-scroll">
            <div class="project-extra-item landscape">
                <Media
                  src="coza/where-to-find/coza-onde-encontrar-tour"
                  :width="1947"
                  :height="976"
                  :canExpand="true"
                  :isVideo="true"
                  label="coza.com.br - where to find page on desktop"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="coza/where-to-find/coza.com.br-onde-encontrar-31-03-19-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="coza.com.br - where to find page on mobile "/>
            </div>
        </div>
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
    Related
  },
  mounted() {
    window.scrollTo(0,0);
  },
  name: 'Coza',
}
</script>

<style lang="scss">
@import '../../sass/projects';
@import '../../sass/modal';
</style>