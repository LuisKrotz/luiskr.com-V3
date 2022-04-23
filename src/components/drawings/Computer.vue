
<template>
    <router-link class="portfolio-item-link" :to="link">
        <div class="portfolio-item-computer">
            <div class="portfolio-item-computer-frame">
                <div class="portfolio-item-computer-screen">
                    <div class="portfolio-item-computer-screen-image">
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
                </div>
            </div>
            <div class="portfolio-item-computer-chin"></div>
            <div class="portfolio-item-computer-stand"></div>
            <div class="portfolio-item-computer-base"></div>
        </div>
        <div class="portfolio-item-label">
            <h4 class="portfolio-item-label-title">{{ label }}</h4>
            <p class="portfolio-item-label-description" v-html="description"></p>
            <button class="portfolio-item-label-button">{{ action }} here to know more.</button>
        </div>
    </router-link>
</template>

<script>


export default {
    data() {
        return {
            viewport:   Number,
            loadext:    '-mozjpg3-MSSIM-tuned-kodak',
            mobileext:  '-mobile',
            ext:        '.jpg',
            action:     this.$store.getters.getClickOrTap
        }
    },
    name: 'Draw Computer',
    props: {
        link: {
            required: true,
            type: String
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
            required: true,
            type: String
        },
        width: {
            required: true,
            type: Array
        },
        height: {
            required: true,
            type: Array
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

