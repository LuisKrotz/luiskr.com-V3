/**
 * @file utils-deep-coverage-gpuaccel-wasmcss-core-utils.test.js
 * @description Split from utils-deep-coverage.test.js — covers the "gpuAccel + wasmCSS + core utils" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'
import { wasmCSS, calcWasmSkeletonStyle } from '@core/utils/wasm/wasm-css.js'
import { deepQuerySelector, deepQuerySelectorAll, svgPlaceholder } from '@core/utils/dom.js'
import {
  isGravatarUrl,
  getGravatarSrcset,
  getOptimizedGravatar,
  buildMediaUrls,
} from '@core/utils/media.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'

import { MEDIA } from '@core/tokens/media/suffixes.js'

const _flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

// ─── gpu-accel.js / wasm-css.js / core utils ─────────────────────────────────
describe('gpuAccel + wasmCSS + core utils', () => {
  test('gpuAccel degrades cleanly without GL', () => {
    expect(gpuAccel.processVideoGPU(null)).toBeNull()
    expect(gpuAccel.processImageGPU(null)).toBeNull()
    expect(() => gpuAccel.accelerateElementGPU(document.createElement(HTML_TAGS.DIV))).not.toThrow()
    expect(() => gpuAccel.processBitmapGPU({})).not.toThrow()
  })

  test('wasmCSS exposes the shared stylesheet + skeleton style helper', () => {
    expect(wasmCSS).toBeTruthy()

    const style = calcWasmSkeletonStyle(100, 50)

    expect(style.width).toBe('100px')
    expect(style.height).toBe('50px')
    expect(calcWasmSkeletonStyle('2rem', '1rem').width).toBe('2rem')
  })

  test('deepQuerySelector walks shadow roots', () => {
    const host = document.createElement(HTML_TAGS.DIV)
    const shadow = host.attachShadow({ mode: STATE_STRINGS.OPEN })
    const inner = document.createElement(HTML_TAGS.SPAN)

    inner.className = 'deep-target'
    shadow.appendChild(inner)
    document.body.appendChild(host)

    expect(deepQuerySelector('.deep-target')).toBe(inner)
    expect(deepQuerySelectorAll('.deep-target')).toContain(inner)
    expect(deepQuerySelector('.does-not-exist')).toBeNull()
    expect(deepQuerySelector('.x', null)).toBeNull()

    host.remove()
  })

  test('svgPlaceholder encodes the viewBox data URI', () => {
    const uri = svgPlaceholder(64, 32)

    expect(uri).toContain('viewBox')
    expect(decodeURIComponent(uri)).toContain('0 0 64 32')
  })

  test('gravatar helpers rewrite size params only for gravatar hosts', () => {
    const grav = 'https://gravatar.com/avatar/abc?size=100'

    expect(isGravatarUrl(grav)).toBe(true)
    expect(isGravatarUrl('https://example.com')).toBe(false)
    expect(isGravatarUrl(42)).toBe(false)
    expect(isGravatarUrl('not a url at all:::')).toBe(false)
    expect(getGravatarSrcset('https://example.com/x')).toBe('')
    expect(getGravatarSrcset(grav)).toContain('size=200')
    expect(getGravatarSrcset(grav)).toContain('size=400')
    expect(getOptimizedGravatar(grav, 250)).toContain('size=250')
    expect(getOptimizedGravatar('https://example.com', 250)).toBe('https://example.com')
    expect(getOptimizedGravatar(null)).toBe('')
  })

  test('buildMediaUrls assembles image + video grammars', () => {
    expect(buildMediaUrls('cdn/', 'f/', { src: 'pic', isVideo: false }).source).toBe(
      'cdn/f/pic-mozjpg-uncompressed.jpg'
    )
    expect(buildMediaUrls('cdn/', 'f/', { src: 'vid', isVideo: true }).source).toBe('cdn/f/vid.mp4')
    expect(buildMediaUrls('cdn/', 'f/', { src: 'vid', isVideo: true }).thumb).toContain(
      MEDIA.VIDEO_THUMB_EXT
    )
    expect(buildMediaUrls('', 'f/', { src: 'x' }).source).toBe('')
    expect(buildMediaUrls('cdn/', null, null).isVideo).toBe(false)
  })
})
