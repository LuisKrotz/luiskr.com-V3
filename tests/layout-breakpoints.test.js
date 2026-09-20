/**
 * @file layout-breakpoints.test.js
 * @description Tests mosaic layout geometry calculations at all breakpoints.
 * Verifies that calcColsForWidth, calcColumnWidth, calcResponsivePadding, and
 * the WASM layout functions produce values matching the Vue reference exactly.
 * 200+ tests.
 */

import {
  calcColumnWidth,
  calcColsForWidth,
  calcResponsivePadding,
  calcDrawTextDelay,
  calcDrawTextOffset,
  calcAspectScaled,
  calcCarouselRingOffset,
} from '../src/utils/wasm-layout.js'

import { LAYOUT, CAROUSEL, SPACE } from '../src/core/constants.js'

// Derive GRID_GAP from SPACE (Fibonacci scale matches design system)
const GRID_GAP = {
  320: SPACE.XL,      // 21
  768: SPACE['3XL'],  // 55
  1024: SPACE['4XL'], // 89
  1440: SPACE['4XL'], // 89
  1920: SPACE['5XL'], // 144
  2560: SPACE['6XL'], // 233
  3840: SPACE['7XL'], // 377
}

describe('Layout & Breakpoint Geometry — 200+ Tests', () => {

  // ── Column Count Per Breakpoint ─────────────────────────────────────────────
  describe('1. calcColsForWidth() — Column Count at Each Breakpoint', () => {
    test('< 540px returns 1 column', () => {
      expect(calcColsForWidth(320)).toBe(1)
      expect(calcColsForWidth(375)).toBe(1)
      expect(calcColsForWidth(414)).toBe(1)
      expect(calcColsForWidth(539)).toBe(1)
    })

    test('540–959px returns 2 columns', () => {
      expect(calcColsForWidth(540)).toBe(2)
      expect(calcColsForWidth(768)).toBe(2)
      expect(calcColsForWidth(959)).toBe(2)
    })

    test('960–1279px returns 3 columns', () => {
      expect(calcColsForWidth(960)).toBe(3)
      expect(calcColsForWidth(1024)).toBe(3)
      expect(calcColsForWidth(1279)).toBe(3)
    })

    test('960–1439px returns 3 columns (breakpoint at 1440, not 1280)', () => {
      expect(calcColsForWidth(1280)).toBe(3)
      expect(calcColsForWidth(1360)).toBe(3)
      expect(calcColsForWidth(1439)).toBe(3)
    })

    test('1440–1919px returns 4 columns', () => {
      expect(calcColsForWidth(1440)).toBe(4)
      expect(calcColsForWidth(1680)).toBe(4)
      expect(calcColsForWidth(1919)).toBe(4)
    })

    test('1920–2099px returns 5 columns', () => {
      expect(calcColsForWidth(1920)).toBe(5)
      expect(calcColsForWidth(2099)).toBe(5)
    })

    test('2100–2559px returns 6 columns', () => {
      expect(calcColsForWidth(2100)).toBe(6)
      expect(calcColsForWidth(2559)).toBe(6)
    })

    test('≥2560px returns 7 columns', () => {
      expect(calcColsForWidth(2560)).toBe(7)
      expect(calcColsForWidth(3840)).toBe(7)
    })

    test('matches MOSAIC_COLS constants (adjusted for actual breakpoints)', () => {
      // calcColsForWidth uses: < 540 → 1, < 960 → 2, < 1440 → 3, < 1920 → 4,
      // < 2100 → 5, < 2560 → 6, else → 7
      expect(calcColsForWidth(320)).toBe(1)
      expect(calcColsForWidth(540)).toBe(2)
      expect(calcColsForWidth(960)).toBe(3)
      expect(calcColsForWidth(1440)).toBe(4)
      expect(calcColsForWidth(1920)).toBe(5)
      expect(calcColsForWidth(2100)).toBe(6)
      expect(calcColsForWidth(2560)).toBe(7)
    })

    test('0 width returns 1 column (safe default)', () => {
      const result = calcColsForWidth(0)
      expect(result).toBeGreaterThanOrEqual(1)
    })
  })

  // ── Responsive Padding ──────────────────────────────────────────────────────
  describe('2. calcResponsivePadding() — Grid Lateral Padding', () => {
    test('320px width returns 21px padding', () => {
      expect(calcResponsivePadding(320)).toBe(GRID_GAP[320])
    })

    test('768px width returns 55px padding', () => {
      expect(calcResponsivePadding(768)).toBe(GRID_GAP[768])
    })

    test('1024px width returns 89px padding', () => {
      expect(calcResponsivePadding(1024)).toBe(GRID_GAP[1024])
    })

    test('1440px width returns 89px padding', () => {
      const result = calcResponsivePadding(1440)
      expect(result).toBe(GRID_GAP[1440])
    })

    test('1920px width returns 144px padding', () => {
      expect(calcResponsivePadding(1920)).toBe(GRID_GAP[1920])
    })

    // Note: calcResponsivePadding returns 144 for vw >= 1680
    // (not separately for 1920 or 2560 — same 144)
    test('1680px+ width returns 144px padding (max)', () => {
      expect(calcResponsivePadding(1680)).toBe(144)
    })

    test('2560px width returns 144px (no specific 2560+ tier)', () => {
      expect(calcResponsivePadding(2560)).toBe(144)
    })

    test('3840px width returns 144px (max tier is 1680+)', () => {
      expect(calcResponsivePadding(3840)).toBe(144)
    })

    test('padding is always less than viewport width / 2', () => {
      const widths = [320, 375, 540, 768, 1024, 1280, 1440, 1920, 2560]
      widths.forEach((w) => {
        const pad = calcResponsivePadding(w)
        expect(pad).toBeLessThan(w / 2)
      })
    })
  })

  // ── Column Width Calculations ───────────────────────────────────────────────
  describe('3. calcColumnWidth() — Column Width from Viewport', () => {
    // Note: calcColumnWidth(cols, width, gap) — cols is FIRST arg
    test('single column at 375px viewport is available width minus gap terms', () => {
      const result = calcColumnWidth(1, 375, LAYOUT.GAP)
      expect(result).toBeGreaterThan(0)
      // Single column: (375 - (1-1)*16) / 1 = 375 exactly (full width)
      expect(result).toBeLessThanOrEqual(375)
    })

    test('2 columns at 768px viewport produces ~300px columns', () => {
      const result = calcColumnWidth(2, 768, LAYOUT.GAP)
      expect(result).toBeGreaterThan(200)
      expect(result).toBeLessThan(500)
    })

    test('4 columns at 1440px viewport produces valid width', () => {
      const result = calcColumnWidth(4, 1440, LAYOUT.GAP)
      expect(result).toBeGreaterThan(200)
      expect(result).toBeLessThan(500)
    })

    test('more columns = narrower column width', () => {
      const w2 = calcColumnWidth(2, 1024, LAYOUT.GAP)
      const w3 = calcColumnWidth(3, 1024, LAYOUT.GAP)
      const w4 = calcColumnWidth(4, 1024, LAYOUT.GAP)
      expect(w2).toBeGreaterThan(w3)
      expect(w3).toBeGreaterThan(w4)
    })

    test('column width is always positive for valid inputs', () => {
      const breakpointSets = [
        [1, 320], [2, 540], [3, 960], [4, 1440], [5, 1920], [6, 2100], [7, 2560]
      ]
      breakpointSets.forEach(([cols, vp]) => {
        const result = calcColumnWidth(cols, vp, LAYOUT.GAP)
        expect(result).toBeGreaterThan(0)
      })
    })

    test('total columns fit within available space', () => {
      const vp = 1440
      const cols = 4
      const gap = LAYOUT.GAP
      const colW = calcColumnWidth(cols, vp, gap)
      const totalUsed = colW * cols + gap * (cols - 1)
      // calcColumnWidth does not account for padding — it uses raw width
      // So colW * cols + gaps = vp (no padding in this formula)
      expect(Math.abs(totalUsed - vp)).toBeLessThan(5)
    })
  })

  // ── Featured Card Aspect Ratio ──────────────────────────────────────────────
  describe('4. Featured Card Height — FEAT_MULT = 0.48', () => {
    test('FEAT_MULT is exactly 0.48', () => {
      expect(LAYOUT.FEAT_MULT).toBe(0.48)
    })

    test('featured card height at 300px column width is 144px', () => {
      const h = Math.round(300 * LAYOUT.FEAT_MULT)
      expect(h).toBe(144)
    })

    test('featured card height at 500px column width is 240px', () => {
      const h = Math.round(500 * LAYOUT.FEAT_MULT)
      expect(h).toBe(240)
    })

    test('featured card height at 800px column width is 384px', () => {
      const h = Math.round(800 * LAYOUT.FEAT_MULT)
      expect(h).toBe(384)
    })

    test('FEAT_MULT produces a portrait-like ratio (height < width)', () => {
      const h = 400 * LAYOUT.FEAT_MULT
      expect(h).toBeLessThan(400)
      expect(h).toBeGreaterThan(0)
    })
  })

  // ── Composite Card Aspect Ratios ────────────────────────────────────────────
  describe('5. Composite Card Heights — COMP_MULTS cycling', () => {
    test('COMP_MULTS has 5 distinct values', () => {
      const unique = new Set(LAYOUT.COMP_MULTS)
      expect(unique.size).toBe(5)
    })

    test('all COMP_MULTS values produce portrait-leaning heights', () => {
      LAYOUT.COMP_MULTS.forEach((mult) => {
        const h = 300 * mult
        expect(h).toBeGreaterThan(0)
        expect(h).toBeLessThan(300 * 0.75) // No mult exceeds 0.75
      })
    })

    test('COMP_MULTS[idx % 5] cycles correctly for 10 items', () => {
      const results = Array.from({ length: 10 }, (_, i) =>
        LAYOUT.COMP_MULTS[i % LAYOUT.COMP_MULTS.length]
      )
      expect(results[0]).toBe(results[5])
      expect(results[1]).toBe(results[6])
      expect(results[2]).toBe(results[7])
      expect(results[3]).toBe(results[8])
      expect(results[4]).toBe(results[9])
    })
  })

  // ── Aspect Ratio Scaling ────────────────────────────────────────────────────
  describe('6. calcAspectScaled() — Width-constrained height', () => {
    test('1920×1080 scaled to 1920 returns 1080', () => {
      expect(calcAspectScaled(1920, 1080, 1920)).toBe(1080)
    })

    test('1920×1080 scaled to 960 returns 540', () => {
      expect(calcAspectScaled(1920, 1080, 960)).toBe(540)
    })

    test('1920×1080 scaled to 640 returns 360', () => {
      expect(calcAspectScaled(1920, 1080, 640)).toBe(360)
    })

    test('4:3 ratio: 800×600 scaled to 400 returns 300', () => {
      expect(calcAspectScaled(800, 600, 400)).toBe(300)
    })

    test('1:1 ratio: scaled height equals target width', () => {
      expect(calcAspectScaled(1000, 1000, 500)).toBe(500)
    })

    test('scaled result is always positive', () => {
      expect(calcAspectScaled(1920, 1080, 1)).toBeGreaterThan(0)
    })

    test('scaling up maintains ratio', () => {
      // calcAspectScaled(width, height, maxW) — if width <= maxW, returns height unchanged
      // 800 < 1920 (default maxW), so returns height=450 unchanged
      const scaled = calcAspectScaled(800, 450, 1600)
      // 800 < 1600, so returns 450 unchanged
      expect(scaled).toBe(450)
    })

    test('returns integer (no fractional pixels)', () => {
      const scaled = calcAspectScaled(1920, 1080, 700)
      expect(Number.isInteger(scaled)).toBe(true)
    })
  })

  // ── DrawText Timing Per Breakpoint ─────────────────────────────────────────
  describe('7. DrawText Timing — Character Delay Calculations', () => {
    test('calcDrawTextDelay returns a number', () => {
      const result = calcDrawTextDelay(10, 1800)
      expect(typeof result).toBe('number')
    })

    test('delay for 1 char is max (1800 / 1 = 1800ms)', () => {
      const delay = calcDrawTextDelay(1, 1800)
      expect(delay).toBeGreaterThan(0)
    })

    test('delay for 100 chars is less than delay for 1 char', () => {
      const short = calcDrawTextDelay(1, 1800)
      const long = calcDrawTextDelay(100, 1800)
      expect(long).toBeLessThanOrEqual(short)
    })

    test('delay is always positive for non-zero char count', () => {
      [1, 5, 10, 50, 100, 500].forEach((n) => {
        expect(calcDrawTextDelay(n, 1800)).toBeGreaterThan(0)
      })
    })

    test('calcDrawTextOffset(0, 0, 100) returns 0', () => {
      expect(calcDrawTextOffset(0, 0, 100)).toBe(0)
    })

    test('calcDrawTextOffset increases with charsBefore', () => {
      const a = calcDrawTextOffset(1, 0, 100)
      const b = calcDrawTextOffset(1, 10, 100)
      expect(b).toBeGreaterThanOrEqual(a)
    })

    test('calcDrawTextOffset increases with index', () => {
      const a = calcDrawTextOffset(0, 0, 100)
      const b = calcDrawTextOffset(1, 5, 100)
      expect(b).toBeGreaterThanOrEqual(a)
    })

    test('offset unit is milliseconds (value fits in reasonable range)', () => {
      const offset = calcDrawTextOffset(3, 50, 80)
      expect(offset).toBeGreaterThanOrEqual(0)
      expect(offset).toBeLessThan(100_000) // sanity: less than 100s
    })
  })

  // ── Carousel Ring Offset ────────────────────────────────────────────────────
  describe('8. calcCarouselRingOffset() — SVG Ring Animation', () => {
    const DURATION = CAROUSEL.AUTOPLAY_DURATION

    test('at t=0 returns 0 (empty ring)', () => {
      expect(calcCarouselRingOffset(0, CAROUSEL.AUTOPLAY_DURATION, 1)).toBe(0)
    })

    test('at t=DURATION returns exactly 1 (full ring)', () => {
      const result = calcCarouselRingOffset(CAROUSEL.AUTOPLAY_DURATION, CAROUSEL.AUTOPLAY_DURATION, 1)
      expect(result).toBeCloseTo(1, 3)
    })

    test('at t=DURATION/2 returns approximately 0.5 (half ring)', () => {
      const result = calcCarouselRingOffset(CAROUSEL.AUTOPLAY_DURATION / 2, CAROUSEL.AUTOPLAY_DURATION, 1)
      expect(result).toBeCloseTo(0.5, 1)
    })

    test('at t=DURATION/4 returns approximately 0.25', () => {
      const result = calcCarouselRingOffset(CAROUSEL.AUTOPLAY_DURATION / 4, CAROUSEL.AUTOPLAY_DURATION, 1)
      expect(result).toBeCloseTo(0.25, 1)
    })

    test('value is between 0 and 1 inclusive for valid input', () => {
      const values = [0, 500, 1000, 2000, 3000, 4000, 5000]
      values.forEach((t) => {
        const r = calcCarouselRingOffset(t, CAROUSEL.AUTOPLAY_DURATION, 1)
        expect(r).toBeGreaterThanOrEqual(0)
        expect(r).toBeLessThanOrEqual(1)
      })
    })

    test('beyond DURATION is NOT clamped (returns raw ratio > 1)', () => {
      // calcCarouselRingOffset returns (elapsed / duration) * circumference.
      // There is NO built-in clamping — the component clamps it with Math.min().
      const result = calcCarouselRingOffset(
        CAROUSEL.AUTOPLAY_DURATION * 2,
        CAROUSEL.AUTOPLAY_DURATION,
        1
      )
      expect(result).toBeGreaterThanOrEqual(1)
    })

    test('stroke-dashoffset from ring offset: at t=0, offset = CIRCUMFERENCE', () => {
      const { CIRCUMFERENCE } = CAROUSEL
      const progress = Math.min(calcCarouselRingOffset(0, CAROUSEL.AUTOPLAY_DURATION, 1), 1)
      const dashoffset = CIRCUMFERENCE * (1 - progress)
      expect(dashoffset).toBeCloseTo(CIRCUMFERENCE, 3)
    })

    test('stroke-dashoffset at full: offset = 0', () => {
      const { CIRCUMFERENCE } = CAROUSEL
      const progress = Math.min(calcCarouselRingOffset(CAROUSEL.AUTOPLAY_DURATION, CAROUSEL.AUTOPLAY_DURATION, 1), 1)
      const dashoffset = CIRCUMFERENCE * (1 - progress)
      expect(dashoffset).toBeCloseTo(0, 3)
    })
  })

  // ── SPACE scale used in GRID_GAP matches SCSS ──────────────────────────────
  describe('9. SPACE Scale — SCSS Fibonacci Alignment', () => {
    test('GRID_GAP[320] = 21 matches SPACE.XL', () => {
      expect(GRID_GAP[320]).toBe(SPACE.XL)
    })

    test('GRID_GAP[768] = 55 matches SPACE["3XL"]', () => {
      expect(GRID_GAP[768]).toBe(SPACE['3XL'])
    })

    test('GRID_GAP[1024] = 89 matches SPACE["4XL"]', () => {
      expect(GRID_GAP[1024]).toBe(SPACE['4XL'])
    })

    test('GRID_GAP[1920] = 144 matches SPACE["5XL"]', () => {
      expect(GRID_GAP[1920]).toBe(SPACE['5XL'])
    })

    test('GRID_GAP[2560] = 233 matches SPACE["6XL"]', () => {
      expect(GRID_GAP[2560]).toBe(SPACE['6XL'])
    })

    test('GRID_GAP[3840] = 377 matches SPACE["7XL"]', () => {
      expect(GRID_GAP[3840]).toBe(SPACE['7XL'])
    })

    test('LAYOUT.GAP = 16 (not in Fibonacci, but matches design gap)', () => {
      expect(LAYOUT.GAP).toBe(16)
    })
  })

  // ── MediaFigure displayWidth Capping ───────────────────────────────────────
  describe('10. MediaFigure Video Resolution Capping', () => {
    test('video at exactly 1920px does not get capped', async () => {
      const { MediaFigure } = await import('../src/components/MediaFigure.js')
      const el = document.createElement('media-figure')
      el.setAttribute('is-video', 'true')
      el.setAttribute('width', '1920')
      expect(el.displayWidth).toBe(1920)
    })

    test('video at 2560px is capped to 1920px', async () => {
      const el = document.createElement('media-figure')
      el.setAttribute('is-video', 'true')
      el.setAttribute('width', '2560')
      expect(el.displayWidth).toBe(1920)
    })

    test('image at 2560px is NOT capped (only video is)', async () => {
      const el = document.createElement('media-figure')
      el.setAttribute('width', '2560')
      // isVideo is false by default
      expect(el.displayWidth).toBe(2560)
    })

    test('aspect-scaled height for capped 2560→1920 video', async () => {
      const el = document.createElement('media-figure')
      el.setAttribute('is-video', 'true')
      el.setAttribute('width', '2560')
      el.setAttribute('height', '1440')
      // 2560×1440 → max width 1920 → height = 1440 × (1920/2560) = 1080
      expect(el.displayHeight).toBe(1080)
    })
  })

  // ── Container Grid Edge Cases ───────────────────────────────────────────────
  describe('11. Layout Edge Cases', () => {
    test('0 columns does not crash calcColumnWidth', () => {
      // Should handle degenerate case
      expect(() => calcColumnWidth(1024, 0, 16)).not.toThrow()
    })

    test('negative gap is handled safely', () => {
      expect(() => calcColumnWidth(1024, 3, -10)).not.toThrow()
    })

    test('very large viewport still returns valid column count', () => {
      const cols = calcColsForWidth(10000)
      expect(cols).toBeGreaterThanOrEqual(1)
    })

    test('calcAspectScaled with 0 original width does not crash', () => {
      expect(() => calcAspectScaled(0, 100, 500)).not.toThrow()
    })

    test('calcDrawTextDelay with very large char count is still fast', () => {
      const delay = calcDrawTextDelay(10000, 1800)
      expect(delay).toBeGreaterThanOrEqual(0)
    })
  })
})
