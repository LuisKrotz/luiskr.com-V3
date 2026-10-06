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
import type { FlagRenderer } from './renderer.js'

/**
 * Builds (once) and caches the flag's composited <img> for country code
 * cc — composite means the base flag plus any overlays (e.g. the EU
 * circle for split-locale flags) baked into one source image.
 */
export function flagImage(renderer: FlagRenderer, cc: string): HTMLImageElement {
  let img = renderer.images.get(cc)

  if (!img) {
    img = new Image()

    img.crossOrigin = VENDOR_STRINGS.ANONYMOUS

    img.src = `${ASSET_PATHS.FLAGS_PREFIX}${cc}${ASSET_PATHS.SVG_EXT}`

    renderer.images.set(cc, img)
  }

  return img
}

/** Builds/caches the GL texture for the flag image. */
export function flagTexture(renderer: FlagRenderer, cc: string): WebGLTexture | null {
  const gl = renderer.gl

  if (!gl) return null

  let tex = renderer.textures.get(cc)

  if (tex) return tex

  const img = renderer.images.get(cc)

  if (!img || !img.complete || !img.naturalWidth) return null

  const pot = document.createElement(HTML_TAGS.CANVAS)

  pot.width = FLAG_TEXTURE.WIDTH

  pot.height = FLAG_TEXTURE.HEIGHT

  const ctx = pot.getContext(WEBGL_STRINGS.CONTEXT_2D)

  if (!ctx) return null

  ctx.imageSmoothingEnabled = true

  ctx.imageSmoothingQuality = STATE_STRINGS.HIGH

  ctx.drawImage(img, 0, 0, FLAG_TEXTURE.WIDTH, FLAG_TEXTURE.HEIGHT)

  tex = gl.createTexture()

  if (!tex) return null

  gl.bindTexture(gl.TEXTURE_2D, tex)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pot)

  gl.generateMipmap(gl.TEXTURE_2D)

  renderer.textures.set(cc, tex)

  return tex
}
