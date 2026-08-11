import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index.js'
import { auth } from '../firebase.js'

const title = 'Luis Krötz'
export const VALID_LANGS = ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln']

// ── Translated path slugs per language ───────────────────────────────────────
export const LANG_SLUGS = {
  en:  { about: 'about',       contact: 'contact',  privacy: 'privacy-policy',                 gdpr: 'gdpr',         terms: 'terms-of-use' },
  br:  { about: 'sobre',       contact: 'contato',  privacy: 'politica-de-privacidade',        gdpr: 'lgpd',         terms: 'termos-de-uso' },
  es:  { about: 'acerca',      contact: 'contacto', privacy: 'politica-de-privacidad',         gdpr: 'rgpd',         terms: 'terminos-de-uso' },
  de:  { about: 'ueber',       contact: 'kontakt',  privacy: 'datenschutzrichtlinie',          gdpr: 'dsgvo',        terms: 'nutzungsbedingungen' },
  hrk: { about: 'iwwer-mich',  contact: 'kontakt',  privacy: 'dateschutz-erklerung',           gdpr: 'datenschutz',  terms: 'nutzungsbedingunge' },
  cas: { about: 'sobre-mi',    contact: 'contacto', privacy: 'politica-de-privacidad',         gdpr: 'rgpd',         terms: 'terminos-de-uso' },
  riv: { about: 'sobre-yo',    contact: 'contato',  privacy: 'politica-de-privacidade',        gdpr: 'lgpd-gdpr',    terms: 'termos-de-uso' },
  gn:  { about: 'che-rehegua', contact: 'kontakt',  privacy: 'marandu-nangarekoha',            gdpr: 'lgpd-gdpr',    terms: 'oipuruva-nemoarandu' },
  it:  { about: 'chi-sono',    contact: 'contatti', privacy: 'informativa-sulla-privacy',      gdpr: 'gdpr',         terms: 'termini-di-utilizzo' },
  ru:  { about: 'obo-mne',     contact: 'kontakty', privacy: 'politika-konfidentsialnosti',    gdpr: 'gdpr',         terms: 'usloviya-ispolzovaniya' },
  fr:  { about: 'a-propos',    contact: 'contact',  privacy: 'politique-de-confidentialite',   gdpr: 'rgpd',         terms: 'conditions-utilisation' },
  tln: { about: 'de-mi',       contact: 'contato',  privacy: 'informativa-su-la-privacy',      gdpr: 'gdpr',         terms: 'condission-de-uso' },
}

// ── Portfolio + pages routes shared across all languages ─────────────────────
// These slugs are brand names or English-only, kept the same in all languages.
const portfolioRoutes = (suffix = '') => [
  {
    path: 'portfolio/metcha/:slug?',
    name: 'METCHA' + suffix,
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: { title: title + ' | METCHA', translation: 'metcha', projectRoute: true },
  },
  {
    path: 'portfolio/transa/:slug?',
    name: 'Transa' + suffix,
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: { title: title + ' | TRANSA', translation: 'transa', projectRoute: true },
  },
  {
    path: 'portfolio/aboutmarco/:slug?',
    name: 'Marco Almeida' + suffix,
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: { title: title + ' | Marco Almeida', translation: 'aboutmarco', projectRoute: true },
  },
  {
    path: 'portfolio/melissa/:slug?',
    name: 'Melissa' + suffix,
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: { title: title + ' | Melissa', translation: 'melissa', projectRoute: true },
  },
  {
    path: 'portfolio/minimelissa/:slug?',
    name: 'Minimelissa' + suffix,
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: { title: title + ' | Minimelissa', translation: 'mini-melissa', projectRoute: true },
  },
  {
    path: 'portfolio/mor/:slug?',
    name: 'Mor' + suffix,
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: { title: title + ' | MOR', translation: 'mor', projectRoute: true },
  },
  {
    path: 'portfolio/coza/:slug?',
    name: 'Coza' + suffix,
    component: () => import('../views/Project.vue'),
    meta: { title: title + ' | Coza', translation: 'coza', projectRoute: true },
  },
  {
    path: 'portfolio/brazilian-leather/:slug?',
    name: 'Brazilian Leather' + suffix,
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: { title: title + ' | Brazilian Leather', translation: 'cicb', projectRoute: true },
  },
  {
    path: 'portfolio/cecerele/:slug?',
    name: 'Cecerelê' + suffix,
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: { title: title + ' | Cecerelê', translation: 'cecerele', projectRoute: true },
  },
  {
    path: 'portfolio/clinica-de-desenvolvimento-nathalia-bond/:slug?',
    name: 'Nathalia Bond' + suffix,
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: { title: title + ' | Nathalia Bond', translation: 'nathalia-bond', projectRoute: true },
  },
  {
    path: 'portfolio/vibra/:slug?',
    name: 'Vibra' + suffix,
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: { title: title + ' | Vibra', translation: 'vibra', projectRoute: true },
  },
  {
    path: 'portfolio/genesysinf-sageweb/:slug?',
    name: 'Genesysinf Sageweb' + suffix,
    component: () => import(/* webpackChunkName: "project" */ '../views/Project.vue'),
    meta: { title: title + ' | Genesysinf / Sageweb', translation: 'sage', projectRoute: true },
  },
]

