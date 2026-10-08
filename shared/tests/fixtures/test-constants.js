/**
 * @file test-constants.js
 * Shared fixture: file paths, selector strings and helper functions
 * used across the test suite. Import from here — never repeat in individual test files.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'node:url'

// Repo root resolved from this file's location, not process.cwd() — module
// suites also run standalone from their own folder (`cd website && yarn test`),
// so cwd is not a stable anchor.
export const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

// ─── SCSS file contents (cached once at module load) ──────────────────────────
const readScss = (name) => fs.readFileSync(path.join(ROOT_DIR, name), 'utf-8')

export const SCSS = {
  about: readScss('core/sass/components/home/about.scss'),
  app: readScss('core/sass/components/shell/app.scss'),
  awardsCarousel: readScss('core/sass/components/carousel/awards-carousel.scss'),
  awardsFooter: readScss('core/sass/components/home/awards-footer.scss'),
  carouselHost: readScss('core/sass/components/carousel/carousel-host.scss'),
  carousel: readScss('core/sass/components/carousel/carousel.scss'),
  cms: readScss('cms/sass/cms.scss'),
  contact: readScss('core/sass/components/home/contact.scss'),
  drawText: readScss('core/sass/components/media/draw-text.scss'),
  fonts: readScss('core/sass/base/_fonts.scss'),
  homeMosaic: readScss('core/sass/components/home/home-mosaic.scss'),
  internals: readScss('core/sass/components/internals/internals.scss'),
  mediaFigure: readScss('core/sass/components/media/media-figure.scss'),
  modal: readScss('core/sass/components/internals/modal.scss'),
  mixins: readScss('core/sass/base/_mixins.scss'),
  notFound: readScss('website/views/not-found/not-found.scss'),
  placeholders: readScss('core/sass/base/_placeholders.scss'),
  preferences: readScss('core/sass/components/dialogs/preferences.scss'),
  structure: readScss('core/sass/base/_structure.scss'),
  variables: readScss('core/sass/base/_variables.scss'),
}

// ─── JS source file contents (cached once) ────────────────────────────────────
// Sources may be .js/.ts/.tsx post-migration — resolve in that order.
const readJs = (rel) => {
  const candidates = [rel, rel.replace(/\.js$/, '.tsx'), rel.replace(/\.js$/, '.ts')]
  for (const c of candidates) {
    const full = path.join(ROOT_DIR, c)
    if (fs.existsSync(full)) return fs.readFileSync(full, 'utf-8')
  }
  return ''
}

// Reads a decomposed component: the facade plus every extracted sibling
// module, so source scans keep seeing the full component surface.
const readJsTree = (rel, ...extras) => [rel, ...extras].map(readJs).join('\n')

export const SRC = {
  App: readJs('src/App.js'),
  AppNav: readJsTree(
    'website/components/nav/AppNav.js',
    'website/components/nav/flag.js',
    'website/components/nav/menu.js',
    'website/components/nav/render.js',
    'website/components/nav/scroll.js',
    'website/components/nav/handlers.js'
  ),
  AboutSection: readJs('website/components/home/AboutSection.js'),
  AwardsMentions: readJsTree(
    'website/components/home/AwardsMentions.js',
    'website/components/home/awards/data.js',
    'website/components/home/awards/carousel.js',
    'website/components/home/awards/render.js'
  ),
  CustomCarousel: readJsTree(
    'website/components/carousel/CustomCarousel.js',
    'website/components/carousel/custom-carousel/render.js',
    'website/components/carousel/custom-carousel/autoplay.js',
    'website/components/carousel/custom-carousel/arrows.js',
    'website/components/carousel/custom-carousel/nav.js',
    'website/components/carousel/custom-carousel/sizing.js',
    'website/components/carousel/custom-carousel/lifecycle.js'
  ),
  ContactSection: readJs('website/components/home/ContactSection.js'),
  DrawText: readJsTree(
    'website/components/media/DrawText.js',
    'website/components/media/draw-text/dom.js',
    'website/components/media/draw-text/render.js',
    'website/components/media/draw-text/sheet.js',
    'website/components/media/draw-text/trigger.js'
  ),
  AwardsCarousel: readJsTree(
    'website/components/carousel/AwardsCarousel.js',
    'website/components/carousel/awards-carousel/autoplay.js',
    'website/components/carousel/awards-carousel/events.js',
    'website/components/carousel/awards-carousel/nav.js',
    'website/components/carousel/awards-carousel/observer.js',
    'website/components/carousel/awards-carousel/render.js'
  ),
  HomeMosaic: readJsTree(
    'website/components/home/HomeMosaic.js',
    'website/components/home/mosaic/pack.js',
    'website/components/home/mosaic/layout.js',
    'website/components/home/mosaic/interactions.js',
    'website/components/home/mosaic/events.js',
    'website/components/home/mosaic/render.js'
  ),
  LangDialog: readJsTree(
    'website/components/dialogs/LangDialog.js',
    'website/components/dialogs/lang-dialog/events.js',
    'website/components/dialogs/lang-dialog/locale.js',
    'website/components/dialogs/lang-dialog/render.js',
    'website/components/dialogs/lang-dialog/sync.js',
    'website/components/dialogs/lang-dialog/webgl.js'
  ),
  MediaExpanded: readJs('website/components/media/MediaExpanded.js'),
  MediaFigure: readJsTree(
    'website/components/media/MediaFigure.js',
    'website/components/media/figure/mount.js',
    'website/components/media/figure/modal.js',
    'website/components/media/figure/render.js',
    'website/components/media/figure/load.js',
    'website/components/media/figure/video.js'
  ),
  PreferencesModal: readJsTree(
    'website/components/dialogs/PreferencesModal.js',
    'website/components/dialogs/preferences/render.js',
    'website/components/dialogs/preferences/sync.js',
    'website/components/dialogs/preferences/webgl.js'
  ),
  CmsAboutEditor: readJsTree(
    'cms/about/CmsAboutEditor.js',
    'cms/about/data.js',
    'cms/about/events.js',
    'cms/about/model.js',
    'cms/about/render.js'
  ),
  CmsFooterEditor: readJsTree(
    'cms/footer/CmsFooterEditor.js',
    'cms/footer/data.js',
    'cms/footer/lists.js',
    'cms/footer/events.js',
    'cms/footer/render.js'
  ),
  CmsLangEditor: readJs('cms/lang/CmsLangEditor.js'),
  CmsPortfolioList: readJsTree(
    'cms/portfolio/CmsPortfolioList.js',
    'cms/portfolio/data.js',
    'cms/portfolio/events.js',
    'cms/portfolio/model.js',
    'cms/portfolio/render.js'
  ),
  CmsProjectsList: readJsTree(
    'cms/projects/CmsProjectsList.js',
    'cms/projects/data.js',
    'cms/projects/events.js',
    'cms/projects/render.js',
    'cms/projects/section-render.js',
    'cms/projects/sections.js'
  ),
  LegalFooter: readJs('website/components/legal/Footer.js'),
  PortfolioRelated: readJsTree(
    'website/components/portfolio/Related.js',
    'website/components/portfolio/related/match.js',
    'website/components/portfolio/related/data.js',
    'website/components/portfolio/related/render.js'
  ),
  AdminLogin: readJs('cms/routes/AdminLogin.js'),
  CmsDashboard: readJs('cms/routes/CmsDashboard.js'),
  Home: readJsTree(
    'website/views/home/Home.js',
    'website/views/home/data.js',
    'website/views/home/children.js',
    'website/views/home/scroll.js',
    'website/views/home/render.js'
  ),
  Legal: readJs('website/views/legal/Legal.js'),
  NotFound: readJs('website/views/not-found/NotFound.js'),
  Project: readJsTree(
    'website/views/project/Project.js',
    'website/views/project/carousels.js',
    'website/views/project/layout.js',
    'website/views/project/modal.js',
    'website/views/project/modal-dom.js',
    'website/views/project/data.js',
    'website/views/project/render.js'
  ),
  constants: readJs('core/constants.js'),
  store: readJs('core/store.js'),
  router: readJsTree(
    'core/router/router.js',
    'core/router/parse-path.js',
    'core/router/navigate.js'
  ),
  sanitize: readJs('core/utils/data/sanitize.js'),
}

// ─── Test-only vocabulary (fixture tags, sample text, sample project data) ─────
// These values are test fixtures — they are NOT app tokens. Import from here
// instead of repeating literals across test files.

export const TEST_TAGS = {
  BASE_COMPONENT: 'test-base-component',
}

export const TEST_TEXT = {
  HELLO: 'Hello',
  HELLO_WORLD: 'Hello World',
  HEADING: 'Sample Heading',
  BODY: 'Sample body copy',
  SECOND: 'Second',
  LUIS_KROTZ: 'Luis Krötz',
  MISSING_KEY: 'missing.deep.key',
  STALE: 'stale',
  UNKNOWN: 'unknown',
  LONG_NOTE:
    'All media on this domain was captured as screenshots from public URLs and/or local development environments using demo data without production value.',
}

export const TEST_PROJECTS = {
  CICB: 'cicb',
  SAGE: 'sage',
  METCHA: 'metcha',
  METCHA_TITLE: 'Metcha',
  MINI_MELISSA: 'mini-melissa',
  NATHALIA_BOND: 'nathalia-bond',
  SLUG_BRAZILIAN_LEATHER: 'brazilian-leather',
  SLUG_MINIMELISSA: 'minimelissa',
  SLUG_SAGEWEB: 'genesysinf-sageweb',
  SLUG_NATHALIA_BOND: 'clinica-de-desenvolvimento-nathalia-bond',
}

export const TEST_AWARDS = {
  FWA_OF_THE_DAY: 'FWA of the Day',
  AWWWARDS_SOTD: 'Awwwards Site of the Day',
}

// Computed-style fixtures for canvas widgets sampling theme CSS vars —
// INK parses via parseCssColor, INVALID drives the null-ink fallback arm.
export const TEST_COLORS = {
  INK: 'rgb(12, 34, 56)',
  INK_CHANNELS: '12, 34, 56',
  INVALID: 'not-a-color',
}

/** GPU renderer strings reported by WEBGL_debug_renderer_info in tests. */
export const TEST_GPU = {
  SOFTWARE_RENDERER: 'SwiftShader (Software)',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safely append el to body, return cleanup fn */
export function mount(el) {
  document.body.appendChild(el)
  return () => {
    if (el && el.parentNode) el.parentNode.removeChild(el)
  }
}

// Sample media URLs used by fetch/decoder tests — opaque, non-token values.
export const TEST_URLS = Object.freeze({
  A: 'https://cdn.test/a.webp',
  B: 'https://cdn.test/b.webp',
  IMG: 'https://cdn.test/img.webp',
  VIDEO: 'https://cdn.test/clip.mp4',
  BLOB: 'blob:test-x',
  EXTERNAL: 'https://example.com/x',
})

/** Real-world user-agent strings for browser-detection tests. */
export const TEST_UA = Object.freeze({
  SAMSUNG:
    'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36',
  FIREFOX: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
  FIREFOX_ANDROID: 'Mozilla/5.0 (Android 14; Mobile; rv:132.0) Gecko/132.0 Firefox/132.0',
  EDGE: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
  EDGE_ANDROID:
    'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36 EdgA/130.0.0.0',
  OPERA:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 OPR/115.0.0.0',
  CHROME:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  SAFARI:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15',
  IE11: 'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko',
  UNKNOWN: 'curl/8.0.1',
})

/**
 * Poll `fn` until truthy or `ms` elapses. Replaces fixed `setTimeout` waits —
 * under parallel-suite CPU contention a 200ms wait can fire late while the
 * work it waits on hasn't finished, which produced load-dependent flakes.
 * The 15s default budget is sized for the instrumented full-suite run where
 * a worker can go several seconds without a timer slot.
 */
export async function waitFor(fn, ms = 15000) {
  const start = Date.now()

  while (!fn()) {
    if (Date.now() - start > ms) return fn()
    await new Promise((r) => setTimeout(r, 20))
  }

  return fn()
}
