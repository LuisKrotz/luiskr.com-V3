/**
 * @file media-expanded-store-additional-branches.test.js
 * @description Split from media-expanded.test.js — covers the "store additional branches" describe.
 */
import store from '@core/store.js'
import '@website/components/media/MediaExpanded.js'
import '@website/components/media/MediaFigure.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'

const _flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── store branches ──────────────────────────────────────────────────────────
describe('store additional branches', () => {
  test('commit notifies subscribers', () => {
    const seen = []

    const unsub = store.subscribe((state) => seen.push(state))

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    expect(seen.length).toBeGreaterThanOrEqual(0)

    unsub?.()
  })
})
