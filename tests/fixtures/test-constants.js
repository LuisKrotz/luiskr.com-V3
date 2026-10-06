/**
 * @file test-constants.js
 * Shared fixture: file paths, selector strings and helper functions
 * used across the test suite. Import from here — never repeat in individual test files.
 */

import fs from 'fs'
import path from 'path'

export const ROOT_DIR = process.cwd()

// ─── SCSS file contents (cached once at module load) ──────────────────────────
const readScss = (name) => fs.readFileSync(path.join(ROOT_DIR, name), 'utf-8')

export const SCSS = {
  about: readScss('src/sass/components/home/about.scss'),
  app: readScss('src/sass/components/chrome/app.scss'),
  awardsFooter: readScss('src/sass/components/home/awards-footer.scss'),
  carouselHost: readScss('src/sass/components/carousel/carousel-host.scss'),
  carousel: readScss('src/sass/components/carousel/carousel.scss'),
  cms: readScss('src/cms/sass/cms.scss'),
  contact: readScss('src/sass/components/home/contact.scss'),
  drawText: readScss('src/sass/components/chrome/draw-text.scss'),
  fonts: readScss('src/sass/base/_fonts.scss'),
  homeCarousel: readScss('src/sass/components/home/home-carousel.scss'),
  homeMosaic: readScss('src/sass/components/home/home-mosaic.scss'),
  internals: readScss('src/sass/components/project/internals.scss'),
  mediaFigure: readScss('src/sass/components/media/media-figure.scss'),
  modal: readScss('src/sass/components/media/modal.scss'),
  mixins: readScss('src/sass/base/_mixins.scss'),
  notFound: readScss('src/routes/views/not-found/not-found.scss'),
  placeholders: readScss('src/sass/base/_placeholders.scss'),
  preferences: readScss('src/sass/components/dialogs/preferences.scss'),
  structure: readScss('src/sass/base/_structure.scss'),
  variables: readScss('src/sass/base/_variables.scss'),
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
    'src/components/nav/AppNav.js',
    'src/components/nav/flag.js',
    'src/components/nav/menu.js',
    'src/components/nav/render.js',
    'src/components/nav/scroll.js',
    'src/components/nav/handlers.js'
  ),
  AboutSection: readJs('src/components/home/AboutSection.js'),
  AwardsMentions: readJsTree(
    'src/components/home/AwardsMentions.js',
    'src/components/home/awards/data.js',
    'src/components/home/awards/carousel.js',
    'src/components/home/awards/render.js'
  ),
  CustomCarousel: readJsTree(
    'src/components/carousel/CustomCarousel.js',
    'src/components/carousel/custom-carousel/render.js',
    'src/components/carousel/custom-carousel/autoplay.js',
    'src/components/carousel/custom-carousel/arrows.js',
    'src/components/carousel/custom-carousel/nav.js',
    'src/components/carousel/custom-carousel/sizing.js',
    'src/components/carousel/custom-carousel/lifecycle.js'
  ),
  ContactSection: readJs('src/components/home/ContactSection.js'),
  DrawText: readJsTree(
    'src/components/media/DrawText.js',
    'src/components/media/draw-text/dom.js',
    'src/components/media/draw-text/render.js',
    'src/components/media/draw-text/sheet.js',
    'src/components/media/draw-text/trigger.js'
  ),
  HomeCarousel: readJsTree(
    'src/components/carousel/HomeCarousel.js',
    'src/components/carousel/home-carousel/autoplay.js',
    'src/components/carousel/home-carousel/events.js',
    'src/components/carousel/home-carousel/nav.js',
    'src/components/carousel/home-carousel/observer.js',
    'src/components/carousel/home-carousel/render.js'
  ),
  HomeMosaic: readJsTree(
    'src/components/home/HomeMosaic.js',
    'src/components/home/mosaic/pack.js',
    'src/components/home/mosaic/layout.js',
    'src/components/home/mosaic/interactions.js',
    'src/components/home/mosaic/events.js',
    'src/components/home/mosaic/render.js'
  ),
  LangDialog: readJsTree(
    'src/components/dialogs/LangDialog.js',
    'src/components/dialogs/lang-dialog/events.js',
    'src/components/dialogs/lang-dialog/locale.js',
    'src/components/dialogs/lang-dialog/render.js',
    'src/components/dialogs/lang-dialog/sync.js',
    'src/components/dialogs/lang-dialog/webgl.js'
  ),
  MediaExpanded: readJs('src/components/media/MediaExpanded.js'),
  MediaFigure: readJsTree(
    'src/components/media/MediaFigure.js',
    'src/components/media/figure/mount.js',
    'src/components/media/figure/modal.js',
    'src/components/media/figure/render.js',
    'src/components/media/figure/load.js',
    'src/components/media/figure/video.js'
  ),
  PreferencesModal: readJsTree(
    'src/components/dialogs/PreferencesModal.js',
    'src/components/dialogs/preferences/render.js',
    'src/components/dialogs/preferences/sync.js',
    'src/components/dialogs/preferences/webgl.js'
  ),
  CmsAboutEditor: readJsTree(
    'src/cms/about/CmsAboutEditor.js',
    'src/cms/about/data.js',
    'src/cms/about/events.js',
    'src/cms/about/model.js',
    'src/cms/about/render.js'
  ),
  CmsFooterEditor: readJsTree(
    'src/cms/footer/CmsFooterEditor.js',
    'src/cms/footer/data.js',
    'src/cms/footer/lists.js',
    'src/cms/footer/events.js',
    'src/cms/footer/render.js'
  ),
  CmsLangEditor: readJs('src/cms/lang/CmsLangEditor.js'),
  CmsPortfolioList: readJsTree(
    'src/cms/portfolio/CmsPortfolioList.js',
    'src/cms/portfolio/data.js',
    'src/cms/portfolio/events.js',
    'src/cms/portfolio/model.js',
    'src/cms/portfolio/render.js'
  ),
  CmsProjectsList: readJsTree(
    'src/cms/projects/CmsProjectsList.js',
    'src/cms/projects/data.js',
    'src/cms/projects/events.js',
    'src/cms/projects/render.js',
    'src/cms/projects/section-render.js',
    'src/cms/projects/sections.js'
  ),
  LegalFooter: readJs('src/components/legal/Footer.js'),
  PortfolioRelated: readJsTree(
    'src/components/portfolio/Related.js',
    'src/components/portfolio/related/match.js',
    'src/components/portfolio/related/data.js',
    'src/components/portfolio/related/render.js'
  ),
  AdminLogin: readJs('src/cms/routes/AdminLogin.js'),
  CmsDashboard: readJs('src/cms/routes/CmsDashboard.js'),
  Home: readJsTree(
    'src/routes/views/home/Home.js',
    'src/routes/views/home/data.js',
    'src/routes/views/home/children.js',
    'src/routes/views/home/scroll.js',
    'src/routes/views/home/render.js'
  ),
  Legal: readJs('src/routes/views/legal/Legal.js'),
  NotFound: readJs('src/routes/views/not-found/NotFound.js'),
  Project: readJsTree(
    'src/routes/views/project/Project.js',
    'src/routes/views/project/carousels.js',
    'src/routes/views/project/layout.js',
    'src/routes/views/project/modal.js',
    'src/routes/views/project/modal-dom.js',
    'src/routes/views/project/data.js',
    'src/routes/views/project/render.js'
  ),
  constants: readJs('src/core/constants.js'),
  store: readJs('src/core/store.js'),
  router: readJsTree('src/routes/router.js', 'src/routes/parse-path.js', 'src/routes/navigate.js'),
  sanitize: readJs('src/utils/data/sanitize.js'),
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

