<template>
  <article>
    <div class="about">
      <h2 id="about" class="about-title" ref="about">
        <span v-if="translations" v-html="translations.title"></span>
        <span v-else>{{ loading.msg1 }}</span>
      </h2>

      <!-- Profile + 2-column text -->
      <div class="about-profile-section">
        <!-- Rounded profile picture -->
        <div class="about-profile-picture">
          <img
            v-if="translations && profilePicture"
            decoding="async"
            class="about-profile-picture-img"
            :src="profilePicture"
            :alt="translations.title"
            width="400"
            height="400"
          />
          <div v-else class="about-profile-picture-placeholder"></div>
        </div>

        <!-- Two-column text on the right -->
        <div class="about-profile-text">
          <div class="about-profile-text-col">
            <template v-if="translations">
              <p class="about-item-text" v-for="item, n in translations.col1" :key="'c1-' + n" v-html="item"></p>
            </template>
            <p v-else class="about-item-text">{{ loading.msg2 }}</p>
          </div>
          <div class="about-profile-text-col">
            <template v-if="translations">
              <p class="about-item-text" v-for="item, n in translations.col2" :key="'c2-' + n" v-html="item"></p>
            </template>
          </div>
        </div>
      </div>

      <div class="about-container">
          <p v-if="translations" class="about-item-text">
            {{ translations.mentions }}
          </p>
          <p v-else class="about-item-text">
            {{ loading.msg2 }}
          </p>

          <ul class="awards" v-if="translations">
            <li class="awards-item" v-for="item, n in translations.mention_items" :key="n">
              <a class="awards-item-link" :href="item.link">
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
import Contact                          from '../components/Contact.vue'

export default {
  name: 'About',
  data() {
    return {
      loadIcons:        ['⌛', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡'],
      loading:          this.$store.getters.getlang.loading,
      storage:          this.$store.getters.getStorage,
      translations:     false,
      profilePicture:   null,
    }
  },
  components: {
    Contact
  },
  created() {
    const lang = this.$store.getters.getlang;
    document.title = this.$route.meta.title;

    // Load page content
    get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation)).then((snapshot) => {
      if (snapshot.exists()) {
        this.translations = snapshot.val();
      } else {
        console.log('%cERROR: couldn\'t find PAGE DATA', this.$sharedData.styles.info);
      }
    }).catch((error) => {
      console.error(error);
    });

    // Load profile picture from Firebase
    get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation + '/profilePicture')).then((snapshot) => {
      if (snapshot.exists()) {
        this.profilePicture = snapshot.val();
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