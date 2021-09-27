<template>
    <div class="expand-modal-content">
            <div class="expand-modal-close-bar">
        <button class="expand-modal-close-bar-button" @click="closeModal">[ close ]</button>
    </div>
        <div class="expand-modal-close-area" @click="closeModal"></div>
        <figure>
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
        <button class="expand-modal-close-bottom" @click="closeModal">[ close ]</button>
    </div>
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
            let scroll = this.$store.getters.getModal.transform

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
        }
    }
}
</script>