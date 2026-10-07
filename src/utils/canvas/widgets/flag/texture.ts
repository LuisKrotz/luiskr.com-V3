/**
 * @file flag-texture.ts
 * @description Flag asset caches for FlagRenderer: per-country-code
 * composited <img> elements (base flag plus overlays baked in) and the
 * shared POT GL textures decoded from them.
 */

import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { FLAG_TEXTURE } from '@/core/tokens/media/flag-texture.js'
import { ASSET_PATHS } from '@/core/tokens/routes/paths.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { VENDOR_STRINGS } from '@/core/tokens/strings/vendor.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'
import { wasmImageDecoder } from '@/utils/wasm/wasm-image-decoder.js'
import type { FlagRenderer } from './renderer.js'

const flagUrl = (cc: string): string => `${ASSET_PATHS.FLAGS_PREFIX}${cc}${ASSET_PATHS.SVG_EXT}`

/**
 * Kicks the worker-side decode once per country code: the WASM pool fetches
 * the SVG and rasterizes it through createImageBitmap with GPU resize hints,
 * so flag pixels arrive as a POT-sized ImageBitmap instead of a main-thread
 * decode + 2D-canvas resample. Falls back silently — the <img> path below
 * still produces the texture when the worker can't.
 */
function kickWasmDecode(renderer: FlagRenderer, cc: string): void {
  if (renderer._bitmapPending.has(cc)) return

  renderer._bitmapPending.add(cc)

  void storeDecoded(renderer, cc)
}

/**
 * Awaits one worker decode and caches the landed bitmap for cc; a null
 * result or a rejected dispatch (worker unavailable) leaves the <img>
 * fallback path in charge of the texture.
 */
async function storeDecoded(renderer: FlagRenderer, cc: string): Promise<void> {
  const bitmap = await wasmImageDecoder
    .decodeImageWASM(flagUrl(cc), FLAG_TEXTURE.WIDTH, FLAG_TEXTURE.HEIGHT)
    .catch(() => null)

  if (bitmap) renderer.bitmaps.set(cc, bitmap)
}

/**
 * Builds (once) and caches the flag's composited <img> for country code
 * cc — composite means the base flag plus any overlays (e.g. the EU
 * circle for split-locale flags) baked into one source image. The <img>
 * stays the fallback decode path and the natural-aspect probe.
 */
export function flagImage(renderer: FlagRenderer, cc: string): HTMLImageElement {
  let img = renderer.images.get(cc)

  if (!img) {
    img = new Image()

    img.crossOrigin = VENDOR_STRINGS.ANONYMOUS

    img.src = flagUrl(cc)

    renderer.images.set(cc, img)

    kickWasmDecode(renderer, cc)
  }

  return img
}

/** Sources the flag texture can be built from — <img>, POT canvas or a worker bitmap. */
type FlagSource = HTMLImageElement | HTMLCanvasElement | ImageBitmap

/** Uploads a POT-sized source as a mipmapped GL texture and caches it per cc. */
function uploadTexture(
  renderer: FlagRenderer,
  cc: string,
  source: FlagSource
): WebGLTexture | null {
  const gl = renderer.gl as WebGLRenderingContext

  const tex = gl.createTexture()

  if (!tex) return null

  gl.bindTexture(gl.TEXTURE_2D, tex)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)

  gl.generateMipmap(gl.TEXTURE_2D)

  renderer.textures.set(cc, tex)

  return tex
}

/** Resizes a source into a POT canvas when it isn't already at flag size. */
function potSource(source: FlagSource, w: number, h: number): HTMLCanvasElement | null {
  const pot = document.createElement(HTML_TAGS.CANVAS)

  pot.width = w

  pot.height = h

  const ctx = pot.getContext(WEBGL_STRINGS.CONTEXT_2D)

  if (!ctx) return null

  ctx.imageSmoothingEnabled = true

  ctx.imageSmoothingQuality = STATE_STRINGS.HIGH

  ctx.drawImage(source, 0, 0, w, h)

  return pot
}

/** Builds/caches the GL texture for the flag image. */
export function flagTexture(renderer: FlagRenderer, cc: string): WebGLTexture | null {
  const gl = renderer.gl

  if (!gl) return null

  const cached = renderer.textures.get(cc)

  if (cached) return cached

  // Preferred source: the worker-decoded bitmap (already POT when the
  // worker honoured the resize hint; resampled through the POT canvas
  // otherwise). The <img> decode is the fallback while it is pending.
  const bitmap = renderer.bitmaps.get(cc)

  let source: FlagSource | null = null

  if (bitmap) {
    source =
      bitmap.width === FLAG_TEXTURE.WIDTH && bitmap.height === FLAG_TEXTURE.HEIGHT
        ? bitmap
        : potSource(bitmap, FLAG_TEXTURE.WIDTH, FLAG_TEXTURE.HEIGHT)
  } else {
    const img = renderer.images.get(cc)

    if (img && img.complete && img.naturalWidth) {
      source = potSource(img, FLAG_TEXTURE.WIDTH, FLAG_TEXTURE.HEIGHT)
    }
  }

  if (!source) return null

  return uploadTexture(renderer, cc, source)
}
