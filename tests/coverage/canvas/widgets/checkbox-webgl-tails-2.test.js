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

import { CheckboxWebGL } from '@earth/space/checkbox-webgl.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'



// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('checkbox-webgl tails 2', () => {
  test('init guard, default callback and running-loop setChecked', () => {
    const orphan = new CheckboxWebGL(null)

    orphan.init()

    expect(orphan.ctx2d).toBeNull()

    const canvas = document.createElement(HTML_TAGS.CANVAS)
    const cb = new CheckboxWebGL(canvas)

    cb.animId = 1
    cb.setChecked(false)
    cb.destroy()
  })
})

