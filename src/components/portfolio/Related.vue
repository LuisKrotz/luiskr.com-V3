<template>
    <footer class="internal-footer">
        <h2 class="internal-footer-title">Related</h2>
        <div class="internal-footer-related">
            <router-link class="internal-footer-related-link" to="/portfolio/brazilian-leather">brazilian leather</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/coza">coza</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/genesysinf-sageweb">genesysinf</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/aboutmarco">marco almeida</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/melissa">melissa</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/metcha">metcha</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/minimelissa">minimelissa</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/mor">mor</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/transa">transa</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/vibra">vibra</router-link>
        </div>

        <div class="internal-footer-items">
            <a class="internal-footer-items-link">Mail</a>
            <span class="internal-footer-items-separator">•</span>
            <a class="internal-footer-items-link">Linkedin</a>
            <span class="internal-footer-items-separator">•</span>
            <a class="internal-footer-items-link">Github</a>
            <span class="internal-footer-items-separator">•</span>
            <a class="internal-footer-items-link">Instagram</a>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Related',
    data() {
        return {
            modal: this.$store.getters.getModal
        }
    },
}
</script>