<template>
    <div class="expand-modal-content">
        <div class="expand-modal-close-bar">
            <button class="expand-modal-close-bar-button" @click="closeModal">{{ translations.close }}</button>
        </div>
        <div class="expand-modal-close-area" @click="closeModal"></div>
        <figure class="expand-modal-media-figure">
            <img decoding="async" class="expand-modal-media-placeholder" :src="placeholder(width, height)" :width="width" :height="height" aria-hidden="true" tabindex="-1" data-nosnippet/>

            <img decoding="async" v-if="!isVideo"
                class="expand-modal-media-item"
                :width="width"
                :height="height"
                :alt="alt"
                :src="source"
                v-lazy="{ src: source, loading: thumb }" />
            <video decoding="async"  v-else
                class="expand-modal-media-item"
                :width="width"
                :height="height"
                :poster="thumb"
                :alt="alt"
                playsinline autoplay loop muted controls>
                    <source :src="source" type="video/mp4">
            </video>

            <button class="expand-modal-close-bottom" @click="closeModal">{{ translations.close }}</button>
        </figure>
    </div>
</template>

<script>
export default {
    name: 'MediaExpanded',
    data() {
        return {
            translations:       this.$store.getters.getlang.components.media
        }
    },
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
        placeholder(width, height) {
            return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" %3E%3C/svg%3E`;
        },
        closeModal () {
            const scroll = this.$store.getters.getModal.transform;

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