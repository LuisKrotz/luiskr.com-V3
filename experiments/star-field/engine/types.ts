/* istanbul ignore file — type-only declarations, no runtime code. */
/**
 * @file engine/types.ts
 * @description Shared types for the star-field engine — the static body
 * catalog entry, the lazy-loaded dossier JSON shape, the mutable engine
 * state bag threaded through every stage (bootstrap, frame, fly, picking),
 * and the lifecycle callback signatures the host component receives.
 */

import type * as THREE_NS from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Static catalog entry — everything the scene needs to place a body,
 * declared once per body in catalog.ts. Orbiting bodies set `orbit` +
 * `parent`; fixed deep-sky objects set `pos` directly.
 */
export interface SFBodyDef {
  /** Body id — matches `public/data/<id>.json` and `data-body` attrs. */
  id: string
  /** Display fallback before the dossier JSON loads. */
  name: string
  /** SF_KINDS value — drives badge label + material recipe. */
  kind: string
  /** SF_GROUPS value — navigator drawer bucket. */
  group: string
  /** Visual radius in scene units (compressed chart, not to scale). */
  radius: number
  /** Orbit radius around `parent` — omit for fixed positions. */
  orbit?: number
  /** Id of the body it orbits (default: scene origin). */
  parent?: string
  /** Orbit angular speed multiplier (0 for fixed bodies). */
  speed?: number
  /** Self-rotation speed multiplier. */
  spin?: number
  /** Starting angle on the orbit (radians). */
  phase?: number
  /** Axial tilt (radians). */
  tilt?: number
  /** SF_TEXTURES key material map — omit for procedural bodies. */
  texture?: string
  /** SF_COLORS hex for procedural material/emissive tint. */
  color?: number
  /** Secondary texture for translucent shells (Venus atmosphere, Saturn ring). */
  shellTexture?: string
  /** Shell is a flat ring disc (Saturn) rather than an atmosphere sphere. */
  shellRing?: boolean
  /** Fixed scene position `[x,y,z]` for non-orbiting deep-sky objects. */
  pos?: [number, number, number]
  /** Whether to draw the orbit guide ring. */
  ring?: boolean
  /**
   * Decorative non-pickable satellites (companion stars, exoplanets) —
   * orbit this body's mesh; purely visual, no dossier of their own.
   */
  satellites?: Array<{
    radius: number
    orbit: number
    speed: number
    color?: number
    texture?: string
    phase?: number
  }>
}

/**
 * Lazy-loaded dossier JSON shape — `public/data/<id>.json`. Facts render
 * as a definition list; `history` is a prose paragraph; `source` credits
 * the data provenance (NASA, ESO, …).
 */
export interface SFDossier {
  id: string
  name: string
  kind: string
  tagline: string
  facts: Array<{ label: string; value: string }>
  history: string
  source: string
}

/** Progress callback — loader overlay message + 0–100 percent. */
export type SFProgressFn = (msg: string, pct: number) => void

/** Body-approach/select notification — the host fetches the dossier JSON. */
export type SFBodyFn = (bodyId: string) => void

/**
 * Mutable engine state — one bag threaded through bootstrap/frame/fly so
 * every stage shares renderer, scene graph, tweens and dispose flags
 * without a class field soup.
 */
export interface SFState {
  /** Persistent canvas the host owns (replaced on renderer retry). */
  canvas: HTMLCanvasElement | null
  /** three.js WebGPURenderer (WebGPU or forced-WebGL backend). */
  renderer: { render(...args: unknown[]): unknown; dispose(): void } | null
  scene: THREE_NS.Scene | null
  camera: THREE_NS.PerspectiveCamera | null
  controls: OrbitControls | null
  /** id → runtime body node record. */
  nodes: Map<string, SFNode>
  /** id → center Object3D the camera targets (equals mesh for most). */
  anchors: Map<string, THREE_NS.Object3D>
  /** Pickable meshes for raycasting. */
  pickables: THREE_NS.Object3D[]
  /** Orbit rings so destroy can dispose their geometry. */
  rings: THREE_NS.Object3D[]
  /** ids whose dossier was already prefetched — approach fires once. */
  approached: Set<string>
  /** Active fly-to tween or null when controls are free. */
  fly: SFFly | null
  /** Active RAF id. */
  animId: number | null
  /** Set by destroy() — every async stage checks before continuing. */
  disposed: boolean
  /** Bootstrap failed or bailed — host swaps in the CSS fallback. */
  failed: boolean
  /** Reduced-motion flag — pauses the RAF loop. */
  reduced: boolean
  /** Resize listener to detach on destroy. */
  onResize: (() => void) | null
  /** Pointer listeners to detach on destroy. */
  onPointerDown: ((e: Event) => void) | null
  onPointerMove: ((e: Event) => void) | null
  onPointerUp: ((e: Event) => void) | null
  onWheel: ((e: Event) => void) | null
  /** last pointer-down position for click-vs-drag discrimination. */
  downXY: { x: number; y: number } | null
  /** Last tick timestamp for dt-based animation. */
  lastT: number
  /** Elapsed scene time (seconds) — drives orbits/spins. */
  t: number
  /** Camera hover state — last picked body id for the HUD. */
  hoverId: string | null
  /** Selected body id (panel open). */
  selectedId: string | null
  /** Lifecycle callbacks from the host. */
  onReady?: () => void
  onProgress?: SFProgressFn
  onSelect?: SFBodyFn
  onApproach?: SFBodyFn
  onHover?: (bodyId: string | null) => void
}

/** Per-body runtime node — pivot (orbit rotation), mesh, and its def. */
export interface SFNode {
  def: SFBodyDef
  /** Object3D that orbits — rotates around the parent's center. */
  pivot: THREE_NS.Object3D
  /** The pickable mesh/sprite — carries `userData.bodyId`. */
  mesh: THREE_NS.Object3D
  /** Spin target (mesh or its inner group) for self-rotation. */
  spinner: THREE_NS.Object3D
  /** Satellite pivots (decorative companions) — rotate per frame. */
  satPivots: Array<{ pivot: THREE_NS.Object3D; speed: number; phase: number }>
}

/** Active camera fly-to tween — cubic ease-in-out over FLY_MS. */
export interface SFFly {
  /** Start time (performance.now snapshot). */
  t0: number
  /** Camera position at tween start. */
  fromPos: { x: number; y: number; z: number }
  /** Camera destination. */
  toPos: { x: number; y: number; z: number }
  /** Controls target at tween start. */
  fromTgt: { x: number; y: number; z: number }
  /** Controls target destination (body center). */
  toTgt: { x: number; y: number; z: number }
  /** Optional follow-up when the tween completes (fire onSelect). */
  done?: () => void
}
