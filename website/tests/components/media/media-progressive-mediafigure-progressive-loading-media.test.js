/**
 * @file media-progressive-mediafigure-progressive-loading-media.test.js
 * @description Split from media-progressive.test.js — covers the "MediaFigure — Progressive Loading & Media" describe.
 */
import '@website/components/media/MediaFigure.js'
import store from '@core/store.js'
import { MEDIA } from '@core/constants.js'
import { CDN_URLS } from '@core/tokens/media/urls.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { COVER_DIMENSIONS } from '@core/tokens/media/dimensions.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { INTERNAL_CLASSES } from '@core/tokens/classes/project.js'
import { MEDIA_CLASSES } from '@core/tokens/classes/media.js'
import { EXPAND_MODAL_CLASSES, MODAL_CLASSES } from '@core/tokens/classes/modal.js'

// Get the actual storage URL the store is configured with
// (production Firebase Storage URL — not a mock)
const ACTUAL_STORAGE = store.getters.getStorage?.() || CDN_URLS.CDN_BASE

describe('MediaFigure — Progressive Loading & Media', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  // ── Component Registration ─────────────────────────────────────────────────────
  describe('1. Custom Element Registration', () => {
    test('media-figure is registered as a custom element', () => {
      expect(customElements.get(COMPONENT_TAGS.MEDIA_FIGURE)).toBeDefined()
    })

    test('media-figure is an instance of HTMLElement', () => {
      expect(el instanceof HTMLElement).toBe(true)
    })

    test('has open shadow root', () => {
      document.body.appendChild(el)
      expect(el.shadowRoot).not.toBeNull()
      expect(el.shadowRoot.mode).toBe(STATE_STRINGS.OPEN)
    })

    test('observes correct attributes', () => {
      const observed = el.constructor.observedAttributes
      expect(observed).toContain(MEDIA_ATTRS.SRC)
      expect(observed).toContain(HTML_TAGS.LABEL)
      expect(observed).toContain(MEDIA_ATTRS.WIDTH)
      expect(observed).toContain(MEDIA_ATTRS.HEIGHT)
      expect(observed).toContain(MEDIA_ATTRS.CAN_EXPAND)
      expect(observed).toContain(MEDIA_ATTRS.IS_VIDEO)
      expect(observed).toContain(MEDIA_ATTRS.AUTO_PLAY)
      expect(observed).toContain(COMMON_ATTRS.CLASSES)
    })
  })

  // ── Attribute Getters ──────────────────────────────────────────────────────
  describe('2. Attribute Getter/Setter Behavior', () => {
    test('canExpand defaults to false', () => {
      expect(el.canExpand).toBe(false)
    })

    test('canExpand is true when attribute "can-expand" is present', () => {
      el.setAttribute(MEDIA_ATTRS.CAN_EXPAND, '')
      expect(el.canExpand).toBe(true)
    })

    test('canExpand is false when attribute is "false"', () => {
      el.setAttribute(MEDIA_ATTRS.CAN_EXPAND, STATE_STRINGS.FALSE)
      expect(el.canExpand).toBe(false)
    })

    test('isVideo defaults to false', () => {
      expect(el.isVideo).toBe(false)
    })

    test('isVideo is true when is-video attribute is present', () => {
      el.setAttribute(MEDIA_ATTRS.IS_VIDEO, '')
      expect(el.isVideo).toBe(true)
    })

    test('isVideo is false when attribute is "false"', () => {
      el.setAttribute(MEDIA_ATTRS.IS_VIDEO, STATE_STRINGS.FALSE)
      expect(el.isVideo).toBe(false)
    })

    test('autoPlay defaults to false', () => {
      expect(el.autoPlay).toBe(false)
    })

    test('autoPlay is true when auto-play attribute is present', () => {
      el.setAttribute(MEDIA_ATTRS.AUTO_PLAY, '')
      expect(el.autoPlay).toBe(true)
    })

    test('mediaWidth defaults to 800', () => {
      expect(el.mediaWidth).toBe(800)
    })

    test('mediaWidth reads from width attribute', () => {
      el.setAttribute(MEDIA_ATTRS.WIDTH, COVER_DIMENSIONS.FHD_WIDTH_STR)
      expect(el.mediaWidth).toBe(1920)
    })

    test('mediaHeight defaults to 450', () => {
      expect(el.mediaHeight).toBe(450)
    })

    test('mediaHeight reads from height attribute', () => {
      el.setAttribute(MEDIA_ATTRS.HEIGHT, '1080')
      expect(el.mediaHeight).toBe(1080)
    })

    test('label defaults to empty string', () => {
      expect(el.label).toBe('')
    })

    test('label reads from attribute', () => {
      el.setAttribute(FORM_ATTRS.LABEL, 'Hero Image')
      expect(el.label).toBe('Hero Image')
    })

    test('mediaSrc defaults to empty string', () => {
      expect(el.mediaSrc).toBe('')
    })

    test('mediaSrc reads from src attribute', () => {
      el.setAttribute(MEDIA_ATTRS.SRC, 'project/cover')
      expect(el.mediaSrc).toBe('project/cover')
    })

    test('classes defaults to empty string', () => {
      expect(el.classes).toBe('')
    })

    test('classes reads from classes attribute', () => {
      el.setAttribute(COMMON_ATTRS.CLASSES, INTERNAL_CLASSES.INTERNAL_MAIN_ITEM)
      expect(el.classes).toBe(INTERNAL_CLASSES.INTERNAL_MAIN_ITEM)
    })

    test('displayWidth for images returns mediaWidth directly', () => {
      el.setAttribute(MEDIA_ATTRS.WIDTH, '1600')
      expect(el.displayWidth).toBe(1600)
    })

    test('displayWidth for video capped at 1920px', () => {
      el.setAttribute(MEDIA_ATTRS.IS_VIDEO, STATE_STRINGS.TRUE)
      el.setAttribute(MEDIA_ATTRS.WIDTH, '2560')
      expect(el.displayWidth).toBe(1920)
    })

    test('displayWidth for video within limit passes through', () => {
      el.setAttribute(MEDIA_ATTRS.IS_VIDEO, STATE_STRINGS.TRUE)
      el.setAttribute(MEDIA_ATTRS.WIDTH, '1280')
      expect(el.displayWidth).toBe(1280)
    })
  })

  // ── URL Construction ────────────────────────────────────────────────────────
  describe('3. URL Construction — Must Match Vue Pipeline Exactly', () => {
    const BASE_STORAGE = 'https://storage.example.com/'
    const SRC = 'projects/test/image'
    const VIDEO_PRIMARY = 'url-primary.mp4'
    const VIDEO_SCALE_SRC = 'url-scale.mp4'

    test('thumb URL uses MEDIA.MOZ + MEDIA.THUMB_SUFFIX + MEDIA.EXT', () => {
      const expected = BASE_STORAGE + SRC + MEDIA.MOZ + MEDIA.THUMB_SUFFIX + MEDIA.EXT
      expect(expected).toBe(
        'https://storage.example.com/projects/test/image-mozjpg3-MSSIM-tuned-kodak.jpg'
      )
    })

    test('q50 URL uses MEDIA.MOZ + MEDIA.Q50 + MEDIA.EXT', () => {
      const expected = BASE_STORAGE + SRC + MEDIA.MOZ + MEDIA.Q50 + MEDIA.EXT
      expect(expected).toBe('https://storage.example.com/projects/test/image-mozjpg-50.jpg')
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
      expect(expected).toBe('https://storage.example.com/projects/test/image.mp4.jpg-thumb.jpg')
    })

    test('video scale-down URL: MEDIA.VIDEO_SCALE + VIDEO_EXT', () => {
      const expected = BASE_STORAGE + SRC + MEDIA.VIDEO_SCALE + MEDIA.VIDEO_EXT
      expect(expected).toBe('https://storage.example.com/projects/test/image.mp4-scaledown-2x.mp4')
    })

    test('video scale-down poster: MEDIA.VIDEO_SCALE + VIDEO_THUMB_EXT', () => {
      const expected = BASE_STORAGE + SRC + MEDIA.VIDEO_SCALE + MEDIA.VIDEO_THUMB_EXT
      expect(expected).toBe(
        'https://storage.example.com/projects/test/image.mp4-scaledown-2x.mp4.jpg-thumb.jpg'
      )
    })

    test('onInit() for image sets thumbSrc correctly', () => {
      el.setAttribute(MEDIA_ATTRS.SRC, SRC)
      el.onInit()
      const expectedThumb = ACTUAL_STORAGE + SRC + MEDIA.MOZ + MEDIA.THUMB_SUFFIX + MEDIA.EXT
      expect(el.thumbSrc).toBe(expectedThumb)
    })

    test('onInit() for video sets poster[0] to VIDEO_THUMB_EXT URL', () => {
      el.setAttribute(MEDIA_ATTRS.IS_VIDEO, STATE_STRINGS.TRUE)
      el.setAttribute(MEDIA_ATTRS.SRC, SRC)
      el.onInit()
      const expectedPoster = ACTUAL_STORAGE + SRC + MEDIA.VIDEO_THUMB_EXT
      expect(el.poster[0]).toBe(expectedPoster)
    })

    test('onInit() for video sets video[0] to VIDEO_EXT URL', () => {
      el.setAttribute(MEDIA_ATTRS.IS_VIDEO, STATE_STRINGS.TRUE)
      el.setAttribute(MEDIA_ATTRS.SRC, SRC)
      el.onInit()
      const expectedVideo = ACTUAL_STORAGE + SRC + MEDIA.VIDEO_EXT
      expect(el.video[0]).toBe(expectedVideo)
    })

    test('onInit() for video sets poster[1] to scale-down thumb URL', () => {
      el.setAttribute(MEDIA_ATTRS.IS_VIDEO, STATE_STRINGS.TRUE)
      el.setAttribute(MEDIA_ATTRS.SRC, SRC)
      el.onInit()
      const expectedPoster1 = ACTUAL_STORAGE + SRC + MEDIA.VIDEO_SCALE + MEDIA.VIDEO_THUMB_EXT
      expect(el.poster[1]).toBe(expectedPoster1)
    })

    test('onInit() for video sets video[1] to scale-down video URL', () => {
      el.setAttribute(MEDIA_ATTRS.IS_VIDEO, STATE_STRINGS.TRUE)
      el.setAttribute(MEDIA_ATTRS.SRC, SRC)
      el.onInit()
      const expectedVideo1 = ACTUAL_STORAGE + SRC + MEDIA.VIDEO_SCALE + MEDIA.VIDEO_EXT
      expect(el.video[1]).toBe(expectedVideo1)
    })

    test('videoSrcMain returns video[0] (highest quality) when two sources exist', () => {
      el.video = [VIDEO_PRIMARY, VIDEO_SCALE_SRC]
      expect(el.videoSrcMain).toBe(VIDEO_PRIMARY)
    })

    test('videoSrcFallback returns video[1] (scaled-down) when two sources exist', () => {
      el.video = [VIDEO_PRIMARY, VIDEO_SCALE_SRC]
      expect(el.videoSrcFallback).toBe(VIDEO_SCALE_SRC)
    })

    test('videoSrcFallback returns empty string when only one source exists', () => {
      el.video = [VIDEO_PRIMARY]
      expect(el.videoSrcFallback).toBe('')
    })

    test('videoSrcMain returns video[0] when only one source exists', () => {
      el.video = [VIDEO_PRIMARY]
      expect(el.videoSrcMain).toBe(VIDEO_PRIMARY)
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

    test('placeholder() includes intrinsic size + viewBox dimensions', () => {
      const uri = decodeURIComponent(el.placeholder(1920, 1080))
      // Definite intrinsic size (width/height attrs) keeps `width:auto`
      // layouts at the natural box instead of the ~300×150 default
      // replaced size — this is what makes mixed carousel widths work.
      expect(uri).toContain('width="1920"')
      expect(uri).toContain('height="1080"')
      expect(uri).toContain('viewBox="0 0 1920 1080"')
    })

    test('placeholder() generates valid URI-encoded SVG', () => {
      const uri = el.placeholder(400, 300)
      expect(uri).toContain('%3Csvg')
      expect(decodeURIComponent(uri)).toContain('xmlns=')
    })

    test('placeholder() encodes closing SVG tag', () => {
      const uri = el.placeholder(100, 100)
      expect(uri).toContain('%3C%2Fsvg%3E')
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
      expect(html).toContain(MEDIA_CLASSES.RENDER_PLACEHOLDER)
    })

    test('image render includes .render-media--thumb img', () => {
      const html = toHtml(el.render())
      expect(html).toContain(MEDIA_CLASSES.RENDER_MEDIA_THUMB)
    })

    test('image render includes .render-media--high img', () => {
      const html = toHtml(el.render())
      expect(html).toContain(MEDIA_CLASSES.RENDER_MEDIA_HIGH)
    })

    test('image render does NOT include <video>', () => {
      const html = toHtml(el.render())
      expect(html).not.toContain('<video')
    })

    test('video render includes <video> element', () => {
      el.setAttribute(MEDIA_ATTRS.IS_VIDEO, STATE_STRINGS.TRUE)
      const html = toHtml(el.render())
      expect(html).toContain('<video')
    })

    test('video render has playsinline attribute', () => {
      el.setAttribute(MEDIA_ATTRS.IS_VIDEO, STATE_STRINGS.TRUE)
      const html = toHtml(el.render())
      expect(html).toContain(MEDIA_ATTRS.PLAYSINLINE)
    })

    test('video render has loop attribute', () => {
      el.setAttribute(MEDIA_ATTRS.IS_VIDEO, STATE_STRINGS.TRUE)
      const html = toHtml(el.render())
      expect(html).toContain(MEDIA_ATTRS.LOOP)
    })

    test('video render has muted attribute', () => {
      el.setAttribute(MEDIA_ATTRS.IS_VIDEO, STATE_STRINGS.TRUE)
      const html = toHtml(el.render())
      expect(html).toContain(MEDIA_ATTRS.MUTED)
    })

    test('video render has <source> with type="video/mp4"', () => {
      el.setAttribute(MEDIA_ATTRS.IS_VIDEO, STATE_STRINGS.TRUE)
      const html = toHtml(el.render())
      expect(html).toContain('type="video/mp4"')
    })

    test('canExpand adds expand buttons', () => {
      el.setAttribute(MEDIA_ATTRS.CAN_EXPAND, STATE_STRINGS.TRUE)
      const html = toHtml(el.render())
      expect(html).toContain(EXPAND_MODAL_CLASSES.EXPAND_MODAL_OPEN_1)
      expect(html).toContain(EXPAND_MODAL_CLASSES.EXPAND_MODAL_OPEN_2)
    })

    test('non-expandable does NOT have expand buttons', () => {
      const html = toHtml(el.render())
      expect(html).not.toContain(EXPAND_MODAL_CLASSES.EXPAND_MODAL_OPEN_1)
    })

    test('canExpand sets internal-expand class on figure', () => {
      el.setAttribute(MEDIA_ATTRS.CAN_EXPAND, STATE_STRINGS.TRUE)
      const html = toHtml(el.render())
      expect(html).toContain(INTERNAL_CLASSES.INTERNAL_EXPAND)
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
      el.setAttribute(FORM_ATTRS.LABEL, 'Campaign Photo')
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
      expect(html).toContain(MEDIA_CLASSES.RENDER_MEDIA_HIGH)
      expect(html).not.toContain(MEDIA_CLASSES.RENDER_MEDIA_LOADED)
    })

    test('render() includes render-media--loaded class when isLoaded is true', () => {
      el.isLoaded = true
      const r = el.render()
      const html = r?.outerHTML !== undefined ? r.outerHTML : String(r)
      expect(html).toContain(MEDIA_CLASSES.RENDER_MEDIA_LOADED)
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
      el.setAttribute(MEDIA_ATTRS.CAN_EXPAND, STATE_STRINGS.TRUE)
      el.setAttribute(MEDIA_ATTRS.SRC, 'project/image')
      el.setAttribute(FORM_ATTRS.LABEL, 'Test Image')
      el.setAttribute(MEDIA_ATTRS.WIDTH, '800')
      el.setAttribute(MEDIA_ATTRS.HEIGHT, '450')
      el.thumbSrc = 'https://storage.example.com/project/image-mozjpg3-MSSIM-tuned-kodak.jpg'
      el.openModal()
      const modal = store.getters.getModal()
      expect(modal.open).toBe(true)
      expect(modal.class).toBe(MODAL_CLASSES.MODAL_OPEN)
      expect(modal.media.alt).toBe('Test Image')
    })

    test('openModal() sets media.width and media.height from attributes', () => {
      el.setAttribute(MEDIA_ATTRS.CAN_EXPAND, STATE_STRINGS.TRUE)
      el.setAttribute(MEDIA_ATTRS.WIDTH, '1200')
      el.setAttribute(MEDIA_ATTRS.HEIGHT, '675')
      el.openModal()
      const modal = store.getters.getModal()
      expect(modal.media.width).toBe(1200)
      expect(modal.media.height).toBe(675)
    })

    test('openModal() for image uses uncompressed URL as source', () => {
      el.setAttribute(MEDIA_ATTRS.CAN_EXPAND, STATE_STRINGS.TRUE)
      el.setAttribute(MEDIA_ATTRS.SRC, 'project/image')
      el.openModal()
      const modal = store.getters.getModal()
      expect(modal.media.source).toContain(MEDIA.MOZ + MEDIA.Q100 + MEDIA.EXT)
    })

    test('openModal() for image uses thumb URL as thumb', () => {
      el.setAttribute(MEDIA_ATTRS.CAN_EXPAND, STATE_STRINGS.TRUE)
      el.setAttribute(MEDIA_ATTRS.SRC, 'project/image')
      el.openModal()
      const modal = store.getters.getModal()
      expect(modal.media.thumb).toContain(MEDIA.MOZ + MEDIA.THUMB_SUFFIX + MEDIA.EXT)
    })
  })

  describe('9. Observer Cleanup on Destroy', () => {
    test('onDestroy() disconnects and nulls observer', () => {
      let disconnected = false
      el.observer = {
        disconnect: () => {
          disconnected = true
        },
      }
      el.onDestroy()
      expect(el.observer).toBeNull()
      expect(disconnected).toBe(true)
    })

    test('onDestroy() disconnects and nulls imgObserver', () => {
      let disconnected = false
      el.imgObserver = {
        disconnect: () => {
          disconnected = true
        },
      }
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
