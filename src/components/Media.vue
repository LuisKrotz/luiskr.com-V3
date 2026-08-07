<template>
    <figure :class="canExpand ? 'internal-expand': ''"
            @click="openModal"
            :style="styles" :title="label">
        <!-- Aspect-ratio placeholder: always rendered, prevents layout shift -->
        <img decoding="async" class="render-placeholder" :src="svgPlaceholder" :width="width" :height="height" alt=" "/>

        <img decoding="async" v-if="!isVideo"
            ref="mediaImg"
            :class="'render-media ' + classes"
            :width="width"
            :height="height"
            :alt="label"
            :src="imgSrc" />

        <!-- autoPlay video: source loaded eagerly (always visible hero) -->
        <video v-else-if="autoPlay"
            ref="mediaVideo"
            :class="'render-media ' + classes"
            :poster="videoPoster"
            :width="width"
            :height="height"
            :alt="label"
            playsinline loop muted autoplay>
            <source :src="videoSrcMain" type="video/mp4">
        </video>

        <!-- Hover/interaction video: lazy source, observer-controlled play/pause -->
        <video v-else
            ref="mediaVideo"
            :class="'render-media ' + classes"
            :poster="videoPoster"
            :width="width"
            :height="height"
            :alt="label"
            playsinline loop muted
            @mousedown="play($event)"
            @mouseover="play($event)"
            @mouseenter="play($event)"
            @mouseout="pause($event)"
            @mouseleave="pause($event)">
            <source ref="videoSource" :src="videoSrc" type="video/mp4">
        </video>

        <template v-if="canExpand">
            <button v-for="n = 1 in 2" :class="'expand-modal-open-' + n" :key="n" :aria-hidden="(n === 2 ? true : false)" data-no-snippet>{{ action }} {{ translations?.toOpen }}</button>
        </template>
    </figure>
</template>

<script>
const   moz = '-mozjpg',
        extension = '.jpg',
        vidPlaceholderExt = '.mp4.jpg-thumb.jpg',
        scale = '.mp4-scaledown-2x',
        videoExtension = '.mp4';

// How far before the viewport to start loading
const IMG_ROOT_MARGIN    = '300px';
const VID_ROOT_MARGIN    = '200px';
const VID_PLAY_THRESHOLD = 0.5;   // fraction visible to trigger play

