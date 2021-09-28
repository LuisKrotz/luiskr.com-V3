<template>
    <div id="#main" class="not-found">
        <h2 class="internal-title">NOT FOUND</h2>
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
@import '../sass/internals';
</style>