<template>
  <article>
    <div class="about" >
      <h2 id="about" class="about-title" ref="about">
        <span v-if="translations" v-html="translations.title"></span>
        <span v-else>{{ loading.msg1 }}</span>
      </h2>
      <ul class="about-grid">
        <li class="about-item">
          <div class="about-draw">
            <div class="about-draw-mic"></div>
            <div class="about-draw-speaker"></div>
            <div class="about-draw-screen">
              <p v-if="translations" class="about-item-text" v-html="translations.frame"></p>
              <p v-else class="about-item-text">
                {{ loading.msg3 }}
              </p>
            </div>
          </div>

          <template v-if="translations">
            <template v-for="item, n in translations.col1" :key="n">
              <p class="about-item-text" v-html="item"></p>
            </template>
          </template>
          <p v-else class="about-item-text">{{ loading.msg2 }}</p>
        </li>

        <li class="about-item">
          <template v-if="translations">
            <template v-for="item, n in translations.col2" :key="n">
              <p class="about-item-text" v-html="item"></p>
            </template>
          </template>
        </li>
      </ul>


      <div class="about-container">
          <p v-if="translations" class="about-item-text">
            {{ translations.mentions }}
          </p>
          <p v-else class="about-item-text">
            {{ loading.msg2 }}
          </p>

          <ul class="awards" v-if="translations">
            <li class="awards-item" v-for="item, n in translations.mention_items" :key="n">
              <a class="awards-item-link" href="item.link">
                <img decoding="async" v-if="item.media !== undefined" class="awards-item-link-media" v-lazy="{src: storage + item.media.path}" :width="item.media.width" :height="item.media.height">
                <span v-else class="awards-item-link-media">{{ item.icon }}</span>
                <span class="awards-item-link-text" v-html="item.description"></span>
              </a>
            </li>
          </ul>
          <ul class="awards" v-else>
            <li class="awards-item" v-for="n in 8" :key="n">
              <span class="awards-item-link">
                  <span class="awards-item-link-media">{{ loadIcons[n - 1] }}</span>
                  <span class="awards-item-link-text">{{ loading.msg1 }}</span>
              </span>
            </li>
          </ul>
      </div>
    </div>

    <Contact />
  </article>
</template>

<script>
import { getDatabase, ref, child, get } from "firebase/database";
import Contact                          from '../components/Contact'

export default {
  name: 'About',
  data() {
    return {
      loadIcons:        ['⌛', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡'],
      loading:          this.$store.getters.getlang.loading,
      storage:          this.$store.getters.getStorage,
      translations:     false
    }
  },
  components: {
    Contact
  },
  created() {
    const lang = this.$store.getters.getlang;
    document.title = this.$route.meta.title;

    get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation)).then((snapshot) => {
      if (snapshot.exists()) {
        this.translations = snapshot.val();
      } else {
        console.log('%cERROR: could\'t find PAGE DATA', this.$sharedData.styles.info);
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
@import '../sass/about';
@import '../sass/contact';
</style>