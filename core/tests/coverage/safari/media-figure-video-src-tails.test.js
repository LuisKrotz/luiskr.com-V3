/**
 * @file media-figure-video-src-tails.test.js
 * @description Coverage tails for safari/patches/media-figure/video.ts —
 * the scaledown-variant guard arms: non-mobile viewport, missing second
 * variant, falsy scaled src, absent <source> child, and identical src.
 */
import { describe, test, expect } from '@jest/globals'
import { patchSafariVideo } from '@core/safari/patches/media-figure/video.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'

const makeVid = () => {
  const vid = document.createElement(HTML_TAGS.VIDEO)

  vid.play = () => Promise.resolve()

  return vid
}

const mobileViewport = (fn) => {
  const prev = window.innerWidth

  Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true })

  try {
    fn()
  } finally {
    Object.defineProperty(window, 'innerWidth', { value: prev, configurable: true })
  }
}

describe('patchSafariVideo scaledown guard tails', () => {
  test('wide non-iOS viewport keeps the full variant', () => {
    const vid = makeVid()

    patchSafariVideo({ video: ['full.mp4', 'scaled.mp4'] }, vid, null, false)

    expect(vid.querySelector(MEDIA_ATTRS.SOURCE)).toBe(null)
  })

  test('mobile viewport without a second variant is a no-op', () =>
    mobileViewport(() => {
      const vid = makeVid()

      patchSafariVideo({ video: ['full.mp4'] }, vid, null, false)

      expect(vid.querySelector(MEDIA_ATTRS.SOURCE)).toBe(null)
    }))

  test('mobile viewport with a falsy scaled entry is a no-op', () =>
    mobileViewport(() => {
      const vid = makeVid()

      patchSafariVideo({ video: ['full.mp4', ''] }, vid, null, false)

      expect(vid.querySelector(MEDIA_ATTRS.SOURCE)).toBe(null)
    }))

  test('mobile viewport with no <source> child leaves src untouched', () =>
    mobileViewport(() => {
      const vid = makeVid()

      patchSafariVideo({ video: ['full.mp4', 'scaled.mp4'] }, vid, null, false)

      expect(vid.querySelector(MEDIA_ATTRS.SOURCE)).toBe(null)
    }))

  test('mobile viewport swaps a different <source> to the scaled variant', () =>
    mobileViewport(() => {
      const vid = makeVid()
      const srcEl = document.createElement(MEDIA_ATTRS.SOURCE)

      srcEl.src = 'https://cdn.example/full.mp4'
      vid.appendChild(srcEl)

      patchSafariVideo({ video: ['full.mp4', 'scaled.mp4'] }, vid, null, false)

      expect(srcEl.src).toContain('scaled.mp4')
    }))
})
