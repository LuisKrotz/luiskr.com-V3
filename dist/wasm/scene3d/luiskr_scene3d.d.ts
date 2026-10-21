/* tslint:disable */
/* eslint-disable */

/**
 * `Surface3d` — the exported scene handle: the engine state (scene,
 * camera, renderer) plus the per-frame scalar state JS pushes through
 * set_* calls (light, clear color, post amounts). Kept as one struct
 * so the JS handle has exactly ONE drop point (`destroy`).
 */
export class Surface3d {
  private constructor()
  free(): void
  [Symbol.dispose](): void
  /**
   * `add_group` — a transform-only node (three.js Group/Object3D).
   *
   * @param parent Parent id or `u32::MAX`.
   * @returns The new node id.
   */
  add_group(parent: number): number
  /**
   * `add_instanced` — InstancedMesh(geo, mat).
   *
   * @param parent Parent id or `u32::MAX`.
   * @param geo Geometry id. @param mat Material id.
   * @param capacity Reserved instance slots.
   * @returns The new node id.
   */
  add_instanced(parent: number, geo: number, mat: number, capacity: number): number
  /**
   * `add_lod` — an LOD switch node (three.js LOD): children
   * self-select via `lod_range` against camera distance.
   *
   * @param parent Parent id or `u32::MAX`.
   * @returns The new node id.
   */
  add_lod(parent: number): number
  /**
   * `add_material_basic` — MeshBasicMaterial (unlit texel·color).
   *
   * @param r @param g @param b @param a Color rgba 0-1.
   * @param tex Texture id or `u32::MAX` for none.
   * @returns The material registry id.
   */
  add_material_basic(r: number, g: number, b: number, a: number, tex: number): number
  /**
   * `add_material_points` — PointsMaterial (expanded-quad point
   * sprites).
   *
   * @param r @param g @param b @param a Color rgba 0-1.
   * @param size World-space point half-size.
   * @param tex Texture id or `u32::MAX`.
   * @returns The material registry id.
   */
  add_material_points(r: number, g: number, b: number, a: number, size: number, tex: number): number
  /**
   * `add_material_sprite` — SpriteMaterial (billboard texel·color).
   *
   * @param r @param g @param b @param a Color rgba 0-1.
   * @param tex Texture id or `u32::MAX`.
   * @returns The material registry id.
   */
  add_material_sprite(r: number, g: number, b: number, a: number, tex: number): number
  /**
   * `add_material_standard` — MeshStandardMaterial (Blinn-Phong —
   * see shader_standard.wgsl for the lighting model).
   *
   * @param r @param g @param b @param a Color rgba 0-1.
   * @param roughness Surface roughness 0-1 (→ spec exponent).
   * @param metalness Metallic factor 0-1 (→ spec tint).
   * @param tex Texture id or `u32::MAX`.
   * @returns The material registry id.
   */
  add_material_standard(
    r: number,
    g: number,
    b: number,
    a: number,
    roughness: number,
    metalness: number,
    tex: number
  ): number
  /**
   * `add_mesh` — Mesh(geo, mat).
   *
   * @param parent Parent node id or `u32::MAX` for root.
   * @param geo Geometry id. @param mat Material id.
   * @returns The new node id.
   */
  add_mesh(parent: number, geo: number, mat: number): number
  /**
   * `add_points` — Points(geo, mat).
   *
   * @param parent Parent id or `u32::MAX`.
   * @param geo Geometry id. @param mat Material id.
   * @returns The new node id.
   */
  add_points(parent: number, geo: number, mat: number): number
  /**
   * `add_sprite` — Sprite(mat) — geometry is the shared billboard
   * quad inside the renderer.
   *
   * @param parent Parent id or `u32::MAX`.
   * @param mat Material id.
   * @returns The new node id.
   */
  add_sprite(parent: number, mat: number): number
  /**
   * `camera_look_at` — point the direct camera at a world target.
   *
   * @param x @param y @param z World target.
   */
  camera_look_at(x: number, y: number, z: number): void
  /**
   * `destroy` — release the surface (GpuDevice drops with the
   * struct; the canvas detaches when JS removes the element).
   */
  destroy(): void
  /**
   * `frame` — one full draw: refresh worlds → write camera block →
   * draw list → submit. The JS loop calls this once per rAF
   * (MANUAL drive — the engine never self-schedules).
   *
   * @param time Elapsed seconds (shader clocks).
   * @param dpr Device pixel ratio (point-size compensation).
   */
  frame(time: number, dpr: number): void
  /**
   * `gen_box` — box generator passthrough.
   *
   * @param w @param h @param d Edge lengths.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   */
  gen_box(w: number, h: number, d: number, as_points: boolean): number
  /**
   * `gen_cylinder` — cylinder generator passthrough.
   *
   * @param rt @param rb Top/bottom radii.
   * @param h Height. @param segs Radial segments.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   */
  gen_cylinder(rt: number, rb: number, h: number, segs: number, as_points: boolean): number
  /**
   * `gen_icosahedron` — icosahedron generator passthrough.
   *
   * @param radius Circumscribed radius.
   * @param detail Subdivision detail.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   */
  gen_icosahedron(radius: number, detail: number, as_points: boolean): number
  /**
   * `gen_plane` — XY plane generator passthrough.
   *
   * @param w @param h Plane extents.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   */
  gen_plane(w: number, h: number, as_points: boolean): number
  /**
   * `gen_ring` — flat ring generator passthrough.
   *
   * @param inner @param outer Ring radii.
   * @param segments Radial segment count.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   */
  gen_ring(inner: number, outer: number, segments: number, as_points: boolean): number
  /**
   * `gen_sphere` — unit generator passthrough (docs in geometry.rs).
   *
   * @param radius Sphere radius.
   * @param ws @param hs Width/height segments.
   * @param as_points True → billboard-quad expansion (Points).
   * @returns The geometry registry id.
   */
  gen_sphere(radius: number, ws: number, hs: number, as_points: boolean): number
  /**
   * `gen_tetrahedron` — tetrahedron generator passthrough.
   *
   * @param radius Circumscribed radius.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   */
  gen_tetrahedron(radius: number, as_points: boolean): number
  /**
   * `gen_torus` — torus generator passthrough.
   *
   * @param radius Ring radius. @param tube Tube radius.
   * @param radial @param tubular Segment counts.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   */
  gen_torus(
    radius: number,
    tube: number,
    radial: number,
    tubular: number,
    as_points: boolean
  ): number
  /**
   * `node_look_at` — orient a node toward a world point (three.js
   * Object3D.lookAt — billboard moons, camera-chasing shells).
   *
   * @param node Node id. @param x @param y @param z World target.
   */
  node_look_at(node: number, x: number, y: number, z: number): void
  /**
   * `ray_at` — screen-space picking ray: NDC pixel → world-space
   * (origin, direction) — JS loops bodies with it (sphere tests
   * per body, per-pick only).
   *
   * `inv_view` is rebuilt from the camera's rotation + position —
   * the view matrix's inverse IS the camera world transform (no
   * general 4×4 inverse needed for a rigid transform).
   *
   * @param sx @param sy Screen position in CSS px.
   * @param sw @param sh Canvas size in CSS px.
   * @returns [ox, oy, oz, dx, dy, dz] — origin + normalized dir.
   */
  ray_at(sx: number, sy: number, sw: number, sh: number): Float32Array
  /**
   * `remove` — detach + drop a node (three.js remove/orphan
   * semantics — children re-parent to the root).
   *
   * @param node Node id.
   */
  remove(node: number): void
  /**
   * `resize` — backing-store size in DEVICE px (DPR-aware): depth
   * attachment + surface configure re-issue. Called from the JS
   * ResizeObserver arm.
   *
   * @param w @param h Device-pixel size.
   */
  resize(w: number, h: number): void
  /**
   * `set_camera` — direct TRS camera (orbit disabled). For orbiting
   * scenes use `set_orbit` instead — the two modes are exclusive
   * (orbit derives position/rotation each frame).
   *
   * @param x @param y @param z Eye position.
   */
  set_camera(x: number, y: number, z: number): void
  /**
   * `set_camera_layers` — the camera's layer mask (only nodes
   * whose `layers` intersect it draw).
   *
   * @param mask Layer bitmask.
   */
  set_camera_layers(mask: number): void
  /**
   * `set_clear` — the frame clear color (transparent black for
   * page-composited canvases).
   *
   * @param r @param g @param b @param a Clear rgba 0-1.
   */
  set_clear(r: number, g: number, b: number, a: number): void
  /**
   * `set_clip` — near/far planes (see camera.rs for the depth-
   * precision note on near).
   *
   * @param near Near clip. @param far Far clip.
   */
  set_clip(near: number, far: number): void
  /**
   * `set_color` — the base rgba on a registered material. Alpha is
   * the opacity slot — the per-frame label-fade/highlight arms
   * write this once per visible material (one uniform-pack row —
   * cheaper than rebuilding the record).
   *
   * @param mat Material id.
   * @param r @param g @param b @param a rgba 0-1.
   */
  set_color(mat: number, r: number, g: number, b: number, a: number): void
  /**
   * `set_emissive` — the additive self-lit tint on a material.
   *
   * @param mat Material id.
   * @param r @param g @param b @param a Emissive rgba.
   */
  set_emissive(mat: number, r: number, g: number, b: number, a: number): void
  /**
   * `set_euler` — object-space Euler rotation, XYZ radians
   * (three.js rotation.set — converts to the internal quaternion).
   *
   * @param node Node id. @param x @param y @param z Euler radians.
   */
  set_euler(node: number, x: number, y: number, z: number): void
  /**
   * `set_fov` — vertical field of view in DEGREES (three.js
   * parity — stored as radians inside).
   *
   * @param deg Field of view.
   */
  set_fov(deg: number): void
  /**
   * `set_instance` — write one instance transform on an Instanced
   * node. Takes the 16 column-major f32s as a typed array — the
   * same layout `Mat4.m` uses, no repacking.
   *
   * @param node Instanced node id.
   * @param i Instance slot.
   * @param m The 16-f32 matrix.
   */
  set_instance(node: number, i: number, m: Float32Array): void
  /**
   * `set_layers` — the 32-bit layer mask (three.js Layers: node
   * draws only when `layers & camera.layers != 0`).
   *
   * @param node Node id. @param mask Layer bitmask.
   */
  set_layers(node: number, mask: number): void
  /**
   * `set_light` — the scene's single point light.
   *
   * @param x @param y @param z Light position.
   * @param r @param g @param b Light color rgb 0-1.
   * @param intensity Scalar multiplier.
   */
  set_light(
    x: number,
    y: number,
    z: number,
    r: number,
    g: number,
    b: number,
    intensity: number
  ): void
  /**
   * `set_lod_range` — a child's distance window under a Lod node:
   * the child draws when camera distance ∈ [near, far).
   *
   * @param node Child node id.
   * @param near @param far Distance window.
   */
  set_lod_range(node: number, near: number, far: number): void
  /**
   * `set_material_flags` — pipeline-state flags on a registered
   * material. REBUILDS the material's bind group slot cheaply
   * (flags live in the uniform pack — the bind group itself is
   * texture-only and untouched).
   *
   * @param mat Material id.
   * @param side 0=front 1=back 2=double (three.js *Side).
   * @param blending 0=normal 1=additive.
   * @param transparent Alpha-sort pass membership.
   * @param depth_write Depth-buffer writes on/off.
   */
  set_material_flags(
    mat: number,
    side: number,
    blending: number,
    transparent: boolean,
    depth_write: boolean
  ): void
  /**
   * `set_orbit` — the spherical rig: eye = target + R(yaw,pitch)·
   * (0,0,distance), facing the target (see camera.rs Orbit).
   *
   * @param tx @param ty @param tz Orbit target.
   * @param distance Eye distance.
   * @param yaw Rotation about +Y, radians.
   * @param pitch Elevation, radians (clamped inside).
   */
  set_orbit(tx: number, ty: number, tz: number, distance: number, yaw: number, pitch: number): void
  /**
   * `set_position` — object-space translation (three.js
   * position.set — marks the node dirty for the next world pass).
   *
   * @param node Node id. @param x @param y @param z Position.
   */
  set_position(node: number, x: number, y: number, z: number): void
  /**
   * `set_post` — post-chain amounts; all-zero skips the pass.
   *
   * @param film Film grain 0-1.
   * @param chroma Chromatic aberration 0-1.
   * @param bloom Bloom strength 0-1.
   */
  set_post(film: number, chroma: number, bloom: number): void
  /**
   * `set_render_order` — the stable within-pass sort key (three.js
   * renderOrder — higher draws later).
   *
   * @param node Node id. @param order Sort key.
   */
  set_render_order(node: number, order: number): void
  /**
   * `set_scale` — object-space per-axis scale.
   *
   * @param node Node id. @param x @param y @param z Scale factors.
   */
  set_scale(node: number, x: number, y: number, z: number): void
  /**
   * `set_size` — CSS-pixel size for layout-derived math (sprite
   * attenuation, point sizes in CSS units). Separate channel from
   * `resize` per the crate-wide contract: `set_size`/`res` = CSS,
   * `resize`/`rect` = device.
   *
   * @param _w @param _h CSS-pixel size — folded into the camera
   *        aspect at frame time via the device size; kept for
   *        contract parity (future CSS-space effects).
   */
  set_size(_w: number, _h: number): void
  /**
   * `set_user_data` — the opaque engine tag (body ids, tile keys —
   * the graph never interprets it; JS round-trips it for picking).
   *
   * @param node Node id. @param data The tag.
   */
  set_user_data(node: number, data: number): void
  /**
   * `set_visible` — the visibility gate (hidden subtrees skip the
   * whole draw walk, children included).
   *
   * @param node Node id. @param visible Gate flag.
   */
  set_visible(node: number, visible: boolean): void
  /**
   * `upload_geometry` — arbitrary vertex data (the custom
   * BufferGeometry path: star-point clouds, hand-built shells).
   * Typed arrays in, geo_id out — zero JsValue marshalling.
   *
   * @param positions xyz triples (len = 3n).
   * @param normals xyz triples (len = 3n — zeros allowed for
   *        unlit materials).
   * @param uvs uv pairs (len = 2n).
   * @param indices Triangle indices (len = 3k, u32).
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   */
  upload_geometry(
    positions: Float32Array,
    normals: Float32Array,
    uvs: Float32Array,
    indices: Uint32Array,
    as_points: boolean
  ): number
  /**
   * `upload_texture` — register a decoded ImageBitmap (the
   * GPU→GPU `copyExternalImageToTexture` path — no CPU pixel
   * readback).
   *
   * @param bitmap The JS-decoded bitmap.
   * @param w @param h Pixel size.
   * @returns The texture registry id (u32::MAX on a device fault —
   *   materials bind the white fallback rather than panicking).
   */
  upload_texture(bitmap: ImageBitmap, w: number, h: number): number
  /**
   * `user_data` — read back the engine tag.
   *
   * @param node Node id.
   * @returns The tag as f64 (exact for u53 ids).
   */
  user_data(node: number): number
  /**
   * `world_position` — a node's world-space translation
   * (three.js getWorldPosition — engine-side pick helpers use it).
   *
   * @param node Node id.
   * @returns [x, y, z] — allocated per call; pick paths only,
   *          never per-frame.
   */
  world_position(node: number): Float32Array
}

