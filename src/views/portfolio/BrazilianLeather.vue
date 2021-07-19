<template>
  <div class="project">
    <h1 class="project-title">Brazilian Leather</h1>
    <div class="project-main">
      <video class="project-main-item" playsinline autoplay loop muted controls>
        <source :src="storage + 'brazilian leather/portal/brazilian-leather-cicb-cscb-leather-law-portal-full-tour.mp4'" type="video/mp4">
      </video>
    </div>

    <section class="project-description">
      <h2>Brazilian Leather is a project developed at Transa, through a partnership between CICB and Apex-Brasil. The project is a portal of Leather from Brazil. Including websites like Brazilian Leather, CICB, CSCB and Leather Law.</h2>
      <p>
        I contributed as a member of the development team of the main portal.
      </p>
      <p>
        Contributed with coding an maintence in vanilla JS and Jquery.
      </p>
      <p>
        Styling using LESS.
      </p>
      <p>
        And usability fixes after the development, with constant improvements and maintence to this date.
      </p>
    </section>
    <section class="project-extra">
      <ul class="project-extra-scroll">
        <li class="project-extra-item">
          <video playsinline autoplay loop muted controls>
            <source :src="storage + 'brazilian leather/portal/cicb.org.br-31-03-19-1-mobile.mp4'" type="video/mp4">
          </video>
          <label>Brazilian Leather - mobile tour</label>
          <button>Tap to open</button>
        </li>
        <li class="project-extra-item">
          <img :src="storage + 'brazilian leather/portal/brazilian-leather-cicb-cscb-leather-law-portal-about-full-page-en-2020-12-15-23_21_33-mozjpg-50.jpg'"/>
          <label>Brazilian Leather - home</label>
          <button>Tap to open</button>
        </li>
        <li class="project-extra-item">
          <img :src="storage + 'brazilian leather/portal/brazilian-leather-cicb-cscb-leather-law-portal-about-full-page-mozjpg-50.jpg'"/>
          <label>Brazilian Leather - about</label>
          <button>Tap to open</button>
        </li>
        <li class="project-extra-item">
          <img :src="storage + 'brazilian leather/portal/brazilian-leather-cicb-cscb-leather-law-portal-brazilian-leather-mandarin-chinese-full-page-mozjpg-50.jpg'"/>
          <label>Brazilian Leather - in mandarin</label>
          <button>Tap to open</button>
        </li>
        <li class="project-extra-item">
          <img :src="storage + 'brazilian leather/portal/brazilian-leather-cicb-cscb-leather-law-portal-cicb-website-full-page-mozjpg-50.jpg'"/>
          <label>CSCB - Home page</label>
          <button>Tap to open</button>
        </li>
      </ul>
    </section>

    <section class="project-description">
      <h2>Since 2016 I'm  contributing anually in the development of CSCB fóruns. </h2>
      <p>
        Every Fórum is a new experience, and development exclusively.
      </p>
      <p>
        Check CSCB 2016 - "Econômia Circular" below.
      </p>
      <p>
        It was developed using PHP, Jquery and pure CSS, I contributed as a member of the team as a JR. Front-end developer, guided by Cristiano Becker on the development of this page in my firt year at Transa.
      </p>
    </section>

    <section class="project-extra">
      <ul class="project-extra-scroll">
        <li class="project-extra-item">
          <video playsinline autoplay loop muted controls style="width: 960px; height: 506px">
            <source :src="storage + 'brazilian leather/forum-cicb/2016/fórum-cscb-fórum-2016-economia-circular-tour.mp4'" type="video/mp4">
          </video>
          <label>Fórum 2016 - Full tour</label>
        </li>
        <li class="project-extra-item">
          <img style="height: 506px" :src="storage + 'brazilian leather/forum-cicb/2016/fórum-cscb-fórum-2016-economia-circular-full-page-mozjpg-50.jpg'"/>
          <label>Fórum 2016 - Full page</label>
          <button>Tap to open</button>
        </li>
        <li class="project-extra-item">
          <video style="height: 506px" playsinline autoplay loop muted controls>
            <source :src="storage + 'brazilian leather/forum-cicb/2016/forum-2016-1-mobile.mp4'" type="video/mp4">
          </video>
          <label>Fórum 2016 - Mobile tour</label>
          <button>Tap to open</button>
        </li>
      </ul>
    </section>

    <section class="project-description">
      <h2>
        2017 brought a new edition, "Econômia Circular".
      </h2>
      <p>
        It was developed using PHP, Jquery and Less for CSS, I contrubuted as a Front end Developer, and work  closely with Renan Machado for the Back-end of the application.
      </p>
    </section>
    <section class="project-extra">
      <ul class="project-extra-scroll">
        <li class="project-extra-item">
          <video playsinline autoplay loop muted controls style="width: 960px; height: 506px">
            <source :src="storage + 'brazilian leather/forum-cicb/2017/fórum-cscb-fórum-2017-negócios-disruptivos-para-um-mundo-disruptivo-tour.mp4'" type="video/mp4">
          </video>
          <label>Fórum 2017 - Full tour</label>
        </li>
        <li class="project-extra-item">
          <img style="height: 506px" :src="storage + 'brazilian leather/forum-cicb/2017/fórum-cscb-fórum-2017-negócios-disruptivos-para-um-mundo-disruptivo-full-page-mozjpg-50.jpg'"/>
          <label>Fórum 2017 - Full page</label>
          <button>Tap to open</button>
        </li>
        <li class="project-extra-item">
          <video style="height: 506px" playsinline autoplay loop muted controls>
            <source :src="storage + 'brazilian leather/forum-cicb/2017/forum-2017-1-mobile.mp4'" type="video/mp4">
          </video>
          <label>Fórum 2017 - Mobile tour</label>
          <button>Tap to open</button>
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
              <router-link class="project-footer-related-link" to="/portfolio/aboutmarco">marco almeida</router-link>
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
export default {
  data() {
    return {
      storage: this.$store.getters.getStorage
    }
  },
  methods: {
    openModal() {
      // TODO
    }
  },
  name: 'Brazilian Leather',
}
</script>

<style lang="scss">
@import '../../sass/projects';
</style>