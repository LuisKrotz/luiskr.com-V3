<template>
  <div>
    <div class="nav">
      <router-link class="nav-link" v-if="$router.currentRoute.value.name !== 'Home'" to="/">Luis Krötz</router-link>
      <button class="nav-link active" v-else @click="scrollTop()">Luis Krötz</button>
    </div>
    <transition name="fade">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'App',
    methods: {
      scrollTop() {
          this.$smoothScroll({
            duration: 1000,
            updateHistory: true,
            scrollTo: 0,
            hash: ''
          })
      }
    }
}
</script>

<style lang="scss">
@import './sass/app';
</style>
