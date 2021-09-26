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
            label="METCHA -  feed 2020/2021 tour"/>
      </div>

      <section class="project-description">
        <h2 class="project-description-text">
          METCHA is the oracle of leather design culture.
        </h2>
        <p class="project-description-text">
         Seeking to tell the most compelling stories within the worlds of design, art, fashion and lifestyle, shining a spotlight on the subjects and the individuals that make up the everyday lives of the people who shape the world of today.
        </p>
        <p class="project-description-text">
          Through a bold, fresh and honest storytelling, METCHA hopes to encourage innovative thinking, inspiring people to continue to evolve the ever-expanding culture of creativity.
        </p>
        <p class="project-description-text">
          METCHA's mission is to bring forward the best projects and curate the most stimulating stories, inspiring a generation of tastemakers, trendsetters & style-conscious individuals to also understand and see leather as an exciting creative partner.
        </p>
         <p class="project-description-text">
          The project started in 2019 and I'm currently the Leading front end developer of the project.</p>
         <p class="project-description-text">
          To realize METCHA's project, VUE.js,  Sass and PHP (Laravel) where used on the development, specially VUE, to enable all the styling and the website identity while keeping a fast, dynamic and smooth experience.
        </p>
      </section>
      <section class="project-extra">
        <div class="project-extra-scroll">
            <div class="project-extra-item">
                <Media
                  src="metcha/feed/metcha.com-2021-mobile-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label="METCHA - feed 2021 mobile tour"/>
            </div>
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/feed/metcha.com-2019-website-tour"
                  :width="1463"
                  :height="800"
                  :isVideo="true"
                  :canExpand="true"
                  label="METCHA - feed 2019 tour"/>
            </div>
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/feed/metcha.com-mobile"
                  :width="832"
                  :height="1728"
                  :isVideo="true"
                  :canExpand="true"
                  label="METCHA - feed 2019 mobile tour"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/feed/metcha.com-2020-2021-website-feed-full-page"
                  :width="1920"
                  :height="28800"
                  :canExpand="true"
                  label="METCHA - feed 2020/2021 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/acessibility/metcha-acessibility-jun-2021-mobile-mobile"
                  :width="831"
                  :height="1712"
                  :isVideo="true"
                  :canExpand="true"
                  label="METCHA - Acessibility features"/>
            </div>
        </div>
      </section>

      <section class="project-description">
        <p class="project-description-text">
         Speaking of a dynamic experiences, check out some of the incredible layouts created by a very talented team working on metcha.com
        </p>
        <p class="project-description-text">
          Those articles where a real challenge to code, METCHA's uses CSS and typografy heavily to enable unique experinces and feels for every article.
        </p>
      </section>


      <section class="project-extra">
        <div class="project-extra-scroll">
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/articles/metcha.com--article-cruella-s-villainism-fashionism-is-premiering-next-week-2021-06-03-full-article-tour"
                  :width="1929"
                  :height="1008"
                  :canExpand="true"
                  :isVideo="true"
                  label="METCHA - Article: Cruella's villainism fashionism is premiering next week tour"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha-willow-smith-mobile-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label="METCHA - Article: Willow Smith mobile tour"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-5-looks-to-steal-from-elsa-hosk-2021-04-25"
                  :width="1920"
                  :height="11507"
                  :canExpand="true"
                  label="METCHA - Article: 5-looks-to-steal-from-elsa-hosk screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-a-very-special-project-the-lv-x-maison-tamboite-new-bike-2020-12-15"
                  :width="1920"
                  :height="10159"
                  :canExpand="true"
                  label="METCHA - Article: a-very-special-project-the-lv-x-maison-tamboite-new-bike screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-air-dior-1-and-the-sneaker-market-worth-us-79-billion-2021-06-03-13"
                  :width="1920"
                  :height="8084"
                  :canExpand="true"
                  label="METCHA - Article: air-dior-1-and-the-sneaker-market-worth-us-79-billion-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-apartment-13-by-studio-modektura-2021-06-03-13"
                  :width="1920"
                  :height="9128"
                  :canExpand="true"
                  label="METCHA - Article: apartment-13-by-studio-modektura-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-ashya-is-revolutionizing-the-travel-goods-market-2021-04-25"
                  :width="1920"
                  :height="20971"
                  :canExpand="true"
                  label="METCHA - Article: ashya-is-revolutionizing-the-travel-goods-market screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-behind-the-creation-of-the-aj-xi-prototype-2020-12-15"
                  :width="1920"
                  :height="19679"
                  :canExpand="true"
                  label="METCHA - Article: behind-the-creation-of-the-aj-xi-prototype screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-bill-amberg-studio-moore-giles-collection-2021-06-03-13"
                  :width="1920"
                  :height="17382"
                  :canExpand="true"
                  label="METCHA - Article: bill-amberg-studio-moore-giles-collection-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-cruella-s-villainism-fashionism-is-premiering-next-week-2021-06-03-13"
                  :width="1920"
                  :height="14137"
                  :canExpand="true"
                  label="METCHA - Article: cruella-s-villainism-fashionism-is-premiering-next-week-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-daniel-arsham-s-art-storage-space-2021-06-03-13"
                  :width="1920"
                  :height="11282"
                  :canExpand="true"
                  label="METCHA - Article: daniel-arsham-s-art-storage-space-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-deston-isas-pics-of-la-s-automotive-scene-2021-06-03-13"
                  :width="1920"
                  :height="10630"
                  :canExpand="true"
                  label="METCHA - Article: deston-isas-pics-of-la-s-automotive-scene-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-dion-lee-ss21-the-need-for-new-sustainable-choices-2020-12-15"
                  :width="1920"
                  :height="8361"
                  :canExpand="true"
                  label="METCHA - Article: dion-lee-ss21-the-need-for-new-sustainable-choices screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-hunt-house-in-malibu-2021-06-03-13"
                  :width="1920"
                  :height="10310"
                  :canExpand="true"
                  label="METCHA - Article: hunt-house-in-malibu-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-kylie-jenner-for-tmrw-2021-06-03-13"
                  :width="1920"
                  :height="11419"
                  :canExpand="true"
                  label="METCHA - Article: kylie-jenner-for-tmrw-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-maido-by-child-studio-2021-06-03-13"
                  :width="1920"
                  :height="9787"
                  :canExpand="true"
                  label="METCHA - Article: maido-by-child-studio-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-max-poglia-s-bags-are-never-alike-2021-06-03-13"
                  :width="1920"
                  :height="18828"
                  :canExpand="true"
                  label="METCHA - Article: max-poglia-s-bags-are-never-alike-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-mercedes-benz-eqs-interior-show-a-green-tech-statement-2021-04-25"
                  :width="1920"
                  :height="9413"
                  :canExpand="true"
                  label="METCHA - Article: mercedes-benz-eqs-interior-show-a-green-tech-statement screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-new-bugatti-s-les-legendes-du-ciel-2021-06-03-13"
                  :width="1920"
                  :height="13685"
                  :canExpand="true"
                  label="METCHA - Article: new-bugatti-s-les-legendes-du-ciel-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-niamh-algar-comments-on-working-with-her-idol-2020-12-15"
                  :width="1920"
                  :height="7546"
                  :canExpand="true"
                  label="METCHA - Article: niamh-algar-comments-on-working-with-her-idol screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-niels-van-roij-x-heritage-customs-2021-06-03-13"
                  :width="1920"
                  :height="11445"
                  :canExpand="true"
                  label="METCHA - Article: niels-van-roij-x-heritage-customs-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-off-white-x-nike-air-force-1-low-2021-06-03-13"
                  :width="1920"
                  :height="8447"
                  :canExpand="true"
                  label="METCHA - Article: off-white-x-nike-air-force-1-low-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-rtfkt-studios-brings-the-future-of-kicks-2020-12-15"
                  :width="1920"
                  :height="6665"
                  :canExpand="true"
                  label="METCHA - Article: rtfkt-studios-brings-the-future-of-kicks screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-shahd-batal-s-sneaker-collection-2021-06-03-14"
                  :width="1920"
                  :height="9247"
                  :canExpand="true"
                  label="METCHA - Article: shahd-batal-s-sneaker-collection-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-stephen-kenn-x-3sixteen-s-set-of-veg-tan-leather-couches-2021-06-03-13"
                  :width="1920"
                  :height="11679"
                  :canExpand="true"
                  label="METCHA - Article: stephen-kenn-x-3sixteen-s-set-of-veg-tan-leather-couches-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-the-7-best-new-balance-drops-from-may-2021-06-03-14"
                  :width="1920"
                  :height="22243"
                  :canExpand="true"
                  label="METCHA - Article: the-7-best-new-balance-drops-from-may-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-the-biggest-fits-of-the-week-2021-06-03-13"
                  :width="1920"
                  :height="16315"
                  :canExpand="true"
                  label="METCHA - Article: the-biggest-fits-of-the-week-20 screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-the-classic-ajs-arrived-in-april-2021-04-25"
                  :width="1920"
                  :height="9623"
                  :canExpand="true"
                  label="METCHA - Article: the-classic-ajs-arrived-in-april screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-the-design-museum-london-the-past-and-future-of-sneakers-2021-04-25"
                  :width="1920"
                  :height="10267"
                  :canExpand="true"
                  label="METCHA - Article: the-design-museum-london-the-past-and-future-of-sneakers screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-the-new-mayze-is-coming-as-dua-lipa-makes-her-debut-at-puma-2021-04-25"
                  :width="1920"
                  :height="11058"
                  :canExpand="true"
                  label="METCHA - Article: the-new-mayze-is-coming-as-dua-lipa-makes-her-debut-at-puma screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-troye-sivan-s-victorian-era-melbourne-house-2021-04-25"
                  :width="1920"
                  :height="10844"
                  :canExpand="true"
                  label="METCHA - Article: troye-sivan-s-victorian-era-melbourne-house screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-we-need-to-talk-about-this-ferrari-250-gt-berlinetta-competizione-2020-12-15"
                  :width="1920"
                  :height="9619"
                  :canExpand="true"
                  label="METCHA - Article: we-need-to-talk-about-this-ferrari-250-gt-berlinetta-competizione screenshoot"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/articles/metcha.com--article-you-gotta-see-croft-house-s-approach-to-leather-furn-2021-04-25"
                  :width="1920"
                  :height="21718"
                  :canExpand="true"
                  label="METCHA - Article: you-gotta-see-croft-house-s-approach-to-leather-furn screenshoot"/>
            </div>
          </div>
      </section>


      <section class="project-description">
        <p class="project-description-text">
         All those articles, and many more, powered by a powerfull CMS, developed by Renan Machado, and with the front end customized by myselft to the team at Transa.
        </p>
      </section>

      <section class="project-extra">
        <div class="project-extra-scroll">
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/cms/metcha.com-cms"
                  :width="1443"
                  :height="784"
                  :canExpand="true"
                  :isVideo="true"
                  label="METCHA CMS: tour"/>
            </div>
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/cms/metcha.com-cms-metcha-midia-editor"
                  :width="1920"
                  :height="1247"
                  :canExpand="true"
                  label="METCHA CMS: media editor"/>
            </div>
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/cms/metcha.com-cms-metcha-posts-6-editar-feed"
                  :width="1920"
                  :height="4632"
                  :canExpand="true"
                  label="METCHA CMS: post editing tool"/>
            </div>
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/cms/metcha.com-cms-metcha-posts-editar"
                  :width="1920"
                  :height="1144"
                  :canExpand="true"
                  label="METCHA CMS: post editing"/>
            </div>
        </div>
      </section>

      <section class="project-description">
        <p class="project-description-text">
         Another callenge was METCHA's newsletter, created dynamically on the metcha CMS, and sent weekly with a unique identity.
        </p>
      </section>

      <section class="project-extra">
        <div class="project-extra-scroll">
            <div class="project-extra-item">
                <Media
                  src="metcha/newsletter/metcha-newsletter"
                  :width="831"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="METCHA: newsletter"/>
            </div>
            <div class="project-extra-item landscape">
                <Media
                  src="metcha/newsletter/metcha.com-cms-metcha-newsletter-generator"
                  :width="1455"
                  :height="768"
                  :canExpand="true"
                  :isVideo="true"
                  label="METCHA CMS: newsletter generator"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/newsletter/newsletter-generator-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label="METCHA CMS: newsletter generator mobile"/>
            </div>
            <div class="project-extra-item">
                <Media
                  src="metcha/newsletter/metcha-newsletter-full-page"
                  :width="1920"
                  :height="7066"
                  :canExpand="true"
                  label="METCHA: newsletter"/>
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
  name: 'METCHA',
}
</script>

<style lang="scss">
@import '../../sass/projects';
@import '../../sass/modal';
</style>