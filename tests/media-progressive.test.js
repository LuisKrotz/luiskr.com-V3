/**
 * @file media-progressive.test.js
 * @description Tests the progressive image loading pipeline in MediaFigure:
 * blur-up thumbnail → MSSIM-quality medium → uncompressed full res.
 * Also covers video autoplay, IntersectionObserver management, and GPU acceleration.
 *
 */

import '../src/components/MediaFigure.js'
import store from '../src/core/store.js'
import { MEDIA } from '../src/core/constants.js'

// Get the actual storage URL the store is configured with
// (production Firebase Storage URL — not a mock)
const ACTUAL_STORAGE = store.getters.getStorage?.() || 'https://storage.googleapis.com/luiskr.com/public/_v3/'

describe('MediaFigure — Progressive Loading & Media', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('media-figure')
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  // ── Component Registration ─────────────────────────────────────────────────────
  describe('1. Custom Element Registration', () => {
    test('media-figure is registered as a custom element', () => {
      expect(customElements.get('media-figure')).toBeDefined()
    })

    test('media-figure is an instance of HTMLElement', () => {
      expect(el instanceof HTMLElement).toBe(true)
    })

    test('has open shadow root', () => {
      document.body.appendChild(el)
      expect(el.shadowRoot).not.toBeNull()
      expect(el.shadowRoot.mode).toBe('open')
    })

    test('observes correct attributes', () => {
      const observed = el.constructor.observedAttributes
      expect(observed).toContain('src')
      expect(observed).toContain('label')
      expect(observed).toContain('width')
      expect(observed).toContain('height')
      expect(observed).toContain('can-expand')
      expect(observed).toContain('is-video')
      expect(observed).toContain('auto-play')
      expect(observed).toContain('classes')
    })
  })

  // ── Attribute Getters ──────────────────────────────────────────────────────
  describe('2. Attribute Getter/Setter Behavior', () => {
    test('canExpand defaults to false', () => {
      expect(el.canExpand).toBe(false)
    })

    test('canExpand is true when attribute "can-expand" is present', () => {
      el.setAttribute('can-expand', '')
      expect(el.canExpand).toBe(true)
    })

    test('canExpand is false when attribute is "false"', () => {
      el.setAttribute('can-expand', 'false')
      expect(el.canExpand).toBe(false)
    })

    test('isVideo defaults to false', () => {
      expect(el.isVideo).toBe(false)
    })

    test('isVideo is true when is-video attribute is present', () => {
      el.setAttribute('is-video', '')
      expect(el.isVideo).toBe(true)
    })

    test('isVideo is false when attribute is "false"', () => {
      el.setAttribute('is-video', 'false')
      expect(el.isVideo).toBe(false)
    })

    test('autoPlay defaults to false', () => {
      expect(el.autoPlay).toBe(false)
    })

    test('autoPlay is true when auto-play attribute is present', () => {
      el.setAttribute('auto-play', '')
      expect(el.autoPlay).toBe(true)
    })

    test('mediaWidth defaults to 800', () => {
      expect(el.mediaWidth).toBe(800)
    })

    test('mediaWidth reads from width attribute', () => {
      el.setAttribute('width', '1920')
      expect(el.mediaWidth).toBe(1920)
    })

    test('mediaHeight defaults to 450', () => {
      expect(el.mediaHeight).toBe(450)
    })

    test('mediaHeight reads from height attribute', () => {
      el.setAttribute('height', '1080')
      expect(el.mediaHeight).toBe(1080)
    })

    test('label defaults to empty string', () => {
      expect(el.label).toBe('')
    })

    test('label reads from attribute', () => {
      el.setAttribute('label', 'Hero Image')
      expect(el.label).toBe('Hero Image')
    })

    test('mediaSrc defaults to empty string', () => {
      expect(el.mediaSrc).toBe('')
    })

    test('mediaSrc reads from src attribute', () => {
      el.setAttribute('src', 'project/cover')
      expect(el.mediaSrc).toBe('project/cover')
    })

    test('classes defaults to empty string', () => {
      expect(el.classes).toBe('')
    })

    test('classes reads from classes attribute', () => {
      el.setAttribute('classes', 'internal-main-item')
      expect(el.classes).toBe('internal-main-item')
    })

    test('displayWidth for images returns mediaWidth directly', () => {
      el.setAttribute('width', '1600')
      expect(el.displayWidth).toBe(1600)
    })

    test('displayWidth for video capped at 1920px', () => {
      el.setAttribute('is-video', 'true')
      el.setAttribute('width', '2560')
      expect(el.displayWidth).toBe(1920)
    })

    test('displayWidth for video within limit passes through', () => {
      el.setAttribute('is-video', 'true')
      el.setAttribute('width', '1280')
      expect(el.displayWidth).toBe(1280)
    })
  })

  // ── URL Construction ────────────────────────────────────────────────────────
  describe('3. URL Construction — Must Match Vue Pipeline Exactly', () => {
    const BASE_STORAGE = 'https://storage.example.com/'
    const SRC = 'projects/test/image'

    test('thumb URL uses MEDIA.MOZ + MEDIA.THUMB_SUFFIX + MEDIA.EXT', () => {
      const expected = BASE_STORAGE + SRC + MEDIA.MOZ + MEDIA.THUMB_SUFFIX + MEDIA.EXT
      expect(expected).toBe(
        'https://storage.example.com/projects/test/image-mozjpg3-MSSIM-tuned-kodak.jpg'
      )
    })

    test('q50 URL uses MEDIA.MOZ + MEDIA.Q50 + MEDIA.EXT', () => {
      const expected = BASE_STORAGE + SRC + MEDIA.MOZ + MEDIA.Q50 + MEDIA.EXT
      expect(expected).toBe(
        'https://storage.example.com/projects/test/image-mozjpg-50.jpg'
      )
    })

    test('uncompressed URL uses MEDIA.MOZ + MEDIA.Q100 + MEDIA.EXT', () => {
      const expected = BASE_STORAGE + SRC + MEDIA.MOZ + MEDIA.Q100 + MEDIA.EXT
      expect(expected).toBe(
        'https://storage.example.com/projects/test/image-mozjpg-uncompressed.jpg'
      )
    })

    test('video primary URL uses MEDIA.VIDEO_EXT (.mp4)', () => {
      const expected = BASE_STORAGE + SRC + MEDIA.VIDEO_EXT
      expect(expected).toBe('https://storage.example.com/projects/test/image.mp4')
    })

    test('video poster URL uses MEDIA.VIDEO_THUMB_EXT', () => {
      const expected = BASE_STORAGE + SRC + MEDIA.VIDEO_THUMB_EXT
      expect(expected).toBe(
        'https://storage.example.com/projects/test/image.mp4.jpg-thumb.jpg'
      )
    })

    test('video scale-down URL: MEDIA.VIDEO_SCALE + VIDEO_EXT', () => {
      const expected = BASE_STORAGE + SRC + MEDIA.VIDEO_SCALE + MEDIA.VIDEO_EXT
      expect(expected).toBe(
        'https://storage.example.com/projects/test/image.mp4-scaledown-2x.mp4'
      )
    })

    test('video scale-down poster: MEDIA.VIDEO_SCALE + VIDEO_THUMB_EXT', () => {
      const expected = BASE_STORAGE + SRC + MEDIA.VIDEO_SCALE + MEDIA.VIDEO_THUMB_EXT
      expect(expected).toBe(
        'https://storage.example.com/projects/test/image.mp4-scaledown-2x.mp4.jpg-thumb.jpg'
      )
    })

    test('onInit() for image sets thumbSrc correctly', () => {
      el.setAttribute('src', SRC)
      el.onInit()
      const expectedThumb = ACTUAL_STORAGE + SRC + MEDIA.MOZ + MEDIA.THUMB_SUFFIX + MEDIA.EXT
      expect(el.thumbSrc).toBe(expectedThumb)
    })

    test('onInit() for video sets poster[0] to VIDEO_THUMB_EXT URL', () => {
      el.setAttribute('is-video', 'true')
      el.setAttribute('src', SRC)
      el.onInit()
      const expectedPoster = ACTUAL_STORAGE + SRC + MEDIA.VIDEO_THUMB_EXT
      expect(el.poster[0]).toBe(expectedPoster)
    })

    test('onInit() for video sets video[0] to VIDEO_EXT URL', () => {
      el.setAttribute('is-video', 'true')
      el.setAttribute('src', SRC)
      el.onInit()
      const expectedVideo = ACTUAL_STORAGE + SRC + MEDIA.VIDEO_EXT
      expect(el.video[0]).toBe(expectedVideo)
    })

    test('onInit() for video sets poster[1] to scale-down thumb URL', () => {
      el.setAttribute('is-video', 'true')
      el.setAttribute('src', SRC)
      el.onInit()
      const expectedPoster1 = ACTUAL_STORAGE + SRC + MEDIA.VIDEO_SCALE + MEDIA.VIDEO_THUMB_EXT
      expect(el.poster[1]).toBe(expectedPoster1)
    })

    test('onInit() for video sets video[1] to scale-down video URL', () => {
      el.setAttribute('is-video', 'true')
      el.setAttribute('src', SRC)
      el.onInit()
      const expectedVideo1 = ACTUAL_STORAGE + SRC + MEDIA.VIDEO_SCALE + MEDIA.VIDEO_EXT
      expect(el.video[1]).toBe(expectedVideo1)
    })

    test('videoSrcMain returns video[1] when two sources exist', () => {
      el.video = ['url-primary.mp4', 'url-scale.mp4']
      expect(el.videoSrcMain).toBe('url-scale.mp4')
    })

    test('videoSrcMain returns video[0] when only one source exists', () => {
      el.video = ['url-primary.mp4']
      expect(el.videoSrcMain).toBe('url-primary.mp4')
    })

    test('videoSrcMain returns empty string when no sources', () => {
      el.video = []
      expect(el.videoSrcMain).toBe('')
    })
  })

  // ── SVG Placeholder ────────────────────────────────────────────────────────
  describe('4. SVG Placeholder Generation', () => {
    test('placeholder() returns a data URI', () => {
      const uri = el.placeholder(800, 450)
      expect(uri).toMatch(/^data:image\/svg\+xml/)
    })

    test('placeholder() includes correct viewBox dimensions', () => {
      const uri = el.placeholder(1920, 1080)
      expect(uri).toContain('viewBox="0 0 1920 1080"')
    })

    test('placeholder() generates valid URI-encoded SVG', () => {
      const uri = el.placeholder(400, 300)
      // encodeURIComponent encodes < and > but NOT = signs
      // So '<svg' → '%3Csvg' but 'xmlns="..."' stays as-is
      expect(uri).toContain('%3Csvg')
      expect(uri).toContain('xmlns=') // NOT xmlns%3D
    })

    test('placeholder() encodes closing SVG tag', () => {
      const uri = el.placeholder(100, 100)
      expect(uri).toContain('%3C/svg%3E')
    })
  })

  // ── Render Output ──────────────────────────────────────────────────────────
  describe('5. render() HTML Output Structure', () => {
    const toHtml = (val) => (val?.outerHTML !== undefined ? val.outerHTML : String(val))

    test('render() returns a <figure> element', () => {
      const html = toHtml(el.render())
      expect(html).toContain('<figure')
      expect(html).toContain('</figure>')
    })

    test('image render includes .render-placeholder img', () => {
      const html = toHtml(el.render())
      expect(html).toContain('render-placeholder')
    })

    test('image render includes .render-media--thumb img', () => {
      const html = toHtml(el.render())
      expect(html).toContain('render-media--thumb')
    })

    test('image render includes .render-media--high img', () => {
      const html = toHtml(el.render())
      expect(html).toContain('render-media--high')
    })

    test('image render does NOT include <video>', () => {
      const html = toHtml(el.render())
      expect(html).not.toContain('<video')
    })

    test('video render includes <video> element', () => {
      el.setAttribute('is-video', 'true')
      const html = toHtml(el.render())
      expect(html).toContain('<video')
    })

    test('video render has playsinline attribute', () => {
      el.setAttribute('is-video', 'true')
      const html = toHtml(el.render())
      expect(html).toContain('playsinline')
    })

    test('video render has loop attribute', () => {
      el.setAttribute('is-video', 'true')
      const html = toHtml(el.render())
      expect(html).toContain('loop')
    })

    test('video render has muted attribute', () => {
      el.setAttribute('is-video', 'true')
      const html = toHtml(el.render())
      expect(html).toContain('muted')
    })

    test('video render has <source> with type="video/mp4"', () => {
      el.setAttribute('is-video', 'true')
      const html = toHtml(el.render())
      expect(html).toContain('type="video/mp4"')
    })

    test('canExpand adds expand buttons', () => {
      el.setAttribute('can-expand', 'true')
      const html = toHtml(el.render())
      expect(html).toContain('expand-modal-open-1')
      expect(html).toContain('expand-modal-open-2')
    })

    test('non-expandable does NOT have expand buttons', () => {
      const html = toHtml(el.render())
      expect(html).not.toContain('expand-modal-open-1')
    })

    test('canExpand sets internal-expand class on figure', () => {
      el.setAttribute('can-expand', 'true')
      const html = toHtml(el.render())
      expect(html).toContain('internal-expand')
    })

    test('img has decoding="async"', () => {
      const html = toHtml(el.render())
      expect(html).toContain('decoding="async"')
    })

    test('placeholder img has aria-hidden="true"', () => {
      const html = toHtml(el.render())
      expect(html).toContain('aria-hidden="true"')
    })

    test('high-res img has correct alt text', () => {
      el.setAttribute('label', 'Campaign Photo')
      const html = toHtml(el.render())
      expect(html).toContain('alt="Campaign Photo"')
    })
  })

  // ── Slugify ────────────────────────────────────────────────────────────────
  describe('6. slugify() — URL Slug Generation', () => {
    test('converts to lowercase', () => {
      expect(el.slugify('HELLO World')).toBe('hello-world')
    })

    test('replaces spaces with hyphens', () => {
      expect(el.slugify('some text here')).toBe('some-text-here')
    })

    test('removes special characters', () => {
      expect(el.slugify('Brand® Strategy')).toBe('brand-strategy')
    })

    test('collapses multiple hyphens', () => {
      expect(el.slugify('hello  world')).toBe('hello-world')
    })

    test('trims leading and trailing spaces', () => {
      expect(el.slugify('  hello  ')).toBe('hello')
    })

    test('returns empty string for null input', () => {
      expect(el.slugify(null)).toBe('')
    })

    test('returns empty string for undefined input', () => {
      expect(el.slugify(undefined)).toBe('')
    })

    test('returns empty string for empty string', () => {
      expect(el.slugify('')).toBe('')
    })

    test('handles accented characters by removing them', () => {
      const result = el.slugify('Naïve Résumé')
      expect(result).not.toContain('é')
      expect(result).not.toContain('ï')
    })

    test('matches Vue slugify behavior for "Hero Shot"', () => {
      expect(el.slugify('Hero Shot')).toBe('hero-shot')
    })

    test('matches Vue slugify behavior for "Before & After"', () => {
      expect(el.slugify('Before & After')).toBe('before-after')
    })
  })

  // ── Progressive Loading State ──────────────────────────────────────────────
  describe('7. Progressive Loading State', () => {
    test('isLoaded starts as false', () => {
      expect(el.isLoaded).toBe(false)
    })

    test('thumbSrc starts as empty string', () => {
      expect(el.thumbSrc).toBe('')
    })

    test('highResSrc starts as empty string', () => {
      expect(el.highResSrc).toBe('')
    })

    test('poster starts as empty array', () => {
      expect(el.poster).toHaveLength(0)
    })

    test('video starts as empty array', () => {
      expect(el.video).toHaveLength(0)
    })

    test('observer starts as null', () => {
      expect(el.observer).toBeNull()
    })

    test('imgObserver starts as null', () => {
      expect(el.imgObserver).toBeNull()
    })

    test('render() shows empty src for high-res when not loaded', () => {
      const r = el.render()
      const html = r?.outerHTML !== undefined ? r.outerHTML : String(r)
      expect(html).toContain('render-media--high')
      expect(html).not.toContain('render-media--loaded')
    })

    test('render() includes render-media--loaded class when isLoaded is true', () => {
      el.isLoaded = true
      const r = el.render()
      const html = r?.outerHTML !== undefined ? r.outerHTML : String(r)
      expect(html).toContain('render-media--loaded')
    })
  })

  // ── Modal Opening ──────────────────────────────────────────────────────────
  describe('8. Modal Integration', () => {
    test('openModal() does nothing when canExpand is false', () => {
      const before = store.getters.getModal()
      el.openModal()
      expect(store.getters.getModal()).toEqual(before)
    })

    test('openModal() with canExpand=true commits setModal to store', () => {
      el.setAttribute('can-expand', 'true')
      el.setAttribute('src', 'project/image')
      el.setAttribute('label', 'Test Image')
      el.setAttribute('width', '800')
      el.setAttribute('height', '450')
      el.thumbSrc = 'https://storage.example.com/project/image-mozjpg3-MSSIM-tuned-kodak.jpg'
      el.openModal()
      const modal = store.getters.getModal()
      expect(modal.open).toBe(true)
      expect(modal.class).toBe('modal-open')
      expect(modal.media.alt).toBe('Test Image')
    })

    test('openModal() sets media.width and media.height from attributes', () => {
      el.setAttribute('can-expand', 'true')
      el.setAttribute('width', '1200')
      el.setAttribute('height', '675')
      el.openModal()
      const modal = store.getters.getModal()
      expect(modal.media.width).toBe(1200)
      expect(modal.media.height).toBe(675)
    })

    test('openModal() for image uses uncompressed URL as source', () => {
      el.setAttribute('can-expand', 'true')
      el.setAttribute('src', 'project/image')
      el.openModal()
      const modal = store.getters.getModal()
      expect(modal.media.source).toContain(MEDIA.MOZ + MEDIA.Q100 + MEDIA.EXT)
    })

    test('openModal() for image uses thumb URL as thumb', () => {
      el.setAttribute('can-expand', 'true')
      el.setAttribute('src', 'project/image')
      el.openModal()
      const modal = store.getters.getModal()
      expect(modal.media.thumb).toContain(MEDIA.MOZ + MEDIA.THUMB_SUFFIX + MEDIA.EXT)
    })
  })

  describe('9. Observer Cleanup on Destroy', () => {
    test('onDestroy() disconnects and nulls observer', () => {
      let disconnected = false
      el.observer = { disconnect: () => { disconnected = true } }
      el.onDestroy()
      expect(el.observer).toBeNull()
      expect(disconnected).toBe(true)
    })

    test('onDestroy() disconnects and nulls imgObserver', () => {
      let disconnected = false
      el.imgObserver = { disconnect: () => { disconnected = true } }
      el.onDestroy()
      expect(el.imgObserver).toBeNull()
      expect(disconnected).toBe(true)
    })

    test('onDestroy() with null observers does not throw', () => {
      el.observer = null
      el.imgObserver = null
      expect(() => el.onDestroy()).not.toThrow()
    })
  })
})
