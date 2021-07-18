<template>
  <div class="about">
    <div>
      <video class="portfolio-cover" playsinline autoplay loop muted>
        <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
      </video>
      <h1 style="font-size: 180px; color: white; font-weight: 900;">Marco Almeida</h1>
    </div>
    <router-view/>
  </div>
  <div>INTERNAL FOOTER
    <ul>
      <li><router-link to="/portfolio/metcha">metcha</router-link></li>
      <li><router-link to="/portfolio/transa">transa</router-link></li>
      <li><router-link to="/portfolio/melissa">melissa</router-link></li>
      <li><router-link to="/portfolio/minimelissa">minimelissa</router-link></li>
      <li><router-link to="/portfolio/mor">mor</router-link></li>
      <li><router-link to="/portfolio/coza">coza</router-link></li>
      <li><router-link to="/portfolio/brazilian-leather">brazilian leather</router-link></li>
      <li><router-link to="/portfolio/vibra">vibra</router-link></li>
      <li><router-link to="/portfolio/genesysinf-sageweb">genesysinf</router-link></li>
    </ul>

    <div>Contact Form | Linkedin | Github | Instagram </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storage: this.$store.getters.getStorage
    }
  },
  name: 'Marco Almeida',
}
</script>