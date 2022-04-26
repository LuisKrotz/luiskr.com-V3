<template>
  <article v-if="translations">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
        <h2 class="internal-title">{{ translations.title }}</h2>
        <div class="internal-main">
            <Media
            classes="internal-main-item"
            :src="translations.cover.source"
            :width="translations.cover.width"
            :height="translations.cover.height"
            :isVideo="translations.cover?.isVideo ?? false"
            :label="translations.cover.label"/>
        </div>

      <section v-for="parentKey in translations.sections.length" :key="parentKey">
            <template v-for="child, childkey  in translations.sections[parentKey - 1]" :key="childkey">
                <div v-if="typeof child[0] === 'string'" class="internal-description">
                    <template v-for="item, itemkey in child" :key="itemkey">
                        <h3 v-if="childkey === 0 && itemkey < 1" class="internal-description-text" v-html="item"></h3>
                        <p v-else class="internal-description-text" v-html="item"></p>
                    </template>
                </div>
                <div v-else class="internal-extra">
                    <div class="internal-extra-scroll">
                        <div v-for="item, itemkey in child" :key="itemkey" :class="'internal-extra-item ' + item?.class ?? ''">
                            <Media
                            :src="item.source"
                            :width="item.width"
                            :height="item.height"
                            :canExpand="item?.canExpand ?? false"
                            :isVideo="item?.isVideo ?? false"
                            :label="item.label"/>
                        </div>
                    </div>
                </div>
            </template>
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
import Media                from'../../components/Media';
import MediaExpanded        from'../../components/MediaExpanded';
import Related              from'../../components/portfolio/Related';

export default {
  data() {
    return {
      modal:        this.$store.getters.getModal,
      translations: false,
    }
  },
  created() {
    let lang = this.$store.getters.getlang;
    document.title = this.$route.meta.title;

    fetch(`${lang.prefix}/projects/metcha${lang.suffix}`)
    .then((response) => {
        return response.json();
    }).then((data) => {
        this.translations = data;
    });
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
  name: 'Render Project',
}
</script>

<style lang="scss">
@import '../../sass/internals';
@import '../../sass/modal';
</style>