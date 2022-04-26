<template>
  <div :class="modal.class" v-if="translations">
    <div v-if="modal.class === ''" class="nav">
      <router-link class="nav-link back" v-if="$router.currentRoute.value.name !== 'Home'" to="/">{{ translations.title }}</router-link>
      <button class="nav-link active" v-else @click="scrollTop()">{{ translations.title }}</button>

      <div v-if="$router.currentRoute.value.name !== 'Not Found'">
        <router-link class="nav-link" v-if="$router.currentRoute.value.name !== 'About'" :to="translations.about.link">{{ translations.about.description }}</router-link>
        <button class="nav-link active" v-else @click="scrollTop()">{{ translations.about.description }}</button>
        <span class="nav-separator">{{ !onBottom ? '|' : '▲' }} </span>

        <button v-if="!onBottom" class="nav-link scroll-down" @click="scrollBottom()">
          <template v-if="$router.currentRoute.value.name === 'Home' || $router.currentRoute.value.name === 'About'">{{ translations.contact }}</template>
          <template v-else>{{ translations.related }}</template>
        </button>
        <button v-else class="nav-link scroll-up" @click="scrollTop()">{{ translations.scrollup }}</button>
      </div>
    </div>
    <div v-else @click="closeModal()" class="nav">
      <button class="nav-link" @click="scrollTop()">{{ translations.title }}</button>
    </div>

    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <aside v-if="translations && !renderCookies" class="cookies">
    <p class="cookies-info" v-html="translations.cookies.message"></p>
    <div class="cookies-buttons">
      <button class="cookies-buttons-accept" @click="cookieAction(true)">{{ translations.cookies.accept }}</button>
      <button class="cookies-buttons-refuse" @click="cookieAction(false)">{{ translations.cookies.refuse }}</button>
    </div>
  </aside>
</template>

<script>
  const cookie = 'cookie',
        cookieEvent = 'cookieAction';

  export default {
    name: 'App',
    data() {
      return {
        modal:          this.$store.getters.getModal,
        onBottom:       false,
        renderCookies:  false,
        translations:   false
      }
    },
    methods: {
      checkScroll() {
          if (document.body.scrollHeight - window.scrollY<= window.innerHeight + 200) {
            this.onBottom = true;
          } else {
            this.onBottom = false;
          }
      },
      closeModal () {
        let scroll = this.$store.getters.getModal.transform;

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
                isVideo: undefined
            }
        });

        window.requestAnimationFrame(()=> {
            window.scrollTo(0, scroll);
        });
      },
      cookieAction(state) {
        console.log(state)
          localStorage.setItem(cookie, state);

          document.dispatchEvent(new Event(cookieEvent));

          setTimeout(() => this.renderCookies = true, 2000);
      },
      scrollBottom() {
        this.$smoothScroll({
          duration: 1000,
          updateHistory: true,
          scrollTo: document.body.scrollHeight,
          hash: ''
        })
      },
      scrollTop() {
          this.$smoothScroll({
            duration: 1000,
            updateHistory: true,
            scrollTo: 0,
            hash: ''
          })
      }
  },
  created() {
    // Default locale EN
    this.$store.commit('setLang', this.$store.getters.getlang.locale);
    this.renderCookies = JSON.parse(localStorage.getItem(cookie));

    let lang = this.$store.getters.getlang;

    fetch(`${lang.prefix}/app${lang.suffix}`)
    .then((response) => {
      return response.json();
    }).then((data) => {
        this.translations = data;

        this.$store.commit('setClickOrTap', {
          click: data.actions.click,
          tap: data.actions.tap,
      });
    });
  },
  mounted() {
    window.addEventListener('scroll', () => this.checkScroll());
    window.addEventListener('resize', () => this.checkScroll());
  }
}
</script>

<style lang="scss">
@import './sass/app';
</style>
