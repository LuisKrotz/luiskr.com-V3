<template>
  <artigo id="#main" class="legal">
    <h2 class="internal-title">GDPR</h2>
    <section class="internal-description">
      <h3 class="internal-description-text">Data Protection Rights</h3>
      <p class="internal-description-text">I would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
      <p class="internal-description-text"><strong>The right to access</strong> – You have the right to request copies of your data. I do not store any data, I'm happy to share any data from Google analytics collected if needed, no personal data is stored on this website.</p>
      <p class="internal-description-text"><strong>The right to rectification</strong> – You have the right to request that I correct any information you believe is inaccurate. You also have the right to request that I complete the information you believe is incomplete.</p>
      <p class="internal-description-text"><strong>The right to erasure</strong> – You have the right to request that any website erase your data, under certain conditions. I don't store any personal data.</p>
      <p class="internal-description-text"><strong>The right to restrict processing</strong> – You have the right to request that I restrict the processing of your data, under certain conditions. I don't store any personal data to be processed.</p>
      <p class="internal-description-text"><strong>The right to object to processing</strong> – You have the right to object to my processing of your data, under certain conditions. I don't store any personal data.</p>
      <p class="internal-description-text"><strong>The right to data portability</strong> – You have the right to request that I transfer the data that I have collected to another organization, or directly to you, under certain conditions. I'm happy to share any data from Google analytics collected if needed, no personal data is stored on this website.</p>
      <p class="internal-description-text">If you make a request, I have one month to respond to you. If you would like to exercise any of these rights, please contact me at <a href="mailto:luis.krotz@gmail.com">luis.krotz@gmail.com</a></p>
    </section>
    <Footer />
  </artigo>
</template>

<script>
import Footer from'../../components/abouts/Footer'

export default {
  components: {
    Footer
  },
  created() {
    document.title = this.$route.meta.title;
  },
  name: 'GDPR',
}
</script>

<style lang="scss">
@import '../../sass/internals';
</style>