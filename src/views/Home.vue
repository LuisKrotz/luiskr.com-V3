<template>
  <div>
    <div>HOME</div>
    <div>PORTFOLIO
      <ul>
        <li><router-link to="/portfolio/metcha">metcha</router-link></li>
        <li><router-link to="/portfolio/transa">transa</router-link></li>
        <li><router-link to="/portfolio/aboutmarco">aboutmarco</router-link></li>
        <li><router-link to="/portfolio/melissa">melissa</router-link></li>
        <li><router-link to="/portfolio/minimelissa">minimelissa</router-link></li>
        <li><router-link to="/portfolio/mor">mor</router-link></li>
        <li><router-link to="/portfolio/coza">coza</router-link></li>
        <li><router-link to="/portfolio/brazilian-leather">brazilian leather</router-link></li>
        <li><router-link to="/portfolio/vibra">vibra</router-link></li>
        <li><router-link to="/portfolio/genesysinf-sageweb">genesysinf</router-link></li>
      </ul>
      <router-view/>
    </div>
    <div>ABOUT</div>
    <div>AWARDS
      <div>
      Premio 40 melhores
      </div>
      <div>Luiskr.com</div>
    </div>
    <div>HOME FOOTER
      <div>Contact Form | Linkedin | Github | Instagram </div>
      <div>
        <router-link to="/heritage">Heritage</router-link> | 
        <router-link to="/privacy-policy">Privacy Policy</router-link> | 
        <router-link to="/GDPR">GDPR</router-link> | 
        <router-link to="/terms-of-use">Terms of use</router-link>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    //HelloWorld
  }
}
</script>
