<template>
  <article>
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h2 class="internal-title">Cecerelê</h2>
      <div class="internal-main">
          <Media
            classes="internal-main-item"
            src="cecerele/cecerele-tour"
            :width="3836"
            :height="2056"
            :isVideo="true"
            label="Cecerelê: criada em 2019 pela historiadora Joana Schossler para produzir jogos, contamos com a colaboração de artistas, designers e pesquisadores muito talentosos. Com o propósito de oferecer para a sociedade brinquedos bonitos, educativos e de qualidade - website tour"/>
      </div>

      <section>
        <div class="internal-description">
          <h3 class="internal-description-text">
            I met <a href="https://www.instagram.com/joananolitoral" rel="noopener" target="_blank">Joana</a> from <a href="https://www.cecerele.com.br?utm_source=luiskr.com" rel="noopener" target="_blank">Cecerelê </a>through an indication of a Friend of ours, <a href="https://www.instagram.com/saguzeiro" rel="noopener" target="_blank">Sagu</a> in November 2021 and Joana presented me with the project necessities.
          </h3>
          <p class="internal-description-text">
            Joana needed a website for the Cecerelê project to enable the Instagram shop feature, in a platform that was easy to maintain in the long run.
          </p>
          <p class="internal-description-text">
            Through many talks, working closely with Joana and taking into account all project constraints for future maintenance we came across a solution, a Brazilian e-commerce platform called "Illuria".
          </p>
        </div>
        <div class="internal-extra">
          <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="cecerele/cecerele-br-home-update"
                  :width="3840"
                  :height="2368"
                  :canExpand="true"
                  :isVideo="false"
                  label="Cecerelê: homepage with products updated on dec. 2021"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="cecerele/cecerele-br-sobre-nos"
                  :width="1920"
                  :height="5654"
                  :canExpand="true"
                  :isVideo="false"
                  label="Cecerelê: about us page"/>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="internal-description">
          <h3 class="internal-description-text">
            Based on my previous experience in platforms as the Vtex platform, I explained all the pros and cons of using an already developed platform, and we settled on starting the project.
          </h3>
          <p class="internal-description-text">
            The project wasn't focused on programming exclusively. Working with Joana we created an identity for the website, establish a colour palette and a general mood for the webpage.
          </p>
        </div>
        <div class="internal-extra">
          <div class="internal-extra-scroll">
            <div class="internal-extra-item">
                <Media
                  src="cecerele/cecerele-br-pd-8e2da8-kit-para-colorir-adulto-edicao-limitada"
                  :width="1170"
                  :height="1863"
                  :canExpand="true"
                  :isVideo="false"
                  label="Cecerelê: -  product page"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="cecerele/cecerele-br-pd-8e3765-kit-para-colorir-infantil-edicao-limitada"
                  :width="1280"
                  :height="1815"
                  :canExpand="true"
                  :isVideo="false"
                  label="Cecerelê: kit para colorir adulto edição limitada - product page"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="cecerele/cecerele-br-memorelas-jogo-de-memoria-das-mulheres-brasileiras"
                  :width="1920"
                  :height="2002"
                  :canExpand="true"
                  :isVideo="false"
                  label="Cecerelê: Memorêlas jogo de memória das mulheres brasileiras - product page"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="cecerele/cecerele-br-minha-praia-livro-de-colorir"
                  :width="1920"
                  :height="1927"
                  :canExpand="true"
                  :isVideo="false"
                  label="Cecerelê: Minha praia, livro de colorir - product page"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="cecerele/cecerele-br-quebra-cabeca-revolucionarias"
                  :width="1920"
                  :height="2027"
                  :canExpand="true"
                  :isVideo="false"
                  label="Cecerelê: Quebra cabeça Revolucionárias -  product page"/>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="internal-description">
          <h3 class="internal-description-text">
            Every page from the homepage, to products to login and cart pages, were through to keep in mind a fun branding related to Cecerelê.
          </h3>
          <p class="internal-description-text">
            Cecerelê's website was a great project to work on.
          </p>
          <p class="internal-description-text">
            Although my main focus is programming, not every project demands a great deal of programming to be done and using my UI and UX skills is always fun.
          </p>
          <p class="internal-description-text">
            I  loved to work with SEO. And to set up the entire project from start to finish.
          </p>
        </div>
        <div class="internal-extra">
          <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="cecerele/cecerele-br-cart-content"
                  :width="1920"
                  :height="1476"
                  :canExpand="true"
                  :isVideo="false"
                  label=""/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="cecerele/cecerele-br-login"
                  :width="1920"
                  :height="1295"
                  :canExpand="true"
                  :isVideo="false"
                  label=""/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="cecerele/cecerele-br-cart-client-address"
                  :width="1920"
                  :height="1476"
                  :canExpand="true"
                  :isVideo="false"
                  label=""/>
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
  name: 'Cecerele',
}
</script>

<style lang="scss">
@import '../../sass/internals';
@import '../../sass/modal';
</style>