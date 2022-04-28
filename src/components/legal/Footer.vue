<template>
    <footer class="internal-footer">
        <div class="internal-footer-items" v-if="translations">
            <template v-for="item, n in translations.links" :key="n">
                <router-link class="contact-other-link" :to="item.link">{{ item.page }}</router-link>
                <span v-if="n < translations.links.length - 1" class="contact-other-separator">•</span>
            </template>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Legal',
    data() {
        return {
            translations:   this.$store.getters.getlang.components['legal-footer']
        }
    }
}
</script>