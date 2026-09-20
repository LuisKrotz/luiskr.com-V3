import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { ViewProject } from '../src/views/Project.js'
import { HomeMosaic } from '../src/components/HomeMosaic.js'
import { ViewHome } from '../src/views/Home.js'
import { ViewLegal } from '../src/views/Legal.js'
import { ViewNotFound } from '../src/views/NotFound.js'
import { LegalFooter, getFallbackLegalLinks } from '../src/components/legal/Footer.js'
import { PortfolioRelated } from '../src/components/portfolio/Related.js'
import { LAYOUT, CAROUSEL, CLASSES, TAGS, TEXT } from '../src/core/constants.js'
import { SCSS, SRC, mount } from './fixtures/test-constants.js'
import store from '../src/core/store.js'
import router from '../src/core/router.js'

// ─── Local selector helpers (derived from TAGS/CLASSES) ───────────────────────
const S = {
  DRAW_TEXT:          TAGS.DRAW_TEXT,
  MEDIA_FIGURE:       TAGS.MEDIA_FIGURE,
  PORTFOLIO_RELATED:  TAGS.PORTFOLIO_RELATED,
  HOME_MOSAIC_ITEM:   `.${CLASSES.HOME_MOSAIC_ITEM}`,
  HOME_MOSAIC_TITLE:  `.${CLASSES.HOME_MOSAIC_TITLE}`,
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
    const skeletonTitle = projectEl.shadowRoot.querySelector(`.${CLASSES.SKELETON_TITLE_MD}`)
    const skeletonCover = projectEl.shadowRoot.querySelector(`.${CLASSES.INTERNAL_MAIN_ITEM}`)
    expect(skeletonTitle).not.toBeNull()
    expect(skeletonCover).not.toBeNull()
    expect(projectEl.shadowRoot.textContent).not.toContain('Loading')
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
    expect(drawText.getAttribute('text')).toBe('Stellar Branding Project')
    expect(mediaFigure).not.toBeNull()
    expect(mediaFigure.getAttribute('src')).toBe('portfolio/stellar/cover')
    expect(mediaFigure.getAttribute('width')).toBe('1920')
    expect(mediaFigure.getAttribute('height')).toBe('1080')
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
    expect(mediaFigure.getAttribute('is-video')).toBe('true')
    expect(mediaFigure.getAttribute('auto-play')).toBe('true')
  })

  test('isLandscapeGroup returns true when all items have landscape class', () => {
    const landscapeGroup = [
      { src: 'img1', class: 'landscape' },
      { src: 'img2', class: 'landscape' },
    ]
    expect(projectEl.isLandscapeGroup(landscapeGroup)).toBe(true)
  })

  test('isLandscapeGroup returns false when any item is portrait or standard', () => {
    const mixedGroup = [
      { src: 'img1', class: 'landscape' },
      { src: 'img2', class: 'portrait' },
    ]
    expect(projectEl.isLandscapeGroup(mixedGroup)).toBe(false)
  })

  test('isLandscapeGroup returns false for empty or non-array groups', () => {
    expect(projectEl.isLandscapeGroup([])).toBe(false)
    expect(projectEl.isLandscapeGroup(null)).toBe(false)
  })

  test('textDelay dynamically calculates per-character animation delay', () => {
    const textItems = ['Short heading', 'A slightly longer paragraph describing the design process.']
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

    const carousel = projectEl.shadowRoot.querySelector(TAGS.CUSTOM_CAROUSEL)
    expect(carousel).not.toBeNull()
    expect(carousel.items.length).toBe(2)
  })

  test('renders portfolio-related component at bottom of article', () => {
    const related = projectEl.shadowRoot.querySelector(S.PORTFOLIO_RELATED)
    expect(related).not.toBeNull()
  })

  test('includes dialog.modal-above for fullscreen lightbox preview', () => {
    const modalDialog = projectEl.shadowRoot.querySelector(`dialog.${CLASSES.MODAL_ABOVE}`)
    expect(modalDialog).not.toBeNull()
    expect(modalDialog.getAttribute('aria-label')).toBe('Media preview')
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

// ─────────────────────────────────────────────────────────────────────────────
// HomeMosaic (from home view)
// ─────────────────────────────────────────────────────────────────────────────
describe('HomeMosaic (view integration)', () => {
  let mosaicEl
  let cleanup

  beforeEach(() => {
    store.commit('setInputMethod', 'mouse')
    mosaicEl = new HomeMosaic()
    cleanup = mount(mosaicEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(mosaicEl.shadowRoot).not.toBeNull()
  })

  test('layout constants are FEAT_MULT=0.48, COMP_MULTS=[0.56,0.58,0.54,0.57,0.55], GAP=16', () => {
    expect(LAYOUT.FEAT_MULT).toBe(0.48)
    expect(LAYOUT.COMP_MULTS).toEqual([0.56, 0.58, 0.54, 0.57, 0.55])
    expect(LAYOUT.GAP).toBe(16)
  })

  test('renders mosaic items with title overlay', () => {
    mosaicEl.processedItems = [
      { label: 'Project Alpha', link: 'project-alpha', image: 'alpha', description: 'Branding.', featured: false },
      { label: 'Project Beta', link: 'project-beta', image: 'beta', description: 'E-commerce.', featured: true },
    ]
    mosaicEl._updateDom()

    const items = mosaicEl.shadowRoot.querySelectorAll(S.HOME_MOSAIC_ITEM)
    expect(items.length).toBe(2)
    const titles = mosaicEl.shadowRoot.querySelectorAll(S.HOME_MOSAIC_TITLE)
    expect(titles[0].textContent).toContain('Project Alpha')
    expect(titles[1].textContent).toContain('Project Beta')
  })

  test('featured card has home-mosaic-item--featured class', () => {
    mosaicEl.processedItems = [
      { label: 'Standard', link: 'std', image: 's1', featured: false },
      { label: 'Featured', link: 'feat', image: 's2', featured: true },
    ]
    mosaicEl._updateDom()
    const items = mosaicEl.shadowRoot.querySelectorAll(S.HOME_MOSAIC_ITEM)
    expect(items[0].classList.contains('home-mosaic-item--featured')).toBe(false)
    expect(items[1].classList.contains('home-mosaic-item--featured')).toBe(true)
  })

  test('onHover updates hoveredIdx and expands card details', () => {
    mosaicEl.processedItems = [
      { label: 'Card 1', link: 'c1', image: 'i1', description: 'Desc 1', featured: false },
    ]
    mosaicEl.onHover(0)
    expect(mosaicEl.hoveredIdx).toBe(0)
    expect(mosaicEl.cards[0].bottomH).toBeGreaterThanOrEqual(130)
  })

  test('onLeave resets hoveredIdx to null', () => {
    mosaicEl.hoveredIdx = 0
    mosaicEl.onLeave()
    expect(mosaicEl.hoveredIdx).toBeNull()
  })

  test('onClick routes immediately on non-touch devices', () => {
    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})
    store.commit('setInputMethod', 'mouse')
    const item = { title: 'Test Project', link: 'test-project', image: 'test' }
    mosaicEl.onClick(item, 0)
    expect(pushSpy).toHaveBeenCalledWith('/portfolio/test-project')
    pushSpy.mockRestore()
  })

  test('onClick on touch device expands card on first tap without routing', () => {
    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})
    store.commit('setInputMethod', 'touch')
    mosaicEl.touchIdx = null
    const item = { title: 'Touch Project', link: 'touch-project', image: 'touch' }
    mosaicEl.onClick(item, 0)
    expect(mosaicEl.touchIdx).toBe(0)
    expect(pushSpy).not.toHaveBeenCalled()
    pushSpy.mockRestore()
  })

  test('onClick on touch device routes on second tap of the active card', () => {
    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})
    store.commit('setInputMethod', 'touch')
    mosaicEl.touchIdx = 0
    const item = { label: 'Touch Project', link: 'touch-project', image: 'touch' }
    mosaicEl.onClick(item, 0)
    expect(pushSpy).toHaveBeenCalledWith('/portfolio/touch-project')
    pushSpy.mockRestore()
  })

  test('touch interaction collapses previous card when tapping a new card', () => {
    store.commit('setInputMethod', 'touch')
    mosaicEl.processedItems = [
      { label: 'Card 0', link: 'c0', image: 'i0', description: 'Desc 0' },
      { label: 'Card 1', link: 'c1', image: 'i1', description: 'Desc 1' },
    ]
    mosaicEl._updateDom()
    mosaicEl.touchIdx = 0
    mosaicEl.bottomHMap[0] = 160
    mosaicEl.onClick(mosaicEl.processedItems[1], 1)
    expect(mosaicEl.touchIdx).toBe(1)
    expect(mosaicEl.bottomHMap[0]).toBeUndefined()
  })

  test('skeletonH returns valid px string', () => {
    const h = mosaicEl.skeletonH
    expect(typeof h).toBe('string')
    expect(h).toMatch(/\d+px$/)
    expect(parseInt(h, 10)).toBeGreaterThan(0)
  })

  test('card geometry includes position absolute, top, left, width, height', () => {
    mosaicEl.processedItems = [{ label: 'Card', link: 'c', image: 'i', featured: false }]
    mosaicEl.quickLayout()
    const cardStyle = mosaicEl.cards[0].card
    expect(cardStyle.position).toBe('absolute')
    expect(cardStyle.top).toMatch(/\d+px$/)
    expect(cardStyle.left).toMatch(/\d+px$/)
    expect(cardStyle.width).toMatch(/\d+px$/)
    expect(cardStyle.height).toMatch(/\d+px$/)
  })

  // ─── SCSS structural assertions ───────────────────────────────────────────
  test('home-mosaic.scss defines container-type: inline-size', () => {
    expect(SCSS.homeMosaic).toMatch(/container-type:\s*inline-size/)
  })

  test('home-mosaic.scss defines hover elevation and scale', () => {
    expect(SCSS.homeMosaic).toMatch(/transform:\s*translateY\(-#\{to-rem\(\$space-sm\)\}\)\s*scale\(1\.015\)/)
  })

  test('home-mosaic.scss defines image zoom on hover', () => {
    expect(SCSS.homeMosaic).toMatch(/transform:\s*scale\(1\.07\)/)
  })

  test('home-mosaic.scss defines .home-mosaic-title with uppercase and letter-spacing', () => {
    expect(SCSS.homeMosaic).toMatch(/\.home-mosaic-title\s*\{[\s\S]*?text-transform:\s*uppercase/)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// ViewNotFound
// ─────────────────────────────────────────────────────────────────────────────
describe('ViewNotFound', () => {
  let notFoundEl
  let cleanup

  beforeEach(() => {
    notFoundEl = new ViewNotFound()
    cleanup = mount(notFoundEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(notFoundEl.shadowRoot).not.toBeNull()
  })

  test('homePath defaults to "/" for English', () => {
    store.commit('setLang', 'en')
    expect(notFoundEl.homePath).toBe('/')
  })

  test('homePath returns "/de" for German', () => {
    store.commit('setLang', 'de')
    expect(notFoundEl.homePath).toBe('/de')
    store.commit('setLang', 'en')
  })

  test('parses emojiLine and subtitle from title with <br>', () => {
    notFoundEl.translations = { title: '(>_<)<br>Page Not Found' }
    expect(notFoundEl.emojiLine).toBe('(>_<)')
    expect(notFoundEl.subtitle).toBe('Page Not Found')
  })

  test('renders emoji title and subtitle when translations are set', () => {
    notFoundEl.translations = { title: '(o_O)<br>Lost in Space', link: 'Return Home' }
    notFoundEl._updateDom()

    const titleEl = notFoundEl.shadowRoot.querySelector(`.${CLASSES.NOT_FOUND_TITLE}`)
    expect(titleEl).not.toBeNull()
    expect(titleEl.textContent).toContain('(o_O)')

    const subEl = notFoundEl.shadowRoot.querySelector(`.${CLASSES.NOT_FOUND_SUBTITLE}`)
    const drawText = subEl.querySelector(S.DRAW_TEXT)
    expect(drawText.getAttribute('text')).toBe('Lost in Space')

    const linkEl = notFoundEl.shadowRoot.querySelector(`.${CLASSES.NOT_FOUND_LINK}`)
    expect(linkEl.textContent).toContain('Return Home')
  })

  test('clicking return home link navigates to homePath', () => {
    let navigatedTo = null
    const origPush = router.push
    router.push = (path) => { navigatedTo = path }

    notFoundEl.translations = { title: '(o_O)<br>Lost', link: 'Back' }
    notFoundEl._updateDom()
    notFoundEl._bindLinks()

    const link = notFoundEl.shadowRoot.querySelector(`.${CLASSES.NOT_FOUND_LINK}`)
    link.click()
    expect(navigatedTo).toBe('/')
    router.push = origPush
  })

  test('not-found.scss defines layout, title, subtitle, link', () => {
    expect(SCSS.notFound).toMatch(/\.not-found\s*\{/)
    expect(SCSS.notFound).toMatch(/&-title\s*\{/)
    expect(SCSS.notFound).toMatch(/&-subtitle\s*\{/)
    expect(SCSS.notFound).toMatch(/&-link\s*\{/)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// ViewLegal
// ─────────────────────────────────────────────────────────────────────────────
describe('ViewLegal', () => {
  let legalEl
  let cleanup

  beforeEach(() => {
    legalEl = new ViewLegal()
    cleanup = mount(legalEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(legalEl.shadowRoot).not.toBeNull()
  })

  test('renders article and div#main with CLASSES.LEGAL', () => {
    const article = legalEl.shadowRoot.querySelector('article')
    expect(article).not.toBeNull()
    const main = legalEl.shadowRoot.querySelector(`div#main.${CLASSES.LEGAL}`)
    expect(main).not.toBeNull()
  })

  test('renders skeleton placeholders when translations is null', () => {
    legalEl.translations = null
    legalEl._updateDom()
    const titleSkel = legalEl.shadowRoot.querySelector(`.${CLASSES.SKELETON_TITLE_SM}`)
    expect(titleSkel).not.toBeNull()
    const descSkels = legalEl.shadowRoot.querySelectorAll(`.${CLASSES.INTERNAL_DESCRIPTION}`)
    expect(descSkels.length).toBe(3)
  })

  test('renders document title and sections when translations are provided', () => {
    legalEl.translations = {
      title: 'Privacy Policy',
      sections: [
        { title: 'Data Collection', content: ['We collect minimal data.', 'No trackers.'] },
        { title: 'Storage', content: ['Stored in Google Cloud.'] },
      ],
    }
    legalEl._updateDom()

    const title = legalEl.shadowRoot.querySelector(`.${CLASSES.INTERNAL_TITLE}`)
    expect(title.textContent).toContain('Privacy Policy')
    const sections = legalEl.shadowRoot.querySelectorAll(`.${CLASSES.INTERNAL_DESCRIPTION}`)
    expect(sections.length).toBe(2)
    expect(sections[0].textContent).toContain('Data Collection')
  })

  test('renders legal-footer component at the bottom', () => {
    const footer = legalEl.shadowRoot.querySelector(TAGS.LEGAL_FOOTER)
    expect(footer).not.toBeNull()
  })

  test('cleans up router subscription on onDestroy', () => {
    legalEl.onDestroy()
    expect(legalEl._unsubRoute).toBeNull()
  })

  test('internals.scss defines internal-title and internal-description styling', () => {
    expect(SCSS.internals).toMatch(/\.internal\s*\{/)
    expect(SCSS.internals).toMatch(/&-title\s*\{/)
    expect(SCSS.internals).toMatch(/&-description\s*\{/)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// LegalFooter
// ─────────────────────────────────────────────────────────────────────────────
describe('LegalFooter', () => {
  let footerEl
  let cleanup

  beforeEach(() => {
    footerEl = new LegalFooter()
    cleanup = mount(footerEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(footerEl.shadowRoot).not.toBeNull()
  })

  test('getFallbackLegalLinks returns 4 valid links for English locale', () => {
    const links = getFallbackLegalLinks('en')
    expect(links.length).toBe(4)
    expect(links[0].page).toBe('Home')
    expect(links[0].link).toBe('/')
    expect(links[1].page).toBe('Privacy Policy')
    expect(links[2].page).toBe('GDPR')
    expect(links[3].page).toBe('Terms of Use')
  })

  test('getFallbackLegalLinks returns localized labels for Portuguese (br)', () => {
    const links = getFallbackLegalLinks('br')
    expect(links.length).toBe(4)
    expect(links[0].page).toBe('Início')
    expect(links[0].link).toBe('/br/')
    expect(links[1].page).toBe('Política de Privacidade')
    expect(links[3].page).toBe('Termos de Uso')
  })

  test('getFallbackLegalLinks returns localized labels for German (de)', () => {
    const links = getFallbackLegalLinks('de')
    expect(links.length).toBe(4)
    expect(links[0].page).toBe('Startseite')
    expect(links[0].link).toBe('/de/')
    expect(links[1].page).toBe('Datenschutz')
    expect(links[3].page).toBe('Nutzungsbedingungen')
  })

  test('renders fallback links when store has no legal links', () => {
    store.commit('setComponentLang', {})
    footerEl._updateDom()
    const links = footerEl.shadowRoot.querySelectorAll('a')
    expect(links.length).toBe(4)
  })

  test('clicking link calls router.push with link href', () => {
    let pushedHref = null
    const origPush = router.push
    router.push = (href) => { pushedHref = href }

    footerEl._updateDom()
    const firstLink = footerEl.shadowRoot.querySelector('a')
    firstLink.click()
    expect(pushedHref).toBe(firstLink.getAttribute('href'))
    router.push = origPush
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// PortfolioRelated
// ─────────────────────────────────────────────────────────────────────────────
describe('PortfolioRelated', () => {
  let relatedEl
  let cleanup

  beforeEach(() => {
    relatedEl = new PortfolioRelated()
    cleanup = mount(relatedEl)
  })

  afterEach(() => cleanup())

  test('creates shadow root on construction', () => {
    expect(relatedEl.shadowRoot).not.toBeNull()
  })

  test('projectsList returns empty array when translations has no projects', () => {
    relatedEl.translations = {}
    expect(relatedEl.projectsList).toEqual([])
  })

  test('maps projects with clean links and resolves home portfolio images', () => {
    store.state.portfoliolist = [
      { link: 'art-direction', image: 'art-dir-thumb.webp', label: 'Art Direction' },
    ]
    relatedEl.translations = {
      path: '/portfolio/',
      projects: [{ link: '/portfolio/art-direction', page: 'Art Direction' }],
    }
    const projects = relatedEl.projectsList
    expect(projects.length).toBe(1)
    expect(projects[0].link).toBe('art-direction')
    expect(projects[0].imageSrc).toContain('art-dir-thumb.webp')
  })

  test('renders related section with title when translations are present', () => {
    relatedEl.translations = {
      title: 'More Projects',
      path: '/portfolio/',
      projects: [
        { link: '/portfolio/project-one', page: 'Project One' },
        { link: '/portfolio/project-two', page: 'Project Two' },
      ],
    }
    relatedEl._updateDom()
    expect(relatedEl.shadowRoot.textContent).toContain('More Projects')
    const links = relatedEl.shadowRoot.querySelectorAll('a')
    expect(links.length).toBe(2)
  })

  test('clicking item link pushes route to router', () => {
    let routed = null
    const origPush = router.push
    router.push = (path) => { routed = path }

    relatedEl.translations = {
      title: 'More Projects',
      path: '/portfolio/',
      projects: [{ link: '/portfolio/design-system', page: 'Design System' }],
    }
    relatedEl._updateDom()
    const link = relatedEl.shadowRoot.querySelector('a')
    expect(link).not.toBeNull()
    link.click()
    expect(routed).toContain('design-system')
    router.push = origPush
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// JS source structure assertions
// ─────────────────────────────────────────────────────────────────────────────
describe('Source file structure', () => {
  test('Home view contains HOME_MOSAIC, ABOUT_SECTION, CONTACT_SECTION, AWARDS_MENTIONS', () => {
    expect(SRC.Home).toContain('HOME_MOSAIC')
    expect(SRC.Home).toContain('id="about"')
    expect(SRC.Home).toContain('ABOUT_SECTION')
    expect(SRC.Home).toContain('id="contact"')
    expect(SRC.Home).toContain('CONTACT_SECTION')
    expect(SRC.Home).toContain('AWARDS_MENTIONS')
  })

  test('Project view contains INTERNAL_TITLE, INTERNAL_MAIN, custom-carousel, portfolio-related', () => {
    expect(SRC.Project).toContain('INTERNAL_TITLE')
    expect(SRC.Project).toContain('INTERNAL_MAIN')
    expect(SRC.Project).toContain('INTERNAL_DESCRIPTION')
    expect(SRC.Project).toContain('custom-carousel')
    expect(SRC.Project).toContain('portfolio-related')
  })

  test('Legal view contains INTERNAL_TITLE, INTERNAL_DESCRIPTION, LEGAL_FOOTER', () => {
    expect(SRC.Legal).toContain('INTERNAL_TITLE')
    expect(SRC.Legal).toContain('INTERNAL_DESCRIPTION')
    expect(SRC.Legal).toContain('INTERNAL_DESCRIPTION_TEXT')
    expect(SRC.Legal).toContain('LEGAL_FOOTER')
  })

  test('NotFound view contains not-found class references', () => {
    expect(SRC.NotFound).toContain('not-found')
  })

  test('PortfolioRelated contains RELATED_MOSAIC, RELATED_MOSAIC_ITEM, INTERNAL_FOOTER_ITEMS_NOTE', () => {
    expect(SRC.PortfolioRelated).toContain('RELATED_MOSAIC')
    expect(SRC.PortfolioRelated).toContain('RELATED_MOSAIC_ITEM')
    expect(SRC.PortfolioRelated).toContain('INTERNAL_FOOTER_ITEMS_NOTE')
  })

  test('LegalFooter contains INTERNAL_FOOTER, INTERNAL_FOOTER_ITEMS_LINK, INTERNAL_FOOTER_ITEMS_SEP', () => {
    expect(SRC.LegalFooter).toContain('INTERNAL_FOOTER')
    expect(SRC.LegalFooter).toContain('INTERNAL_FOOTER_ITEMS_LINK')
    expect(SRC.LegalFooter).toContain('CONTACT_OTHER_LINK')
    expect(SRC.LegalFooter).toContain('INTERNAL_FOOTER_ITEMS_SEP')
  })
})
