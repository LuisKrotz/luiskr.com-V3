/**
 * @file earth/atmos-shells.ts
 * @description Atmosphere shells for the Earth background — the BackSide
 * additive scattering shell (Rayleigh + Mie + airglow limb bands, viewed
 * from inside) and the FrontSide fresnel rim hugging the planet edge.
 */
import type * as THREE_NS from 'three'
import type { UniformNode } from 'three/webgpu'
import type MeshBasicNodeMaterial from 'three/src/materials/nodes/MeshBasicNodeMaterial.js'
import { DEFAULT_SP_GUI } from '@/core/tokens/playground.js'
import { ATMOS_RADIUS, EARTH_RADIUS, SEG_HIGH } from '../consts.js'

type TslNs = typeof import('three/tsl')

/**
 * Type contract for AtmosShellsArgs — the shape consumers rely on.
 */
export interface AtmosShellsArgs {
  THREE: typeof THREE_NS
  TSL: TslNs
  mats: { MeshBasicNodeMaterial: typeof MeshBasicNodeMaterial }
  sunDir: UniformNode<'vec3', THREE_NS.Vector3>
}

/**
 * Type contract for AtmosShellsResult — the shape consumers rely on.
 */
export interface AtmosShellsResult {
  atmosMesh: THREE_NS.Mesh
  innerMesh: THREE_NS.Mesh
}

/**
 * Builds both atmosphere shells sharing one scattering model:
 *   atmosMesh — BackSide additive shell (10.2u): the camera looks
 *               *through* the shell, so each fragment is the air between
 *               the viewer and the far wall
 *   innerMesh — FrontSide fresnel rim (+0.02u): (1 − view·n)⁶ is
 *               near-zero everywhere except the extreme grazing rim,
 *               producing the thin bright line at the limb
 */
export function buildAtmosShells({ THREE, TSL, mats, sunDir }: AtmosShellsArgs): AtmosShellsResult {
  const { MeshBasicNodeMaterial } = mats
  const { mix, normalize, cameraPosition, positionWorld, pow, dot, vec3, smoothstep, uniform } = TSL

  const mkGeo = (r: number, s: number) => new THREE.SphereGeometry(r, s, s)

  /* Outer atmosphere */
  const aMat = new MeshBasicNodeMaterial()
  aMat.transparent = true
  aMat.side = THREE.BackSide
  aMat.depthWrite = false
  aMat.blending = THREE.AdditiveBlending

  // v_ = view-ray · surface-normal: 1 looking straight down at the shell,
  // 0 at the horizon. optD ≈ (5v)^2.5 is the classic "optical depth"
  // approximation — light passes through ~5× more air at the limb than
  // at zenith, so scattering ramps nonlinearly toward the rim.
  const dirToFrag = normalize(positionWorld.sub(cameraPosition))
  const worldNorm = normalize(positionWorld)
  const v_ = dot(dirToFrag, worldNorm).clamp(0, 1)
  const optD = pow(v_.mul(5).clamp(1e-5, 1), 2.5)
  const sunDotA = dot(worldNorm, sunDir)
  const cosTheta = dot(dirToFrag, sunDir)
  const rCol = uniform(new THREE.Color(DEFAULT_SP_GUI.ATMOSPHERE.RAYLEIGH_COLOR))
  const rInt = uniform(1.0)
  const mCol = uniform(new THREE.Color(DEFAULT_SP_GUI.ATMOSPHERE.MIE_COLOR))
  const airglowCol = uniform(new THREE.Color(DEFAULT_SP_GUI.ATMOSPHERE.AIRGLOW_COLOR))
  const atmosDens = uniform(DEFAULT_SP_GUI.ATMOSPHERE.DENSITY)
  const atmosMode = uniform(Number(String(DEFAULT_SP_GUI.ATMOSPHERE.MODE) !== 'Scattering'))
  // Rayleigh phase (3/16π)·(1+cos²θ) — symmetric blue-sky scattering,
  // forward and backward lobes equal.
  const rPhase = cosTheta
    .mul(cosTheta)
    .add(1)
    .mul(3 / (16 * Math.PI))
  const rScatter = rCol.mul(rPhase).mul(atmosDens).mul(rInt)
  // Henyey–Greenstein Mie phase with g=0.76 — strongly forward-peaked,
  // produces the bright haze ring around the sun direction.
  //   P(θ) = [3(1−g²)/(8π(2+g²))] · (1+cos²θ) / (1+g²−2g·cosθ)^1.5
  const g = 0.76
  const g2 = g * g
  const mPhaseBase = cosTheta.mul(-2 * g).add(1 + g2)
  const mPC = (3 * (1 - g2)) / (8 * Math.PI * (2 + g2))
  const mPhase = cosTheta.mul(cosTheta).add(1).mul(mPC).div(pow(mPhaseBase, 1.5))
  const mScatter = mCol.mul(mPhase).mul(atmosDens)
  // intPhase gates all scattering to the day side — the night atmosphere
  // doesn't glow (intPhase ≈ 0 when sunDotA < -0.2).
  const intPhase = smoothstep(-0.2, 0.2, sunDotA)
  const scattered = rScatter.add(mScatter).mul(intPhase)
  // Airglow bands: two nested smoothstep windows on v_ carve thin rings —
  // green just above the horizon (oxygen 557nm emission), blue slightly
  // higher — only where the shell grazes the limb.
  const greenBand = smoothstep(0.06, 0.02, v_).mul(smoothstep(0, 0.04, v_))
  const blueBand = smoothstep(0.15, 0.05, v_).mul(smoothstep(0.03, 0.1, v_))
  const airglowLight = airglowCol
    .mul(greenBand)
    .mul(4)
    .add(vec3(0.2, 0.3, 0.6).mul(blueBand).mul(1.5))
    .mul(intPhase)
  const finalScat = scattered.mul(optD)
  const finalAirglow = airglowLight.add(finalScat.mul(0.1))

  aMat.colorNode = mix(finalScat, finalAirglow, atmosMode)

  const atmosMesh = new THREE.Mesh(mkGeo(ATMOS_RADIUS, SEG_HIGH), aMat)

  /* Inner atmosphere (fresnel) */
  const iMat = new MeshBasicNodeMaterial()
  iMat.transparent = true
  iMat.side = THREE.FrontSide
  iMat.depthWrite = false
  iMat.blending = THREE.AdditiveBlending

  const viewDir = normalize(cameraPosition.sub(positionWorld))
  const invDot_ = dot(viewDir, worldNorm).clamp(0, 1).oneMinus()
  const innerOpt = pow(invDot_.clamp(1e-4, 1), 6).mul(1.5)
  const innerFinalScat = scattered.mul(innerOpt)
  const innerFinalAirglow = innerFinalScat
    .mul(0.5)
    .add(airglowCol.mul(innerOpt).mul(0.5).mul(intPhase))

  iMat.colorNode = mix(innerFinalScat, innerFinalAirglow, atmosMode)

  const innerMesh = new THREE.Mesh(mkGeo(EARTH_RADIUS + 0.02, SEG_HIGH), iMat)

  return { atmosMesh, innerMesh }
}
