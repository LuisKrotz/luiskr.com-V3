<template>
  <div :class="modal.class">
    <!-- Progress bar -->
    <div class="progress-bar" :class="{ 'progress-bar--active': routeLoading }"></div>

    <div v-if="modal.class === ''" class="nav">
      <router-link class="nav-link back" v-if="$router.currentRoute.value.name !== 'Home'" to="/">
        {{ translations?.title ?? 'LK' }}
      </router-link>
      <button class="nav-link active" v-else @click="scrollTop()">
        {{ translations?.title ?? 'LK' }}
      </button>

      <div v-if="$router.currentRoute.value.name !== 'Not Found'">
        <router-link
          class="nav-link"
          v-if="$router.currentRoute.value.name !== 'About'"
          :to="translations?.about?.link ?? '/about'"
        >
          {{ translations?.about?.description ?? 'About' }}
        </router-link>
        <button class="nav-link active" v-else @click="scrollTop()">
          {{ translations?.about?.description ?? 'About' }}
        </button>
        <span class="nav-separator">{{ !onBottom ? '|' : '▲' }}</span>

        <button v-if="!onBottom" class="nav-link scroll-down" @click="scrollBottom()">
          <template
            v-if="
              $router.currentRoute.value.name === 'Home' ||
              $router.currentRoute.value.name === 'About'
            "
          >
            {{ translations?.contact ?? '' }}
          </template>
          <template v-else>{{ translations?.related ?? '' }}</template>
        </button>
        <button v-else class="nav-link scroll-up" @click="scrollTop()">
          {{ translations?.scrollup ?? '↑' }}
        </button>
      </div>
    </div>
    <div v-else @click="closeModal()" class="nav">
      <button class="nav-link" @click="scrollTop()">{{ translations?.title ?? 'LK' }}</button>
    </div>

    <router-view v-slot="{ Component, route }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
  <aside v-if="translations && !renderCookies" class="cookies">
    <p class="cookies-info" v-html="translations.cookies.message"></p>
    <div class="cookies-buttons">
      <button class="cookies-buttons-accept" @click="cookieAction(true)">
        {{ translations.cookies.accept }}
      </button>
      <button class="cookies-buttons-refuse" @click="cookieAction(false)">
        {{ translations.cookies.refuse }}
      </button>
    </div>
  </aside>
</template>

<script>
import { getDatabase, ref, child, get } from 'firebase/database'
import router from './router/index.js'

const cookie = 'cookie',
  cookieEvent = 'cookieAction'

export default {
  name: 'App',
  data() {
    return {
      modal: this.$store.getters.getModal,
      onBottom: false,
      renderCookies: false,
      translations: false,
      routeLoading: false,
      transitionName: 'fade',
    }
  },
  methods: {
    checkScroll() {
      if (document.body.scrollHeight - window.scrollY <= window.innerHeight + 200) {
        this.onBottom = true
      } else {
        this.onBottom = false
      }
    },
    closeModal() {
      const scroll = this.$store.getters.getModal.transform

      this.$store.commit('setModal', {
        transform: 0,
        class: '',
        open: false,
        media: {
          source: undefined,
          thumb: undefined,
          alt: undefined,
          width: undefined,
          height: undefined,
          isVideo: undefined,
        },
      })

      // Restore URL without slug
      const basePath = this.$route.path.split('/').slice(0, 3).join('/')
      if (this.$route.path !== basePath) {
        this.$router.replace(basePath)
      }

      window.requestAnimationFrame(() => {
        window.scrollTo(0, scroll)
      })
    },
    cookieAction(state) {
      localStorage.setItem(cookie, state)
      document.dispatchEvent(new Event(cookieEvent))
      setTimeout(() => (this.renderCookies = true), 2000)
    },
    scrollBottom() {
      this.$smoothScroll({
        duration: 1000,
        updateHistory: true,
        scrollTo: document.body.scrollHeight,
        hash: '',
      })
    },
    scrollTop() {
      this.$smoothScroll({
        duration: 1000,
        updateHistory: true,
        scrollTo: 0,
        hash: '',
      })
    },
    loadData() {
      let dbpath

      this.$store.commit('setLang', this.$store.getters.getlang.locale)
      this.renderCookies = JSON.parse(localStorage.getItem(cookie))
      dbpath = this.$store.getters.getlang.database + this.$store.getters.getlang.locale

      if (!this.translations) {
        get(child(ref(getDatabase()), `${dbpath}/APP`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.translations = snapshot.val()
              this.$store.commit('setClickOrTap', {
                click: this.translations.actions.click,
                tap: this.translations.actions.tap,
              })
            }
          })
          .catch(console.error)
      }

      if (!this.$store.getters.getlang.components) {
        get(child(ref(getDatabase()), `${dbpath}/components`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.$store.commit('setComponentLang', snapshot.val())
            }
          })
          .catch(console.error)
      }

      // Load mentions/awards from About page data (once, globally)
      if (!this.$store.getters.getMentions.items) {
        get(child(ref(getDatabase()), `${dbpath}/pages/about`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const about = snapshot.val()
              this.$store.commit('setMentions', {
                title: about.mentions ?? 'Some mentions',
                items: about.mention_items ?? [],
              })
            }
          })
          .catch(console.error)
      }
    },
    // Determine transition based on route meta
    _getTransition(to, from) {
      // Project pages ↔ Home: slide horizontally
      if (to.meta?.projectRoute && !from.meta?.projectRoute) return 'slide-left'
      if (!to.meta?.projectRoute && from.meta?.projectRoute) return 'slide-right'
      // About / Legal: slide up from bottom
      if (to.name === 'About' || to.meta?.legalRoute) return 'slide-up'
      if (from.name === 'About' || from.meta?.legalRoute) return 'slide-down'
      return 'fade'
    },
  },
  created() {
    this.loadData()

    // Progress bar + transition name on route changes
    router.beforeEach((to, from) => {
      this.routeLoading = true
      this.transitionName = this._getTransition(to, from)
    })
    router.afterEach(() => {
      setTimeout(() => (this.routeLoading = false), 350)
    })
  },
  mounted() {
    window.addEventListener('scroll', () => this.checkScroll())
    window.addEventListener('resize', () => this.checkScroll())
  },
  watch: {
    $route() {
      this.loadData()
    },
  },
}
</script>

<style lang="scss">
@import './sass/app';
</style>
