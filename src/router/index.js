import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const title = 'Luis Krötz'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: title,
      translation: 'HOME',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: Home,
    meta: {
      title: title + ' | About',
      translation: 'HOME',
      scrollTo: 'about',
    },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Home,
    meta: {
      title: title + ' | Contact',
      translation: 'HOME',
      scrollTo: 'contact',
    },
  },
  {
    path: '/portfolio/metcha/:slug?',
    name: 'METCHA',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | METCHA',
      translation: 'metcha',
      projectRoute: true,
    },
  },
  {
    path: '/portfolio/transa/:slug?',
    name: 'Transa',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | TRANSA',
      translation: 'transa',
      projectRoute: true,
    },
  },
  {
    path: '/portfolio/aboutmarco/:slug?',
    name: 'Marco Almeida',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Marco Almeida',
      translation: 'aboutmarco',
      projectRoute: true,
    },
  },
  {
    path: '/portfolio/melissa/:slug?',
    name: 'Melissa',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Melissa',
      translation: 'melissa',
      projectRoute: true,
    },
  },
  {
    path: '/portfolio/minimelissa/:slug?',
    name: 'Minimelissa',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Minimelissa',
      translation: 'mini-melissa',
      projectRoute: true,
    },
  },
  {
    path: '/portfolio/mor/:slug?',
    name: 'Mor',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | MOR',
      translation: 'mor',
      projectRoute: true,
    },
  },
  {
    path: '/portfolio/coza/:slug?',
    name: 'Coza',
    component: () => import('../views/Project.vue'),
    meta: {
      title: title + ' | Coza',
      translation: 'coza',
      projectRoute: true,
    },
  },
  {
    path: '/portfolio/brazilian-leather/:slug?',
    name: 'Brazilian Leather',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Brazilian Leather',
      translation: 'cicb',
      projectRoute: true,
    },
  },
  {
    path: '/portfolio/cecerele/:slug?',
    name: 'Cecerelê',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Cecerelê',
      translation: 'cecerele',
      projectRoute: true,
    },
  },
  {
    path: '/portfolio/clinica-de-desenvolvimento-nathalia-bond/:slug?',
    name: 'Cliníca de Desenvolvimento - Nathalia Bond',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Cliníca de Desenvolvimento - Nathalia Bond',
      translation: 'nathalia-bond',
      projectRoute: true,
    },
  },
  {
    path: '/portfolio/vibra/:slug?',
    name: 'Vibra',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Vibra',
      translation: 'vibra',
      projectRoute: true,
    },
  },
  {
    path: '/portfolio/genesysinf-sageweb/:slug?',
    name: 'Genesysinf Sageweb',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Genesysinf / Sageweb',
      translation: 'sage',
      projectRoute: true,
    },
  },
  {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    component: () => import(/* webpackChunkName: "legal" */ '../views/Legal.vue'),
    meta: {
      title: title + ' | Privacy Policy',
      translation: 'privacy-policy',
      legalRoute: true,
    },
  },
  {
    path: '/gdpr',
    name: 'GDPR',
    component: () => import(/* webpackChunkName: "legal" */ '../views/Legal.vue'),
    meta: {
      title: title + ' | GDPR',
      translation: 'GDPR',
      legalRoute: true,
    },
  },
  {
    path: '/terms-of-use',
    name: 'Terms of Use',
    component: () => import(/* webpackChunkName: "legal" */ '../views/Legal.vue'),
    meta: {
      title: title + ' | Terms of Use',
      translation: 'terms-of-use',
      legalRoute: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Not Found',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: title + ' | Page not found',
      translation: 'not-found',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.meta?.scrollTo) {
      // Wait for the Home component to render the section
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ el: '#' + to.meta.scrollTo, behavior: 'smooth' })
        }, 600)
      })
    }
    return { top: 0 }
  },
})

export default router

