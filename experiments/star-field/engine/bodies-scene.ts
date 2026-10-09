/**
 * @file engine/bodies-scene.ts
 * @description Scene-graph builder for the star-field catalog — turns each
 * SFBodyDef into a pickable node: textured sphere for mapped bodies,
 * procedural MeshStandard for dwarf planets, unlit MeshBasic for stars,
 * billboard sprites for nebulae, tilted gradient discs for galaxies, plus
 * Saturn/Venus shell layers, the accretion ring on Sgr A*, orbit guide
 * rings, and decorative satellite pivots.
 */
import type * as THREE_NS from 'three'
import { SF_COLORS, SF_SCENE } from '@core/tokens/starfield/params.js'
import { SF_KINDS } from '@core/tokens/starfield/kinds.js'
import type { SFBodyDef, SFNode, SFState } from './types.js'

type ThreeModule = typeof import('three')

/** `userData` key carrying the body id from mesh → raycast hit. */
export const SF_USER_BODY = 'bodyId'

/**
 * Sphere + material for a solid body — textured when the catalog maps one,
 * tinted procedural otherwise. Stars/systems use unlit MeshBasic (they
 * emit their own light); planets and smaller get lit MeshStandard.
 * @param THREE The three.js module.
 * @param def Catalog entry.
 * @param texMap Loaded texture map keyed by URL.
 */
function makeSphere(THREE: ThreeModule, def: SFBodyDef, texMap: Map<string, THREE_NS.Texture>) {
  const geo = new THREE.SphereGeometry(
    def.radius,
    SF_SCENE.SPHERE_SEGMENTS,
    SF_SCENE.SPHERE_SEGMENTS / 2
  )

  const luminous = def.kind === SF_KINDS.STAR || def.kind === SF_KINDS.SYSTEM

  const mat = luminous
    ? new THREE.MeshBasicMaterial({ map: texMap.get(def.texture ?? ''), color: def.color })
    : new THREE.MeshStandardMaterial({ map: texMap.get(def.texture ?? ''), color: def.color })

  return new THREE.Mesh(geo, mat)
}

/**
 * Billboard sprite for nebulae — the shared glow texture tinted by the
 * body's color, additive so overlapping glow reads as light, not surface.
 */
function makeNebula(THREE: ThreeModule, def: SFBodyDef, glowTex: THREE_NS.Texture | undefined) {
  const mat = new THREE.SpriteMaterial({
    map: glowTex,
    color: def.color,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const sprite = new THREE.Sprite(mat)

  sprite.scale.set(def.radius * 2, def.radius * 2, 1)

  return sprite
}

/**
 * Flat tilted disc for galaxies — a gradient-textured plane lying near
 * the orbital plane so it reads as a spiral seen at an angle rather than
 * a camera-facing billboard.
 */
function makeGalaxy(THREE: ThreeModule, def: SFBodyDef, glowTex: THREE_NS.Texture | undefined) {
  const size = def.radius * 2.4

  const geo = new THREE.PlaneGeometry(size, size)

  const mat = new THREE.MeshBasicMaterial({
    map: glowTex,
    color: def.color,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  const mesh = new THREE.Mesh(geo, mat)

  mesh.rotation.x = -Math.PI / 2 + (def.tilt ?? 0)

  return mesh
}

/**
 * Translucent shell layer — Venus's haze atmosphere and Saturn's ring get
 * a secondary texture-mapped surface parented to the main mesh.
 * @param THREE The three.js module.
 * @param def Catalog entry.
 * @param shellTexture Shell texture URL — narrowed non-null by the caller's
 *   `if (def.shellTexture)` guard.
 * @param parent The primary mesh the shell rides on.
 * @param texMap Loaded texture map keyed by URL.
 */
function makeShell(
  THREE: ThreeModule,
  def: SFBodyDef,
  shellTexture: string,
  parent: { add(o: unknown): unknown },
  texMap: Map<string, THREE_NS.Texture>
): void {
  const tex = texMap.get(shellTexture)

  if (def.shellRing) {
    const geo = new THREE.RingGeometry(def.radius * 1.35, def.radius * 2.25, SF_SCENE.RING_SEGMENTS)

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      side: THREE.DoubleSide,
    })

    const ring = new THREE.Mesh(geo, mat)

    ring.rotation.x = -Math.PI / 2 + (def.tilt ?? 0.3)

    parent.add(ring)

    return
  }

  const geo = new THREE.SphereGeometry(
    def.radius * 1.06,
    SF_SCENE.SPHERE_SEGMENTS,
    SF_SCENE.SPHERE_SEGMENTS / 2
  )

  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.65 })

  parent.add(new THREE.Mesh(geo, mat))
}

