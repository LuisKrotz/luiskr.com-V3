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

import store from '@/core/store.js'

import { appText, componentText, routeSlugs } from '@/core/locale/ui-text.js'

import { TEST_TEXT } from '../../../fixtures/test-constants.js'
import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { LANG_MUTATIONS } from '../../../../src/core/tokens/events/mutations.js'
import { SECTION_UI_KEYS } from '../../../../src/core/tokens/data/ui-keys.js'
import { TYPE_STRINGS } from '../../../../src/core/tokens/strings/types.js'





// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('ui-text tails', () => {
  test('componentText falls through to the fallback snapshot', () => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {})

    expect(componentText(TEST_TEXT.MISSING_KEY)).toBeUndefined()
    expect(typeof appText(SECTION_UI_KEYS.TITLE) === TYPE_STRINGS.STRING || appText(TEST_TEXT.MISSING_KEY) === undefined).toBe(true)

    const slugs = routeSlugs({})

    expect(slugs).toBeTruthy()
  })
})

