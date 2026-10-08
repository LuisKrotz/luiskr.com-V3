/**
 * @file docs-reregister.test.js
 * @description Covers the custom-elements registration guard's else arm —
 * <view-docs> is already defined by the import chain above, so a module
 * re-evaluation (post jest.resetModules) must not throw or re-register.
 * The merge keeps this file's else-arm hit alongside the if-arm hits
 * recorded by every other suite.
 */

import { describe, test, expect, jest } from '@jest/globals'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import '@docs/Docs.js'

describe('view-docs registration guard', () => {
  test('re-importing after reset skips the already-registered define', async () => {
    expect(customElements.get(VIEW_TAGS.VIEW_DOCS)).toBeTruthy()

    jest.resetModules()

    await import('@docs/Docs.js')

    expect(customElements.get(VIEW_TAGS.VIEW_DOCS)).toBeTruthy()
  })
})
