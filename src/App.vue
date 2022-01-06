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
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        modal: this.$store.getters.getModal,
        onBottom: false
      }
    },
    methods: {
      scrollTop() {
          this.$smoothScroll({
            duration: 1000,
            updateHistory: true,
            scrollTo: 0,
            hash: ''
          })
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
      scrollBottom() {
        this.$smoothScroll({
          duration: 1000,
          updateHistory: true,
          scrollTo: document.body.scrollHeight,
          hash: ''
        })
      },
      checkScroll() {
          if (document.body.scrollHeight - window.scrollY<= window.innerHeight + 200) {
            this.onBottom = true;
          } else {
            this.onBottom = false;
          }
      }
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
