<template>
    <footer class="internal-footer" v-if="translations">
        <h2 class="internal-footer-title">{{ translations.title }}</h2>
        <div class="internal-footer-related">
            <router-link v-for="project, key in translations.projects" class="internal-footer-related-link" :to="translations.path + project.link" :key="key">{{ project.page }}</router-link>
        </div>

        <div class="internal-footer-items">
            <template v-for="social, key in translations.socials" :key="key">
                <a :href="social.link" target="_blank" class="internal-footer-items-link">{{ social.network }}</a>
                <span v-if="n < translations.line1.length - 1" class="internal-footer-items-separator">•</span>
            </template>

            <p class="internal-footer-items-note" v-html="translations.note"></p>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Related',
    data() {
        return {
            translations:   false
        }
    },
    created() {
        let lang = this.$store.getters.getlang;

        fetch(`${lang.prefix}/components/related${lang.suffix}`)
        .then((response) => {
            return response.json();
        }).then((data) => {
            this.translations = data;
        });
    }
}
</script>