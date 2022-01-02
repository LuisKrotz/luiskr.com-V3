<template>
  <article>
    <section class="portfolio">
      <h2 id="portfolio" class="hdn" ref="portfolio">PORTFOLIO</h2>
      <ul class="portfolio-grid">
        <li class="portfolio-item" v-for="item, index in portfoliolist" :key="index">
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
  </article>
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
          width: ["1920", "768"],
          height: ["850", "340"],
          label: 'Brazilian Leather',
          description: 'Brazilian Leather is a project developed at Transa, through a partnership between CICB and Apex-Brasil.<br>The project is a portal of Leather from Brazil. Including websites like Brazilian Leather, CICB, CSCB and Leather Law.',
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
          link: 'cecerele',
          image: 'cecerele',
          width: ["1920", "768"],
          height: ["640", "256"],
          label: 'Cecerelê',
          description: 'Cecerelê\'s e-commerce was developed as a freelancing job in Dec. 2021.<br>Cecerelê\'s is a store was designed by myself inside the Illuria e-commerce platform.',
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
          link: 'melissa',
          image: 'melissa',
          width: ["1920", "768"],
          height: ["799", "320"],
          label: 'Melissa',
          description: 'Melissa\'s website was a portal connecting all things related to the Melissa Brand.<br>It had many feeds connected with the brand social media and original content created at Transa.',
        },
        {
          link: 'metcha',
          image: 'metcha',
          width: ["1915", "768"],
          height: ["750", "301"],
          label: 'Metcha',
          description: 'METCHA is the oracle of leather design culture.<br>Seeking to tell the most compelling stories within the worlds of design, art, fashion and lifestyle, shining a spotlight on the subjects and the individuals that make up the everyday lives of the people who shape the world of today.',
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
          link: 'mor',
          image: 'mor',
          width: ["1920", "768"],
          height: ["798", "319"],
          label: 'Mor',
          description: 'MOR\'s website was developed at Transa with the goal create a fast and beautiful experience connecting MOR\'s channels and community in one place',
        },
        {
          link: 'nathalia-bond-clinica-de-desenvolvimento',
          image: 'clinica-nathalia-bond-v3',
          width: ["1920", "960"],
          height: ["640", "320"],
          label: 'Nathalia Bond',
          description: 'Nathalia Bond - Clínica de Desenvolvimento\'s website was developed as a freelancing from Oct. to Dec in 2021.<br>Nathalia Bond\'s website was a re-design of the previous website, keeping the already stablished visual identity with focus refining the visual identity and using squarespace as an easy-to-maintain content management system for the end user.',
        },
        {
          link: 'genesysinf-sageweb',
          image: 'sageweb',
          width: ["1350", "768"],
          height: ["649", "369"],
          label: 'Sageweb',
          description: 'Sage is a project developed by Genesysinf, at the city of Santana do Livramento, in Brazil, and is a fiscal software.<br>The project consisted of porting the Sage for desktop software code to a new Web Version.',
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
          link: 'vibra',
          image: 'vibra',
          width: ["1920", "768"],
          height: ["913", "340"],
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
    },
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