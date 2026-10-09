/**
 * @file engine/frame.ts
 * @description Per-frame + per-resize behavior for the star-field engine:
 * the self-rescheduling RAF tick (orbit pivots, self-rotation, satellite
 * spins, fly-to tween, approach proximity check, controls damping,
 * render), and the host-aware resize measurer — the canvas lives inside
 * the StarField shadow root so clientWidth comes from the host element.
 */
import { SF_APPROACH, SF_MOTION } from '@core/tokens/starfield/params.js'
import { updateFly } from './fly.js'
import type { SFState } from './types.js'

/** Lazily-armed Vector3 ctor — set by bootstrap after the three import. */
let Vec3: new () => { x: number; y: number; z: number }

/** Scratch vector reused by every proximity measurement (no per-frame alloc). */
let _scratch: { x: number; y: number; z: number } | null = null

/**
 * Stores the real Vector3 constructor — bootstrap calls this after the
 * lazy three import so frame.ts never imports three itself.
 * @param V The three.js Vector3 class.
 */
export function armFrame(V: typeof Vec3): void {
  Vec3 = V
  _scratch = null
}

/**
 * World position of an anchor — single getWorldPosition call-site so the
 * armed Vector3 stays private to this module; returns {x,y,z} so callers
 * never handle three types.
 * @param anchor Any Object3D in the scene graph.
 */
export function anchorWorldPos(anchor: {
  getWorldPosition?: (v: never) => { x: number; y: number; z: number }
}): { x: number; y: number; z: number } {
  if (!Vec3 || !anchor.getWorldPosition) return { x: 0, y: 0, z: 0 }

  _scratch = _scratch || new Vec3()

  return anchor.getWorldPosition(_scratch as never)
}

/**
 * Resize step: measures the shadow host first, then the canvas parent,
 * then the window. Pixel ratio caps at 2 to prevent 3x-phone fill-rate
 * blowout.
 * @param s Engine state.
 */
export function handleStarResize(s: SFState): void {
  if (!s.canvas || !s.renderer || !s.camera) return

  const root = s.canvas.getRootNode()

  const host = root instanceof ShadowRoot ? (root.host as HTMLElement) : null

  const w = host?.clientWidth || s.canvas.parentElement?.clientWidth || window.innerWidth

  const h = host?.clientHeight || s.canvas.parentElement?.clientHeight || window.innerHeight

  if (!w || !h) return

  s.camera.aspect = w / h

  s.camera.updateProjectionMatrix()

  const r = s.renderer as { setPixelRatio?(n: number): void; setSize?(w: number, h: number): void }

  r.setPixelRatio?.(Math.min(window.devicePixelRatio, 2))

  r.setSize?.(w, h)
}

/**
 * Proximity check — when the camera comes within a body's approach
 * distance its dossier JSON prefetches via `onApproach`, once per body
 * per session (the `approached` set). Selection prefetches too, so a
 * slow drift-through and a direct nav click share one cache.
 * @param s Engine state.
 */
function checkApproach(s: SFState): void {
  if (!s.camera || !s.onApproach) return

  const cam = s.camera.position

  for (const [id, anchor] of s.anchors) {
    if (s.approached.has(id)) continue

    const def = s.nodes.get(id)?.def

    if (!def) continue

    const p = anchorWorldPos(anchor)

    const dist = Math.hypot(cam.x - p.x, cam.y - p.y, cam.z - p.z)

    if (dist < SF_APPROACH.PAD + def.radius * SF_APPROACH.SCALE) {
      s.approached.add(id)

      s.onApproach(id)
    }
  }
}

/**
 * Per-frame update, self-rescheduling via RAF:
 *   orbits — pivot.rotation.y = phase + t·ORBIT_SPEED·speed
 *   spins  — spinner.rotation.y advances by SPIN_SPEED·spin·dt
 *   satellites — same orbit formula on child pivots
 *   fly    — eased camera tween overrides manual control until done
 *   render — plain renderer.render (no post pipeline in this engine)
 * @param s Engine state.
 * @param now RAF timestamp in ms — falls back to performance.now.
 */
export function tickStar(s: SFState, now?: number): void {
  if (s.disposed || s.reduced) return

  s.animId = requestAnimationFrame((t) => tickStar(s, t))

  const t = (now ?? performance.now()) / 1000

  const dt = Math.min(0.1, Math.max(0, t - s.lastT))

  s.lastT = t
  s.t += dt

  for (const node of s.nodes.values()) {
    const def = node.def

    if (def.orbit != null && def.speed) {
      node.pivot.rotation.y = (def.phase ?? 0) + s.t * SF_MOTION.ORBIT_SPEED * def.speed
    }

    if (def.spin) {
      node.spinner.rotation.y = s.t * SF_MOTION.SPIN_SPEED * def.spin
    }

    for (const sat of node.satPivots) {
      sat.pivot.rotation.y = sat.phase + s.t * SF_MOTION.ORBIT_SPEED * sat.speed
    }
  }

  updateFly(s)

  checkApproach(s)

  s.controls?.update()

  if (s.renderer && s.scene && s.camera) {
    s.renderer.render(s.scene, s.camera)
  }
}
