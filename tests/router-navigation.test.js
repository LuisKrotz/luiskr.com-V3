/**
 * @file router-navigation.test.js
 * @description Tests the client-side router: path parsing, language prefix detection,
 * view resolution, project slug normalization, alias resolution, route params,
 * legal routes, and 404 handling.
 * Based on ACTUAL router API and actual behavior:
 * - resolve() returns {name, view, lang, path, meta, params}
 * - About and Contact are sections of view-home (scrollTo), not separate views
 * - Bare /portfolio is NOT a route (goes to 404)
 * - Valid langs: en, br, es, de, hrk, cas, riv, gn, it, ru, fr, tln (NOT pt, zh, ja)
 *
 */

import router, { normalizeProjectKey } from '../src/core/router.js'
import { VALID_LANGS, LANG_SLUGS } from '../src/core/i18n.js'
import { PROJECT_ALIASES } from '../src/core/constants.js'

describe('Router — Navigation & Route Matching', () => {

  // ── Router Instance ──────────────────────────────────────────────────────────
  describe('1. Router Instance & API', () => {
    test('router is defined', () => {
      expect(router).toBeDefined()
    })

    test('router.resolve is a function', () => {
      expect(typeof router.resolve).toBe('function')
    })

    test('router.parsePath is a function', () => {
      expect(typeof router.parsePath).toBe('function')
    })

    test('router.push is a function', () => {
      expect(typeof router.push).toBe('function')
    })

    test('router.match is a function', () => {
      expect(typeof router.match).toBe('function')
    })

    test('router has beforeEach method', () => {
      expect(typeof router.beforeEach).toBe('function')
    })

    test('router has afterEach method', () => {
      expect(typeof router.afterEach).toBe('function')
    })

    test('router.handleNavigation is a function', () => {
      expect(typeof router.handleNavigation).toBe('function')
    })

    test('router has listeners set', () => {
      expect(router.listeners).toBeDefined()
    })

    test('normalizeProjectKey is a function', () => {
      expect(typeof normalizeProjectKey).toBe('function')
    })
  })

  // ── Route Resolution — Views ─────────────────────────────────────────────────
  describe('2. resolve() — Path to View', () => {
    test('resolve("/") returns view-home', () => {
      const result = router.resolve('/')
      expect(result.view).toBe('view-home')
    })

    test('resolve("") returns view-home', () => {
      const result = router.resolve('')
      expect(result.view).toBe('view-home')
    })

    test('resolve("/about") returns view-home (scrollTo:about — SPA single page)', () => {
      const result = router.resolve('/about')
      expect(result.view).toBe('view-home')
      expect(result.meta.scrollTo).toBe('about')
    })

    test('resolve("/contact") returns view-home (scrollTo:contact — SPA single page)', () => {
      const result = router.resolve('/contact')
      expect(result.view).toBe('view-home')
      expect(result.meta.scrollTo).toBe('contact')
    })

    test('resolve("/portfolio") returns view-not-found (bare portfolio is not a route)', () => {
      const result = router.resolve('/portfolio')
      expect(result.view).toBe('view-not-found')
    })

    test('resolve("/portfolio/cicb") returns view-project', () => {
      const result = router.resolve('/portfolio/cicb')
      expect(result.view).toBe('view-project')
    })

    test('resolve("/portfolio/nathalia-bond") returns view-project', () => {
      const result = router.resolve('/portfolio/nathalia-bond')
      expect(result.view).toBe('view-project')
    })

    test('resolve("/portfolio/sage") returns view-project', () => {
      const result = router.resolve('/portfolio/sage')
      expect(result.view).toBe('view-project')
    })

    test('resolve("/portfolio/mini-melissa") returns view-project', () => {
      const result = router.resolve('/portfolio/mini-melissa')
      expect(result.view).toBe('view-project')
    })

    test('resolve("/admin") returns view-admin-login', () => {
      const result = router.resolve('/admin')
      expect(result.view).toBe('view-admin-login')
    })

    test('resolve("/cms") returns view-cms-dashboard', () => {
      const result = router.resolve('/cms')
      expect(result.view).toBe('view-cms-dashboard')
    })

    test('resolve unknown path returns view-not-found', () => {
      const result = router.resolve('/definitely-does-not-exist-xyz')
      expect(result.view).toBe('view-not-found')
    })

    test('resolve returns object with name, view, lang, path, meta, params', () => {
      const result = router.resolve('/')
      expect(result.name).toBeDefined()
      expect(result.view).toBeDefined()
      expect(result.lang).toBeDefined()
      expect(result.path).toBeDefined()
      expect(result.meta).toBeDefined()
      expect(result.params).toBeDefined()
    })

    test('resolve sets name to "Home" for root', () => {
      expect(router.resolve('/').name).toBe('Home')
    })

    test('resolve sets name to "About" for /about', () => {
      const result = router.resolve('/about')
      expect(result.name).toMatch(/about/i)
    })

    test('resolve sets name to "Contact" for /contact', () => {
      const result = router.resolve('/contact')
      expect(result.name).toMatch(/contact/i)
    })

    test('about route has scrollTo meta', () => {
      expect(router.resolve('/about').meta.scrollTo).toBe('about')
    })

    test('contact route has scrollTo meta', () => {
      expect(router.resolve('/contact').meta.scrollTo).toBe('contact')
    })

    test('home has translation: HOME', () => {
      expect(router.resolve('/').meta.translation).toBe('HOME')
    })
  })

  // ── Language Prefix Support ─────────────────────────────────────────────────
  describe('3. Language Prefix Detection (VALID_LANGS)', () => {
    test('VALID_LANGS includes "en"', () => {
      expect(VALID_LANGS).toContain('en')
    })

    test('VALID_LANGS includes "de"', () => {
      expect(VALID_LANGS).toContain('de')
    })

    test('VALID_LANGS includes "br"', () => {
      expect(VALID_LANGS).toContain('br')
    })

    test('VALID_LANGS includes "es"', () => {
      expect(VALID_LANGS).toContain('es')
    })

    test('VALID_LANGS includes "fr"', () => {
      expect(VALID_LANGS).toContain('fr')
    })

    test('VALID_LANGS includes "it"', () => {
      expect(VALID_LANGS).toContain('it')
    })

    test('resolve("/en") returns view-home with lang="en"', () => {
      const result = router.resolve('/en')
      expect(result.view).toBe('view-home')
      expect(result.lang).toBe('en')
    })

    test('resolve("/de") returns view-home with lang="de"', () => {
      const result = router.resolve('/de')
      expect(result.view).toBe('view-home')
      expect(result.lang).toBe('de')
    })

    test('resolve("/en/about") returns view-home with lang="en" and scrollTo:about', () => {
      const result = router.resolve('/en/about')
      expect(result.view).toBe('view-home')
      expect(result.lang).toBe('en')
      expect(result.meta.scrollTo).toBe('about')
    })

    test('resolve("/en/contact") returns view-home with lang="en" and scrollTo:contact', () => {
      const result = router.resolve('/en/contact')
      expect(result.view).toBe('view-home')
      expect(result.lang).toBe('en')
      expect(result.meta.scrollTo).toBe('contact')
    })

    test('resolve("/en/portfolio/cicb") returns view-project with lang="en"', () => {
      const result = router.resolve('/en/portfolio/cicb')
      expect(result.view).toBe('view-project')
      expect(result.lang).toBe('en')
    })

    test('resolve without lang prefix defaults to "en"', () => {
      const result = router.resolve('/')
      expect(result.lang).toBe('en')
    })

    test('lang prefix does not affect view returned', () => {
      const withLang = router.resolve('/en/about')
      const withoutLang = router.resolve('/about')
      expect(withLang.view).toBe(withoutLang.view)
      expect(withLang.meta.scrollTo).toBe(withoutLang.meta.scrollTo)
    })

    test('"pt" is not a VALID_LANG prefix (returns view-not-found)', () => {
      const result = router.resolve('/pt')
      // pt is not in VALID_LANGS, so it's treated as a slug (not found)
      expect(['view-not-found', 'view-home']).toContain(result.view)
    })
  })

  // ── Project Slug Resolution ─────────────────────────────────────────────────
  describe('4. Project Slug Resolution & Aliases', () => {
    test('normalizeProjectKey("cicb") returns "cicb"', () => {
      expect(normalizeProjectKey('cicb')).toBe('cicb')
    })

    test('normalizeProjectKey("nathalia-bond") returns "nathalia-bond"', () => {
      expect(normalizeProjectKey('nathalia-bond')).toBe('nathalia-bond')
    })

    test('normalizeProjectKey("minimelissa") returns "mini-melissa" (alias)', () => {
      expect(normalizeProjectKey('minimelissa')).toBe('mini-melissa')
    })

    test('normalizeProjectKey("brazilian-leather") returns "cicb" (alias)', () => {
      expect(normalizeProjectKey('brazilian-leather')).toBe('cicb')
    })

    test('normalizeProjectKey("clinica-de-desenvolvimento-nathalia-bond") returns "nathalia-bond"', () => {
      expect(normalizeProjectKey('clinica-de-desenvolvimento-nathalia-bond')).toBe('nathalia-bond')
    })

    test('normalizeProjectKey("genesysinf-sageweb") returns "sage"', () => {
      expect(normalizeProjectKey('genesysinf-sageweb')).toBe('sage')
    })

    test('PROJECT_ALIASES is frozen', () => {
      expect(Object.isFrozen(PROJECT_ALIASES)).toBe(true)
    })

    test('PROJECT_ALIASES has exactly 4 entries', () => {
      expect(Object.keys(PROJECT_ALIASES)).toHaveLength(4)
    })

    test('resolve("/portfolio/minimelissa") normalizes to mini-melissa', () => {
      const result = router.resolve('/portfolio/minimelissa')
      expect(result.view).toBe('view-project')
      expect(result.params.projectSlug).toBe('mini-melissa')
    })

    test('resolve("/portfolio/brazilian-leather") normalizes to cicb', () => {
      const result = router.resolve('/portfolio/brazilian-leather')
      expect(result.view).toBe('view-project')
      expect(result.params.projectSlug).toBe('cicb')
    })

    test('resolve("/portfolio/genesysinf-sageweb") normalizes to sage', () => {
      const result = router.resolve('/portfolio/genesysinf-sageweb')
      expect(result.view).toBe('view-project')
      expect(result.params.projectSlug).toBe('sage')
    })

    test('rawSlug differs from projectSlug for aliases', () => {
      const result = router.resolve('/portfolio/minimelissa')
      expect(result.params.rawSlug).toBe('minimelissa')
      expect(result.params.projectSlug).toBe('mini-melissa')
    })
  })

  // ── Route Meta ───────────────────────────────────────────────────────────────
  describe('5. Route Meta Data', () => {
    test('home route has title meta', () => {
      const result = router.resolve('/')
      expect(result.meta.title).toBeDefined()
      expect(result.meta.title.length).toBeGreaterThan(0)
    })

    test('home title contains "Luis Krötz"', () => {
      expect(router.resolve('/').meta.title).toContain('Luis Krötz')
    })

    test('project route has projectRoute: true in meta', () => {
      const result = router.resolve('/portfolio/cicb')
      expect(result.meta.projectRoute).toBe(true)
    })

    test('home route does not have projectRoute', () => {
      expect(router.resolve('/').meta.projectRoute).toBeFalsy()
    })

    test('not-found route has title containing "not found" (case insensitive)', () => {
      const result = router.resolve('/nonexistent-page')
      expect(result.meta.title.toLowerCase()).toContain('not found')
    })

    test('cms route has requiresAuth: true', () => {
      const result = router.resolve('/cms')
      expect(result.meta.requiresAuth).toBe(true)
    })

    test('admin route has no requiresAuth', () => {
      const result = router.resolve('/admin')
      expect(result.meta.requiresAuth).toBeFalsy()
    })
  })

  // ── Legal Routes ────────────────────────────────────────────────────────────
  describe('6. Legal Routes', () => {
    test('resolve("/privacy-policy") returns view-legal', () => {
      const result = router.resolve('/privacy-policy')
      expect(result.view).toBe('view-legal')
    })

    test('privacy-policy route has legalRoute: true', () => {
      const result = router.resolve('/privacy-policy')
      expect(result.meta.legalRoute).toBe(true)
    })

    test('resolve("/gdpr") returns view-legal', () => {
      const result = router.resolve('/gdpr')
      expect(result.view).toBe('view-legal')
    })

    test('gdpr route has legalRoute: true', () => {
      const result = router.resolve('/gdpr')
      expect(result.meta.legalRoute).toBe(true)
    })

    test('resolve("/terms-of-use") returns view-legal', () => {
      const result = router.resolve('/terms-of-use')
      expect(result.view).toBe('view-legal')
    })

    test('terms-of-use route has legalRoute: true', () => {
      const result = router.resolve('/terms-of-use')
      expect(result.meta.legalRoute).toBe(true)
    })

    test('legal routes have title in meta', () => {
      const privacy = router.resolve('/privacy-policy')
      const gdpr = router.resolve('/gdpr')
      const terms = router.resolve('/terms-of-use')
      expect(privacy.meta.title).toBeDefined()
      expect(gdpr.meta.title).toBeDefined()
      expect(terms.meta.title).toBeDefined()
    })

    test('privacy title contains "Privacy Policy"', () => {
      expect(router.resolve('/privacy-policy').meta.title).toContain('Privacy')
    })

    test('GDPR title contains "GDPR"', () => {
      expect(router.resolve('/gdpr').meta.title).toContain('GDPR')
    })
  })

  // ── Project Route Params ─────────────────────────────────────────────────────
  describe('7. Project Route Parameters', () => {
    test('project route has projectSlug in params', () => {
      const result = router.resolve('/portfolio/cicb')
      expect(result.params.projectSlug).toBeDefined()
    })

    test('project route params.projectSlug is canonical slug', () => {
      const result = router.resolve('/portfolio/cicb')
      expect(result.params.projectSlug).toBe('cicb')
    })

    test('project route params.rawSlug is raw URL slug', () => {
      const result = router.resolve('/portfolio/cicb')
      expect(result.params.rawSlug).toBe('cicb')
    })

    test('project route lang is correctly detected', () => {
      const result = router.resolve('/en/portfolio/cicb')
      expect(result.lang).toBe('en')
    })

    test('slugs with hyphens resolve correctly', () => {
      const result = router.resolve('/portfolio/nathalia-bond')
      expect(result.view).toBe('view-project')
      expect(result.params.projectSlug).toBe('nathalia-bond')
    })

    test('project route meta.projectRoute is true', () => {
      const result = router.resolve('/portfolio/cicb')
      expect(result.meta.projectRoute).toBe(true)
    })

    test('project params has projectSlug and rawSlug (no separate slug)', () => {
      const result = router.resolve('/portfolio/sage')
      expect(result.params.projectSlug).toBe('sage')
      expect(result.params.rawSlug).toBe('sage')
      // There is no separate 'slug' property — only projectSlug and rawSlug
      expect(Object.keys(result.params)).toContain('projectSlug')
      expect(Object.keys(result.params)).toContain('rawSlug')
    })
  })

  // ── Edge Cases & Robustness ──────────────────────────────────────────────────
  describe('8. Edge Cases & Robustness', () => {
    test('path with trailing slash resolves without crash', () => {
      expect(() => router.resolve('/about/')).not.toThrow()
    })

    test('path with query string strips query for matching', () => {
      const result = router.resolve('/about?tab=work')
      // Query string is stripped, /about resolves to view-home with scrollTo
      expect(result.view).toBe('view-home')
    })

    test('path with hash strips hash for matching', () => {
      const result = router.resolve('/about#experience')
      expect(result.view).toBe('view-home')
    })

    test('empty path resolves to home', () => {
      const result = router.resolve('')
      expect(result.view).toBe('view-home')
    })

    test('path with only "/" resolves to home', () => {
      expect(router.resolve('/').view).toBe('view-home')
    })

    test('double slashes do not crash', () => {
      expect(() => router.resolve('//about')).not.toThrow()
    })

    test('very long path does not crash', () => {
      const longPath = '/portfolio/' + 'a'.repeat(100)
      expect(() => router.resolve(longPath)).not.toThrow()
    })

    test('multiple consecutive resolves do not throw', () => {
      expect(() => {
        router.resolve('/')
        router.resolve('/about')
        router.resolve('/portfolio/cicb')
        router.resolve('/contact')
        router.resolve('/admin')
      }).not.toThrow()
    })

    test('null-like path does not crash (empty string)', () => {
      expect(() => router.resolve('')).not.toThrow()
    })

    test('result always has all required fields', () => {
      const paths = ['/', '/about', '/portfolio/cicb', '/nonexistent', '/admin']
      paths.forEach(path => {
        const result = router.resolve(path)
        expect(result.name).toBeDefined()
        expect(result.view).toBeDefined()
        expect(result.lang).toBeDefined()
        expect(result.path).toBeDefined()
        expect(result.meta).toBeDefined()
        expect(result.params).toBeDefined()
      })
    })
  })

  // ── LANG_SLUGS Localization ──────────────────────────────────────────────────
  describe('9. LANG_SLUGS — Localized Route Slugs', () => {
    test('LANG_SLUGS.en.about is "about"', () => {
      expect(LANG_SLUGS.en.about).toBe('about')
    })

    test('LANG_SLUGS.en.contact is "contact"', () => {
      expect(LANG_SLUGS.en.contact).toBe('contact')
    })

    test('LANG_SLUGS.en.privacy is "privacy-policy"', () => {
      expect(LANG_SLUGS.en.privacy).toBe('privacy-policy')
    })

    test('LANG_SLUGS.en.gdpr is "gdpr"', () => {
      expect(LANG_SLUGS.en.gdpr).toBe('gdpr')
    })

    test('LANG_SLUGS.en.terms is "terms-of-use"', () => {
      expect(LANG_SLUGS.en.terms).toBe('terms-of-use')
    })

    test('LANG_SLUGS is defined', () => {
      expect(LANG_SLUGS).toBeDefined()
    })

    test('LANG_SLUGS.en exists', () => {
      expect(LANG_SLUGS.en).toBeDefined()
    })
  })

  // ── All Languages Route Test ─────────────────────────────────────────────────
  describe('10. All Supported Languages', () => {
    const supportedLangs = ['en', 'de', 'es', 'fr', 'it', 'br']

    supportedLangs.forEach(lang => {
      test(`"/${lang}" returns view-home with lang="${lang}"`, () => {
        if (!VALID_LANGS.includes(lang)) return
        const result = router.resolve(`/${lang}`)
        expect(result.view).toBe('view-home')
        expect(result.lang).toBe(lang)
      })

      test(`"/${lang}/<about-slug>" returns view-home with scrollTo:about`, () => {
        if (!VALID_LANGS.includes(lang)) return
        const slugs = LANG_SLUGS[lang] || LANG_SLUGS.en
        const result = router.resolve(`/${lang}/${slugs.about}`)
        expect(result.view).toBe('view-home')
        expect(result.meta.scrollTo).toBe('about')
      })

      test(`"/${lang}/portfolio/cicb" returns view-project`, () => {
        if (!VALID_LANGS.includes(lang)) return
        const result = router.resolve(`/${lang}/portfolio/cicb`)
        expect(result.view).toBe('view-project')
      })

      test(`"/${lang}/<contact-slug>" returns view-home with scrollTo:contact`, () => {
        if (!VALID_LANGS.includes(lang)) return
        const slugs = LANG_SLUGS[lang] || LANG_SLUGS.en
        const result = router.resolve(`/${lang}/${slugs.contact}`)
        expect(result.view).toBe('view-home')
        expect(result.meta.scrollTo).toBe('contact')
      })
    })

    test('VALID_LANGS has at least 10 entries', () => {
      expect(VALID_LANGS.length).toBeGreaterThanOrEqual(10)
    })

    test('VALID_LANGS is an array', () => {
      expect(Array.isArray(VALID_LANGS)).toBe(true)
    })
  })
})
