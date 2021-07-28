<template>
    <video :class="classes" playsinline autoplay loop muted controls :poster="storage + poster">
        <source :src="storage + src" type="video/mp4">
      </video>
</template>

<script>
export default {
  name: 'Video',
    data() {
        return {
            storage: this.$store.getters.getStorage
        }
    },
  props: {
        classes: {
            type: String,
            default: '',
            required: false
        },
        src: {
            type: String,
            default: '',
            required: true
        },
        poster: {
            type: String,
            default: '',
            required: true
        }
  }
}
</script>