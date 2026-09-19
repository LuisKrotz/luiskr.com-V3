/**
 * @file test-constants.js
 * Shared fixture: file paths, selector strings and helper functions
 * used across the test suite. Import from here — never repeat in individual test files.
 */

import fs from 'fs'
import path from 'path'

export const ROOT_DIR = process.cwd()

// ─── SCSS file contents (cached once at module load) ──────────────────────────
const readScss = (name) => fs.readFileSync(path.join(ROOT_DIR, 'src/sass', name), 'utf-8')

export const SCSS = {
  about: readScss('about.scss'),
  app: readScss('app.scss'),
  awardsFooter: readScss('awards-footer.scss'),
  carouselHost: readScss('carousel-host.scss'),
  carousel: readScss('carousel.scss'),
  cms: readScss('cms.scss'),
  contact: readScss('contact.scss'),
  drawText: readScss('draw-text.scss'),
  fonts: readScss('_fonts.scss'),
  homeCarousel: readScss('home-carousel.scss'),
  homeMosaic: readScss('home-mosaic.scss'),
  internals: readScss('internals.scss'),
  mediaFigure: readScss('media-figure.scss'),
  modal: readScss('modal.scss'),
  mixins: readScss('_mixins.scss'),
  notFound: readScss('not-found.scss'),
  placeholders: readScss('_placeholders.scss'),
  preferences: readScss('preferences.scss'),
  structure: readScss('_structure.scss'),
  variables: readScss('_variables.scss'),
}

// ─── JS source file contents (cached once) ────────────────────────────────────
const readJs = (rel) => {
  const full = path.join(ROOT_DIR, rel)
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf-8') : ''
}

export const SRC = {
  App: readJs('src/App.js'),
  AppNav: readJs('src/components/AppNav.js'),
  AboutSection: readJs('src/components/AboutSection.js'),
  AwardsMentions: readJs('src/components/AwardsMentions.js'),
  CustomCarousel: readJs('src/components/CustomCarousel.js'),
  ContactSection: readJs('src/components/ContactSection.js'),
  DrawText: readJs('src/components/DrawText.js'),
  HomeCarousel: readJs('src/components/HomeCarousel.js'),
  HomeMosaic: readJs('src/components/HomeMosaic.js'),
  LangDialog: readJs('src/components/LangDialog.js'),
  MediaExpanded: readJs('src/components/MediaExpanded.js'),
  MediaFigure: readJs('src/components/MediaFigure.js'),
  PreferencesModal: readJs('src/components/PreferencesModal.js'),
  Skeleton: readJs('src/components/Skeleton.js'),
  CmsAboutEditor: readJs('src/components/cms/CmsAboutEditor.js'),
  CmsFooterEditor: readJs('src/components/cms/CmsFooterEditor.js'),
  CmsLangEditor: readJs('src/components/cms/CmsLangEditor.js'),
  CmsPortfolioList: readJs('src/components/cms/CmsPortfolioList.js'),
  CmsProjectsList: readJs('src/components/cms/CmsProjectsList.js'),
  LegalFooter: readJs('src/components/legal/Footer.js'),
  PortfolioRelated: readJs('src/components/portfolio/Related.js'),
  AdminLogin: readJs('src/views/AdminLogin.js'),
  CmsDashboard: readJs('src/views/CmsDashboard.js'),
  Home: readJs('src/views/Home.js'),
  Legal: readJs('src/views/Legal.js'),
  NotFound: readJs('src/views/NotFound.js'),
  Project: readJs('src/views/Project.js'),
  constants: readJs('src/core/constants.js'),
  store: readJs('src/core/store.js'),
  router: readJs('src/core/router.js'),
  sanitize: readJs('src/utils/sanitize.js'),
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safely append el to body, return cleanup fn */
export function mount(el) {
  document.body.appendChild(el)
  return () => {
    if (el && el.parentNode) el.parentNode.removeChild(el)
  }
}
