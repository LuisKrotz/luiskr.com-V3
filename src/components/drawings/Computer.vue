
<template>
    <router-link class="portfolio-item-link" :to="link">
        <div class="portfolio-item-computer">
            <div class="portfolio-item-computer-frame">
                <div class="portfolio-item-computer-screen">
                    <div v-if="image!== undefined" class="portfolio-item-computer-screen-image">
                        <template v-for="n = 1 in 2" :key="n">
                            <img v-if="viewport >= 640" :class="'portfolio-item-computer-screen-image-item-' + n"
                                v-lazy="{src: image + ext, loading: image + loadext + ext}"
                                :src="image + ext"
                                :alt="label"
                                :width="width[0]"
                                :height="height[0]" />
                            <img v-else :class="'portfolio-item-computer-screen-image-item-' + n"
                                v-lazy="{src: image + mobileext +  ext, loading: image + loadext + mobileext + ext}"
                                :src="image + mobileext +  ext"
                                :alt="label"
                                :width="width[1]"
                                :height="height[1]" />
                        </template>
                    </div>
                    <div v-else class="portfolio-item-computer-screen-image">
                        <LoadSVG :classes="'load-svg'" :renderText="false"/>
                    </div>
                </div>
            </div>
            <div class="portfolio-item-computer-chin"></div>
            <div class="portfolio-item-computer-stand"></div>
            <div class="portfolio-item-computer-base"></div>
        </div>
        <div class="portfolio-item-label">
            <h4 class="portfolio-item-label-title">{{ label }}</h4>
            <p class="portfolio-item-label-description" v-html="description"></p>
            <button class="portfolio-item-label-button" v-if="transitions">{{ action }} {{ translations.action }}</button>
        </div>
    </router-link>
</template>

<script>
import LoadSVG  from'../LoadSVG';

export default {
    data() {
        return {
            viewport:       Number,
            loadext:        '-mozjpg3-MSSIM-tuned-kodak',
            mobileext:      '-mobile',
            ext:            '.jpg',
            action:         this.$store.getters.getClickOrTap,
            translations:   false
        }
    },
    name: 'Draw Computer',
    components: {
        LoadSVG
    },
    props: {
        link: {
            required: false,
            type: String,
            default: '/'
        },
        label: {
            required: true,
            type: String
        },
        description: {
            required: true,
            type: String
        },
        image: {
            required: false,
            type: String
        },
        width: {
            required: false,
            type: Array
        },
        height: {
            required: false,
            type: Array
        }
    },
    watch: {
        '$store.state.lang.components': {
            immediate: true,
                handler() {
                this.translations = this.$store.getters.getlang.components.draw
            }
        }
    },
    created() {
        let link = document.createElement("link");

        link.rel="preload",
        link.as="image";

        link.href = this.image + this.loadext + (window.innerWidth >= 640 ? '' : this.mobileext) + this.ext;

        document.getElementsByTagName('head')[0].appendChild(link);
    },
    mounted() {
        this.setViewport();

        window.addEventListener('resize', this.setViewport, false);
    },
    methods: {
        setViewport() {
            this.viewport = window.outerWidth;
        }
    }
}
</script>

