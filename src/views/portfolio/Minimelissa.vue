<template>
  <div :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h1 class="project-title">Minimelissa</h1>
      <div class="project-main">
          <Media
            classes="project-main-item"
            src="minimelissa/website/minimelissa.com.br-31-03-19"
            :width="1943"
            :height="976"
            :isVideo="true"
            label="mor.com.br - homepage full tour"/>
      </div>

      <section class="project-description">
        <h2 class="project-description-text">
           Minimelissa was a project developed at Transa for the Melissa brand as a channel for the Minimelissa brand.
        </h2>
        <p class="project-description-text">
          The project lasted from 2018 to 2020 and was made entirely with Jquery, CSS (Less) and PHP (Laravel). 
        </p>
        <p class="project-description-text">
          The website consisted of a Content and a Social feed on the homepage with infinite scroll leading to many Minimelissa exclusive content.
        </p>
      </section>
      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/website/minimelissa.com.br-31-03-19-1-mobile"
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
                  src="minimelissa/website/mini-melissa-cover-2020"
                  :width="1920"
                  :height="1001"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/website/mini-melissa-feed-2020"
                  :width="1920"
                  :height="32491"
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
         The where to find page was developed with the Google Maps API, and was a central location to find all places where Mini Melissas where sold and Mini Melissa clubs in Brazil and aroud the world.
        </p>
      </section>


      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 2.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="minimelissa/where-to-find/mini-melissa-onde-encontrar-2020"
                  :width="1932"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/where-to-find/https-www.lojamor.com.br-mobile"
                  :width="833"
                  :height="1728"
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


      <section class="project-description">
        <p class="project-description-text">
         On minimelissa, I was the Leading front end developer, and created a CSS framework for the project, called candy with many ready to use and highly customizable componets to allow the fast development of collection and special pages.
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="minimelissa/collections/candy-framework/mini-melissa-candy-framework"
                  :width="1918"
                  :height="960"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/collections/candy-framework/minimelissa.com.br-candy-31-03-19-1-mobile"
                  :width="834"
                  :height="1728"
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


      <section class="project-description">
        <p class="project-description-text">
         Speaking of collections, check out some of Minimelissa's collections. 
        </p>
        <p class="project-description-text">
         Color me, Spring Summer collection of 2020,  developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="project-extra">

        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="minimelissa/collections/color-me-ss20/minimelissa-ss20"
                  :width="1440"
                  :height="784"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/collections/color-me-ss20/minimelissa-ss20-mobile"
                  :width="828"
                  :height="1712"
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

      <section class="project-description">
        <p class="project-description-text">
         Dance Machine, Autumn Winter collection of 2016,  developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="project-extra">

        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="minimelissa/collections/dance-machine-aw16/minimelissa.com.br-aw16-31-03-19"
                  :width="1928"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/collections/dance-machine-aw16/minimelissa.com.br-aw16-31-03-19-1-mobile"
                  :width="833"
                  :height="1728"
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
  
      <section class="project-description">
        <p class="project-description-text">
         Dreamers, Autumn Winter collection of 2020, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="project-extra">

        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="minimelissa/collections/dreamers-aw20/minimelissa-aw20"
                  :width="1440"
                  :height="784"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/collections/dreamers-aw20/minimelissa-aw20-mobile"
                  :width="828"
                  :height="1712"
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

      <section class="project-description">
        <p class="project-description-text">
         Family, Spring Summer collection of 2019, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="minimelissa/collections/family-ss19/minimelissa.com.br-SS19-31-03-19"
                  :width="1932"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/collections/family-ss19/minimelissa.com.br-SS19-31-03-19-1-mobile"
                  :width="834"
                  :height="1728"
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


      <section class="project-description">
        <p class="project-description-text">
         Flygrl, Autumn Winter collection of 2017, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="minimelissa/collections/flygrl-aw17/minimelissa.com.br-aw17-31-03-19"
                  :width="1932"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/collections/flygrl-aw17/minimelissa.com.br-aw17-31-03-19-1-mobile"
                  :width="832"
                  :height="1728"
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


      <section class="project-description">
        <p class="project-description-text">
         Mapping, Spring Summer collection of 2018, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="minimelissa/collections/mapping-ss18/minimelissa.com.br-ss18-31-03-19"
                  :width="1932"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/collections/mapping-ss18/minimelissa.com.br-ss18-31-03-19-1-mobile"
                  :width="832"
                  :height="1728"
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

      <section class="project-description">
        <p class="project-description-text">
         Mashup, Spring Summer collection of 2017, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="minimelissa/collections/mashup-ss17/minimelissa.com.br-ss17-31-03-19"
                  :width="1928"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/collections/mashup-ss17/minimelissa.com.br-ss17-31-03-19-1-mobile"
                  :width="833"
                  :height="1728"
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

      <section class="project-description">
        <p class="project-description-text">
         Mirror, Autumn Winter collection of 2019, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="minimelissa/collections/mirror-aw19/minimelissa.com.br-aw19-31-03-19"
                  :width="1936"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/collections/mirror-aw19/minimelissa.com.br-aw19-31-03-19-1-mobile"
                  :width="831"
                  :height="1728"
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

      <section class="project-description">
        <p class="project-description-text">
          Open Vibes, Autumn Winter collection of 2018, developed in CSS and HTML only, was the first collection page to be displayed on the Minimelissa website.
        </p>
        <p class="project-description-text">
          Open Vibes, was the page that kickstarted the idea of Minimelissa's candy framework in response to the need to develop collectiob pages in a short space of time, keeping hight quality pixel perfect layouts, and fast pages.
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="minimelissa/collections/open-vibes-aw18/aw18"
                  :width="1924"
                  :height="928"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/collections/open-vibes-aw18/minimelissa.com.br-aw18-31-03-19-1-mobile"
                  :width="828"
                  :height="1712"
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


      <section class="project-description">
        <p class="project-description-text">
         Wanna be Carioca, Spring Summer collection of 2016, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="minimelissa/collections/wanna-be-carioca-ss16/minimelissa.com.br-ss16-31-03-19"
                  :width="1928"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="minimelissa/collections/wanna-be-carioca-ss16/minimelissa.com.br-ss16-31-03-19-1-mobile"
                  :width="831"
                  :height="1728"
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
  name: 'Minimelissa',
}
</script>

<style lang="scss">
@import '../../sass/projects';
@import '../../sass/modal';
</style>