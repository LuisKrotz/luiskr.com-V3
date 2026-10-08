/**
 * @file route-warmer-tails.test.js
 * @description Split from coverage-tails-7.test.js — covers the "route-warmer tails" describe.
 */
import { jest } from '@jest/globals'

import '@core/constants.js'

import '@cms/about/CmsAboutEditor.js'
import '@cms/portfolio/CmsPortfolioList.js'
import '@cms/projects/CmsProjectsList.js'
import '@cms/playground-editor/CmsPlaygroundEditor.js'
import '@cms/footer/CmsFooterEditor.js'
import '@cms/deploy-info/CmsDeployInfo.js'

globalThis.alert = jest.fn()

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// Route chunks resolve to trivial stubs — the real route trees are far too
// heavy to import inside a coverage run (each pulls in the whole component
// graph). Coverage counts the thunk *invocation*, not the resolved module.
for (const route of [
  'views/home/Home',
  'views/project/Project',
  'views/legal/Legal',
  'views/not-found/NotFound',
]) {
  jest.unstable_mockModule(`@website/${route}.js`, () => ({ default: class {} }))
}

describe('route-warmer tails', () => {
  test('stop + idle-fallback + bounds arms', async () => {
    jest.resetModules()

    const origIdle = window.requestIdleCallback

    delete window.requestIdleCallback

    const rw = await import('@core/utils/motion/route-warmer.js')

    rw.stopRouteWarming()
    rw.startRouteWarming()
    await flush(10)

    // re-arm with requestIdleCallback present
    jest.resetModules()

    window.requestIdleCallback = (cb) => {
      cb()
      return 1
    }

    const rw2 = await import('@core/utils/motion/route-warmer.js')

    rw2.startRouteWarming()
    rw2.stopRouteWarming()

    if (origIdle) window.requestIdleCallback = origIdle
    else delete window.requestIdleCallback
  })

  test('full chain drain covers every chunk thunk + post-stop scheduled arm', async () => {
    jest.resetModules()

    const cbs = []
    const origIdle = window.requestIdleCallback

    window.requestIdleCallback = (cb) => {
      cbs.push(cb)

      return 1
    }

    const rw = await import('@core/utils/motion/route-warmer.js')

    rw.startRouteWarming()
    rw.startRouteWarming() // _started guard arm

    // Drain: run every queued idle callback, then flush so each chunk's
    // .finally() can schedule the next hop. Repeats until the chain
    // exhausts ROUTE_CHUNKS (index >= length arm) — or 40 hops max.
    const ran = []

    for (let i = 0; i < 40 && cbs.length; i++) {
      const batch = cbs.splice(0)

      for (const cb of batch) {
        ran.push(cb)
        cb()
      }

      await flush(10)
    }

    rw.stopRouteWarming()

    // Replaying a chunk callback post-stop hits the `_stopped` return arm.
    ran.at(-1)?.()

    if (origIdle) window.requestIdleCallback = origIdle
    else delete window.requestIdleCallback
  })
})
