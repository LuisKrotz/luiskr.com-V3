<template>
  <div id="nav">
    <router-link to="/">Luiskr.com</router-link>
    <!-- <router-link to="/about">About</router-link> -->
  </div>
  <router-view/>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');


body {
  margin: 0;
}

#app {
   font-family: 'Cambay', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1, h2 {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
}

p, span {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 21px;
  font-weight: 400;
}

#nav {
  display: block;
  left: 50%;
  top: 0;
  position: fixed;
  padding: 11px;
  transform: translateX(-50%);
  z-index: 1;
  mix-blend-mode: difference;


  a {
    font-weight: bold;
    color: black;

    // &.router-link-exact-active {
    //   color: white;
    // }
  }
}

ul {
  list-style: none;
}
</style>
