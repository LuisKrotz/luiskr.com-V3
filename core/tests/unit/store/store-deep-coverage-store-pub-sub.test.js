/**
 * @file store-deep-coverage-store-pub-sub.test.js
 * @description Split from store-deep-coverage.test.js — covers the "store — pub/sub" describe.
 */
import { describe, test, expect, beforeEach } from '@jest/globals'
import store from '@core/store.js'
import { MODAL_MUTATIONS, UI_MUTATIONS } from '@core/tokens/events/mutations.js'

beforeEach(() => {
  document.documentElement.className = ''
  document.body.className = ''
})

// ─── Missing-BOM guards ─────────────────────────────────────────────────────
// Every `typeof <global> !== 'undefined'` persistence/class guard has an else
// arm for non-browser contexts; these call each mutation with the global
// shadowed to undefined so the skip path is exercised.

describe('store — pub/sub', () => {
  test('commit notifies subscribers; unknown mutation warns and no-ops', () => {
    const calls = []
    const unsub = store.subscribe((s) => calls.push(s))

    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)
    expect(calls.length).toBeGreaterThan(0)

    store.commit('notARealMutation')
    store.commit(UI_MUTATIONS.SET_MARQUEE_AMOUNT) // returns undefined → notifies

    unsub()
    const count = calls.length

    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
    expect(calls.length).toBe(count)
  })

  test('a throwing subscriber cannot break the others', () => {
    const bad = () => {
      throw new Error('boom')
    }
    const good = []
    const u1 = store.subscribe(bad)
    const u2 = store.subscribe(() => good.push(1))

    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, true)

    expect(good.length).toBe(1)

    u1()
    u2()
    store.commit(MODAL_MUTATIONS.TOGGLE_PREFERENCES_MODAL, false)
  })
})
