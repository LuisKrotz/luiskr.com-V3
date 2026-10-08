/**
 * @file views-viewproject.test.js
 * @description Split from views.test.js — covers the "ViewProject" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { ViewProject } from '@website/views/project/Project.js'
import { SCSS, mount } from '@tests/fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { HOME_MOSAIC_CLASSES } from '@core/tokens/classes/mosaic.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'
import { INTERNAL_CLASSES } from '@core/tokens/classes/project.js'
import { LABEL_TEXT } from '@core/tokens/strings/text.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { COVER_DIMENSIONS } from '@core/tokens/media/dimensions.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'

// ─── Local selector helpers (derived from TAGS/CLASSES) ───────────────────────
const S = {
  DRAW_TEXT: COMPONENT_TAGS.DRAW_TEXT,
  MEDIA_FIGURE: COMPONENT_TAGS.MEDIA_FIGURE,
  PORTFOLIO_RELATED: COMPONENT_TAGS.PORTFOLIO_RELATED,
  HOME_MOSAIC_ITEM: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_ITEM}`,
  HOME_MOSAIC_TITLE: `.${HOME_MOSAIC_CLASSES.HOME_MOSAIC_TITLE}`,
}

// ─────────────────────────────────────────────────────────────────────────────
// ViewProject
// ─────────────────────────────────────────────────────────────────────────────
describe('ViewProject', () => {
  let projectEl
  let cleanup

  beforeEach(() => {
    projectEl = new ViewProject()
    cleanup = mount(projectEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(projectEl.shadowRoot).not.toBeNull()
  })

  test('renders skeleton state when translations are null', () => {
    const skeletonTitle = projectEl.shadowRoot.querySelector(
      `.${SKELETON_CLASSES.SKELETON_TITLE_MD}`
    )
    const skeletonCover = projectEl.shadowRoot.querySelector(
      `.${INTERNAL_CLASSES.INTERNAL_MAIN_ITEM}`
    )
    expect(skeletonTitle).not.toBeNull()
    expect(skeletonCover).not.toBeNull()
    expect(projectEl.shadowRoot.textContent).not.toContain(LABEL_TEXT.LOADING)
  })

  test('renders title and cover media when translations are provided', () => {
    projectEl.translations = {
      title: 'Stellar Branding Project',
      folder: 'portfolio/stellar/',
      cover: { src: 'cover', size: [1920, 1080], isVideo: false, label: 'Cover Art' },
      sections: [],
    }
    projectEl._updateDom()

    const drawText = projectEl.shadowRoot.querySelector(S.DRAW_TEXT)
    const mediaFigure = projectEl.shadowRoot.querySelector(S.MEDIA_FIGURE)
    expect(drawText).not.toBeNull()
    expect(drawText.getAttribute(FORM_ATTRS.TEXT)).toBe('Stellar Branding Project')
    expect(mediaFigure).not.toBeNull()
    expect(mediaFigure.getAttribute(MEDIA_ATTRS.SRC)).toBe('portfolio/stellar/cover')
    expect(mediaFigure.getAttribute(MEDIA_ATTRS.WIDTH)).toBe(COVER_DIMENSIONS.FHD_WIDTH_STR)
    expect(mediaFigure.getAttribute(MEDIA_ATTRS.HEIGHT)).toBe('1080')
  })

  test('renders video cover with autoPlay and isVideo attributes', () => {
    projectEl.translations = {
      title: 'Video Showcase',
      folder: 'portfolio/video/',
      cover: { src: 'hero-reel', size: [1920, 1080], isVideo: true, label: 'Reel' },
      sections: [],
    }
    projectEl._updateDom()
    const mediaFigure = projectEl.shadowRoot.querySelector(S.MEDIA_FIGURE)
    expect(mediaFigure.getAttribute(MEDIA_ATTRS.IS_VIDEO)).toBe(STATE_STRINGS.TRUE)
    expect(mediaFigure.getAttribute(MEDIA_ATTRS.AUTO_PLAY)).toBe(STATE_STRINGS.TRUE)
  })

  test('isLandscapeGroup returns true when all items have landscape class', () => {
    const landscapeGroup = [
      { src: 'img1', class: STATE_STRINGS.LANDSCAPE },
      { src: 'img2', class: STATE_STRINGS.LANDSCAPE },
    ]
    expect(projectEl.isLandscapeGroup(landscapeGroup)).toBe(true)
  })

  test('isLandscapeGroup returns false when any item is portrait or standard', () => {
    const mixedGroup = [
      { src: 'img1', class: STATE_STRINGS.LANDSCAPE },
      { src: 'img2', class: 'portrait' },
    ]
    expect(projectEl.isLandscapeGroup(mixedGroup)).toBe(false)
  })

  test('isLandscapeGroup returns false for empty or non-array groups', () => {
    expect(projectEl.isLandscapeGroup([])).toBe(false)
    expect(projectEl.isLandscapeGroup(null)).toBe(false)
  })

  test('textDelay dynamically calculates per-character animation delay', () => {
    const textItems = [
      'Short heading',
      'A slightly longer paragraph describing the design process.',
    ]
    const delay = projectEl.textDelay(textItems)
    expect(delay).toBeGreaterThanOrEqual(1)
    expect(delay).toBeLessThanOrEqual(22)
  })

  test('textOffset returns cumulative character offset for staggered entry', () => {
    const textItems = ['First block', 'Second block follows after first block finishes.']
    const offset0 = projectEl.textOffset(textItems, 0)
    const offset1 = projectEl.textOffset(textItems, 1)
    expect(offset0).toBe(0)
    expect(offset1).toBeGreaterThan(0)
  })

  test('renders custom-carousel elements for image sections', () => {
    projectEl.translations = {
      title: 'Gallery Project',
      folder: 'gallery/',
      cover: { src: 'cover', size: [1920, 1080] },
      sections: [
        [
          ['Description paragraph 1'],
          [
            { src: 'slide1', size: [1920, 1080], label: 'Slide 1' },
            { src: 'slide2', size: [1920, 1080], label: 'Slide 2' },
          ],
        ],
      ],
    }
    projectEl._updateDom()
    projectEl._bindCarousels()

    const carousel = projectEl.shadowRoot.querySelector(COMPONENT_TAGS.CUSTOM_CAROUSEL)
    expect(carousel).not.toBeNull()
    expect(carousel.items.length).toBe(2)
  })

  test('renders portfolio-related component at bottom of article', () => {
    const related = projectEl.shadowRoot.querySelector(S.PORTFOLIO_RELATED)
    expect(related).not.toBeNull()
  })

  test('includes dialog.modal-above for fullscreen lightbox preview', () => {
    const modalDialog = projectEl.shadowRoot.querySelector(`dialog.${MODAL_CLASSES.MODAL_ABOVE}`)
    expect(modalDialog).not.toBeNull()
    expect(modalDialog.getAttribute(ARIA_ATTRS.ARIA_LABEL)).toBe('Media preview')
  })

  // ─── SCSS structural assertions ───────────────────────────────────────────
  test('internals.scss defines .internal-main with flex centering and dark background', () => {
    expect(SCSS.internals).toMatch(/&-main\s*\{[\s\S]*?display:\s*flex/)
    expect(SCSS.internals).toMatch(/&-main\s*\{[\s\S]*?align-items:\s*center/)
    expect(SCSS.internals).toMatch(/&-main\s*\{[\s\S]*?justify-content:\s*center/)
    expect(SCSS.internals).toMatch(/&-main\s*\{[\s\S]*?background-color:\s*var\(--bg-dark\)/)
  })

  test('internals.scss defines dynamic carousel item min-height', () => {
    expect(SCSS.internals).toMatch(/min-height:\s*var\(--carousel-item-height,\s*auto\)/)
  })

  test('internals.scss progressive image styles define blur on thumb and opacity transition on high-res', () => {
    expect(SCSS.internals).toMatch(/--thumb[\s\S]*?filter:\s*blur\(12px\)/)
    expect(SCSS.internals).toMatch(/--high[\s\S]*?opacity:\s*0/)
    expect(SCSS.internals).toMatch(/render-media--loaded[\s\S]*?opacity:\s*1/)
  })
})
