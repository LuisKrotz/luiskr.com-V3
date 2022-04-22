<template>
    <footer class="internal-footer">
        <h2 class="internal-footer-title">Related</h2>
        <div class="internal-footer-related">
            <router-link class="internal-footer-related-link" to="/portfolio/metcha">Metcha</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/transa">Transa</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/brazilian-leather">Brazilian Leather</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/mor">Mor</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/coza">Coza</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/melissa">Melissa</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/minimelissa">Minimelissa</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/aboutmarco">Marco Almeida</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/clinica-de-desenvolvimento-nathalia-bond">Nathalia Bond</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/cecerele">Cecerelê</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/vibra">Vibra</router-link>
            <router-link class="internal-footer-related-link" to="/portfolio/genesysinf-sageweb">Genesysinf</router-link>
        </div>

        <div class="internal-footer-items">
            <a class="internal-footer-items-link" target="_blank" href="mailto:luis.krotz@gmail.com">Mail</a>
            <span class="internal-footer-items-separator">•</span>
            <a class="internal-footer-items-link" target="_blank" href="tel:+55(51)982-274-782">Phone</a>
            <span class="internal-footer-items-separator">•</span>
            <a class="internal-footer-items-link" target="_blank" href="https://www.linkedin.com/in/luis-kr%C3%B6tz">Linkedin</a>
            <span class="internal-footer-items-separator">•</span>
            <a class="internal-footer-items-link" target="_blank" href="https://github.com/LuisKrotz">Github</a>
            <span class="internal-footer-items-separator">•</span>
            <a class="internal-footer-items-link" target="_blank" href="https://www.instagram.com/j_luiskrotz">Instagram</a>
            <p class="internal-footer-items-note">All media on this domain was taken by screenshots from public URLs and/or local development data.<br>The current website or origin of the media may have changed or may change in the future.</p>
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