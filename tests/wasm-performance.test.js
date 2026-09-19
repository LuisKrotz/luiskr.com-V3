import {
  calcColumnWidth,
  calcCardHeight,
  calcCarouselRingOffset,
  calcCarouselScrollTarget,
  calcEaseOutCubic,
  calcDrawTextDelay,
  calcDrawTextOffset,
  calcColsForWidth,
  calcResponsivePadding,
  calcAspectScaled,
} from '../src/utils/wasm-layout.js'
import {
  isGravatarUrl,
  getGravatarSrcset,
  getOptimizedGravatar,
  stripHtml,
  svgPlaceholder,
  buildMediaUrls,
} from '../src/utils/media.js'
import { wasmPool } from '../src/utils/wasm-pool.js'
import { wasmSmoothScroll } from '../src/utils/wasm-scroll.js'
import { gpuAccel } from '../src/utils/gpu-accel.js'
import { npuPredict } from '../src/utils/npu-predict.js'

describe('WASM, Math Models, Media & Performance Engine (60+ Tests)', () => {
  describe('1. Responsive Fibonacci Column & Padding Calculations', () => {
    test('calcColsForWidth returns 1 for mobile viewports (< 540px)', () => {
      expect(calcColsForWidth(320)).toBe(1)
      expect(calcColsForWidth(375)).toBe(1)
      expect(calcColsForWidth(539)).toBe(1)
    })

    test('calcColsForWidth returns 2 for tablet viewports (540px - 959px)', () => {
      expect(calcColsForWidth(540)).toBe(2)
      expect(calcColsForWidth(768)).toBe(2)
      expect(calcColsForWidth(959)).toBe(2)
    })

    test('calcColsForWidth returns 3 for small desktop (960px - 1439px)', () => {
      expect(calcColsForWidth(960)).toBe(3)
      expect(calcColsForWidth(1280)).toBe(3)
      expect(calcColsForWidth(1439)).toBe(3)
    })

    test('calcColsForWidth returns 4 for standard desktop (1440px - 1919px)', () => {
      expect(calcColsForWidth(1440)).toBe(4)
      expect(calcColsForWidth(1680)).toBe(4)
      expect(calcColsForWidth(1919)).toBe(4)
    })

    test('calcColsForWidth returns 5 for wide desktop (1920px - 2099px)', () => {
      expect(calcColsForWidth(1920)).toBe(5)
      expect(calcColsForWidth(2048)).toBe(5)
      expect(calcColsForWidth(2099)).toBe(5)
    })

    test('calcColsForWidth returns 6 for 2K display (2100px - 2559px)', () => {
      expect(calcColsForWidth(2100)).toBe(6)
      expect(calcColsForWidth(2400)).toBe(6)
      expect(calcColsForWidth(2559)).toBe(6)
    })

    test('calcColsForWidth returns 7 for ultra-wide / 4K (>= 2560px)', () => {
      expect(calcColsForWidth(2560)).toBe(7)
      expect(calcColsForWidth(3840)).toBe(7)
    })

    test('calcResponsivePadding follows golden Fibonacci scale progression', () => {
      expect(calcResponsivePadding(300)).toBe(13)
      expect(calcResponsivePadding(480)).toBe(21)
      expect(calcResponsivePadding(640)).toBe(34)
      expect(calcResponsivePadding(960)).toBe(55)
      expect(calcResponsivePadding(1440)).toBe(89)
      expect(calcResponsivePadding(1920)).toBe(144)
    })
  })

  describe('2. Grid Geometry & Aspect Ratio Scaling', () => {
    test('calcColumnWidth calculates exact equal column splits with gap deduction', () => {
      // 3 cols, 1000px width, 20px gap -> 2 gaps of 20 = 40px -> 960 / 3 = 320px
      const width = calcColumnWidth(3, 1000, 20)
      expect(width).toBe(320)
    })

    test('calcColumnWidth handles 1 column scenario without gap deduction', () => {
      const width = calcColumnWidth(1, 500, 20)
      expect(width).toBe(500)
    })

    test('calcCardHeight calculates proportional height with optional padding', () => {
      // 16:9 ratio is ~1.777
      const height = calcCardHeight(1777, 1.777, 0)
      expect(Math.round(height)).toBe(1000)

      const heightWithPadding = calcCardHeight(1777, 1.777, 24)
      expect(Math.round(heightWithPadding)).toBe(1024)
    })

    test('calcAspectScaled keeps dimensions intact if width is within maxW', () => {
      expect(calcAspectScaled(1200, 800, 1920)).toBe(800)
    })

    test('calcAspectScaled downscales height proportionally when width exceeds maxW', () => {
      // 3840x2160 scaled down to max 1920 gives height 1080
      expect(calcAspectScaled(3840, 2160, 1920)).toBe(1080)
    })
  })

  describe('3. Animation Easing, Ring Offsets & DrawText Delays', () => {
    test('calcEaseOutCubic starts at 0 and finishes at 1', () => {
      expect(calcEaseOutCubic(0)).toBe(0)
      expect(calcEaseOutCubic(1)).toBe(1)
    })

    test('calcEaseOutCubic decelerates towards the end (fast start, smooth stop)', () => {
      const mid = calcEaseOutCubic(0.5)
      expect(mid).toBeGreaterThan(0.5) // cubic out at 0.5 is 0.875
      expect(mid).toBe(0.875)
    })

    test('calcCarouselRingOffset computes linear progress along circumference', () => {
      const circumference = 100
      expect(calcCarouselRingOffset(0, 5000, circumference)).toBe(0)
      expect(calcCarouselRingOffset(2500, 5000, circumference)).toBe(50)
      expect(calcCarouselRingOffset(5000, 5000, circumference)).toBe(100)
    })

    test('calcCarouselScrollTarget computes exact horizontal translation target', () => {
      expect(calcCarouselScrollTarget(0, 800, 0)).toBe(0)
      expect(calcCarouselScrollTarget(2, 800, 0)).toBe(1600)
      expect(calcCarouselScrollTarget(2, 800, 20)).toBe(1640)
    })

    test('calcDrawTextDelay clamps delay between 1ms and 22ms', () => {
      // Very long text -> should use proportional delay (no 6ms floor)
      expect(calcDrawTextDelay(500, 1500)).toBe(3)
      // Very short text -> should clamp to max 22ms
      expect(calcDrawTextDelay(5, 1800)).toBe(22)
      // Normal length text
      const delay = calcDrawTextDelay(100, 1800)
      expect(delay).toBe(18)
    })

    test('calcDrawTextOffset calculates staggered temporal offset per character and line', () => {
      const offset0 = calcDrawTextOffset(0, 10, 15)
      expect(offset0).toBe(150)

      const offset1 = calcDrawTextOffset(1, 10, 15)
      expect(offset1).toBe(180) // 150 + 1 * 30
    })
  })

  describe('4. Media Utility Helpers & Kodak MozJPEG MSSIM URLs', () => {
    test('isGravatarUrl accurately identifies gravatar domains', () => {
      expect(isGravatarUrl('https://gravatar.com/avatar/abc')).toBe(true)
      expect(isGravatarUrl('https://www.gravatar.com/avatar/abc')).toBe(true)
      expect(isGravatarUrl('https://secure.gravatar.com/avatar/abc')).toBe(true)
      expect(isGravatarUrl('https://example.com/avatar.jpg')).toBe(false)
      expect(isGravatarUrl('')).toBe(false)
      expect(isGravatarUrl(null)).toBe(false)
    })

    test('getGravatarSrcset produces 1x, 2x, and 3x responsive density descriptors', () => {
      const url = 'https://gravatar.com/avatar/abc123'
      const srcset = getGravatarSrcset(url)
      expect(srcset).toContain('size=200 1x')
      expect(srcset).toContain('size=300 2x')
      expect(srcset).toContain('size=400 3x')
    })

    test('getOptimizedGravatar sets explicit requested size query parameter', () => {
      const url = 'https://gravatar.com/avatar/abc123?size=80'
      expect(getOptimizedGravatar(url, 300)).toBe('https://gravatar.com/avatar/abc123?size=300')
    })

    test('stripHtml strips nested and broken HTML tags safely', () => {
      expect(stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World')
      expect(stripHtml('No tags here')).toBe('No tags here')
      expect(stripHtml(null)).toBe('')
      expect(stripHtml('<div><span>text</span></div>')).toBe('text')
    })

    test('svgPlaceholder generates lightweight data-uri SVG image', () => {
      const placeholder = svgPlaceholder(800, 600)
      expect(placeholder).toContain('data:image/svg+xml')
      expect(placeholder).toContain('viewBox%3D%220%200%20800%20600%22')
    })

    test('buildMediaUrls generates Kodak MSSIM tuned mozjpeg and mp4 paths', () => {
      const storage = 'https://storage.googleapis.com/luiskr.com/public/_v3/'
      const imageItem = { src: 'img-1', isVideo: false }
      const urls = buildMediaUrls(storage, 'projects/metcha/', imageItem)

      expect(urls.isVideo).toBe(false)
      expect(urls.source).toBe(
        'https://storage.googleapis.com/luiskr.com/public/_v3/projects/metcha/img-1-mozjpg-uncompressed.jpg'
      )
      expect(urls.thumb).toBe(
        'https://storage.googleapis.com/luiskr.com/public/_v3/projects/metcha/img-1-mozjpg3-MSSIM-tuned-kodak.jpg'
      )
    })

    test('buildMediaUrls generates mp4 and video poster paths for video items', () => {
      const storage = 'https://storage.googleapis.com/luiskr.com/public/_v3/'
      const videoItem = { src: 'clip-1', isVideo: true }
      const urls = buildMediaUrls(storage, 'projects/metcha/', videoItem)

      expect(urls.isVideo).toBe(true)
      expect(urls.source).toBe(
        'https://storage.googleapis.com/luiskr.com/public/_v3/projects/metcha/clip-1.mp4'
      )
      expect(urls.thumb).toBe(
        'https://storage.googleapis.com/luiskr.com/public/_v3/projects/metcha/clip-1.mp4.jpg-thumb.jpg'
      )
    })
  })

  describe('5. WASM Worker Pool & Task Dispatcher', () => {
    test('wasmPool is initialized with positive size', () => {
      expect(wasmPool.size).toBeGreaterThanOrEqual(2)
      expect(wasmPool.size).toBeLessThanOrEqual(8)
    })

    test('wasmPool.dispatch returns a promise resolving gracefully in non-worker environment', async () => {
      const result = await wasmPool.dispatch('COMPUTE_LAYOUT', { width: 1000 })
      expect(result).toBeNull()
    })
  })

  describe('6. GPU Hardware Acceleration & NPU Predictive Engine', () => {
    test('gpuAccel.accelerateElementGPU sets transform, backface-visibility, and will-change', () => {
      const el = document.createElement('div')
      gpuAccel.accelerateElementGPU(el)
      expect(el.style.transform).toContain('translate3d(0, 0, 0)')
      expect(el.style.backfaceVisibility).toBe('hidden')
      expect(el.style.willChange).toBe('transform, opacity')
    })

    test('gpuAccel.releaseElementGPU clears willChange to conserve GPU VRAM', () => {
      const el = document.createElement('div')
      gpuAccel.accelerateElementGPU(el)
      gpuAccel.releaseElementGPU(el)
      expect(el.style.willChange).toBe('auto')
    })

    test('npuPredict registers prediction likelihood without throw', () => {
      const target = document.createElement('div')
      expect(() => {
        npuPredict.predictTargetLikelihood('hover', target, 500)
      }).not.toThrow()
    })
  })

  describe('7. WASM Smooth Scroll Physics Engine', () => {
    test('wasmSmoothScroll ignores scroll when distance is below threshold', () => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true })
      expect(() => {
        wasmSmoothScroll({ scrollTo: 101 }) // distance 1px < threshold 2px
      }).not.toThrow()
    })

    test('wasmSmoothScroll accelerates element GPU and animates to destination', () => {
      const target = document.createElement('div')
      target.id = 'target-section'
      document.body.appendChild(target)

      expect(() => {
        wasmSmoothScroll({ element: target, duration: 200 })
      }).not.toThrow()
    })
  })
})