export default {
    name: 'Media',
    data() {
        return {
            storage:         this.$store.getters.getStorage,
            thumbSuffix:     moz + '3-MSSIM-tuned-kodak' + extension,
            q50Suffix:       moz + '-50' + extension,
            q100Suffix:      moz + '-uncompressed' + extension,
            styles:          '',
            poster:          [],
            video:           [],
            videoSrc:        '',    // empty until observer fires (non-autoplay only)
            // Image progressive loading state:
            // null  → placeholder SVG (no network request)
            // thumb → tiny mozjpg thumbnail
            // q50   → medium quality
            // q100  → full quality
            imgSrc:          '',
            action:          this.$store.getters.getClickOrTap,
            translations:    this.$store.getters.getlang.components?.media ?? {},
            _imgObserver:    null,
            _vidObserver:    null,
            _vidPlayObserver:null,
        };
    },
    props: {
        classes:  { type: String,  default: '',    required: false },
        src:      { type: String,  required: true  },
        label:    { type: String,  default: '',    required: false },
        width:    { type: Number,  required: true  },
        height:   { type: Number,  required: true  },
        canExpand:{ type: Boolean, default: false,  required: false },
        isVideo:  { type: Boolean, default: false,  required: false },
        autoPlay: { type: Boolean, default: false,  required: false },
    },
    computed: {
        // Inline SVG placeholder preserving aspect ratio — zero network cost
        svgPlaceholder() {
            return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}"%3E%3C/svg%3E`;
        },
        // Computed video src/poster — always a string, never undefined
        videoSrcMain() {
            return this.video.length >= 2 ? this.video[1] : '';
        },
        videoPoster() {
            return this.poster.length >= 1 ? this.poster[0] : '';
        },
    },
    created() {
        if (this.isVideo) {
            const base = this.storage + this.src;
            const urls = [
                [base + vidPlaceholderExt,            base + videoExtension],
                [base + scale + vidPlaceholderExt,    base + scale + videoExtension],
            ];
            this.poster = urls.map(a => a[0]);
            this.video  = urls.map(a => a[1]);
        } else {
            // Start with empty src — render-placeholder SVG holds the space.
            // IntersectionObserver will upgrade to thumb → q50 → q100.
            this.imgSrc = '';
        }
    },
    mounted() {
        if (this.canExpand) this.styles = { position: 'relative' };

        if (this.isVideo) {
            if (this.autoPlay) {
                // Force play after DOM is ready — HTML autoplay attribute can be
                // silently suppressed by browser autoplay policies even for muted videos.
                this.$nextTick(() => {
                    const vid = this.$refs.mediaVideo;
                    if (!vid) return;
                    vid.load();
                    vid.play().catch(() => {
                        // Autoplay blocked (e.g. data saver, power saver mode) — silently ignore
                    });
                });
            } else {
                this._setupVideoObservers();
            }
        } else {
            this._setupImageObserver();
        }
    },
    beforeUnmount() {
        this._disconnectObservers();
    },
    methods: {
        // ── Placeholder ───────────────────────────────────────────────────
        placeholder(w, h) {
            return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"%3E%3C/svg%3E`;
        },

        // ── Image lazy loading ─────────────────────────────────────────────
        _setupImageObserver() {
            if (!('IntersectionObserver' in window)) {
                this._loadProgressive();
                return;
            }
            this._imgObserver = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        this._loadProgressive();
                        this._imgObserver.disconnect();
                        this._imgObserver = null;
                        break;
                    }
                }
            }, { rootMargin: IMG_ROOT_MARGIN, threshold: 0 });

            if (this.$refs.mediaImg) {
                this._imgObserver.observe(this.$refs.mediaImg);
            }
        },

        // Progressive: blank → thumb → q50 → q100
        _loadProgressive() {
            const thumbUrl = this.storage + this.src + this.thumbSuffix;
            const q50Url   = this.storage + this.src + this.q50Suffix;
            const q100Url  = this.storage + this.src + this.q100Suffix;

            // Step 1: show thumb immediately (tiny file, ~1-3 KB)
            this.imgSrc = thumbUrl;

            // Step 2: load q50 in background, swap when ready
            const imgQ50 = new Image();
            imgQ50.onload = () => {
                this.imgSrc = q50Url;
                // Step 3: load q100 in background, swap when ready
                const imgQ100 = new Image();
                imgQ100.onload = () => { this.imgSrc = q100Url; };
                imgQ100.src = q100Url;
            };
            imgQ50.src = q50Url;
        },

        // ── Video lazy loading (non-autoPlay only) ─────────────────────────
        _setupVideoObservers() {
            if (!('IntersectionObserver' in window)) {
                this.videoSrc = this.video[1];
                return;
            }

            // Load source when near-viewport
            this._vidObserver = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        this.videoSrc = this.video[1];
                        this._vidObserver.disconnect();
                        this._vidObserver = null;
                        break;
                    }
                }
            }, { rootMargin: VID_ROOT_MARGIN, threshold: 0 });

            // Play/pause on 50% visibility
            this._vidPlayObserver = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    const vid = this.$refs.mediaVideo;
                    if (!vid) break;
                    if (entry.isIntersecting && this.videoSrc) {
                        vid.play().catch(() => {});
                    } else {
                        vid.pause();
                    }
                }
            }, { threshold: VID_PLAY_THRESHOLD });

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

        // ── Modal ──────────────────────────────────────────────────────────
        openModal() {
            if (!this.canExpand) return;
            const y = window.scrollY;
            this.$store.commit('setModal', {
                transform: y,
                class: 'modal-open',
                open: true,
                media: {
                    source:  this.isVideo ? this.video[0] : this.storage + this.src + this.q100Suffix,
                    thumb:   this.isVideo ? this.poster[0] : this.storage + this.src + this.thumbSuffix,
                    alt:     this.label,
                    width:   this.width,
                    height:  this.height,
                    isVideo: this.isVideo,
                },
            });
            window.scrollTo(0, 0);
        },

        play(e)  { e.target.play(); },
        pause(e) { e.target.pause(); },
    },
};
</script>