<template>
  <article>
    <section class="about" >
      <h3 id="about" class="about-title" ref="about">ABOUT ME</h3>
      <ul class="about-grid">
        <li class="about-item">
          <div class="about-draw">
            <div class="about-draw-mic"></div>
            <div class="about-draw-speaker"></div>
            <div class="about-draw-screen">
              <p class="about-item-text">I'm currently working full time at TRANSA, and available for part-time Freelancing on the weekends.</p>
              <p class="about-item-text"><strong>Working 100% remotely.</strong></p>
            </div>
          </div>

          <p class="about-item-text">I went to college at UFSM / Federal University of Santa Maria, in the City of Frederico Westphalen - Brazil, and graduated in August of 2014 in Technology in Systems for the Internet.</p>
          <p class="about-item-text">Started as a Jr. front-end developer on Apr. 2016. Learned a lot and became a front-end developer in December 2016. The opportunities kept appearing and I started leading the front-end in January of 2018. Now I'm managing the front-end team while working as the leading front end developer until this date.</p>
          <p class="about-item-text">I started freelancing in 2016 to test my skills and since then have been working on side jobs from time to time.</p>
          <p class="about-item-text">When I graduated, I started working for a short period at Dismáquinas, on Frederico Westphalen, then I moved to Santana do Livramento for a while, and work at Genesysinf on the Sageweb project, before leaving to Porto Alegre.</p>
        </li>

        <li class="about-item">
          <p class="about-item-text">I love learning new languages.<br>I can communicate in German, English, Portuguese and Spanish.<br>Currently trying to learn Mandarin.</p>
          <p class="about-item-text">My work is always focused on delivering pixel perfects layouts. Been working with UX at Transa in the last years, focusing the code to deliver an easy to use, fast, beautiful and smooth experience.</p>
          <p class="about-item-text">I work with any CSS pre-processor available. I love CSS3 and generally work with SASS, but have worked with LESS and Stylus.</p>
          <p class="about-item-text">I do a lot of programming in JS, my favourite language. I use lots of Vue.js, but in some cases, Vanilla JS does the trick without any overhead. On the server side, I tend to use mainly PHP (Laravel) but I did some programming in Asp.net and C# in the past. I'm learning Angular and React, looking for opportunities to apply the new knowledge, and some Python.</p>
          <p class="about-item-text">HTML5 is an essential skill to master for any website. I work with markup optimization for SEO, accessibility, performance and animations.</p>
          <p class="about-item-text">Mysql is the main query language I use but worked with Cassandra and Mongo in the past. I'm Currently studying more Mongo to apply in future projects.</p>
          <p class="about-item-text">I love animating in CSS, worked for a long time in Melissa's collections, mainly with CSS animations. Used JS animations recently with Vue and Lottie, and tried some Three.js animations in the last few years.</p>
        </li>
      </ul>
    </section>

    <section class="awards" >
      <h3 id="awards" class="awards-title" ref="awards">AWARDS</h3>
      <ul  class="awards-grid">
        <li class="awards-item">
          <a class="awards-item-link" href="http://coral.ufsm.br/prpgp/images/fomularios-diversos/2013/40-MELHORES-JAI-2013.pdf">
            <span class="awards-item-link-media">🏆</span>
            <h4 class="awards-item-link-text">At UFSM.<br>Prize of being placed among the 40 best works of the 28th JAI</h4>
            <p class="awards-item-link-year">2013</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
            <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-special-kudos-1.svg'}">
            <h4 class="awards-item-link-text">CSSDA / SPECIAL KUDOS AWARD - Awarded for the first version of luiskr.com in 2020</h4>
            <p class="awards-item-link-year">June 14th 2020</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
            <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-inn-Luiskr-1.svg'}">
            <h4 class="awards-item-link-text">CSSDA / INNOVATION DESIGN AWARD - Awarded for the first version of luiskr.com in 2020</h4>
            <p class="awards-item-link-year">June 14th 2020</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
            <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-ux-Luiskr-1.svg'}">
            <h4 class="awards-item-link-text">CSSDA / UX DESIGN AWARD - Awarded for the first version of luiskr.com in 2020</h4>
            <p class="awards-item-link-year">June 14th 2020</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
            <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-ui-Luiskr-1.svg'}">
            <h4 class="awards-item-link-text">CSSDA / UI DESIGN AWARD - Awarded for the first version of luiskr.com in 2020</h4>
            <p class="awards-item-link-year">June 14th 2020</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://www.topcssgallery.com/gallery/luis-krotz/">
            <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/CSSW-15699-Star-Certificate.svg'}">
            <h4 class="awards-item-link-text">Featured on TCG</h4>
            <p class="awards-item-link-year">Oct. 6th 2021</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://www.topcssgallery.com/gallery/luis-krotz/">
            <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/tcg-2021.svg'}">
            <h4 class="awards-item-link-text">Featured on TCG</h4>
            <p class="awards-item-link-year">Oct. 6th 2021</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://mindsparklemag.com/website/luis-krotz">
            <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/mindsparkle-2021.svg'}">
            <h4 class="awards-item-link-text">Featured on Mindsparkle Mag</h4>
            <p class="awards-item-link-year">Oct. 13th 2021</p>
          </a>
        </li>
      </ul>
    </section>

    <footer class="contact">
      <h3 id="contact" class="contact-title" ref="contact">Contact</h3>
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
  </article>
</template>

<script>

export default {
  data() {
    return {
      storage:          this.$store.getters.getStorage,
    }
  },
  created() {
    document.title = this.$route.meta.title;
  },
  name: 'About',
  methods: {
    mounted() {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 500);
    }
  }
}
</script>


<style lang="scss">
@import '../sass/home';
</style>