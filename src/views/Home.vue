<template>
  <div>
    <div class="cover">
      <div class="max-area">
        <div class="cover-text">
          <h2>A DEV</h2>
          <span>
          With passion for UI/UX, JS, CSS and performance.
          Focused on creating beautiful experiences.</span>
        </div>

        <a href="#about" class="cover-links abt" @click.prevent="scrollTo('about')">
          About
        </a>
        <a href="#portfolio" class="cover-links ptf" @click.prevent="scrollTo('portfolio')">
          Portfolio
        </a>
        <a href="#contact" class="cover-links cnt" @click.prevent="scrollTo('contact')">
          Contact
        </a>
      </div>
    </div>

    <div class="portfolio">
      <h2 id="portfolio" class="portfolio-title" ref="portfolio">PORTFOLIO</h2>
      <ul class="portfolio-grid">
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/metcha">
            <img class="portfolio-item-link-media" :src="storage + 'covers/metcha.jpg'" />
            <span class="portfolio-item-link-text">Metcha</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/transa">
            <img class="portfolio-item-link-media" :src="storage + 'covers/transa.jpg'" />
            <span class="portfolio-item-link-text">Transa</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link"  to="/portfolio/aboutmarco">
            <img class="portfolio-item-link-media" :src="storage + 'covers/aboutmarco.jpg'" />
            <span class="portfolio-item-link-text">Marco Almeida</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link"  to="/portfolio/melissa">
            <img class="portfolio-item-link-media" :src="storage + 'covers/melissa.jpg'" />
            <span class="portfolio-item-link-text">Melissa</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link"  to="/portfolio/minimelissa">
            <img class="portfolio-item-link-media" :src="storage + 'covers/minimelissa-cropped.jpeg'" />
            <span class="portfolio-item-link-text">Mini Melissa</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/brazilian-leather">
            <img class="portfolio-item-link-media" :src="storage + 'covers/brazilian-leather.jpg'" />
            <span class="portfolio-item-link-text">Brazilian Leather</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/mor">
            <img class="portfolio-item-link-media" :src="storage + 'covers/mor.jpg'" />
            <span class="portfolio-item-link-text">Mor</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/coza">
            <img class="portfolio-item-link-media" :src="storage + 'covers/coza.jpg'" />
            <span class="portfolio-item-link-text">Coza</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/vibra">
            <img class="portfolio-item-link-media" :src="storage + 'covers/vibra.jpg'" />
            <span class="portfolio-item-link-text">Vibra</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/genesysinf-sageweb">
            <img class="portfolio-item-link-media" :src="storage + 'covers/sageweb.jpg'" />
            <span class="portfolio-item-link-text">Genesysinf</span>
          </router-link>
        </li>
      </ul>
      <router-view/>
    </div>

    <div class="about" >
      <h2 id="about" class="about-title" ref="about">ABOUT ME</h2>
      <ul class="about-grid">
        <li class="about-item">
          <h3 class="about-item-title">Avaliability</h3>
          <p class="about-item-text">Currently working full time at TRANSA, and avaliabe for part-time Freelancing on the weekends.</p>
        </li>
        <li class="about-item">
          <h3 class="about-item-title">College</h3>
          <p class="about-item-text">I went to college at UFSM / Federal University of Santa Maria, in the City of Frederico Westphalen - Brazil, and graduated in August of 2014 in Technology in Systems for the Internet.</p>
        </li>
        <li class="about-item">
          <h3 class="about-item-title">Transa</h3>
          <p class="about-item-text">Started as a Jr. front-end developer on Apr. 2016. Learned a lot and became a front-end developer on december 2016. The opportunities kept appearing and I started leading the front-end in January of 2018. Now I'm managing the front-end team while working as the leading front end developer until this date.</p>
        </li>
        <li class="about-item">
          <h3 class="about-item-title">Freelancing</h3>
          <p class="about-item-text">I started my "one-man army" company in 2016 to test my skills and since then been working on side jobs as a Freelancer.</p>
        </li>
        <li class="about-item">
          <h3 class="about-item-title">GENESYINF / DISMÁQUINAS</h3>
          <p class="about-item-text">When I graduated, I started working for a short period at Dismáquinas, on Frederico Westphalen, then I moved to Santana do Livramento for a while, and work at Genesysinf on the Sageweb project, before leaving to Porto Alegre. Currently working 100% remotely.</p>
        </li>
        <li class="about-item">
          <h3 class="about-item-title">Languages</h3>
          <p class="about-item-text">I love learning new languages.<br>I can communicate in German, English, Portuguese and Spanish.<br>Currently trying to learn Mandarin, Russian and Arabic.</p>
        </li>
        <li class="about-item">
          <h3 class="about-item-title">UI/UX</h3>
          <p class="about-item-text">My work is always focused on delivering pixel perfects layouts. Been working with UX at Transa on the last years, focusing the code to deliver a easy to use, fast, beautiful and smooth experience.</p>
        </li>
        <li class="about-item">
          <h3 class="about-item-title">Styling</h3>
          <p class="about-item-text">I work with any CSS pre-processor avaliable. I love CSS3 and generally work with SASS, but have worked with LESS and Stylus.</p>
        </li>
        <li class="about-item">
          <h3 class="about-item-title">Programming</h3>
          <p class="about-item-text">I do a lot of programming in JS, my favorite language. I use lots of Vue.js, but in some cases Vanilla JS does the trick without any overhead.On the server side I tend to use mainly PHP (Laravel) but I did some programming in Asp.net and C# in the past.I'm learning Angular and React, looking fot opportunities to apply the new knowledge, and some Python.</p>
        </li>
        <li class="about-item">
          <h3 class="about-item-title">Markup</h3>
          <p class="about-item-text">HTML5, HTML5, HTML5, the essential skill to master for any website. I work with markup optimization for SEO, acessibility, performance and animatios.</p>
        </li>
        <li class="about-item">
          <h3 class="about-item-title">Databases</h3>
          <p class="about-item-text">Mysql is the main Query language I use, but worked with Cassandra and Mongo in the past. I'm Currently studing more Mongo to apply in furture projects.</p>
        </li>
        <li class="about-item">
          <h3 class="about-item-title">Animation</h3>
          <p class="about-item-text">I love animating in CSS, worked for a long time in Melissa's collections, mainly with CSS animations. Used JS animations recently with Vue and Lottie, and tryed some Three.js animations in the last few years.</p>
        </li>

      </ul>
    </div>

    <div class="awards" >
      <h2 id="awards" class="awards-title" ref="awards">AWARDS</h2>
      <ul  class="awards-grid">
        <li class="awards-item">
          <a class="awards-item-link" href="http://coral.ufsm.br/prpgp/images/fomularios-diversos/2013/40-MELHORES-JAI-2013.pdf">
            <span class="awards-item-link-media">🏆</span>
            <h3 class="awards-item-link-text">At UFSM.<br>Prize of being placed among the 40 best works of the 28th JAI</h3>
            <p class="awards-item-link-year">2013</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
            <img class="awards-item-link-media" src="https://storage.googleapis.com/luiskr.com/public/awards/cssda-special-kudos-1.svg">
            <h3 class="awards-item-link-text">CSSDA / SPECIAL KUDOS AWARD</h3>
            <p class="awards-item-link-year">June 14th 2020</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
            <img class="awards-item-link-media" src="https://storage.googleapis.com/luiskr.com/public/awards/cssda-inn-Luiskr-1.svg">
            <h3 class="awards-item-link-text">CSSDA / INNOVATION DESIGN AWARD</h3>
            <p class="awards-item-link-year">June 14th 2020</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
            <img class="awards-item-link-media" src="https://storage.googleapis.com/luiskr.com/public/awards/cssda-ux-Luiskr-1.svg">
            <h3 class="awards-item-link-text">CSSDA / UX DESIGN AWARD</h3>
            <p class="awards-item-link-year">June 14th 2020</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
            <img class="awards-item-link-media" src="https://storage.googleapis.com/luiskr.com/public/awards/cssda-ui-Luiskr-1.svg">
            <h3 class="awards-item-link-text">CSSDA / UI DESIGN AWARD</h3>
            <p class="awards-item-link-year">June 14th 2020</p>
          </a>
        </li>
      </ul>
    </div>
  
    <div class="contact">
      <h2 id="contact" class="contact-title" ref="contact">Contact</h2>
      <div class="contact-social">
        <a href="#" class="contact-social-link">Mail</a>
        <span class="contact-social-separator">•</span>
        <a href="#" class="contact-social-link">Linkedin</a>
        <span class="contact-social-separator">•</span>
        <a href="#" class="contact-social-link">Github</a>
        <span class="contact-social-separator">•</span>
        <a href="#" class="contact-social-link">Instagram</a>
      </div>
      <div class="contact-other">
        <router-link class="contact-other-link" to="/heritage">Heritage</router-link>
        <span class="contact-other-separator">•</span>
        <router-link class="contact-other-link" to="/privacy-policy">Privacy Policy</router-link>
        <span class="contact-other-separator">•</span>
        <router-link class="contact-other-link" to="/GDPR">GDPR</router-link>
        <span class="contact-other-separator">•</span>
        <router-link class="contact-other-link" to="/terms-of-use">Terms of use</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        storage: this.$store.getters.getStorage,
      }
    },
    name: 'Home',
    methods: {
      scrollTo(ref) {
          this.$smoothScroll({
            offset: -100,
            duration: 1000,
            updateHistory: true,
            scrollTo: this.$refs[ref],  // scrollTo is also allowed to be number
            hash: `#${ref}`,             // required if updateHistory is true
          })
      }
    }
}
</script>


<style lang="scss">
@import '../sass/home';
</style>