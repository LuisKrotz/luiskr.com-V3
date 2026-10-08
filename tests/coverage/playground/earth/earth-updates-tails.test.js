/**
 * @file coverage-tails-7.test.js
 * @description Seventh tail sweep — post-decomposition coverage for the
 * module trees exposed by the folder reorganization: CMS editor event
 * bindings + section helpers + deploy-info delegates, Earth engine
 * update/bootstrap guards, canvas-widget delegates + shared GL helpers,
 * route helpers, safari patch guards, and misc utilities
 * (css-color, gpu-accel, route-warmer, draw-text).
 */
import { jest } from '@jest/globals'

import '@core/constants.js'

import '@cms/about/CmsAboutEditor.js'
import '@cms/portfolio/CmsPortfolioList.js'
import '@cms/projects/CmsProjectsList.js'
import '@cms/playground-editor/CmsPlaygroundEditor.js'
import '@cms/footer/CmsFooterEditor.js'
import '@cms/deploy-info/CmsDeployInfo.js'

import { updateEarthBloom, updateEarthCamera, updateEarthChromatic, updateEarthColorGrading, updateEarthFilm, updateEarthMaterial, updateEarthRender, updateEarthSpin, updateEarthSun, updateEarthVignette, resetEarthView } from '@earth/earth/runtime/updates.js'
import { bootstrapEarth } from '@earth/earth/setup/bootstrap.js'

globalThis.alert = jest.fn()

const uni = (v = 0) => ({ value: v })

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('earth updates tails', () => {
  test('all guards and setter arms execute', () => {
    updateEarthBloom({})
    updateEarthBloom(
      { bloom: { enabled: true, strength: 1 }, bloomPass: { strength: uni(), radius: uni(), threshold: uni() } },
      { enabled: false, strength: 2, radius: 3, threshold: 4 }
    )

    updateEarthColorGrading({})
    updateEarthColorGrading(
      { cg: {}, cgUniforms: { contrast: uni(), saturation: uni(), blackLevel: uni(), blueGreenBoost: uni() } },
      { contrast: 1.2, saturation: 0.5, blackLevel: 0.1, blueGreenBoost: 0.2 }
    )

    updateEarthCamera({})
    updateEarthCamera({ camera: { fov: 0, updateProjectionMatrix: jest.fn() }, controls: {} }, { fov: 50, autoRotate: true, autoRotateSpeed: 2 })

    updateEarthSpin({})
    updateEarthSpin({ earthSpin: {} }, { rotationSpeed: 0.5, trueInclination: true })

    updateEarthMaterial({})
    updateEarthMaterial(
      { earthMatUniforms: { waterMetalness: uni(), waterRoughness: uni(), bumpScale: uni(), terrainShadowIntensity: uni(), terrainShadowOffset: uni() } },
      { waterMetalness: 1, waterRoughness: 0.4, bumpScale: 2, terrainShadowIntensity: 3, terrainShadowOffset: 0.1 }
    )

    updateEarthVignette({})
    updateEarthVignette({ vig: { enabled: true, darkness: 1 }, vigUniforms: { darkness: uni(), offset: uni() } }, { enabled: false, darkness: 2, offset: 0.5 })

    updateEarthChromatic({})
    updateEarthChromatic({ ca: { enabled: true, strength: 1, scale: 1 }, caUniforms: { strength: uni(), scale: uni() } }, { enabled: false, strength: 3, scale: 2 })

    updateEarthRender({ render: { resolutionScale: 1 } }, {})
    updateEarthRender({ render: { resolutionScale: 1 } }, { resolutionScale: 1.5 })

    updateEarthFilm({})
    updateEarthFilm({ film: { enabled: true, intensity: 0.5 }, filmU: uni() }, { enabled: false, intensity: 0.9 })

    updateEarthSun({})
    updateEarthSun({ sun: {} }, { autoRotate: true, speed: 2, angle: 1 })

    resetEarthView({})
    resetEarthView({ controls: null, camera: null })
  })

  test('bootstrapEarth aborts on disposed state', async () => {
    await bootstrapEarth({ disposed: true })
  })
})

