/**
 * @file safari-patch-safari-patch-module-level-side-effects.test.js
 * @description Split from safari-patch.test.js — covers the "safari-patch — module-level side effects" describe.
 */
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import '@website/components/carousel/CustomCarousel.js'
import '@website/components/media/MediaFigure.js'
import '@website/components/media/MediaExpanded.js'
import '@website/views/project/Project.js'
import store from '@core/store.js'
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { localMediaCache } from '@core/utils/media/local-media-cache.js'
import { wasmMediaThreads } from '@core/utils/wasm/wasm-media-threads.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'

// The patch registers whenDefined() callbacks at module-eval — the component
// imports above ensure the tags already resolve when it installs.
beforeAll(async () => {
  await import('@core/safari/patch.js')
  await new Promise((resolve) => setTimeout(resolve, 20))
})

afterAll(() => {
  document.documentElement.classList.remove(STATE_CLASSES.IS_SAFARI)
})

const _cls = (tag) => customElements.get(tag)

const _tick = () => new Promise((resolve) => setTimeout(resolve, 20))

// Bound after each module-registry reset so commits always reach the store
// instance the currently-installed prototype patches close over.
let _activeStore = store

describe('safari-patch — module-level side effects', () => {
  test('marks documentElement with the is-safari class', () => {
    expect(document.documentElement.classList.contains(STATE_CLASSES.IS_SAFARI)).toBe(true)
  })

  test('neuters every gpuAccel method', () => {
    for (const method of [
      'accelerateElementGPU',
      'processTextureGPU',
      'processImageGPU',
      'processBitmapGPU',
      'processVideoGPU',
    ]) {
      expect(gpuAccel[method]()).toBeUndefined()
    }
  })

  test('wasmPool.dispatch resolves null', async () => {
    await expect(wasmPool.dispatch('x', {})).resolves.toBeNull()
  })

  test('localMediaCache passthroughs resolve without caching', async () => {
    await expect(localMediaCache.fetchOrGetLocalMedia('u')).resolves.toBe('u')
    await expect(localMediaCache.getLocalMedia('u')).resolves.toBeNull()
    await expect(localMediaCache.storeLocalMedia('u')).resolves.toBe('u')
  })

  test('wasmMediaThreads.decodeMediaInSeparateThread resolves null', async () => {
    await expect(wasmMediaThreads.decodeMediaInSeparateThread('u')).resolves.toBeNull()
  })
})
