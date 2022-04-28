import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const title = "Luis Krötz"

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: title
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      title: title + ' | About',
      translation: '/pages/about',
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
      translation: '/metcha'
    }
  },
  {
    path: '/portfolio/transa',
    name: 'Transa',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | TRANSA',
      translation: '/transa'
    }
  },
  {
    path: '/portfolio/aboutmarco',
    name: 'Marco Almeida',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Marco Almeida',
      translation: '/aboutmarco'
    }
  },
  {
    path: '/portfolio/melissa',
    name: 'Melissa',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Melissa',
      translation: '/melissa'
    }
  },
  {
    path: '/portfolio/minimelissa',
    name: 'Minimelissa',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Minimelissa',
      translation: '/mini-melissa'
    }
  },
  {
    path: '/portfolio/mor',
    name: 'Mor',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | MOR',
      translation: '/mor'
    }
  },
  {
    path: '/portfolio/coza',
    name: 'Coza',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project'),
    meta: {
      title: title + ' | Coza',
      translation: '/coza'
    }
  },
  {
    path: '/portfolio/brazilian-leather',
    name: 'Brazilian Leather',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Brazilian Leather',
      translation: '/cicb'
    }
  },
  {
    path: '/portfolio/cecerele',
    name: 'Cecerelê',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Cecerelê',
      translation: '/cecerele'
    }
  },
  {
    path: '/portfolio/clinica-de-desenvolvimento-nathalia-bond',
    name: 'Cliníca de Desenvolvimento - Nathalia Bond',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Cliníca de Desenvolvimento - Nathalia Bond',
      translation: '/nathaliabond'
    }
  },
  {
    path: '/portfolio/vibra',
    name: 'Vibra',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Vibra',
      translation: '/vibra'
    }
  },
  {
    path: '/portfolio/genesysinf-sageweb',
    name: 'Genesysinf Sageweb',
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: {
      title: title + ' | Genesysinf / Sageweb',
      translation: '/sage'
    }
  },
  {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    component: () => import(/* webpackChunkName: "legal" */ '../views/Legal.vue'),
    meta: {
      title: title + ' | Privacy Policy',
      translation: '/privacy-policy'
    }
  },
  {
    path: '/gdpr',
    name: 'GDPR',
    component: () => import(/* webpackChunkName: "legal" */ '../views/Legal.vue'),
    meta: {
      title: title + ' | GDPR',
      translation: '/GDPR'
    }
  },
  {
    path: '/terms-of-use',
    name: 'Terms of Use',
    component: () => import(/* webpackChunkName: "legal" */ '../views/Legal.vue'),
    meta: {
      title: title + ' | Terms of Use',
      translation: '/terms-of-use'
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: 'Not Found',
    component: () => import(/* webpackChunkName: 'notfound'*/ '../views/NotFound'),
    meta: {
      title: title + ' | Page not found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
