/**
 * @file earth/updates.ts
 * @description Live-tweak API for the Earth engine, extracted from
 * earth-background.ts. Every update* writes both the settings bag (so the
 * settings snapshot stays truthful) and the backing uniform/renderer —
 * enabled flags collapse their term to 0 rather than rebuilding the
 * shader graph, so toggling is free.
 */
import { DEFAULT_SP_GUI } from '@/core/tokens/playground.js'
import { handleEarthResize } from './frame.js'
import type { EarthState } from './state.js'

/**
 * Live-tweak bloom. `enabled` collapses strength to 0 rather than
 * removing the pass — the node graph stays compiled, so toggling is
 * free (no shader rebuild).
 */
export const updateEarthBloom = (
  s: EarthState,
  {
    strength,
    radius,
    threshold,
    enabled,
  }: { enabled?: boolean; strength?: number; radius?: number; threshold?: number } = {}
): void => {
  if (!s.bloom || !s.bloomPass) return

  if (enabled !== undefined) s.bloom.enabled = enabled
  if (strength !== undefined) s.bloom.strength = strength

  s.bloomPass.strength.value = s.bloom.enabled ? s.bloom.strength : 0

  if (radius !== undefined) s.bloomPass.radius.value = radius
  if (threshold !== undefined) s.bloomPass.threshold.value = threshold
}

/**
 * Live-tweak the color-grade node. Every arg mirrors straight into a TSL
 * uniform; see makePostNodes for the per-term math.
 *   contrast      - multiplier around mid-grey (1 = neutral)
 *   saturation    - lerp weight between luma and color
 *   blackLevel    - floor subtracted before output
 *   blueGreenBoost - extra gain on G+B channels
 */
export const updateEarthColorGrading = (
  s: EarthState,
  {
    contrast,
    saturation,
    blackLevel,
    blueGreenBoost,
  }: { contrast?: number; saturation?: number; blackLevel?: number; blueGreenBoost?: number } = {}
): void => {
  if (!s.cgUniforms || !s.cg) return

  if (contrast !== undefined) {
    s.cg.contrast = contrast
    s.cgUniforms.contrast.value = contrast
  }
  if (saturation !== undefined) {
    s.cg.saturation = saturation
    s.cgUniforms.saturation.value = saturation
  }
  if (blackLevel !== undefined) {
    s.cg.blackLevel = blackLevel
    s.cgUniforms.blackLevel.value = blackLevel
  }
  if (blueGreenBoost !== undefined) {
    s.cg.blueGreenBoost = blueGreenBoost
    s.cgUniforms.blueGreenBoost.value = blueGreenBoost
  }
}

/**
 * Camera tweaks. `fov` needs updateProjectionMatrix() to rebuild the
 * frustum; orbit flags write straight into OrbitControls.
 *   fov             - vertical field of view in degrees
 *   autoRotate      - slow turntable orbit
 *   autoRotateSpeed - degrees/sec equivalent (three's scale: 2.0 ≈ 30s/rev)
 */
export const updateEarthCamera = (
  s: EarthState,
  {
    fov,
    autoRotate,
    autoRotateSpeed,
  }: { fov?: number; autoRotate?: boolean; autoRotateSpeed?: number } = {}
): void => {
  if (!s.camera || !s.controls) return

  if (fov !== undefined) {
    s.camera.fov = fov
    s.camera.updateProjectionMatrix()
  }
  if (autoRotate !== undefined) s.controls.autoRotate = autoRotate
  if (autoRotateSpeed !== undefined) s.controls.autoRotateSpeed = autoRotateSpeed
}

/**
 * Earth spin tweaks. rotationSpeed is radians/frame applied in tickEarth;
 * trueInclination toggles the fixed 23.44° axial tilt on rotation.z.
 */
export const updateEarthSpin = (
  s: EarthState,
  { rotationSpeed, trueInclination }: { rotationSpeed?: number; trueInclination?: boolean } = {}
): void => {
  if (!s.earthSpin) return

  if (rotationSpeed !== undefined) s.earthSpin.rotationSpeed = rotationSpeed
  if (trueInclination !== undefined) s.earthSpin.trueInclination = trueInclination
}

/**
 * Surface-shader uniforms: ocean PBR (specular mask drives the land/ocean
 * blend), relief bump scale, and the fake terrain self-shadowing terms
 * (see the offset-normal trick in buildEarthShells).
 *   terrainShadowOffset - UV-space offset along the sun-projected tangent
 */
export const updateEarthMaterial = (
  s: EarthState,
  {
    waterMetalness,
    waterRoughness,
    bumpScale,
    terrainShadowIntensity,
    terrainShadowOffset,
  }: {
    waterMetalness?: number
    waterRoughness?: number
    bumpScale?: number
    terrainShadowIntensity?: number
    terrainShadowOffset?: number
  } = {}
): void => {
  if (!s.earthMatUniforms) return

  if (waterMetalness !== undefined) s.earthMatUniforms.waterMetalness.value = waterMetalness
  if (waterRoughness !== undefined) s.earthMatUniforms.waterRoughness.value = waterRoughness
  if (bumpScale !== undefined) s.earthMatUniforms.bumpScale.value = bumpScale
  if (terrainShadowIntensity !== undefined)
    s.earthMatUniforms.terrainShadowIntensity.value = terrainShadowIntensity
  if (terrainShadowOffset !== undefined)
    s.earthMatUniforms.terrainShadowOffset.value = terrainShadowOffset
}

