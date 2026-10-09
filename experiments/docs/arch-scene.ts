/**
 * @file docs/arch-scene.ts
 * @description Interactive three.js visualization of the docs manifest —
 * the architecture/org structure rendered as a 3D radial tree: each
 * directory is a node on its depth ring, edges draw parent→child, nodes
 * pulse on a slow organic drift and click-to-pick navigates the portal.
 * Directory names ride on sprite labels that fade in as the camera zooms
 * closer, so the viewer can tell which ring/folder it is inside.
 *
 * WebGL context acquisition goes through `webglContext()` (the project
 * choke point) and is handed to three's WebGLRenderer, so the
 * `?debug=webGLMode:fallback` surface and pool hygiene stay authoritative.
 * All per-frame math lives on the GPU/three transforms — the rAF tick only
 * sets uniforms/rotation, per the compute-placement rule.
 *
 * Node-position batch math dispatches through `wasmPool` (the
 * DOCS_SCENE_LAYOUT worker op); when the pool is unavailable the identical
 * local formula runs on the main thread — the scene always mounts.
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { webglContext } from '@core/utils/canvas/webgl-mode.js'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { WASM_ACTIONS } from '@core/tokens/data/wasm.js'
import { CACHE_STORAGE_KEYS } from '@core/tokens/data/storage.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { DOCS_STRINGS, DOCS_UNITS } from '@core/tokens/strings/docs.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { GL_EVENTS, MOUSE_EVENTS, ORBIT_EVENTS, POINTER_EVENTS } from '@core/tokens/events/dom.js'
import { devWarn } from '@core/devlog.js'
import type { DocsNode } from './manifest.js'

/** Live scene resources — destroy() frees renderer + listeners. */
export interface ArchSceneHandle {
  destroy(): void
  /**
   * Highlights the node matching `path` — the current docs location.
   * Safe to call before the async graph build lands; the highlight
   * applies to whatever nodes exist and is re-applied when they arrive.
   * @param _path Manifest path of the active location ('' = portal root).
   */
  setActive(_path: string): void
}

/** A flattened manifest node with its ring depth and ring angle. */
interface PlacedNode {
  node: DocsNode
  depth: number
  angle: number
  parent: number
}

/** A dir-name sprite with the depth it answers to (zoom-reveal bucket). */
interface LabelRef {
  sprite: THREE.Sprite
  material: THREE.SpriteMaterial
  depth: number
}

/**
 * Flattens the manifest tree into positioned node descriptors: depth sets
 * the ring radius, sibling order spreads the angle. Recursive per the
 * self-similar-traversal rule.
 */
const layoutNodes = (
  nodes: DocsNode[],
  depth = 0,
  from = 0,
  to = Math.PI * 2,
  parent = -1,
  acc: PlacedNode[] = []
): PlacedNode[] => {
  const span = (to - from) / Math.max(nodes.length, 1)

  nodes.forEach((node, i) => {
    const angle = from + span * (i + 0.5)

    const idx = acc.length

    acc.push({ node, depth, angle, parent })

    if (node.children?.length) {
      layoutNodes(node.children, depth + 1, angle - span / 2, angle + span / 2, idx, acc)
    }
  })

  return acc
}

/**
 * Main-thread twin of the DOCS_SCENE_LAYOUT worker op — the batch
 * fallback for when the wasm pool is unavailable (tests, worker-less
 * environments). Ring radius grows with depth; y alternates per ring and
 * adds a slow sine wave for vertical separation.
 * @param depths Ring depth per node.
 * @param angles Ring angle (radians) per node.
 * @returns Flat xyz triplets in node order.
 */
const layoutPositionsJs = (depths: number[], angles: number[]): Float32Array => {
  const xyz = new Float32Array(depths.length * 3)

  for (let i = 0; i < depths.length; i++) {
    const r = DOCS_UNITS.SCENE_BASE_RADIUS + depths[i] * DOCS_UNITS.SCENE_DEPTH_STEP

    xyz[i * 3] = Math.cos(angles[i]) * r
    xyz[i * 3 + 1] =
      ((depths[i] % 3) - 1) * DOCS_UNITS.SCENE_Y_STEP +
      Math.sin(angles[i] * 2) * DOCS_UNITS.SCENE_Y_WAVE
    xyz[i * 3 + 2] = Math.sin(angles[i]) * r
  }

  return xyz
}

