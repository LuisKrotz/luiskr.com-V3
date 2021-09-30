<template>
  <article id="#main" class="legal">
    <h2 class="internal-title">Privacy Policy</h2>

    <section class="internal-description">
      <h3 class="internal-description-text">The Usual Stuff</h3>
      <p class="internal-description-text">At <router-link to="/"><span >luiskr</span></router-link>, accessible from <router-link to="/">https://luiskr.com</router-link>, one of my main priorities is the privacy of my visitors. This Privacy Policy document contains types of information that is collected and recorded by <router-link to="/"><span >luiskr.com</span></router-link> and how I use it.</p>
      <p class="internal-description-text">If you have additional questions or require more information about my Privacy Policy, do not hesitate to contact me.</p>
      <p class="internal-description-text">This Privacy Policy applies only to my online activities and is valid for visitors to my website with regards to the information that they shared and/or collect in <router-link to="/"><span >luiskr.com</span></router-link>. This policy is not applicable to any information collected offline or via channels other than this website.</p>
    </section>
    <section class="internal-description">
      <h3 class="internal-description-text">Consent</h3>
      <p class="internal-description-text">By using my website, you hereby consent to my Privacy Policy and agree to its terms.</p>
    </section>
    <section class="internal-description">
      <h3 class="internal-description-text">Information I collect</h3>
      <p class="internal-description-text">The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point I ask you to provide your personal information.</p>
      <p class="internal-description-text">If you contact me directly, I may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>
    </section>
    <section class="internal-description">
      <h3 class="internal-description-text">How I use your information</h3>
      <p class="internal-description-text">I use the information I collect in various ways, including to:
        <ol>
          <li>Provide, operate, and maintain my website</li>
          <li>Improve, personalize, and expand my website</li>
          <li>Understand and analyze how you use my website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>Find and prevent fraud</li>
          <li>Log Files</li>
        </ol>
      </p>
      <p class="internal-description-text"><router-link to="/"><span >luiskr.com</span></router-link> follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information. My Privacy Policy was created with the help of the Privacy Policy Generator and the Disclaimer Generator.</p>
    </section>
    <section class="internal-description">
      <h3 class="internal-description-text">Third Party Privacy Policies</h3>
      <p class="internal-description-text"><router-link to="/"><span >luiskr.com</span></router-link>'s Privacy Policy does not apply to other advertisers or websites. Thus, I'm advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>
      <p class="internal-description-text">You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>
    </section>
    <section class="internal-description">
      <h3 class="internal-description-text">CCPA Privacy Rights (Do Not Sell My Personal Information)</h3>
      <p class="internal-description-text">Under the CCPA, among other rights, California consumers have the right to:</p>
      <p class="internal-description-text">Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</p>
      <p class="internal-description-text">Request that a business delete any personal data about the consumer that a business has collected.</p>
      <p class="internal-description-text">Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</p>
      <p class="internal-description-text">If you make a request, I have one month to respond to you. If you would like to exercise any of these rights, please contact me.</p>
    </section>
    <section class="internal-description">
      <h3 class="internal-description-text">Children's Information</h3>
      <p class="internal-description-text">Another part of my priority is adding protection for children while using the internet. I encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
      <p class="internal-description-text"><router-link to="/"><span >luiskr.com</span></router-link> does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on my website, I strongly encourage you to contact me <strong>immediately</strong> and I will do my best efforts to promptly find such information.</p>
    </section>
    <Footer />
  </article>
</template>

<script>
import Footer from'../../components/abouts/Footer'

export default {
  components: {
    Footer
  },
  created() {
    document.title = this.$route.meta.title;
  },
  mounted() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  },
  name: 'Privacy Policy',
}
</script>

<style lang="scss">
@import '../../sass/internals';
</style>