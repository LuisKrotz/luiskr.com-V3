/**
 * @file earth/frame.ts
 * @description Per-frame + per-resize behavior for the Earth engine,
 * extracted from earth-background.ts: the self-rescheduling RAF tick
 * (sun orbit advance, moon orbit, earth/cloud spin, controls damping,
 * pipeline-or-plain render), the host-aware resize measurer, and the
 * sun re-positioner every shader term reads through the sunDir uniform.
 */
import { EARTH_AXIAL_TILT } from '../consts.js'
import type { EarthState } from './state.js'

/**
 * Repositions the sun light + sprite from sun {angle, inclination} on
 * the fixed 200u orbit, then renormalizes the sunDir uniform — every
 * shader term (day/night, eclipse, scattering) reads this one uniform.
 */
export const syncEarthSun = (s: EarthState): void => {
  if (!s.sun || !s.sunLight || !s.sunMesh || !s.sunDirU) return

  const { angle: a, inclination: si } = s.sun

  const dist = 200

  s.sunLight.position.set(Math.cos(a) * dist, Math.sin(si) * dist, Math.sin(a) * dist)

  s.sunMesh.position.copy(s.sunLight.position)

  s.sunDirU.value.copy(s.sunLight.position).normalize()
}

/**
 * Resize step: measures the shadow host first, then the canvas parent,
 * then the window — the canvas lives inside SpacePlayground's shadow
 * root, so clientWidth must come from the host, not the element.
 * Pixel ratio = min(devicePixelRatio, 2) × resolutionScale — the cap at
 * 2 prevents 3x-phone GPU fill-rate blowout.
 */
export const handleEarthResize = (s: EarthState): void => {
  if (!s.canvas || !s.renderer || !s.camera) return

  const root = s.canvas.getRootNode()

  const host = root instanceof ShadowRoot ? (root.host as HTMLElement) : null

  const w = host?.clientWidth || s.canvas.parentElement?.clientWidth || window.innerWidth

  const h = host?.clientHeight || s.canvas.parentElement?.clientHeight || window.innerHeight

  if (!w || !h) return

  s.camera.aspect = w / h

  s.camera.updateProjectionMatrix()

  s.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * s.render.resolutionScale)

  s.renderer.setSize(w, h)
}

/**
 * Per-frame update, self-rescheduling via RAF.
 *   sun  — angle += 0.01·speed rad/frame, wrapped at 2π, then syncEarthSun
 *   moon — inclined-circle orbit: x = cos·d, y = sin(incl)·d,
 *          z = sin·cos(incl)·d (the z term flattens the circle into the
 *          inclination ellipse); lookAt(0,0,0) keeps the near face lit-side
 *   earth — y-spin at rotationSpeed rad/frame; clouds counter-rotate at
 *          0.2× for differential atmosphere drift
 *   render — pipeline if built (post FX), else plain scene render;
 *          a pipeline throw falls back within the same frame
 */
export const tickEarth = (s: EarthState): void => {
  if (s.disposed || s.reduced) return

  s.animId = requestAnimationFrame(() => tickEarth(s))

  if (s.sun?.autoRotate) {
    s.sun.angle += 0.01 * s.sun.speed

    if (s.sun.angle > Math.PI * 2) s.sun.angle -= Math.PI * 2

    syncEarthSun(s)
  }

  if (s.moonCfg?.enabled && s.moon) {
    s.moonCfg.angle += s.moonCfg.speed

    const { angle, inclination, distance } = s.moonCfg

    s.moon.position.set(
      Math.cos(angle) * distance,
      Math.sin(inclination) * distance,
      Math.sin(angle) * Math.cos(inclination) * distance
    )

    s.moon.lookAt(0, 0, 0)

    s.moonPosU?.value.copy(s.moon.position)
  }

  if (s.earth && s.earthSpin) {
    s.earth.rotation.y += s.earthSpin.rotationSpeed

    s.earth.rotation.z = s.earthSpin.trueInclination ? EARTH_AXIAL_TILT : 0

    if (s.cloudsMesh) s.cloudsMesh.rotation.y += s.earthSpin.rotationSpeed * 0.2
  }

  s.controls?.update()

  if (s.renderer && s.scene && s.camera) {
    if (s.pipeline) {
      try {
        s.pipeline.render()
      } catch {
        s.renderer.render(s.scene, s.camera)
      }
    } else {
      s.renderer.render(s.scene, s.camera)
    }
  }
}
