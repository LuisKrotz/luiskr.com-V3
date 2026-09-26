import store from './store.js'
import { VALID_LANGS, LANG_SLUGS, detectLangFromPath } from './i18n.js'
import { deepQuerySelector } from './dom.js'
import {
  BASE_TITLE,
  PROJECT_ALIASES,
  TAGS,
  STRINGS,
  PATHS,
  ROUTE_NAMES,
  TRANSLATION_KEYS,
  EVENTS,
  LOCALES,
  ATTRS,
  IDS,
  TEXT,
  MUTATIONS,
} from './constants.js'

export function normalizeProjectKey(slug) {
  if (!slug) return STRINGS.EMPTY

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

    window.addEventListener(EVENTS.POPSTATE, () => {
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
    const cleanPath = pathname.split(STRINGS.QUESTION)[0].split(STRINGS.HASH)[0] || PATHS.ROOT

    const segments = cleanPath.split(STRINGS.SLASH).filter(Boolean)

    let lang = LOCALES.EN

    let pathSegments = [...segments]

    if (segments.length > 0 && VALID_LANGS.includes(segments[0])) {
      lang = segments[0]

      pathSegments = segments.slice(1)
    }

    const slugs = LANG_SLUGS[lang] || LANG_SLUGS.en

    // Root home
    if (pathSegments.length === 0) {
      return {
        name: ROUTE_NAMES.HOME,
        view: TAGS.VIEW_HOME,
        lang,
        path: cleanPath,
        meta: { title: BASE_TITLE, translation: TRANSLATION_KEYS.HOME },
        params: {},
      }
    }

    const first = pathSegments[0]

    // Admin login
    if (first === STRINGS.ADMIN) {
      return {
        name: ROUTE_NAMES.ADMIN_LOGIN,
        view: TAGS.VIEW_ADMIN_LOGIN,
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} ${TEXT.PIPE_SEP} ${TEXT.ADMIN_LOGIN}` },
        params: {},
      }
    }

    // Protected CMS
    if (first === STRINGS.CMS) {
      return {
        name: ROUTE_NAMES.CMS_DASHBOARD,
        view: TAGS.VIEW_CMS_DASHBOARD,
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} ${TEXT.PIPE_SEP} ${TEXT.CMS_DASHBOARD}`, requiresAuth: true },
        params: {},
      }
    }

    // Check localized about slug
    if (first === slugs.about) {
      return {
        name: ROUTE_NAMES.ABOUT,
        view: TAGS.VIEW_HOME,
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} ${TEXT.PIPE_SEP} ${TEXT.ABOUT}`, translation: TRANSLATION_KEYS.HOME, scrollTo: IDS.ABOUT },
        params: {},
      }
    }

    // Check localized contact slug
    if (first === slugs.contact) {
      return {
        name: ROUTE_NAMES.CONTACT,
        view: TAGS.VIEW_HOME,
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} ${TEXT.PIPE_SEP} ${TEXT.CONTACT}`, translation: TRANSLATION_KEYS.HOME, scrollTo: IDS.CONTACT },
        params: {},
      }
    }

    // Check dynamic portfolio route: portfolio/:projectSlug/:slug?
    if (first === PATHS.PORTFOLIO_SEGMENT && pathSegments.length >= 2) {
      const rawSlug = pathSegments[1]

      const projectSlug = normalizeProjectKey(rawSlug)

      const slug = pathSegments[2] || undefined

      return {
        name: ROUTE_NAMES.PROJECT,
        view: TAGS.VIEW_PROJECT,
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} ${TEXT.PIPE_SEP} Project`, projectRoute: true },
        params: { projectSlug, rawSlug, slug },
      }
    }

    // Check legal routes
    if (first === slugs.privacy || first === STRINGS.PRIVACY || first === STRINGS.PRIVACY_POLICY) {
      return {
        name: ROUTE_NAMES.PRIVACY,
        view: TAGS.VIEW_LEGAL,
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} ${TEXT.PIPE_SEP} ${TEXT.PRIVACY_POLICY}`, translation: TRANSLATION_KEYS.PRIVACY_POLICY, legalRoute: true },
        params: {},
      }
    }

    if (first === slugs.gdpr || first === STRINGS.GDPR) {
      return {
        name: ROUTE_NAMES.GDPR,
        view: TAGS.VIEW_LEGAL,
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} ${TEXT.PIPE_SEP} ${TEXT.GDPR}`, translation: TRANSLATION_KEYS.GDPR, legalRoute: true },
        params: {},
      }
    }

    if (first === slugs.terms || first === STRINGS.TERMS || first === STRINGS.TERMS_OF_USE) {
      return {
        name: ROUTE_NAMES.TERMS,
        view: TAGS.VIEW_LEGAL,
        lang,
        path: cleanPath,
        meta: { title: `${BASE_TITLE} ${TEXT.PIPE_SEP} ${TEXT.TERMS_OF_USE}`, translation: TRANSLATION_KEYS.TERMS_OF_USE, legalRoute: true },
        params: {},
      }
    }

    // Earth / Space Playground
    if (first === PATHS.EARTH_PLAYGROUND_SEGMENT || first === PATHS.SPACE_PLAYGROUND_SEGMENT) {
      return {
        name: ROUTE_NAMES.EARTH_PLAYGROUND,
        view: TAGS.VIEW_SPACE_PLAYGROUND,
        lang,
        path: cleanPath,
        meta: { title: TEXT.EARTH_PLAYGROUND_TITLE, translation: TRANSLATION_KEYS.EARTH_PLAYGROUND },
        params: {},
      }
    }

    // 404
    return {
      name: ROUTE_NAMES.NOT_FOUND,
      view: TAGS.VIEW_NOT_FOUND,
      lang,
      path: cleanPath,
      meta: { title: `${BASE_TITLE} ${TEXT.PIPE_SEP} ${TEXT.PAGE_NOT_FOUND}`, translation: TRANSLATION_KEYS.NOT_FOUND },
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

        if (redirect.name === ROUTE_NAMES.ADMIN_LOGIN) {
          return this.push(PATHS.ADMIN)
        }
      }
    }

    // History update
    if (replace) {
      window.history.replaceState({}, STRINGS.EMPTY, path)
    } else if (window.location.pathname !== to.path) {
      window.history.pushState({}, STRINGS.EMPTY, path)
    }

    this.currentRoute = to

    document.title = to.meta.title || BASE_TITLE

    // Sync canonical link
    let canonicalEl = document.querySelector(STRINGS.LINK_CANONICAL)

    if (!canonicalEl) {
      canonicalEl = document.createElement(TAGS.LINK)

      canonicalEl.setAttribute(STRINGS.REL, STRINGS.REL_CANONICAL)

      document.head.appendChild(canonicalEl)
    }

    const cleanPath = to.path === PATHS.ROOT ? STRINGS.EMPTY : to.path

    canonicalEl.setAttribute(ATTRS.HREF, `${STRINGS.SITE_URL}${cleanPath}`)

    // Handle scroll
    if (to.meta.scrollTo) {
      setTimeout(() => {
        const el = deepQuerySelector(STRINGS.HASH + to.meta.scrollTo)

        if (el) {
          const targetY = window.scrollY + el.getBoundingClientRect().top

          window.scrollTo({ top: targetY, behavior: ATTRS.SMOOTH })
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
    } else if (to.view === TAGS.VIEW_SPACE_PLAYGROUND) {
      await import('../views/SpacePlayground.js')
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
        return PATHS.ADMIN
      }
    } catch {
      return PATHS.ADMIN
    }
  }

  // Update store locale
  const lang = detectLangFromPath(to.path)

  store.commit(MUTATIONS.SET_LANG, lang)
})

export default router

