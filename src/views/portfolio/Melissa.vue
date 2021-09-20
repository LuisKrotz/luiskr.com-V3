<template>
  <div :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h1 class="project-title">Melissa</h1>
      <div class="project-main">
          <Media
            classes="project-main-item"
            src="melissa/website/tour/melissa-website-2020-tour"
            :width="1924"
            :height="960"
            :isVideo="true"
            label=""/>
      </div>

      <section class="project-description">
        <h2 class="project-description-text">
           // TODO present melissa website
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
                  src="melissa/website/tour/www.melissa.com.br-31-03-19-feed-1-mobile"
                  :width="1920"
                  :height="28800"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="melissa/website/tour/melissa-website-homepage-2020-full-page"
                  :width="1920"
                  :height="1001"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item">
                <Media
                  src="melissa/website/where-to-find/melissa-website-onde-encontrar-tour"
                  :width="1943"
                  :height="976"
                  :isVideo="true"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
                <Media
                  src="melissa/website/where-to-find/melissa.com.br-onde-encontrar-31-03-19-1-mobile"
                  :width="832"
                  :height="1728"
                  :isVideo="true"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="5">
            <div class="project-extra-item">
                <Media
                  src="melissa/website/squad/melissa-website-squad-2020-full-page"
                  :width="1920"
                  :height="7009"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="6">
            <div class="project-extra-item">
                <Media
                  src="melissa/website/squad/melissa-website-squad-2020-full-page"
                  :width="1920"
                  :height="20990"
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
         ARTICLES - TODO
        </p>
      </section>


      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 2.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/website/articles/melissa-website--articles--artigo-alerta-de-collab-inedita-2020-12-15-full-page-mozjpg-uncompressed"
                  :width="1920"
                  :height="6420"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="melissa/website/articles/melissa-website--articles--artigo-ebulicao-de-cores-e-ideias-2020-12-15-full-page-mozjpg-uncompressed"
                  :width="1920"
                  :height="8011"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item">
                <Media
                  src="melissa/website/articles/melissa-website--articles--artigo-ebulicao-de-cores-e-ideias-2020-12-15-full-page-mozjpg-uncompressed"
                  :width="1920"
                  :height="8069"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
                <Media
                  src="melissa/website/articles/melissa-website--articles--artigo-reconexao-urbana-2020-12-15-full-page-mozjpg-uncompressed"
                  :width="1920"
                  :height="8960"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="5">
            <div class="project-extra-item">
                <Media
                  src="melissa/website/articles/melissa-website--articles--galeria-e-lancamento-squad-2020-12-15-full-page-mozjpg-uncompressed"
                  :width="1920"
                  :height="1629"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="6">
            <div class="project-extra-item">
                <Media
                  src="melissa/website/articles/melissa-website--articles--video-extraordinary-x-ordinary-by-two-lost-kids-2020-12-15-full-page-mozjpg-uncompressed"
                  :width="1920"
                  :height="2292"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="7">
            <div class="project-extra-item">
                <Media
                  src="melissa/website/articles/melissa-website--articles-melissa-hello-kitty-2020-12-15-16_05_44-mozjpg-uncompressed"
                  :width="1920"
                  :height="7389"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="8">
            <div class="project-extra-item">
                <Media
                  src="melissa/website/articles/melissa-website--articles-viktor-and-rolf-is-coming-2020-12-15-15_54_00-mozjpg-uncompressed"
                  :width="1920"
                  :height="6941"
                  :canExpand="true"
                  label=""/>
            </div>
          </slide>
          <slide key="9">
            <div class="project-extra-item">
                <Media
                  src="melissa/website/articles/melissa-website--gallery-que-comecem-os-festivais-2020-12-15-18_24_48-mozjpg-uncompressed"
                  :width="1920"
                  :height="1359"
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
         Collections development
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/development/color-me/www.melissa.com.br-colecoes-color-me-mobile"
                  :width="1451"
                  :height="736"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/development/color-me/www.melissa.com.br-colecoes-color-me-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/development/dreamers/melissa-dreamers-infinitos"
                  :width="1463"
                  :height="736"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/development/dreamers/melissa-dreamers-infinitos-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="5">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/development/family/melissa.com.br-colecoes-family-31-03-19"
                  :width="1924"
                  :height="912"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="6">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/development/family/melissa.com.br-colecoes-family-31-03-19-1-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="7">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/development/flygrl/flygrl"
                  :width="1832"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="8">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/development/flygrl/www.melissa.com.br-colecoes-flygrl-31-03-19-1-mobile"
                  :width="832"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="9">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/development/mapping/melissa-colecoes-mapping-tour"
                  :width="1932"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="10">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/development/mapping/melissa.com.br-colecoes-mapping-31-03-19-1-mobile"
                  :width="832"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="11">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/development/mashup/www.melissa.com.br-colecoes-mashup-31-03-19"
                  :width="1948"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="12">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/development/mashup/www.melissa.com.br-colecoes-mashup-31-03-19-1-mobile.mp4"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="13">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/development/mirror/melissa.com.br-colecoes-mirror-31-03-19"
                  :width="1928"
                  :height="912"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="14">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/development/mirror/melissa.com.br-colecoes-mirror-31-03-19-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="15">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/development/open-vibes/melissa-colecoes-open-vibes-tour"
                  :width="1935"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="16">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/development/open-vibes/melissa.com.br-colecoes-open-vibes-31-03-19-1-mobile"
                  :width="829"
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
         Collabs development
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/development/a-la-garçonne/melissa-collab-a-la-garçonne-tour"
                  :width="1950"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/development/a-la-garçonne/melissa.com.br-collabs-a-la-garconne-31-03-19-1-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/development/awaytomars/melissa.com.br-collabs-awaytomars-31-03-19"
                  :width="1950"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/development/awaytomars/melissa.com.br-collabs-awaytomars-31-03-19-1-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="5">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/development/CSC/melissa.com.br-collabs-csc-31-03-19"
                  :width="1812"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="6">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/development/CSC/melissa.com.br-collabs-csc-31-03-19-1-mobile"
                  :width="828"
                  :height="1792"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="7">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/development/fabula/melissa-collab-fabula-tour"
                  :width="1924"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="8">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/development/fabula/melissa.com.br-collabs-fabula-31-03-19-1-mobile"
                  :width="1918"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="9">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/development/rider/melissa-collab-rider-tour"
                  :width="1920"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="10">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/development/rider/melissa.com.br-collabs-rider-31-03-19-1-mobile"
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
         Specials development
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/specials/development/bike/melissa.com.br-specials-bike-31-03-19"
                  :width="1950"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="melissa/specials/development/bike/melissa.com.br-specials-bike-31-03-19-1-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/specials/development/creatives/melissa.com.br-specials-creatives-31-03-19"
                  :width="1818"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
                <Media
                  src="melissa/specials/development/creatives/melissa.com.br-specials-creatives-31-03-19-1-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="5">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/specials/development/possession/melissa.com.br-specials-possession-31-03-19"
                  :width="1842"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="6">
            <div class="project-extra-item">
                <Media
                  src="melissa/specials/development/possession/melissa.com.br-specials-possession-31-03-19-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="7">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/specials/development/sk8/melissa.com.br-specials-melissa-sk8-31-03-19"
                  :width="1842"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="8">
            <div class="project-extra-item">
                <Media
                  src="melissa/specials/development/sk8/melissa.com.br-specials-melissa-sk8-31-03-19-1-mobile"
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
         Collabs and Specials Maintence
        </p>
      </section>


      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/maintenence/campana/melissa.com.br-collabs-campana-31-03-19"
                  :width="1840"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/maintenence/campana/melissa.com.br-collabs-campana-31-03-19-1-mobile"
                  :width="831"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/maintenence/gaetano-pesce/melissa-collab-gaetano-pesce-tour"
                  :width="1838"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/maintenence/gaetano-pesce/melissa.com.br-collabs-gaetano-pesce-31-03-19-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="5">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/maintenence/j-maskrey/melissa.com.br-collabs-j-maskrey-31-03-19"
                  :width="1842"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="6">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/maintenence/j-maskrey/melissa.com.br-collabs-j-maskrey-31-03-19-1-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="7">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/maintenence/gareth-pugh/melissa.com.br-collabs-gareth-pugh"
                  :width="1814"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="8">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/maintenence/gareth-pugh/melissa.com.br-collabs-gareth-pugh-1-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="9">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/maintenence/jason-wu/melissa.com.br-collabs-jason-wu-31-03-19"
                  :width="1839"
                  :height="928"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="10">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/maintenence/jason-wu/melissa.com.br-collabs-jason-wu-31-03-19-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="11">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/maintenence/jeremy-scott/melissa.com.br-collabs-jeremy-scott-31-03-19"
                  :width="1844"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="12">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/maintenence/jeremy-scott/melissa.com.br-collabs-jeremy-scott-31-03-19-1-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="13">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/maintenence/sebastian-errazuriz/melissa.com.br-collabs-sebastian-errazuriz-31-03-19"
                  :width="1844"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="14">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/maintenence/sebastian-errazuriz/melissa.com.br-collabs-sebastian-errazuriz-31-03-19-1-mobile"
                  :width="832"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="15">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/maintenence/karl-lagerfeld/melissa.com.br-collabs-karl-lagerfeld-31-03-19"
                  :width="1842"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="16">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/maintenence/karl-lagerfeld/melissa.com.br-collabs-karl-lagerfeld-31-03-19-1-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="17">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/maintenence/vivienne-westwood/melissa.com.br-collabs-vivienne-westwood-31-03-19"
                  :width="1820"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="18">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/maintenence/vivienne-westwood/melissa.com.br-collabs-vivienne-westwood-31-03-19-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="19">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/maintenence/vitorino-campos/melissa.com.br-collabs-vitorino-campos-31-03-19"
                  :width="1836"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="20">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/maintenence/vitorino-campos/melissa.com.br-collabs-vitorino-campos-31-03-19-1-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="21">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/maintenence/zaha-hadid/melissa.com.br-collabs-zaha-hadid-31-03-19"
                  :width="1840"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="22">
            <div class="project-extra-item">
                <Media
                  src="melissa/collabs/maintenence/zaha-hadid/melissa.com.br-collabs-zaha-hadid-31-03-19-1-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="23">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/specials/maintenence/roller-joy/melissa-specials-roller-joy-tour"
                  :width="1812"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="24">
            <div class="project-extra-item">
                <Media
                  src="melissa/specials/maintenence/roller-joy/melissa.com.br-specials-roller-joy-31-03-19-1-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="25">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/specials/maintenence/tropico-surreal/melissa-specials-tropico-surreal-tour"
                  :width="1844"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="26">
            <div class="project-extra-item">
                <Media
                  src="melissa/specials/maintenence/tropico-surreal/melissa.com.br-specials-tropico-surreal-31-03-19-1-mobile"
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
         Collections Maintence
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/maintenence/cine-melissa/melissa-colecoes-cine-melissa-tour"
                  :width="1836"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/maintenence/cine-melissa/melissa.com.br-colecoes-cine-melissa-31-03-19-maintenence-1-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/maintenence/dance-machine/melissa-colecoes-dance-machine-tour"
                  :width="1840"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="4">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/maintenence/dance-machine/melissa.com.br-colecoes-dance-machine-31-03-19-manutencao-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="5">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/maintenence/eat-my-melissa/melissa.com.br-colecoes-eat-my-melissa-31-03-19-"
                  :width="1816"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="6">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/maintenence/eat-my-melissa/melissa.com.br-colecoes-eat-my-melissa-31-03-19-manutencao-1-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="7">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/maintenence/nation/melissa-colecoes-nation-tour"
                  :width="1836"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="8">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/maintenence/nation/melissa.com.br-colecoes-nation-31-01-19-maintenence-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="9">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/maintenence/star-walker/melissa-colecoes-starwalker-tour"
                  :width="1812"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="10">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/maintenence/star-walker/melissa.com.br-colecoes-starwalker-31-03-19-manutencao-1-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="11">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/maintenence/wanna-be-carioca/wanna-be-carioca"
                  :width="1834"
                  :height="880"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="12">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/maintenence/wanna-be-carioca/melissa.com.br-colecoes-wanna-be-carioca-31-03-19-manutencao-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="13">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collections/maintenence/we-are-flowers/melissa-colecoes-we-are-flowers-tour"
                  :width="1838"
                  :height="896"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="14">
            <div class="project-extra-item">
                <Media
                  src="melissa/collections/maintenence/we-are-flowers/melissa.com.br-colecoes-we-are-flowers-31-03-19-manutencao-1-mobile"
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
          Collab Guidance
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/guiding/baja-east/melissa.com.br-collabs-baja-east-31-03-19"
                  :width="1932"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/collabs/guiding/baja-east/melissa.com.br-collabs-baja-east-31-03-19-1-mobile"
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
          Galleries
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/galleries/melissa-galleries-tour"
                  :width="1928"
                  :height="912"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="melissa/galleries/melissa.com.br-galerias-31-03-19-1-mobile"
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
          Melissa Next
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/next/melissa-next-contest-tour"
                  :width="1443"
                  :height="784"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="melissa/next/melissa-next-br-mobile"
                  :width="832"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item">
                <Media
                  src="melissa/next/melissa-next-contest-2020-12-15-18_21_44"
                  :width="1920"
                  :height="6971"
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
          Melissa Pop
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/pop/melissa-pop-2020"
                  :width="1452"
                  :height="720"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="melissa/pop/melissa-pop-2020-full-page-mozjpg-uncompressed"
                  :width="1920"
                  :height="6264"
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
          Melissa Sustainability
        </p>
      </section>

      <section class="project-extra">
        <carousel :wrapAround="true" :breakpoints="{180: {itemsToShow: 1, snapAlign: 'start'}, 768: {itemsToShow: 1.75, snapAlign: 'center'}}">
          <slide key="1">
            <div class="project-extra-item landscape">
                <Media
                  src="melissa/sustainability/melissa-sustainability-tour"
                  :width="1469"
                  :height="704"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="2">
            <div class="project-extra-item">
                <Media
                  src="melissa/sustainability/https-www.melissa.com.br-sobre-sustentabilidade-17-10-19-mobile"
                  :width="831"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label=""/>
            </div>
          </slide>
          <slide key="3">
            <div class="project-extra-item">
                <Media
                  src="melissa/sustainability/melissa-sustainability-full-page"
                  :width="1920"
                  :height="23835"
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
  name: 'Melissa',
}
</script>

<style lang="scss">
@import '../../sass/projects';
@import '../../sass/modal';
</style>