/**
 * `mount` — bind a canvas to the page's SHARED GPUDevice and build
 * the renderer around it. The device is acquired once in JS
 * (`getSharedGpuDevice`) and passed to every artifact — per-widget
 * devices exhausted the driver's device budget on a widget-heavy
 * page (Windows/D3D12: `create command queue failed with
 * E_OUTOFMEMORY` after ~100 devices). Sync: with the device in hand
 * there is nothing to await, and a synchronous constructor can never
 * leave a wasm-bindgen closure dangling (the async-future trap was
 * the "closure invoked recursively" cascade). `await` on the JS side
 * tolerates the non-promise return unchanged.
 *
 * @param canvas The host canvas element.
 * @param device The shared GPUDevice (one per page, from the JS bridge).
 * @param w @param h Backing size in DEVICE pixels.
 * @returns The scene handle, or a JS error string on init failure.
 */
export function mount(canvas: HTMLCanvasElement, device: GPUDevice, w: number, h: number): Surface3d

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_surface3d_free: (a: number, b: number) => void
  readonly mount: (a: number, b: number, c: number, d: number, e: number) => void
  readonly surface3d_add_group: (a: number, b: number) => number
  readonly surface3d_add_instanced: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number
  ) => number
  readonly surface3d_add_lod: (a: number, b: number) => number
  readonly surface3d_add_material_basic: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => number
  readonly surface3d_add_material_points: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number
  ) => number
  readonly surface3d_add_material_sprite: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => number
  readonly surface3d_add_material_standard: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number
  ) => number
  readonly surface3d_add_mesh: (a: number, b: number, c: number, d: number) => number
  readonly surface3d_add_points: (a: number, b: number, c: number, d: number) => number
  readonly surface3d_add_sprite: (a: number, b: number, c: number) => number
  readonly surface3d_camera_look_at: (a: number, b: number, c: number, d: number) => void
  readonly surface3d_destroy: (a: number) => void
  readonly surface3d_frame: (a: number, b: number, c: number) => void
  readonly surface3d_gen_box: (a: number, b: number, c: number, d: number, e: number) => number
  readonly surface3d_gen_cylinder: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => number
  readonly surface3d_gen_icosahedron: (a: number, b: number, c: number, d: number) => number
  readonly surface3d_gen_plane: (a: number, b: number, c: number, d: number) => number
  readonly surface3d_gen_ring: (a: number, b: number, c: number, d: number, e: number) => number
  readonly surface3d_gen_sphere: (a: number, b: number, c: number, d: number, e: number) => number
  readonly surface3d_gen_tetrahedron: (a: number, b: number, c: number) => number
  readonly surface3d_gen_torus: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => number
  readonly surface3d_node_look_at: (a: number, b: number, c: number, d: number, e: number) => void
  readonly surface3d_ray_at: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => void
  readonly surface3d_remove: (a: number, b: number) => void
  readonly surface3d_resize: (a: number, b: number, c: number) => void
  readonly surface3d_set_camera: (a: number, b: number, c: number, d: number) => void
  readonly surface3d_set_camera_layers: (a: number, b: number) => void
  readonly surface3d_set_clear: (a: number, b: number, c: number, d: number, e: number) => void
  readonly surface3d_set_clip: (a: number, b: number, c: number) => void
  readonly surface3d_set_color: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => void
  readonly surface3d_set_emissive: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => void
  readonly surface3d_set_euler: (a: number, b: number, c: number, d: number, e: number) => void
  readonly surface3d_set_fov: (a: number, b: number) => void
  readonly surface3d_set_instance: (a: number, b: number, c: number, d: number, e: number) => void
  readonly surface3d_set_layers: (a: number, b: number, c: number) => void
  readonly surface3d_set_light: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number
  ) => void
  readonly surface3d_set_lod_range: (a: number, b: number, c: number, d: number) => void
  readonly surface3d_set_material_flags: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => void
  readonly surface3d_set_orbit: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number
  ) => void
  readonly surface3d_set_position: (a: number, b: number, c: number, d: number, e: number) => void
  readonly surface3d_set_post: (a: number, b: number, c: number, d: number) => void
  readonly surface3d_set_render_order: (a: number, b: number, c: number) => void
  readonly surface3d_set_scale: (a: number, b: number, c: number, d: number, e: number) => void
  readonly surface3d_set_size: (a: number, b: number, c: number) => void
  readonly surface3d_set_user_data: (a: number, b: number, c: number) => void
  readonly surface3d_set_visible: (a: number, b: number, c: number) => void
  readonly surface3d_upload_geometry: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number,
    i: number,
    j: number
  ) => number
  readonly surface3d_upload_texture: (a: number, b: number, c: number, d: number) => number
  readonly surface3d_user_data: (a: number, b: number) => number
  readonly surface3d_world_position: (a: number, b: number, c: number) => void
  readonly __wbindgen_export: (a: number, b: number) => number
  readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number
  readonly __wbindgen_export3: (a: number) => void
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number
  readonly __wbindgen_export4: (a: number, b: number, c: number) => void
}

export type SyncInitInput = BufferSource | WebAssembly.Module

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>
): Promise<InitOutput>