/**
 * Batch position compute — wasm worker first, local math on failure. The
 * worker replies with a transferable Float32Array; `structuredClone` of
 * the plain-object result also survives when transfer is unsupported.
 * @param placed Flattened tree nodes.
 * @returns xyz triplets, or null when nothing resolved.
 */
const computePositions = async (placed: PlacedNode[]): Promise<Float32Array> => {
  const depths = placed.map((p) => p.depth)
  const angles = placed.map((p) => p.angle)

  // Worker replies carry the shape `{ id, type, results: { xyz } }` —
  // `results` is the worker-protocol envelope for every op.
  const res = (await wasmPool.dispatch(WASM_ACTIONS.DOCS_SCENE_LAYOUT, { depths, angles })) as {
    results?: { xyz?: ArrayLike<number> }
  } | null

  const xyz = res?.results?.xyz

  return xyz && xyz.length === depths.length * 3
    ? new Float32Array(xyz)
    : layoutPositionsJs(depths, angles)
}

/**
 * Builds a dir-name sprite label — a 2d-canvas texture on a THREE.Sprite.
 * Returns null when 2d canvas is unavailable (happy-dom, exotic runtimes)
 * so the scene still mounts label-free.
 * @param name Folder name drawn on the label.
 * @param ink  Theme ink color resolved from the canvas' computed style.
 */
const makeLabel = (
  name: string,
  ink: string
): { sprite: THREE.Sprite; material: THREE.SpriteMaterial } | null => {
  const cnv = document.createElement(HTML_TAGS.CANVAS)

  const ctx = cnv.getContext('2d') as CanvasRenderingContext2D | null

  if (!ctx || !THREE.CanvasTexture || !THREE.Sprite) return null

  cnv.width = DOCS_UNITS.LABEL_W
  cnv.height = DOCS_UNITS.LABEL_H

  ctx.font = `${DOCS_UNITS.LABEL_FONT_PX}px sans-serif`
  ctx.fillStyle = ink
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(name, DOCS_UNITS.LABEL_W / 2, DOCS_UNITS.LABEL_H / 2, DOCS_UNITS.LABEL_W - 8)

  const material = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(cnv),
    transparent: true,
    opacity: 0,
    depthWrite: false,
  })

  const sprite = new THREE.Sprite(material)

  sprite.scale.set(DOCS_UNITS.LABEL_SCALE_X, DOCS_UNITS.LABEL_SCALE_Y, 1)

  return { sprite, material }
}

/** Persisted camera pose + rotation-off flag across scene remounts. */
interface SceneCamState {
  /** camera.position xyz */
  p: [number, number, number]
  /** controls.target xyz */
  t: [number, number, number]
  /** true once the user has taken control — autoRotate stays off. */
  off: boolean
}

/**
 * Reads the session-persisted camera pose — null when storage is
 * unavailable (tests, privacy mode) or the payload is malformed.
 */
const readCamState = (): SceneCamState | null => {
  try {
    if (typeof sessionStorage === TYPE_STRINGS.UNDEFINED) return null

    const raw = sessionStorage.getItem(CACHE_STORAGE_KEYS.DOCS_SCENE_STATE)

    if (!raw) return null

    const d = JSON.parse(raw) as Partial<SceneCamState>

    return d.p?.length === 3 && d.t?.length === 3
      ? { p: d.p as SceneCamState['p'], t: d.t as SceneCamState['t'], off: !!d.off }
      : null
  } catch {
    return null
  }
}

/**
 * Mounts the architecture scene on `canvas`.
 * @param canvas   Target canvas.
 * @param roots    Manifest root buckets (each becomes an inner-ring node).
 * @param onPick   Called with the manifest path when a node is picked.
 * @param onLost   Called once when the GL context dies mid-flight so the
 *                 host can hide/remount the scene — the portal keeps
 *                 working without WebGL.
 * @returns Scene handle, or null when WebGL is unavailable.
 */
