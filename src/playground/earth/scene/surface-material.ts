/**
 * @file earth/surface-material.ts
 * @description Surface material node graph for the Earth shell —
 * cloud-shadow projection, day/night + twilight tint, ocean specular
 * mask, normal-map terrain self-shadowing, moon-eclipse dimming, and
 * the night-lights/dark-ambient emissive. Returns the material plus the
 * shared lighting terms the cloud and atmosphere shells reuse.
 */
import type * as THREE_NS from 'three'
import type { UniformNode } from 'three/webgpu'
import type MeshPhysicalNodeMaterial from 'three/src/materials/nodes/MeshPhysicalNodeMaterial.js'
import { DEFAULT_SP_GUI } from '@/core/tokens/playground.js'

type TslNs = typeof import('three/tsl')

/**
 * Type contract for SurfaceMaterialArgs — the shape consumers rely on.
 */
export interface SurfaceMaterialArgs {
  THREE: typeof THREE_NS
  TSL: TslNs
  mats: { MeshPhysicalNodeMaterial: typeof MeshPhysicalNodeMaterial }
  colorTex: THREE_NS.Texture
  specTex: THREE_NS.Texture
  normalTex: THREE_NS.Texture
  cloudsTex: THREE_NS.Texture
  nightTex: THREE_NS.Texture
  sunDir: UniformNode<'vec3', THREE_NS.Vector3>
  moonPos: UniformNode<'vec3', THREE_NS.Vector3>
}

/**
 * Type contract for SurfaceMaterialResult — the shape consumers rely on.
 */
export interface SurfaceMaterialResult {
  mat: MeshPhysicalNodeMaterial
  earthMatUniforms: Record<string, UniformNode<'float', number>>
  shared: {
    twilTint: unknown
    eclDim: unknown
    nightFade: unknown
    darkBr: UniformNode<'float', number>
    bumpFade: unknown
  }
}

/**
 * Builds the Earth's surface material — all TSL so the same node graph
 * compiles to WGSL (WebGPU) or GLSL (WebGL fallback):
 *   albedo × cloud-shadow × twilight-tint × terrain-self-shadow ×
 *   eclipse-dim, specular-masked PBR, sun-faded bump, night-lights +
 *   dark-side ambient emissive.
 */
