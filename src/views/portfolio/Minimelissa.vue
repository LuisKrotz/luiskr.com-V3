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
         WHERE TO FIND
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
         Candy
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
         Collections
        </p>
        <p class="project-description-text">
         Color me
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
         Dance Machine
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
         Dreamers
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
         Family
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
         Flygrl
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
         Mapping
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
         Mashup
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
         Mirror
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
         Open Vibes
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
         Wanna be Carioca
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