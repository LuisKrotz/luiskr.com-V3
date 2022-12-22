<template>
  <article :class="(has_touch ? 'has_touch' : '')">
    <div id="home">
      <div id="portfolio" class="portfolio-title">
        <h2 class="hdn">
            <span v-if="translations">{{ translations.message }}:</span>
            <span v-else>{{ loading.msg1 }}</span>
        </h2>

        <div v-for="n in marquee" :key="n" class="portfolio-title-marquee" aria-hidden="true" data-no-snippet tabindex="-1">
            <template v-for="n in 3" :key="n">
              <span>▲</span>
              <span v-if="translations">{{ translations.message }}</span>
              <span v-else>{{ loading.msg1 }}</span>
            </template>
        </div>
      </div>

      <section class="portfolio">
        <ul class="portfolio-grid" v-if="translations?.portfoliolist">
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
        <ul class="portfolio-grid" v-else>
          <li class="portfolio-item" v-for="n in 8" :key="n">
            <DrawComputer
              :label="loading.msg2"
              :description="loading.msg3"/>
          </li>
        </ul>
      </section>
    </div>

    <Contact />

    <svg v-if="translations && !has_touch"
        :viewBox="svg.viewBox"
        class="hover"
        :alt="tap + translations.explore[0] + translations.explore[1]"
        :style="'transform: translate3D(' + page.left + 'px, ' + page.top + 'px, 0); '+ (showhover ? 'opacity: 1' :  'opacity: 0')"
        aria-hidden="true">
      <title>{{ tap + translations.explore[0] + translations.explore[1] }}</title>
      <g>
        <polygon class="hover-triangle-2" :points="svg.polygonPoints[1]"/>
        <text class="hover-text" :transform="svg.textTransform">&lt;{{ translations.explore[1] }}/&gt;</text>
      </g>
    </svg>
  </article>
</template>

<script>
import { getDatabase, ref, child, get } from "firebase/database";
import Contact        from '../components/Contact'
import DrawComputer   from '../components/drawings/Computer'

export default {
  data() {
    return {
      loading:              this.$store.getters.getlang.loading,
      storage:              this.$store.getters.getStorage,
      translations:         false,
      svg:                  this.$store.getters.getSVG,
      has_touch:            this.$store.getters.getTouch,
      showhover:            this.$store.getters.getHover,
      tap:                  this.$store.getters.getClickOrTap,
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
          scrollTo: this.$refs[ref]  // scrollTo is also allowed to be number
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
    let lang = this.$store.getters.getlang;
    document.title = this.$route.meta.title;

    get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation)).then((snapshot) => {
      if (snapshot.exists()) {
        this.translations = snapshot.val();
      } else {
        console.log('%cERROR: could\'t find HOME DATA', this.$sharedData.styles.info);
      }
    }).catch((error) => {
      console.error(error);
    });
  },
  mounted() {
    this.$store.commit('setMarqueeAmount');
    this.marquee = this.$store.getters.getMarqueeAmount;

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