<template>
    <div id="#main" class="not-found">
        <h2 class="not-found-title">Looks like someone's lost here.</h2>
        <router-link class="not-found-link" to="/">Click here to go to the main page.</router-link>
    </div>
</template>

<script>

export default {
    name: 'Not Found',
    created() {
        document.title = this.$route.meta.title;
    },
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

    &-title {
        font-family: 'Raleway', sans-serif;
        font-weight: 700;
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