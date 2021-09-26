<template>
    <footer class="internal-footer">
        <div class="internal-footer-items">
            <router-link class="contact-other-link" to="/">Home</router-link>
            <span class="contact-other-separator">•</span>
            <router-link class="contact-other-link" to="/privacy-policy">Privacy Policy</router-link>
            <span class="contact-other-separator">•</span>
            <router-link class="contact-other-link" to="/GDPR">GDPR</router-link>
            <span class="contact-other-separator">•</span>
            <router-link class="contact-other-link" to="/terms-of-use">Terms of use</router-link>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'About Footer'
}
</script>