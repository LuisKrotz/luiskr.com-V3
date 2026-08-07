<template>
  <article :class="(has_touch ? 'has_touch' : '')">
    <div id="home">
      <div id="portfolio" class="portfolio-title">
        <h2 class="hdn">
            <span v-if="translations">{{ translations.message }}:</span>
            <span v-else>{{ loading.msg1 }}</span>
        </h2>
      </div>

      <section class="portfolio">
        <ul class="portfolio-grid" v-if="translations?.portfoliolist">
          <li class="portfolio-item" v-for="item, index in translations.portfoliolist" :key="index" @mouseenter.self="hover($event)" @mousemove="onMouseMove($event)" @mouseleave="clear()">
            <router-link class="portfolio-item-link" :to="'/portfolio/' + item.link">
              <!-- Cover image — takes more space than the label -->
              <div class="portfolio-item-cover">
                <img
                  decoding="async"
                  class="portfolio-item-cover-img"
                  v-lazy="{src: storage + 'covers/' + item.image + ext, loading: storage + 'covers/' + item.image + loadext + ext}"
                  :src="storage + 'covers/' + item.image + ext"
                  :alt="item.label"
                  :width="item.width ? item.width[0] : undefined"
                  :height="item.height ? item.height[0] : undefined"
                />
              </div>
              <!-- Label -->
              <div class="portfolio-item-label">
                <h4 class="portfolio-item-label-title">{{ item.label }}</h4>
                <p class="portfolio-item-label-description" v-html="item.description"></p>
              </div>
            </router-link>
          </li>
        </ul>
        <ul class="portfolio-grid" v-else>
          <li class="portfolio-item" v-for="n in 8" :key="n">
            <span class="portfolio-item-link">
              <div class="portfolio-item-cover portfolio-item-cover--loading"></div>
              <div class="portfolio-item-label">
                <h4 class="portfolio-item-label-title">{{ loading.msg2 }}</h4>
                <p class="portfolio-item-label-description">{{ loading.msg3 }}</p>
              </div>
            </span>
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
import Contact from '../components/Contact.vue'

export default {
  data() {
    return {
      loading:    this.$store.getters.getlang.loading,
      storage:    this.$store.getters.getStorage,
      translations: false,
      svg:        this.$store.getters.getSVG,
      has_touch:  this.$store.getters.getTouch,
      showhover:  this.$store.getters.getHover,
      tap:        this.$store.getters.getClickOrTap,
      page:       this.$store.getters.getOnMouseMove,
      // Image extensions (matching original Computer.vue convention)
      loadext:    '-mozjpg3-MSSIM-tuned-kodak',
      ext:        '.jpg',
    }
  },
  name: 'Home',
  components: {
    Contact
  },
  methods: {
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
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  }
}
</script>


<style lang="scss">
@import '../sass/home';
</style>