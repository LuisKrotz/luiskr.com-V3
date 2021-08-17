<template>
    <video :class="classes" playsinline autoplay loop muted :poster="poster">
        <source :src="video" type="video/mp4">
    </video>
</template>

<script>
const placeholder = '.mp4.jpg-thumb.jpg', extension = '.mp4'

export default {
  name: 'Video',
    data() {
        return {
            storage: this.$store.getters.getStorage,
            poster: '',
            video: ''
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
        label: {
            type: String,
            default: '',
            required: false
        },
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        canExpand: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    created() {
        this.poster = this.storage + this.src + placeholder;
        this.video = this.storage + this.src + extension;
    }
}
</script>