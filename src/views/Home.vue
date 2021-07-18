<template>
  <div>
    <div id="welcome" class="cover">
      <div class="cover-text">
        <h2>A DEV</h2>
        <span>
        With passion for UI/UX, JS, CSS and performance.
        Focused on creating beautiful experiences.</span>
      </div>

      <a href="#" class="cover-links lin">
        Linkedin
      </a>
      <a href="#" class="cover-links git">
        Github
      </a>
      <a href="#about" class="cover-links abt">
        About
      </a>
      <a href="#portfolio" class="cover-links ptf">
        Portfolio
      </a>
      <a href="#contact" class="cover-links cnt">
        Contact
      </a>
    </div>

    <div id="portfolio" class="portfolio">
      <h2 class="portfolio-title">PORTFOLIO</h2>
      <ul class="portfolio-grid">
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/metcha">
            <video class="portfolio-item-link-media" playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <span class="portfolio-item-link-text">Metcha</span>
            <span class="portfolio-item-link-icon">➕</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/transa">
            <video class="portfolio-item-link-media" playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <span class="portfolio-item-link-text">Transa</span>
            <span class="portfolio-item-link-icon">➕</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link"  to="/portfolio/aboutmarco">
            <video class="portfolio-item-link-media" playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <span class="portfolio-item-link-text">Marco Almeida</span>
            <span class="portfolio-item-link-icon">➕</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link"  to="/portfolio/melissa">
            <video class="portfolio-item-link-media" playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <span class="portfolio-item-link-text">Melissa</span>
            <span class="portfolio-item-link-icon">➕</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link"  to="/portfolio/minimelissa">
            <video class="portfolio-item-link-media" playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <span class="portfolio-item-link-text">Mini Melissa</span>
            <span class="portfolio-item-link-icon">➕</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/mor">
            <video class="portfolio-item-link-media" playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <span class="portfolio-item-link-text">Mor</span>
            <span class="portfolio-item-link-icon">➕</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/coza">
            <video class="portfolio-item-link-media" playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <span class="portfolio-item-link-text">Coza</span>
            <span class="portfolio-item-link-icon">➕</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/brazilian-leather">
            <video class="portfolio-item-link-media" playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <span class="portfolio-item-link-text">Brazilian Leather</span>
            <span class="portfolio-item-link-icon">➕</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/vibra">
            <video class="portfolio-item-link-media" playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <span class="portfolio-item-link-text">Vibra</span>
            <span class="portfolio-item-link-icon">➕</span>
          </router-link>
        </li>
        <li class="portfolio-item">
          <router-link class="portfolio-item-link" to="/portfolio/genesysinf-sageweb">
            <video class="portfolio-item-link-media" playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <span class="portfolio-item-link-text">Genesysinf</span>
            <span class="portfolio-item-link-icon">➕</span>
          </router-link>
        </li>
      </ul>
      <router-view/>
    </div>

    <div id="about" class="about">
      <h2 class="about-title">ABOUT ME</h2>
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
          <p class="about-item-text">I work with any CSS pré-processor avalianble. I love CSS3 and generally work with SASS, but have worked with LESS and Stylus.</p>
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

    <div id="awards" class="awards">
      <h2 class="awards-title">AWARDS</h2>
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
  
    <div id="contact" class="contact">
      <h2 class="contact-title">Contact</h2>
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
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

// import store from '../store/'

export default {
  data() {
    return {
      storage: this.$store.getters.getStorage
    }
  },
  name: 'Home',
  components: {
    //HelloWorld
  },
}
</script>


