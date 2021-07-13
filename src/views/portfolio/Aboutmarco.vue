<template>
  <div class="about">
    <div style="
      background-image: url('https://lorempixel.com/1920/1080/abstract'); 
      position: relative;
      text-align: right;
      width: 95vw;
      height: 90vh;
      top: 5vh;
      left: 2.5vw;
      box-sizing: border-box;
      padding: 32px 64px;
      text-transform: uppercase">
      <h1 style="font-size: 180px; color: white; font-weight: 900;">Marco Almeida</h1>
    </div>
    <router-view/>
  </div>
  <div>INTERNAL FOOTER
    <ul>
      <li><router-link to="/portfolio/metcha">metcha</router-link></li>
      <li><router-link to="/portfolio/transa">transa</router-link></li>
      <li><router-link to="/portfolio/melissa">melissa</router-link></li>
      <li><router-link to="/portfolio/minimelissa">minimelissa</router-link></li>
      <li><router-link to="/portfolio/mor">mor</router-link></li>
      <li><router-link to="/portfolio/coza">coza</router-link></li>
      <li><router-link to="/portfolio/brazilian-leather">brazilian leather</router-link></li>
      <li><router-link to="/portfolio/vibra">vibra</router-link></li>
      <li><router-link to="/portfolio/genesysinf-sageweb">genesysinf</router-link></li>
    </ul>

    <div>Contact Form | Linkedin | Github | Instagram </div>
  </div>
</template>
