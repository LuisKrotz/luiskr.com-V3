<template>
  <div>
    <div id="cover">
      <div id="appendPicture"></div>
      <div id="appendSVG"></div>
      <div id="presentation">
        <h2>A DEV</h2>
        <h3>WITH PASSION FOR UI/UX, JS, CSS AND PERFORMANCE. FOCUSED ON CREATING BEAUTIFUL EXPERIENCES. WORKING AT TRANSA AND FREELANCING IN MY SPARE TIME. CHECK OUT SOME OF THE PROJECTS I PARTICIPATED IN THE LAST FEW YEARS BELOW.</h3>
      </div>
    </div>
    <div>
      
      <h2 style="font-size: 104px">PORTFOLIO</h2>
      <ul>
        <li style="display: inline-block; background: blue; color: white; margin: 10px;" >
          <router-link to="/portfolio/metcha">
          
          <!-- metcha -->
          </router-link>
        </li>
        <li style="display: inline-block; background: blue; color: white; margin: 10px;" >
          <router-link to="/portfolio/transa">
            <video playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <!-- transa -->
          </router-link>
        </li>
        <li style="display: inline-block; background: blue; color: white; margin: 10px;" >
          <router-link to="/portfolio/aboutmarco">
            <video playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <!-- aboutmarco -->
          </router-link>
        </li>
        <li style="display: inline-block; background: blue; color: white; margin: 10px;" >
          <router-link to="/portfolio/melissa">
            <video playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <!-- melissa -->
          </router-link>
        </li>
        <li style="display: inline-block; background: blue; color: white; margin: 10px;" >
          <router-link to="/portfolio/minimelissa">
            <video playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <!-- minimelissa -->
          </router-link>
        </li>
        <li style="display: inline-block; background: blue; color: white; margin: 10px;" >
          <router-link to="/portfolio/mor">
            <video playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <!-- mor -->
          </router-link>
        </li>
        <li style="display: inline-block; background: blue; color: white; margin: 10px;" >
          <router-link to="/portfolio/coza">
            <video playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <!-- coza -->
          </router-link>
        </li>
        <li style="display: inline-block; background: blue; color: white; margin: 10px;" >
          <router-link to="/portfolio/brazilian-leather">
            <video playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <!-- brazilian leather -->
          </router-link>
        </li>
        <li style="display: inline-block; background: blue; color: white; margin: 10px;" >
          <router-link to="/portfolio/vibra">
            <video playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <!-- vibra -->
          </router-link>
        </li>
        <li style="display: inline-block; background: blue; color: white; margin: 10px;" >
          <router-link to="/portfolio/genesysinf-sageweb">
            <video playsinline autoplay loop muted>
              <source :src="storage + 'aboutmarco/home/aboutmarco.com-2020-full-page-home-tour.mp4-scaledown-4x.mp4'" type="video/mp4">
            </video>
            <!-- genesysinf -->
          </router-link>
        </li>
      </ul>
      <router-view/>
    </div>
    <div style="padding: 0 104px;">
      <h2 style="font-size: 104px">ABOUT</h2>
      <p>Reprehenderit dolor exercitation aute consectetur proident incididunt velit excepteur. Aute consequat nostrud sit excepteur. In dolore consectetur incididunt laborum nostrud deserunt nostrud tempor occaecat aliquip culpa culpa. Pariatur quis cillum dolor est reprehenderit irure excepteur reprehenderit non eu do ad. Officia ad voluptate sint reprehenderit labore esse ad magna Lorem in Lorem non. Consectetur laborum laboris eu sunt esse proident sunt aliqua exercitation in mollit amet nulla occaecat. Occaecat tempor ullamco non magna labore elit dolore id nulla est sint eiusmod magna.</p>
      <p>Reprehenderit dolor exercitation aute consectetur proident incididunt velit excepteur. Aute consequat nostrud sit excepteur. In dolore consectetur incididunt laborum nostrud deserunt nostrud tempor occaecat aliquip culpa culpa. Pariatur quis cillum dolor est reprehenderit irure excepteur reprehenderit non eu do ad. Officia ad voluptate sint reprehenderit labore esse ad magna Lorem in Lorem non. Consectetur laborum laboris eu sunt esse proident sunt aliqua exercitation in mollit amet nulla occaecat. Occaecat tempor ullamco non magna labore elit dolore id nulla est sint eiusmod magna.</p>
      <p>Reprehenderit dolor exercitation aute consectetur proident incididunt velit excepteur. Aute consequat nostrud sit excepteur. In dolore consectetur incididunt laborum nostrud deserunt nostrud tempor occaecat aliquip culpa culpa. Pariatur quis cillum dolor est reprehenderit irure excepteur reprehenderit non eu do ad. Officia ad voluptate sint reprehenderit labore esse ad magna Lorem in Lorem non. Consectetur laborum laboris eu sunt esse proident sunt aliqua exercitation in mollit amet nulla occaecat. Occaecat tempor ullamco non magna labore elit dolore id nulla est sint eiusmod magna.</p>
      <p>Reprehenderit dolor exercitation aute consectetur proident incididunt velit excepteur. Aute consequat nostrud sit excepteur. In dolore consectetur incididunt laborum nostrud deserunt nostrud tempor occaecat aliquip culpa culpa. Pariatur quis cillum dolor est reprehenderit irure excepteur reprehenderit non eu do ad. Officia ad voluptate sint reprehenderit labore esse ad magna Lorem in Lorem non. Consectetur laborum laboris eu sunt esse proident sunt aliqua exercitation in mollit amet nulla occaecat. Occaecat tempor ullamco non magna labore elit dolore id nulla est sint eiusmod magna.</p>
      <p>Reprehenderit dolor exercitation aute consectetur proident incididunt velit excepteur. Aute consequat nostrud sit excepteur. In dolore consectetur incididunt laborum nostrud deserunt nostrud tempor occaecat aliquip culpa culpa. Pariatur quis cillum dolor est reprehenderit irure excepteur reprehenderit non eu do ad. Officia ad voluptate sint reprehenderit labore esse ad magna Lorem in Lorem non. Consectetur laborum laboris eu sunt esse proident sunt aliqua exercitation in mollit amet nulla occaecat. Occaecat tempor ullamco non magna labore elit dolore id nulla est sint eiusmod magna.</p>
      <p>Reprehenderit dolor exercitation aute consectetur proident incididunt velit excepteur. Aute consequat nostrud sit excepteur. In dolore consectetur incididunt laborum nostrud deserunt nostrud tempor occaecat aliquip culpa culpa. Pariatur quis cillum dolor est reprehenderit irure excepteur reprehenderit non eu do ad. Officia ad voluptate sint reprehenderit labore esse ad magna Lorem in Lorem non. Consectetur laborum laboris eu sunt esse proident sunt aliqua exercitation in mollit amet nulla occaecat. Occaecat tempor ullamco non magna labore elit dolore id nulla est sint eiusmod magna.</p>
    </div>
    <div>
      <h2 style="font-size: 62px">AWARDS</h2>
      <div style="display: inline-block; background: green; color: white; margin: 10px; width: 300px; height: 200px">
      Premio 40 melhores
      </div>
      <div style="display: inline-block; background: green; color: white; margin: 10px; width: 300px; height: 200px">Luiskr.com</div>
    </div>
    <div style="margin-top: 104px; padding: 32px 32px 64px; box-sizing: border-box; background: black; color: white;">
      <div style="font-size: 104px;">Contact Form</div>
      <div style="font-size: 16px;">Linkedin | Github | Instagram </div>
      <div style="font-size: 16px;">
        <router-link to="/heritage">Heritage</router-link> | 
        <router-link to="/privacy-policy">Privacy Policy</router-link> | 
        <router-link to="/GDPR">GDPR</router-link> | 
        <router-link to="/terms-of-use">Terms of use</router-link>
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
  mounted() {
    console.log(this.storage)
  }
}
</script>


