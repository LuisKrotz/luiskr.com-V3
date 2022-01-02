<template>
  <article>
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h2 class="internal-title">Marco Almeida</h2>
      <div class="internal-main">
        <Media
          classes="internal-main-item"
          src="aboutmarco/home/aboutmarco.com-2020-full-page-home-tour"
          :width="1462"
          :height="784"
          :isVideo="true"
          label="aboutmarco.com - homepage full tour"/>
      </div>

      <section>
        <div class="internal-description">
          <h3 class="internal-description-text">
            <a href="https://aboutmarco.com?utm_source=luiskr.com" target="_blank">Marco's Portfolio</a> was developed as a Freelancing project in 2021.
          </h3>
          <p class="internal-description-text">
            It uses Vue.JS and Sass.
          </p>
          <p class="internal-description-text">
            All animations are created in CSS.
          </p>
          <p class="internal-description-text">
            The main goal was to create a pixel-perfect project, with smooth animations and a pixel perfect UI.
          </p>
          <p class="internal-description-text">
            I also did the server setup at Digital Ocean.
          </p>
        </div>

        <div class="internal-extra">
          <div class="internal-extra-scroll">
              <div class="internal-extra-item">
                  <Media
                    src="aboutmarco/home/aboutmarco.com-mobile-mobile"
                    :width="830"
                    :height="1712"
                    :canExpand="true"
                    :isVideo="true"
                    label="aboutmarco.com - mobile tour"/>
              </div>
              <div class="internal-extra-item">
                  <Media
                    src="aboutmarco/home/aboutmarco.com-2020-home"
                    :width="1920"
                    :height="3003"
                    :canExpand="true"
                    label="aboutmarco.com - homepage"/>
              </div>
              <div class="internal-extra-item">
                  <Media
                    src="aboutmarco/pages/aboutmarco.com-pages--melissa-insider-2020-12-15"
                    :width="1920"
                    :height="10094"
                    :canExpand="true"
                    label="aboutmarco.com - melissa insider"/>
              </div>
              <div class="internal-extra-item">
                <Media
                  src="aboutmarco/pages/aboutmarco.com-pages--melissa-2020-12-15"
                  :width="1920"
                  :height="10229"
                  :canExpand="true"
                  label="aboutmarco.com - melissa"/>
              </div>
              <div class="internal-extra-item">
                <Media
                  src="aboutmarco/pages/aboutmarco.com-pages--coza-2020-12-15"
                  :width="1920"
                  :height="26871"
                  :canExpand="true"
                  label="aboutmarco.com - coza"/>
              </div>
              <div class="internal-extra-item">
                <Media
                  src="aboutmarco/pages/aboutmarco.com-pages--brazilian-leather-2020-12-15"
                  :width="1920"
                  :height="16075"
                  :canExpand="true"
                  label="aboutmarco.com - brazilian leather"/>
              </div>
              <div class="internal-extra-item">
                <Media
                  src="aboutmarco/about/aboutmarco.com-me-2020-12-15-23_29_35"
                  :width="1920"
                  :height="7137"
                  :canExpand="true"
                  label="aboutmarco.com - me"/>
              </div>
              <div class="internal-extra-item">
                <Media
                  src="aboutmarco/about/aboutmarco.com-archive-2020-12-15-23_31_53"
                  :width="1920"
                  :height="3788"
                  :canExpand="true"
                  label="aboutmarco.com - archive"/>
              </div>
          </div>
        </div>
      </section>

      <section>
        <div class="internal-description">
          <h3 class="internal-description-text">
            Check below for some of the awards received by <a href="https://aboutmarco.com?utm_source=luiskr.com" target="_blank">Marco's portfolio</a>.
          </h3>
        </div>

        <div class="internal-extra">
          <div class="internal-extra-scroll">
              <div class="internal-extra-item landscape">
                  <Media
                    src="aboutmarco/awards/aboutmarco.com-awards--admiretheweb"
                    :width="1440"
                    :height="820"
                    label="aboutmarco.com - admiretheweb"/>
              </div>
              <div class="internal-extra-item landscape">
                  <Media
                    src="aboutmarco/awards/aboutmarco.com-awards--cssawards"
                    :width="1440"
                    :height="740"
                    label="aboutmarco.com - css awards"/>
              </div>
              <div class="internal-extra-item landscape">
                  <Media
                    src="aboutmarco/awards/aboutmarco.com-awards--csswinner"
                    :width="1440"
                    :height="652"
                    label="aboutmarco.com - css awards winner"/>
              </div>
              <div class="internal-extra-item landscape">
                  <Media
                    src="aboutmarco/awards/aboutmarco.com-awards--hm"
                    :width="920"
                    :height="654"
                    label="aboutmarco.com - Honorable Mention"/>
              </div>
              <div class="internal-extra-item landscape">
                  <Media
                    src="aboutmarco/awards/aboutmarco.com-awards--me"
                    :width="1440"
                    :height="652"
                    label="aboutmarco.com - ME"/>
              </div>
              <div class="internal-extra-item landscape">
                  <Media
                    src="aboutmarco/awards/aboutmarco.com-awards--mindspark"
                    :width="677"
                    :height="722"
                    label="aboutmarco.com - mindspark"/>
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
  name: 'Marco Almeida',
}
</script>

<style lang="scss">
@import '../../sass/internals';
@import '../../sass/modal';
</style>