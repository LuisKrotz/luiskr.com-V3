<template>
  <div :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h1 class="project-title">Brazilian Leather</h1>
      <div class="project-main">
        <Media
          classes="project-main-item"
          src="brazilian leather/portal/brazilian-leather-cicb-cscb-leather-law-portal-full-tour"
          :width="1462"
          :height="784"
          :isVideo="true"
          label="Brazilian Leather - homepage full tour"/>
      </div>

      <section class="project-description">
        <h2 class="project-description-text">Brazilian Leather is a project developed at Transa, through a partnership between CICB and Apex-Brasil. The project is a portal of Leather from Brazil. Including websites like Brazilian Leather, CICB, CSCB and Leather Law.</h2>
        <p class="project-description-text">
          I contributed as a member of the development team of the main portal.
        </p>
        <p class="project-description-text">
          Contributed with coding an maintence in vanilla JS and Jquery.
        </p>
        <p class="project-description-text">
          Styling using LESS and Stylus.
        </p>
        <p class="project-description-text">
          And usability fixes after the development, with constant improvements and maintence to this date.
        </p>
      </section>

      <section class="project-extra">
        <div class="project-extra-scroll">
            <div class="project-extra-item">
                <Media
                  src="brazilian leather/portal/cicb.org.br-31-03-19-1-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="Brazilian Leather - mobile tour"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="brazilian leather/portal/brazilian-leather-cicb-cscb-leather-law-portal-about-full-page-en-2020-12-15-23_21_33"
                  :width="1920"
                  :height="12721"
                  :canExpand="true"
                  label="Brazilian Leather - home"/>
            </div>
            <div class="project-extra-item">
              <Media
                src="brazilian leather/portal/brazilian-leather-cicb-cscb-leather-law-portal-about-full-page"
                :width="1920"
                :height="10257"
                :canExpand="true"
                label="Brazilian Leather - about"/>
            </div>
            <div class="project-extra-item">
              <Media
                src="brazilian leather/portal/brazilian-leather-cicb-cscb-leather-law-portal-brazilian-leather-mandarin-chinese-full-page"
                :width="1920"
                :height="7451"
                :canExpand="true"
                label="Brazilian Leather - in Mandarin Chinese"/>
            </div>
            <div class="project-extra-item">
              <Media
                src="brazilian leather/portal/brazilian-leather-cicb-cscb-leather-law-portal-cicb-website-full-page"
                :width="1920"
                :height="11726"
                :canExpand="true"
                label="CSCB - Home page"/>
            </div>
        </div>
      </section>

      <section class="project-description">
        <h2 class="project-description-text">Since 2016 I'm  contributing anually in the development of CSCB fóruns. </h2>
        <p class="project-description-text">
          Every Fórum is a new experience, and development exclusively.
        </p>
        <p class="project-description-text">
          Check CSCB 2016 - "Econômia Circular" below.
        </p>
        <p class="project-description-text">
          It was developed using PHP, Jquery and pure CSS, I contributed as a member of the team as a JR. Front-end developer, guided by Cristiano Becker on the development of this page in my firt year at Transa.
        </p>
      </section>

      <section class="project-extra">
        <div class="project-extra-scroll">
            <div class="project-extra-item landscape">
                <Media
                  src="brazilian leather/forum-cicb/2016/fórum-cscb-fórum-2016-economia-circular-tour"
                  :width="1455"
                  :height="768"
                  :canExpand="true"
                  :isVideo="true"
                  label="Fórum 2016 - Full tour"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="brazilian leather/forum-cicb/2016/fórum-cscb-fórum-2016-economia-circular-full-page"
                  :width="1920"
                  :height="6219"
                  :canExpand="true"
                  label="Fórum 2016 - Full page"/>
            </div>
            <div class="project-extra-item">
              <Media
                src="brazilian leather/forum-cicb/2016/forum-2016-1-mobile"
                :width="831"
                :height="1712"
                :canExpand="true"
                :isVideo="true"
                label="Fórum 2016 - Mobile tour"/>
            </div>
        </div>
      </section>

      <section class="project-description">
        <h2 class="project-description-text">
          2017 brought a new edition, "Econômia Circular".
        </h2>
        <p class="project-description-text">
          It was developed using PHP, Jquery and Less for CSS, I contributed as a Front end Developer, and work  closely with Renan Machado for the Back-end of the application.
        </p>
      </section>

      <section class="project-extra">
        <div class="project-extra-scroll">
            <div class="project-extra-item landscape">
                <Media
                  src="brazilian leather/forum-cicb/2017/fórum-cscb-fórum-2017-negócios-disruptivos-para-um-mundo-disruptivo-tour"
                  :width="1458"
                  :height="768"
                  :canExpand="true"
                  :isVideo="true"
                  label="Fórum 2017 - Full tour"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="brazilian leather/forum-cicb/2017/fórum-cscb-fórum-2017-negócios-disruptivos-para-um-mundo-disruptivo-full-page"
                  :width="1920"
                  :height="9774"
                  :canExpand="true"
                  label="Fórum 2017 - Full page"/>
            </div>
            <div class="project-extra-item">
              <Media
                src="brazilian leather/forum-cicb/2017/forum-2017-1-mobile"
                :width="834"
                :height="1728"
                :canExpand="true"
                :isVideo="true"
                label="Fórum 2017 - Mobile tour"/>
            </div>
        </div>
      </section>

      <section class="project-description">
        <h2 class="project-description-text">
          2018' edition was called, "Qual o retorno do investimento sustentável?".
        </h2>
        <p class="project-description-text">
          It was also developed using PHP, Jquery and Less for the CSS, I contributed as a Front end Developer, and worked closely with Renan Machado for the Back-end/Subscription submitting of the application.
        </p>
      </section>

      <section class="project-extra">
        <div class="project-extra-scroll">
            <div class="project-extra-item landscape">
                <Media
                  src="brazilian leather/forum-cicb/2018/fórum-cscb-fórum-2018-qual-o-retorno-do-investimento-sustentável-tour"
                  :width="1458"
                  :height="768"
                  :canExpand="true"
                  :isVideo="true"
                  label="Fórum 2018 - Full tour"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="brazilian leather/forum-cicb/2018/fórum-cscb-fórum-2018-qual-o-retorno-do-investimento-sustentável-full-page"
                  :width="1920"
                  :height="5600"
                  :canExpand="true"
                  label="Fórum 2018 - Full page"/>
            </div>
            <div class="project-extra-item">
              <Media
                src="brazilian leather/forum-cicb/2018/forum-2018-1-mobile"
                :width="828"
                :height="1712"
                :canExpand="true"
                :isVideo="true"
                label="Fórum 2018 - Mobile tour"/>
            </div>
        </div>
      </section>

      <section class="project-description">
        <h2 class="project-description-text">
          2019' edition was called, "O couro no mundo hiperconectado".
        </h2>
        <p class="project-description-text">
          Developed using PHP, Jquery and CSS, I contributed as a Front end Developer, and worked closely with Renan Machado for the Back-end/Subscription submitting of the application.
        </p>
      </section>

      <section class="project-extra">
        <div class="project-extra-scroll">
            <div class="project-extra-item landscape">
                <Media
                  src="brazilian leather/forum-cicb/2019/fórum-cscb-fórum-2019-o-couro-no-mundo-hiperconectado-tour"
                  :width="1441"
                  :height="784"
                  :canExpand="true"
                  :isVideo="true"
                  label="Fórum 2019 - Full tour"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="brazilian leather/forum-cicb/2019/fórum-cscb-fórum-2019-o-couro-no-mundo-hiperconectado-full-page"
                  :width="1920"
                  :height="5063"
                  :canExpand="true"
                  label="Fórum 2019 - Full page"/>
            </div>
            <div class="project-extra-item">
              <Media
                src="brazilian leather/forum-cicb/2019/forumcicb2019-mobile"
                :width="834"
                :height="1728"
                :canExpand="true"
                :isVideo="true"
                label="Fórum 2019 - Mobile tour"/>
            </div>
        </div>
      </section>

      <section class="project-description">
        <h2 class="project-description-text">
          2020' was a challenge with two editions created from scratch, an online forum called "A sociedade somos todos nós" and a webinar called "Leather business and the future consumer", in english and portuguese.
        </h2>
        <p class="project-description-text">
          Both pages where developed using PHP, Sass for the CSS and Vanilla JS with code created from scratch exclusively for this new pages,
          I contributed as a Front end Developer, and worked with Renan Machado for the Back-end of the application.
        </p>
      </section>

      <section class="project-extra">
        <div class="project-extra-scroll">
            <div class="project-extra-item landscape">
                <Media
                  src="brazilian leather/forum-cicb/2020/cicb.org.br-forum2020"
                  :width="1464"
                  :height="784"
                  :canExpand="true"
                  :isVideo="true"
                  label="Fórum 2020 - Full tour"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="brazilian leather/forum-cicb/2020/fórum-cscb-fórum-2020-a-sociedade-somos-todos-nós-full-page"
                  :width="1920"
                  :height="6309"
                  :canExpand="true"
                  label="Fórum 2020 - Full page"/>
            </div>
            <div class="project-extra-item">
              <Media
                src="brazilian leather/forum-cicb/2020/forum-cscb-2020-mobile-mobile"
                :width="831"
                :height="1712"
                :canExpand="true"
                :isVideo="true"
                label="Fórum 2020 - Mobile tour"/>
            </div>
            <div class="project-extra-item landscape">
                <Media
                  src="brazilian leather/webinar-series/2020/brazilian-leather-webinar-series-2020-leather-business-and-future-consumer-the-world-is-changing-we-are-changing-join-us-in-shaping-the-future-to-come-tour"
                  :width="1920"
                  :height="928"
                  :canExpand="true"
                  :isVideo="true"
                  label="Webinar 2020 - Full tour"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="brazilian leather/webinar-series/2020/brazilian-leather-webinar-series-2020-leather-business-and-future-consumer-the-world-is-changing-we-are-changing-join-us-in-shaping-the-future-to-come-full-page"
                  :width="1920"
                  :height="19246"
                  :canExpand="true"
                  label="Fórum 2020 - Full page"/>
            </div>
            <div class="project-extra-item">
              <Media
                src="brazilian leather/webinar-series/2020/brazilian-leather-webinar-series-2020-leather-business-and-future-consumer-the-world-is-changing-we-are-changing-join-us-in-shaping-the-future-to-come-mobile-mobile"
                :width="828"
                :height="1712"
                :canExpand="true"
                :isVideo="true"
                label="Fórum 2020 - Mobile tour"/>
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
  name: 'Brazilian Leather',
}
</script>

<style lang="scss">
@import '../../sass/projects';
@import '../../sass/modal';
</style>