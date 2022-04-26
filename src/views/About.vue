<template>
  <article>
    <div class="about" >
      <h2 id="about" class="about-title" ref="about">{{ translations.title }}</h2>
      <ul class="about-grid">
        <li class="about-item">
          <div class="about-draw">
            <div class="about-draw-mic"></div>
            <div class="about-draw-speaker"></div>
            <div class="about-draw-screen">
              <p class="about-item-text" v-html="translations.frame"></p>
            </div>
          </div>

          <template v-for="item, n in translations.col1" :key="n">
            <p class="about-item-text" v-html="item"></p>
          </template>
        </li>

        <li class="about-item">
          <template v-for="item, n in translations.col2" :key="n">
            <p class="about-item-text" v-html="item"></p>
          </template>
        </li>
      </ul>
      

      <div class="about-container">
          <p class="about-item-text">
            {{ translations.mentions }}
          </p>

          <ul class="awards">
            <li class="awards-item" v-for="item, n in translations.mention_items" :key="n">
              <a class="awards-item-link" href="item.link">
                <img v-if="item.media !== undefined" class="awards-item-link-media" v-lazy="{src: storage + item.media.path}" :width="item.media.width" :height="item.media.height">
                <span v-else class="awards-item-link-media">{{ item.icon }}</span>
                <span class="awards-item-link-text" v-html="item.description"></span>
              </a>
            </li>
          </ul>
      </div>
    </div>

    <Contact />
  </article>
</template>

<script>
import Contact from '../components/Contact'

export default {
  name: 'About',
  data() {
    return {
      storage:          this.$store.getters.getStorage,
      translations:     false
    }
  },
  created() {
    let lang = this.$store.getters.getlang;
    document.title = this.$route.meta.title;

    fetch(`${lang.prefix}/pages/about${lang.suffix}`)
    .then((response) => {
        return response.json();
    }).then((data) => {
        this.translations = data;
    });
  },
  components: {
    Contact
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