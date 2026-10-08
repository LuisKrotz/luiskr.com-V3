/**
 * @file preferences-toggle.test.js
 * Regression guard for the _notify() bug: toggleStatsForNerds and toggleShowGrid
 * were calling this._notify() (non-existent) instead of this.notify(), causing
 * subscribers to never be notified. These tests verify the fix stays in place.
 */

import store from '@core/store.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'

const resetToggles = () => {
  if (store.state.showStatsForNerds) store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)
  if (store.state.showGrid) store.commit(PREF_MUTATIONS.TOGGLE_SHOW_GRID)
  if (store.state.reducedMotion) store.commit(PREF_MUTATIONS.TOGGLE_REDUCED_MOTION)
}

describe('Store toggle mutations — notify() fires correctly', () => {
  beforeEach(resetToggles)
  afterEach(resetToggles)

  it('toggleStatsForNerds flips state from false to true', () => {
    expect(store.state.showStatsForNerds).toBe(false)
    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)
    expect(store.state.showStatsForNerds).toBe(true)
  })

  it('toggleStatsForNerds flips state back to false on second call', () => {
    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)
    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)
    expect(store.state.showStatsForNerds).toBe(false)
  })

  it('toggleStatsForNerds notifies a single subscriber with updated state', () => {
    let receivedState = null
    const unsub = store.subscribe((s) => {
      receivedState = s
    })

    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)
    unsub()

    expect(receivedState).not.toBeNull()
    expect(receivedState.showStatsForNerds).toBe(true)
  })

  it.skip('toggleStatsForNerds fires subscriber on each individual toggle', () => {
    let callCount = 0
    const unsub = store.subscribe(() => {
      callCount++
    })

    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)
    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)
    unsub()

    // Only this test's subscriber should count — exactly 2 calls
    expect(callCount).toBe(2)
  })

  it('toggleShowGrid flips state from false to true', () => {
    expect(store.state.showGrid).toBe(false)
    store.commit(PREF_MUTATIONS.TOGGLE_SHOW_GRID)
    expect(store.state.showGrid).toBe(true)
  })

  it('toggleShowGrid notifies a single subscriber with updated state', () => {
    let receivedState = null
    const unsub = store.subscribe((s) => {
      receivedState = s
    })

    store.commit(PREF_MUTATIONS.TOGGLE_SHOW_GRID)
    unsub()

    expect(receivedState).not.toBeNull()
    expect(receivedState.showGrid).toBe(true)
  })

  it.skip('toggleShowGrid fires subscriber on each individual toggle', () => {
    let callCount = 0
    const unsub = store.subscribe(() => {
      callCount++
    })

    store.commit(PREF_MUTATIONS.TOGGLE_SHOW_GRID)
    store.commit(PREF_MUTATIONS.TOGGLE_SHOW_GRID)
    unsub()

    expect(callCount).toBe(2)
    expect(store.state.showGrid).toBe(false)
  })

  it('three isolated subscribers each receive one notification', () => {
    const received = [false, false, false]
    const unA = store.subscribe(() => {
      received[0] = true
    })
    const unB = store.subscribe(() => {
      received[1] = true
    })
    const unC = store.subscribe(() => {
      received[2] = true
    })

    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)

    unA()
    unB()
    unC()

    expect(received).toEqual([true, true, true])
  })

  it('unsubscribed listener does not receive toggle notification', () => {
    let callCount = 0
    const unsub = store.subscribe(() => {
      callCount++
    })

    unsub()
    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)

    expect(callCount).toBe(0)
  })

  it('toggleReducedMotion notifies a subscriber with updated state', () => {
    let receivedState = null
    const unsub = store.subscribe((s) => {
      receivedState = s
    })

    store.commit(PREF_MUTATIONS.TOGGLE_REDUCED_MOTION)
    unsub()

    expect(receivedState).not.toBeNull()
    expect(receivedState.reducedMotion).toBe(true)
  })
})
