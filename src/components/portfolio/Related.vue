<template>
    <footer class="project-footer">
        <h2 class="project-footer-title">PROJECTS</h2>
        <div class="project-footer-related">
            <router-link class="project-footer-related-link" to="/portfolio/brazilian-leather">brazilian leather</router-link>
            <router-link class="project-footer-related-link" to="/portfolio/coza">coza</router-link>
            <router-link class="project-footer-related-link" to="/portfolio/genesysinf-sageweb">genesysinf</router-link>
            <router-link class="project-footer-related-link" to="/portfolio/aboutmarco">marco almeida</router-link>
            <router-link class="project-footer-related-link" to="/portfolio/melissa">melissa</router-link>
            <router-link class="project-footer-related-link" to="/portfolio/metcha">metcha</router-link>
            <router-link class="project-footer-related-link" to="/portfolio/minimelissa">minimelissa</router-link>
            <router-link class="project-footer-related-link" to="/portfolio/mor">mor</router-link>
            <router-link class="project-footer-related-link" to="/portfolio/transa">transa</router-link>
            <router-link class="project-footer-related-link" to="/portfolio/vibra">vibra</router-link>
        </div>

        <div class="project-footer-contact">
            <a class="project-footer-contact-link">Mail</a>
            <span class="project-footer-contact-separator">•</span>
            <a class="project-footer-contact-link">Linkedin</a>
            <span class="project-footer-contact-separator">•</span>
            <a class="project-footer-contact-link">Github</a>
            <span class="project-footer-contact-separator">•</span>
            <a class="project-footer-contact-link">Instagram</a>
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