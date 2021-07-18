<template>
  <div id="nav">
    <router-link to="/">Luiskr.com</router-link>
    <!-- <a href="#welcome" to="/">Luiskr.com</a> -->
    <!-- <div>
      <a href="#portfolio">Portfolio</a> |
      <a href="#about">About</a> |
      <a href="#contact">Contact</a>
    </div> -->
  </div>
  <router-view/>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');


body {
  margin: 0;
  background-color: white;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

h1, h2 {
  font-family: 'Raleway', sans-serif;
  font-weight: 300;
}

p, span {
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: 21px;
  font-weight: 400;
}

#nav {
  padding: 10px 104px;
  left: 0;
  top: 0;
  position: fixed;
  justify-content: space-between;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  mix-blend-mode: difference;


  a {
    font-family: 'Raleway', sans-serif;
    font-weight: bold;
    color: black;
    text-decoration: none;
    font-weight: 500;

    // &.router-link-exact-active {
    //   color: white;
    // }
  }
}

ul {
  list-style: none;
}
</style>
