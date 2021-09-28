<template>
  <div :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h1 class="internal-title">Transa</h1>
      <div class="internal-main">
          <Media
            classes="internal-main-item"
            src="transainc/website-2021/transainc.com-feed-short-tour"
            :width="1929"
            :height="1008"
            :isVideo="true"
            label="Transa: feed short tour"/>
      </div>

      <section class="internal-description">
        <h2 class="internal-description-text">
            Transa's website, developed with VUE, CSS (Sass) and PHP (Laravel) in 2021.
          </h2>
        <p class="internal-description-text">
          I'm currently the Lead front end of Transa's website.
        </p>
        <p class="internal-description-text">
          Transa's website consists of a infinite scrolling feed, with many projects developed at Transa during the years.
        </p>
      </section>
      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/website-2021/transainc.com-tour"
                  :width="1929"
                  :height="1008"
                  :canExpand="true"
                  :isVideo="true"
                  label="Transa: feed tour"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/transainc.com-mobile-mobile"
                  :width="831"
                  :height="1712"
                  :isVideo="true"
                  :canExpand="true"
                  label="Transa: feed mobile tour"/>
            </div>

          <!-- Categories -->
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/website-2021/categories/transainc.com-category--brazilian-leather-tour"
                  :width="1929"
                  :height="1008"
                  :isVideo="true"
                  :canExpand="true"
                  label="Transa: Category - brazilian leather / tour"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/website-2021/categories/transainc.com-category--coza-tour"
                  :width="1929"
                  :height="1008"
                  :isVideo="true"
                  :canExpand="true"
                  label="Transa: Category - Coza / tour"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/website-2021/categories/transainc.com-category--melissa-tour"
                  :width="1929"
                  :height="1008"
                  :isVideo="true"
                  :canExpand="true"
                  label="Transa: Category - Melissa / tour"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/website-2021/categories/transainc.com-category--metcha-tour"
                  :width="1929"
                  :height="1008"
                  :isVideo="true"
                  :canExpand="true"
                  label="Transa: Category - METCHA / tour"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/website-2021/categories/transainc.com-category--mini-melissa-tour"
                  :width="1929"
                  :height="1008"
                  :isVideo="true"
                  :canExpand="true"
                  label="Transa: Category - Mini Melissa / tour"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/website-2021/categories/transainc.com-category--mor-tour"
                  :width="1929"
                  :height="1008"
                  :isVideo="true"
                  :canExpand="true"
                  label="Transa: Category - Mor / tour"/>
            </div>
        </div>
      </section>

      <section class="internal-description">
        <p class="internal-description-text">
         All the articles on the feed, open in a modal system, without any kind of refresh, with a bold, unique and pixel perfect style.
        </p>
      </section>


      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--o-que-e-familia-article-tour"
                  :width="1929"
                  :height="1008"
                  :canExpand="true"
                  :isVideo="true"
                  label="Transa: Article / o-que-e-familia-article / tour"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/website-2021/articles/transainc.com-articles-bem-vindos-a-venus-brasileira-short-tour"
                  :width="1929"
                  :height="1008"
                  :canExpand="true"
                  :isVideo="true"
                  label="Transa: Article / bem-vindos-a-venus-brasileira / short tour"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/website-2021/articles/transainc.com-articles-DIRECT-FROM-PARIS FASHION-WEEK-short-tour"
                  :width="1929"
                  :height="1008"
                  :isVideo="true"
                  :canExpand="true"
                  label="Transa: Article / DIRECT-FROM-PARIS FASHION-WEEK / short tour"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/website-2021/articles/transainc.com-articles-parceria-arquitetura-naciona-painel-centro-sao-paulo-short-tour"
                  :width="1929"
                  :height="1008"
                  :isVideo="true"
                  :canExpand="true"
                  label="Transa: Article / parceria-arquitetura-naciona-painel-centro-sao-paulo / short tour"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/website-2021/articles/transainc.com-articles-the-shoe-surgeon-short-tour"
                  :width="1929"
                  :height="1008"
                  :isVideo="true"
                  :canExpand="true"
                  label="Transa: Article / the-shoe-surgeon / short tour"/>
            </div>

            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--134-minutos-com-vitorino-campos-2021-06-03-15"
                  :width="1920"
                  :height="9989"
                  :canExpand="true"
                  label="Transa: Article  / 134-minutos-com-vitorino-campos-20 / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--a-chat-with-the-sneakerhead-beija-marie-velez-2021-06-03"
                  :width="1920"
                  :height="19486"
                  :canExpand="true"
                  label="Transa: Article  / a-chat-with-the-sneakerhead-beija-marie-velez / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--a-imperatriz-do-couro-patricia-vieira-2021-06-03"
                  :width="1920"
                  :height="9010"
                  :canExpand="true"
                  label="Transa: Article  / a-imperatriz-do-couro-patricia-vieira / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--anitta-fala-sobre-a-sua-relacao-com-a-nossa-collab-2021-06-03"
                  :width="1920"
                  :height="4758"
                  :canExpand="true"
                  label="Transa: Article  / anitta-fala-sobre-a-sua-relacao-com-a-nossa-collab / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--bem-vindos-a-venus-brasileira-2021-06-03"
                  :width="1920"
                  :height="7001"
                  :canExpand="true"
                  label="Transa: Article  / bem-vindos-a-venus-brasileira / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--coza-construindo-amor-com-elen-maurmann-2021-06-03-15"
                  :width="1920"
                  :height="8344"
                  :canExpand="true"
                  label="Transa: Article  / coza-construindo-amor-com-elen-maurmann-20 / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--coza-pantone-collab-2021-06-03-15"
                  :width="1920"
                  :height="7846"
                  :canExpand="true"
                  label="Transa: Article  / coza-pantone-collab-20 / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--design-na-pele-2021-06-03-15"
                  :width="1920"
                  :height="4789"
                  :canExpand="true"
                  label="Transa: Article  / design-na-pele-20 / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--editorial-especial-canvas-2021-06-03-14"
                  :width="1920"
                  :height="9693"
                  :canExpand="true"
                  label="Transa: Article  / editorial-especial-canvas-20 / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--eiichi-katsukawa-incorporates-visionary-concepts-2021-06-03-15"
                  :width="1920"
                  :height="17044"
                  :canExpand="true"
                  label="Transa: Article  / eiichi-katsukawa-incorporates-visionary-concepts-20 / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--em-parceria-com-a-arquitetura-nacional-painel-de-408m2-faz-pulsar-o-centro-de-sao-paulo-2021-06-03"
                  :width="1920"
                  :height="7937"
                  :canExpand="true"
                  label="Transa: Article  / em-parceria-com-a-arquitetura-nacional-painel-de-408m2-faz-pulsar-o-centro-de-sao-paulo / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--exclusive-chat-with-dominic-the-shoe-surgeon-ciambrone-2021-06-03"
                  :width="1920"
                  :height="14115"
                  :canExpand="true"
                  label="Transa: Article  / exclusive-chat-with-dominic-the-shoe-surgeon-ciambrone / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--fabrica-de-presentes-coza-2021-06-03"
                  :width="1920"
                  :height="3411"
                  :canExpand="true"
                  label="Transa: Article  / fabrica-de-presentes-coza / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--jeremy-scott-at-galeria-melissa-uk-2021-06-03"
                  :width="1920"
                  :height="4689"
                  :canExpand="true"
                  label="Transa: Article  / jeremy-scott-at-galeria-melissa-uk / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--melissa-papete-platform-rider-2021-06-03"
                  :width="1920"
                  :height="11317"
                  :canExpand="true"
                  label="Transa: Article  / melissa-papete-platform-rider / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--melissa-portraits-sarune-paulauskaite-2021-06-03"
                  :width="1920"
                  :height="6989"
                  :canExpand="true"
                  label="Transa: Article  / melissa-portraits-sarune-paulauskaite / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--melissa-viktor-rolf-direct-from-paris-fashion-week-2021-06-03"
                  :width="1920"
                  :height="9294"
                  :canExpand="true"
                  label="Transa: Article  / melissa-viktor-rolf-direct-from-paris-fashion-week / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--meu-pote-coza-2021-06-03"
                  :width="1920"
                  :height="6437"
                  :canExpand="true"
                  label="Transa: Article  / meu-pote-coza / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--mini-melissa-hello-kitty-2021-06-03"
                  :width="1920"
                  :height="6732"
                  :canExpand="true"
                  label="Transa: Article  / mini-melissa-hello-kitty / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--nova-colecao-coza-pantone-2021-06-03"
                  :width="1920"
                  :height="4720"
                  :canExpand="true"
                  label="Transa: Article  / nova-colecao-coza-pantone / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--novas-ideias-sempre-2021-06-03-15"
                  :width="1920"
                  :height="4032"
                  :canExpand="true"
                  label="Transa: Article  / novas-ideias-sempre-20 / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--o-brazilian-leather-convidou-patricia-a-assinar-um-ensaio-2021-06-03"
                  :width="1920"
                  :height="6613"
                  :canExpand="true"
                  label="Transa: Article  / o-brazilian-leather-convidou-patricia-a-assinar-um-ensaio / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--o-que-e-familia-2021-06-03"
                  :width="1920"
                  :height="19952"
                  :canExpand="true"
                  label="Transa: Article  / o-que-e-familia / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--quem-brilha-mais-o-cha-o-ou-o-mop-mor-2021-06-03"
                  :width="1920"
                  :height="5677"
                  :canExpand="true"
                  label="Transa: Article  / quem-brilha-mais-o-cha-o-ou-o-mop-mor / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--ruohan-wang-s-on-human-expression-and-nature-2021-06-03"
                  :width="1920"
                  :height="17865"
                  :canExpand="true"
                  label="Transa: Article  / ruohan-wang-s-on-human-expression-and-nature / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--sheron-barber-roots-and-passion-into-custom-pieces-2021-06-03"
                  :width="1920"
                  :height="24302"
                  :canExpand="true"
                  label="Transa: Article  / sheron-barber-roots-and-passion-into-custom-pieces / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--stefan-sagmeister-opens-up-about-his-new-project-2021-06-03"
                  :width="1920"
                  :height="22180"
                  :canExpand="true"
                  label="Transa: Article  / stefan-sagmeister-opens-up-about-his-new-project / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--the-story-behind-the-metcha-x-tss-aj-xi-prototype-collab-2021-06-03"
                  :width="1920"
                  :height="15929"
                  :canExpand="true"
                  label="Transa: Article  / the-story-behind-the-metcha-x-tss-aj-xi-prototype-collab / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--to-celebrate-mickey-s-birthday-a-collab-full-of-classics-2021-06-03"
                  :width="1920"
                  :height="11986"
                  :canExpand="true"
                  label="Transa: Article  / to-celebrate-mickey-s-birthday-a-collab-full-of-classics / screenshoot"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="transainc/website-2021/articles/transainc.com-article--todo-brasileiro-tem-um-pouco-do-sertao-ronaldo-fraga-2021-06-03"
                  :width="1920"
                  :height="10126"
                  :canExpand="true"
                  label="Transa: Article  / todo-brasileiro-tem-um-pouco-do-sertao-ronaldo-fraga / screenshoot"/>
            </div>
        </div>
      </section>


      <section class="internal-description">
        <p class="internal-description-text">
         The website also features a Join-us page, in a conversational style all done in CSS and Javascript.
        </p>
        <p class="internal-description-text">
          Evolved from Transa's Muda project, where I also worked as the front end developer until the new 2021 version of Transa's website was created.
        </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/website-2021/join-us/transainc.com-join-us-short-tour"
                  :width="1929"
                  :height="1008"
                  :canExpand="true"
                  :isVideo="true"
                  label="Transa: Join Us page short tour"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="transainc/muda/transainc-muda"
                  :width="1440"
                  :height="784"
                  :isVideo="true"
                  :canExpand="true"
                  label="Transa: Muda page"/>
            </div>
        </div>
      </section>

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
  name: 'Transainc',
}
</script>

<style lang="scss">
@import '../../sass/internals';
@import '../../sass/modal';
</style>