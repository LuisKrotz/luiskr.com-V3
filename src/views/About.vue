<template>
  <article>
    <div class="about">
      <h2 id="about" class="about-title" ref="about">
        <span v-if="translations" v-html="translations.title"></span>
        <span v-else>{{ loading.msg1 }}</span>
      </h2>

      <!-- Profile + 2-column text -->
      <div class="about-profile-section">
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
    </div>

    <Contact />
    <AwardsMentions :title="mentions.title" :items="mentions.items" />
  </article>
</template>

<script>
import { getDatabase, ref, child, get } from 'firebase/database'
import Contact from '../components/Contact.vue'
import AwardsMentions from '../components/AwardsMentions.vue'

export default {
  name: 'About',
  components: { Contact, AwardsMentions },

  data() {
    return {
      loading: this.$store.getters.getlang.loading,
      storage: this.$store.getters.getStorage,
      translations: false,
      profilePicture: null,
    }
  },

  computed: {
    mentions() {
      return this.$store.getters.getMentions
    },
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
@import '../sass/awards-footer';
</style>
