
<template>
    <router-link class="portfolio-item-link" :to="link">
        <div class="portfolio-item-computer">
            <div class="portfolio-item-computer-frame">
            <div class="portfolio-item-computer-screen">
                <div class="portfolio-item-computer-screen-image" :src="image">
                    <span>Show More</span>
                    <img :src="image" />
                </div>
                
            </div>
            </div>
            <div class="portfolio-item-computer-chin"></div>
            <div class="portfolio-item-computer-stand"></div>
            <div class="portfolio-item-computer-base"></div>
        </div>
        <div class="portfolio-item-label">
            <h2 class="portfolio-item-label-title">{{ label }}</h2>
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
        }
    }
}
</script>

