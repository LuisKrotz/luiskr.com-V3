import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/portfolio/metcha',
    name: 'METCHA',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "metcha" */ '../views/portfolio/Metcha.vue')
  },
  {
    path: '/portfolio/transa',
    name: 'Transa',
    component: () => import(/* webpackChunkName: "transa" */ '../views/portfolio/Transa.vue')
  },
  {
    path: '/portfolio/aboutmarco',
    name: 'Marco Almeida',
    component: () => import(/* webpackChunkName: "aboutmarco" */ '../views/portfolio/Aboutmarco.vue')
  },
  {
    path: '/portfolio/melissa',
    name: 'Melissa',
    component: () => import(/* webpackChunkName: "melissa" */ '../views/portfolio/Melissa.vue')
  },
  {
    path: '/portfolio/minimelissa',
    name: 'Minimelissa',
    component: () => import(/* webpackChunkName: "minimelissa" */ '../views/portfolio/Minimelissa.vue')
  },
  {
    path: '/portfolio/mor',
    name: 'Mor',
    component: () => import(/* webpackChunkName: "mor" */ '../views/portfolio/Mor.vue')
  },
  {
    path: '/portfolio/coza',
    name: 'Coza',
    component: () => import(/* webpackChunkName: "coza" */ '../views/portfolio/Coza.vue')
  },
  {
    path: '/portfolio/brazilian-leather',
    name: 'Brazilian Leather',
    component: () => import(/* webpackChunkName: "brazilianleather" */ '../views/portfolio/BrazilianLeather.vue')
  },
  {
    path: '/portfolio/vibra',
    name: 'Vibra',
    component: () => import(/* webpackChunkName: "vibra" */ '../views/portfolio/Vibra.vue')
  },
  {
    path: '/portfolio/genesysinf-sageweb',
    name: 'Genesysinf Sageweb',
    component: () => import(/* webpackChunkName: "sageweb" */ '../views/portfolio/Sageweb.vue')
  },
  {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    component: () => import(/* webpackChunkName: "sageweb" */ '../views/footer/PrivacyPolicy.vue')
  },
  {
    path: '/gdpr',
    name: 'GDPR',
    component: () => import(/* webpackChunkName: "sageweb" */ '../views/footer/GDPR.vue')
  },
  {
    path: '/terms-of-use',
    name: 'Terms of Use',
    component: () => import(/* webpackChunkName: "sageweb" */ '../views/footer/TermsOfUse.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
