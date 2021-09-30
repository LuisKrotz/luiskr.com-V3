<template>
  <article :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h2 class="internal-title">Vibra</h2>
      <div class="internal-main">
          <Media
            classes="internal-main-item"
            src="vibra/vibra.com.br-a-empresa-mais-inovadora-do-segmento-no-brasil-tour"
            :width="1438"
            :height="784"
            :isVideo="true"
            label="Vibra: A empresa mais inovadora do segmento no brasil / tour"/>
      </div>

      <section>
        <div class="internal-description">
          <h3 class="internal-description-text">
            <a href="https://www.vibra.com.br?utm_source=luiskr.com" target="_blank">Vibra</a> is a website developed at transa in 2016.
          </h3>
          <p class="internal-description-text">
            Vibra's project was the first project I participated in at Transa, guided by Cristiano Becker, with the help of Renan Machado.
          </p>
          <p class="internal-description-text">
            Vibra's project is a portal developed for the Vibra Brand.
          </p>
          <p class="internal-description-text">
            It was developed in node.js, CSS, Javascript and Html, with a pixel perfect layout and many SVG's created programmatically to demonstrate the brand's processes.
          </p>
        </div>
        <div class="internal-extra">
          <div class="internal-extra-scroll">
            <div class="internal-extra-item">
                <Media
                  src="vibra/https-www.vibra.com.br-mobile"
                  :width="832"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="Vibra: A empresa mais inovadora do segmento no brasil /  tour mobile"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="vibra/vibra.com.br-a-empresa-mais-inovadora-do-segmento-no-brasil-production-and-distributuon-business-full-page"
                  :width="1920"
                  :height="2695"
                  :canExpand="true"
                  label="Vibra: A empresa mais inovadora do segmento no brasil  / production and distributuon business full page"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="vibra/vibra.com.br-a-empresa-mais-inovadora-do-segmento-no-brasil-our-brands-full-page"
                  :width="1920"
                  :height="32491"
                  :canExpand="true"
                  label="Vibra: A empresa mais inovadora do segmento no brasil /  our brands full page"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="vibra/vibra.com.br-a-empresa-mais-inovadora-do-segmento-no-brasil-more-than-five-decades-of-experience-and-tradition-in-aviculture-about-us-full-page"
                  :width="1920"
                  :height="7244"
                  :canExpand="true"
                  label="Vibra: A empresa mais inovadora do segmento no brasil - more than five decades of experience and tradition in aviculture / About us full page"/>
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
  components: {
    Media,
    MediaExpanded,
    Related
  },
  name: 'Vibra',
}
</script>

<style lang="scss">
@import '../../sass/internals';
@import '../../sass/modal';
</style>