<template>
  <div id="#main" class="project">
    <h1 class="project-title">Marco Almeida</h1>
    <div class="project-main">
      <video class="project-main-item" playsinline autoplay loop muted controls>
        <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4'" type="video/mp4">
      </video>
    </div>

    <section class="project-description">
      <h2>
        Marco's Portfolio was developed as a Freelancing project.
      </h2>
      <p>
        It uses Vue.JS and Sass.
      </p>
      <p>
        All animations are done in css.
      </p>
      <p>
        The main goal to achieve was to create a pixel perfect project, with smooth animations and a pixel perfect UI.
      </p>
      <p>
        I also did the server setup at Digital Ocean.
      </p>
    </section>

    <section class="project-extra">
        <ul class="project-extra-scroll">
          <li class="project-extra-item">
            <video playsinline autoplay loop muted controls>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-mobile-mobile.mp4'" type="video/mp4">
            </video>
            <label>aboutmarco.com - mobile tour</label>
            <button>Tap to open</button>
          </li>
          <li class="project-extra-item">
              <Image
                src="aboutmarco/pages/aboutmarco.com-pages--melissa-insider-2020-12-15"
                :width="800"
                :height="1200"
                :canExpand="true"
                label="aboutmarco.com - melissa insider"/>
          </li>
          <li class="project-extra-item">
            <Image
              src="aboutmarco/pages/aboutmarco.com-pages--melissa-2020-12-15"
              :width="800"
              :height="1200"
              :canExpand="true"
              label="aboutmarco.com - melissa"/>
          </li>
          <li class="project-extra-item">
            <Image
              src="aboutmarco/pages/aboutmarco.com-pages--coza-2020-12-15"
              :width="800"
              :height="1200"
              :canExpand="true"
              label="aboutmarco.com - coza"/>
          </li>
          <li class="project-extra-item">
            <Image
              src="aboutmarco/pages/aboutmarco.com-pages--brazilian-leather-2020-12-15"
              :width="800"
              :height="1200"
              :canExpand="true"
              label="aboutmarco.com - brazilian leather"/>
          </li>
          <li class="project-extra-item">
            <Image
              src="aboutmarco/about/aboutmarco.com-me-2020-12-15-23_29_35"
              :width="800"
              :height="1200"
              :canExpand="true"
              label="aboutmarco.com - me"/>
          </li>
          <li class="project-extra-item">
            <Image
              src="aboutmarco/about/aboutmarco.com-archive-2020-12-15-23_31_53"
              :width="800"
              :height="1200"
              :canExpand="true"
              label="aboutmarco.com - archive"/>
          </li>
        </ul>
    </section>
    <router-view/>


    <footer class="project-footer">
      <!-- INTERNAL FOOTER -->
      <div class="project-footer-grid">
        <div>
          <h2 class="project-footer-title">PROJECTS</h2>
          <ul class="project-footer-related">
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/metcha">metcha</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/transa">transa</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/melissa">melissa</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/minimelissa">minimelissa</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/mor">mor</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/coza">coza</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/brazilian-leather">brazilian leather</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/vibra">vibra</router-link>
            </li>
            <li>
              <router-link class="project-footer-related-link" to="/portfolio/genesysinf-sageweb">genesysinf</router-link>
            </li>
          </ul>
        </div>
        <div class="project-footer-decoration">
          <img class="project-footer-decoration-media" :src="storage + 'melissa/collections/development/flygrl/flygrl.mp4-scaledown-2x.mp4.jpg'">
        </div>
      </div>

      <div class="project-footer-contact">
          <a class="project-footer-contact-link">Mail</a>
          <span class="project-footer-contact-separator">•</span>
          <a class="project-footer-contact-link">Linkedin</a>
          <span class="project-footer-contact-separator">•</span>
          <a class="project-footer-contact-link">Github</a>
          <span class="project-footer-contact-separator">•</span>
          <a class="project-footer-contact-link">Instagram</a>
        </div>
    </footer>
  </div>
</template>

<script>
import Image from'../../components/Image';

export default {
  data() {
    return {
      storage: this.$store.getters.getStorage
    }
  },
  components: {
    Image
  },
  methods: {
    openModal() {
      // TODO
    }
  },
  name: 'Marco Almeida',
}
</script>

<style lang="scss">
@import '../../sass/projects';
</style>