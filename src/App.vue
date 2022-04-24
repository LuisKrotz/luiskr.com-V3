<template>
  <div :class="modal.class">
    <div v-if="modal.class === ''" class="nav">
      <router-link class="nav-link back" v-if="$router.currentRoute.value.name !== 'Home'" to="/">Luis Krötz</router-link>
      <button class="nav-link active" v-else @click="scrollTop()">Luis Krötz</button>

      <div v-if="$router.currentRoute.value.name !== 'Not Found'">
        <router-link class="nav-link" v-if="$router.currentRoute.value.name !== 'About'" to="/about">About</router-link>
        <button class="nav-link active" v-else @click="scrollTop()">About</button>
        <span class="nav-separator">{{ !onBottom ? '|' : '▲' }} </span>

        <button v-if="!onBottom" class="nav-link" @click="scrollBottom()">
          <template v-if="$router.currentRoute.value.name === 'Home' || $router.currentRoute.value.name === 'About'">Contact</template>
          <template v-else>Related</template>
        </button>
        <button v-else class="nav-link" @click="scrollTop()"> Scroll Up</button>
      </div>
    </div>
    <div v-else @click="closeModal()" class="nav">
      <button class="nav-link" @click="scrollTop()">Luis Krötz</button>
    </div>

    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>

    <aside v-if="!renderCookies" class="cookies">
      <p class="cookies-info">Hey, I'm using Google Analytics to count pageviews, this action uses cookies do whould you agree in my use of analytics to count a pageview? <small><strong>(note, I don't collect any identifiable data)</strong></small></p>
      <div class="cookies-buttons">
        <button class="cookies-buttons-accept" @click="cookieAction(true)">Sure, why not.</button>
        <button class="cookies-buttons-refuse" @click="cookieAction(false)">Maybe next time</button>
      </div>
    </aside>
  </div>
</template>

<script>
  const cookie = 'cookie',
        cookieEvent = 'cookieAction';

  export default {
    name: 'App',
    data() {
      return {
        modal: this.$store.getters.getModal,
        onBottom: false,
        renderCookies: false
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
    this.renderCookies = JSON.parse(localStorage.getItem(cookie));
  },
  mounted() {
    window.addEventListener('scroll', () => this.checkScroll());
    window.addEventListener('resize', () => this.checkScroll());

    this.$store.commit('setClickOrTap', {
      click: 'click',
      tap: 'tap'
    });

    // Default locale EN
    this.$store.commit('setLang', this.$store.getters.getlang.locale);
  }
}
</script>

<style lang="scss">
@import './sass/app';
</style>
