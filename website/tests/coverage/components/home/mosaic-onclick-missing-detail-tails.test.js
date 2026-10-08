/**
 * @file mosaic-onclick-missing-detail-tails.test.js
 * @description Coverage tail for components/home/mosaic/interactions.ts —
 * the `if (d)` else arm inside onClick's deferred rAF measure: when the
 * details panel for the tapped card is absent from the shadow root, the
 * callback must skip the height write and still reflow the wall.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { onClick } from '@website/components/home/mosaic/interactions.js'
import { waitFor, TEST_PROJECTS } from '@tests/fixtures/test-constants.js'

describe('onClick missing-detail tail', () => {
  test('the deferred measure skips bottomH when the details panel is absent', async () => {
    // Minimal host stub: `hasTouch` forces the two-tap path, `$` returns
    // null for every selector so detailEl(host, i) resolves null inside
    // the rAF callback.
    const host = {
      hasTouch: true,
      touchIdx: null,
      bottomHMap: {},
      $: jest.fn(() => null),
      _updateDom: jest.fn(),
      layout: jest.fn(),
    }

    onClick(host, { link: TEST_PROJECTS.SLUG_MINIMELISSA }, 0)

    expect(host.touchIdx).toBe(0)
    expect(host._updateDom).toHaveBeenCalledTimes(1)

    await waitFor(() => host.layout.mock.calls.length > 0)

    expect(host.bottomHMap[0]).toBeUndefined()
  })
})
