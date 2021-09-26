<template>
    <figure v-if="canExpand" @click="openModal" :style="styles">
        <img v-if="!isVideo"
            :class="classes"
            :width="width"
            :height="height"
            v-lazy="{src: storage + src + q50, loading: storage + src + thumb }" />
        <video v-else
            :class="classes"
            :poster="poster[0]"
            :width="width"
            :height="height"
            playsinline autoplay loop muted>
                <source :src="video[1]" type="video/mp4">
        </video>
        <label v-if="label !== ''">{{ label }}</label>

        <button class="expand-modal-open" @click="openModal">Tap to open</button>
    </figure>
    <figure v-else :style="styles">
        <img v-if="!isVideo"
            :class="classes"
            :width="width"
            :height="height"
            v-lazy="{src: storage + src + q50, loading: storage + src + thumb }" />
        <video v-else
            :class="classes"
            :poster="poster[0]"
            :width="width"
            :height="height"
            playsinline autoplay loop muted>
                <source :src="video[0]" type="video/mp4">
        </video>
        <label v-if="label !== ''">{{ label }}</label>
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
                video:              []
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
        }
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
            }
    },
    methods: {
        openModal () {
            let y = window.scrollY;

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
        }
    }
}
</script>