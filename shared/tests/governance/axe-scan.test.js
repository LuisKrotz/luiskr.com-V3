/**
 * @file axe-scan.test.js
 * @description Accessibility scan powered by axe-core. Mounts the real
 * components (nav, sections, modals, media, legal, 404) into the happy-dom
 * document and runs the full WCAG 2.x ruleset against the composed page and
 * each interactive surface. Aggregates every violation into
 * `experiments/docs/reports/axe-report.json` (consumed by scripts/build/deploy-info.mjs → CMS
 * Deploy Info tab).
 *
 * Gating: any violation with impact `critical` or `serious` fails the suite —
 * the same gate blocks pre-commit and pre-build via `yarn verify`.
 */

import { describe, test, expect, beforeEach, afterAll, jest } from '@jest/globals'
import fs from 'node:fs'
import path from 'node:path'
import axe from 'axe-core'
import { AppNav } from '@website/components/nav/AppNav.js'
import { AboutSection } from '@website/components/home/AboutSection.js'
import { ContactSection } from '@website/components/home/ContactSection.js'
import { AwardsMentions } from '@website/components/home/AwardsMentions.js'
import { CookieBanner } from '@website/components/feedback/CookieBanner.js'
import { HomeMosaic } from '@website/components/home/HomeMosaic.js'
import { PreferencesModal } from '@website/components/dialogs/PreferencesModal.js'
import { LangDialog } from '@website/components/dialogs/LangDialog.js'
import { LegalFooter } from '@website/components/legal/Footer.js'
import { ViewLegal } from '@website/views/legal/Legal.js'
import { ViewNotFound } from '@website/views/not-found/NotFound.js'
import '@website/components/media/MediaFigure.js'
import '@website/components/carousel/CustomCarousel.js'
import '@website/components/carousel/AwardsCarousel.js'
import '@website/components/media/DrawText.js'
import store from '@core/store.js'
import { CMS_KEYS, CSS_STRINGS, LOCALES, ROUTE_NAMES, ROUTE_PREFIXES } from '@core/constants.js'
import { TEST_AWARDS, TEST_PROJECTS, TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { LANG_MUTATIONS, MODAL_MUTATIONS } from '@core/tokens/events/mutations.js'
import { NAV_TEXT } from '@core/tokens/strings/text.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { COVER_DIMENSIONS } from '@core/tokens/media/dimensions.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'

const REPORT_DIR = path.resolve('experiments/docs/reports')
const REPORT_FILE = path.join(REPORT_DIR, 'axe-report.json')
// Lighthouse asserts accessibility = 1.0 — every binary audit must pass — so
// the test gate fails on 'moderate' too (heading-order, landmark issues),
// not just critical/serious. WCAG 2.x A+AA+AAA rules all run (AXE_RUN_TAGS):
// rules that can't evaluate in happy-dom report 'incomplete' for review,
// violations fail the gate.
const FAIL_IMPACTS = new Set(['critical', 'serious', 'moderate'])

const AXE_RUN_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag2aaa',
  'wcag21a',
  'wcag21aa',
  'wcag21aaa',
  'wcag22aa',
  'best-practice',
]

// axe needs explicit origin trust inside jsdom-like environments
axe.configure({ allowedOrigins: ['<unsafe_all_origins>'] })

const scanResults = []

const recordScan = async (name, context, { disabledRules = [] } = {}) => {
  const results = await axe.run(context, {
    resultTypes: ['violations', 'incomplete'],
    runOnly: { type: CSS_STRINGS.TOKEN_TAG, values: AXE_RUN_TAGS },
    ...(disabledRules.length
      ? { rules: Object.fromEntries(disabledRules.map((id) => [id, { enabled: false }])) }
      : {}),
  })

  const entry = {
    surface: name,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      tags: v.tags,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        failureSummary: n.failureSummary,
      })),
    })),
    incomplete: results.incomplete.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
    })),
    passes: results.passes.length,
  }

  scanResults.push(entry)
  return entry
}

const failCount = (entry) => entry.violations.filter((v) => FAIL_IMPACTS.has(v.impact)).length

const mountEl = (el) => {
  document.body.appendChild(el)
  return el
}

/**
 * Emulates the index.html shell in the happy-dom document: the real shell
 * ships <html lang="en">, a <title>, and App.js wraps routed views in a
 * <main id="main-content"> landmark. Scans mount content the same way so
 * axe evaluates production-equivalent semantics rather than a bare <body>.
 */
