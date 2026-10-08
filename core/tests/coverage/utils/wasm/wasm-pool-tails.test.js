/**
 * @file wasm-pool-tails.test.js
 * @description Split from coverage-tails-4.test.js — covers the "wasm-pool tails" describe.
 */
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

describe('wasm-pool tails', () => {
  test('handleMessage ignores unknown ids and init tolerates worker failure', () => {
    wasmPool.handleMessage?.({ data: { id: 'nope-xyz' } })

    const WorkerSaved = globalThis.Worker

    globalThis.Worker = class {
      constructor() {
        throw new Error(TEST_TEXT.SECOND)
      }
    }
    wasmPool.init?.()
    globalThis.Worker = WorkerSaved
  })
})
