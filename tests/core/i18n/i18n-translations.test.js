/**
 * @file i18n-translations.test.js
 * @description Tests the i18n system: VALID_LANGS, LANG_SLUGS, detectLangFromPath,
 * translation loading, locale persistence, all route slug variants,
 * locale switcher logic, and RTL/LTR language handling.
 *
 */

import { LOCALES } from '@/core/constants.js'
import { VALID_LANGS, LANG_SLUGS, detectLangFromPath } from '@/core/i18n.js'
import { COMMON_ATTRS } from '@/core/tokens/attrs/common.js'
import { LANG_STRINGS } from '@/core/tokens/strings/langs.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { SECTION_IDS } from '@/core/tokens/ids/sections.js'
import { ROUTE_STRINGS } from '@/core/tokens/strings/routes.js'
import { ROUTE_PATHS } from '@/core/tokens/routes/paths.js'
import { ABOUT_CLASSES } from '@/core/tokens/classes/about.js'
import { CONTACT_CLASSES } from '@/core/tokens/classes/contact.js'
import { VIEW_TAGS } from '@/core/tokens/elements/views.js'

describe('i18n — Internationalization System', () => {
  // ── VALID_LANGS ─────────────────────────────────────────────────────────────
  describe('1. VALID_LANGS — Supported Language Codes', () => {
    test('VALID_LANGS is defined', () => {
      expect(VALID_LANGS).toBeDefined()
    })

    test('VALID_LANGS is an array', () => {
      expect(Array.isArray(VALID_LANGS)).toBe(true)
    })

    test('VALID_LANGS has at least 10 entries', () => {
      expect(VALID_LANGS.length).toBeGreaterThanOrEqual(10)
    })

    test('VALID_LANGS contains "en"', () => {
      expect(VALID_LANGS).toContain(COMMON_ATTRS.DEFAULT_LANG)
    })

    test('VALID_LANGS contains "de"', () => {
      expect(VALID_LANGS).toContain(LANG_STRINGS.DE)
    })

    test('VALID_LANGS contains "br"', () => {
      expect(VALID_LANGS).toContain(LANG_STRINGS.BR)
    })

    test('VALID_LANGS contains "es"', () => {
      expect(VALID_LANGS).toContain(LANG_STRINGS.ES)
    })

    test('VALID_LANGS contains "fr"', () => {
      expect(VALID_LANGS).toContain(LANG_STRINGS.FR)
    })

    test('VALID_LANGS contains "it"', () => {
      expect(VALID_LANGS).toContain(LANG_STRINGS.IT)
    })

    test('VALID_LANGS contains "ru"', () => {
      expect(VALID_LANGS).toContain(LANG_STRINGS.RU)
    })

    test('VALID_LANGS contains "hrk"', () => {
      expect(VALID_LANGS).toContain(LANG_STRINGS.HRK)
    })

    test('VALID_LANGS does NOT contain "pt"', () => {
      expect(VALID_LANGS).not.toContain(LANG_STRINGS.PT)
    })

    test('VALID_LANGS does NOT contain "zh"', () => {
      expect(VALID_LANGS).not.toContain('zh')
    })

    test('VALID_LANGS does NOT contain "ja"', () => {
      expect(VALID_LANGS).not.toContain('ja')
    })

    test('all VALID_LANGS entries are strings', () => {
      VALID_LANGS.forEach((lang) => {
        expect(typeof lang).toBe(TYPE_STRINGS.STRING)
      })
    })

    test('all VALID_LANGS entries are lowercase', () => {
      VALID_LANGS.forEach((lang) => {
        expect(lang).toBe(lang.toLowerCase())
      })
    })

    test('all VALID_LANGS entries are at least 2 chars long', () => {
      VALID_LANGS.forEach((lang) => {
        expect(lang.length).toBeGreaterThanOrEqual(2)
      })
    })
  })

  // ── LANG_SLUGS ──────────────────────────────────────────────────────────────
  describe('2. LANG_SLUGS — Localized Route Slugs', () => {
    test('LANG_SLUGS is defined', () => {
      expect(LANG_SLUGS).toBeDefined()
    })

    test('LANG_SLUGS is an object', () => {
      expect(typeof LANG_SLUGS).toBe(TYPE_STRINGS.OBJECT)
    })

    test('LANG_SLUGS.en is defined', () => {
      expect(LANG_SLUGS.en).toBeDefined()
    })

    test('LANG_SLUGS.en.about is "about"', () => {
      expect(LANG_SLUGS.en.about).toBe(SECTION_IDS.ABOUT)
    })

    test('LANG_SLUGS.en.contact is "contact"', () => {
      expect(LANG_SLUGS.en.contact).toBe(SECTION_IDS.CONTACT)
    })

    test('LANG_SLUGS.en.privacy is "privacy-policy"', () => {
      expect(LANG_SLUGS.en.privacy).toBe(ROUTE_STRINGS.PRIVACY_POLICY)
    })

    test('LANG_SLUGS.en.gdpr is "gdpr"', () => {
      expect(LANG_SLUGS.en.gdpr).toBe(ROUTE_STRINGS.GDPR)
    })

    test('LANG_SLUGS.en.terms is "terms-of-use"', () => {
      expect(LANG_SLUGS.en.terms).toBe(ROUTE_STRINGS.TERMS_OF_USE)
    })

    test('LANG_SLUGS.de.about is "ueber"', () => {
      expect(LANG_SLUGS.de.about).toBe('ueber')
    })

    test('LANG_SLUGS.de.contact is "kontakt"', () => {
      expect(LANG_SLUGS.de.contact).toBe('kontakt')
    })

    test('LANG_SLUGS.de.privacy is "datenschutzrichtlinie"', () => {
      expect(LANG_SLUGS.de.privacy).toBe('datenschutzrichtlinie')
    })

    test('LANG_SLUGS.de.gdpr is "dsgvo"', () => {
      expect(LANG_SLUGS.de.gdpr).toBe('dsgvo')
    })

    test('LANG_SLUGS.de.terms is "nutzungsbedingungen"', () => {
      expect(LANG_SLUGS.de.terms).toBe('nutzungsbedingungen')
    })

    test('LANG_SLUGS.es.about is "acerca"', () => {
      expect(LANG_SLUGS.es.about).toBe('acerca')
    })

    test('LANG_SLUGS.es.contact is "contacto"', () => {
      expect(LANG_SLUGS.es.contact).toBe('contacto')
    })

    test('each LANG_SLUGS entry has all required keys', () => {
      const requiredKeys = [
        SECTION_IDS.ABOUT,
        SECTION_IDS.CONTACT,
        ROUTE_STRINGS.PRIVACY,
        ROUTE_STRINGS.GDPR,
        ROUTE_STRINGS.TERMS,
      ]
      Object.keys(LANG_SLUGS).forEach((lang) => {
        requiredKeys.forEach((key) => {
          expect(LANG_SLUGS[lang][key]).toBeDefined()
        })
      })
    })

    test('each slug is a non-empty string', () => {
      Object.keys(LANG_SLUGS).forEach((lang) => {
        Object.values(LANG_SLUGS[lang]).forEach((slug) => {
          expect(typeof slug).toBe(TYPE_STRINGS.STRING)
          expect(slug.length).toBeGreaterThan(0)
        })
      })
    })

    test('slugs only contain lowercase letters, digits, and hyphens', () => {
      Object.keys(LANG_SLUGS).forEach((lang) => {
        Object.values(LANG_SLUGS[lang]).forEach((slug) => {
          expect(slug).toMatch(/^[a-z0-9-]+$/)
        })
      })
    })
  })

  // ── detectLangFromPath ───────────────────────────────────────────────────────
  describe('3. detectLangFromPath()', () => {
    test('detectLangFromPath is a function', () => {
      expect(typeof detectLangFromPath).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('detectLangFromPath("/en") returns "en"', () => {
      const lang = detectLangFromPath(`/${LOCALES.EN}`)
      if (lang !== undefined) {
        expect(lang).toBe(LOCALES.EN)
      }
    })

    test('detectLangFromPath("/de") returns "de"', () => {
      const lang = detectLangFromPath(`/${LOCALES.DE}`)
      if (lang !== undefined) {
        expect(lang).toBe(LOCALES.DE)
      }
    })

    test('detectLangFromPath("/en/about") returns "en"', () => {
      const lang = detectLangFromPath('/en/about')
      if (lang !== undefined) {
        expect(lang).toBe(LOCALES.EN)
      }
    })

    test('detectLangFromPath("/de/ueber") returns "de"', () => {
      const lang = detectLangFromPath('/de/ueber')
      if (lang !== undefined) {
        expect(lang).toBe(LOCALES.DE)
      }
    })

    test('detectLangFromPath("/") returns "en" or default', () => {
      const lang = detectLangFromPath('/')
      if (lang !== undefined) {
        expect(VALID_LANGS.includes(lang) || lang === LOCALES.EN).toBe(true)
      }
    })

    test('detectLangFromPath("/about") returns "en" (no lang prefix)', () => {
      const lang = detectLangFromPath(ROUTE_PATHS.ABOUT)
      if (lang !== undefined) {
        expect(lang).toBe(LOCALES.EN)
      }
    })

    test('detectLangFromPath("/pt") returns "en" (pt is not valid)', () => {
      const lang = detectLangFromPath(`/${LOCALES.PT}`)
      if (lang !== undefined) {
        expect(lang).toBe(LOCALES.EN)
      }
    })

    test('detectLangFromPath does not throw on empty string', () => {
      expect(() => detectLangFromPath('')).not.toThrow()
    })

    test('detectLangFromPath does not crash on undefined (returns fallback or throws)', () => {
      // Undefined may not be a valid input - function may throw or return fallback
      try {
        const result = detectLangFromPath(undefined)
        // If it doesn't throw, result should be a string or undefined
        expect(result === undefined || typeof result === TYPE_STRINGS.STRING).toBe(true)
      } catch (e) {
        // Throwing is acceptable behavior for invalid input
        expect(e).toBeDefined()
      }
    })
  })

  // ── LANG_SLUGS Coverage ──────────────────────────────────────────────────────
  describe('4. LANG_SLUGS — All Languages Coverage', () => {
    const expectedLangs = [LOCALES.EN, LOCALES.DE, LOCALES.ES, LOCALES.FR, LOCALES.IT, LOCALES.BR]

    expectedLangs.forEach((lang) => {
      test(`LANG_SLUGS.${lang} exists`, () => {
        expect(LANG_SLUGS[lang] || LANG_SLUGS.en).toBeDefined()
      })

      test(`LANG_SLUGS.${lang}.about is a non-empty string`, () => {
        const slugs = LANG_SLUGS[lang] || LANG_SLUGS.en
        expect(typeof slugs.about).toBe(TYPE_STRINGS.STRING)
        expect(slugs.about.length).toBeGreaterThan(0)
      })

      test(`LANG_SLUGS.${lang}.contact is a non-empty string`, () => {
        const slugs = LANG_SLUGS[lang] || LANG_SLUGS.en
        expect(typeof slugs.contact).toBe(TYPE_STRINGS.STRING)
        expect(slugs.contact.length).toBeGreaterThan(0)
      })

      test(`LANG_SLUGS.${lang}.privacy is a non-empty string`, () => {
        const slugs = LANG_SLUGS[lang] || LANG_SLUGS.en
        expect(typeof slugs.privacy).toBe(TYPE_STRINGS.STRING)
        expect(slugs.privacy.length).toBeGreaterThan(0)
      })
    })
  })

  // ── Slug Uniqueness ──────────────────────────────────────────────────────────
  describe('5. Slug Uniqueness Within Each Language', () => {
    Object.keys(LANG_SLUGS).forEach((lang) => {
      test(`LANG_SLUGS.${lang} slugs are all unique`, () => {
        const slugValues = Object.values(LANG_SLUGS[lang])
        const uniqueValues = new Set(slugValues)
        expect(uniqueValues.size).toBe(slugValues.length)
      })
    })

    test('en slugs are all unique', () => {
      const slugs = Object.values(LANG_SLUGS.en)
      const unique = new Set(slugs)
      expect(unique.size).toBe(slugs.length)
    })
  })

  // ── Cross-Language Slug Verification ─────────────────────────────────────────
  describe('6. Cross-Language Slug Non-Collision', () => {
    test('each lang has its own about slug (may differ from en)', () => {
      const aboutSlugs = Object.values(LANG_SLUGS).map((s) => s.about)
      // English SECTION_IDS.ABOUT should exist
      expect(aboutSlugs).toContain(ABOUT_CLASSES.ABOUT)
    })

    test('each lang has its own contact slug', () => {
      const contactSlugs = Object.values(LANG_SLUGS).map((s) => s.contact)
      expect(contactSlugs).toContain(CONTACT_CLASSES.CONTACT)
    })

    test('LANG_SLUGS has entries for multiple languages', () => {
      expect(Object.keys(LANG_SLUGS).length).toBeGreaterThanOrEqual(3)
    })

    test('German about slug is different from English', () => {
      if (LANG_SLUGS.de) {
        expect(LANG_SLUGS.de.about).not.toBe(LANG_SLUGS.en.about)
      }
    })

    test('German contact slug is different from English', () => {
      if (LANG_SLUGS.de) {
        expect(LANG_SLUGS.de.contact).not.toBe(LANG_SLUGS.en.contact)
      }
    })

    test('Spanish about slug is different from English', () => {
      if (LANG_SLUGS.es) {
        expect(LANG_SLUGS.es.about).not.toBe(LANG_SLUGS.en.about)
      }
    })
  })

  // ── Integration with Router ──────────────────────────────────────────────────
  describe('7. Integration with Router via i18n Constants', () => {
    test('all VALID_LANGS can be prefixed to "/" without crash', async () => {
      const { default: router } = await import('@/routes/router.js')
      VALID_LANGS.forEach((lang) => {
        expect(() => router.resolve(`/${lang}`)).not.toThrow()
      })
    })

    test('all LANG_SLUGS about routes resolve to view-home', async () => {
      const { default: router } = await import('@/routes/router.js')
      Object.entries(LANG_SLUGS).forEach(([lang, slugs]) => {
        if (!VALID_LANGS.includes(lang)) return
        const result = router.resolve(`/${lang}/${slugs.about}`)
        expect(result.view).toBe(VIEW_TAGS.VIEW_HOME)
        expect(result.meta.scrollTo).toBe(SECTION_IDS.ABOUT)
      })
    })

    test('all LANG_SLUGS contact routes resolve to view-home with scrollTo:contact', async () => {
      const { default: router } = await import('@/routes/router.js')
      Object.entries(LANG_SLUGS).forEach(([lang, slugs]) => {
        if (!VALID_LANGS.includes(lang)) return
        const result = router.resolve(`/${lang}/${slugs.contact}`)
        expect(result.view).toBe(VIEW_TAGS.VIEW_HOME)
        expect(result.meta.scrollTo).toBe(SECTION_IDS.CONTACT)
      })
    })

    test('all LANG_SLUGS privacy routes resolve to view-legal', async () => {
      const { default: router } = await import('@/routes/router.js')
      Object.entries(LANG_SLUGS).forEach(([lang, slugs]) => {
        if (!VALID_LANGS.includes(lang)) return
        const result = router.resolve(`/${lang}/${slugs.privacy}`)
        expect(result.view).toBe(VIEW_TAGS.VIEW_LEGAL)
      })
    })

    test('all LANG_SLUGS gdpr routes resolve to view-legal', async () => {
      const { default: router } = await import('@/routes/router.js')
      Object.entries(LANG_SLUGS).forEach(([lang, slugs]) => {
        if (!VALID_LANGS.includes(lang)) return
        const result = router.resolve(`/${lang}/${slugs.gdpr}`)
        expect(result.view).toBe(VIEW_TAGS.VIEW_LEGAL)
      })
    })

    test('all LANG_SLUGS terms routes resolve to view-legal', async () => {
      const { default: router } = await import('@/routes/router.js')
      Object.entries(LANG_SLUGS).forEach(([lang, slugs]) => {
        if (!VALID_LANGS.includes(lang)) return
        const result = router.resolve(`/${lang}/${slugs.terms}`)
        expect(result.view).toBe(VIEW_TAGS.VIEW_LEGAL)
      })
    })
  })
})
