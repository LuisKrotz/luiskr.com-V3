<template>
  <article :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h2 class="internal-title">Coza</h2>
      <div class="internal-main">
          <Media
            classes="internal-main-item"
            src="coza/feed+shop/coza.com.br-feed-2019-tour"
            :width="1943"
            :height="976"
            :isVideo="true"
            label="Coza: homepage full tour"/>
      </div>

      <section>
        <div class="internal-description">
          <h3 class="internal-description-text">
            <a href="https://transainc.com/cases/coza?utm_source=luiskr.com" target="_blank">Coza's website</a> was developed at Transa from 2017 to 2019.
          </h3>
          <p class="internal-description-text">
            It mainly used Vanilla JS, Less and Laravel (PHP). The goal of the project was to create a fast, beautiful and pixel perfect experience that reflects the new branding made by Transa for Coza.
          </p>
          <p class="internal-description-text">
            Coza's main page was a feed of content created for the brand, with articles, galleries, photos and links to the online store.
          </p>
          <p class="internal-description-text">
            The project also had a storefront with a list of all the products listed on the online store, fed by Ajax from the back-end with the content updated constantly from the Brinox store.
          </p>
        </div>

        <div class="internal-extra">
          <div class="internal-extra-scroll">
              <div class="internal-extra-item">
                  <Media
                    src="coza/feed+shop/coza.com.br-31-03-19-1-mobile"
                    :width="834"
                    :height="1728"
                    :canExpand="true"
                    :isVideo="true"
                    label="Coza: mobile full tour"/>
              </div>
              <div class="internal-extra-item">
                  <Media
                    src="coza/feed+shop/coza.com.br-feed-2019-full-page"
                    :width="1920"
                    :height="22418"
                    :canExpand="true"
                    label="Coza: full page screenshoot"/>
              </div>
              <div class="internal-extra-item">
                  <Media
                    src="coza/feed+shop/coza.com.br-en-2020-12-15-18-54"
                    :width="1920"
                    :height="4861"
                    :canExpand="true"
                    label="Coza: english homepage"/>
              </div>
              <div class="internal-extra-item">
                  <Media
                    src="coza/articles+galleries+photo/coza-article--organização-coza-com-as-dicas-da-maysa"
                    :width="1920"
                    :height="2423"
                    :canExpand="true"
                    label="Coza: article - Organização com as dicas da maysa."/>
              </div>
              <div class="internal-extra-item">
                  <Media
                    src="coza/articles+galleries+photo/coza-article--image-gallery-a-cada-instante-da-rotina-mais-coza+pantone"
                    :width="1920"
                    :height="2249"
                    :canExpand="true"
                    label="Coza: image gallery - A cada instante da rotina. Mais coza + pantone."/>
              </div>
              <div class="internal-extra-item">
                  <Media
                    src="coza/articles+galleries+photo/coza-article--seu-banheiro-cheio-de-beleza"
                    :width="1920"
                    :height="2414"
                    :canExpand="true"
                    label="Coza: article - Seu banheiro cheio de beleza."/>
              </div>
          </div>
        </div>
      </section>

      <section>
        <div class="internal-description">
          <h3 class="internal-description-text">
            Also, a "Where to Find" page, listing all the locations where the Brand can be found, using the Google Maps API.
          </h3>
        </div>

        <div class="internal-extra">
          <div class="internal-extra-scroll">
              <div class="internal-extra-item landscape">
                  <Media
                    src="coza/where-to-find/coza-onde-encontrar-tour"
                    :width="1947"
                    :height="976"
                    :canExpand="true"
                    :isVideo="true"
                    label="Coza: where to find page on desktop"/>
              </div>
              <div class="internal-extra-item">
                  <Media
                    src="coza/where-to-find/coza.com.br-onde-encontrar-31-03-19-1-mobile"
                    :width="834"
                    :height="1728"
                    :canExpand="true"
                    :isVideo="true"
                    label="Coza: where to find page on mobile "/>
              </div>
          </div>
        </div>
      </section>

      <Related />
    </div>

    <div id="#modal" class="modal-above" v-if="modal.open">
      <MediaExpanded
        :source="modal.media.source"
        :thumb="modal.media.thumb"
        :alt="modal.media.alt"
        :width="modal.media.width"
        :height="modal.media.height"
        :isVideo="modal.media.isVideo"/>
    </div>
  </article>
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
  mounted() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  },
  components: {
    Media,
    MediaExpanded,
    Related
  },
  name: 'Coza',
}
</script>

<style lang="scss">
@import '../../sass/internals';
@import '../../sass/modal';
</style>