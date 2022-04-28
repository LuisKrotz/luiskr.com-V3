<template>
    <div class="not-found-decoration">
        <div v-for="n in marquee" :key="n" class="not-found-decoration-marquee" aria-hidden="true" data-no-snippet>
            <template v-for="n in 10" :key="n"> 404 </template>
        </div>
    </div>
    <div id="#main" class="not-found">

        <div>
            <h2 class="not-found-title">{{ translations.title }}</h2>
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
            console.log('ERROR: could\'t find data at');
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
        padding-bottom: to-rem($F8);
        overflow: hidden;

        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        opacity: .025;

        &-marquee {
            font-family: 'Black Ops One', monospace;
            font-size: to-rem($F8);
            will-change: transform;
            width: fit-content;
            white-space: nowrap;

            font-size: to-rem($F12);
            line-height: to-rem($F12);

            @include layout-768() {
                font-size: to-rem($F11);
                line-height: to-rem($F11);
            }

            @include layout-1280() {
                font-size: to-rem($F12);
                line-height: to-rem($F12);
            }

            @include layout-1440() {
                font-size: to-rem($F13);
                line-height: to-rem($F13);
            }

            @include layout-2560() {
                font-size: to-rem($F14);
                line-height: to-rem($F14);
            }

            animation: marquee-keyframe 320s linear infinite;
        }
    }

    &-title {
        font-family: 'Black Ops One', monospace;
        font-size: to-rem($F8);
        letter-spacing: to-rem($F6);
        padding-bottom: to-rem($F7);

        @include layout-768() {
            font-size: to-rem($F10);
            letter-spacing: to-rem($F7);
        }

        @include layout-1024() {
            font-size: to-rem($F11);
            letter-spacing: to-rem($F8);
            padding-bottom: to-rem($F10);
        }

        @include layout-2560() {
            font-size: to-rem($F12);
            letter-spacing: to-rem($F9);
            padding-bottom: to-rem($F11);
        }
    }

    &-link {
        font-family: 'Montserrat Alternates', sans-serif;
        font-size: to-rem($F7);
        line-height: to-rem($F8);
        text-decoration: underline;

        @include layout-2560() {
            font-size: to-rem($F9);
            line-height: to-rem($F10);
        }

        &:hover,
        &:focus {
            text-decoration: line-through;
        }
    }
}
</style>