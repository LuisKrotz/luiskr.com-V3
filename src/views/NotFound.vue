<template>
    <div class="not-found-decoration">
        <div v-for="n in marquee" :key="n" class="not-found-decoration-marquee" aria-hidden="true" data-no-snippet>
            <template v-for="n in 10" :key="n"> 404 </template>
        </div>
    </div>
    <div id="main" class="not-found">
        <div v-if="translations?.title">
            <h2 class="not-found-title" v-html="translations.title"></h2>
            <router-link class="not-found-link" to="/">{{ translations.link }}</router-link>
        </div>
    </div>
</template>

<script>
import { getDatabase, ref, child, get } from "firebase/database";

export default {
    data() {
        return {
            marquee:          Number,
            translations:     false
        }
    },
    name: 'Not Found',
    created() {
        let lang = this.$store.getters.getlang;

        document.title = this.$route.meta.title;

        get(child(ref(getDatabase()), lang.database + lang.locale + lang.pagesPath + this.$route.meta.translation)).then((snapshot) => {
        if (snapshot.exists()) {
            this.translations = snapshot.val();
        } else {
            console.log('%cERROR: could\'t find 404 DATA', this.$sharedData.styles.info);
        }
        }).catch((error) => {
            console.error(error);
        });
    },
    mounted() {
        this.$store.commit('setMarqueeAmount');
        this.marquee = this.$store.getters.getMarqueeAmount;

        window.addEventListener('resize', () => {
            this.$store.commit('setMarqueeAmount');
            this.marquee = this.$store.getters.getMarqueeAmount;
        }, true);
    }
}
</script>

<style lang="scss">
@import '../sass/_variables';
@import '../sass/_mixins';
@import '../sass/_placeholders';


.not-found {
    @extend %MAXAREA;

    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &-decoration {
        text-align: left;
        padding-bottom: to-rem($space-xl);
        overflow: hidden;
        box-sizing: border-box;
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        opacity: .025;

        &-marquee {
            font-family: 'Raleway', sans-serif;
            font-weight: 100;
            will-change: transform;
            width: fit-content;
            white-space: nowrap;

            font-size: to-rem($space-5xl);
            line-height: to-rem($space-5xl);

            @include layout-768() {
                font-size: to-rem($space-4xl);
                line-height: to-rem($space-4xl);
            }

            @include layout-1280() {
                font-size: to-rem($space-5xl);
                line-height: to-rem($space-5xl);
            }

            @include layout-1440() {
                font-size: to-rem($space-6xl);
                line-height: to-rem($space-6xl);
            }

            @include layout-2560() {
                font-size: to-rem($space-7xl);
                line-height: to-rem($space-7xl);
            }

            animation: marquee-keyframe 320s linear infinite;
        }
    }

    &-title {
        font-family: 'Raleway', sans-serif;
        font-weight: 100;
        font-size: to-rem($space-xl);
        letter-spacing: to-rem($space-md);
        padding-bottom: to-rem($space-lg);

        @include layout-768() {
            font-size: to-rem($space-3xl);
            letter-spacing: to-rem($space-lg);
        }

        @include layout-1024() {
            font-size: to-rem($space-4xl);
            letter-spacing: to-rem($space-xl);
            padding-bottom: to-rem($space-3xl);
        }

        @include layout-2560() {
            font-size: to-rem($space-5xl);
            letter-spacing: to-rem($space-2xl);
            padding-bottom: to-rem($space-4xl);
        }
    }

    &-link {
        font-family: 'Raleway', sans-serif;
        font-weight: 200;
        font-size: to-rem($space-lg);
        line-height: to-rem($space-xl);
        text-decoration: underline;

        @include layout-2560() {
            font-size: to-rem($space-2xl);
            line-height: to-rem($space-3xl);
        }

        &:hover,
        &:focus {
            text-decoration: line-through;
        }
    }
}
</style>