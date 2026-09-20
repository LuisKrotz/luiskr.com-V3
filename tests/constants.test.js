/**
 * @file constants.test.js
 * @description Verifies all values in core/constants.js match the original Vue source.
 * Every constant is tested individually to prevent silent drift between the vanilla
 * implementation and the Vue reference values.
 */

import {
  MEDIA,
  LAYOUT,
  CAROUSEL,
  ANIMATION,
  BASE_TITLE,
  PROJECT_ALIASES,
  SPACE,
  BREAKPOINTS,
  GRID_GAP,
  MOSAIC_COLS,
} from '../src/core/constants.js'

describe('Core Constants — Token coverage', () => {
  // ── MEDIA constants ──────────────────────────────────────────────────────
  describe('MEDIA constants (mozjpeg pipeline suffixes)', () => {
    test('MEDIA.MOZ matches Vue Media.vue mozjpeg prefix', () => {
      expect(MEDIA.MOZ).toBe('-mozjpg')
    })

    test('MEDIA.THUMB_SUFFIX produces correct Kodak MSSIM thumb filename', () => {
      expect(MEDIA.THUMB_SUFFIX).toBe('3-MSSIM-tuned-kodak')
    })

    test('MEDIA.Q50 matches Vue 50-quality suffix', () => {
      expect(MEDIA.Q50).toBe('-50')
    })

    test('MEDIA.Q100 matches Vue uncompressed suffix', () => {
      expect(MEDIA.Q100).toBe('-uncompressed')
    })

    test('MEDIA.EXT is .jpg', () => {
      expect(MEDIA.EXT).toBe('.jpg')
    })

    test('MEDIA.VIDEO_EXT is .mp4', () => {
      expect(MEDIA.VIDEO_EXT).toBe('.mp4')
    })

    test('MEDIA.VIDEO_THUMB_EXT matches Vue video poster suffix', () => {
      expect(MEDIA.VIDEO_THUMB_EXT).toBe('.mp4.jpg-thumb.jpg')
    })

    test('MEDIA.VIDEO_SCALE matches Vue 2x scale-down suffix', () => {
      expect(MEDIA.VIDEO_SCALE).toBe('.mp4-scaledown-2x')
    })

    test('MEDIA is frozen (immutable)', () => {
      expect(Object.isFrozen(MEDIA)).toBe(true)
    })

    test('thumb URL assembly matches Vue pattern: base + MOZ + THUMB_SUFFIX + EXT', () => {
      const base = 'https://storage.example.com/project/image'
      const url = base + MEDIA.MOZ + MEDIA.THUMB_SUFFIX + MEDIA.EXT
      expect(url).toBe('https://storage.example.com/project/image-mozjpg3-MSSIM-tuned-kodak.jpg')
    })

    test('q50 URL assembly matches Vue pattern: base + MOZ + Q50 + EXT', () => {
      const base = 'https://storage.example.com/project/image'
      const url = base + MEDIA.MOZ + MEDIA.Q50 + MEDIA.EXT
      expect(url).toBe('https://storage.example.com/project/image-mozjpg-50.jpg')
    })

    test('uncompressed URL assembly matches Vue pattern: base + MOZ + Q100 + EXT', () => {
      const base = 'https://storage.example.com/project/image'
      const url = base + MEDIA.MOZ + MEDIA.Q100 + MEDIA.EXT
      expect(url).toBe('https://storage.example.com/project/image-mozjpg-uncompressed.jpg')
    })

    test('video URL: base + VIDEO_EXT', () => {
      const base = 'https://storage.example.com/project/video'
      expect(base + MEDIA.VIDEO_EXT).toBe('https://storage.example.com/project/video.mp4')
    })

    test('video poster URL: base + VIDEO_THUMB_EXT', () => {
      const base = 'https://storage.example.com/project/video'
      expect(base + MEDIA.VIDEO_THUMB_EXT).toBe(
        'https://storage.example.com/project/video.mp4.jpg-thumb.jpg'
      )
    })

    test('scale-down video URL: base + VIDEO_SCALE + VIDEO_EXT', () => {
      const base = 'https://storage.example.com/project/video'
      expect(base + MEDIA.VIDEO_SCALE + MEDIA.VIDEO_EXT).toBe(
        'https://storage.example.com/project/video.mp4-scaledown-2x.mp4'
      )
    })
  })

  // ── LAYOUT constants ─────────────────────────────────────────────────────
  describe('LAYOUT constants (masonry geometry)', () => {
    test('FEAT_MULT is 0.48 (matches Vue Home.vue)', () => {
      expect(LAYOUT.FEAT_MULT).toBe(0.48)
    })

    test('COMP_MULTS has 5 elements', () => {
      expect(LAYOUT.COMP_MULTS).toHaveLength(5)
    })

    test('COMP_MULTS[0] is 0.56', () => {
      expect(LAYOUT.COMP_MULTS[0]).toBe(0.56)
    })

    test('COMP_MULTS[1] is 0.58', () => {
      expect(LAYOUT.COMP_MULTS[1]).toBe(0.58)
    })

    test('COMP_MULTS[2] is 0.54', () => {
      expect(LAYOUT.COMP_MULTS[2]).toBe(0.54)
    })

    test('COMP_MULTS[3] is 0.57', () => {
      expect(LAYOUT.COMP_MULTS[3]).toBe(0.57)
    })

    test('COMP_MULTS[4] is 0.55', () => {
      expect(LAYOUT.COMP_MULTS[4]).toBe(0.55)
    })

    test('GAP is 16px (matches Vue mosaic gap)', () => {
      expect(LAYOUT.GAP).toBe(16)
    })

    test('COMP_MULTS array is frozen', () => {
      expect(Object.isFrozen(LAYOUT.COMP_MULTS)).toBe(true)
    })

    test('LAYOUT object is frozen', () => {
      expect(Object.isFrozen(LAYOUT)).toBe(true)
    })

    test('FEAT_MULT produces correct height for 800px wide featured card', () => {
      const cardH = Math.round(800 * LAYOUT.FEAT_MULT)
      expect(cardH).toBe(384)
    })

    test('COMP_MULTS cycle correctly for 7 items', () => {
      const heights = [800, 800, 800, 800, 800, 800, 800].map((w, i) =>
        Math.round(w * LAYOUT.COMP_MULTS[i % LAYOUT.COMP_MULTS.length])
      )
      expect(heights[0]).toBe(448) // 0.56
      expect(heights[1]).toBe(464) // 0.58
      expect(heights[2]).toBe(432) // 0.54
      expect(heights[3]).toBe(456) // 0.57
      expect(heights[4]).toBe(440) // 0.55
      expect(heights[5]).toBe(448) // wraps to 0.56
      expect(heights[6]).toBe(464) // wraps to 0.58
    })
  })

  // ── CAROUSEL constants ───────────────────────────────────────────────────
  describe('CAROUSEL constants', () => {
    test('AUTOPLAY_DURATION is 5000ms (5 seconds)', () => {
      expect(CAROUSEL.AUTOPLAY_DURATION).toBe(5000)
    })

    test('CIRCUMFERENCE equals 2π×19', () => {
      expect(CAROUSEL.CIRCUMFERENCE).toBeCloseTo(2 * Math.PI * 19, 5)
    })

    test('CIRCUMFERENCE is approximately 119.38', () => {
      expect(CAROUSEL.CIRCUMFERENCE).toBeCloseTo(119.38, 1)
    })

    test('MOBILE_BREAKPOINT is 768px', () => {
      expect(CAROUSEL.MOBILE_BREAKPOINT).toBe(768)
    })

    test('SWIPE_THRESHOLD is 40px', () => {
      expect(CAROUSEL.SWIPE_THRESHOLD).toBe(40)
    })

    test('TELEPORT_DELAY is 420ms', () => {
      expect(CAROUSEL.TELEPORT_DELAY).toBe(420)
    })

    test('CAROUSEL object is frozen', () => {
      expect(Object.isFrozen(CAROUSEL)).toBe(true)
    })
  })

  // ── ANIMATION constants ──────────────────────────────────────────────────
  describe('ANIMATION constants', () => {
    test('EASING matches design system cubic-bezier', () => {
      expect(ANIMATION.EASING).toBe('cubic-bezier(0.22, 1, 0.36, 1)')
    })

    test('PAGE_EASING matches page transition easing', () => {
      expect(ANIMATION.PAGE_EASING).toBe('cubic-bezier(0.16, 1, 0.3, 1)')
    })

    test('ROUTE_DURATION is 450ms', () => {
      expect(ANIMATION.ROUTE_DURATION).toBe(450)
    })

    test('MOSAIC_DURATION is 420ms', () => {
      expect(ANIMATION.MOSAIC_DURATION).toBe(420)
    })

    test('CAROUSEL_FADE_DURATION is 800ms', () => {
      expect(ANIMATION.CAROUSEL_FADE_DURATION).toBe(800)
    })

    test('ANIMATION object is frozen', () => {
      expect(Object.isFrozen(ANIMATION)).toBe(true)
    })
  })

  // ── Application constants ────────────────────────────────────────────────
  describe('Application-level constants', () => {
    test('BASE_TITLE is "Luis Krötz"', () => {
      expect(BASE_TITLE).toBe('Luis Krötz')
    })

    test('BASE_TITLE contains the correct ö character (U+00F6)', () => {
      expect(BASE_TITLE.charCodeAt(7)).toBe(0x00f6) // ö
    })

    test('PROJECT_ALIASES.brazilian-leather maps to cicb', () => {
      expect(PROJECT_ALIASES['brazilian-leather']).toBe('cicb')
    })

    test('PROJECT_ALIASES.clinica-de-desenvolvimento-nathalia-bond maps to nathalia-bond', () => {
      expect(PROJECT_ALIASES['clinica-de-desenvolvimento-nathalia-bond']).toBe('nathalia-bond')
    })

    test('PROJECT_ALIASES.genesysinf-sageweb maps to sage', () => {
      expect(PROJECT_ALIASES['genesysinf-sageweb']).toBe('sage')
    })

    test('PROJECT_ALIASES.minimelissa maps to mini-melissa', () => {
      expect(PROJECT_ALIASES['minimelissa']).toBe('mini-melissa')
    })

    test('PROJECT_ALIASES has exactly 4 entries', () => {
      expect(Object.keys(PROJECT_ALIASES)).toHaveLength(4)
    })

    test('PROJECT_ALIASES is frozen', () => {
      expect(Object.isFrozen(PROJECT_ALIASES)).toBe(true)
    })

    test('normalizeProjectKey logic: unknown slug passes through', () => {
      const slug = 'metcha'
      expect(PROJECT_ALIASES[slug] || slug).toBe('metcha')
    })

    test('normalizeProjectKey logic: known alias resolves', () => {
      const slug = 'brazilian-leather'
      expect(PROJECT_ALIASES[slug] || slug).toBe('cicb')
    })
  })

  // ── SPACE constants ──────────────────────────────────────────────────────
  describe('SPACE constants (Fibonacci spacing scale)', () => {
    test('SPACE.NONE is 0', () => { expect(SPACE.NONE).toBe(0) })
    test('SPACE.HAIRLINE is 1', () => { expect(SPACE.HAIRLINE).toBe(1) })
    test('SPACE.PIXEL is 1', () => { expect(SPACE.PIXEL).toBe(1) })
    test('SPACE["2XS"] is 2', () => { expect(SPACE['2XS']).toBe(2) })
    test('SPACE.XS is 3', () => { expect(SPACE.XS).toBe(3) })
    test('SPACE.SM is 5', () => { expect(SPACE.SM).toBe(5) })
    test('SPACE.MD is 8', () => { expect(SPACE.MD).toBe(8) })
    test('SPACE.LG is 13', () => { expect(SPACE.LG).toBe(13) })
    test('SPACE.XL is 21', () => { expect(SPACE.XL).toBe(21) })
    test('SPACE["2XL"] is 34', () => { expect(SPACE['2XL']).toBe(34) })
    test('SPACE["3XL"] is 55', () => { expect(SPACE['3XL']).toBe(55) })
    test('SPACE["4XL"] is 89', () => { expect(SPACE['4XL']).toBe(89) })
    test('SPACE["5XL"] is 144', () => { expect(SPACE['5XL']).toBe(144) })
    test('SPACE["6XL"] is 233', () => { expect(SPACE['6XL']).toBe(233) })
    test('SPACE["7XL"] is 377', () => { expect(SPACE['7XL']).toBe(377) })
    test('SPACE["8XL"] is 610', () => { expect(SPACE['8XL']).toBe(610) })
    test('SPACE["9XL"] is 987', () => { expect(SPACE['9XL']).toBe(987) })

    test('each value is the sum of the two preceding (Fibonacci)', () => {
      // HAIRLINE and PIXEL are both 1 (intentional aliases for "1 unit").
      // The actual Fibonacci sequence starting from 0: 0, 1, 1, 2, 3, 5, 8, 13, ...
      // We validate the unique progression values (skipping PIXEL which aliases HAIRLINE).
      const values = [
        SPACE.NONE,    // 0
        SPACE.HAIRLINE, // 1
        SPACE['2XS'],  // 2  (note: 0+1+1 = 2 in the padded Fib series)
        SPACE.XS,      // 3
        SPACE.SM,      // 5
        SPACE.MD,      // 8
        SPACE.LG,      // 13
        SPACE.XL,      // 21
        SPACE['2XL'],  // 34
        SPACE['3XL'],  // 55
        SPACE['4XL'],  // 89
        SPACE['5XL'],  // 144
        SPACE['6XL'],  // 233
        SPACE['7XL'],  // 377
        SPACE['8XL'],  // 610
        SPACE['9XL'],  // 987
      ]
      // Standard Fibonacci from 0: values[n] = values[n-1] + values[n-2]
      // Insert a phantom 1 before 2XS to align: [0, 1, 1, 2, 3, 5, 8, ...]
      const fib = [0, 1, 1, ...values.slice(2)]
      for (let i = 2; i < fib.length; i++) {
        expect(fib[i]).toBe(fib[i - 1] + fib[i - 2])
      }
    })
  })

  // ── BREAKPOINTS ──────────────────────────────────────────────────────────
  describe('BREAKPOINTS constants', () => {
    test('contains all standard design-system breakpoints', () => {
      const expected = [272, 320, 375, 414, 540, 768, 960, 1024, 1280, 1360, 1440, 1560, 1680, 1920, 2100, 2560, 3840]
      expected.forEach((bp) => {
        expect(BREAKPOINTS[bp]).toBe(bp)
      })
    })

    test('BREAKPOINTS is frozen', () => {
      expect(Object.isFrozen(BREAKPOINTS)).toBe(true)
    })
  })

  // ── GRID_GAP ─────────────────────────────────────────────────────────────
  describe('GRID_GAP constants (lateral padding per breakpoint)', () => {
    test('mobile 320px has 21px padding (matches $gap-320 SASS variable)', () => {
      expect(GRID_GAP[320]).toBe(21)
    })

    test('tablet 768px has 55px padding (matches $gap-768)', () => {
      expect(GRID_GAP[768]).toBe(55)
    })

    test('desktop 1024px has 89px padding (matches $gap-1024)', () => {
      expect(GRID_GAP[1024]).toBe(89)
    })

    test('large 1920px has 144px padding (matches $gap-1920)', () => {
      expect(GRID_GAP[1920]).toBe(144)
    })

    test('4K 3840px has 377px padding (matches $gap-3840)', () => {
      expect(GRID_GAP[3840]).toBe(377)
    })

    test('GRID_GAP is frozen', () => {
      expect(Object.isFrozen(GRID_GAP)).toBe(true)
    })
  })

  // ── MOSAIC_COLS ──────────────────────────────────────────────────────────
  describe('MOSAIC_COLS (column counts per breakpoint)', () => {
    test('below 540px: 1 column', () => {
      expect(MOSAIC_COLS[0]).toBe(1)
    })

    test('540–959px: 2 columns', () => {
      expect(MOSAIC_COLS[540]).toBe(2)
    })

    test('960–1279px: 3 columns', () => {
      expect(MOSAIC_COLS[960]).toBe(3)
    })

    test('1280–1679px: 4 columns', () => {
      expect(MOSAIC_COLS[1280]).toBe(4)
    })

    test('1680–1919px: 5 columns', () => {
      expect(MOSAIC_COLS[1680]).toBe(5)
    })

    test('1920–2559px: 6 columns', () => {
      expect(MOSAIC_COLS[1920]).toBe(6)
    })

    test('≥2560px: 7 columns', () => {
      expect(MOSAIC_COLS[2560]).toBe(7)
    })

    test('MOSAIC_COLS is frozen', () => {
      expect(Object.isFrozen(MOSAIC_COLS)).toBe(true)
    })
  })
})
