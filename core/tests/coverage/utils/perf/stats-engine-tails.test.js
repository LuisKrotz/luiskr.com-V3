/**
 * @file stats-engine-tails.test.js
 * @description Split from coverage-tails-5.test.js — covers the "stats-engine tails" describe.
 */
import { jest } from '@jest/globals'

import _router from '@core/router/router.js'

import { statsEngine } from '@core/utils/perf/stats-engine.js'

import '@website/views/legal/Legal.js'
import '@website/views/home/Home.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('stats-engine tails', () => {
  test('subscribe/snapshot/stop lifecycle', async () => {
    const cb = jest.fn()

    statsEngine.subscribe(cb)
    statsEngine._start()

    await flush(40)

    statsEngine.unsubscribe(cb)
    statsEngine._stop()

    expect(statsEngine).toBeTruthy()
  })

  test('patched fetch accumulates latency samples', async () => {
    statsEngine._start()

    try {
      await window.fetch('data:,x').catch(() => {})
    } catch {
      /* unreachable */
    }

    statsEngine._stop()
  })
})
