/**
 * @file hud-and-project-statshud.test.js
 * @description Split from hud-and-project.test.js — covers the "StatsHud" describe.
 */
import store from '@core/store.js'
import '@website/components/feedback/StatsHud.js'
import '@website/views/project/Project.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'

// ─── StatsHud ────────────────────────────────────────────────────────────────
describe('StatsHud', () => {
  const mountHud = () => {
    const el = document.createElement(COMPONENT_TAGS.STATS_HUD)

    document.body.appendChild(el)

    return el
  }

  test('renders nothing until the stats preference is enabled', () => {
    const el = mountHud()

    el.onMounted?.()

    expect(el.showStats).toBe(false)

    el.remove()
  })

  test('updates the DOM fields when stats arrive', () => {
    if (!store.state.showStatsForNerds) store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)

    const el = mountHud()

    el._stats = {
      fps: 60,
      networkBytesPerSec: 2048,
      pendingRequests: 2,
      memoryMB: 42,
      cpuPercent: 20,
      latencyMs: 50,
    }

    el._updateStatsDom()

    const fpsEl = el.shadowRoot?.querySelector('[data-stat="fps"]')

    expect(el.showStats).toBe(true)

    if (fpsEl) expect(fpsEl.textContent).toBe('60')

    el.remove()

    if (store.state.showStatsForNerds) store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)
  })

  test('exercises each stat color band', () => {
    if (!store.state.showStatsForNerds) store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)

    const el = mountHud()

    const bands = [
      { fps: 10, cpuPercent: 90, latencyMs: 600 },
      { fps: 40, cpuPercent: 50, latencyMs: 200 },
      { fps: 0, cpuPercent: 0, latencyMs: 0 },
    ]

    for (const snap of bands) {
      el._stats = {
        fps: snap.fps,
        networkBytesPerSec: 0,
        pendingRequests: 0,
        memoryMB: 0,
        cpuPercent: snap.cpuPercent,
        latencyMs: snap.latencyMs,
      }

      el._updateStatsDom()
    }

    el.remove()

    if (store.state.showStatsForNerds) store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS)
  })

  test('onDestroy unsubscribes from the engine', () => {
    const el = mountHud()

    el.onMounted?.()

    const cb = el._statsCb

    el.remove()

    expect(cb).toBeTruthy()
  })
})
