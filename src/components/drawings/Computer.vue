
<template>
    <router-link class="portfolio-item-link" :to="link">
        <div class="portfolio-item-computer">
            <div class="portfolio-item-computer-frame">
            <div class="portfolio-item-computer-screen">
                <div class="portfolio-item-computer-screen-image">
                    <span class="portfolio-item-computer-screen-image-toggle-1">Show More</span>
                    <img v-if="viewport >= 640" class="portfolio-item-computer-screen-image-toggle-2"
                         v-lazy="{src: image + ext, loading: image + loadext + ext}"
                         :alt="label"
                         :width="width[0]"
                         :height="height[0]" />
                    <img v-else class="portfolio-item-computer-screen-image-toggle-2"
                         v-lazy="{src: image + mobileext +  ext, loading: image + loadext + mobileext + ext}" 
                         :alt="label"
                         :width="width[1]"
                         :height="height[1]" />
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
            <button class="portfolio-item-label-button">Click here to know more.</button>
        </div>
    </router-link>
</template>

<script>


export default {
    data() {
        return {
            viewport: Number,
            loadext: '-mozjpg3-MSSIM-tuned-kodak',
            mobileext: '-mobile',
            ext: '.jpg'
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

