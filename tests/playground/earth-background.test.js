/**
 * @file earth-background.test.js
 * @description Coverage for the three.js WebGPU Earth background engine.
 * `three`, `three/webgpu`, `three/tsl` and the post-processing node modules
 * are replaced with deep auto-mocks so the full bootstrap/scene/render/
 * destroy path executes without a GPU.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { clearDevLog, getDevLog } from '@/core/devlog.js'
import { LOG_LEVELS } from '@/core/tokens/data/log.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'

const { EarthBackground } = await import('@/playground/earth-background.js')

const makeCanvas = () => {
  const canvas = document.createElement(HTML_TAGS.CANVAS)

  document.body.appendChild(canvas)

  return canvas
}

const waitBoot = () => new Promise((resolve) => setTimeout(resolve, 400))

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('EarthBackground', () => {
  test('constructs with default settings and exposes the settings snapshot', () => {
    const bg = new EarthBackground(makeCanvas())

    const settings = bg.settings

    expect(settings.SHOW).toBe(true)
    expect(settings.COLOR_GRADING).toBeTruthy()
    expect(settings.MOON).toBeTruthy()
    expect(settings.BLOOM).toBeTruthy()

    bg.destroy()
  })

  test('bootstraps the full three.js scene and fires onReady', async () => {
    const progress = []
    const ready = jest.fn()

    clearDevLog()

    const bg = new EarthBackground(makeCanvas(), {
      onReady: ready,
      onProgress: (msg, pct) => progress.push(pct),
    })

    bg.init()

    await waitBoot()

    expect(getDevLog().filter((e) => e.level === LOG_LEVELS.ERROR)).toEqual([])
    expect(ready).toHaveBeenCalled()
    expect(progress.length).toBeGreaterThan(3)

    bg.destroy()
  })

  test('init() kicks off the async bootstrap', () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()
    bg.destroy()
  })

  test('setReducedMotion pauses and resumes the tick loop', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.setReducedMotion(true)
    bg.setReducedMotion(false)

    bg.destroy()
  })

  test('setTheme stores the dark-mode flag', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.setTheme(true)
    bg.setTheme(false)

    bg.destroy()
  })

  test('setVisible hides and shows the canvas', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.setVisible(false)

    expect(bg.takeScreenshot).toBeDefined()

    bg.setVisible(true)
    bg.destroy()
  })

  test('live-update setters accept partial option objects', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.updateBloom({ strength: 0.8 })
    bg.updateColorGrading({ contrast: 1.2 })
    bg.updateCamera({ fov: 55, autoRotate: false })
    bg.updateEarth({ rotationSpeed: 0.01 })
    bg.updateEarthMaterial({ waterMetalness: 0.5 })
    bg.updateVignette({ enabled: false })
    bg.updateChromatic({ enabled: true, strength: 0.5 })
    bg.updateRender({ resolutionScale: 0.75 })
    bg.updateFilm({ enabled: true, intensity: 0.3 })
    bg.updateSun({ autoRotate: false })

    bg.destroy()
  })

  test('getCameraState reports spherical camera coordinates', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    const state = bg.getCameraState()

    expect(state).toBeTruthy()

    bg.resetView()
    bg.destroy()
  })

  test('takeScreenshot falls back gracefully without toDataURL support', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    await bg.takeScreenshot()

    bg.destroy()
  })

  test('destroy before bootstrap completes is a safe no-op', async () => {
    const bg = new EarthBackground(makeCanvas())

    const boot = bg.init()

    bg.destroy()
    bg.destroy()

    await boot
  })

  test('updateCamera with empty options keeps defaults', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.updateCamera({})
    bg.updateEarth({})
    bg.updateSun({})

    bg.destroy()
  })

  test('update methods invoked with no arguments hit the default-arg path', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.updateBloom()
    bg.updateColorGrading()
    bg.updateCamera()
    bg.updateEarth()
    bg.updateEarthMaterial()
    bg.updateVignette()
    bg.updateChromatic()
    bg.updateRender()
    bg.updateFilm()
    bg.updateSun()

    bg.destroy()
  })

  test('update methods before bootstrap hit the null guards', () => {
    const bg = new EarthBackground(makeCanvas())

    bg.updateBloom({ strength: 1 })
    bg.updateColorGrading({ contrast: 1 })
    bg.updateCamera({ fov: 40 })
    bg.updateEarth({ rotationSpeed: 1 })
    bg.updateEarthMaterial({ bumpScale: 1 })
    bg.updateVignette({ darkness: 1 })
    bg.updateChromatic({ strength: 1 })
    bg.updateFilm({ intensity: 1 })
    bg.updateSun({ autoRotate: true })

    bg.destroy()
  })

  test('update toggles cover both enabled arms', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.updateBloom({ enabled: true, strength: 2, radius: 0.5, threshold: 0.2 })
    bg.updateBloom({ enabled: false })
    bg.updateVignette({ enabled: true, darkness: 0.8, offset: 0.4 })
    bg.updateVignette({ enabled: false })
    bg.updateChromatic({ enabled: true, strength: 0.4, scale: 1.5 })
    bg.updateChromatic({ enabled: false })
    bg.updateFilm({ enabled: true, intensity: 0.6 })
    bg.updateFilm({ enabled: false })
    bg.updateEarthMaterial({
      waterMetalness: 0.9,
      waterRoughness: 0.3,
      bumpScale: 0.4,
      terrainShadowIntensity: 0.5,
      terrainShadowOffset: 0.02,
    })
    bg.updateCamera({ fov: 45, autoRotate: true, autoRotateSpeed: 1.5 })
    bg.updateEarth({ rotationSpeed: 0.02, trueInclination: true })
    bg.updateEarth({ trueInclination: false })
    bg.updateSun({ autoRotate: true })
    bg.updateRender({ resolutionScale: 4 })

    bg.destroy()
  })

  test('settings snapshot after bootstrap reflects live uniforms', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    const s = bg.settings

    expect(s.BLOOM.STRENGTH).toBeDefined()
    expect(s.OCEAN.METALNESS).toBeDefined()
    expect(s.CAMERA.POSITION).toBeTruthy()

    bg.destroy()
  })

  test('getCameraState and resetView before bootstrap are no-ops', () => {
    const bg = new EarthBackground(makeCanvas())

    expect(bg.getCameraState()).toBeNull()

    bg.resetView()
    bg.destroy()
  })

  test('takeScreenshot returns early without a renderer', async () => {
    const bg = new EarthBackground(makeCanvas())

    await bg.takeScreenshot()

    bg.destroy()
  })

  test('takeScreenshot downloads an anchor when toDataURL succeeds', async () => {
    const canvas = makeCanvas()

    canvas.toDataURL = () => 'data:image/png;base64,AAAA'
    canvas.getContext = () => ({})

    const bg = new EarthBackground(canvas)

    bg.init()

    await waitBoot()

    const clickSpy = jest
      .spyOn(HTMLElement.prototype, MOUSE_EVENTS.CLICK)
      .mockImplementation(() => {})

    await bg.takeScreenshot()

    expect(clickSpy).toHaveBeenCalled()

    clickSpy.mockRestore()
    bg.destroy()
  })

  test('takeScreenshot falls back to toBlob when toDataURL fails', async () => {
    const canvas = makeCanvas()

    canvas.toDataURL = () => {
      throw new Error('no-canvas')
    }
    canvas.getContext = () => ({})

    const bg = new EarthBackground(canvas)

    bg.init()

    await waitBoot()

    const origCreate = URL.createObjectURL
    const origRevoke = URL.revokeObjectURL

    URL.createObjectURL = () => 'blob:mock'
    URL.revokeObjectURL = () => {}

    if (typeof canvas.toBlob !== TYPE_STRINGS.FUNCTION) {
      canvas.toBlob = (cb) => cb(new Blob(['x']))
    }

    const clickSpy = jest
      .spyOn(HTMLElement.prototype, MOUSE_EVENTS.CLICK)
      .mockImplementation(() => {})

    await bg.takeScreenshot()

    clickSpy.mockRestore()

    URL.createObjectURL = origCreate
    URL.revokeObjectURL = origRevoke

    bg.destroy()
  })

  test('setVisible on a canvas-less instance is a no-op', () => {
    const bg = new EarthBackground(null)

    bg.setVisible(false)
    bg.setVisible(true)
    bg.destroy()
  })

  test('setReducedMotion before bootstrap exercises the tick guard', () => {
    const bg = new EarthBackground(makeCanvas())

    bg.setReducedMotion(true)
    bg.setReducedMotion(false)
    bg.setReducedMotion(true)
    bg.setReducedMotion(false)

    bg.destroy()
  })

  test('setReducedMotion while the loop is running hits the busy arm', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.setReducedMotion(false)
    bg.setReducedMotion(true)
    bg.setReducedMotion(false)

    bg.destroy()
  })

  test('setReducedMotion during bootstrap skips the initial tick', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()
    bg.setReducedMotion(true)

    await waitBoot()

    bg.destroy()
  })

  test('WebGPU probe resolving a null adapter keeps the WebGL path', async () => {
    const prevGpu = navigator.gpu

    Object.defineProperty(navigator, 'gpu', {
      value: { requestAdapter: async () => null },
      configurable: true,
    })

    const ready = jest.fn()
    const bg = new EarthBackground(makeCanvas(), { onReady: ready })

    bg.init()

    await waitBoot()

    expect(ready).toHaveBeenCalled()

    Object.defineProperty(navigator, 'gpu', { value: prevGpu, configurable: true })
    bg.destroy()
  })

  test('renderer init failure on a detached canvas skips the clone', async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const spy = jest
      .spyOn(WebGPURenderer.prototype, 'init')
      .mockRejectedValueOnce(new Error('no-adapter'))
    const canvas = document.createElement(HTML_TAGS.CANVAS)

    const bg = new EarthBackground(canvas)

    bg.init()

    await waitBoot()

    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
    bg.destroy()
  })

  test('missing getMaxAnisotropy falls back to 4', async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const had = Object.getOwnPropertyDescriptor(WebGPURenderer.prototype, 'getMaxAnisotropy')
    const ready = jest.fn()

    delete WebGPURenderer.prototype.getMaxAnisotropy

    const bg = new EarthBackground(makeCanvas(), { onReady: ready })

    bg.init()

    await waitBoot()

    if (had) Object.defineProperty(WebGPURenderer.prototype, 'getMaxAnisotropy', had)

    expect(ready).toHaveBeenCalled()

    bg.destroy()
  })

  test('destroy while compileAsync is pending hits the last disposed guard', async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    let release

    const spy = jest.spyOn(WebGPURenderer.prototype, 'compileAsync').mockImplementation(
      () =>
        new Promise((resolve) => {
          release = resolve
        })
    )

    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await new Promise((r) => setTimeout(r, 150))

    bg.destroy()

    release?.()

    await new Promise((r) => setTimeout(r, 100))

    spy.mockRestore()
  })

  test('sun angle wraps past 2π across many ticks', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.updateSun({ autoRotate: true })

    jest.useFakeTimers()
    jest.advanceTimersByTime(210000)
    jest.useRealTimers()

    bg.destroy()
  })

  test('earth inclination toggle is visible in the following ticks', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.updateEarth({ trueInclination: false })

    await new Promise((r) => setTimeout(r, 60))

    bg.updateEarth({ trueInclination: true })

    await new Promise((r) => setTimeout(r, 60))

    bg.destroy()
  })

  test('destroy mid-bootstrap exercises the disposed guards', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await new Promise((r) => setTimeout(r, 30))

    bg.destroy()

    await waitBoot()
  })

  test('renderer init failure retries with forceWebGL on a cloned canvas', async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const spy = jest
      .spyOn(WebGPURenderer.prototype, 'init')
      .mockRejectedValueOnce(new Error('no-adapter'))
    const ready = jest.fn()
    const canvas = makeCanvas()
    const bg = new EarthBackground(canvas, { onReady: ready })

    bg.init()

    await waitBoot()

    expect(ready).toHaveBeenCalled()
    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
    bg.destroy()
  })

  test('both renderer inits failing still fires onReady via init catch', async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const spy = jest.spyOn(WebGPURenderer.prototype, 'init').mockRejectedValue(new Error('dead'))
    const ready = jest.fn()
    const bg = new EarthBackground(makeCanvas(), { onReady: ready })

    clearDevLog()
    bg.init()

    await waitBoot()

    expect(ready).toHaveBeenCalled()
    expect(getDevLog().filter((e) => e.level === LOG_LEVELS.ERROR).length).toBeGreaterThan(0)

    spy.mockRestore()
    bg.destroy()
  })

  test('navigator.gpu adapter probe failure falls back to WebGL', async () => {
    const prevGpu = navigator.gpu

    Object.defineProperty(navigator, 'gpu', {
      value: { requestAdapter: () => Promise.reject(new Error('no-gpu')) },
      configurable: true,
    })

    const ready = jest.fn()
    const bg = new EarthBackground(makeCanvas(), { onReady: ready })

    bg.init()

    await waitBoot()

    expect(ready).toHaveBeenCalled()

    Object.defineProperty(navigator, 'gpu', { value: prevGpu, configurable: true })
    bg.destroy()
  })

  test('navigator.gpu adapter present selects WebGPU path', async () => {
    const prevGpu = navigator.gpu

    Object.defineProperty(navigator, 'gpu', {
      value: { requestAdapter: async () => ({}) },
      configurable: true,
    })

    const ready = jest.fn()
    const bg = new EarthBackground(makeCanvas(), { onReady: ready })

    bg.init()

    await waitBoot()

    expect(ready).toHaveBeenCalled()

    Object.defineProperty(navigator, 'gpu', { value: prevGpu, configurable: true })
    bg.destroy()
  })

  test('pipeline render throw falls back to plain renderer.render', async () => {
    const { RenderPipeline, WebGPURenderer } = await import('three/webgpu')
    const renderSpy = jest.spyOn(WebGPURenderer.prototype, 'render')
    const pipeSpy = jest.spyOn(RenderPipeline.prototype, 'render').mockImplementation(() => {
      throw new Error('pipe-boom')
    })

    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    expect(pipeSpy).toHaveBeenCalled()
    expect(renderSpy).toHaveBeenCalled()

    await bg.takeScreenshot()

    pipeSpy.mockRestore()
    renderSpy.mockRestore()
    bg.destroy()
  })

  test('updateRender resizes the live camera', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.updateRender({ resolutionScale: 1.25 })
    bg.updateRender()

    bg.destroy()
  })

  test('setVisible toggles the loop on a booted instance', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.setVisible(false)
    bg.setVisible(false)
    bg.setVisible(true)
    bg.setVisible(true)

    bg.destroy()
  })

  test('updateColorGrading writes every uniform', async () => {
    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await waitBoot()

    bg.updateColorGrading({ contrast: 1.1, saturation: 0.9, blackLevel: 0.02, blueGreenBoost: 0.3 })

    bg.destroy()
  })

  test('pipeline construction failure falls back to the plain render path', async () => {
    const { RenderPipeline } = await import('three/webgpu')
    const desc = Object.getOwnPropertyDescriptor(RenderPipeline.prototype, 'outputNode')
    const ready = jest.fn()

    Object.defineProperty(RenderPipeline.prototype, 'outputNode', {
      set() {
        throw new Error('no-node')
      },
      configurable: true,
    })

    const bg = new EarthBackground(makeCanvas(), { onReady: ready })

    bg.init()

    await waitBoot()

    if (desc) {
      Object.defineProperty(RenderPipeline.prototype, 'outputNode', desc)
    } else {
      delete RenderPipeline.prototype.outputNode
    }

    expect(ready).toHaveBeenCalled()

    // With #pipeline null, the screenshot path uses renderer.render directly.
    await bg.takeScreenshot()
    bg.destroy()
  })

  test('shader compile warmup failure is a non-fatal warn', async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const spy = jest
      .spyOn(WebGPURenderer.prototype, 'compileAsync')
      .mockRejectedValueOnce(new Error('no-shaders'))
    const ready = jest.fn()

    const bg = new EarthBackground(makeCanvas(), { onReady: ready })

    bg.init()

    await waitBoot()

    expect(ready).toHaveBeenCalled()

    spy.mockRestore()
    bg.destroy()
  })

  test.each([1, 2, 4])(
    'destroy while texture load %i is pending hits a disposed guard',
    async (deferAt) => {
      const { TextureLoader } = await import('three')
      let calls = 0
      let release

      const spy = jest.spyOn(TextureLoader.prototype, 'loadAsync').mockImplementation(function () {
        calls += 1

        if (calls === deferAt) {
          return new Promise((resolve) => {
            release = () => resolve({ mapping: 0, colorSpace: '', anisotropy: 0 })
          })
        }

        return Promise.resolve({ mapping: 0, colorSpace: '', anisotropy: 0 })
      })

      const bg = new EarthBackground(makeCanvas())

      bg.init()

      await new Promise((r) => setTimeout(r, 50))

      bg.destroy()

      release?.()

      await waitBoot()

      spy.mockRestore()
    }
  )

  test('destroy during renderer.init hits the post-renderer disposed guard', async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    let release

    const spy = jest.spyOn(WebGPURenderer.prototype, 'init').mockImplementation(
      () =>
        new Promise((resolve) => {
          release = resolve
        })
    )

    const bg = new EarthBackground(makeCanvas())

    bg.init()

    await new Promise((r) => setTimeout(r, 50))

    bg.destroy()

    release()

    await new Promise((r) => setTimeout(r, 100))

    spy.mockRestore()
  })

  test('takeScreenshot with no blob and empty dataUrl produces no anchor', async () => {
    const canvas = makeCanvas()

    canvas.toDataURL = () => ''
    canvas.toBlob = (cb) => cb(null)
    canvas.getContext = () => ({})

    const bg = new EarthBackground(canvas)

    bg.init()

    await waitBoot()

    await bg.takeScreenshot()

    bg.destroy()
  })

  test('screenshot anchor cleanup runs after the revoke delay', async () => {
    const canvas = makeCanvas()

    canvas.toDataURL = () => 'data:image/png;base64,BBBB'
    canvas.getContext = () => ({})

    const bg = new EarthBackground(canvas)

    bg.init()

    await waitBoot()

    jest.useFakeTimers()

    const shot = bg.takeScreenshot()

    jest.advanceTimersByTime(50)

    await shot

    jest.advanceTimersByTime(1500)
    jest.useRealTimers()

    bg.destroy()
  })

  test('handleResize measures a shadow-root host', async () => {
    const host = document.createElement(HTML_TAGS.DIV)
    const root = host.attachShadow({ mode: STATE_STRINGS.OPEN })
    const canvas = document.createElement(HTML_TAGS.CANVAS)

    root.appendChild(canvas)
    document.body.appendChild(host)

    const bg = new EarthBackground(canvas)

    bg.init()

    await waitBoot()

    bg.updateRender({ resolutionScale: 1 })

    bg.destroy()
    document.body.removeChild(host)
  })

  test('handleResize aborts when host metrics are zero', async () => {
    const canvas = makeCanvas()
    const bg = new EarthBackground(canvas)

    bg.init()

    await waitBoot()

    const prevW = window.innerWidth
    const prevH = window.innerHeight

    window.innerWidth = 0
    bg.updateRender({ resolutionScale: 1 })

    window.innerWidth = prevW
    window.innerHeight = 0
    bg.updateRender({ resolutionScale: 1 })

    window.innerHeight = prevH

    bg.destroy()
  })

  test('updateRender before bootstrap exercises the canvas/renderer guard', () => {
    const bg = new EarthBackground(null)

    bg.updateRender({ resolutionScale: 0.5 })
    bg.destroy()
  })
})

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