/**
 * Vignette tweaks — enabled collapses darkness to 0 (same zero-cost
 * toggle pattern as bloom).
 *   darkness - exponent + lerp weight of the falloff
 *   offset   - radial distance scale before the falloff
 */
export const updateEarthVignette = (
  s: EarthState,
  { enabled, darkness, offset }: { enabled?: boolean; darkness?: number; offset?: number } = {}
): void => {
  if (!s.vigUniforms || !s.vig) return

  if (enabled !== undefined) s.vig.enabled = enabled
  if (darkness !== undefined) s.vig.darkness = darkness
  if (offset !== undefined) s.vig.offset = offset

  s.vigUniforms.darkness.value = s.vig.enabled ? s.vig.darkness : 0

  if (offset !== undefined) s.vigUniforms.offset.value = offset
}

/**
 * Chromatic aberration tweaks — enabled collapses strength to 0.
 *   strength - fringe offset in normalized UV units
 *   scale    - radial falloff of the fringe
 */
export const updateEarthChromatic = (
  s: EarthState,
  { enabled, strength, scale }: { enabled?: boolean; strength?: number; scale?: number } = {}
): void => {
  if (!s.caUniforms || !s.ca) return

  if (enabled !== undefined) s.ca.enabled = enabled
  if (strength !== undefined) s.ca.strength = strength
  if (scale !== undefined) s.ca.scale = scale

  s.caUniforms.strength.value = s.ca.enabled ? s.ca.strength : 0

  if (scale !== undefined) s.caUniforms.scale.value = scale
}

/**
 * Resolution-scale multiplier (clamped ≤2) applied on top of
 * devicePixelRatio — the "render resolution" slider in the playground.
 * Triggers a resize so the new pixel ratio takes effect immediately.
 */
export const updateEarthRender = (
  s: EarthState,
  { resolutionScale }: { resolutionScale?: number } = {}
): void => {
  if (resolutionScale !== undefined) {
    s.render.resolutionScale = Math.min(resolutionScale, 2)

    handleEarthResize(s)
  }
}

/** Film-grain tweaks — enabled collapses intensity to 0. */
export const updateEarthFilm = (
  s: EarthState,
  { enabled, intensity }: { enabled?: boolean; intensity?: number } = {}
): void => {
  if (!s.filmU || !s.film) return

  if (enabled !== undefined) s.film.enabled = enabled
  if (intensity !== undefined) s.film.intensity = intensity

  s.filmU.value = s.film.enabled ? s.film.intensity : 0
}

/**
 * Sun-orbit tweaks — autoRotate flips the per-frame advance, speed scales
 * the .01 rad/frame increment, and angle repositions the sun on its orbit
 * circle (used by the playground to restore a persisted sun state).
 */
export const updateEarthSun = (
  s: EarthState,
  { autoRotate, speed, angle }: { autoRotate?: boolean; speed?: number; angle?: number } = {}
): void => {
  if (!s.sun) return

  if (autoRotate !== undefined) s.sun.autoRotate = autoRotate
  if (speed !== undefined) s.sun.speed = speed
  if (angle !== undefined) s.sun.angle = angle
}

/**
 * Current camera position + orbit target, rounded to 2 decimals — used
 * to persist/restore the view in the playground's settings snapshot.
 */
export const getEarthCameraState = (s: EarthState) => {
  if (!s.camera || !s.controls) return null

  const p = s.camera.position

  const t = s.controls.target

  return {
    position: { x: Number(p.x.toFixed(2)), y: Number(p.y.toFixed(2)), z: Number(p.z.toFixed(2)) },
    target: { x: Number(t.x.toFixed(2)), y: Number(t.y.toFixed(2)), z: Number(t.z.toFixed(2)) },
  }
}

/**
 * Restore the default framing: OrbitControls.reset() replays saveState()
 * (captured at bootstrap), then fov/position/target are pinned to
 * DEFAULT_SP_GUI.CAMERA in case the saved state drifted.
 */
export const resetEarthView = (s: EarthState): void => {
  s.controls?.reset()

  if (s.camera) {
    s.camera.fov = DEFAULT_SP_GUI.CAMERA.FOV

    s.camera.updateProjectionMatrix()

    s.camera.position.set(
      DEFAULT_SP_GUI.CAMERA.POSITION.x,
      DEFAULT_SP_GUI.CAMERA.POSITION.y,
      DEFAULT_SP_GUI.CAMERA.POSITION.z
    )
  }

  if (s.controls) {
    s.controls.target.set(
      DEFAULT_SP_GUI.CAMERA.TARGET.x,
      DEFAULT_SP_GUI.CAMERA.TARGET.y,
      DEFAULT_SP_GUI.CAMERA.TARGET.z
    )

    s.controls.update()
  }
}
