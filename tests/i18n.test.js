import {
  VALID_LANGS,
  LANG_SLUGS,
  LANG_OPTIONS,
  detectLangFromPath,
  localePath,
} from '../src/core/i18n.js'

describe('Core i18n & Localization Architecture (60+ Tests)', () => {
  describe('1. Valid Languages & Metadata Structure', () => {
    test('supports exactly 12 international locales', () => {
      expect(VALID_LANGS.length).toBe(12)
      expect(VALID_LANGS).toEqual([
        'en',
        'br',
        'es',
        'de',
        'hrk',
        'cas',
        'riv',
        'gn',
        'it',
        'ru',
        'fr',
        'tln',
      ])
    })

    test('LANG_OPTIONS contains detailed locale metadata for all 12 languages', () => {
      expect(LANG_OPTIONS.length).toBe(12)
      LANG_OPTIONS.forEach((opt) => {
        expect(VALID_LANGS).toContain(opt.code)
        expect(typeof opt.short).toBe('string')
        expect(typeof opt.label).toBe('string')
        expect(typeof opt.cc).toBe('string')
      })
    })

    test('dual-flag regional dialects configure cc and cc2 properly', () => {
      const dualFlagLocales = ['de', 'hrk', 'cas', 'riv', 'tln']
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
        expect(typeof slugs.about).toBe('string')
        expect(typeof slugs.contact).toBe('string')
        expect(typeof slugs.privacy).toBe('string')
        expect(typeof slugs.gdpr).toBe('string')
        expect(typeof slugs.terms).toBe('string')
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
      expect(detectLangFromPath('/jp')).toBe('en')
      expect(detectLangFromPath('/cn/page')).toBe('en')
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
        const expectedUrl = lang === 'en' ? `/${expectedSlug}` : `/${lang}/${expectedSlug}`
        expect(localePath('about', lang)).toBe(expectedUrl)
      })

      test(`localePath("contact", "${lang}") formats correct localized contact URL`, () => {
        const expectedSlug = LANG_SLUGS[lang].contact
        const expectedUrl = lang === 'en' ? `/${expectedSlug}` : `/${lang}/${expectedSlug}`
        expect(localePath('contact', lang)).toBe(expectedUrl)
      })

      test(`localePath("privacy", "${lang}") formats correct localized privacy URL`, () => {
        const expectedSlug = LANG_SLUGS[lang].privacy
        const expectedUrl = lang === 'en' ? `/${expectedSlug}` : `/${lang}/${expectedSlug}`
        expect(localePath('privacy', lang)).toBe(expectedUrl)
      })

      test(`localePath("gdpr", "${lang}") formats correct localized gdpr URL`, () => {
        const expectedSlug = LANG_SLUGS[lang].gdpr
        const expectedUrl = lang === 'en' ? `/${expectedSlug}` : `/${lang}/${expectedSlug}`
        expect(localePath('gdpr', lang)).toBe(expectedUrl)
      })

      test(`localePath("terms", "${lang}") formats correct localized terms URL`, () => {
        const expectedSlug = LANG_SLUGS[lang].terms
        const expectedUrl = lang === 'en' ? `/${expectedSlug}` : `/${lang}/${expectedSlug}`
        expect(localePath('terms', lang)).toBe(expectedUrl)
      })
    })

    test('localePath with arbitrary unmapped slug appends slug directly', () => {
      expect(localePath('portfolio/metcha', 'en')).toBe('/portfolio/metcha')
      expect(localePath('portfolio/metcha', 'br')).toBe('/br/portfolio/metcha')
    })
  })
})