<style lang="scss">
    #cover {
      transition: border-radius 2.4s linear, transform ease-in 2s;
      position: relative;
      background-color: black;
      width: 95vw;
      height: 90vh;
      top: 5vh;
      left: 2.5vw;
      overflow: hidden;
      transform: scale(1.3);
      animation: intro 2s ease-in forwards;
    }

    #presentation {
      color: white;
      right: 34px;
      position: absolute;
      width: 70%;
      text-align: right;
      top: 50%;
      transform: translateY(-50%);

      h2 {
        font-size: 64px;
      }

      h3 {
        font-size: 32px;
      }
    }

    #appendSVG {
        transition: opacity ease-in-out 3s;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        opacity: .5;

        background-size: 100px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 304 304' width='304' height='304'%3E%3Cpath fill='%23181818' fill-opacity='1' d='M44.1 224a5 5 0 1 1 0 2H0v-2h44.1zm160 48a5 5 0 1 1 0 2H82v-2h122.1zm57.8-46a5 5 0 1 1 0-2H304v2h-42.1zm0 16a5 5 0 1 1 0-2H304v2h-42.1zm6.2-114a5 5 0 1 1 0 2h-86.2a5 5 0 1 1 0-2h86.2zm-256-48a5 5 0 1 1 0 2H0v-2h12.1zm185.8 34a5 5 0 1 1 0-2h86.2a5 5 0 1 1 0 2h-86.2zM258 12.1a5 5 0 1 1-2 0V0h2v12.1zm-64 208a5 5 0 1 1-2 0v-54.2a5 5 0 1 1 2 0v54.2zm48-198.2V80h62v2h-64V21.9a5 5 0 1 1 2 0zm16 16V64h46v2h-48V37.9a5 5 0 1 1 2 0zm-128 96V208h16v12.1a5 5 0 1 1-2 0V210h-16v-76.1a5 5 0 1 1 2 0zm-5.9-21.9a5 5 0 1 1 0 2H114v48H85.9a5 5 0 1 1 0-2H112v-48h12.1zm-6.2 130a5 5 0 1 1 0-2H176v-74.1a5 5 0 1 1 2 0V242h-60.1zm-16-64a5 5 0 1 1 0-2H114v48h10.1a5 5 0 1 1 0 2H112v-48h-10.1zM66 284.1a5 5 0 1 1-2 0V274H50v30h-2v-32h18v12.1zM236.1 176a5 5 0 1 1 0 2H226v94h48v32h-2v-30h-48v-98h12.1zm25.8-30a5 5 0 1 1 0-2H274v44.1a5 5 0 1 1-2 0V146h-10.1zm-64 96a5 5 0 1 1 0-2H208v-80h16v-14h-42.1a5 5 0 1 1 0-2H226v18h-16v80h-12.1zm86.2-210a5 5 0 1 1 0 2H272V0h2v32h10.1zM98 101.9V146H53.9a5 5 0 1 1 0-2H96v-42.1a5 5 0 1 1 2 0zM53.9 34a5 5 0 1 1 0-2H80V0h2v34H53.9zm60.1 3.9V66H82v64H69.9a5 5 0 1 1 0-2H80V64h32V37.9a5 5 0 1 1 2 0zM101.9 82a5 5 0 1 1 0-2H128V37.9a5 5 0 1 1 2 0V82h-28.1zm16-64a5 5 0 1 1 0-2H146v44.1a5 5 0 1 1-2 0V18h-26.1zm102.2 270a5 5 0 1 1 0 2H98v14h-2v-16h124.1zM242 149.9V160h16v34h-16v62h48v48h-2v-46h-48v-66h16v-30h-16v-12.1a5 5 0 1 1 2 0zM53.9 18a5 5 0 1 1 0-2H64V2H48V0h18v18H53.9zm112 32a5 5 0 1 1 0-2H192V0h50v2h-48v48h-28.1zm-48-48a5 5 0 0 1-9.8-2h2.07a3 3 0 1 0 5.66 0H178v34h-18V21.9a5 5 0 1 1 2 0V32h14V2h-58.1zm0 96a5 5 0 1 1 0-2H137l32-32h39V21.9a5 5 0 1 1 2 0V66h-40.17l-32 32H117.9zm28.1 90.1a5 5 0 1 1-2 0v-76.51L175.59 80H224V21.9a5 5 0 1 1 2 0V82h-49.59L146 112.41v75.69zm16 32a5 5 0 1 1-2 0v-99.51L184.59 96H300.1a5 5 0 0 1 3.9-3.9v2.07a3 3 0 0 0 0 5.66v2.07a5 5 0 0 1-3.9-3.9H185.41L162 121.41v98.69zm-144-64a5 5 0 1 1-2 0v-3.51l48-48V48h32V0h2v50H66v55.41l-48 48v2.69zM50 53.9v43.51l-48 48V208h26.1a5 5 0 1 1 0 2H0v-65.41l48-48V53.9a5 5 0 1 1 2 0zm-16 16V89.41l-34 34v-2.82l32-32V69.9a5 5 0 1 1 2 0zM12.1 32a5 5 0 1 1 0 2H9.41L0 43.41V40.6L8.59 32h3.51zm265.8 18a5 5 0 1 1 0-2h18.69l7.41-7.41v2.82L297.41 50H277.9zm-16 160a5 5 0 1 1 0-2H288v-71.41l16-16v2.82l-14 14V210h-28.1zm-208 32a5 5 0 1 1 0-2H64v-22.59L40.59 194H21.9a5 5 0 1 1 0-2H41.41L66 216.59V242H53.9zm150.2 14a5 5 0 1 1 0 2H96v-56.6L56.6 162H37.9a5 5 0 1 1 0-2h19.5L98 200.6V256h106.1zm-150.2 2a5 5 0 1 1 0-2H80v-46.59L48.59 178H21.9a5 5 0 1 1 0-2H49.41L82 208.59V258H53.9zM34 39.8v1.61L9.41 66H0v-2h8.59L32 40.59V0h2v39.8zM2 300.1a5 5 0 0 1 3.9 3.9H3.83A3 3 0 0 0 0 302.17V256h18v48h-2v-46H2v42.1zM34 241v63h-2v-62H0v-2h34v1zM17 18H0v-2h16V0h2v18h-1zm273-2h14v2h-16V0h2v16zm-32 273v15h-2v-14h-14v14h-2v-16h18v1zM0 92.1A5.02 5.02 0 0 1 6 97a5 5 0 0 1-6 4.9v-2.07a3 3 0 1 0 0-5.66V92.1zM80 272h2v32h-2v-32zm37.9 32h-2.07a3 3 0 0 0-5.66 0h-2.07a5 5 0 0 1 9.8 0zM5.9 0A5.02 5.02 0 0 1 0 5.9V3.83A3 3 0 0 0 3.83 0H5.9zm294.2 0h2.07A3 3 0 0 0 304 3.83V5.9a5 5 0 0 1-3.9-5.9zm3.9 300.1v2.07a3 3 0 0 0-1.83 1.83h-2.07a5 5 0 0 1 3.9-3.9zM97 100a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-48 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 96a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-144a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM49 36a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM33 68a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 240a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm80-176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm112 176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 180a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 84a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'%3E%3C/path%3E%3C/svg%3E");
    }

    #appendPicture {
        //background-attachment: fixed;
        position: absolute;
        top: 0;
        left: -50%;
        height: 100%;
        width: 100%;
        background-image: url('data:image/jpeg;base64,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');
        background-repeat: no-repeat;
        transform: none;
        background-size: cover;
        filter: blur(5px) contrast(1.25);
        opacity: .25;
        background-position: center;
    }

    @keyframes intro {
      to {
        transform: scale(1);
        border-radius: 20px;
      }
    }
</style>