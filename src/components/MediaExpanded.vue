<template>
    <figure class="expand-modal-content" :style="styles">
        <button class="expand-modal-close" @click="closeModal">X</button>

        <img v-if="!isVideo"
            class="expand-modal-media"
            :width="width"
            :height="height"
            :alt="alt"
            v-lazy="{ src: source, loading: thumb }" />
        <video v-else
            class="expand-modal-media"
            :width="width"
            :height="height"
            :poster="thumb"
            :alt="alt"
            playsinline autoplay loop muted controls>
                <source :src="source" type="video/mp4">
        </video>
    </figure>
</template>

<script>
export default {
    name: 'MediaExpanded',
    props: {
        source: {
            type: String,
            required: true
        },
        thumb: {
            type: String,
            required: true
        },
        alt: {
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
        isVideo: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    methods: {
        closeModal () {
            window.scrollTo(0, this.$store.getters.getModal.transform);

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
        }
    }
}
</script>