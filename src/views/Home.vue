<template>
  <article :class="has_touch ? 'has_touch' : ''">
      <h2 id="portfolio" class="portfolio-title" ref="portfolio">
        <span class="hdn">{{ message }}:</span>

        <div v-for="n in 100" :key="n" class="portfolio-title-marquee" aria-hidden="true" data-no-snippet>
            <template v-for="n in 3" :key="n"> ▲ {{ message }}</template>
        </div>
      </h2>


    <section class="portfolio">
      <ul class="portfolio-grid">
        <li class="portfolio-item" v-for="item, index in portfoliolist" :key="index" @mouseenter.self="hover($event)"  @mousemove="onMouseMove($event)" @mouseleave="clear()">
          <DrawComputer
            :link="'/portfolio/' + item.link"
            :image="storage + 'covers/' + item.image"
            :width="item.width"
            :height="item.height"
            :label="item.label"
            :description="item.description"/>
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
    <img v-if="!has_touch" alt="Click to Explore" width="119" height="124" class="hover" :style="'transform: translate3D(' + page.left + 'px, ' + page.top + 'px, 0);'+ (showhover ? 'opacity: 1' :  'opacity: 0')" aria-hidden="true" src="data:image/png;base64,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">
  </article>
</template>

<script>
import DrawComputer from '../components/drawings/Computer'

export default {
  data() {
    return {
      storage:          this.$store.getters.getStorage,
      message:          'Selected work',
      portfoliolist:    [
        {
          link: 'metcha',
          image: 'metcha',
          width: ["1915", "768"],
          height: ["750", "301"],
          label: 'Metcha',
          description: 'METCHA is the oracle of leather design culture.<br>Seeking to tell the most compelling stories within the worlds of design, art, fashion and lifestyle, shining a spotlight on the subjects and the individuals that make up the everyday lives of the people who shape the world of today.',
        },
        {
          link: 'transa',
          image: 'transa',
          width: ["1920", "768"],
          height: ["850", "369"],
          label: 'Transa',
          description: 'Transa is a driven by community + content + channels company.<br>Provoking meaningful changes for ambitious organizations in BR, USA, UK, EU & ASIA, encouraging people and brands to catalyze their strengths.<br>Transa\'s website consists of an infinite scrolling feed, with many projects developed at Transa during the years.',
        },
        {
          link: 'brazilian-leather',
          image: 'brazilian-leather',
          width: ["1920", "768"],
          height: ["850", "340"],
          label: 'Brazilian Leather',
          description: 'Brazilian Leather is a project developed at Transa, through a partnership between CICB and Apex-Brasil.<br>The project is a portal of Leather from Brazil. Including websites like Brazilian Leather, CICB, CSCB and Leather Law.',
        },
        {
          link: 'mor',
          image: 'mor',
          width: ["1920", "768"],
          height: ["798", "319"],
          label: 'Mor',
          description: 'MOR\'s website was developed at Transa with the goal create a fast and beautiful experience connecting MOR\'s channels and community in one place',
        },
        {
          link: 'coza',
          image: 'coza',
          width: ["1920", "768"],
          height: ["794", "318"],
          label: 'Coza',
          description: 'Coza\'s website was developed at Transa from 2017 to 2019.<br>Coza\'s main page was a feed of content created for the brand, with articles, galleries, photos and links to the online store.',
        },
        {
          link: 'melissa',
          image: 'melissa',
          width: ["1920", "768"],
          height: ["799", "320"],
          label: 'Melissa',
          description: 'Melissa\'s website was a portal connecting all things related to the Melissa Brand.<br>It had many feeds connected with the brand social media and original content created at Transa.',
        },
        {
          link: 'minimelissa',
          image: 'minimelissa-cropped',
          width: ["1905", "768"],
          height: ["799", "322"],
          label: 'Mini Melissa',
          description: 'Minimelissa was a project developed at Transa for the Grendene Group as a channel for the Minimelissa brand.<br>The website consisted of a Content and a Social feed on the homepage with infinite scroll leading to many Minimelissa exclusive content and lasted from 2018 to 2020.',
        },
        {
          link: 'aboutmarco',
          image: 'aboutmarco',
          width: ["1920", "768"],
          height: ["1014", "406"],
          label: 'Marco Almeida',
          description: 'Marco\'s Portfolio was developed as a Freelancing project in 2021.<br>The main goal to achieve was to create a pixel-perfect project, with smooth animations and a pixel perfect UI.',
        },
        {
          link: 'clinica-de-desenvolvimento-nathalia-bond',
          image: 'clinica-nathalia-bond-v3',
          width: ["1920", "960"],
          height: ["640", "320"],
          label: 'Nathalia Bond',
          description: 'Nathalia Bond - Clínica de Desenvolvimento\'s website was developed as a freelancing from Oct. to Dec in 2021.<br>Nathalia Bond\'s website was a re-design of the previous website, keeping the already stablished visual identity with focus refining the visual identity and using squarespace as an easy-to-maintain content management system for the end user.',
        },
        {
          link: 'cecerele',
          image: 'cecerele',
          width: ["1920", "768"],
          height: ["640", "256"],
          label: 'Cecerelê',
          description: 'Cecerelê\'s e-commerce was developed as a freelancing job in Dec. 2021.<br>Cecerelê\'s is a store was designed by myself inside the Illuria e-commerce platform.',
        },
        {
          link: 'vibra',
          image: 'vibra',
          width: ["1920", "768"],
          height: ["913", "340"],
          label: 'Vibra',
          description: 'Vibra is a website developed at Transa in 2016 as a portal created for the Vibra Brand.',
        },
        {
          link: 'genesysinf-sageweb',
          image: 'sageweb',
          width: ["1350", "768"],
          height: ["649", "369"],
          label: 'Sageweb',
          description: 'Sage is a project developed by Genesysinf, at the city of Santana do Livramento, in Brazil, and is a fiscal software.<br>The project consisted of porting the Sage for desktop software code to a new Web Version.',
        }],
      has_touch: (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)),
      showhover: false,
      page: {
          left : 0,
          top: 0
      }
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
    },
    onMouseMove(e) {
        this.page.left = e.pageX - 60;
        this.page.top = e.pageY - 60;
      },
    hover(e) {
      if(!this.has_touch) {
          this.showhover = true;

          document.body.classList.add("mouseenter");
          this.onMouseMove(e);
      }
    },
    clear() {
        document.body.classList.remove("mouseenter");
        this.showhover = false;
    },
  },
  mounted() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  }
}
</script>


<style lang="scss">
@import '../sass/home';
@import '../sass/contact';
</style>