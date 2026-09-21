import store from './store.js'
import { VALID_LANGS, LANG_SLUGS, detectLangFromPath } from './i18n.js'
import { deepQuerySelector } from './dom.js'
import { BASE_TITLE, PROJECT_ALIASES, TAGS, STRINGS } from './constants.js'

export function normalizeProjectKey(slug) {
  if (!slug) return ''
  return PROJECT_ALIASES[slug] || slug
}

export class Router {

  constructor() {
    this.routes = []
    this.currentRoute = null
    this.listeners = new Set()
    this.beforeHooks = []
    this.afterHooks = []

    this._initPopstateListener()
  }

  _initPopstateListener() {
    if (typeof window === STRINGS.UNDEFINED) return
    window.addEventListener('popstate', () => {
      this.handleNavigation(window.location.pathname + window.location.search + window.location.hash)
    })
  }

  beforeEach(fn) {
    this.beforeHooks.push(fn)
  }

  afterEach(fn) {
    this.afterHooks.push(fn)
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notify(to, from) {
    for (const listener of this.listeners) {
      try {
        listener(to, from)
      } catch (e) {
        console.error('[Router] listener error:', e)
      }
    }
  }

  parsePath(pathname) {
    const cleanPath = pathname.split('?')[0].split('#')[0] || '/'
    const segments = cleanPath.split('/').filter(Boolean)

    let lang = 'en'
    let pathSegments = [...segments]

    if (segments.length > 0 && VALID_LANGS.includes(segments[0])) {
      lang = segments[0]
      pathSegments = segments.slice(1)
    }

    const slugs = LANG_SLUGS[lang] || LANG_SLUGS.en

    // Root home
    if (pathSegments.length === 0) {
      return {
        name: 'Home',
        view: 'view-home',
        lang,
        path: cleanPath,
        meta: { title: BASE_TITLE, translation: 'HOME' },
        params: {},
      }
    }

    const first = pathSegments[0]

    // Admin login
    if (first === 'admin') {
      return {
        name: 'Admin Login',
        view: 'view-admin-login',
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} | Admin Login` },
        params: {},
      }
    }

    // Protected CMS
    if (first === 'cms') {
      return {
        name: 'CMS Dashboard',
        view: 'view-cms-dashboard',
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} | CMS Dashboard`, requiresAuth: true },
        params: {},
      }
    }

    // Check localized about slug
    if (first === slugs.about) {
      return {
        name: 'About',
        view: 'view-home',
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} | About`, translation: 'HOME', scrollTo: 'about' },
        params: {},
      }
    }

    // Check localized contact slug
    if (first === slugs.contact) {
      return {
        name: 'Contact',
        view: 'view-home',
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} | Contact`, translation: 'HOME', scrollTo: 'contact' },
        params: {},
      }
    }

    // Check dynamic portfolio route: portfolio/:projectSlug/:slug?
    if (first === 'portfolio' && pathSegments.length >= 2) {

      const rawSlug = pathSegments[1]
      const projectSlug = normalizeProjectKey(rawSlug)
      const slug = pathSegments[2] || undefined
      return {
        name: 'DynamicProject',
        view: 'view-project',
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} | Project`, projectRoute: true },
        params: { projectSlug, rawSlug, slug },
      }
    }


    // Check legal routes
    if (first === slugs.privacy || first === 'privacy' || first === 'privacy-policy') {
      return {
        name: 'Privacy Policy',
        view: 'view-legal',
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} | Privacy Policy`, translation: 'privacy-policy', legalRoute: true },
        params: {},
      }
    }

    if (first === slugs.gdpr || first === 'gdpr') {
      return {
        name: 'GDPR',
        view: 'view-legal',
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} | GDPR`, translation: 'GDPR', legalRoute: true },
        params: {},
      }
    }

    if (first === slugs.terms || first === 'terms' || first === 'terms-of-use') {
      return {
        name: 'Terms of Use',
        view: 'view-legal',
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} | Terms of Use`, translation: 'terms-of-use', legalRoute: true },
        params: {},
      }
    }

    // 404
    return {
      name: 'Not Found',
      view: 'view-not-found',
      lang,
      path: cleanPath,
      meta: { title: `${BASE_TITLE} | Page not found`, translation: 'not-found' },
      params: {},
    }
  }

  resolve(path) {
    return this.parsePath(path)
  }

  match(path) {
    return this.parsePath(path)
  }

  async handleNavigation(path, replace = false) {
    const to = this.parsePath(path)
    const from = this.currentRoute

    // Execute before hooks
    for (const hook of this.beforeHooks) {
      const redirect = await hook(to, from)
      if (redirect) {
        if (typeof redirect === STRINGS.STRING) {
          return this.push(redirect)
        }
        if (redirect.path) {
          return this.push(redirect.path)
        }
        if (redirect.name === 'Admin Login') {
          return this.push('/admin')
        }
      }
    }

    // History update
    if (replace) {
      window.history.replaceState({}, '', path)
    } else if (window.location.pathname !== to.path) {
      window.history.pushState({}, '', path)
    }

    this.currentRoute = to
    document.title = to.meta.title || BASE_TITLE

    // Sync canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]')
    if (!canonicalEl) {
      canonicalEl = document.createElement('link')
      canonicalEl.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalEl)
    }
    const cleanPath = to.path === '/' ? '' : to.path
    canonicalEl.setAttribute('href', `https://luiskr.com${cleanPath}`)

    // Handle scroll
    if (to.meta.scrollTo) {
      setTimeout(() => {
        const el = deepQuerySelector('#' + to.meta.scrollTo)
        if (el) {
          const targetY = window.scrollY + el.getBoundingClientRect().top
          window.scrollTo({ top: targetY, behavior: 'smooth' })
        }
      }, 300)
    } else {
      window.scrollTo(0, 0)
    }


    // Execute after hooks
    for (const hook of this.afterHooks) {
      hook(to, from)
    }

    if (to.view === TAGS.VIEW_ADMIN_LOGIN) {
      await import('../views/AdminLogin.js')
    } else if (to.view === TAGS.VIEW_CMS_DASHBOARD) {
      await import('../views/CmsDashboard.js')
    }

    this.notify(to, from)
  }

  push(path) {
    return this.handleNavigation(path, false)
  }

  replace(path) {
    return this.handleNavigation(path, true)
  }

  init() {
    this.handleNavigation(window.location.pathname + window.location.search + window.location.hash, true)
  }
}

export const router = new Router()

// Default navigation guards
router.beforeEach(async (to) => {
  // Guard CMS authentication
  if (to.meta?.requiresAuth) {
    try {
      const { getAuthInstance } = await import('../firebase.js')

      const authInstance = await getAuthInstance()

      if (!authInstance?.currentUser) {
        return '/admin'
      }
    } catch {
      return '/admin'
    }
  }

  // Update store locale
  const lang = detectLangFromPath(to.path)
  store.commit('setLang', lang)
})

export default router
