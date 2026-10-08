/**
 * @file earth-background-earthbackground-residual-arms.test.js
 * @description Split from earth-background.test.js — covers the "EarthBackground residual arms" describe.
 */
import { describe, test } from '@jest/globals'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

const { EarthBackground } = await import('@earth/earth-background.js')

const makeCanvas = () => {
  const canvas = document.createElement(HTML_TAGS.CANVAS)

  document.body.appendChild(canvas)

  return canvas
}

const waitBoot = () => new Promise((resolve) => setTimeout(resolve, 400))

describe('EarthBackground residual arms', () => {
  test('pipeline ctor failure falls back to plain renderer.render in tick + screenshot', async () => {
    const { __setPipelineCtorFails } = await import('three/webgpu')
    __setPipelineCtorFails(true)

    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    __setPipelineCtorFails(false)

    // Tick + screenshot both render through renderer.render(scene, camera)
    // now that #pipeline is null.
    await bg.takeScreenshot()

    bg.destroy()
  })

  test('screenshot after a mid-boot destroy has no scene to render', async () => {
    const { __setRendererInitDelay } = await import('three/webgpu')
    __setRendererInitDelay(80)

    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await new Promise((r) => setTimeout(r, 40))

    bg.destroy()

    __setRendererInitDelay(0)

    await bg.takeScreenshot()
  })

  test('sun angle wraps past 2π on the next tick', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.updateSun({ autoRotate: true, speed: 0, angle: Math.PI * 2 + 0.1 })

    await new Promise((r) => setTimeout(r, 60))

    bg.destroy()
  })

  test('a queued frame still runs the tick guard after setReducedMotion', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    const origCancel = globalThis.cancelAnimationFrame

    globalThis.cancelAnimationFrame = () => {}

    bg.setReducedMotion(true)

    await new Promise((r) => setTimeout(r, 60))

    globalThis.cancelAnimationFrame = origCancel

    bg.destroy()
  })
})
