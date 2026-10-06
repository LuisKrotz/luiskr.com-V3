/**
 * @file coverage-tails-4.test.js
 * @description Fourth branch-tail sweep targeting files with ≤8 uncovered
 * branches: ui-text fallback dig, firebase-mock path resolver, sanitize
 * disallowed-tag replacement, webgl-pool IO guard, CMS mount guard,
 * CookieBanner actions, checkbox widget lifecycle, NPU GPU fallback,
 * ContactSection lang guards, jsx prop routing, media helpers,
 * scroll-state one-shots, NotFound link binding, wasm-css reuse,
 * Component remount reuse, schema generators, db bootstrap/cache,
 * gpu-info tiers, wasm-pool worker guards, intro-loader internals.
 */
import { jest } from '@jest/globals'
import { getGPUInfo, glContextOptions } from '@/utils/gpu/gpu-info.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'





// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('gpu-info tails', () => {
  const freshProbe = async (makeCanvas) => {
    const origCreate = document.createElement.bind(document)

    jest.resetModules()

    document.createElement = (tag) => (tag === HTML_TAGS.CANVAS && makeCanvas ? makeCanvas() : origCreate(tag))

    const mod = await import('@/utils/gpu/gpu-info.js')
    const info = mod.getGPUInfo()

    document.createElement = origCreate

    return { ...mod, info }
  }

  const fakeCanvas = (gl) => ({
    width: 0,
    height: 0,
    getContext: (kind) => (kind === WEBGL_STRINGS.WEBGL ? gl : null) })

  const fakeGl = (renderer, withExt) => ({
    RENDERER: 1,
    getExtension: () => (withExt ? { UNMASKED_RENDERER_WEBGL: 2 } : null),
    getParameter: () => renderer })

  test('glContextOptions reflects the detected GPU tier', () => {
    const info = getGPUInfo()
    const opts = glContextOptions()
    const merged = glContextOptions({ antialias: false })

    expect(opts.powerPreference).toBeTruthy()
    expect(merged.antialias).toBe(false)
    expect(info).toBeTruthy()
  })

  test('dedicated renderer with debug extension resolves high-power tier', async () => {
    const mod = await freshProbe(() => fakeCanvas(fakeGl('NVIDIA GeForce RTX', true)))

    expect(mod.info.renderer).toContain('NVIDIA')
    expect(mod.info.capable).toBe(true)
    expect(mod.glContextOptions().powerPreference).toBe(WEBGL_STRINGS.POWER_PREF_HIGH)
  })

  test('software renderer resolves low-power tier via the webgl fallback', async () => {
    const mod = await freshProbe(() => fakeCanvas(fakeGl('SwiftShader', false)))

    expect(mod.info.software).toBe(true)
    expect(mod.glContextOptions().powerPreference).toBe(WEBGL_STRINGS.POWER_PREF_LOW)
  })

  test('missing context and throwing probe both degrade to empty renderer', async () => {
    const noGl = await freshProbe(() => fakeCanvas(null))

    expect(noGl.info.renderer).toBe(CHAR_STRINGS.EMPTY)

    const throwing = await freshProbe(() => { throw new Error('no-canvas') })

    expect(throwing.info.capable).toBe(false)

    const emptyParam = await freshProbe(() => fakeCanvas(fakeGl(null, true)))

    expect(emptyParam.info.renderer).toBe(CHAR_STRINGS.EMPTY)
  })

  test('probe returns empty without document or navigator', async () => {
    const savedDoc = globalThis.document
    const savedNav = globalThis.navigator

    jest.resetModules()

    delete globalThis.document
    delete globalThis.navigator

    const mod = await import('@/utils/gpu/gpu-info.js')
      .then((m) => {
        m.getGPUInfo()
        return m
      })
      .finally(() => {
        globalThis.document = savedDoc
        globalThis.navigator = savedNav
      })

    expect(mod.getGPUInfo().renderer).toBe(CHAR_STRINGS.EMPTY)
    expect(mod.getGPUInfo().mobile).toBe(false)
  })
})