export const mountArchScene = (
  canvas: HTMLCanvasElement,
  roots: Array<{ root: string; label: string; children: DocsNode[] }>,
  onPick: (_path: string) => void,
  onLost?: () => void
): ArchSceneHandle | null => {
  // three's WebGLRenderer requires WebGL2 (r163+ dropped WebGL1) — probe
  // webgl2 first, then the plain webgl alias; a null either way means the
  // scene stays unmounted and the caller hides the section.
  const gl = webglContext(canvas, { antialias: true, alpha: true }, true)

  if (!gl) return null

  let renderer: THREE.WebGLRenderer

  try {
    renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true })
  } catch (err) {
    devWarn('docs arch-scene renderer failed', err)

    return null
  }

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400)

  camera.position.set(0, 26, 60)

  const controls = new OrbitControls(camera, canvas)

  controls.enableDamping = true
  controls.autoRotate = true
  controls.autoRotateSpeed = DOCS_UNITS.SCENE_ROTATE_SPEED

  // Restore the user's camera + rotation-off flag from sessionStorage —
  // once the scene has been steered it remembers the pose across docs
  // navigations (remounts) and stops the idle drift.
  const saved = readCamState()

  if (saved) {
    camera.position.set(saved.p[0], saved.p[1], saved.p[2])

    controls.target.set(saved.t[0], saved.t[1], saved.t[2])

    controls.autoRotate = !saved.off
  }

  // Intro settle: a fresh (unrestored) mount eases the whole graph in
  // from SCENE_INTRO_TURN radians — the "object swings into place" read
  // the portal opened with before ambient autorotate takes over. A
  // restored pose lands directly on the user's view instead.
  const introFrom = saved ? 0 : DOCS_UNITS.SCENE_INTRO_TURN

  /** Serializes camera pose + interaction flag into sessionStorage. */
  const saveCamState = () => {
    try {
      if (typeof sessionStorage === TYPE_STRINGS.UNDEFINED) return

      const state: SceneCamState = {
        p: [camera.position.x, camera.position.y, camera.position.z],
        t: [controls.target.x, controls.target.y, controls.target.z],
        off: !controls.autoRotate,
      }

      sessionStorage.setItem(CACHE_STORAGE_KEYS.DOCS_SCENE_STATE, JSON.stringify(state))
    } catch {
      /* quota/security errors — persistence is best-effort */
    }
  }

  // First user gesture kills the idle rotation for good; gesture end
  // persists the settled pose. 'start'/'end' are OrbitControls' own
  // event names (not DOM), tokenized in ORBIT_EVENTS.
  const onControlStart = () => {
    controls.autoRotate = false

    saveCamState()
  }

  const onControlEnd = () => saveCamState()

  controls.addEventListener(ORBIT_EVENTS.START, onControlStart)
  controls.addEventListener(ORBIT_EVENTS.END, onControlEnd)

  // Theme ink for nodes/labels — read once from the canvas' computed
  // style (the stylesheet sets `color: var(--text-primary)` on it), so
  // the scene follows light/dark without a hardcoded color. `CanvasText`
  // is the system-color keyword fallback, never a channel literal.
  const ink = getComputedStyle(canvas).color || 'CanvasText'

  const inkColor = new THREE.Color(ink)

  scene.add(new THREE.AmbientLight(0xffffff, 1))

  // The manifest buckets hang off a synthetic center node — the portal
  // root level IS the tree root, so the scene reads as one rooted graph
  // (center = "In-depth project docs", ring 1 = the four buckets, …).
  // Buckets are { root, label, children } — mapped to dir nodes here so
  // they carry a real path (pickable + highlightable) and a real label.
  const placed = layoutNodes([
    {
      type: 'dir',
      name: DOCS_STRINGS.TITLE,
      path: CHAR_STRINGS.EMPTY,
      children: roots.map((r) => ({
        type: 'dir' as const,
        name: r.label,
        path: r.root,
        children: r.children,
      })),
    },
  ])

  const pickables: THREE.Mesh[] = []

  const labels: LabelRef[] = []

  /** Edge geometry — assigned inside buildGraph, disposed in destroy(). */
  let lineGeo: THREE.BufferGeometry | null = null

  /** Docs path currently highlighted — '' matches the portal-root node. */
  let activePath: string = CHAR_STRINGS.EMPTY

  let disposed = false

  /**
   * Paints the active-location highlight onto live nodes: the exact path
   * match pops to SCENE_ACTIVE_OPACITY with a larger pulse scale, and
   * ancestor dirs on its branch lift to SCENE_ANCESTOR_OPACITY so the
   * route's lineage reads on the map. Everything else keeps the faint
   * backdrop alpha stored on userData at build time.
   */
  const applyActive = () => {
    pickables.forEach((m) => {
      const p = m.userData.path as string

      const isActive = p === activePath

      const isAncestor =
        !isActive && p !== CHAR_STRINGS.EMPTY && activePath.startsWith(`${p}${CHAR_STRINGS.SLASH}`)

      const mat = m.material as THREE.MeshBasicMaterial

      mat.opacity = isActive
        ? DOCS_UNITS.SCENE_ACTIVE_OPACITY
        : isAncestor
          ? DOCS_UNITS.SCENE_ANCESTOR_OPACITY
          : (m.userData.baseOpacity as number)

      m.userData.activeScale = isActive ? DOCS_UNITS.SCENE_ACTIVE_SCALE : 1
    })
  }

  // Context loss mid-flight: stop the loop, tell the host to switch to
  // the non-GL presentation — `webglcontextrestored` on the canvas is the
  // recovery signal (the host remounts the whole scene on it).
  const onContextLost = () => {
    disposed = true

    onLost?.()
  }

  canvas.addEventListener(GL_EVENTS.WEBGL_CONTEXT_LOST, onContextLost)

  /**
   * Populates the scene once the (possibly worker-computed) positions
   * land — meshes, edges, then dir-name labels on top of dir nodes.
   */
  const buildGraph = (xyz: Float32Array) => {
    if (disposed) return

    const positions: THREE.Vector3[] = []

    placed.forEach(({ node, depth }, i) => {
      const pos = new THREE.Vector3(xyz[i * 3], xyz[i * 3 + 1], xyz[i * 3 + 2])

      // The synthetic portal root sits at the origin — its depth-0 ring
      // is a single node, so the ring position is meaningless.
      if (!depth) pos.set(0, 0, 0)

      positions.push(pos)

      const isDir = node.type !== 'file'

      const geo = new THREE.SphereGeometry(isDir ? 0.9 : 0.45, 12, 12)

      const mat = new THREE.MeshBasicMaterial({
        color: inkColor,
        transparent: true,
        opacity: isDir ? DOCS_UNITS.SCENE_DIR_OPACITY : DOCS_UNITS.SCENE_FILE_OPACITY,
      })

      const mesh = new THREE.Mesh(geo, mat)

      mesh.position.copy(pos)

      mesh.userData.path = node.path

      mesh.userData.baseOpacity = mat.opacity

      // Neutral pulse multiplier until applyActive() marks it.
      mesh.userData.activeScale = 1

      scene.add(mesh)

      pickables.push(mesh)

      if (isDir) {
        const label = makeLabel(node.name, ink)

        if (label) {
          label.sprite.position.copy(pos)

          label.sprite.position.y += DOCS_UNITS.LABEL_LIFT_Y

          scene.add(label.sprite)

          labels.push({ ...label, depth: placed[i].depth })
        }
      }
    })

    const lineVerts: number[] = []

    placed.forEach(({ parent }, i) => {
      if (parent < 0) return

      lineVerts.push(
        positions[i].x,
        positions[i].y,
        positions[i].z,
        positions[parent].x,
        positions[parent].y,
        positions[parent].z
      )
    })

    lineGeo = new THREE.BufferGeometry()

    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3))

    scene.add(
      new THREE.LineSegments(
        lineGeo,
        new THREE.LineBasicMaterial({
          color: inkColor,
          transparent: true,
          opacity: DOCS_UNITS.SCENE_LINE_OPACITY,
        })
      )
    )

    // The highlight may have been set while positions were in flight —
    // re-apply now that the meshes exist.
    applyActive()
  }

  void computePositions(placed).then(buildGraph)

  const raycaster = new THREE.Raycaster()

  const pointer = new THREE.Vector2()

  // Tap slop — a drag or pinch shouldn't pick a node. pointerdown stores
  // the anchor; the click handler discards picks past the slop radius so
  // touch gestures stay gestures and taps stay taps.
  let downX = 0

  let downY = 0

  const onPointerDown = (e: PointerEvent) => {
    downX = e.clientX
    downY = e.clientY
  }

  const onClick = (e: MouseEvent) => {
    if (
      Math.abs(e.clientX - downX) > DOCS_UNITS.TAP_SLOP_PX ||
      Math.abs(e.clientY - downY) > DOCS_UNITS.TAP_SLOP_PX
    ) {
      return
    }

    const rect = canvas.getBoundingClientRect()

    pointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    )

    raycaster.setFromCamera(pointer, camera)

    const hit = raycaster.intersectObjects(pickables)[0]

    const path = hit?.object?.userData?.path

    if (typeof path === TYPE_STRINGS.STRING && path) onPick(path)
  }

  canvas.addEventListener(MOUSE_EVENTS.CLICK, onClick)
  canvas.addEventListener(POINTER_EVENTS.POINTERDOWN, onPointerDown)

  const resize = () => {
    const w = canvas.clientWidth || 320

    const h = canvas.clientHeight || 240

    renderer.setSize(w, h, false)

    camera.aspect = w / h

    camera.updateProjectionMatrix()
  }

  resize()

  let raf = 0

  const t0 = performance.now()

  const tick = () => {
    // Context lost mid-flight → stop scheduling; the host owns remount.
    if (disposed) return

    try {
      controls.update()

      // Intro settle — easeOutCubic from SCENE_INTRO_TURN to 0; after the
      // window the expression evaluates to exactly 0, so the graph rests
      // still and controls.autoRotate owns the ambient drift.
      if (introFrom) {
        const k = Math.min(1, (performance.now() - t0) / DOCS_UNITS.SCENE_INTRO_MS)

        scene.rotation.y = introFrom * Math.pow(1 - k, 3)
      }

      // Slow node pulse — organic breathing on the instance scale, cheap
      // per-frame uniform-style math (a scale set, not geometry churn).
      // The active node gets SCENE_ACTIVE_SCALE on top so it reads as
      // the current location even while breathing.
      const t = (performance.now() - t0) / 1000

      pickables.forEach((m, i) => {
        const s =
          (1 + Math.sin(t * DOCS_UNITS.SCENE_PULSE_SPEED + i * 0.7) * DOCS_UNITS.SCENE_PULSE_AMP) *
          (m.userData.activeScale as number)

        m.scale.setScalar(s)
      })

      // Zoom-reveal for folder labels: shallower rings name themselves
      // first, deeper rings need a closer camera — so the viewer always
      // knows which folder it is hovering inside of.
      const dist = controls.getDistance()

      labels.forEach(({ material, depth }) => {
        const reveal = Math.max(
          DOCS_UNITS.LABEL_REVEAL_MIN,
          DOCS_UNITS.LABEL_REVEAL_BASE - depth * DOCS_UNITS.LABEL_DEPTH_STEP
        )

        material.opacity = Math.max(0, Math.min(1, (reveal - dist) / DOCS_UNITS.LABEL_FADE))
      })

      renderer.render(scene, camera)
    } catch (err) {
      // A crashed renderer/driver throw takes the same path as a real
      // context loss — mark dead, let the host recover.
      devWarn('docs arch-scene tick failed', err)

      onContextLost()

      return
    }

    raf = requestAnimationFrame(tick)
  }

  raf = requestAnimationFrame(tick)

  return {
    setActive(path: string) {
      activePath = path

      applyActive()
    },

    destroy() {
      disposed = true

      cancelAnimationFrame(raf)

      canvas.removeEventListener(MOUSE_EVENTS.CLICK, onClick)
      canvas.removeEventListener(POINTER_EVENTS.POINTERDOWN, onPointerDown)
      canvas.removeEventListener(GL_EVENTS.WEBGL_CONTEXT_LOST, onContextLost)

      controls.removeEventListener(ORBIT_EVENTS.START, onControlStart)
      controls.removeEventListener(ORBIT_EVENTS.END, onControlEnd)

      controls.dispose()

      pickables.forEach((m) => {
        m.geometry.dispose()

        ;(m.material as THREE.Material).dispose()
      })

      labels.forEach(({ material }) => {
        material.map?.dispose()

        material.dispose()
      })

      lineGeo?.dispose()

      renderer.dispose()
    },
  }
}
