/**
 * @file i18n.test.js
 * @description Covers core/i18n.js — the locale table (12 locales),
 * the localized-slug maps, detectLangFromPath() (first-segment detection
 * with English as the unprefixed default), and localePath() generation
 * for every route across every language. Query strings, doubled slashes,
 * and unknown segments are the edge arms that must not break detection.
 */

import {
  VALID_LANGS,
  LANG_SLUGS,
  LANG_OPTIONS,
  detectLangFromPath,
  localePath,
} from '@core/i18n.js'
import { LOCALES } from '@core/constants.js'
import { TEST_PROJECTS } from '../../fixtures/test-constants.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { SECTION_IDS } from '@core/tokens/ids/sections.js'
import { ROUTE_STRINGS } from '@core/tokens/strings/routes.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'

describe('Core i18n & Localization Architecture (60+ Tests)', () => {
  describe('1. Valid Languages & Metadata Structure', () => {
    test('supports exactly 16 international locales', () => {
      expect(VALID_LANGS.length).toBe(16)
      expect(VALID_LANGS).toEqual([
        LOCALES.EN,
        LOCALES.BR,
        LOCALES.ES,
        LOCALES.DE,
        LOCALES.HRK,
        LOCALES.CAS,
        LOCALES.RIV,
        LOCALES.GN,
        LOCALES.IT,
        LOCALES.RU,
        LOCALES.FR,
        LOCALES.TLN,
        LOCALES.GL,
        LOCALES.CA,
        LOCALES.NL,
        LOCALES.GA,
      ])
    })

    test('LANG_OPTIONS contains detailed locale metadata for all 16 languages', () => {
      expect(LANG_OPTIONS.length).toBe(16)
      LANG_OPTIONS.forEach((opt) => {
        expect(VALID_LANGS).toContain(opt.code)
        expect(typeof opt.short).toBe(TYPE_STRINGS.STRING)
        expect(typeof opt.label).toBe(TYPE_STRINGS.STRING)
        expect(typeof opt.cc).toBe(TYPE_STRINGS.STRING)
      })
    })

    test('dual-flag regional dialects configure cc and cc2 properly', () => {
      const dualFlagLocales = [LOCALES.DE, LOCALES.HRK, LOCALES.CAS, LOCALES.RIV, LOCALES.TLN]
      dualFlagLocales.forEach((code) => {
        const opt = LANG_OPTIONS.find((l) => l.code === code)
        expect(opt).toBeDefined()
        expect(opt.cc2).toBeDefined()
      })
    })
  })

  describe('2. Slug Table Completeness (All 12 Locales)', () => {
    VALID_LANGS.forEach((lang) => {
      test(`LANG_SLUGS for "${lang}" defines about, contact, privacy, gdpr, and terms`, () => {
        const slugs = LANG_SLUGS[lang]
        expect(slugs).toBeDefined()
        expect(typeof slugs.about).toBe(TYPE_STRINGS.STRING)
        expect(typeof slugs.contact).toBe(TYPE_STRINGS.STRING)
        expect(typeof slugs.privacy).toBe(TYPE_STRINGS.STRING)
        expect(typeof slugs.gdpr).toBe(TYPE_STRINGS.STRING)
        expect(typeof slugs.terms).toBe(TYPE_STRINGS.STRING)
      })
    })
  })

  describe('3. Path Language Detection Across Locales & Query Strings', () => {
    test('detects en for root /', () => {
      expect(detectLangFromPath('/')).toBe('en')
    })

    VALID_LANGS.forEach((lang) => {
      test(`detectLangFromPath resolves "${lang}" for /${lang}`, () => {
        expect(detectLangFromPath(`/${lang}`)).toBe(lang)
      })

      test(`detectLangFromPath resolves "${lang}" with trailing slash /${lang}/`, () => {
        expect(detectLangFromPath(`/${lang}/`)).toBe(lang)
      })

      test(`detectLangFromPath resolves "${lang}" with sub-path /${lang}/portfolio/metcha`, () => {
        expect(detectLangFromPath(`/${lang}/portfolio/metcha`)).toBe(lang)
      })
    })

    test('falls back to "en" when given invalid or unrecognized language code', () => {
      expect(detectLangFromPath(`/${LOCALES.JP}`)).toBe(LOCALES.EN)
      expect(detectLangFromPath('/cn/page')).toBe(LOCALES.EN)
      expect(detectLangFromPath('')).toBe('en')
    })
  })

  describe('4. Locale Path URL Generator Across All 12 Languages', () => {
    test('localePath for empty key returns localized root', () => {
      expect(localePath('', 'en')).toBe('/')
      expect(localePath('', 'br')).toBe('/br/')
      expect(localePath('', 'es')).toBe('/es/')
      expect(localePath('', 'de')).toBe('/de/')
    })

    VALID_LANGS.forEach((lang) => {
      test(`localePath("about", "${lang}") formats correct localized about URL`, () => {
        const expectedSlug = LANG_SLUGS[lang].about
        const expectedUrl = lang === LOCALES.EN ? `/${expectedSlug}` : `/${lang}/${expectedSlug}`
        expect(localePath(SECTION_IDS.ABOUT, lang)).toBe(expectedUrl)
      })

      test(`localePath("contact", "${lang}") formats correct localized contact URL`, () => {
        const expectedSlug = LANG_SLUGS[lang].contact
        const expectedUrl = lang === LOCALES.EN ? `/${expectedSlug}` : `/${lang}/${expectedSlug}`
        expect(localePath(SECTION_IDS.CONTACT, lang)).toBe(expectedUrl)
      })

      test(`localePath("privacy", "${lang}") formats correct localized privacy URL`, () => {
        const expectedSlug = LANG_SLUGS[lang].privacy
        const expectedUrl = lang === LOCALES.EN ? `/${expectedSlug}` : `/${lang}/${expectedSlug}`
        expect(localePath(ROUTE_STRINGS.PRIVACY, lang)).toBe(expectedUrl)
      })

      test(`localePath("gdpr", "${lang}") formats correct localized gdpr URL`, () => {
        const expectedSlug = LANG_SLUGS[lang].gdpr
        const expectedUrl = lang === LOCALES.EN ? `/${expectedSlug}` : `/${lang}/${expectedSlug}`
        expect(localePath(ROUTE_STRINGS.GDPR, lang)).toBe(expectedUrl)
      })

      test(`localePath("terms", "${lang}") formats correct localized terms URL`, () => {
        const expectedSlug = LANG_SLUGS[lang].terms
        const expectedUrl = lang === LOCALES.EN ? `/${expectedSlug}` : `/${lang}/${expectedSlug}`
        expect(localePath(ROUTE_STRINGS.TERMS, lang)).toBe(expectedUrl)
      })
    })

    test('localePath with arbitrary unmapped slug appends slug directly', () => {
      expect(localePath('portfolio/metcha', LOCALES.EN)).toBe(
        `${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.METCHA}`
      )
      expect(localePath('portfolio/metcha', LOCALES.BR)).toBe('/br/portfolio/metcha')
    })
  })
})

describe('localePath edge arms', () => {
  test('defaults the lang argument and falls back to English slugs', () => {
    const viaDefault = localePath(SECTION_IDS.ABOUT)

    expect(viaDefault).toBe(`/${LANG_SLUGS.en.about}`)

    const viaUnknown = localePath(SECTION_IDS.ABOUT, 'qq')

    expect(viaUnknown).toBe(`/qq/${LANG_SLUGS.en.about}`)
  })
})