// ─── Expected console noise ───────────────────────────────────────────────────
// Per project rule 12 every console.warn/error/info in src is intentional
// signal — and tests deliberately exercise those paths, so the messages DO
// fire during test runs. `tests/setup.js` filters the signatures below out of
// test output; anything NOT listed still prints and should be investigated.
// Each entry documents why the noise is expected rather than suppressed.
export const TEST_NOISE = Object.freeze([
  // Firebase SDK offline writes — tests run with no credentials, so the
  // database logs permission_denied through its own Logger before our
  // setLogLevel('silent') reaches lazily-created instances.
  'FIREBASE WARNING',
  'permission_denied',
  '@firebase/',
  // Dev-only Firebase mock backend logs each call by design.
  '[CMS-MOCK]',
  // Engine bootstrap racing jest teardown — the lazy `import()` throws
  // "outside of the scope of the test code" after the sandbox is gone.
  'outside of the scope of the test code',
  '[EarthBG]',
  '[SpacePlayground]',
  // Service-worker lifecycle logs fired by the mocked registration in tests.
  'App is being served from cache',
  // Intentional fallback signal (AGENTS.md rule 12) — shader-failure tests
  // deliberately trigger the warn path to prove the fallback engages.
  'SkeletonWebGL shader error',
  'Service worker has been registered',
  'Content has been cached for offline use',
  'New content is downloading',
  'New content is available; refreshing page',
  'No internet connection found',
  'Error during service worker registration',
  // Widget/shader warn paths — tests intentionally force fallback branches.
  'CloseButton',
  'SwitchWebGL',
  'ThemeSlider',
  'FlagWebGL',
  'Program link error',
  // Store/router error paths exercised by dedicated failure tests.
  '[Store]',
  '[Router] listener error',
  // CMS offline fetch + auth failure paths under the no-credential env.
  'REST DB fetch failed',
  'Google Sign-In Error',
  'Error loading',
  'Error saving',
  'Error syncing',
])

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
