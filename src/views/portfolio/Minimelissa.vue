<template>
  <div :class="modal.class">
    <div id="#main" class="project modal-below" :style="'transform: translateY(-' + modal.transform + 'px);'">
      <h1 class="internal-title">Minimelissa</h1>
      <div class="internal-main">
          <Media
            classes="project-main-item"
            src="minimelissa/website/minimelissa.com.br-31-03-19"
            :width="1943"
            :height="976"
            :isVideo="true"
            label="Minimelissa: homepage full tour"/>
      </div>

      <section class="internal-description">
        <h2 class="internal-description-text">
           Minimelissa was a project developed at Transa for the Melissa brand as a channel for the Minimelissa brand.
        </h2>
        <p class="internal-description-text">
          The project lasted from 2018 to 2020 and was made entirely with Jquery, CSS (Less) and PHP (Laravel). 
        </p>
        <p class="internal-description-text">
          The website consisted of a Content and a Social feed on the homepage with infinite scroll leading to many Minimelissa exclusive content.
        </p>
      </section>
      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/website/minimelissa.com.br-31-03-19-1-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label="Miminelissa: mobile tour"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/website/mini-melissa-cover-2020"
                  :width="1920"
                  :height="1001"
                  :canExpand="true"
                  label="Minimelissa: Feed cover"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/website/mini-melissa-feed-2020"
                  :width="1920"
                  :height="32491"
                  :canExpand="true"
                  label="Minimelissa: Feed screenshoot 2020"/>
            </div>
        </div>
      </section>

      <section class="internal-description">
        <p class="internal-description-text">
         The where to find page was developed with the Google Maps API, and was a central location to find all places where Mini Melissas where sold and Mini Melissa clubs in Brazil and aroud the world.
        </p>
      </section>


      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="minimelissa/where-to-find/mini-melissa-onde-encontrar-2020"
                  :width="1932"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Where to find"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/where-to-find/minimelissa.com.br-onde-encotrar-31-03-19-1-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: where to find - mobile"/>
            </div>
        </div>
      </section>


      <section class="internal-description">
        <p class="internal-description-text">
         On minimelissa, I was the Leading front end developer, and created a CSS framework for the project, called candy with many ready to use and highly customizable componets to allow the fast development of collection and special pages.
        </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="minimelissa/collections/candy-framework/mini-melissa-candy-framework"
                  :width="1918"
                  :height="960"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Candy Framework"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/collections/candy-framework/minimelissa.com.br-candy-31-03-19-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Candy Framework mobile"/>
            </div>
        </div>
      </section>


      <section class="internal-description">
        <p class="internal-description-text">
         Speaking of collections, check out some of Minimelissa's collections. 
        </p>
        <p class="internal-description-text">
         Color me, Spring Summer collection of 2020,  developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="minimelissa/collections/color-me-ss20/minimelissa-ss20"
                  :width="1440"
                  :height="784"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Color Me"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/collections/color-me-ss20/minimelissa-ss20-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Color Me mobile"/>
            </div>
        </div>
      </section>

      <section class="internal-description">
        <p class="internal-description-text">
         Dance Machine, Autumn Winter collection of 2016,  developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="minimelissa/collections/dance-machine-aw16/minimelissa.com.br-aw16-31-03-19"
                  :width="1928"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Dance Machine"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/collections/dance-machine-aw16/minimelissa.com.br-aw16-31-03-19-1-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Dance Machine mobile"/>
            </div>
        </div>
      </section>
  
      <section class="internal-description">
        <p class="internal-description-text">
         Dreamers, Autumn Winter collection of 2020, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="minimelissa/collections/dreamers-aw20/minimelissa-aw20"
                  :width="1440"
                  :height="784"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Dreamers"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/collections/dreamers-aw20/minimelissa-aw20-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Dreamers mobile"/>
            </div>
        </div>
      </section>

      <section class="internal-description">
        <p class="internal-description-text">
         Family, Spring Summer collection of 2019, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="minimelissa/collections/family-ss19/minimelissa.com.br-SS19-31-03-19"
                  :width="1932"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Family"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/collections/family-ss19/minimelissa.com.br-SS19-31-03-19-1-mobile"
                  :width="834"
                  :height="1728"
                  :canExpand="true"

                  :isVideo="true"
                  label="Minimelissa: Family mobile"/>
            </div>
        </div>
      </section>


      <section class="internal-description">
        <p class="internal-description-text">
         Flygrl, Autumn Winter collection of 2017, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="minimelissa/collections/flygrl-aw17/minimelissa.com.br-aw17-31-03-19"
                  :width="1932"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Flygrl"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/collections/flygrl-aw17/minimelissa.com.br-aw17-31-03-19-1-mobile"
                  :width="832"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Flygrl mobile"/>
            </div>
        </div>
      </section>


      <section class="internal-description">
        <p class="internal-description-text">
         Mapping, Spring Summer collection of 2018, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="minimelissa/collections/mapping-ss18/minimelissa.com.br-ss18-31-03-19"
                  :width="1932"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Mapping"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/collections/mapping-ss18/minimelissa.com.br-ss18-31-03-19-1-mobile"
                  :width="832"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Mapping mobile"/>
            </div>
        </div>
      </section>

      <section class="internal-description">
        <p class="internal-description-text">
         Mashup, Spring Summer collection of 2017, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="minimelissa/collections/mashup-ss17/minimelissa.com.br-ss17-31-03-19"
                  :width="1928"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Mashup"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/collections/mashup-ss17/minimelissa.com.br-ss17-31-03-19-1-mobile"
                  :width="833"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Mashup mobile"/>
            </div>
        </div>
      </section>

      <section class="internal-description">
        <p class="internal-description-text">
         Mirror, Autumn Winter collection of 2019, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="minimelissa/collections/mirror-aw19/minimelissa.com.br-aw19-31-03-19"
                  :width="1936"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Mirror"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/collections/mirror-aw19/minimelissa.com.br-aw19-31-03-19-1-mobile"
                  :width="831"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Mirror mobile"/>
            </div>
          </div>
      </section>

      <section class="internal-description">
        <p class="internal-description-text">
          Open Vibes, Autumn Winter collection of 2018, developed in CSS and HTML only, was the first collection page to be displayed on the Minimelissa website.
        </p>
        <p class="internal-description-text">
          Open Vibes, was the page that kickstarted the idea of Minimelissa's candy framework in response to the need to develop collectiob pages in a short space of time, keeping hight quality pixel perfect layouts, and fast pages.
        </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="minimelissa/collections/open-vibes-aw18/aw18"
                  :width="1924"
                  :height="928"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Open Vibes"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/collections/open-vibes-aw18/minimelissa.com.br-aw18-31-03-19-1-mobile"
                  :width="828"
                  :height="1712"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Open Vibes mobile"/>
            </div>
        </div>
      </section>


      <section class="internal-description">
        <p class="internal-description-text">
         Wanna be Carioca, Spring Summer collection of 2016, developed with the candy framework, CSS and HTML only.
        </p>
      </section>

      <section class="internal-extra">
        <div class="internal-extra-scroll">
            <div class="internal-extra-item landscape">
                <Media
                  src="minimelissa/collections/wanna-be-carioca-ss16/minimelissa.com.br-ss16-31-03-19"
                  :width="1928"
                  :height="944"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Wanna be Carioca"/>
            </div>
            <div class="internal-extra-item">
                <Media
                  src="minimelissa/collections/wanna-be-carioca-ss16/minimelissa.com.br-ss16-31-03-19-1-mobile"
                  :width="831"
                  :height="1728"
                  :canExpand="true"
                  :isVideo="true"
                  label="Minimelissa: Wanna be Carioca mobile"/>
            </div>
        </div>
      </section>


      <router-view/>


      <Related />
    </div>

    <aside id="#modal" class="modal-above" v-if="modal.open">
      <MediaExpanded
        :source="modal.media.source"
        :thumb="modal.media.thumb"
        :alt="modal.media.alt"
        :width="modal.media.width"
        :height="modal.media.height"
        :isVideo="modal.media.isVideo"/>
    </aside>
  </div>
</template>

<script>
import Media from'../../components/Media';
import MediaExpanded from'../../components/MediaExpanded';
import Related from'../../components/portfolio/Related';

export default {
  data() {
    return {
      modal: this.$store.getters.getModal
    }
  },
  components: {
    Media,
    MediaExpanded,
    Related
  },
  mounted() {
    window.scrollTo(0,0);
  },
  name: 'Minimelissa',
}
</script>

<style lang="scss">
@import '../../sass/internals';
@import '../../sass/modal';
</style>