/**
 * Accretion ring for the black hole — a hot additive torus standing in
 * for the glowing plasma disc of Sgr A*.
 */
function makeAccretion(THREE: ThreeModule, def: SFBodyDef, parent: { add(o: unknown): unknown }) {
  const geo = new THREE.RingGeometry(def.radius * 1.5, def.radius * 2.6, SF_SCENE.RING_SEGMENTS)

  const mat = new THREE.MeshBasicMaterial({
    color: SF_COLORS.ACCRETION,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const ring = new THREE.Mesh(geo, mat)

  ring.rotation.x = -Math.PI / 2.4

  parent.add(ring)
}

/**
 * Decorative companion satellites — small unlit spheres on child pivots;
 * `satPivots` returns the {pivot,speed,phase} records frame.ts rotates.
 */
function makeSatellites(THREE: ThreeModule, def: SFBodyDef, mesh: { add(o: unknown): unknown }) {
  const satPivots: SFNode['satPivots'] = []

  for (const sat of def.satellites ?? []) {
    const pivot = new THREE.Object3D()

    const geo = new THREE.SphereGeometry(sat.radius, 24, 12)

    const mat = new THREE.MeshBasicMaterial({ color: sat.color })

    const sm = new THREE.Mesh(geo, mat)

    sm.position.x = sat.orbit

    pivot.add(sm)

    pivot.rotation.y = sat.phase ?? 0

    mesh.add(pivot)

    satPivots.push({ pivot, speed: sat.speed, phase: sat.phase ?? 0 })
  }

  return satPivots
}

/**
 * Orbit guide ring — a thin hairline torus in the orbital plane marking
 * the path; centered on the parent's anchor so moon rings ride Earth.
 */
function makeOrbitRing(THREE: ThreeModule, def: SFBodyDef, orbit: number) {
  const geo = new THREE.RingGeometry(orbit - 0.08, orbit + 0.08, SF_SCENE.ORBIT_SEGMENTS)

  const mat = new THREE.MeshBasicMaterial({
    color: SF_COLORS.ORBIT_LINE,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  const ring = new THREE.Mesh(geo, mat)

  ring.rotation.x = -Math.PI / 2

  return ring
}

/**
 * Builds every catalog body into the scene graph: pivots for orbiting
 * bodies (rotation.y = phase + t·speed), fixed groups for `pos` bodies,
 * satellites, shells and guide rings, then registers the node, anchor
 * and pickable in the state maps.
 * @param s Engine state.
 * @param THREE The three.js module.
 * @param defs Catalog entries.
 * @param texMap Loaded texture map keyed by URL.
 * @param glowTex Shared glow texture for sprites/discs (may be undefined).
 */
export function buildStarBodies(
  s: SFState,
  THREE: ThreeModule,
  defs: readonly SFBodyDef[],
  texMap: Map<string, THREE_NS.Texture>,
  glowTex: THREE_NS.Texture | undefined
): void {
  for (const def of defs) {
    const pivot = new THREE.Object3D()

    let mesh: THREE_NS.Object3D

    if (def.kind === SF_KINDS.NEBULA) {
      mesh = makeNebula(THREE, def, glowTex)
    } else if (def.kind === SF_KINDS.GALAXY) {
      mesh = makeGalaxy(THREE, def, glowTex)
    } else {
      mesh = makeSphere(THREE, def, texMap)
    }

    mesh.userData[SF_USER_BODY] = def.id

    if (def.orbit != null) {
      mesh.position.x = def.orbit

      pivot.rotation.y = def.phase ?? 0
    } else if (def.pos) {
      pivot.position.set(def.pos[0], def.pos[1], def.pos[2])
    }

    pivot.add(mesh)

    if (def.tilt && def.kind !== SF_KINDS.GALAXY) mesh.rotation.z = def.tilt

    if (def.shellTexture) makeShell(THREE, def, def.shellTexture, mesh, texMap)

    if (def.kind === SF_KINDS.BLACK_HOLE) makeAccretion(THREE, def, mesh)

    const satPivots = makeSatellites(THREE, def, mesh)

    const anchor = def.parent ? s.anchors.get(def.parent) : s.scene

    if (anchor) anchor.add(pivot)

    if (def.ring && def.orbit != null) {
      const ring = makeOrbitRing(THREE, def, def.orbit)

      anchor?.add(ring)

      s.rings.push(ring)
    }

    const node: SFNode = { def, pivot, mesh, spinner: mesh, satPivots }

    s.nodes.set(def.id, node)
    s.anchors.set(def.id, mesh)
    s.pickables.push(mesh)
  }
}
