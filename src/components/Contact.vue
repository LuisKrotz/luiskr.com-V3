<template>
    <footer class="contact">
      <h2 id="contact" class="contact-title" ref="contact">Contact</h2>
      <div class="contact-social">
        <a href="mailto:luis.krotz@gmail.com" target="_blank" class="contact-social-link">Mail</a>
        <span class="contact-social-separator">•</span>
        <a href="tel:+55(51)982-274-782" target="_blank" class="contact-social-link">Phone</a>
        <span class="contact-social-separator">•</span>
        <a href="https://www.linkedin.com/in/luis-kr%C3%B6tz" target="_blank" class="contact-social-link">Linkedin</a>
        <span class="contact-social-separator">•</span>
        <a href="https://github.com/LuisKrotz" target="_blank" class="contact-social-link">Github</a>
        <span class="contact-social-separator">•</span>
        <a href="https://www.instagram.com/j_luiskrotz" target="_blank" class="contact-social-link">Instagram</a>
      </div>
      <div class="contact-other">
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
  name: 'Contact',
}
</script>


<style lang="scss">
@import '../sass/contact';
</style>