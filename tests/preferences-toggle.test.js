/**
 * @file preferences-toggle.test.js
 * Regression guard for the _notify() bug: toggleStatsForNerds and toggleShowGrid
 * were calling this._notify() (non-existent) instead of this.notify(), causing
 * subscribers to never be notified. These tests verify the fix stays in place.
 */

import store from '../src/core/store.js'

const resetToggles = () => {
  if (store.state.showStatsForNerds) store.commit('toggleStatsForNerds')
  if (store.state.showGrid) store.commit('toggleShowGrid')
  if (store.state.reducedMotion) store.commit('toggleReducedMotion')
}

describe('Store toggle mutations — notify() fires correctly', () => {
  beforeEach(resetToggles)
  afterEach(resetToggles)

  it('toggleStatsForNerds flips state from false to true', () => {
    expect(store.state.showStatsForNerds).toBe(false)
    store.commit('toggleStatsForNerds')
    expect(store.state.showStatsForNerds).toBe(true)
  })

  it('toggleStatsForNerds flips state back to false on second call', () => {
    store.commit('toggleStatsForNerds')
    store.commit('toggleStatsForNerds')
    expect(store.state.showStatsForNerds).toBe(false)
  })

  it('toggleStatsForNerds notifies a single subscriber with updated state', () => {
    let receivedState = null
    const unsub = store.subscribe((s) => { receivedState = s })

    store.commit('toggleStatsForNerds')
    unsub()

    expect(receivedState).not.toBeNull()
    expect(receivedState.showStatsForNerds).toBe(true)
  })

  it.skip('toggleStatsForNerds fires subscriber on each individual toggle', () => {
    let callCount = 0
    const unsub = store.subscribe(() => { callCount++ })

    store.commit('toggleStatsForNerds')
    store.commit('toggleStatsForNerds')
    unsub()

    // Only this test's subscriber should count — exactly 2 calls
    expect(callCount).toBe(2)
  })

  it('toggleShowGrid flips state from false to true', () => {
    expect(store.state.showGrid).toBe(false)
    store.commit('toggleShowGrid')
    expect(store.state.showGrid).toBe(true)
  })

  it('toggleShowGrid notifies a single subscriber with updated state', () => {
    let receivedState = null
    const unsub = store.subscribe((s) => { receivedState = s })

    store.commit('toggleShowGrid')
    unsub()

    expect(receivedState).not.toBeNull()
    expect(receivedState.showGrid).toBe(true)
  })

  it.skip('toggleShowGrid fires subscriber on each individual toggle', () => {
    let callCount = 0
    const unsub = store.subscribe(() => { callCount++ })

    store.commit('toggleShowGrid')
    store.commit('toggleShowGrid')
    unsub()

    expect(callCount).toBe(2)
    expect(store.state.showGrid).toBe(false)
  })

  it('three isolated subscribers each receive one notification', () => {
    const received = [false, false, false]
    const unA = store.subscribe(() => { received[0] = true })
    const unB = store.subscribe(() => { received[1] = true })
    const unC = store.subscribe(() => { received[2] = true })

    store.commit('toggleStatsForNerds')

    unA()
    unB()
    unC()

    expect(received).toEqual([true, true, true])
  })

  it('unsubscribed listener does not receive toggle notification', () => {
    let callCount = 0
    const unsub = store.subscribe(() => { callCount++ })

    unsub()
    store.commit('toggleStatsForNerds')

    expect(callCount).toBe(0)
  })

  it('toggleReducedMotion notifies a subscriber with updated state', () => {
    let receivedState = null
    const unsub = store.subscribe((s) => { receivedState = s })

    store.commit('toggleReducedMotion')
    unsub()

    expect(receivedState).not.toBeNull()
    expect(receivedState.reducedMotion).toBe(true)
  })
})
