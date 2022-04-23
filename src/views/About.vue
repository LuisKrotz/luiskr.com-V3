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
              <p class="about-item-text">I'm Luis.<br><small><strong>{dev}</strong> focused in UX.</small></p>
            </div>
          </div>

          <p class="about-item-text">Working in I.T, planning, evaluating and executing web development, with a focus on best practices, SEO, accessibility, performance, and organization;</p>
          <p class="about-item-text">I have experience in software analysis and development in ASP, PHP, C, C#, Pascal, Delphi, Javascript and SQL;</p>
          <p class="about-item-text">Use of frameworks like jQuery and Vue; pre-processors like Sass, Less and Stylus; build tools like Webpack, Babel, Gulp and Grunt; creative tools for layout editing and content production like Sketch, Illustrator, After Effects, Corel, Gimp, Inkscape, Blender, Photoshop and Encoder, as well as command-line tools (like ImageMagick, npm packages, FFmpeg) for task automation using command lines;</p>
          <p class="about-item-text">Knowledge in the maintenance of Apache and NGINX servers and connecting with cloud servers like Google Cloud and Digital Ocean;</p>
          <p class="about-item-text">Working with viability analysis and development of systems with an evaluation of the project needs and research and evaluation of similar systems.</p>
        </li>

        <li class="about-item">
          <p class="about-item-text">I went to college at UFSM / Federal University of Santa Maria, in the City of Frederico Westphalen - Brazil, and graduated in August of 2014 in Technology in Systems for the Internet.</p>
          <p class="about-item-text">When I graduated, I started working for a short period at Dismáquinas, on Frederico Westphalen, then I moved to Santana do Livramento for a while, and work at Genesysinf on the Sageweb project, before leaving to Porto Alegre.</p>
          <p class="about-item-text">In Porto Algre I worked at TRANSA, from 2016 to 2022. Started as a Jr. front-end developer on April of 2016 in the Vibra Project. Learned a lot and became a front-end developer in December of the same year. The opportunities kept appearing and I started leading the front-end in January of 2018, finished my work at TRANSA in May of 2022, having lead the Front end in projects like Transa's own website, Metcha, Melissa, Mini-Melissa, MOR, Coza and Brazilian leather.</p>
          <p class="about-item-text">I started freelancing in 2016 to test my skills and since then have been working on side jobs from time to time.</p>

          <p class="about-item-text">My work is always focused on delivering pixel perfects layouts, focused on code delivery with an easy to use, fast, beautiful and smooth experience.</p>
          <p class="about-item-text">I love animating in CSS, worked for a long time in Melissa's collections, mainly with CSS animations. Used JS animations recently with Vue and Lottie, and tried some Three.js animations in the last few years.</p>
        </li>
      </ul>
      

      <div class="about-container">
          <p class="about-item-text">
            Some mentions:
          </p>

          <ul class="awards">
            <li class="awards-item">
              <a class="awards-item-link" href="http://coral.ufsm.br/prpgp/images/fomularios-diversos/2013/40-MELHORES-JAI-2013.pdf">
                <span class="awards-item-link-media">🏆</span>
                <span class="awards-item-link-text">Aug. 2013:<br>At UFSM - Prize of being placed among the 40 best works of the 28th JAI</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
                <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-special-kudos-1.svg'}" width="794" height="1123">
                <span class="awards-item-link-text">June 14th 2020:<br>CSSDA / SPECIAL KUDOS AWARD - Awarded for the first version of luiskr.com in 2020</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
                <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-inn-Luiskr-1.svg'}"  width="993" height="1273">
                <span class="awards-item-link-text">June 14th 2020:<br>CSSDA / INNOVATION DESIGN AWARD - Awarded for the first version of luiskr.com in 2020</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
                <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-ux-Luiskr-1.svg'}" width="893" height="1132">
                <span class="awards-item-link-text">June 14th 2020:<br>CSSDA / UX DESIGN AWARD - Awarded for the first version of luiskr.com in 2020</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="https://www.cssdesignawards.com/sites/luiskr/37252">
                <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/cssda-ui-Luiskr-1.svg'}"  width="886" height="1123">
                <span class="awards-item-link-text">June 14th 2020:<br>CSSDA / UI DESIGN AWARD - Awarded for the first version of luiskr.com in 2020</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="https://www.topcssgallery.com/gallery/luis-krotz/">
                <span class="awards-item-link-media">🌐</span>
                <span class="awards-item-link-text">Oct. 6th 2021:<br>Featured on TCG</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="https://www.csswinner.com/details/luis-krtz/15699">
                <img class="awards-item-link-media" v-lazy="{src: storage + 'awards/CSSW-15699-Star-Certificate.svg'}"  width="993" height="1132">
                <span class="awards-item-link-text">Oct. 6th 2021:<br>CSSW Star</span>
              </a>
            </li>
            <li class="awards-item">
              <a class="awards-item-link" href="https://mindsparklemag.com/website/luis-krotz">
                <span class="awards-item-link-media">🌐</span>
                <span class="awards-item-link-text">Oct. 13th 2021:<br>Featured on Mindsparkle Mag</span>
              </a>
            </li>
          </ul>
      </div>
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