<style lang="scss">
    html {
      scroll-behavior: smooth;
    }

    .cover {
      position: relative;
      width: 100%;
      height: 100vh;

      &-text {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        text-align: left;
        width: 360px;
        margin-left: -110px;
        margin-top: -110px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        h2 {
          letter-spacing: 10px;
          font-size: 54px;
          margin: 16px 0;
          font-weight: 300;
        }

        span {
          font-size: 22px;
          font-weight: 200;
        }
      }

      &-links {
        color: rgb(38, 38 ,38);
        box-sizing: border-box;
        border: 1px solid rgba(38, 38 ,38, .25);
        font-family: 'Raleway';
        font-size: 22px;
        width: 200px;
        height: 200px;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        cursor: pointer;
        text-decoration: none;
        font-weight: 100;
        letter-spacing: 2.5px;

        &.lin {
          top: 28px;
          left: 20px;
          width: 500px;
          height: 500px;
          animation: bounce-4 20s ease infinite;
        }

        &.git {
          animation: bounce-5 10s linear infinite;
          bottom: 120px;
          left: 104px;
        }

        &.ptf {
            animation: bounce-2 20s linear infinite;
            bottom: 70px;
            right: 490px;
            width: 300px;
            height: 300px;
        }

        &.cnt {
          right: -60px;
          top: -90px;
          width: 700px;
          height: 700px;
            animation: bounce-1 40s linear infinite;
        }

        &.abt {
          bottom: -80px;
          right: 170px;
          width: 300px;
          height: 300px;
          animation: bounce-3 30s linear infinite;
        }
      }
    }

    .awards,
    .portfolio {
      &-grid {
        display: grid;
        grid-template-columns: repeat(5, auto);
        grid-gap: 39px;
        padding: 0;
        margin: 0;
      }

      &-item {
        &-link {
          font-size: 54px;
          text-decoration: none;
          box-sizing: border-box;
          color: rgb(36, 36, 36);
          display: grid;
          border: 1px solid;
          grid-template-rows: auto 30px;
          grid-template-columns: auto 32px;
          align-items: center;
          width: 100%;
          height: 100%;
          overflow: hidden;

          &-icon {
            border-top: 1px solid;
            text-align: center;
            font-size: 24px;
            border-left: 1px solid;
            margin: 0;
          }

          &-media {
            width: 100%;
            height: 100%;
            grid-row: 1;
            grid-column-start: 1;
            grid-column-end: -1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 104px;
            background: rgb(38, 38 ,38);
            margin: 0;
          }

          &-text {
            border-top: 1px solid;
            padding: 5px 10px;
            font-family: 'Raleway', sans-serif;
            text-align: left;
            font-weight: 400;
            font-size: 18px;
            margin: 0;
          }
        }
      }
    }

    .awards {
      &-item {
        &-link {
          grid-template-rows: repeat(3, auto);
          grid-template-columns: auto;

          &-text {
            padding: 20px 10px;
          }

          &-media {
            min-height: 240px;
          }

          &-year {
            font-family: 'Montserrat Alternates', sans-serif;
            text-align: center;
            border-top: 1px solid;
            font-size: 18px;
            font-weight: 300;
            padding: 10px;
            margin: 0;
          }
        }
      }
    }

    .about {
      &-grid {
        display: grid;
        grid-template-columns: repeat(3, auto);
        margin: 0;
        padding: 0;
        grid-gap: 64px;
      }

      &-item {
        position: relative;
        text-align: justify;
        border: 1px solid;
        padding: 20px 40px;


        &-title {
          font-family: 'Raleway', sans-serif;
          font-size: 32px;
          text-align: left;
          font-weight: 100;
        }

        &-text {
          font-family: 'Montserrat Alternates', sans-serif;
          font-size: 16px;
          line-height: 22px;
        }
      }
    }

    .portfolio,
    .about,
    .awards {
      padding: 248px 104px 104px;

      &-title {
        font-size: 104px;
        font-weight: 100;
        letter-spacing: 20px;
      }
    }

    .about,
    .awards {
      padding: 104px;
    }

    .contact {
      font-family: 'Raleway', sans-serif;
      padding: 64px;
      background-color: rgb(38, 38 ,38);
      margin-top: 104px;
      color: white;

      &-title {
        text-transform: uppercase;
        font-family: inherit;
        color: inherit;
        font-size: 64px;
        margin: 0;
        padding: 0 104px 32px;
      }

      &-social,
      &-other {
        font-family: inherit;
        color: inherit;
        padding: 0 104px;

        &-link {
          font-family: inherit;
          color: inherit;
          text-decoration: none;
        }

        &-separator {
          padding: 0 5px;
          font-weight: 200;
        }
      }

      &-social {
        font-size: 18px;
        padding: 0 104px 12px;
        border-bottom: 1px solid rgba(255, 255, 255, .05);
      }

      &-other {
        text-transform: uppercase;
        font-size: 14px;
        padding: 12px 104px 0;
      }
    }

    @keyframes bounce-1 {
      50% {
        transform: translate(20px, -50px);
      }
    }
    @keyframes bounce-2 {
      50% {
        transform: translate(-20px, 20px);
      }
    }
    @keyframes bounce-3 {
      50% {
        transform: translate(0, -10px)
      }
    }
    @keyframes bounce-4 {
      50% {
         transform: translate(-20px, -10px);
      }
    }
    @keyframes bounce-5 {
      50% {
        transform: translate(20px, 10px);
      }
    }
</style>