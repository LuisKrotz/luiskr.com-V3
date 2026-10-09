/**
 * @file coverage/starfield/component/starfield-reeval-tails.test.js
 * @description Coverage tail for StarField.tsx module evaluation — the
 * `customElements.get(...)` guard's else arm. The tag is pre-registered
 * with a stand-in class so the module's define guard skips redefinition
 * (the same protection a hot-reload path would take).
 */
import { describe, test, expect } from '@jest/globals'

import { VIEW_TAGS } from '@core/tokens/elements/views.js'

class StandInStarField extends window.HTMLElement {}

window.customElements.define(VIEW_TAGS.VIEW_STAR_FIELD, StandInStarField)

await import('../../../../StarField.js')

describe('StarField module re-evaluation', () => {
  test('a pre-registered tag keeps its original constructor', () => {
    expect(window.customElements.get(VIEW_TAGS.VIEW_STAR_FIELD)).toBe(StandInStarField)
  })
})
