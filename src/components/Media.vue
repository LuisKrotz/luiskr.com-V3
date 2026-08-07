<template>
    <figure :class="canExpand ? 'internal-expand': ''"
            @click="openModal"
            :style="styles" :title="label">
        <img decoding="async" class="render-placeholder" :src="placeholder(width, height)" :width="width" :height="height" alt=" "/>

        <img decoding="async" v-if="!isVideo"
            ref="mediaImg"
            :class="'render-media ' + classes"
            :width="width"
            :height="height"
            :alt="label"
            :src="lowSrc" />
        <video decoding="async" v-else-if="autoPlay"
            ref="mediaVideo"
            :class="'render-media ' + classes"
            :poster="poster[0]"
            :width="width"
            :height="height"
            :alt="label"
            playsinline loop muted autoplay>
            <source :src="videoSrcLoaded ? video[1] : ''" type="video/mp4">
        </video>
        <video decoding="async" v-else
            ref="mediaVideo"
            :class="'render-media ' + classes"
            :poster="poster[0]"
            :width="width"
            :height="height"
            :alt="label"
            playsinline loop muted>
            <source :src="videoSrcLoaded ? video[1] : ''" type="video/mp4">
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

// Margin before the element enters the viewport to start loading
const IMG_ROOT_MARGIN  = '300px';
const VID_ROOT_MARGIN  = '200px';
const VID_PLAY_THRESHOLD = 0.5; // 50% visible to auto-play

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
            lowSrc:             '',         // starts as placeholder SVG, upgraded on intersection
            videoSrcLoaded:     false,      // whether video <source> src has been set
            action:             this.$store.getters.getClickOrTap,
            translations:       this.$store.getters.getlang.components.media,
            _imgObserver:       null,
            _vidObserver:       null,
            _vidPlayObserver:   null,
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
            const video = this.storage + this.src;
            const urls = [
                [video + placeholder, video + videoExtension],
                [video + scale + placeholder, video + scale + videoExtension]
            ];
            this.poster = urls.map((arr) => arr[0]);
            this.video  = urls.map((arr) => arr[1]);
        } else {
            // Show a tiny thumb as initial src (avoids blank)
            this.lowSrc = this.storage + this.src + this.thumb;
        }
    },
    mounted() {
        if (this.canExpand)
            this.styles = { position: 'relative' };

        if (this.isVideo) {
            this._setupVideoObservers();
        } else {
            this._setupImageObserver();
        }
    },
    beforeUnmount() {
        this._disconnectObservers();
    },
    methods: {
        placeholder(width, height) {
            return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"%3E%3C/svg%3E`;
        },

        // ── Image lazy loading ──────────────────────────────────────────────
        _setupImageObserver() {
            if (!('IntersectionObserver' in window)) {
                // Fallback: load immediately
                this._loadHighResImage();
                return;
            }

            this._imgObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this._loadHighResImage();
                        this._imgObserver.disconnect();
                        this._imgObserver = null;
                    }
                });
            }, { rootMargin: IMG_ROOT_MARGIN, threshold: 0 });

            if (this.$refs.mediaImg) {
                this._imgObserver.observe(this.$refs.mediaImg);
            }
        },

        _loadHighResImage() {
            const hq = this.storage + this.src + this.q50;
            const img = new Image();
            img.onload = () => {
                this.lowSrc = hq;
                // Once medium quality loaded, fetch uncompressed
                const uhq = new Image();
                uhq.onload = () => { this.lowSrc = this.storage + this.src + this.q100; };
                uhq.src = this.storage + this.src + this.q100;
            };
            img.src = hq;
        },

        // ── Video lazy loading ──────────────────────────────────────────────
        _setupVideoObservers() {
            if (!('IntersectionObserver' in window)) {
                this.videoSrcLoaded = true;
                return;
            }

            // Load the source file when near-viewport
            this._vidObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.videoSrcLoaded = true;
                        this._vidObserver.disconnect();
                        this._vidObserver = null;
                    }
                });
            }, { rootMargin: VID_ROOT_MARGIN, threshold: 0 });

            // For non-autoplay videos: play/pause on visibility
            if (!this.autoPlay) {
                this._vidPlayObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const vid = this.$refs.mediaVideo;
                        if (!vid) return;
                        if (entry.isIntersecting && this.videoSrcLoaded) {
                            vid.play().catch(() => {});
                        } else {
                            vid.pause();
                        }
                    });
                }, { threshold: VID_PLAY_THRESHOLD });
            }

            this.$nextTick(() => {
                const vid = this.$refs.mediaVideo;
                if (vid) {
                    this._vidObserver?.observe(vid);
                    this._vidPlayObserver?.observe(vid);
                }
            });
        },

        _disconnectObservers() {
            this._imgObserver?.disconnect();
            this._vidObserver?.disconnect();
            this._vidPlayObserver?.disconnect();
        },

        // ── Modal ───────────────────────────────────────────────────────────
        openModal() {
            if (!this.canExpand) return;
            const win = window;
            const y = win.scrollY;
            this.$store.commit('setModal', {
                transform: y,
                class: 'modal-open',
                open: true,
                media: {
                    source:  this.isVideo ? this.video[0] : this.storage + this.src + this.q100,
                    thumb:   this.isVideo ? this.poster[0] : this.storage + this.src + this.thumb,
                    alt:     this.label,
                    width:   this.width,
                    height:  this.height,
                    isVideo: this.isVideo
                }
            });
            win.scrollTo(0, 0);
        },

        // kept for template compatibility (legacy hover events replaced by observer)
        play(e)  { e.target.play(); },
        pause(e) { e.target.pause(); }
    }
}
</script>