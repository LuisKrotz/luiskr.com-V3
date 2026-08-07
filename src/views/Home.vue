<template>
  <article :class="(has_touch ? 'has_touch' : '')">
    <div id="home">
      <div id="portfolio" class="portfolio-title">
        <h2 class="hdn">
            <span v-if="translations">{{ translations.message }}:</span>
            <span v-else>{{ loading.msg1 }}</span>
        </h2>
      </div>

      <!-- ── Selected Projects ──────────────────────────────────────── -->
      <section class="portfolio-section portfolio-section--selected">
        <h2 class="portfolio-section-title">
          <span v-if="translations">{{ translations.featured }}</span>
          <span v-else class="skeleton skeleton--block" style="width:240px;height:1.2em;"></span>
        </h2>

        <ul class="portfolio-grid portfolio-grid--selected" v-if="translations?.portfoliolist">
          <li class="portfolio-item portfolio-item--selected"
              v-for="item in featuredItems" :key="item.link"
              @mouseenter.self="hover($event)" @mousemove="onMouseMove($event)" @mouseleave="clear()">
            <router-link class="portfolio-item-link" :to="'/portfolio/' + item.link">
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
              <div class="portfolio-item-label portfolio-item-label--selected">
                <h3 class="portfolio-item-label-title portfolio-item-label-title--selected">{{ item.label }}</h3>
                <p class="portfolio-item-label-description">{{ item.description }}</p>
              </div>
            </router-link>
          </li>
        </ul>

        <!-- Loading skeleton -->
        <ul class="portfolio-grid portfolio-grid--selected" v-else>
          <li class="portfolio-item portfolio-item--selected" v-for="n in 2" :key="n">
            <div class="portfolio-item-cover portfolio-item-cover--loading"></div>
            <div class="portfolio-item-label portfolio-item-label--selected">
              <span class="skeleton skeleton--block" style="width:60%;height:1.4em;margin-bottom:.5rem;"></span>
              <span class="skeleton skeleton--block" style="width:80%;height:.9em;"></span>
            </div>
          </li>
        </ul>
      </section>

      <!-- ── Know More / Archive ────────────────────────────────────── -->
      <section class="portfolio-section portfolio-section--archive">
        <h2 class="portfolio-section-title portfolio-section-title--archive">
          <span v-if="translations">{{ translations.archive }}</span>
          <span v-else class="skeleton skeleton--block" style="width:180px;height:1em;"></span>
        </h2>

        <ul class="portfolio-grid portfolio-grid--archive" v-if="translations?.portfoliolist">
          <li class="portfolio-item portfolio-item--archive"
              v-for="item in archiveItems" :key="item.link">
            <router-link class="portfolio-item-link" :to="'/portfolio/' + item.link">
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
              <div class="portfolio-item-label portfolio-item-label--archive">
                <h3 class="portfolio-item-label-title portfolio-item-label-title--archive">{{ item.label }}</h3>
                <p class="portfolio-item-label-description portfolio-item-label-description--archive">{{ item.description }}</p>
              </div>
            </router-link>
          </li>
        </ul>

        <!-- Loading skeleton -->
        <ul class="portfolio-grid portfolio-grid--archive" v-else>
          <li class="portfolio-item portfolio-item--archive" v-for="n in 6" :key="n">
            <div class="portfolio-item-cover portfolio-item-cover--loading"></div>
            <div class="portfolio-item-label portfolio-item-label--archive">
              <span class="skeleton skeleton--block" style="width:60%;height:1em;margin-bottom:.4rem;"></span>
              <span class="skeleton skeleton--block" style="width:80%;height:.8em;"></span>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <Contact />
  </article>
</template>

<script>
import { getDatabase, ref, child, get } from "firebase/database";
import Contact from '../components/Contact.vue'

export default {
  data() {
    return {
      loading:      this.$store.getters.getlang.loading,
      storage:      this.$store.getters.getStorage,
      translations: false,
      has_touch:    this.$store.getters.getTouch,
      loadext:      '-mozjpg3-MSSIM-tuned-kodak',
      ext:          '.jpg',
    }
  },
  name: 'Home',
  components: { Contact },

  computed: {
    featuredItems() {
      if (!this.translations?.portfoliolist) return [];
      return this.translations.portfoliolist.filter(i => i.featured === true);
    },
    archiveItems() {
      if (!this.translations?.portfoliolist) return [];
      return this.translations.portfoliolist.filter(i => i.featured !== true);
    },
  },

  methods: {
    onMouseMove(e) {
      this.$store.commit('setOnMouseMove', e);
    },
    hover(e) {
      this.$store.commit('setHover', e);
    },
    clear() {
      this.$store.commit('setClear');
    },
  },

  created() {
    const lang = this.$store.getters.getlang;
    document.title = this.$route.meta.title;

    get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation))
      .then(snapshot => {
        if (snapshot.exists()) this.translations = snapshot.val();
        else console.log('%cERROR: couldn\'t find HOME DATA', this.$sharedData.styles.info);
      })
      .catch(console.error);
  },

  mounted() {
    setTimeout(() => window.scrollTo(0, 0), 500);
  },
}
</script>

<style lang="scss">
@import '../sass/home';
</style>