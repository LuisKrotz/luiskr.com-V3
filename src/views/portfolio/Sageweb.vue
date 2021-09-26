<template>
  <div :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h1 class="internal-title">Sageweb</h1>
      <div class="internal-main">
        <Media
          classes="project-main-item"
          src="genesysinf/genesysinf-sageweb-2015-atalhos"
          :width="1366"
          :height="649"
          label="Sageweb: shortcuts screenshoot"/>
      </div>

      <section class="internal-description">
        <h2 class="internal-description-text">Sage is a project developed by Genesysinf, at the city of Santana do Livramento, in Brazil, and is a fiscal software.</h2>
        <p class="internal-description-text">I worked in the new version of Sage, the Sageweb in C# and Asp.net, in this Project I was working as fullstack developer, in the development team for a year. </p>
        <p class="internal-description-text">The project consisted of porting the Sage for desktop software code to a new Web Version, with challenges like connecting fiscal printer drivers to a web application, generating and printing custom fiscal reports and developing an interface similar to the Sage desktop. </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
          <div class="internal-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-cadastros-sageweb"
                  :width="1352"
                  :height="649"
                  :canExpand="true"
                  label="Sageweb: 'Cadastros' screenshoot"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-color-picker"
                  :width="1353"
                  :height="650"
                  :canExpand="true"
                  label="Sageweb: color picker screenshoot"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-filtros"
                  :width="1352"
                  :height="650"
                  :canExpand="true"
                  label="Sageweb: filters screenshoot"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-intro"
                  :width="1351"
                  :height="651"
                  :canExpand="true"
                  label="Sageweb: intro screenshoot"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-mapa-sageweb"
                  :width="1366"
                  :height="650"
                  :canExpand="true"
                  label="Sageweb: 'mapa sageweb' screenshoot"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-modulo-NFE"
                  :width="1352"
                  :height="650"
                  :canExpand="true"
                  label="Sageweb: 'módulo NFE' screenshoot"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-orndenar-atalhos"
                  :width="1351"
                  :height="604"
                  :canExpand="true"
                  label="Sageweb: shortcuts ordering screenshoot"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-personalizar"
                  :width="1354"
                  :height="650"
                  :canExpand="true"
                  label="Sageweb: personalization screenshoot"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-relatórios-gerenciais"
                  :width="1351"
                  :height="650"
                  :canExpand="true"
                  label="Sageweb: 'Relatórios Gerenciais' screenshoot"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-relatórios-gerenciais-por-mes"
                  :width="1350"
                  :height="649"
                  :canExpand="true"
                  label="Sageweb: 'Relatórios Gerenciais por mês' screenshoot"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-sistema-de-pesquisas-em-jquery"
                  :width="1366"
                  :height="651"
                  :canExpand="true"
                  label="Sageweb: search system screenshoot"/>
            </div>
            <div class="internal-extra-item landscape">
                <Media
                  src="genesysinf/genesysinf-sageweb-2015-temas"
                  :width="1352"
                  :height="651"
                  :canExpand="true"
                  label="Sageweb: themes screenshoot"/>
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
  name: 'Sageweb',
}
</script>

<style lang="scss">
@import '../../sass/internals';
@import '../../sass/modal';
</style>