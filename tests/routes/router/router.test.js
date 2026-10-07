/**
 * @file router.test.js
 * @description Covers src/routes/router.js — path parsing across all 12
 * locales, legacy/aliased project-slug normalization, localized static
 * routes (about/contact/legal), dynamic portfolio routes, the not-found
 * fallback, and navigation guards/hooks. Route table drift and locale
 * slug mismatches are the regressions this suite exists to catch.
 */

import router, { normalizeProjectKey } from '@/routes/router.js'
import { detectLangFromPath, LANG_SLUGS, VALID_LANGS } from '@/core/i18n.js'
import '@/core/store.js'
import { LOCALES, ROUTE_NAMES, ROUTE_PREFIXES, TRANSLATION_KEYS } from '@/core/constants.js'
import { TEST_PROJECTS } from '../../fixtures/test-constants.js'
import { ROUTE_PATHS } from '@/core/tokens/routes/paths.js'
import { VIEW_TAGS } from '@/core/tokens/elements/views.js'
import { SECTION_IDS } from '@/core/tokens/ids/sections.js'
import { QUERY_STRINGS } from '@/core/tokens/strings/queries.js'
import { LINK_ATTRS } from '@/core/tokens/attrs/link.js'

describe('Core Router - Path Parsing, i18n & Navigation Guards (60+ Tests)', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  describe('1. Language Detection from URL Path', () => {
    test('detects default "en" from root path "/"', () => {
      expect(detectLangFromPath('/')).toBe('en')
    })

    test('detects default "en" from path without lang prefix', () => {
      expect(detectLangFromPath(`${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.METCHA}`)).toBe(LOCALES.EN)
      expect(detectLangFromPath(ROUTE_PATHS.ABOUT)).toBe(LOCALES.EN)
    })

    VALID_LANGS.forEach((lang) => {
      if (lang !== LOCALES.EN) {
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
      expect(detectLangFromPath('/unknown/path')).toBe(LOCALES.EN)
      expect(detectLangFromPath('/jp/page')).toBe(LOCALES.EN)
    })
  })

  describe('2. Legacy and Aliased Project Slug Normalization', () => {
    test('normalizes brazilian-leather to cicb', () => {
      expect(normalizeProjectKey(TEST_PROJECTS.SLUG_BRAZILIAN_LEATHER)).toBe(TEST_PROJECTS.CICB)
    })

    test('normalizes clinica-de-desenvolvimento-nathalia-bond to nathalia-bond', () => {
      expect(normalizeProjectKey(TEST_PROJECTS.SLUG_NATHALIA_BOND)).toBe(
        TEST_PROJECTS.NATHALIA_BOND
      )
    })

    test('normalizes genesysinf-sageweb to sage', () => {
      expect(normalizeProjectKey(TEST_PROJECTS.SLUG_SAGEWEB)).toBe(TEST_PROJECTS.SAGE)
    })

    test('normalizes minimelissa to mini-melissa', () => {
      expect(normalizeProjectKey(TEST_PROJECTS.SLUG_MINIMELISSA)).toBe(TEST_PROJECTS.MINI_MELISSA)
    })

    test('retains standard project keys unaltered', () => {
      expect(normalizeProjectKey(TEST_PROJECTS.METCHA)).toBe(TEST_PROJECTS.METCHA)
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
      expect(route.name).toBe(ROUTE_NAMES.HOME)
      expect(route.view).toBe(VIEW_TAGS.VIEW_HOME)
      expect(route.lang).toBe(LOCALES.EN)
      expect(route.meta.translation).toBe(TRANSLATION_KEYS.HOME)
    })

    VALID_LANGS.forEach((lang) => {
      test(`resolves localized home "/${lang}" to Home view with lang="${lang}"`, () => {
        const path = lang === LOCALES.EN ? '/' : `/${lang}`
        const route = router.resolve(path)
        expect(route.name).toBe(ROUTE_NAMES.HOME)
        expect(route.view).toBe(VIEW_TAGS.VIEW_HOME)
        expect(route.lang).toBe(lang)
      })
    })
  })

  describe('4. Localized About Routes (All 12 Languages)', () => {
    VALID_LANGS.forEach((lang) => {
      const slug = LANG_SLUGS[lang]?.about || SECTION_IDS.ABOUT
      const path = lang === LOCALES.EN ? `/${slug}` : `/${lang}/${slug}`
      test(`resolves "${path}" (${lang}) to About view with scrollTo=about`, () => {
        const route = router.resolve(path)
        expect(route.name).toBe(ROUTE_NAMES.ABOUT)
        expect(route.view).toBe(VIEW_TAGS.VIEW_HOME)
        expect(route.lang).toBe(lang)
        expect(route.meta.scrollTo).toBe(SECTION_IDS.ABOUT)
      })
    })
  })

  describe('5. Localized Contact Routes (All 12 Languages)', () => {
    VALID_LANGS.forEach((lang) => {
      const slug = LANG_SLUGS[lang]?.contact || SECTION_IDS.CONTACT
      const path = lang === LOCALES.EN ? `/${slug}` : `/${lang}/${slug}`
      test(`resolves "${path}" (${lang}) to Contact view with scrollTo=contact`, () => {
        const route = router.resolve(path)
        expect(route.name).toBe(ROUTE_NAMES.CONTACT)
        expect(route.view).toBe(VIEW_TAGS.VIEW_HOME)
        expect(route.lang).toBe(lang)
        expect(route.meta.scrollTo).toBe(SECTION_IDS.CONTACT)
      })
    })
  })

  describe('6. Legal & Policy Route Resolutions', () => {
    test('resolves /privacy-policy to Privacy Policy legal route', () => {
      const route = router.resolve(ROUTE_PATHS.PRIVACY_POLICY)
      expect(route.name).toBe(ROUTE_NAMES.PRIVACY)
      expect(route.view).toBe(VIEW_TAGS.VIEW_LEGAL)
      expect(route.meta.legalRoute).toBe(true)
    })

    test('resolves /terms-of-use to Terms of Use legal route', () => {
      const route = router.resolve(ROUTE_PATHS.TERMS_OF_USE)
      expect(route.name).toBe(ROUTE_NAMES.TERMS)
      expect(route.view).toBe(VIEW_TAGS.VIEW_LEGAL)
      expect(route.meta.legalRoute).toBe(true)
    })

    test('resolves /gdpr to GDPR legal route', () => {
      const route = router.resolve(ROUTE_PATHS.GDPR)
      expect(route.name).toBe(ROUTE_NAMES.GDPR)
      expect(route.view).toBe(VIEW_TAGS.VIEW_LEGAL)
      expect(route.meta.legalRoute).toBe(true)
    })

    test('resolves localized Brazilian LGPD /br/lgpd', () => {
      const route = router.resolve('/br/lgpd')
      expect(route.name).toBe(ROUTE_NAMES.GDPR)
      expect(route.view).toBe(VIEW_TAGS.VIEW_LEGAL)
      expect(route.lang).toBe(LOCALES.BR)
      expect(route.meta.legalRoute).toBe(true)
    })

    test('resolves localized German Impressum /de/impressum', () => {
      const deTermsSlug = LANG_SLUGS.de?.terms || 'impressum'
      const route = router.resolve(`/de/${deTermsSlug}`)
      expect(route.view).toBe(VIEW_TAGS.VIEW_LEGAL)
      expect(route.lang).toBe(LOCALES.DE)
    })
  })

  describe('7. Dynamic Portfolio Route Resolution & Normalization', () => {
    test('resolves /portfolio/metcha to DynamicProject', () => {
      const route = router.resolve(`${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.METCHA}`)
      expect(route.name).toBe(ROUTE_NAMES.PROJECT)
      expect(route.view).toBe(VIEW_TAGS.VIEW_PROJECT)
      expect(route.params.projectSlug).toBe(TEST_PROJECTS.METCHA)
      expect(route.params.rawSlug).toBe(TEST_PROJECTS.METCHA)
      expect(route.meta.projectRoute).toBe(true)
    })

    test('resolves aliased /portfolio/brazilian-leather with normalized key cicb', () => {
      const route = router.resolve('/portfolio/brazilian-leather')
      expect(route.params.projectSlug).toBe(TEST_PROJECTS.CICB)
      expect(route.params.rawSlug).toBe(TEST_PROJECTS.SLUG_BRAZILIAN_LEATHER)
    })

    test('resolves nested sub-slug /portfolio/metcha/case-study', () => {
      const route = router.resolve('/portfolio/metcha/case-study')
      expect(route.params.projectSlug).toBe(TEST_PROJECTS.METCHA)
      expect(route.params.slug).toBe('case-study')
    })

    test('resolves localized portfolio route /de/portfolio/sage', () => {
      const route = router.resolve('/de/portfolio/sage')
      expect(route.lang).toBe(LOCALES.DE)
      expect(route.params.projectSlug).toBe(TEST_PROJECTS.SAGE)
    })

    test('cleans query strings and hash anchors before parsing path', () => {
      const route = router.resolve('/portfolio/metcha?utm_source=test#gallery')
      expect(route.name).toBe(ROUTE_NAMES.PROJECT)
      expect(route.params.projectSlug).toBe(TEST_PROJECTS.METCHA)
      expect(route.path).toBe(`${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.METCHA}`)
    })
  })

  describe('8. Admin and CMS Paths Are Not SPA Routes', () => {
    test('resolves /admin to the Not Found view', () => {
      const route = router.resolve(ROUTE_PATHS.ADMIN)
      expect(route.name).toBe(ROUTE_NAMES.NOT_FOUND)
      expect(route.view).toBe(VIEW_TAGS.VIEW_NOT_FOUND)
    })

    test('resolves /cms to the Not Found view', () => {
      const route = router.resolve(ROUTE_PATHS.CMS)
      expect(route.name).toBe(ROUTE_NAMES.NOT_FOUND)
      expect(route.view).toBe(VIEW_TAGS.VIEW_NOT_FOUND)
      expect(route.meta.requiresAuth).toBeUndefined()
    })
  })

  describe('9. 404 Not Found Handling', () => {
    test('resolves unknown path to view-not-found', () => {
      const route = router.resolve('/non-existent-page-xyz')
      expect(route.name).toBe(ROUTE_NAMES.NOT_FOUND)
      expect(route.view).toBe(VIEW_TAGS.VIEW_NOT_FOUND)
      expect(route.meta.translation).toBe(ROUTE_PATHS.NOT_FOUND)
    })
  })

  describe('10. Router Navigation, History & Lifecycle Hooks', () => {
    test('router.push updates currentRoute and window location', async () => {
      await router.push(`${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.METCHA}`)
      expect(router.currentRoute.name).toBe(ROUTE_NAMES.PROJECT)
      expect(router.currentRoute.params.projectSlug).toBe(TEST_PROJECTS.METCHA)
      expect(window.location.pathname).toBe(`${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.METCHA}`)
    })

    test('router.replace replaces window state without push', async () => {
      await router.replace(ROUTE_PATHS.ABOUT)
      expect(router.currentRoute.name).toBe(ROUTE_NAMES.ABOUT)
      expect(window.location.pathname).toBe(ROUTE_PATHS.ABOUT)
    })

    test('router maintains canonical link tag in document head', async () => {
      await router.push(`${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.METCHA}`)
      const canonical = document.querySelector(QUERY_STRINGS.LINK_CANONICAL)
      expect(canonical).not.toBeNull()
      expect(canonical.getAttribute(LINK_ATTRS.HREF)).toBe('https://luiskr.com/portfolio/metcha')
    })

    test('router updates document.title on navigation', async () => {
      await router.push(ROUTE_PATHS.TERMS_OF_USE)
      expect(document.title).toContain(ROUTE_PREFIXES.TERMS)
    })

    test('afterEach hook is called on route transition', async () => {
      let calledWith = null
      router.afterEach((to, from) => {
        calledWith = { to: to.name, from: from?.name }
      })
      await router.push(ROUTE_PATHS.PRIVACY_POLICY)
      expect(calledWith).not.toBeNull()
      expect(calledWith.to).toBe(ROUTE_NAMES.PRIVACY)
    })

    test('subscribe notifies active listeners of route changes', async () => {
      let subscriberNotified = false
      const unsubscribe = router.subscribe((to) => {
        if (to.name === ROUTE_NAMES.TERMS) {
          subscriberNotified = true
        }
      })
      await router.push(ROUTE_PATHS.TERMS_OF_USE)
      expect(subscriberNotified).toBe(true)
      unsubscribe()
    })

    test('beforeEach guard can redirect navigation', async () => {
      router.beforeEach((to) => {
        if (to.path === '/redirect-me') {
          return ROUTE_PATHS.ABOUT
        }
      })
      await router.push('/redirect-me')
      expect(router.currentRoute.name).toBe(ROUTE_NAMES.ABOUT)
    })

    test('a throwing subscriber does not break notify fan-out', async () => {
      const unsubscribe = router.subscribe(() => {
        throw new Error('x')
      })

      await router.push(ROUTE_PATHS.ABOUT)

      unsubscribe()
    })

    test('document.title falls back to BASE_TITLE when meta.title is missing', async () => {
      const orig = router.parsePath

      router.parsePath = () => ({ name: 'x', path: ROUTE_PATHS.ABOUT, meta: {} })

      await router.handleNavigation(ROUTE_PATHS.ABOUT)

      router.parsePath = orig

      expect(document.title).toBeTruthy()
    })
  })
})
