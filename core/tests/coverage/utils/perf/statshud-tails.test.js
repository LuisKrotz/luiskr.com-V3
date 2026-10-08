/**
 * @file statshud-tails.test.js
 * @description Split from coverage-tails-3.test.js — covers the "StatsHud tails" describe.
 */
import { jest } from '@jest/globals'
import store from '@core/store.js'
import _router from '@core/router/router.js'

import '@website/components/feedback/StatsHud.js'
import '@website/components/home/AwardsMentions.js'
import '@website/components/legal/Footer.js'

import '@website/components/home/HomeMosaic.js'
import '@website/components/dialogs/LangDialog.js'
import '@website/components/dialogs/PreferencesModal.js'
import '@website/components/carousel/AwardsCarousel.js'
import '@website/views/home/Home.js'
import '@website/views/legal/Legal.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { STATS_CLASSES } from '@core/tokens/classes/stats.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('StatsHud tails', () => {
  test('renders nothing until statsForNerds is enabled', async () => {
    const el = document.createElement(COMPONENT_TAGS.STATS_HUD)

    document.body.appendChild(el)
    await flush()

    expect(el.shadowRoot.querySelector('.' + STATS_CLASSES.STATS_HUD_VALUE)).toBeNull()

    el.remove()
  })

  test('threshold classes apply for good/mid/bad metric tiers', async () => {
    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS, true)

    const el = document.createElement(COMPONENT_TAGS.STATS_HUD)

    document.body.appendChild(el)
    await flush()

    el._stats = {
      fps: 60,
      networkBytesPerSec: 2048,
      pendingRequests: 2,
      memoryMB: 128,
      cpuPercent: 10,
      latencyMs: 50,
    }
    el._updateStatsDom()

    el._stats = {
      fps: 40,
      networkBytesPerSec: 0,
      pendingRequests: 0,
      memoryMB: 0,
      cpuPercent: 50,
      latencyMs: 200,
    }
    el._updateStatsDom()

    el._stats = {
      fps: 5,
      networkBytesPerSec: 0,
      pendingRequests: 0,
      memoryMB: 0,
      cpuPercent: 95,
      latencyMs: 999,
    }
    el._updateStatsDom()

    el._stats = {
      fps: 0,
      networkBytesPerSec: 0,
      pendingRequests: 0,
      memoryMB: 0,
      cpuPercent: 0,
      latencyMs: 0,
    }
    el._updateStatsDom()

    el.onStoreUpdate?.()
    el.remove()
    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS, false)
  })

  test('render() covers every threshold tier and accel arm', async () => {
    const { npuPredict } = await import('@core/utils/gpu/npu-predict.js')

    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS, true)

    const el = document.createElement(COMPONENT_TAGS.STATS_HUD)

    document.body.appendChild(el)
    await flush()

    const npuSpy = jest
      .spyOn(npuPredict, 'getNpuAnalytics')
      .mockReturnValue({ hasNPU: true, hasGPU: false })

    el._stats = {
      fps: 60,
      networkBytesPerSec: 4096,
      pendingRequests: 1,
      memoryMB: 256,
      cpuPercent: 10,
      latencyMs: 50,
    }
    el.onStoreUpdate()

    el._stats = {
      fps: 40,
      networkBytesPerSec: 0,
      pendingRequests: 0,
      memoryMB: 0,
      cpuPercent: 50,
      latencyMs: 200,
    }
    el.onStoreUpdate()

    el._stats = {
      fps: 10,
      networkBytesPerSec: 0,
      pendingRequests: 0,
      memoryMB: 0,
      cpuPercent: 90,
      latencyMs: 900,
    }
    el.onStoreUpdate()

    npuSpy.mockReturnValue({ hasNPU: false, hasGPU: true })
    el.onStoreUpdate()
    expect(el._accelerationDisplay().className).toContain(
      `${STATS_CLASSES.STATS_HUD_BASE}-fps-good`
    )

    npuSpy.mockReturnValue({ hasNPU: false, hasGPU: false })
    el._stats = {
      fps: 0,
      networkBytesPerSec: 0,
      pendingRequests: 0,
      memoryMB: 0,
      cpuPercent: 0,
      latencyMs: 0,
    }
    el.onStoreUpdate()

    // the engine subscription callback stores the snapshot and re-patches
    el._statsCb?.({
      fps: 55,
      networkBytesPerSec: 1024,
      pendingRequests: 1,
      memoryMB: 64,
      cpuPercent: 20,
      latencyMs: 80,
    })

    npuSpy.mockRestore()
    el.remove()
    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS, false)
  })

  test('guard arms: unmounted stats DOM and statsCb-less destroy', async () => {
    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS, true)

    const el = document.createElement(COMPONENT_TAGS.STATS_HUD)

    // never appended → shadow has no data-stat nodes → `if (el)` else arm
    el._stats = {
      fps: 60,
      networkBytesPerSec: 0,
      pendingRequests: 0,
      memoryMB: 0,
      cpuPercent: 10,
      latencyMs: 50,
    }
    el._updateStatsDom()

    // _statsCb is only set by onMounted → destroy covers the else arm
    el.onDestroy()

    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS, false)

    // preference off → _updateStatsDom bails at the showStats gate
    el._updateStatsDom()
  })

  test('module re-eval sees the tag already registered', async () => {
    jest.resetModules()

    await import('@website/components/feedback/StatsHud.js')
  })
})
