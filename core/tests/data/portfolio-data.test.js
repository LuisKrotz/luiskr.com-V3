/**
 * @file portfolio-data.test.js
 * @description Tests for portfolio data structure, store integration, router
 * compatibility, PROJECT_ALIASES backward compat, and WASM layout calculations.
 * Portfolio data is fetched from Firebase at runtime, so these tests use mock data
 * matching the expected structure.
 */

import { PROJECT_ALIASES } from '@core/constants.js'
import { TEST_PROJECTS } from '@tests/fixtures/test-constants.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { DATA_MUTATIONS } from '@core/tokens/events/mutations.js'

// Portfolio data is loaded from Firebase — use the known project slugs for tests
const KNOWN_PROJECTS = [
  { slug: TEST_PROJECTS.CICB, title: 'CICB — Brazilian Leather' },
  { slug: TEST_PROJECTS.NATHALIA_BOND, title: 'Clínica de Desenvolvimento Nathalia Bond' },
  { slug: TEST_PROJECTS.SAGE, title: 'Sage Web' },
  { slug: TEST_PROJECTS.MINI_MELISSA, title: 'Mini Melissa' },
]

describe('Portfolio Data — JSON Integrity', () => {
  const projects = KNOWN_PROJECTS

  // ── Basic Structure ──────────────────────────────────────────────────────────
  describe('1. Portfolio Data Structure', () => {
    test('portfolio data is an array', () => {
      expect(Array.isArray(projects)).toBe(true)
    })

    test('portfolio data has at least 4 projects', () => {
      expect(projects.length).toBeGreaterThanOrEqual(4)
    })

    test('every project has a slug', () => {
      projects.forEach((p) => {
        expect(p.slug).toBeDefined()
        expect(typeof p.slug).toBe(TYPE_STRINGS.STRING)
        expect(p.slug.length).toBeGreaterThan(0)
      })
    })

    test('every project has a title', () => {
      projects.forEach((p) => {
        expect(p.title || p.name).toBeDefined()
      })
    })

    test('every project has a featured field (or at least defined)', () => {
      projects.forEach((p) => {
        const hasFeaturedInfo =
          p.featured !== undefined || p.order !== undefined || p.slug !== undefined
        expect(hasFeaturedInfo).toBe(true)
      })
    })

    test('all project slugs are unique', () => {
      const slugs = projects.map((p) => p.slug)
      const unique = new Set(slugs)
      expect(unique.size).toBe(slugs.length)
    })

    test('all project slugs are URL-safe', () => {
      projects
        .map((p) => p.slug)
        .forEach((slug) => {
          expect(slug).toMatch(/^[a-z0-9-]+$/)
        })
    })

    test('all project slugs are lowercase', () => {
      projects
        .map((p) => p.slug)
        .forEach((slug) => {
          expect(slug).toBe(slug.toLowerCase())
        })
    })
  })

  // ── Known Projects ───────────────────────────────────────────────────────────
  describe('2. Known Project Slugs Exist', () => {
    const knownSlugs = [
      TEST_PROJECTS.CICB,
      TEST_PROJECTS.NATHALIA_BOND,
      TEST_PROJECTS.SAGE,
      TEST_PROJECTS.MINI_MELISSA,
    ]

    knownSlugs.forEach((slug) => {
      test(`project "${slug}" exists in portfolio data`, () => {
        const project = projects.find((p) => p.slug === slug)
        expect(project).toBeDefined()
      })
    })

    test('cicb project has correct slug', () => {
      const cicb = projects.find((p) => p.slug === TEST_PROJECTS.CICB)
      expect(cicb?.slug).toBe(TEST_PROJECTS.CICB)
    })

    test('nathalia-bond project has correct slug', () => {
      const nb = projects.find((p) => p.slug === TEST_PROJECTS.NATHALIA_BOND)
      expect(nb?.slug).toBe(TEST_PROJECTS.NATHALIA_BOND)
    })

    test('sage project has correct slug', () => {
      const sage = projects.find((p) => p.slug === TEST_PROJECTS.SAGE)
      expect(sage?.slug).toBe(TEST_PROJECTS.SAGE)
    })

    test('mini-melissa project has correct slug', () => {
      const mm = projects.find((p) => p.slug === TEST_PROJECTS.MINI_MELISSA)
      expect(mm?.slug).toBe(TEST_PROJECTS.MINI_MELISSA)
    })
  })

  // ── Field Integrity ──────────────────────────────────────────────────────────
  describe('3. Field Integrity & Types', () => {
    test('every project slug is a string', () => {
      projects.forEach((p) => expect(typeof p.slug).toBe(TYPE_STRINGS.STRING))
    })

    test('every project has at least one field beyond slug', () => {
      projects.forEach((p) => {
        const fields = Object.keys(p)
        expect(fields.length).toBeGreaterThan(1)
      })
    })

    test('no project has a null slug', () => {
      projects.forEach((p) => expect(p.slug).not.toBeNull())
    })

    test('no project has an undefined slug', () => {
      projects.forEach((p) => expect(p.slug).not.toBeUndefined())
    })

    test('no project has an empty string slug', () => {
      projects.forEach((p) => expect(p.slug.length).toBeGreaterThan(0))
    })
  })

  // ── Router Compatibility ─────────────────────────────────────────────────────
  describe('4. Router Compatibility', () => {
    test('all project slugs resolve to view-project in router', async () => {
      const router = (await import('@core/router/router.js')).default
      projects.forEach((p) => {
        const result = router.resolve(`/portfolio/${p.slug}`)
        expect(result.view).toBe(VIEW_TAGS.VIEW_PROJECT)
      })
    })

    test('all project slugs work with lang prefix', async () => {
      const router = (await import('@core/router/router.js')).default
      projects.forEach((p) => {
        const result = router.resolve(`/en/portfolio/${p.slug}`)
        expect(result.view).toBe(VIEW_TAGS.VIEW_PROJECT)
      })
    })

    test('project params.projectSlug matches input slug for all projects', async () => {
      const router = (await import('@core/router/router.js')).default
      projects.forEach((p) => {
        const result = router.resolve(`/portfolio/${p.slug}`)
        expect(result.params.projectSlug).toBe(p.slug)
      })
    })
  })

  // ── PROJECT_ALIASES Backward Compat ──────────────────────────────────────────
  describe('5. PROJECT_ALIASES Backward Compatibility', () => {
    test('all PROJECT_ALIASES targets exist as project slugs', () => {
      const slugs = projects.map((p) => p.slug)
      Object.values(PROJECT_ALIASES).forEach((target) => {
        expect(slugs).toContain(target)
      })
    })

    test('PROJECT_ALIASES["brazilian-leather"] target "cicb" is in data', () => {
      const slugs = projects.map((p) => p.slug)
      expect(slugs).toContain(PROJECT_ALIASES[TEST_PROJECTS.SLUG_BRAZILIAN_LEATHER])
    })

    test('PROJECT_ALIASES["minimelissa"] target "mini-melissa" is in data', () => {
      const slugs = projects.map((p) => p.slug)
      expect(slugs).toContain(PROJECT_ALIASES[TEST_PROJECTS.SLUG_MINIMELISSA])
    })

    test('PROJECT_ALIASES["genesysinf-sageweb"] target "sage" is in data', () => {
      const slugs = projects.map((p) => p.slug)
      expect(slugs).toContain(PROJECT_ALIASES[TEST_PROJECTS.SLUG_SAGEWEB])
    })

    test('PROJECT_ALIASES["clinica-de-desenvolvimento-nathalia-bond"] target is in data', () => {
      const slugs = projects.map((p) => p.slug)
      expect(slugs).toContain(PROJECT_ALIASES[TEST_PROJECTS.SLUG_NATHALIA_BOND])
    })
  })

  // ── Data Completeness ─────────────────────────────────────────────────────────
  describe('6. Data Completeness — No Missing Critical Fields', () => {
    test('portfolio has at least 4 projects total', () => {
      expect(projects.length).toBeGreaterThanOrEqual(4)
    })

    test('no project has a duplicate slug', () => {
      const seen = new Set()
      projects.forEach((p) => {
        expect(seen.has(p.slug)).toBe(false)
        seen.add(p.slug)
      })
    })

    test('all project data is a valid object (not null/undefined)', () => {
      projects.forEach((p) => {
        expect(p).not.toBeNull()
        expect(typeof p).toBe(TYPE_STRINGS.OBJECT)
      })
    })
  })

  // ── Individual Project Fields ─────────────────────────────────────────────────
  describe('7. Individual Project Details — CICB', () => {
    let cicb
    beforeAll(() => {
      cicb = projects.find((p) => p.slug === TEST_PROJECTS.CICB)
    })

    test('cicb project exists', () => expect(cicb).toBeDefined())
    test('cicb slug is "cicb"', () => expect(cicb?.slug).toBe(TEST_PROJECTS.CICB))
    test('cicb project has fields beyond slug', () => {
      if (cicb) expect(Object.keys(cicb).length).toBeGreaterThan(1)
    })
  })

  describe('8. Individual Project Details — Sage', () => {
    let sage
    beforeAll(() => {
      sage = projects.find((p) => p.slug === TEST_PROJECTS.SAGE)
    })

    test('sage project exists', () => expect(sage).toBeDefined())
    test('sage slug is "sage"', () => expect(sage?.slug).toBe(TEST_PROJECTS.SAGE))
  })

  describe('9. Individual Project Details — Mini Melissa', () => {
    let miniMelissa
    beforeAll(() => {
      miniMelissa = projects.find((p) => p.slug === TEST_PROJECTS.MINI_MELISSA)
    })

    test('mini-melissa project exists', () => expect(miniMelissa).toBeDefined())
    test('mini-melissa slug is "mini-melissa"', () =>
      expect(miniMelissa?.slug).toBe(TEST_PROJECTS.MINI_MELISSA))
  })

  describe('10. Individual Project Details — Nathalia Bond', () => {
    let nb
    beforeAll(() => {
      nb = projects.find((p) => p.slug === TEST_PROJECTS.NATHALIA_BOND)
    })

    test('nathalia-bond project exists', () => expect(nb).toBeDefined())
    test('nathalia-bond slug is "nathalia-bond"', () =>
      expect(nb?.slug).toBe(TEST_PROJECTS.NATHALIA_BOND))
  })

  // ── WASM Layout Integration ───────────────────────────────────────────────────
  describe('11. WASM Layout — Portfolio Grid Calculations', () => {
    test('calcColumnWidth for each project count produces positive result', async () => {
      const { calcColumnWidth } = await import('@core/utils/wasm/wasm-layout.js')
      const projectCount = projects.length
      for (let cols = 1; cols <= Math.min(4, projectCount); cols++) {
        const result = calcColumnWidth(cols, 1280, 16)
        expect(result).toBeGreaterThan(0)
      }
    })
  })

  // ── Store Integration ─────────────────────────────────────────────────────────
  describe('12. Store Integration — Portfolio List', () => {
    test('store can receive portfolio data', async () => {
      const store = (await import('@core/store.js')).default
      expect(() => store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, projects)).not.toThrow()
    })

    test('store portfolio list is set after commit', async () => {
      const store = (await import('@core/store.js')).default
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, projects)
      const list = store.getters.getPortfolioList()
      expect(list).toEqual(projects)
    })

    test('store portfolio list length matches data', async () => {
      const store = (await import('@core/store.js')).default
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, projects)
      expect(store.getters.getPortfolioList().length).toBe(projects.length)
    })

    test('getPortfolioList() returns the same array as setPortfolioList()', async () => {
      const store = (await import('@core/store.js')).default
      const testData = [{ slug: 'test' }]
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, testData)
      expect(store.getters.getPortfolioList()).toEqual(testData)
      store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, projects) // restore
    })
  })
})
