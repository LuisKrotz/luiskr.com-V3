<template>
  <div>
    <div class="cover">
      <div class="max-area">
        <div class="cover-text">
          <h2>A DEV</h2>
          <span>
           with a passion for UI/UX, JS, CSS and performance. Focused on creating beautiful experiences.</span>
        </div>

        <button class="cover-links abt" @click="scrollTo('about')">
          About
        </button>
        <button class="cover-links ptf" @click="scrollTo('portfolio')">
          Portfolio
        </button>
        <button class="cover-links cnt" @click="scrollTo('contact')">
          Contact
        </button>
      </div>
    </div>

    <div class="portfolio">
      <h2 id="portfolio" class="portfolio-title" ref="portfolio">PORTFOLIO</h2>
      <ul class="portfolio-grid">
        <li class="portfolio-item" v-for="item, index in portfoliolist" :key="index">
          <DrawComputer
            :link="'/portfolio/' + item.link"
            :image="storage + 'covers/' + item.image + '.jpg'"
            :loadingimage="storage + 'covers/' + item.image + '-mozjpg3-MSSIM-tuned-kodak.jpg'"
            :width="item.width"
            :height="item.height"
            :label="item.label"
            :description="item.description"/>
        </li>
      </ul>
    </div>

    <div class="about" >
      <h2 id="about" class="about-title" ref="about">ABOUT ME</h2>
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
            <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-special-kudos-1.svg'}">
            <h3 class="awards-item-link-text">CSSDA / SPECIAL KUDOS AWARD - Awarded for the first version of luiskr.com in 2020</h3>
            <p class="awards-item-link-year">June 14th 2020</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
            <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-inn-Luiskr-1.svg'}">
            <h3 class="awards-item-link-text">CSSDA / INNOVATION DESIGN AWARD - Awarded for the first version of luiskr.com in 2020</h3>
            <p class="awards-item-link-year">June 14th 2020</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
            <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-ux-Luiskr-1.svg'}">
            <h3 class="awards-item-link-text">CSSDA / UX DESIGN AWARD - Awarded for the first version of luiskr.com in 2020</h3>
            <p class="awards-item-link-year">June 14th 2020</p>
          </a>
        </li>
        <li class="awards-item">
          <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
            <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-ui-Luiskr-1.svg'}">
            <h3 class="awards-item-link-text">CSSDA / UI DESIGN AWARD - Awarded for the first version of luiskr.com in 2020</h3>
            <p class="awards-item-link-year">June 14th 2020</p>
          </a>
        </li>
      </ul>
    </div>

    <div class="contact">
      <h2 id="contact" class="contact-title" ref="contact">Contact</h2>
      <div class="contact-social">
        <a href="mailto:luis.krotz@gmail.com" target="_blank" class="contact-social-link">Mail</a>
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
    </div>
  </div>
</template>

<script>
import DrawComputer from '../components/drawings/Computer'

export default {
  data() {
    return {
      storage:          this.$store.getters.getStorage,
      portfoliolist:    [
        {
          link: 'brazilian-leather',
          image: 'brazilian-leather',
          width: "1920",
          height: "850",
          label: 'Brazilian Leather',
          description: 'Brazilian Leather is a project developed at Transa, through a partnership between CICB and Apex-Brasil.<br>The project is a portal of Leather from Brazil. Including websites like Brazilian Leather, CICB, CSCB and Leather Law.',
        },
        {
          link: 'coza',
          image: 'coza',
          width: "1920",
          height: "794",
          label: 'Coza',
          description: 'Coza\'s website was developed at Transa from 2017 to 2019.<br>Coza\'s main page was a feed of content created for the brand, with articles, galleries, photos and links to the online store.',
        },
        {
          link: 'aboutmarco',
          image: 'aboutmarco',
          width: "1920",
          height: "1014",
          label: 'Marco Almeida',
          description: 'Marco\'s Portfolio was developed as a Freelancing project in 2021.<br>The main goal to achieve was to create a pixel-perfect project, with smooth animations and a pixel perfect UI.',
        },
        {
          link: 'melissa',
          image: 'melissa',
          width: "1920",
          height: "799",
          label: 'Melissa',
          description: 'Melissa\'s website was a portal connecting all things related to the Melissa Brand.<br>It had many feeds connected with the brand social media and original content created at Transa.',
        },
        {
          link: 'metcha',
          image: 'metcha',
          width: "1915",
          height: "750",
          label: 'Metcha',
          description: 'METCHA is the oracle of leather design culture.<br>Seeking to tell the most compelling stories within the worlds of design, art, fashion and lifestyle, shining a spotlight on the subjects and the individuals that make up the everyday lives of the people who shape the world of today.',
        },
        {
          link: 'minimelissa',
          image: 'minimelissa-cropped',
          width: "1905",
          height: "799",
          label: 'Mini Melissa',
          description: 'Minimelissa was a project developed at Transa for the Grendene Group as a channel for the Minimelissa brand.<br>The website consisted of a Content and a Social feed on the homepage with infinite scroll leading to many Minimelissa exclusive content and lasted from 2018 to 2020.',
        },
        {
          link: 'mor',
          image: 'mor',
          width: "1920",
          height: "798",
          label: 'Mor',
          description: 'MOR\'s website was developed at Transa with the goal create a fast and beautiful experience connecting MOR\'s channels and community in one place',
        },
        {
          link: 'genesysinf-sageweb',
          image: 'sageweb',
          width: "1350",
          height: "649",
          label: 'Sageweb',
          description: 'Sage is a project developed by Genesysinf, at the city of Santana do Livramento, in Brazil, and is a fiscal software.<br>The project consisted of porting the Sage for desktop software code to a new Web Version.',
        },
        {
          link: 'transa',
          image: 'transa',
          width: "1920",
          height: "850",
          label: 'Transa',
          description: 'Transa is a driven by community + content + channels company.<br>Provoking meaningful changes for ambitious organizations in BR, USA, UK, EU & ASIA, encouraging people and brands to catalyze their strengths.<br>Transa\'s website consists of an infinite scrolling feed, with many projects developed at Transa during the years.',
        },
        {
          link: 'vibra',
          image: 'vibra',
          width: "1920",
          height: "913",
          label: 'Vibra',
          description: 'Vibra is a website developed at Transa in 2016 as a portal created for the Vibra Brand.',
        }]
    }
  },
  created() {
    document.title = this.$route.meta.title;
  },
  name: 'Home',
  components: {
    DrawComputer
  },
  methods: {
    scrollTo(ref) {
        this.$smoothScroll({
          offset: -100,
          duration: 1000,
          updateHistory: false,
          scrollTo: this.$refs[ref],  // scrollTo is also allowed to be number
        })
    }
  }
}
</script>


<style lang="scss">
@import '../sass/home';
</style>