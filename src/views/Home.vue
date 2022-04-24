<template>
  <article :class="has_touch ? 'has_touch' : ''">
      <div id="portfolio" class="portfolio-title">
        <h2 class="hdn">{{ translations.message }}:</h2>

        <div v-for="n in marquee" :key="n" class="portfolio-title-marquee" aria-hidden="true" data-no-snippet tabindex="-1">
            <template v-for="n in 3" :key="n"> ▲ {{ translations.message }}</template>
        </div>
      </div>


    <section class="portfolio">
      <ul class="portfolio-grid">
        <li class="portfolio-item" v-for="item, index in translations.portfoliolist" :key="index" @mouseenter.self="hover($event)"  @mousemove="onMouseMove($event)" @mouseleave="clear()">
          <DrawComputer
            :link="'/portfolio/' + item.link"
            :image="storage + 'covers/' + item.image"
            :width="item.width"
            :height="item.height"
            :label="item.label"
            :description="item.description"/>
        </li>
      </ul>
    </section>

    <Contact />

    <img v-if="translations && !has_touch" :alt="translations.explore[0]" :width="translations.explore[1]" :height="translations.explore[2]" class="hover" :style="'transform: translate3D(' + page.left + 'px, ' + page.top + 'px, 0);'+ (showhover ? 'opacity: 1' :  'opacity: 0')" aria-hidden="true" :src="translations.explore[3]">
  </article>
</template>

<script>
import Contact        from '../components/Contact'
import DrawComputer   from '../components/drawings/Computer'

export default {
  data() {
    return {
      storage:              this.$store.getters.getStorage,
      translations:         false,
      has_touch:            this.$store.getters.getTouch,
      showhover:            this.$store.getters.getHover,
      page:                 this.$store.getters.getOnMouseMove,
      marquee:              Number
    }
  },
  name: 'Home',
  components: {
    DrawComputer,
    Contact
  },
  methods: {
    scrollTo(ref) {
        this.$smoothScroll({
          offset: -100,
          duration: 1000,
          updateHistory: false,
          scrollTo: this.$refs[ref],  // scrollTo is also allowed to be number
        })
    },
    onMouseMove(e) {
        this.$store.commit('setOnMouseMove', e);
        this.page = this.$store.getters.getOnMouseMove;
      },
    hover(e) {
      this.$store.commit('setHover', e);
      this.showhover = this.$store.getters.getHover;
    },
    clear() {
        this.$store.commit('setClear');
        this.showhover = this.$store.getters.getHover;
    },
  },
  created() {
    document.title = this.$route.meta.title;
  },
  mounted() {
    let lang = this.$store.getters.getlang;

    this.$store.commit('setMarqueeAmount');
    this.marquee = this.$store.getters.getMarqueeAmount;

    fetch(`${lang.prefix}/home${lang.suffix}`)
    .then((response) => {
        return response.json();
    }).then((data) => {
        this.translations = data;
    });

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);

    window.addEventListener('resize', () => {
        this.$store.commit('setMarqueeAmount');
        this.marquee = this.$store.getters.getMarqueeAmount;
    }, true);
  }
}
</script>


<style lang="scss">
@import '../sass/home';
</style>