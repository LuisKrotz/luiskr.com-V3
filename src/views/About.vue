<template>
  <article>
    <div class="about" >
      <h2 id="about" class="about-title" ref="about">About me</h2>
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

          <p class="about-item-text">
            Some mentions:
          </p>

          <ul class="awards">
            <li class="awards-item">
              <a class="awards-item-link" href="https://www.topcssgallery.com/gallery/luis-krotz/">
                <span class="awards-item-link-media">🌐</span>
                <span class="awards-item-link-text">Oct. 6th 2021: Featured on TCG</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="https://mindsparklemag.com/website/luis-krotz">
                <span class="awards-item-link-media">🌐</span>
                <span class="awards-item-link-text">Oct. 13th 2021: Featured on Mindsparkle Mag</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="https://www.topcssgallery.com/gallery/luis-krotz/">
                <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/CSSW-15699-Star-Certificate.svg'}"  width="993" height="1132">
                <span class="awards-item-link-text">Oct. 6th 2021: Featured on TCG</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
                <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-special-kudos-1.svg'}" width="794" height="1123">
                <span class="awards-item-link-text">June 14th 2020: CSSDA / SPECIAL KUDOS AWARD - Awarded for the first version of luiskr.com in 2020</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
                <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-inn-Luiskr-1.svg'}"  width="993" height="1273">
                <span class="awards-item-link-text">June 14th 2020: CSSDA / INNOVATION DESIGN AWARD - Awarded for the first version of luiskr.com in 2020</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
                <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-ux-Luiskr-1.svg'}" width="893" height="1132">
                <span class="awards-item-link-text">June 14th 2020: CSSDA / UX DESIGN AWARD - Awarded for the first version of luiskr.com in 2020</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
                <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-ui-Luiskr-1.svg'}"  width="886" height="1123">
                <span class="awards-item-link-text">June 14th 2020: CSSDA / UI DESIGN AWARD - Awarded for the first version of luiskr.com in 2020</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="http://coral.ufsm.br/prpgp/images/fomularios-diversos/2013/40-MELHORES-JAI-2013.pdf">
                <span class="awards-item-link-media">🏆</span>
                <span class="awards-item-link-text">Aug. 2013: At UFSM.<br>Prize of being placed among the 40 best works of the 28th JAI</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <Contact />
  </article>
</template>

<script>
import Contact        from '../components/Contact'

export default {
  data() {
    return {
      storage:          this.$store.getters.getStorage
    }
  },
  created() {
    document.title = this.$route.meta.title;
  },
  components: {
    Contact
  },
  name: 'About',
  mounted() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  }
}
</script>


<style lang="scss">
@import '../sass/about';
@import '../sass/contact';
</style>