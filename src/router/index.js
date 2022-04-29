import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const title = "Luis Krötz"

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: title,
      translation: 'HOME',
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      title: title + ' | About',
      translation: 'about',
    }
  },
  {
    path: '/portfolio/metcha',
    name: 'METCHA',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | METCHA',
      translation: 'metcha',
      projectRoute: true
    }
  },
  {
    path: '/portfolio/transa',
    name: 'Transa',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | TRANSA',
      translation: 'transa',
      projectRoute: true
    }
  },
  {
    path: '/portfolio/aboutmarco',
    name: 'Marco Almeida',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Marco Almeida',
      translation: 'aboutmarco',
      projectRoute: true
    }
  },
  {
    path: '/portfolio/melissa',
    name: 'Melissa',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Melissa',
      translation: 'melissa',
      projectRoute: true
    }
  },
  {
    path: '/portfolio/minimelissa',
    name: 'Minimelissa',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Minimelissa',
      translation: 'mini-melissa',
      projectRoute: true
    }
  },
  {
    path: '/portfolio/mor',
    name: 'Mor',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | MOR',
      translation: 'mor',
      projectRoute: true
    }
  },
  {
    path: '/portfolio/coza',
    name: 'Coza',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project'),
    meta: {
      title: title + ' | Coza',
      translation: 'coza',
      projectRoute: true
    }
  },
  {
    path: '/portfolio/brazilian-leather',
    name: 'Brazilian Leather',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Brazilian Leather',
      translation: 'cicb',
      projectRoute: true
    }
  },
  {
    path: '/portfolio/cecerele',
    name: 'Cecerelê',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Cecerelê',
      translation: 'cecerele',
      projectRoute: true
    }
  },
  {
    path: '/portfolio/clinica-de-desenvolvimento-nathalia-bond',
    name: 'Cliníca de Desenvolvimento - Nathalia Bond',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Cliníca de Desenvolvimento - Nathalia Bond',
      translation: 'nathalia-bond',
      projectRoute: true
    }
  },
  {
    path: '/portfolio/vibra',
    name: 'Vibra',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Vibra',
      translation: 'vibra',
      projectRoute: true
    }
  },
  {
    path: '/portfolio/genesysinf-sageweb',
    name: 'Genesysinf Sageweb',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Genesysinf / Sageweb',
      translation: 'sage',
      projectRoute: true
    }
  },
  {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    component: () => import(/* webpackChunkName: "legal" */ '../views/Legal.vue'),
    meta: {
      title: title + ' | Privacy Policy',
      translation: 'privacy-policy',
      legalRoute: true
    }
  },
  {
    path: '/gdpr',
    name: 'GDPR',
    component: () => import(/* webpackChunkName: "legal" */ '../views/Legal.vue'),
    meta: {
      title: title + ' | GDPR',
      translation: 'GDPR',
      legalRoute: true
    }
  },
  {
    path: '/terms-of-use',
    name: 'Terms of Use',
    component: () => import(/* webpackChunkName: "legal" */ '../views/Legal.vue'),
    meta: {
      title: title + ' | Terms of Use',
      translation: 'terms-of-use',
      legalRoute: true
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: 'Not Found',
    component: () => import(/* webpackChunkName: 'notfound'*/ '../views/NotFound'),
    meta: {
      title: title + ' | Page not found',
      translation: 'not-found',
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
