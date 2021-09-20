<template>
  <div :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h1 class="project-title">METCHA</h1>
      <div class="project-main">
          <Media
            classes="project-main-item"
            src="metcha/feed/metcha.com-2020-2021-website-tour"
            :width="1924"
            :height="928"
            :isVideo="true"
            label=""/>
      </div>

      <section class="project-description">
        <h2 class="project-description-text">
           // TODO
        </h2>
        <p class="project-description-text">
          // TODO
        </p>
      </section>
      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item">
                <Media
                  src="metcha/feed/metcha.com-2021-mobile-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="metcha/feed/metcha.com-2019-website-tour"
                  :width="1463"
                  :height="800"
                  :isVideo="true"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/feed/metcha.com-mobile"
                  :width="832"
                  :height="1728"
                  :isVideo="true"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item">
                <Media
                  src="metcha/feed/metcha.com-2020-2021-website-feed-full-page"
                  :width="1920"
                  :height="28800"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
                <Media
                  src="metcha/acessibility/metcha.com-2020-2021-website-feed-full-page"
                  :width="1920"
                  :height="28800"
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
         ARTICLES
        </p>
      </section>


      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 12.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/articles/metcha.com--article-cruella-s-villainism-fashionism-is-premiering-next-week-2021-06-03-full-article-tour"
                  :width="1929"
                  :height="1008"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha-willow-smith-mobile-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-5-looks-to-steal-from-elsa-hosk-2021-04-25"
                  :width="1920"
                  :height="11507"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-a-very-special-project-the-lv-x-maison-tamboite-new-bike-2020-12-15"
                  :width="1920"
                  :height="10159"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="5">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-air-dior-1-and-the-sneaker-market-worth-us-79-billion-2021-06-03-13"
                  :width="1920"
                  :height="8084"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="6">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-apartment-13-by-studio-modektura-2021-06-03-13"
                  :width="1920"
                  :height="9128"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="7">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-ashya-is-revolutionizing-the-travel-goods-market-2021-04-25"
                  :width="1920"
                  :height="20971"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="8">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-behind-the-creation-of-the-aj-xi-prototype-2020-12-15"
                  :width="1920"
                  :height="19679"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="9">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-bill-amberg-studio-moore-giles-collection-2021-06-03-13"
                  :width="1920"
                  :height="17382"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="10">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-cruella-s-villainism-fashionism-is-premiering-next-week-2021-06-03-13"
                  :width="1920"
                  :height="14137"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="11">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-daniel-arsham-s-art-storage-space-2021-06-03-13"
                  :width="1920"
                  :height="11282"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="12">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-deston-isas-pics-of-la-s-automotive-scene-2021-06-03-13"
                  :width="1920"
                  :height="10630"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="13">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-dion-lee-ss21-the-need-for-new-sustainable-choices-2020-12-15"
                  :width="1920"
                  :height="8361"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="14">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-hunt-house-in-malibu-2021-06-03-13"
                  :width="1920"
                  :height="10310"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="15">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-kylie-jenner-for-tmrw-2021-06-03-13"
                  :width="1920"
                  :height="11419"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="16">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-maido-by-child-studio-2021-06-03-13"
                  :width="1920"
                  :height="9787"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="17">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-max-poglia-s-bags-are-never-alike-2021-06-03-13"
                  :width="1920"
                  :height="18828"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="18">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-mercedes-benz-eqs-interior-show-a-green-tech-statement-2021-04-25"
                  :width="1920"
                  :height="9413"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="19">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-new-bugatti-s-les-legendes-du-ciel-2021-06-03-13"
                  :width="1920"
                  :height="13685"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="19">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-niamh-algar-comments-on-working-with-her-idol-2020-12-15"
                  :width="1920"
                  :height="7546"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="20">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-niels-van-roij-x-heritage-customs-2021-06-03-13"
                  :width="1920"
                  :height="11445"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="21">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-off-white-x-nike-air-force-1-low-2021-06-03-13"
                  :width="1920"
                  :height="8447"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="22">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-rtfkt-studios-brings-the-future-of-kicks-2020-12-15"
                  :width="1920"
                  :height="6665"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="23">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-shahd-batal-s-sneaker-collection-2021-06-03-14"
                  :width="1920"
                  :height="9247"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="24">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-stephen-kenn-x-3sixteen-s-set-of-veg-tan-leather-couches-2021-06-03-13"
                  :width="1920"
                  :height="11679"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="25">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-the-7-best-new-balance-drops-from-may-2021-06-03-14"
                  :width="1920"
                  :height="22243"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="26">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-the-biggest-fits-of-the-week-2021-06-03-13"
                  :width="1920"
                  :height="16315"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="27">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-the-classic-ajs-arrived-in-april-2021-04-25"
                  :width="1920"
                  :height="9623"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="28">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-the-design-museum-london-the-past-and-future-of-sneakers-2021-04-25"
                  :width="1920"
                  :height="10267"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="29">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-the-new-mayze-is-coming-as-dua-lipa-makes-her-debut-at-puma-2021-04-25"
                  :width="1920"
                  :height="11058"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="30">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-troye-sivan-s-victorian-era-melbourne-house-2021-04-25"
                  :width="1920"
                  :height="10844"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="31">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-we-need-to-talk-about-this-ferrari-250-gt-berlinetta-competizione-2020-12-15"
                  :width="1920"
                  :height="9619"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="32">
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-you-gotta-see-croft-house-s-approach-to-leather-furn-2021-04-25"
                  :width="1920"
                  :height="21718"
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
         CMS
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/cms/metcha.com-cms"
                  :width="1443"
                  :height="784"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/cms/metcha.com-cms-metcha-midia-editor"
                  :width="1920"
                  :height="1247"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/cms/metcha.com-cms-metcha-posts-6-editar-feed"
                  :width="1920"
                  :height="4632"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/cms/metcha.com-cms-metcha-posts-editar.jpg"
                  :width="1920"
                  :height="1144"
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
         CMS Newsletter generator
        </p>
      </section>

      <section class="project-extra">

        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item">
                <Media
                  src="metcha/cms/metcha-newsletter"
                  :width="831"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/cms/metcha.com-cms-metcha-newsletter-generator"
                  :width="1455"
                  :height="768"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item">
                <Media
                  src="metcha/cms/newsletter-generator-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
                <Media
                  src="metcha/cms/metcha-newsletter-full-page"
                  :width="1920"
                  :height="7066"
                  :canExpand="true"
                  :isVideo="true"
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
  name: 'METCHA',
}
</script>

<style lang="scss">
@import '../../sass/projects';
@import '../../sass/modal';
</style>