
<template>
    <router-link class="portfolio-item-link" :to="link">
        <div class="portfolio-item-computer">
            <div class="portfolio-item-computer-frame">
            <div class="portfolio-item-computer-screen">
                <div class="portfolio-item-computer-screen-image">
                    <span class="portfolio-item-computer-screen-image-toggle-1">Show More</span>
                    <img class="portfolio-item-computer-screen-image-toggle-2"  :alt="label" v-lazy="{src: image, loading: loadingimage }"/>
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
        loadingimage: {
            required: true,
            type: String
        }
    }
}
</script>