const mountInPageShell = (els, { heading = null } = {}) => {
  const main = document.createElement(HTML_TAGS.MAIN)
  if (heading) {
    const h1 = document.createElement(HTML_TAGS.H1)
    h1.textContent = heading
    main.appendChild(h1)
  }
  for (const el of els) main.appendChild(el)
  document.body.appendChild(main)
  return main
}

const resetDocumentShell = () => {
  document.body.innerHTML = ''
  document.documentElement.setAttribute(COMMON_ATTRS.LANG, LOCALES.EN)
  if (!document.head.querySelector(HTML_TAGS.TITLE)) {
    const title = document.createElement(HTML_TAGS.TITLE)
    title.textContent = TEST_TEXT.LUIS_KROTZ
    document.head.appendChild(title)
  }
}

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 60))

/**
 * Polls until a condition holds — used instead of a fixed sleep
 * for open-state renders that depend on store subscribers + rAF chains,
 * which can lag under parallel workers.
 */
const waitFor = async (fn, timeout = 8000, step = 30) => {
  const start = Date.now()
  while (!fn()) {
    if (Date.now() - start > timeout) throw new Error('waitFor timeout')
    await new Promise((r) => setTimeout(r, step))
  }
}

afterAll(() => {
  fs.mkdirSync(REPORT_DIR, { recursive: true })

  const totals = {
    violations: scanResults.reduce((n, s) => n + s.violations.length, 0),
    criticalOrSerious: scanResults.reduce(
      (n, s) => n + s.violations.filter((v) => FAIL_IMPACTS.has(v.impact)).length,
      0
    ),
    incomplete: scanResults.reduce((n, s) => n + s.incomplete.length, 0),
    passes: scanResults.reduce((n, s) => n + s.passes, 0),
  }

  const report = {
    generatedAt: new Date().toISOString(),
    engine: `axe-core@${axe.version}`,
    totals,
    surfaces: scanResults,
  }

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2))
})