export function buildSurfaceMaterial({
  THREE,
  TSL,
  mats,
  colorTex,
  specTex,
  normalTex,
  cloudsTex,
  nightTex,
  sunDir,
  moonPos,
}: SurfaceMaterialArgs): SurfaceMaterialResult {
  const { MeshPhysicalNodeMaterial } = mats
  const {
    texture,
    normalMap,
    mix,
    normalize,
    cross,
    positionWorld,
    dot,
    max,
    vec3,
    vec4,
    float,
    min,
    smoothstep,
    equirectUV,
    positionLocal,
    modelWorldMatrixInverse,
    uniform,
  } = TSL

  const mat = new MeshPhysicalNodeMaterial()

  // Sun direction in model space (w=0 → direction only, translation-free)
  // — lets local-space tricks like the cloud-shadow offset ignore the
  // group's own rotation.
  const sunLocal = normalize(modelWorldMatrixInverse.mul(vec4(sunDir, 0)).xyz)

  /* Cloud shadows */
  // Fake cloud-shadow projection: resample the cloud texture at a UV
  // offset along the sun direction. The offset distance fades with
  // surface·sun dot so shadows stretch toward the terminator and vanish
  // on the night side (0.1 keeps a whisper of offset at grazing angles).
  const sDist = uniform(DEFAULT_SP_GUI.CLOUD_SHADOWS.DISTANCE)
  const sInt = uniform(DEFAULT_SP_GUI.CLOUD_SHADOWS.INTENSITY)
  const sColor = uniform(new THREE.Color(DEFAULT_SP_GUI.CLOUD_SHADOWS.COLOR))
  const sFaded = mix(0.1, sDist, smoothstep(0.8, 0, dot(normalize(positionLocal), sunLocal)))
  const sPosL = positionLocal.add(sunLocal.mul(sFaded))
  const sUv = equirectUV(normalize(sPosL))
  const sOp = texture(cloudsTex, sUv).r
  const cloudShadow = mix(vec3(1), sColor, sOp.mul(sInt))

  /* Day/night */
  // sunDot < 0 → night hemisphere. nightFade inverts smoothstep's usual
  // order (0.2→-0.2) so it's 1 deep in night, 0 past 0.2 into day, with a
  // 0.4-wide twilight band straddling the terminator.
  const sunDot = dot(normalize(positionWorld), sunDir)
  const nightFade = smoothstep(0.2, -0.2, sunDot)
  const twilColor = uniform(new THREE.Color(DEFAULT_SP_GUI.ATMOSPHERE.TWILIGHT_COLOR))
  const darkBr = uniform(DEFAULT_SP_GUI.ENVIRONMENT.DARK_SIDE_BRIGHTNESS)
  const cityLts = uniform(DEFAULT_SP_GUI.ENVIRONMENT.CITY_LIGHTS)
  // Twilight band = t1·t2: a window that's 1 only inside [-0.2, 0.2] of
  // sunDot — the narrow orange rim around the terminator, halved (0.5)
  // so it tints rather than repaints the surface.
  const t1 = smoothstep(0, 0.2, sunDot).oneMinus()
  const t2 = smoothstep(-0.2, 0, sunDot)
  const twilTint = mix(vec3(1), twilColor, t1.mul(t2).mul(0.5))

  const spec = texture(specTex).r

  /* Water */
  const wRough = uniform(DEFAULT_SP_GUI.OCEAN.ROUGHNESS)
  const wMetal = uniform(DEFAULT_SP_GUI.OCEAN.METALNESS)

  /* Normals + self shadow */
  // Tangent frame for the normal map, built in object space: surf is the
  // geometric normal, vTan = worldUp × surf gives east-west tangent,
  // vBit completes the orthonormal basis. The sampled normal is remapped
  // from [0,1] to [-1,1] (×2 −1) and reprojected onto the frame.
  const surf = normalize(positionLocal)
  const vTan = normalize(cross(vec3(0, 1, 0), surf))
  const vBit = normalize(cross(surf, vTan))
  const nMap = texture(normalTex).xyz.mul(2).sub(1)
  const pN = normalize(vTan.mul(nMap.x).add(vBit.mul(nMap.y)).add(surf.mul(nMap.z)))
  const tSSI = uniform(DEFAULT_SP_GUI.EARTH.TERRAIN_SHADOW_INTENSITY)
  const tSSO = uniform(DEFAULT_SP_GUI.EARTH.TERRAIN_SHADOW_OFFSET)
  // Perturbed-normal sun incidence — the fragment's own lighting term.
  const tDot = max(0, dot(pN, sunLocal))
  // Fake terrain self-shadowing, screen-space free: step the surface
  // point along the sun-projected tangent (sProj = sunLocal with the
  // radial component removed), resample the normal there, and compare
  // incidences. If the *offset* sample faces the sun MORE than the
  // fragment does, the fragment sits in a bump's shadow → occ > 0.
  const sProj = sunLocal.sub(surf.mul(dot(sunLocal, surf)))
  const sT = normalize(sProj.add(vec3(1e-6)))
  const offP = normalize(positionLocal.add(sT.mul(tSSO)))
  const offUv = equirectUV(offP)
  const offN = texture(normalTex, offUv).xyz.mul(2).sub(1)
  const pNOff = normalize(vTan.mul(offN.x).add(vBit.mul(offN.y)).add(surf.mul(offN.z)))
  const offDot = max(0, dot(pNOff, sunLocal))
  const occ = max(0, offDot.sub(tDot))
  // Apply occlusion only over land (spec map dark ⇒ not ocean), only on
  // the day side, scaled by the user-facing intensity slider, and blend
  // toward a cool shadow tint rather than pure black — reads as ambient
  // skylight bouncing into shadowed terrain.
  const lMask = spec.oneMinus()
  const dayM = smoothstep(0, 0.2, dot(surf, sunLocal))
  const ssF = smoothstep(0, 0.3, occ).mul(lMask).mul(tSSI).mul(dayM)
  const tSC = mix(vec3(1), vec3(0.1, 0.15, 0.2), ssF)

  /* Moon eclipse */
  // Eclipse cone test: θ = angle between (fragment→moon) and sunDir.
  // Fragment is shadowed when θ < moon's angular radius. The moon sits
  // 100u out with radius 5 → tan θ ≈ 0.05, but the shader uses apparent
  // radii tMr=0.024 / sAR=0.02 (rad) so eclipses are tighter and rarer.
  // penumbra [umbInner, penOuter] gives a soft shadow edge via smoothstep.
  const { acos: ac_, sub: sub_ } = TSL
  const fToMoon = sub_(moonPos, positionWorld)
  const thetaM_ = ac_(max(float(-1), min(float(1), dot(normalize(fToMoon), sunDir))))
  const tMr = float(0.024)
  const sAR = float(0.02)
  const penOuter = tMr.add(sAR)
  const umbInner = max(float(0), tMr.sub(sAR))
  const eclSh = smoothstep(penOuter, umbInner, thetaM_)
  const eclDim = mix(vec3(1), vec3(0.015, 0.02, 0.025), eclSh)

  // Surface albedo = base texture × all the modulation terms computed
  // above. Inside the eclipse shadow, roughness → 1 and metalness → 0 so
  // ocean speculars don't glint through the umbra.
  mat.colorNode = texture(colorTex).mul(cloudShadow).mul(twilTint).mul(tSC).mul(eclDim)
  mat.roughnessNode = mix(mix(0.9, wRough, spec), float(1), eclSh)
  mat.metalnessNode = mix(mix(0, wMetal, spec), float(0), eclSh)

  // Bump fades out through the twilight band (sunDot -0.15→0.15) — a
  // strong normal map at grazing sun angles produces noisy specular
  // sparkle on the ocean and harsh terracing on land.
  const bumpScale = uniform(DEFAULT_SP_GUI.EARTH.BUMP_SCALE)
  const bumpFade = smoothstep(-0.15, 0.15, sunDot)

  mat.normalNode = normalMap(texture(normalTex), bumpScale.mul(bumpFade))

  // Emissive = city lights on the night side + a dim ambient bounce
  // (albedo × dark-side-brightness × 0.5) so night terrain isn't void.
  const nightLights = texture(nightTex).mul(nightFade).mul(cityLts)
  const darkAmb = texture(colorTex).mul(nightFade).mul(darkBr).mul(0.5)

  mat.emissiveNode = nightLights.add(darkAmb)

  const earthMatUniforms = {
    waterRoughness: wRough,
    waterMetalness: wMetal,
    bumpScale,
    terrainShadowIntensity: tSSI,
    terrainShadowOffset: tSSO,
    cityLights: cityLts,
    darkSideBrightness: darkBr,
  }

  return { mat, earthMatUniforms, shared: { twilTint, eclDim, nightFade, darkBr, bumpFade } }
}
