/**
 * @file earth/meshes.ts
 * @description Scene mesh builders for the WebGPU Earth background —
 * the 4-shell Earth group and the 3-level-LOD moon, extracted from
 * earth-background.ts. The surface node graph lives in
 * surface-material.ts, the atmosphere shells in atmos-shells.ts; this
 * module orchestrates texture loading, geometry and group assembly.
 * Pure functions: the engine passes its loader, TSL uniforms and
 * material constructors in; results (group, clouds mesh, live uniform
 * map) flow back out for the class to own.
 */
import type * as THREE_NS from 'three'
import type { UniformNode } from 'three/webgpu'
import type MeshPhysicalNodeMaterial from 'three/src/materials/nodes/MeshPhysicalNodeMaterial.js'
import type MeshBasicNodeMaterial from 'three/src/materials/nodes/MeshBasicNodeMaterial.js'
import { EARTH_TEXTURES as TEXTURES } from '@core/tokens/playground/textures.js'
import { EARTH_RADIUS, SEG_HIGH } from '../consts.js'
import { buildSurfaceMaterial } from './surface-material.js'
import { buildAtmosShells } from './atmos-shells.js'

type TslNs = typeof import('three/tsl')

/** Everything the Earth builder needs from the engine instance. */
export interface EarthShellsArgs {
  THREE: typeof THREE_NS
  TSL: TslNs
  mats: {
    MeshPhysicalNodeMaterial: typeof MeshPhysicalNodeMaterial
    MeshBasicNodeMaterial: typeof MeshBasicNodeMaterial
  }
  maxAniso: number
  loader: THREE_NS.TextureLoader | null
  sunDir: UniformNode<'vec3', THREE_NS.Vector3> | null
  moonPos: UniformNode<'vec3', THREE_NS.Vector3> | null
}

/** What buildEarthShells hands back for the engine to assign. */
export interface EarthShellsResult {
  group: THREE_NS.Group
  cloudsMesh: THREE_NS.Mesh | null
  earthMatUniforms: Record<string, UniformNode<'float', number>> | null
}

/**
 * Builds the 4-shell Earth group, all in TSL so the same node graph
 * compiles to WGSL (WebGPU) or GLSL (WebGL fallback):
 *
 *   earthMesh  — surface: albedo × cloud-shadow × twilight-tint ×
 *                terrain-self-shadow × eclipse-dim, specular-masked PBR,
 *                sun-faded bump, night-lights + dark-side ambient emissive
 *   cloudsMesh — transparent shell +0.05u above surface, rotates at 0.2×
 *   atmosMesh  — BackSide additive shell (10.2u): Rayleigh+Mie scattering
 *                + airglow limb bands, viewed from inside
 *   innerMesh  — FrontSide additive fresnel rim (+0.02u): the thin bright
 *                limb hugging the planet edge
 */
export async function buildEarthShells({
  THREE,
  TSL,
  mats,
  maxAniso,
  loader,
  sunDir,
  moonPos,
}: EarthShellsArgs): Promise<EarthShellsResult> {
  const { MeshPhysicalNodeMaterial } = mats
  const { texture, mix, vec3, float, bumpMap } = TSL

  const group = new THREE.Group()
  const ld = loader

  if (!ld || !sunDir || !moonPos) return { group, cloudsMesh: null, earthMatUniforms: null }

  const [colorTex, specTex, normalTex, cloudsTex, nightTex] = await Promise.all([
    ld.loadAsync(TEXTURES.ALBEDO),
    ld.loadAsync(TEXTURES.SPECULAR),
    ld.loadAsync(TEXTURES.NORMAL),
    ld.loadAsync(TEXTURES.CLOUDS),
    ld.loadAsync(TEXTURES.NIGHT),
  ])

  for (const t of [colorTex, cloudsTex, nightTex]) t.colorSpace = THREE.SRGBColorSpace
  for (const t of [colorTex, specTex, normalTex, cloudsTex, nightTex]) t.anisotropy = maxAniso

  const mkGeo = (r: number, s: number) => new THREE.SphereGeometry(r, s, s)

  const { mat, earthMatUniforms, shared } = buildSurfaceMaterial({
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
  })

  const earthMesh = new THREE.Mesh(mkGeo(EARTH_RADIUS, SEG_HIGH), mat)

  /* Clouds */
  // Cloud shell +0.05u above the surface: alpha from the cloud map's red
  // channel, a faint bump (0.02) for self-lit relief, night emissive so
  // clouds stay readable over the dark side, and depthWrite off so the
  // surface/atmosphere composites correctly through the shell.
  const { twilTint, eclDim, nightFade, darkBr, bumpFade } = shared as {
    twilTint: never
    eclDim: never
    nightFade: never
    darkBr: UniformNode<'float', number>
    bumpFade: never
  }

  const cMat = new MeshPhysicalNodeMaterial()
  cMat.transparent = true
  cMat.depthWrite = false
  cMat.blending = THREE.NormalBlending
  cMat.colorNode = vec3(1).mul(twilTint).mul(eclDim)
  cMat.emissiveNode = mix(vec3(0.005, 0.007, 0.01), vec3(0.05, 0.06, 0.08), nightFade)
    .mul(darkBr)
    .mul(20)
  cMat.normalNode = bumpMap(texture(cloudsTex), float(0.02).mul(bumpFade))
  cMat.opacityNode = texture(cloudsTex).r

  const cloudsMesh = new THREE.Mesh(mkGeo(EARTH_RADIUS + 0.05, SEG_HIGH), cMat)
  cloudsMesh.name = 'clouds'

  const { atmosMesh, innerMesh } = buildAtmosShells({ THREE, TSL, mats, sunDir })

  group.add(earthMesh, cloudsMesh, atmosMesh, innerMesh)

  return { group, cloudsMesh, earthMatUniforms }
}

/**
 * Moon as a 3-level LOD sphere (radius 5, half Earth's visual size at
 * 10× distance — exaggerated vs the real 0.27× so it reads at a glance).
 * 96/48/32-seg meshes swap at 30u/60u camera distance; a faint 0.02
 * emissive map keeps the dark limb visible.
 * @param {object} THREE - three namespace
 * @returns {Promise<THREE.LOD>}
 */
export async function buildMoonLod({
  THREE,
  loader,
}: {
  THREE: typeof THREE_NS
  loader: THREE_NS.TextureLoader | null
}): Promise<THREE_NS.LOD> {
  const ld = loader

  if (!ld) return new THREE.LOD()

  const [map, disp] = await Promise.all([
    ld.loadAsync(TEXTURES.MOON),
    ld.loadAsync(TEXTURES.MOON_DISP),
  ])
  map.colorSpace = THREE.SRGBColorSpace

  const mat = new THREE.MeshStandardMaterial({
    map,
    displacementMap: disp,
    displacementScale: 0,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: map,
    emissiveIntensity: 0.02,
    roughness: 0.9,
    metalness: 0,
  })
  const lod = new THREE.LOD()
  lod.addLevel(new THREE.Mesh(new THREE.SphereGeometry(5, 96, 96), mat), 0)
  lod.addLevel(new THREE.Mesh(new THREE.SphereGeometry(5, 48, 48), mat), 30)
  lod.addLevel(new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), mat), 60)
  return lod
}
