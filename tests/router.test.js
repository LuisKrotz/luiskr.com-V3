import router, {
  normalizeProjectKey,
} from '../src/core/router.js'
import { detectLangFromPath, LANG_SLUGS, VALID_LANGS } from '../src/core/i18n.js'
import store from '../src/core/store.js'

describe('Core Router - Path Parsing, i18n & Navigation Guards (60+ Tests)', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  describe('1. Language Detection from URL Path', () => {
    test('detects default "en" from root path "/"', () => {
      expect(detectLangFromPath('/')).toBe('en')
    })

    test('detects default "en" from path without lang prefix', () => {
      expect(detectLangFromPath('/portfolio/metcha')).toBe('en')
      expect(detectLangFromPath('/about')).toBe('en')
    })

    VALID_LANGS.forEach((lang) => {
      if (lang !== 'en') {
        test(`detects "${lang}" prefix from /${lang}`, () => {
          expect(detectLangFromPath(`/${lang}`)).toBe(lang)
          expect(detectLangFromPath(`/${lang}/`)).toBe(lang)
        })

        test(`detects "${lang}" prefix from nested /${lang}/portfolio/test`, () => {
          expect(detectLangFromPath(`/${lang}/portfolio/test`)).toBe(lang)
        })
      }
    })

    test('ignores invalid or unknown prefixes and defaults to "en"', () => {
      expect(detectLangFromPath('/unknown/path')).toBe('en')
      expect(detectLangFromPath('/jp/page')).toBe('en')
    })
  })

  describe('2. Legacy and Aliased Project Slug Normalization', () => {
    test('normalizes brazilian-leather to cicb', () => {
      expect(normalizeProjectKey('brazilian-leather')).toBe('cicb')
    })

    test('normalizes clinica-de-desenvolvimento-nathalia-bond to nathalia-bond', () => {
      expect(normalizeProjectKey('clinica-de-desenvolvimento-nathalia-bond')).toBe('nathalia-bond')
    })

    test('normalizes genesysinf-sageweb to sage', () => {
      expect(normalizeProjectKey('genesysinf-sageweb')).toBe('sage')
    })

    test('normalizes minimelissa to mini-melissa', () => {
      expect(normalizeProjectKey('minimelissa')).toBe('mini-melissa')
    })

    test('retains standard project keys unaltered', () => {
      expect(normalizeProjectKey('metcha')).toBe('metcha')
      expect(normalizeProjectKey('dell-design-system')).toBe('dell-design-system')
      expect(normalizeProjectKey('stefanini')).toBe('stefanini')
    })

    test('handles empty or undefined slugs gracefully', () => {
      expect(normalizeProjectKey('')).toBe('')
      expect(normalizeProjectKey(null)).toBe('')
      expect(normalizeProjectKey(undefined)).toBe('')
    })
  })

  describe('3. Root and Localized Home Route Resolution', () => {
    test('resolves default en root "/" to Home view', () => {
      const route = router.resolve('/')
      expect(route.name).toBe('Home')
      expect(route.view).toBe('view-home')
      expect(route.lang).toBe('en')
      expect(route.meta.translation).toBe('HOME')
    })

    VALID_LANGS.forEach((lang) => {
      test(`resolves localized home "/${lang}" to Home view with lang="${lang}"`, () => {
        const path = lang === 'en' ? '/' : `/${lang}`
        const route = router.resolve(path)
        expect(route.name).toBe('Home')
        expect(route.view).toBe('view-home')
        expect(route.lang).toBe(lang)
      })
    })
  })

  describe('4. Localized About Routes (All 12 Languages)', () => {
    VALID_LANGS.forEach((lang) => {
      const slug = LANG_SLUGS[lang]?.about || 'about'
      const path = lang === 'en' ? `/${slug}` : `/${lang}/${slug}`
      test(`resolves "${path}" (${lang}) to About view with scrollTo=about`, () => {
        const route = router.resolve(path)
        expect(route.name).toBe('About')
        expect(route.view).toBe('view-home')
        expect(route.lang).toBe(lang)
        expect(route.meta.scrollTo).toBe('about')
      })
    })
  })

  describe('5. Localized Contact Routes (All 12 Languages)', () => {
    VALID_LANGS.forEach((lang) => {
      const slug = LANG_SLUGS[lang]?.contact || 'contact'
      const path = lang === 'en' ? `/${slug}` : `/${lang}/${slug}`
      test(`resolves "${path}" (${lang}) to Contact view with scrollTo=contact`, () => {
        const route = router.resolve(path)
        expect(route.name).toBe('Contact')
        expect(route.view).toBe('view-home')
        expect(route.lang).toBe(lang)
        expect(route.meta.scrollTo).toBe('contact')
      })
    })
  })

  describe('6. Legal & Policy Route Resolutions', () => {
    test('resolves /privacy-policy to Privacy Policy legal route', () => {
      const route = router.resolve('/privacy-policy')
      expect(route.name).toBe('Privacy Policy')
      expect(route.view).toBe('view-legal')
      expect(route.meta.legalRoute).toBe(true)
    })

    test('resolves /terms-of-use to Terms of Use legal route', () => {
      const route = router.resolve('/terms-of-use')
      expect(route.name).toBe('Terms of Use')
      expect(route.view).toBe('view-legal')
      expect(route.meta.legalRoute).toBe(true)
    })

    test('resolves /gdpr to GDPR legal route', () => {
      const route = router.resolve('/gdpr')
      expect(route.name).toBe('GDPR')
      expect(route.view).toBe('view-legal')
      expect(route.meta.legalRoute).toBe(true)
    })

    test('resolves localized Brazilian LGPD /br/lgpd', () => {
      const route = router.resolve('/br/lgpd')
      expect(route.name).toBe('GDPR')
      expect(route.view).toBe('view-legal')
      expect(route.lang).toBe('br')
      expect(route.meta.legalRoute).toBe(true)
    })

    test('resolves localized German Impressum /de/impressum', () => {
      const deTermsSlug = LANG_SLUGS.de?.terms || 'impressum'
      const route = router.resolve(`/de/${deTermsSlug}`)
      expect(route.view).toBe('view-legal')
      expect(route.lang).toBe('de')
    })
  })

  describe('7. Dynamic Portfolio Route Resolution & Normalization', () => {
    test('resolves /portfolio/metcha to DynamicProject', () => {
      const route = router.resolve('/portfolio/metcha')
      expect(route.name).toBe('DynamicProject')
      expect(route.view).toBe('view-project')
      expect(route.params.projectSlug).toBe('metcha')
      expect(route.params.rawSlug).toBe('metcha')
      expect(route.meta.projectRoute).toBe(true)
    })

    test('resolves aliased /portfolio/brazilian-leather with normalized key cicb', () => {
      const route = router.resolve('/portfolio/brazilian-leather')
      expect(route.params.projectSlug).toBe('cicb')
      expect(route.params.rawSlug).toBe('brazilian-leather')
    })

    test('resolves nested sub-slug /portfolio/metcha/case-study', () => {
      const route = router.resolve('/portfolio/metcha/case-study')
      expect(route.params.projectSlug).toBe('metcha')
      expect(route.params.slug).toBe('case-study')
    })

    test('resolves localized portfolio route /de/portfolio/sage', () => {
      const route = router.resolve('/de/portfolio/sage')
      expect(route.lang).toBe('de')
      expect(route.params.projectSlug).toBe('sage')
    })

    test('cleans query strings and hash anchors before parsing path', () => {
      const route = router.resolve('/portfolio/metcha?utm_source=test#gallery')
      expect(route.name).toBe('DynamicProject')
      expect(route.params.projectSlug).toBe('metcha')
      expect(route.path).toBe('/portfolio/metcha')
    })
  })

  describe('8. Admin and Protected CMS Routes', () => {
    test('resolves /admin to Admin Login view', () => {
      const route = router.resolve('/admin')
      expect(route.name).toBe('Admin Login')
      expect(route.view).toBe('view-admin-login')
      expect(route.meta.requiresAuth).toBeUndefined()
    })

    test('resolves /cms to CMS Dashboard with requiresAuth: true', () => {
      const route = router.resolve('/cms')
      expect(route.name).toBe('CMS Dashboard')
      expect(route.view).toBe('view-cms-dashboard')
      expect(route.meta.requiresAuth).toBe(true)
    })
  })

  describe('9. 404 Not Found Handling', () => {
    test('resolves unknown path to view-not-found', () => {
      const route = router.resolve('/non-existent-page-xyz')
      expect(route.name).toBe('Not Found')
      expect(route.view).toBe('view-not-found')
      expect(route.meta.translation).toBe('not-found')
    })
  })

  describe('10. Router Navigation, History & Lifecycle Hooks', () => {
    test('router.push updates currentRoute and window location', async () => {
      await router.push('/portfolio/metcha')
      expect(router.currentRoute.name).toBe('DynamicProject')
      expect(router.currentRoute.params.projectSlug).toBe('metcha')
      expect(window.location.pathname).toBe('/portfolio/metcha')
    })

    test('router.replace replaces window state without push', async () => {
      await router.replace('/about')
      expect(router.currentRoute.name).toBe('About')
      expect(window.location.pathname).toBe('/about')
    })

    test('router maintains canonical link tag in document head', async () => {
      await router.push('/portfolio/metcha')
      const canonical = document.querySelector('link[rel="canonical"]')
      expect(canonical).not.toBeNull()
      expect(canonical.getAttribute('href')).toBe('https://luiskr.com/portfolio/metcha')
    })

    test('router updates document.title on navigation', async () => {
      await router.push('/admin')
      expect(document.title).toContain('Admin Login')
    })

    test('afterEach hook is called on route transition', async () => {
      let calledWith = null
      router.afterEach((to, from) => {
        calledWith = { to: to.name, from: from?.name }
      })
      await router.push('/privacy-policy')
      expect(calledWith).not.toBeNull()
      expect(calledWith.to).toBe('Privacy Policy')
    })

    test('subscribe notifies active listeners of route changes', async () => {
      let subscriberNotified = false
      const unsubscribe = router.subscribe((to) => {
        if (to.name === 'Terms of Use') {
          subscriberNotified = true
        }
      })
      await router.push('/terms-of-use')
      expect(subscriberNotified).toBe(true)
      unsubscribe()
    })

    test('beforeEach guard can redirect navigation', async () => {
      router.beforeEach((to) => {
        if (to.path === '/redirect-me') {
          return '/about'
        }
      })
      await router.push('/redirect-me')
      expect(router.currentRoute.name).toBe('About')
    })
  })
})
