/**
 * @file flag-texture-wasm-tails.test.js
 * @description Coverage tails for the worker-decoded flag texture path:
 * decodeImageWASM fan-out is kicked once per country code (pending-set
 * dedupe), a landed ImageBitmap wins over the <img> fallback and uploads
 * directly when POT-sized (resampled through the POT canvas otherwise),
 * and worker failures fall back silently.
 */
import { describe, test, expect, jest, afterEach } from '@jest/globals'
import { flagImage, flagTexture } from '@/utils/canvas/widgets/flag/texture.js'
import { FlagRenderer } from '@/utils/canvas/widgets/flag/renderer.js'
import { wasmImageDecoder } from '@/utils/wasm/wasm-image-decoder.js'
import { createMockGL, createMock2D } from '../../../fixtures/mock-webgl.js'
import { FLAG_TEXTURE } from '@/core/tokens/media/flag-texture.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

const makeBitmap = (w = FLAG_TEXTURE.WIDTH, h = FLAG_TEXTURE.HEIGHT) => ({
  width: w,
  height: h,
  close: () => {},
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('flag texture wasm decode tails', () => {
  test('flagImage kicks one worker decode per country code', async () => {
    const renderer = new FlagRenderer()
    const spy = jest
      .spyOn(wasmImageDecoder, 'decodeImageWASM')
      .mockImplementation(() => Promise.resolve(makeBitmap()))

    flagImage(renderer, 'us')
    flagImage(renderer, 'us')

    expect(spy).toHaveBeenCalledTimes(1)

    await flush()

    expect(renderer.bitmaps.get('us')).toBeTruthy()
  })

  test('flagTexture prefers the POT-sized worker bitmap over the img path', () => {
    const renderer = new FlagRenderer()

    renderer.gl = createMockGL()
    renderer.bitmaps.set('de', makeBitmap())
    renderer.images.set('de', { complete: false, naturalWidth: 0 })

    const tex = flagTexture(renderer, 'de')

    expect(tex).toBeTruthy()
    expect(renderer.textures.get('de')).toBe(tex)
    expect(flagTexture(renderer, 'de')).toBe(tex)
  })

  test('a non-POT bitmap is resampled through the POT canvas', () => {
    const proto = window.HTMLCanvasElement.prototype
    const orig = proto.getContext
    const ctx2d = createMock2D()

    proto.getContext = function patched(type) {
      return String(type) === WEBGL_STRINGS.CONTEXT_2D ? ctx2d : orig.call(this, type)
    }

    try {
      const renderer = new FlagRenderer()

      renderer.gl = createMockGL()
      renderer.bitmaps.set('fr', makeBitmap(17, 9))

      expect(flagTexture(renderer, 'fr')).toBeTruthy()
    } finally {
      proto.getContext = orig
    }
  })

  test('a rejected worker decode leaves the img fallback intact', async () => {
    const renderer = new FlagRenderer()

    jest
      .spyOn(wasmImageDecoder, 'decodeImageWASM')
      .mockImplementation(() => Promise.reject(new Error('no-worker')))

    flagImage(renderer, 'br')

    await flush()

    expect(renderer.bitmaps.has('br')).toBe(false)
  })

  test('a null worker result stores no bitmap', async () => {
    const renderer = new FlagRenderer()

    jest
      .spyOn(wasmImageDecoder, 'decodeImageWASM')
      .mockImplementation(() => Promise.resolve(null))

    flagImage(renderer, 'jp')

    await flush()

    expect(renderer.bitmaps.has('jp')).toBe(false)
  })

  test('dispose releases bitmaps and clears the pending set', async () => {
    const renderer = new FlagRenderer()

    renderer.gl = createMockGL()
    renderer.bitmaps.set('us', makeBitmap())
    renderer._bitmapPending.add('us')

    renderer._dispose()

    expect(renderer.bitmaps.size).toBe(0)
    expect(renderer._bitmapPending.size).toBe(0)
  })
})
