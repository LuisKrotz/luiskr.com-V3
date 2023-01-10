<template>
    <figure :class="canExpand ? 'internal-expand': ''"
            @click="openModal"
            :style="styles" :title="label">
        <img decoding="async" class="render-placeholder" :src="placeholder(width, height)" :width="width" :height="height" alt=" "/>

        <img decoding="async" v-if="!isVideo"
            :class="'render-media ' + classes"
            :width="width"
            :height="height"
            :alt="label"
            :src="storage + src + q100"
            v-lazy="{src: storage + src + q50, loading: storage + src + thumb }" />
        <video decoding="async"  v-else-if="autoPlay"
            :class="'render-media ' + classes"
            :poster="poster[0]"
            :width="width"
            :height="height"
            :alt="label"
            playsinline loop muted autoplay>
            <source :src="video[1]" type="video/mp4">
        </video>
        <video decoding="async"  v-else
            :class="'render-media ' + classes"
            :poster="poster[0]"
            :width="width"
            :height="height"
            :alt="label"
            playsinline loop muted
            @mousedown="play($event)"
            @mouseover="play($event)"
            @mouseenter="play($event)"
            @mouseout="pause($event)"
            @mouseleave="pause($event)">
            <source :src="video[1]" type="video/mp4">
        </video>

        <template v-if="canExpand">
            <button v-for="n = 1 in 2" :class="'expand-modal-open-' + n" :key="n" :aria-hidden="(n === 2 ? true : false)" data-no-snippet>{{ action }} {{ translations.toOpen }}</button>
        </template>
    </figure>
</template>

<script>
const   moz = '-mozjpg',
        extension = '.jpg',
        placeholder = '.mp4.jpg-thumb.jpg',
        scale = '.mp4-scaledown-2x',
        videoExtension = '.mp4';

export default {
    name: 'Media',
    data() {
        return {
            storage:            this.$store.getters.getStorage,
            thumb:              moz + '3-MSSIM-tuned-kodak' + extension,
            q50:                moz + '-50' + extension,
            q100:               moz + '-uncompressed' + extension,
            high:               false,
            styles:             '',
            poster:             [],
            video:              [],
            action:             this.$store.getters.getClickOrTap,
            translations:       this.$store.getters.getlang.components.media
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
        },
        isVideo: {
            type: Boolean,
            default: false,
            required: false
        },
        autoPlay: {
            type: Boolean,
            default: false,
            required: false
        },
    },
    created() {
        if (this.isVideo) {
            let video = this.storage + this.src;

            this.poster[0] = video + placeholder;
            this.poster[1] = video + scale + placeholder;
            this.video[0] = video + videoExtension; 
            this.video[1] = video +  scale + videoExtension;
        }
    },
    mounted() {
        if (this.canExpand)
            this.styles = {
                position: 'relative'
            };
    },
    methods: {
        placeholder(width, height) {
            return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"%3E%3C/svg%3E`;
        },
        openModal() {
            if (!this.canExpand) return;

            const y = window.scrollY;

            this.$store.commit('setModal', {
                transform: y,
                class: 'modal-open',
                open: true,
                media: {
                    source: this.isVideo ? this.video[0] : this.storage + this.src + this.q100,
                    thumb: this.isVideo ? this.poster[0] : this.storage + this.src + this.thumb,
                    alt: this.label,
                    width: this.width,
                    height: this.height,
                    isVideo: this.isVideo
                }
            });

            window.scrollTo(0, 0);
        },
        play(e) {
            e.target.play();
        },
        pause(e) {
            e.target.pause();
        }
    }
}
</script>