// ── Build routes for a specific language ─────────────────────────────────────
// suffix differentiates named routes (avoids Vue Router duplicates across langs)
const makeRoutes = (lang, suffix = '') => {
  const s = LANG_SLUGS[lang]
  return [
    {
      path: '',
      name: 'Home' + suffix,
      component: Home,
      meta: { title, translation: 'HOME' },
    },
    {
      path: s.about,
      name: 'About' + suffix,
      component: Home,
      meta: { title: title + ' | About', translation: 'HOME', scrollTo: 'about' },
    },
    {
      path: s.contact,
      name: 'Contact' + suffix,
      component: Home,
      meta: { title: title + ' | Contact', translation: 'HOME', scrollTo: 'contact' },
    },
    ...portfolioRoutes(suffix),
    {
      path: s.privacy,
      name: 'Privacy Policy' + suffix,
      component: () => import(/* webpackChunkName: "legal" */ '../views/Legal.vue'),
      meta: { title: title + ' | Privacy Policy', translation: 'privacy-policy', legalRoute: true },
    },
    {
      path: s.gdpr,
      name: 'GDPR' + suffix,
      component: () => import(/* webpackChunkName: "legal" */ '../views/Legal.vue'),
      meta: { title: title + ' | GDPR', translation: 'GDPR', legalRoute: true },
    },
    {
      path: s.terms,
      name: 'Terms of Use' + suffix,
      component: () => import(/* webpackChunkName: "legal" */ '../views/Legal.vue'),
      meta: { title: title + ' | Terms of Use', translation: 'terms-of-use', legalRoute: true },
    },
  ]
}

const routes = [
  // Root routes — English, no lang prefix in URL
  ...makeRoutes('en').map(r => ({ ...r, path: '/' + r.path })),

  // /en explicit prefix (same slugs as root)
  { path: '/en', children: makeRoutes('en', '_en') },

  // All language prefixes with their own translated slugs
  { path: '/br',  children: makeRoutes('br',  '_br')  },
  { path: '/es',  children: makeRoutes('es',  '_es')  },
  { path: '/de',  children: makeRoutes('de',  '_de')  },
  { path: '/hrk', children: makeRoutes('hrk', '_hrk') },
  { path: '/cas', children: makeRoutes('cas', '_cas') },
  { path: '/riv', children: makeRoutes('riv', '_riv') },
  { path: '/gn',  children: makeRoutes('gn',  '_gn')  },
  { path: '/it',  children: makeRoutes('it',  '_it')  },
  { path: '/ru',  children: makeRoutes('ru',  '_ru')  },
  { path: '/fr',  children: makeRoutes('fr',  '_fr')  },
  { path: '/tln', children: makeRoutes('tln', '_tln') },

  // Admin Login route
  {
    path: '/admin',
    name: 'Admin Login',
    component: () => import(/* webpackChunkName: "admin" */ '../views/AdminLogin.vue'),
    meta: { title: title + ' | Admin Login' },
  },

  // Protected CMS Dashboard route
  {
    path: '/cms',
    name: 'CMS Dashboard',
    component: () => import(/* webpackChunkName: "cms" */ '../views/CmsDashboard.vue'),
    meta: { title: title + ' | CMS Dashboard', requiresAuth: true },
  },

  // 404 catch-all
  {
    path: '/:pathMatch(.*)*',
    name: 'Not Found',
    component: () => import('../views/NotFound.vue'),
    meta: { title: title + ' | Page not found', translation: 'not-found' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from) {
    if (to.meta?.projectRoute && from.meta?.projectRoute && to.name === from.name) {
      return false
    }
    if (to.meta?.scrollTo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ el: '#' + to.meta.scrollTo, behavior: 'smooth' })
        }, 600)
      })
    }
    return { top: 0 }
  },
})

// Navigation guard: detect lang from URL path prefix & protect CMS
router.beforeEach((to) => {
  if (to.meta?.requiresAuth && !auth.currentUser) {
    return { name: 'Admin Login' }
  }

  const path = to.path
  let lang = 'en'
  if      (path.startsWith('/br'))  lang = 'br'
  else if (path.startsWith('/es'))  lang = 'es'
  else if (path.startsWith('/de'))  lang = 'de'
  else if (path.startsWith('/hrk')) lang = 'hrk'
  else if (path.startsWith('/cas')) lang = 'cas'
  else if (path.startsWith('/riv')) lang = 'riv'
  else if (path.startsWith('/gn'))  lang = 'gn'
  else if (path.startsWith('/it'))  lang = 'it'
  else if (path.startsWith('/ru'))  lang = 'ru'
  else if (path.startsWith('/fr'))  lang = 'fr'
  else if (path.startsWith('/tln')) lang = 'tln'
  else if (path.startsWith('/en'))  lang = 'en'
  store.commit('setLang', lang)
})

// Catch dynamic chunk loading errors after new deployments and auto-reload page
router.onError((error) => {
  if (
    error?.message?.includes('Failed to fetch dynamically imported module') ||
    error?.message?.includes('Importing a module script failed')
  ) {
    window.location.reload()
  }
})

export default router
