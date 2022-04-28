import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue3-lazyload'
import VueSmoothScroll from 'vue3-smooth-scroll'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDeDr3LDdc34IDBAQc-6BiUOeI32_Hd7HI",
  authDomain: "luiskr-com.firebaseapp.com",
  databaseURL: "https://luiskr-com.firebaseio.com",
  projectId: "luiskr-com",
  messagingSenderId: "967717102790",
  appId: "1:967717102790:web:eea19f216fd097a08163c7",
  measurementId: "G-6KX64X1J2G"
};

const db = initializeApp(firebaseConfig);
const analytics = getAnalytics(db);

createApp(App)
.use(VueLazyLoad, {log: false})
.use(VueSmoothScroll)
.use(store)
.use(router).mount('#app');