/**
 * @file router-meta.test.js
 * @description Comprehensive tests for router route metadata — page titles,
 * view names, params, and i18n compatibility across all supported languages.
 * Tests locale-specific routing behavior (slug translations) and verifies
 * the SPA structure where about/contact scroll to sections on view-home.
 * 200+ tests.
 */

import router from '../src/core/router.js'
import { LANG_SLUGS, VALID_LANGS } from '../src/core/i18n.js'

const LANGS = VALID_LANGS
const NON_EN_LANGS = LANGS.filter(l => l !== 'en')

describe('Router Meta & i18n Integration (200+ tests)', () => {

  // ── English Route Metadata ────────────────────────────────────────────────────
  describe('1. English Routes — View Names', () => {
    const routes = [
      { path: '/', view: 'view-home' },
      { path: '/portfolio/cicb', view: 'view-project' },
      { path: '/portfolio/nathalia-bond', view: 'view-project' },
      { path: '/portfolio/sage', view: 'view-project' },
      { path: '/portfolio/mini-melissa', view: 'view-project' },
      // About and contact are sections in view-home
      { path: '/about', view: 'view-home' },
      { path: '/contact', view: 'view-home' },
    ]

    routes.forEach(({ path, view }) => {
      test(`${path} resolves to view="${view}"`, () => {
        expect(router.resolve(path).view).toBe(view)
      })

      test(`${path} has meta.title (string)`, () => {
        const result = router.resolve(path)
        expect(typeof result.meta.title).toBe('string')
      })

      test(`${path} meta.title is non-empty`, () => {
        const result = router.resolve(path)
        expect(result.meta.title.length).toBeGreaterThan(0)
      })
    })
  })

  // ── Section Routing — scrollTo ────────────────────────────────────────────────
  describe('2. Section Routes — scrollTo Meta', () => {
    test('/about has meta.scrollTo = "about"', () => {
      expect(router.resolve('/about').meta.scrollTo).toBe('about')
    })

    test('/contact has meta.scrollTo = "contact"', () => {
      expect(router.resolve('/contact').meta.scrollTo).toBe('contact')
    })

    test('/ does not have meta.scrollTo', () => {
      const meta = router.resolve('/').meta
      expect(meta.scrollTo).toBeFalsy()
    })

    test('/portfolio/cicb does not have meta.scrollTo', () => {
      const meta = router.resolve('/portfolio/cicb').meta
      expect(meta.scrollTo).toBeFalsy()
    })
  })

  // ── German Route Metadata ──────────────────────────────────────────────────────
  describe('3. German Routes — Localized Slugs', () => {
    const de = LANG_SLUGS.de

    test('German about slug is "ueber"', () => {
      expect(de.about).toBe('ueber')
    })

    test('German contact slug is "kontakt"', () => {
      expect(de.contact).toBe('kontakt')
    })

    test('/de/ueber resolves to view-home (about section)', () => {
      expect(router.resolve('/de/ueber').view).toBe('view-home')
    })

    test('/de/ueber has scrollTo "about"', () => {
      expect(router.resolve('/de/ueber').meta.scrollTo).toBe('about')
    })

    test('/de/kontakt resolves to view-home (contact section)', () => {
      expect(router.resolve('/de/kontakt').view).toBe('view-home')
    })

    test('/de/kontakt has scrollTo "contact"', () => {
      expect(router.resolve('/de/kontakt').meta.scrollTo).toBe('contact')
    })

    test('/de resolves to view-home', () => {
      expect(router.resolve('/de').view).toBe('view-home')
    })

    test('/de/portfolio/cicb resolves to view-project', () => {
      expect(router.resolve('/de/portfolio/cicb').view).toBe('view-project')
    })

    test('/de meta.title includes "Luis"', () => {
      expect(router.resolve('/de').meta.title).toContain('Luis')
    })
  })

  // ── Brazilian Portuguese Route Metadata ──────────────────────────────────────
  describe('4. Brazilian Portuguese Routes — Localized Slugs', () => {
    const br = LANG_SLUGS.br

    test('BR about slug is "sobre"', () => {
      expect(br.about).toBe('sobre')
    })

    test('BR contact slug is "contato"', () => {
      expect(br.contact).toBe('contato')
    })

    test('/br/sobre resolves to view-home (about section)', () => {
      expect(router.resolve('/br/sobre').view).toBe('view-home')
    })

    test('/br/sobre has scrollTo "about"', () => {
      expect(router.resolve('/br/sobre').meta.scrollTo).toBe('about')
    })

    test('/br/contato resolves to view-home (contact section)', () => {
      expect(router.resolve('/br/contato').view).toBe('view-home')
    })

    test('/br/contato has scrollTo "contact"', () => {
      expect(router.resolve('/br/contato').meta.scrollTo).toBe('contact')
    })

    test('/br resolves to view-home', () => {
      expect(router.resolve('/br').view).toBe('view-home')
    })

    test('/br/portfolio/sage resolves to view-project', () => {
      expect(router.resolve('/br/portfolio/sage').view).toBe('view-project')
    })
  })

  // ── All Languages — Home Routes ─────────────────────────────────────────────
  describe('5. All Non-English Languages — Home Route', () => {
    NON_EN_LANGS.forEach(lang => {
      const slugs = LANG_SLUGS[lang]
      const base = `/${lang}`

      test(`${lang}: "${base}" resolves to view-home`, () => {
        expect(router.resolve(base).view).toBe('view-home')
      })

      test(`${lang}: "${base}" meta.title is non-empty`, () => {
        expect(router.resolve(base).meta.title.length).toBeGreaterThan(0)
      })

      if (slugs?.about) {
        test(`${lang}: "${base}/${slugs.about}" resolves to view-home`, () => {
          expect(router.resolve(`${base}/${slugs.about}`).view).toBe('view-home')
        })

        test(`${lang}: "${base}/${slugs.about}" has scrollTo "about"`, () => {
          expect(router.resolve(`${base}/${slugs.about}`).meta.scrollTo).toBe('about')
        })
      }

      if (slugs?.contact) {
        test(`${lang}: "${base}/${slugs.contact}" resolves to view-home`, () => {
          expect(router.resolve(`${base}/${slugs.contact}`).view).toBe('view-home')
        })

        test(`${lang}: "${base}/${slugs.contact}" has scrollTo "contact"`, () => {
          expect(router.resolve(`${base}/${slugs.contact}`).meta.scrollTo).toBe('contact')
        })
      }
    })
  })

  // ── Project Routes — All Known Projects ──────────────────────────────────────
  describe('6. Project Routes — Known Projects', () => {
    const knownProjects = ['cicb', 'nathalia-bond', 'sage', 'mini-melissa']

    knownProjects.forEach(slug => {
      test(`/portfolio/${slug} resolves to view-project`, () => {
        expect(router.resolve(`/portfolio/${slug}`).view).toBe('view-project')
      })

      test(`/portfolio/${slug} has correct projectSlug param`, () => {
        expect(router.resolve(`/portfolio/${slug}`).params.projectSlug).toBe(slug)
      })

      test(`/portfolio/${slug} has meta.title (string)`, () => {
        const result = router.resolve(`/portfolio/${slug}`)
        expect(typeof result.meta.title).toBe('string')
      })

      test(`/en/portfolio/${slug} resolves to view-project`, () => {
        expect(router.resolve(`/en/portfolio/${slug}`).view).toBe('view-project')
      })

      test(`/de/portfolio/${slug} resolves to view-project`, () => {
        expect(router.resolve(`/de/portfolio/${slug}`).view).toBe('view-project')
      })
    })
  })

  // ── 404 / Not Found ────────────────────────────────────────────────────────────
  describe('7. 404 Routes — Not Found Handling', () => {
    test('unknown path resolves to view-not-found', () => {
      const result = router.resolve('/this-does-not-exist-12345')
      expect(result.view).toMatch(/not-found|404/)
    })

    test('/portfolio (alone) is not a valid route', () => {
      const result = router.resolve('/portfolio')
      // It's either not-found or redirected
      expect(result.view).toMatch(/not-found|404|home/)
    })

    test('deeply nested unknown path resolves to view-not-found', () => {
      const result = router.resolve('/a/b/c/d/e/f/g')
      expect(result.view).toMatch(/not-found|404/)
    })
  })

  // ── Meta Title Format ─────────────────────────────────────────────────────────
  describe('8. Meta Title Format — SEO', () => {
    const routes = ['/', '/about', '/contact', '/portfolio/cicb']

    routes.forEach(path => {
      test(`${path} meta.title includes "Luis"`, () => {
        const result = router.resolve(path)
        expect(result.meta.title).toContain('Luis')
      })

      test(`${path} meta.title includes "Krötz" or "Krotz"`, () => {
        const result = router.resolve(path)
        expect(result.meta.title).toMatch(/Kr[öo]tz/)
      })
    })
  })

  // ── Router resolve() API Contract ────────────────────────────────────────────
  describe('9. Router resolve() API Contract', () => {
    test('resolve() returns an object', () => {
      expect(typeof router.resolve('/')).toBe('object')
    })

    test('resolve() result has .view property', () => {
      expect(router.resolve('/').view).toBeDefined()
    })

    test('resolve() result has .meta property', () => {
      expect(router.resolve('/').meta).toBeDefined()
    })

    test('resolve() result has .params property', () => {
      expect(router.resolve('/').params).toBeDefined()
    })

    test('resolve() result view is a string', () => {
      expect(typeof router.resolve('/').view).toBe('string')
    })

    test('resolve() result meta is an object', () => {
      expect(typeof router.resolve('/').meta).toBe('object')
    })

    test('resolve() result params is an object', () => {
      expect(typeof router.resolve('/').params).toBe('object')
    })

    test('resolve() is deterministic', () => {
      const r1 = router.resolve('/about')
      const r2 = router.resolve('/about')
      expect(r1.view).toBe(r2.view)
    })

    test('resolve() home returns view-home', () => {
      expect(router.resolve('/').view).toBe('view-home')
    })

    test('resolve() result has .lang property', () => {
      expect(router.resolve('/').lang).toBeDefined()
    })

    test('resolve() result lang for "/" is "en"', () => {
      expect(router.resolve('/').lang).toBe('en')
    })

    test('resolve() result lang for "/de" is "de"', () => {
      expect(router.resolve('/de').lang).toBe('de')
    })
  })

  // ── LANG_SLUGS Structure ──────────────────────────────────────────────────────
  describe('10. LANG_SLUGS — Slug Completeness', () => {
    const requiredKeys = ['about', 'contact']

    NON_EN_LANGS.forEach(lang => {
      const slugs = LANG_SLUGS[lang]

      test(`LANG_SLUGS.${lang} is defined`, () => {
        expect(slugs).toBeDefined()
      })

      requiredKeys.forEach(key => {
        test(`LANG_SLUGS.${lang}.${key} is a non-empty string`, () => {
          expect(typeof slugs[key]).toBe('string')
          expect(slugs[key].length).toBeGreaterThan(0)
        })

        test(`LANG_SLUGS.${lang}.${key} is URL-safe`, () => {
          expect(slugs[key]).toMatch(/^[a-z0-9-]+$/)
        })
      })
    })
  })

  // ── VALID_LANGS Array ─────────────────────────────────────────────────────────
  describe('11. VALID_LANGS — Supported Languages', () => {
    test('VALID_LANGS is an array', () => {
      expect(Array.isArray(LANGS)).toBe(true)
    })

    test('VALID_LANGS includes "en"', () => {
      expect(LANGS).toContain('en')
    })

    test('VALID_LANGS includes "de"', () => {
      expect(LANGS).toContain('de')
    })

    test('VALID_LANGS includes "br" (Brazilian Portuguese)', () => {
      expect(LANGS).toContain('br')
    })

    test('VALID_LANGS includes "es" (Spanish)', () => {
      expect(LANGS).toContain('es')
    })

    test('VALID_LANGS has at least 5 languages', () => {
      expect(LANGS.length).toBeGreaterThanOrEqual(5)
    })

    test('all VALID_LANGS entries are lowercase', () => {
      LANGS.forEach(lang => {
        expect(lang).toBe(lang.toLowerCase())
      })
    })

    test('LANG_SLUGS has entry for every non-en language in VALID_LANGS', () => {
      NON_EN_LANGS.forEach(lang => {
        expect(LANG_SLUGS[lang]).toBeDefined()
      })
    })

    test('VALID_LANGS has at least 10 languages (multilingual site)', () => {
      expect(LANGS.length).toBeGreaterThanOrEqual(10)
    })

    test('VALID_LANGS does not have duplicate entries', () => {
      expect(new Set(LANGS).size).toBe(LANGS.length)
    })
  })
})
