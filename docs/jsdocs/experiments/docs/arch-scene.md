# `experiments/docs/arch-scene.ts`

Interactive three.js visualization of the docs manifest —

| | |
|---|---|
| **Source** | `src/experiments/docs/arch-scene.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Live scene resources — destroy() frees renderer + listeners.

### (module scope)

A flattened manifest node with its ring depth and ring angle.

### (module scope)

A dir-name sprite with the depth it answers to (zoom-reveal bucket).

### `layoutNodes`

Flattens the manifest tree into positioned node descriptors: depth sets
the ring radius, sibling order spreads the angle. Recursive per the
self-similar-traversal rule.

### `layoutPositionsJs`

Main-thread twin of the DOCS_SCENE_LAYOUT worker op — the batch
fallback for when the wasm pool is unavailable (tests, worker-less
environments). Ring radius grows with depth; y alternates per ring and
adds a slow sine wave for vertical separation.
- `@param` depths Ring depth per node.
- `@param` angles Ring angle (radians) per node.
- `@returns` Flat xyz triplets in node order.

### `computePositions`

Batch position compute — wasm worker first, local math on failure. The
worker replies with a transferable Float32Array; `structuredClone` of
the plain-object result also survives when transfer is unsupported.
- `@param` placed Flattened tree nodes.
- `@returns` xyz triplets, or null when nothing resolved.

### `makeLabel`

Builds a dir-name sprite label — a 2d-canvas texture on a THREE.Sprite.
Returns null when 2d canvas is unavailable (happy-dom, exotic runtimes)
so the scene still mounts label-free.
- `@param` name Folder name drawn on the label.
- `@param` ink  Theme ink color resolved from the canvas' computed style.

### (module scope)

Persisted camera pose + rotation-off flag across scene remounts.

### `p`

camera.position xyz

### `t`

controls.target xyz

### `off`

true once the user has taken control — autoRotate stays off.

### `readCamState`

Reads the session-persisted camera pose — null when storage is
unavailable (tests, privacy mode) or the payload is malformed.

### `mountArchScene`

Mounts the architecture scene on `canvas`.
- `@param` canvas   Target canvas.
- `@param` roots    Manifest root buckets (each becomes an inner-ring node).
- `@param` onPick   Called with the manifest path when a node is picked.
- `@param` onLost   Called once when the GL context dies mid-flight so the
- `@returns` Scene handle, or null when WebGL is unavailable.

### `saveCamState`

Serializes camera pose + interaction flag into sessionStorage.

### `lineGeo`

Edge geometry — assigned inside buildGraph, disposed in destroy().

### `buildGraph`

Populates the scene once the (possibly worker-computed) positions
land — meshes, edges, then dir-name labels on top of dir nodes.
