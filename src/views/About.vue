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
              <p
                class="about-item-text"
                v-for="(item, n) in translations.col1"
                :key="'c1-' + n"
                v-html="item"
              ></p>
            </template>
            <p v-else class="about-item-text">{{ loading.msg2 }}</p>
          </div>
          <div class="about-profile-text-col">
            <template v-if="translations">
              <p
                class="about-item-text"
                v-for="(item, n) in translations.col2"
                :key="'c2-' + n"
                v-html="item"
              ></p>
            </template>
          </div>
        </div>
      </div>

      <!-- Mentions label -->
      <div class="about-container">
        <p v-if="translations" class="about-item-text">
          {{ translations.mentions }}
        </p>
        <p v-else class="about-item-text">
          {{ loading.msg2 }}
        </p>
      </div>
    </div>

    <Contact />

    <!-- ── Awards carousel — in the contact-social footer row ──────────── -->
    <footer class="about-awards-footer">
      <!-- Awards carousel -->
      <HomeCarousel
        v-if="translations?.mention_items?.length"
        :items="translations.mention_items"
        variant="awards"
        :duration="10000"
        :show-dots="true"
      >
        <template #default="{ item }">
          <a class="hc-award" :href="item.link" target="_blank" rel="noopener">
            <span class="hc-award-media" v-if="item.media === undefined">{{ item.icon }}</span>
            <img
              v-else
              decoding="async"
              class="hc-award-img"
              v-lazy="{ src: storage + item.media.path }"
              :alt="item.description"
              :width="item.media.width"
              :height="item.media.height"
            />
            <span class="hc-award-text" v-html="item.description"></span>
          </a>
        </template>
      </HomeCarousel>

      <!-- Loading skeleton -->
      <div v-else class="about-awards-footer-skel">
        <span
          v-for="n in 3"
          :key="n"
          class="skeleton"
          style="
            display: inline-block;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin: 0 8px;
          "
        ></span>
      </div>

      <!-- Legal links -->
      <div class="about-awards-links">
        <router-link class="about-awards-links-item" to="/legal/privacy">
          Privacy Policy
        </router-link>
        <span class="about-awards-links-sep">•</span>
        <router-link class="about-awards-links-item" to="/legal/gdpr">GDPR</router-link>
        <span class="about-awards-links-sep">•</span>
        <router-link class="about-awards-links-item" to="/legal/terms">Terms of use</router-link>
      </div>
    </footer>
  </article>
</template>

<script>
import { getDatabase, ref, child, get } from 'firebase/database'
import Contact from '../components/Contact.vue'
import HomeCarousel from '../components/HomeCarousel.vue'

export default {
  name: 'About',
  components: { Contact, HomeCarousel },

  data() {
    return {
      loading: this.$store.getters.getlang.loading,
      storage: this.$store.getters.getStorage,
      translations: false,
      profilePicture: null,
    }
  },

  created() {
    const lang = this.$store.getters.getlang
    document.title = this.$route.meta.title

    get(
      child(
        ref(getDatabase()),
        lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) this.translations = snapshot.val()
        else console.log("%cERROR: couldn't find PAGE DATA", this.$sharedData.styles.info)
      })
      .catch(console.error)

    get(
      child(
        ref(getDatabase()),
        lang.database +
          lang.locale +
          lang.pagesPath +
          this.$route.meta.translation +
          '/profilePicture'
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) this.profilePicture = snapshot.val()
      })
      .catch(console.error)
  },

  mounted() {
    setTimeout(() => window.scrollTo(0, 0), 500)
  },
}
</script>

<style lang="scss">
@import '../sass/about';
@import '../sass/contact';
</style>
