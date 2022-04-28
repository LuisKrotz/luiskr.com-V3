<template>
    <footer class="internal-footer" v-if="translations">
        <h2 class="internal-footer-title">{{ translations.title }}</h2>
        <div class="internal-footer-related">
            <router-link v-for="project, projectkey in translations.projects" class="internal-footer-related-link" :to="translations.path + project.link" :key="projectkey">{{ project.page }}</router-link>
        </div>

        <div class="internal-footer-items">
            <template v-for="social, socialkey in translations.socials" :key="socialkey">
                <a :href="social.link" target="_blank" class="internal-footer-items-link">{{ social.network }}</a>
                <span v-if="socialkey < translations.socials.length - 1" class="internal-footer-items-separator">•</span>
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
            translations:   this.$store.getters.getlang.components.related
        }
    }
}
</script>