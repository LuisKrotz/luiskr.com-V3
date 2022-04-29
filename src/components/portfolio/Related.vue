<template>
    <footer class="internal-footer">
        <h2 class="internal-footer-title">
            <span v-if="translations?.title" v-html="translations.title" :key="'ttl1'"></span>
            <span v-else :key="'ttl2'">{{ loading.msg1 }}</span>
        </h2>
        <div class="internal-footer-related">
            <template v-if="translations?.projects">
                <router-link v-for="project, projectkey in translations.projects" class="internal-footer-related-link" :to="translations.path + project.link" :key="projectkey">{{ project.page }}</router-link>
            </template>
            <template v-else>
                <span v-for="n in 12" class="internal-footer-related-link" :key="n" data-nosnippet>
                    {{ loading.msg2 }}
                </span>
            </template>
        </div>

        <div class="internal-footer-items" v-if="translations?.socials">
            <template v-for="social, socialkey in translations.socials" :key="socialkey">
                <a :href="social.link" target="_blank" class="internal-footer-items-link">{{ social.network }}</a>
                <span v-if="socialkey < translations.socials.length - 1" class="internal-footer-items-separator">•</span>
            </template>

            <p class="internal-footer-items-note" v-html="translations.note"></p>
        </div>
        <div class="internal-footer-items" v-else data-nosnippet>
            <span class="internal-footer-items-link">{{ loading.msg2 }}</span>
            <p class="internal-footer-items-note">{{ loading.msg3 }}</p>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Related',
    data() {
        return {
            loading:        this.$store.getters.getlang.loading,
            translations:   {}
        }
    },
    watch: {
        '$store.state.lang.components': {
            immediate: true,
                handler() {
                this.translations = this.$store.getters.getlang.components.related
            }
        }
    }
}
</script>