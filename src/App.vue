<template>
  <div :class="modal.class">
    <!-- Progress bar -->
    <div class="progress-bar" :class="{ 'progress-bar--active': routeLoading }"></div>

    <div v-if="modal.class === ''" class="nav">
      <router-link class="nav-link back" v-if="!isHomePage" to="/">
        {{ translations?.title ?? 'LK' }}
      </router-link>
      <button
        class="nav-link"
        :class="{ active: isHomePage && activeSection === 'home' }"
        v-else
        @click="scrollTop()"
      >
        {{ translations?.title ?? 'LK' }}
      </button>

      <div v-if="$router.currentRoute.value.name !== 'Not Found'">
        <router-link
          class="nav-link"
          v-if="!isHomePage"
          to="/about"
        >
          {{ translations?.about?.description ?? 'About' }}
        </router-link>
        <button
          class="nav-link"
          :class="{ active: isHomePage && activeSection === 'about' }"
          v-else
          @click="goToAbout"
        >
          {{ translations?.about?.description ?? 'About' }}
        </button>
        <span class="nav-separator">{{ !onBottom ? '|' : '▲' }}</span>

        <button
          v-if="isHomePage"
          class="nav-link"
          :class="{ active: activeSection === 'contact' }"
          @click="scrollToContact()"
        >
          {{ translations?.contact ?? 'Contact' }}
        </button>
        <template v-else>
          <button v-if="!onBottom" class="nav-link scroll-down" @click="scrollToContact()">
            {{ translations?.related ?? '' }}
          </button>
          <button v-else class="nav-link scroll-up" @click="scrollTop()">
            {{ translations?.scrollup ?? '↑' }}
          </button>
        </template>
      </div>
    </div>
    <div v-else class="nav" style="pointer-events: auto">
      <!-- Modal nav is handled by MediaExpanded close-bar -->
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
      activeSection: 'home',
    }
  },
  methods: {
    initActiveSection() {
      const path = window.location.pathname
      if (path === '/about') {
        this.activeSection = 'about'
      } else if (path === '/contact') {
        this.activeSection = 'contact'
      } else {
        this.activeSection = 'home'
      }
    },
    checkScroll() {
      const y = window.scrollY
      this.onBottom = document.body.scrollHeight - y <= window.innerHeight + 200

      if (!this.isHomePage) return

      const aboutEl = document.getElementById('about')
      const contactEl = document.getElementById('contact')

      const aboutTop = aboutEl ? aboutEl.offsetTop - 250 : 600
      const contactTop = contactEl ? contactEl.offsetTop - 250 : 1500

      let newSection = 'home'
      if (y >= contactTop || this.onBottom) {
        newSection = 'contact'
      } else if (y >= aboutTop) {
        newSection = 'about'
      } else {
        newSection = 'home'
      }

      if (this.activeSection !== newSection) {
        this.activeSection = newSection
        const targetPath = newSection === 'home' ? '/' : `/${newSection}`
        if (window.location.pathname !== targetPath) {
          history.replaceState({}, '', targetPath)
        }
      }
    },
    closeModal() {
      const scroll = this.$store.getters.getModal.transform

      // Restore scroll position BEFORE removing fixed layout
      window.scrollTo({ top: scroll, behavior: 'instant' })

      // Restore URL without slug
      const basePath = this.$route.path.split('/').slice(0, 3).join('/')
      if (this.$route.path !== basePath) {
        this.$router.replace(basePath)
      }

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
    scrollToSection(id) {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    },
    goToAbout() {
      this.activeSection = 'about'
      this.scrollToSection('about')
      if (window.location.pathname !== '/about') {
        history.pushState({}, '', '/about')
      }
    },
    scrollToContact() {
      if (this.isHomePage) {
        this.activeSection = 'contact'
        this.scrollToSection('contact')
        if (window.location.pathname !== '/contact') {
          history.pushState({}, '', '/contact')
        }
      } else {
        this.scrollBottom()
      }
    },
    scrollTop() {
      if (this.isHomePage) {
        this.activeSection = 'home'
        if (window.location.pathname !== '/') {
          history.pushState({}, '', '/')
        }
      }
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
    getTransition(to, from) {
      // Project pages ↔ Home: slide horizontally
      if (to.meta?.projectRoute && !from.meta?.projectRoute) return 'slide-left'
      if (!to.meta?.projectRoute && from.meta?.projectRoute) return 'slide-right'
      // Home ↔ About/Contact (same page, no transition needed)
      if (to.meta?.scrollTo || from.meta?.scrollTo) return 'fade'
      // Legal: slide up from bottom
      if (to.meta?.legalRoute) return 'slide-up'
      if (from.meta?.legalRoute) return 'slide-down'
      return 'fade'
    },
  },

  computed: {
    isHomePage() {
      const name = this.$router.currentRoute.value.name
      return name === 'Home' || name === 'About' || name === 'Contact'
    },
  },
  created() {
    this.loadData()

    // Progress bar + transition name on route changes
    router.beforeEach((to, from) => {
      // First scroll to top immediately
      window.scrollTo({ top: 0, behavior: 'instant' })
      // Short delay so scroll registers before the transition begins
      setTimeout(() => {
        this.routeLoading = true
        this.transitionName = this.getTransition(to, from)
      }, 80)
    })
    router.afterEach(() => {
      setTimeout(() => (this.routeLoading = false), 450)
    })
  },
  mounted() {
    this.initActiveSection()
    window.addEventListener('scroll', () => this.checkScroll())
    window.addEventListener('resize', () => this.checkScroll())
  },
  watch: {
    $route() {
      this.loadData()
      this.initActiveSection()
    },
  },
}
</script>

<style lang="scss">
@import './sass/app';
</style>
