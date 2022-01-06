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
      title: title + ' | About'
    }
  },
  {
    path: '/portfolio/metcha',
    name: 'METCHA',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "metcha" */ '../views/portfolio/Metcha.vue'),
    meta: {
      title: title + ' | METCHA'
    }
  },
  {
    path: '/portfolio/transa',
    name: 'Transa',
    component: () => import(/* webpackChunkName: "transa" */ '../views/portfolio/Transa.vue'),
    meta: {
      title: title + ' | TRANSA'
    }
  },
  {
    path: '/portfolio/aboutmarco',
    name: 'Marco Almeida',
    component: () => import(/* webpackChunkName: "aboutmarco" */ '../views/portfolio/Aboutmarco.vue'),
    meta: {
      title: title + ' | Marco Almeida'
    }
  },
  {
    path: '/portfolio/melissa',
    name: 'Melissa',
    component: () => import(/* webpackChunkName: "melissa" */ '../views/portfolio/Melissa.vue'),
    meta: {
      title: title + ' | Melissa'
    }
  },
  {
    path: '/portfolio/minimelissa',
    name: 'Minimelissa',
    component: () => import(/* webpackChunkName: "minimelissa" */ '../views/portfolio/Minimelissa.vue'),
    meta: {
      title: title + ' | Minimelissa'
    }
  },
  {
    path: '/portfolio/mor',
    name: 'Mor',
    component: () => import(/* webpackChunkName: "mor" */ '../views/portfolio/Mor.vue'),
    meta: {
      title: title + ' | MOR'
    }
  },
  {
    path: '/portfolio/coza',
    name: 'Coza',
    component: () => import(/* webpackChunkName: "coza" */ '../views/portfolio/Coza.vue'),
    meta: {
      title: title + ' | Coza'
    }
  },
  {
    path: '/portfolio/brazilian-leather',
    name: 'Brazilian Leather',
    component: () => import(/* webpackChunkName: "brazilianleather" */ '../views/portfolio/BrazilianLeather.vue'),
    meta: {
      title: title + ' | Brazilian Leather'
    }
  },
  {
    path: '/portfolio/cecerele',
    name: 'Cecerelê',
    component: () => import(/* webpackChunkName: "cecerele" */ '../views/portfolio/Cecerele.vue'),
    meta: {
      title: title + ' | Cecerelê'
    }
  },
  {
    path: '/portfolio/clinica-de-desenvolvimento-nathalia-bond',
    name: 'Cliníca de Desenvolvimento - Nathalia Bond',
    component: () => import(/* webpackChunkName: "clinicadedesenvolvimentonathaliabond" */ '../views/portfolio/ClinicaDeDesenvolvimentoNathaliaBond.vue'),
    meta: {
      title: title + ' | Cliníca de Desenvolvimento - Nathalia Bond'
    }
  },
  {
    path: '/portfolio/vibra',
    name: 'Vibra',
    component: () => import(/* webpackChunkName: "vibra" */ '../views/portfolio/Vibra.vue'),
    meta: {
      title: title + ' | Vibra'
    }
  },
  {
    path: '/portfolio/genesysinf-sageweb',
    name: 'Genesysinf Sageweb',
    component: () => import(/* webpackChunkName: "sageweb" */ '../views/portfolio/Sageweb.vue'),
    meta: {
      title: title + ' | Genesysinf / Sageweb'
    }
  },
  {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    component: () => import(/* webpackChunkName: "privacypolicy" */ '../views/footer/PrivacyPolicy.vue'),
    meta: {
      title: title + ' | Privacy Policy'
    }
  },
  {
    path: '/gdpr',
    name: 'GDPR',
    component: () => import(/* webpackChunkName: "gdpr" */ '../views/footer/GDPR.vue'),
    meta: {
      title: title + ' | GDPR'
    }
  },
  {
    path: '/terms-of-use',
    name: 'Terms of Use',
    component: () => import(/* webpackChunkName: "termsofuse" */ '../views/footer/TermsOfUse.vue'),
    meta: {
      title: title + ' | Terms of Use'
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