describe('Axe Accessibility Scan — WCAG 2.x (axe-core)', () => {
  // axe.run is heavy under parallel workers — give each test headroom.
  jest.setTimeout(120000)

  beforeEach(() => {
    resetDocumentShell()
  })

  describe('1. Composed Home Page (nav + sections + footer)', () => {
    test('zero critical/serious violations on the full home surface', async () => {
      const about = new AboutSection()
      about.aboutTranslations = { title: TEST_TEXT.HELLO, col1: ['Line one'], col2: ['Line two'] }

      store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {
        contact: { title: NAV_TEXT.CONTACT, line1: ['Get in touch'] },
        [CMS_KEYS.LEGAL_FOOTER]: {
          links: [
            { page: ROUTE_PREFIXES.PRIVACY, link: ROUTE_PATHS.PRIVACY_POLICY },
            { page: ROUTE_PREFIXES.TERMS, link: ROUTE_PATHS.TERMS_OF_USE },
          ],
        },
      })

      const awards = new AwardsMentions()
      awards.items = [
        { text: TEST_AWARDS.AWWARDS_SOTD, sub: '2024' },
        { text: TEST_AWARDS.FWA_OF_THE_DAY, sub: '2023' },
      ]

      const mosaic = new HomeMosaic()
      mosaic.translations = { featured: 'Featured', explore: 'Explore' }
      mosaic.processedItems = [
        {
          id: TEST_PROJECTS.METCHA,
          label: TEST_PROJECTS.METCHA_TITLE,
          featured: true,
          description: 'Project',
        },
      ]

      mountInPageShell([
        about,
        new ContactSection(),
        awards,
        mosaic,
        new LegalFooter(),
        new CookieBanner(),
      ])
      mountEl(new AppNav())

      await flushMicrotasks()

      const entry = await recordScan('home-composed', document)
      expect(failCount(entry)).toBe(0)
    })
  })

  describe('2. Preferences Modal (open state)', () => {
    test('zero critical/serious violations on the open preferences dialog', async () => {
      mountInPageShell([], { heading: TEST_TEXT.LUIS_KROTZ })
      const modal = mountEl(new PreferencesModal())
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)

      await waitFor(() => modal.shadowRoot && modal.shadowRoot.innerHTML.length > 0)
      await flushMicrotasks()

      const entry = await recordScan(COMPONENT_TAGS.PREFERENCES_MODAL, document)
      store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
      expect(failCount(entry)).toBe(0)
    })
  })

  describe('3. Language Dialog (open state)', () => {
    test('zero critical/serious violations on the open language dialog', async () => {
      mountInPageShell([], { heading: TEST_TEXT.LUIS_KROTZ })
      const langDlg = mountEl(new LangDialog())
      store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, true)

      await waitFor(() => langDlg.shadowRoot && langDlg.shadowRoot.innerHTML.length > 0)
      await flushMicrotasks()

      const entry = await recordScan(COMPONENT_TAGS.LANG_DIALOG, document)
      store.commit(MODAL_MUTATIONS.TOGGLE_LANG_DIALOG, false)
      expect(failCount(entry)).toBe(0)
    })
  })

  describe('4. Legal & Not-Found Views', () => {
    test('zero critical/serious violations on the legal view', async () => {
      const view = new ViewLegal()
      mountInPageShell([view])

      // loadData() resolves async — set translations after it settles so the
      // fetch result can't overwrite them
      await flushMicrotasks()
      view.translations = {
        title: ROUTE_NAMES.PRIVACY,
        text: 'Legal content',
        date: '2024',
        // Real legal payloads carry sections — the rendered h2 chain is what
        // keeps heading-order valid (h1 title → h2 sections).
        sections: [
          { title: 'Section one', content: ['Paragraph body'] },
          { title: 'Section two', content: ['More body'] },
        ],
      }
      view._updateDom()

      await flushMicrotasks()

      const entry = await recordScan('legal-view', document)
      expect(failCount(entry)).toBe(0)
    })

    test('zero critical/serious violations on the 404 view', async () => {
      const nf = new ViewNotFound()
      mountInPageShell([nf])

      await flushMicrotasks()
      nf.translations = { title: 'Page not<br>found', link: 'Back to home' }
      nf._updateDom()

      await flushMicrotasks()

      const entry = await recordScan('not-found-view', document)
      expect(failCount(entry)).toBe(0)
    })
  })

  describe('5. Media Elements', () => {
    test('media-figure exposes alt text and accessible structure', async () => {
      const fig = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)
      fig.setAttribute(MEDIA_ATTRS.SRC, 'projects/test/image')
      fig.setAttribute(MEDIA_ATTRS.ALT, 'Project screenshot')
      fig.setAttribute(MEDIA_ATTRS.WIDTH, COVER_DIMENSIONS.FHD_WIDTH_STR)
      fig.setAttribute(MEDIA_ATTRS.HEIGHT, '1080')

      const vid = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)
      vid.setAttribute(MEDIA_ATTRS.IS_VIDEO, STATE_STRINGS.TRUE)
      vid.setAttribute(MEDIA_ATTRS.SRC, 'projects/test/video')
      vid.setAttribute(MEDIA_ATTRS.ALT, 'Project video')
      vid.setAttribute(MEDIA_ATTRS.WIDTH, COVER_DIMENSIONS.FHD_WIDTH_STR)

      mountInPageShell([fig, vid], { heading: 'Media' })

      await flushMicrotasks()

      const entry = await recordScan('media-figures', document)
      expect(failCount(entry)).toBe(0)
    })
  })

  describe('6. Static Shell (dist/index.html when built)', () => {
    test('document shell has no critical/serious violations', async () => {
      const indexPath = path.resolve('dist', 'index.html')
      if (!fs.existsSync(indexPath)) return

      const html = fs.readFileSync(indexPath, 'utf-8')
      const langMatch = html.match(/<html[^>]*lang="([^"]+)"/i)

      document.documentElement.innerHTML = html
        .replace(/^[\s\S]*?<html[^>]*>/i, '')
        .replace(/<\/html>[\s\S]*$/i, '')

      if (langMatch) document.documentElement.setAttribute(COMMON_ATTRS.LANG, langMatch[1])

      // Landmark + h1 rules excluded for the pre-hydration shell: App.js mounts
      // <main id="main-content"> at runtime and each view supplies its own h1
      // (proven by the composed surfaces above); <noscript> covers no-JS users.
      const entry = await recordScan('static-shell', document, {
        disabledRules: ['landmark-one-main', 'page-has-heading-one'],
      })
      document.documentElement.innerHTML = '<head></head><body></body>'
      expect(failCount(entry)).toBe(0)
    })
  })
})
