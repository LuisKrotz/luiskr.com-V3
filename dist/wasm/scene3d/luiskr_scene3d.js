/* @ts-self-types="./luiskr_scene3d.d.ts" */

/**
 * `Surface3d` — the exported scene handle: the engine state (scene,
 * camera, renderer) plus the per-frame scalar state JS pushes through
 * set_* calls (light, clear color, post amounts). Kept as one struct
 * so the JS handle has exactly ONE drop point (`destroy`).
 */
export class Surface3d {
  static __wrap(ptr) {
    const obj = Object.create(Surface3d.prototype)
    obj.__wbg_ptr = ptr
    Surface3dFinalization.register(obj, obj.__wbg_ptr, obj)
    return obj
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    Surface3dFinalization.unregister(this)
    return ptr
  }
  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_surface3d_free(ptr, 0)
  }
  /**
   * `add_group` — a transform-only node (three.js Group/Object3D).
   *
   * @param parent Parent id or `u32::MAX`.
   * @returns The new node id.
   * @param {number} parent
   * @returns {number}
   */
  add_group(parent) {
    const ret = wasm.surface3d_add_group(this.__wbg_ptr, parent)
    return ret >>> 0
  }
  /**
   * `add_instanced` — InstancedMesh(geo, mat).
   *
   * @param parent Parent id or `u32::MAX`.
   * @param geo Geometry id. @param mat Material id.
   * @param capacity Reserved instance slots.
   * @returns The new node id.
   * @param {number} parent
   * @param {number} geo
   * @param {number} mat
   * @param {number} capacity
   * @returns {number}
   */
  add_instanced(parent, geo, mat, capacity) {
    const ret = wasm.surface3d_add_instanced(this.__wbg_ptr, parent, geo, mat, capacity)
    return ret >>> 0
  }
  /**
   * `add_lod` — an LOD switch node (three.js LOD): children
   * self-select via `lod_range` against camera distance.
   *
   * @param parent Parent id or `u32::MAX`.
   * @returns The new node id.
   * @param {number} parent
   * @returns {number}
   */
  add_lod(parent) {
    const ret = wasm.surface3d_add_lod(this.__wbg_ptr, parent)
    return ret >>> 0
  }
  /**
   * `add_material_basic` — MeshBasicMaterial (unlit texel·color).
   *
   * @param r @param g @param b @param a Color rgba 0-1.
   * @param tex Texture id or `u32::MAX` for none.
   * @returns The material registry id.
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   * @param {number} tex
   * @returns {number}
   */
  add_material_basic(r, g, b, a, tex) {
    const ret = wasm.surface3d_add_material_basic(this.__wbg_ptr, r, g, b, a, tex)
    return ret >>> 0
  }
  /**
   * `add_material_points` — PointsMaterial (expanded-quad point
   * sprites).
   *
   * @param r @param g @param b @param a Color rgba 0-1.
   * @param size World-space point half-size.
   * @param tex Texture id or `u32::MAX`.
   * @returns The material registry id.
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   * @param {number} size
   * @param {number} tex
   * @returns {number}
   */
  add_material_points(r, g, b, a, size, tex) {
    const ret = wasm.surface3d_add_material_points(this.__wbg_ptr, r, g, b, a, size, tex)
    return ret >>> 0
  }
  /**
   * `add_material_sprite` — SpriteMaterial (billboard texel·color).
   *
   * @param r @param g @param b @param a Color rgba 0-1.
   * @param tex Texture id or `u32::MAX`.
   * @returns The material registry id.
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   * @param {number} tex
   * @returns {number}
   */
  add_material_sprite(r, g, b, a, tex) {
    const ret = wasm.surface3d_add_material_sprite(this.__wbg_ptr, r, g, b, a, tex)
    return ret >>> 0
  }
  /**
   * `add_material_standard` — MeshStandardMaterial (Blinn-Phong —
   * see shader_standard.wgsl for the lighting model).
   *
   * @param r @param g @param b @param a Color rgba 0-1.
   * @param roughness Surface roughness 0-1 (→ spec exponent).
   * @param metalness Metallic factor 0-1 (→ spec tint).
   * @param tex Texture id or `u32::MAX`.
   * @returns The material registry id.
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   * @param {number} roughness
   * @param {number} metalness
   * @param {number} tex
   * @returns {number}
   */
  add_material_standard(r, g, b, a, roughness, metalness, tex) {
    const ret = wasm.surface3d_add_material_standard(
      this.__wbg_ptr,
      r,
      g,
      b,
      a,
      roughness,
      metalness,
      tex
    )
    return ret >>> 0
  }
  /**
   * `add_mesh` — Mesh(geo, mat).
   *
   * @param parent Parent node id or `u32::MAX` for root.
   * @param geo Geometry id. @param mat Material id.
   * @returns The new node id.
   * @param {number} parent
   * @param {number} geo
   * @param {number} mat
   * @returns {number}
   */
  add_mesh(parent, geo, mat) {
    const ret = wasm.surface3d_add_mesh(this.__wbg_ptr, parent, geo, mat)
    return ret >>> 0
  }
  /**
   * `add_points` — Points(geo, mat).
   *
   * @param parent Parent id or `u32::MAX`.
   * @param geo Geometry id. @param mat Material id.
   * @returns The new node id.
   * @param {number} parent
   * @param {number} geo
   * @param {number} mat
   * @returns {number}
   */
  add_points(parent, geo, mat) {
    const ret = wasm.surface3d_add_points(this.__wbg_ptr, parent, geo, mat)
    return ret >>> 0
  }
  /**
   * `add_sprite` — Sprite(mat) — geometry is the shared billboard
   * quad inside the renderer.
   *
   * @param parent Parent id or `u32::MAX`.
   * @param mat Material id.
   * @returns The new node id.
   * @param {number} parent
   * @param {number} mat
   * @returns {number}
   */
  add_sprite(parent, mat) {
    const ret = wasm.surface3d_add_sprite(this.__wbg_ptr, parent, mat)
    return ret >>> 0
  }
  /**
   * `camera_look_at` — point the direct camera at a world target.
   *
   * @param x @param y @param z World target.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  camera_look_at(x, y, z) {
    wasm.surface3d_camera_look_at(this.__wbg_ptr, x, y, z)
  }
  /**
   * `destroy` — release the surface (GpuDevice drops with the
   * struct; the canvas detaches when JS removes the element).
   */
  destroy() {
    const ptr = this.__destroy_into_raw()
    wasm.surface3d_destroy(ptr)
  }
  /**
   * `frame` — one full draw: refresh worlds → write camera block →
   * draw list → submit. The JS loop calls this once per rAF
   * (MANUAL drive — the engine never self-schedules).
   *
   * @param time Elapsed seconds (shader clocks).
   * @param dpr Device pixel ratio (point-size compensation).
   * @param {number} time
   * @param {number} dpr
   */
  frame(time, dpr) {
    wasm.surface3d_frame(this.__wbg_ptr, time, dpr)
  }
  /**
   * `gen_box` — box generator passthrough.
   *
   * @param w @param h @param d Edge lengths.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   * @param {number} w
   * @param {number} h
   * @param {number} d
   * @param {boolean} as_points
   * @returns {number}
   */
  gen_box(w, h, d, as_points) {
    const ret = wasm.surface3d_gen_box(this.__wbg_ptr, w, h, d, as_points)
    return ret >>> 0
  }
  /**
   * `gen_cylinder` — cylinder generator passthrough.
   *
   * @param rt @param rb Top/bottom radii.
   * @param h Height. @param segs Radial segments.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   * @param {number} rt
   * @param {number} rb
   * @param {number} h
   * @param {number} segs
   * @param {boolean} as_points
   * @returns {number}
   */
  gen_cylinder(rt, rb, h, segs, as_points) {
    const ret = wasm.surface3d_gen_cylinder(this.__wbg_ptr, rt, rb, h, segs, as_points)
    return ret >>> 0
  }
  /**
   * `gen_icosahedron` — icosahedron generator passthrough.
   *
   * @param radius Circumscribed radius.
   * @param detail Subdivision detail.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   * @param {number} radius
   * @param {number} detail
   * @param {boolean} as_points
   * @returns {number}
   */
  gen_icosahedron(radius, detail, as_points) {
    const ret = wasm.surface3d_gen_icosahedron(this.__wbg_ptr, radius, detail, as_points)
    return ret >>> 0
  }
  /**
   * `gen_plane` — XY plane generator passthrough.
   *
   * @param w @param h Plane extents.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   * @param {number} w
   * @param {number} h
   * @param {boolean} as_points
   * @returns {number}
   */
  gen_plane(w, h, as_points) {
    const ret = wasm.surface3d_gen_plane(this.__wbg_ptr, w, h, as_points)
    return ret >>> 0
  }
  /**
   * `gen_ring` — flat ring generator passthrough.
   *
   * @param inner @param outer Ring radii.
   * @param segments Radial segment count.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   * @param {number} inner
   * @param {number} outer
   * @param {number} segments
   * @param {boolean} as_points
   * @returns {number}
   */
  gen_ring(inner, outer, segments, as_points) {
    const ret = wasm.surface3d_gen_ring(this.__wbg_ptr, inner, outer, segments, as_points)
    return ret >>> 0
  }
  /**
   * `gen_sphere` — unit generator passthrough (docs in geometry.rs).
   *
   * @param radius Sphere radius.
   * @param ws @param hs Width/height segments.
   * @param as_points True → billboard-quad expansion (Points).
   * @returns The geometry registry id.
   * @param {number} radius
   * @param {number} ws
   * @param {number} hs
   * @param {boolean} as_points
   * @returns {number}
   */
  gen_sphere(radius, ws, hs, as_points) {
    const ret = wasm.surface3d_gen_sphere(this.__wbg_ptr, radius, ws, hs, as_points)
    return ret >>> 0
  }
  /**
   * `gen_tetrahedron` — tetrahedron generator passthrough.
   *
   * @param radius Circumscribed radius.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   * @param {number} radius
   * @param {boolean} as_points
   * @returns {number}
   */
  gen_tetrahedron(radius, as_points) {
    const ret = wasm.surface3d_gen_tetrahedron(this.__wbg_ptr, radius, as_points)
    return ret >>> 0
  }
  /**
   * `gen_torus` — torus generator passthrough.
   *
   * @param radius Ring radius. @param tube Tube radius.
   * @param radial @param tubular Segment counts.
   * @param as_points Points-expansion flag.
   * @returns The geometry registry id.
   * @param {number} radius
   * @param {number} tube
   * @param {number} radial
   * @param {number} tubular
   * @param {boolean} as_points
   * @returns {number}
   */
  gen_torus(radius, tube, radial, tubular, as_points) {
    const ret = wasm.surface3d_gen_torus(this.__wbg_ptr, radius, tube, radial, tubular, as_points)
    return ret >>> 0
  }
  /**
   * `node_look_at` — orient a node toward a world point (three.js
   * Object3D.lookAt — billboard moons, camera-chasing shells).
   *
   * @param node Node id. @param x @param y @param z World target.
   * @param {number} node
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  node_look_at(node, x, y, z) {
    wasm.surface3d_node_look_at(this.__wbg_ptr, node, x, y, z)
  }
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
   * @param {number} sx
   * @param {number} sy
   * @param {number} sw
   * @param {number} sh
   * @returns {Float32Array}
   */
  ray_at(sx, sy, sw, sh) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.surface3d_ray_at(retptr, this.__wbg_ptr, sx, sy, sw, sh)
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true)
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true)
      var v1 = getArrayF32FromWasm0(r0, r1).slice()
      wasm.__wbindgen_export4(r0, r1 * 4, 4)
      return v1
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * `remove` — detach + drop a node (three.js remove/orphan
   * semantics — children re-parent to the root).
   *
   * @param node Node id.
   * @param {number} node
   */
  remove(node) {
    wasm.surface3d_remove(this.__wbg_ptr, node)
  }
  /**
   * `resize` — backing-store size in DEVICE px (DPR-aware): depth
   * attachment + surface configure re-issue. Called from the JS
   * ResizeObserver arm.
   *
   * @param w @param h Device-pixel size.
   * @param {number} w
   * @param {number} h
   */
  resize(w, h) {
    wasm.surface3d_resize(this.__wbg_ptr, w, h)
  }
  /**
   * `set_camera` — direct TRS camera (orbit disabled). For orbiting
   * scenes use `set_orbit` instead — the two modes are exclusive
   * (orbit derives position/rotation each frame).
   *
   * @param x @param y @param z Eye position.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  set_camera(x, y, z) {
    wasm.surface3d_set_camera(this.__wbg_ptr, x, y, z)
  }
  /**
   * `set_camera_layers` — the camera's layer mask (only nodes
   * whose `layers` intersect it draw).
   *
   * @param mask Layer bitmask.
   * @param {number} mask
   */
  set_camera_layers(mask) {
    wasm.surface3d_set_camera_layers(this.__wbg_ptr, mask)
  }
  /**
   * `set_clear` — the frame clear color (transparent black for
   * page-composited canvases).
   *
   * @param r @param g @param b @param a Clear rgba 0-1.
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   */
  set_clear(r, g, b, a) {
    wasm.surface3d_set_clear(this.__wbg_ptr, r, g, b, a)
  }
  /**
   * `set_clip` — near/far planes (see camera.rs for the depth-
   * precision note on near).
   *
   * @param near Near clip. @param far Far clip.
   * @param {number} near
   * @param {number} far
   */
  set_clip(near, far) {
    wasm.surface3d_set_clip(this.__wbg_ptr, near, far)
  }
  /**
   * `set_color` — the base rgba on a registered material. Alpha is
   * the opacity slot — the per-frame label-fade/highlight arms
   * write this once per visible material (one uniform-pack row —
   * cheaper than rebuilding the record).
   *
   * @param mat Material id.
   * @param r @param g @param b @param a rgba 0-1.
   * @param {number} mat
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   */
  set_color(mat, r, g, b, a) {
    wasm.surface3d_set_color(this.__wbg_ptr, mat, r, g, b, a)
  }
  /**
   * `set_emissive` — the additive self-lit tint on a material.
   *
   * @param mat Material id.
   * @param r @param g @param b @param a Emissive rgba.
   * @param {number} mat
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   */
  set_emissive(mat, r, g, b, a) {
    wasm.surface3d_set_emissive(this.__wbg_ptr, mat, r, g, b, a)
  }
  /**
   * `set_euler` — object-space Euler rotation, XYZ radians
   * (three.js rotation.set — converts to the internal quaternion).
   *
   * @param node Node id. @param x @param y @param z Euler radians.
   * @param {number} node
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  set_euler(node, x, y, z) {
    wasm.surface3d_set_euler(this.__wbg_ptr, node, x, y, z)
  }
  /**
   * `set_fov` — vertical field of view in DEGREES (three.js
   * parity — stored as radians inside).
   *
   * @param deg Field of view.
   * @param {number} deg
   */
  set_fov(deg) {
    wasm.surface3d_set_fov(this.__wbg_ptr, deg)
  }
  /**
   * `set_instance` — write one instance transform on an Instanced
   * node. Takes the 16 column-major f32s as a typed array — the
   * same layout `Mat4.m` uses, no repacking.
   *
   * @param node Instanced node id.
   * @param i Instance slot.
   * @param m The 16-f32 matrix.
   * @param {number} node
   * @param {number} i
   * @param {Float32Array} m
   */
  set_instance(node, i, m) {
    const ptr0 = passArrayF32ToWasm0(m, wasm.__wbindgen_export)
    const len0 = WASM_VECTOR_LEN
    wasm.surface3d_set_instance(this.__wbg_ptr, node, i, ptr0, len0)
  }
  /**
   * `set_layers` — the 32-bit layer mask (three.js Layers: node
   * draws only when `layers & camera.layers != 0`).
   *
   * @param node Node id. @param mask Layer bitmask.
   * @param {number} node
   * @param {number} mask
   */
  set_layers(node, mask) {
    wasm.surface3d_set_layers(this.__wbg_ptr, node, mask)
  }
  /**
   * `set_light` — the scene's single point light.
   *
   * @param x @param y @param z Light position.
   * @param r @param g @param b Light color rgb 0-1.
   * @param intensity Scalar multiplier.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} intensity
   */
  set_light(x, y, z, r, g, b, intensity) {
    wasm.surface3d_set_light(this.__wbg_ptr, x, y, z, r, g, b, intensity)
  }
  /**
   * `set_lod_range` — a child's distance window under a Lod node:
   * the child draws when camera distance ∈ [near, far).
   *
   * @param node Child node id.
   * @param near @param far Distance window.
   * @param {number} node
   * @param {number} near
   * @param {number} far
   */
  set_lod_range(node, near, far) {
    wasm.surface3d_set_lod_range(this.__wbg_ptr, node, near, far)
  }
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
   * @param {number} mat
   * @param {number} side
   * @param {number} blending
   * @param {boolean} transparent
   * @param {boolean} depth_write
   */
  set_material_flags(mat, side, blending, transparent, depth_write) {
    wasm.surface3d_set_material_flags(this.__wbg_ptr, mat, side, blending, transparent, depth_write)
  }
  /**
   * `set_orbit` — the spherical rig: eye = target + R(yaw,pitch)·
   * (0,0,distance), facing the target (see camera.rs Orbit).
   *
   * @param tx @param ty @param tz Orbit target.
   * @param distance Eye distance.
   * @param yaw Rotation about +Y, radians.
   * @param pitch Elevation, radians (clamped inside).
   * @param {number} tx
   * @param {number} ty
   * @param {number} tz
   * @param {number} distance
   * @param {number} yaw
   * @param {number} pitch
   */
  set_orbit(tx, ty, tz, distance, yaw, pitch) {
    wasm.surface3d_set_orbit(this.__wbg_ptr, tx, ty, tz, distance, yaw, pitch)
  }
  /**
   * `set_position` — object-space translation (three.js
   * position.set — marks the node dirty for the next world pass).
   *
   * @param node Node id. @param x @param y @param z Position.
   * @param {number} node
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  set_position(node, x, y, z) {
    wasm.surface3d_set_position(this.__wbg_ptr, node, x, y, z)
  }
  /**
   * `set_post` — post-chain amounts; all-zero skips the pass.
   *
   * @param film Film grain 0-1.
   * @param chroma Chromatic aberration 0-1.
   * @param bloom Bloom strength 0-1.
   * @param {number} film
   * @param {number} chroma
   * @param {number} bloom
   */
  set_post(film, chroma, bloom) {
    wasm.surface3d_set_post(this.__wbg_ptr, film, chroma, bloom)
  }
  /**
   * `set_render_order` — the stable within-pass sort key (three.js
   * renderOrder — higher draws later).
   *
   * @param node Node id. @param order Sort key.
   * @param {number} node
   * @param {number} order
   */
  set_render_order(node, order) {
    wasm.surface3d_set_render_order(this.__wbg_ptr, node, order)
  }
  /**
   * `set_scale` — object-space per-axis scale.
   *
   * @param node Node id. @param x @param y @param z Scale factors.
   * @param {number} node
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  set_scale(node, x, y, z) {
    wasm.surface3d_set_scale(this.__wbg_ptr, node, x, y, z)
  }
  /**
   * `set_size` — CSS-pixel size for layout-derived math (sprite
   * attenuation, point sizes in CSS units). Separate channel from
   * `resize` per the crate-wide contract: `set_size`/`res` = CSS,
   * `resize`/`rect` = device.
   *
   * @param _w @param _h CSS-pixel size — folded into the camera
   *        aspect at frame time via the device size; kept for
   *        contract parity (future CSS-space effects).
   * @param {number} _w
   * @param {number} _h
   */
  set_size(_w, _h) {
    wasm.surface3d_set_size(this.__wbg_ptr, _w, _h)
  }
  /**
   * `set_user_data` — the opaque engine tag (body ids, tile keys —
   * the graph never interprets it; JS round-trips it for picking).
   *
   * @param node Node id. @param data The tag.
   * @param {number} node
   * @param {number} data
   */
  set_user_data(node, data) {
    wasm.surface3d_set_user_data(this.__wbg_ptr, node, data)
  }
  /**
   * `set_visible` — the visibility gate (hidden subtrees skip the
   * whole draw walk, children included).
   *
   * @param node Node id. @param visible Gate flag.
   * @param {number} node
   * @param {boolean} visible
   */
  set_visible(node, visible) {
    wasm.surface3d_set_visible(this.__wbg_ptr, node, visible)
  }
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
   * @param {Float32Array} positions
   * @param {Float32Array} normals
   * @param {Float32Array} uvs
   * @param {Uint32Array} indices
   * @param {boolean} as_points
   * @returns {number}
   */
  upload_geometry(positions, normals, uvs, indices, as_points) {
    const ptr0 = passArrayF32ToWasm0(positions, wasm.__wbindgen_export)
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passArrayF32ToWasm0(normals, wasm.__wbindgen_export)
    const len1 = WASM_VECTOR_LEN
    const ptr2 = passArrayF32ToWasm0(uvs, wasm.__wbindgen_export)
    const len2 = WASM_VECTOR_LEN
    const ptr3 = passArray32ToWasm0(indices, wasm.__wbindgen_export)
    const len3 = WASM_VECTOR_LEN
    const ret = wasm.surface3d_upload_geometry(
      this.__wbg_ptr,
      ptr0,
      len0,
      ptr1,
      len1,
      ptr2,
      len2,
      ptr3,
      len3,
      as_points
    )
    return ret >>> 0
  }
  /**
   * `upload_texture` — register a decoded ImageBitmap (the
   * GPU→GPU `copyExternalImageToTexture` path — no CPU pixel
   * readback).
   *
   * @param bitmap The JS-decoded bitmap.
   * @param w @param h Pixel size.
   * @returns The texture registry id (u32::MAX on a device fault —
   *   materials bind the white fallback rather than panicking).
   * @param {ImageBitmap} bitmap
   * @param {number} w
   * @param {number} h
   * @returns {number}
   */
  upload_texture(bitmap, w, h) {
    try {
      const ret = wasm.surface3d_upload_texture(this.__wbg_ptr, addBorrowedObject(bitmap), w, h)
      return ret >>> 0
    } finally {
      heap[stack_pointer++] = undefined
    }
  }
  /**
   * `user_data` — read back the engine tag.
   *
   * @param node Node id.
   * @returns The tag as f64 (exact for u53 ids).
   * @param {number} node
   * @returns {number}
   */
  user_data(node) {
    const ret = wasm.surface3d_user_data(this.__wbg_ptr, node)
    return ret
  }
  /**
   * `world_position` — a node's world-space translation
   * (three.js getWorldPosition — engine-side pick helpers use it).
   *
   * @param node Node id.
   * @returns [x, y, z] — allocated per call; pick paths only,
   *          never per-frame.
   * @param {number} node
   * @returns {Float32Array}
   */
  world_position(node) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.surface3d_world_position(retptr, this.__wbg_ptr, node)
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true)
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true)
      var v1 = getArrayF32FromWasm0(r0, r1).slice()
      wasm.__wbindgen_export4(r0, r1 * 4, 4)
      return v1
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
}
if (Symbol.dispose) Surface3d.prototype[Symbol.dispose] = Surface3d.prototype.free

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
 * @param {HTMLCanvasElement} canvas
 * @param {GPUDevice} device
 * @param {number} w
 * @param {number} h
 * @returns {Surface3d}
 */
export function mount(canvas, device, w, h) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    wasm.mount(retptr, addHeapObject(canvas), addHeapObject(device), w, h)
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true)
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true)
    var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true)
    if (r2) {
      throw takeObject(r1)
    }
    return Surface3d.__wrap(r0)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}
function __wbg_get_imports() {
  const import0 = {
    __proto__: null,
    __wbg___wbindgen_debug_string_4687d8d8c2017d52: function (arg0, arg1) {
      const ret = debugString(getObject(arg1))
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2)
      const len1 = WASM_VECTOR_LEN
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true)
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true)
    },
    __wbg___wbindgen_is_null_e343b7d08827ba72: function (arg0) {
      const ret = getObject(arg0) === null
      return ret
    },
    __wbg___wbindgen_is_undefined_8865fb403f8fe9d8: function (arg0) {
      const ret = getObject(arg0) === undefined
      return ret
    },
    __wbg___wbindgen_throw_41e9ee4f547fc59a: function (arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1))
    },
    __wbg_beginRenderPass_46bc75d13eaf7381: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).beginRenderPass(getObject(arg1))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_configure_a4e26031ba2da6a2: function () {
      return handleError(function (arg0, arg1) {
        getObject(arg0).configure(getObject(arg1))
      }, arguments)
    },
    __wbg_copyExternalImageToTexture_91a2b84d7d19190c: function () {
      return handleError(function (arg0, arg1, arg2, arg3) {
        getObject(arg0).copyExternalImageToTexture(
          getObject(arg1),
          getObject(arg2),
          getObject(arg3)
        )
      }, arguments)
    },
    __wbg_createBindGroupLayout_dd6a685e68699be9: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).createBindGroupLayout(getObject(arg1))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_createBindGroup_297f726263493b7a: function (arg0, arg1) {
      const ret = getObject(arg0).createBindGroup(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_createBuffer_7d58b37b7042f31f: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).createBuffer(getObject(arg1))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_createCommandEncoder_d26cb1fdb68219f7: function (arg0, arg1) {
      const ret = getObject(arg0).createCommandEncoder(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_createPipelineLayout_39a9a7f694e28389: function (arg0, arg1) {
      const ret = getObject(arg0).createPipelineLayout(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_createRenderPipeline_e7c57f75917917e4: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).createRenderPipeline(getObject(arg1))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_createSampler_1271407d57de5444: function (arg0, arg1) {
      const ret = getObject(arg0).createSampler(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_createShaderModule_274373c4cacce3a0: function (arg0, arg1) {
      const ret = getObject(arg0).createShaderModule(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_createTexture_272b1f1151792884: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).createTexture(getObject(arg1))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_createView_7520397d720e9d7d: function () {
      return handleError(function (arg0) {
        const ret = getObject(arg0).createView()
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_drawIndexed_b414a9de781296f1: function (arg0, arg1) {
      getObject(arg0).drawIndexed(arg1 >>> 0)
    },
    __wbg_drawIndexed_e4849324c06361c1: function (arg0, arg1, arg2) {
      getObject(arg0).drawIndexed(arg1 >>> 0, arg2 >>> 0)
    },
    __wbg_end_a97f51ac1f092bfe: function (arg0) {
      getObject(arg0).end()
    },
    __wbg_finish_489db1750712613c: function (arg0) {
      const ret = getObject(arg0).finish()
      return addHeapObject(ret)
    },
    __wbg_getContext_635e36719cad2623: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2))
        return isLikeNone(ret) ? 0 : addHeapObject(ret)
      }, arguments)
    },
    __wbg_getCurrentTexture_f9b3ddbfb8575837: function () {
      return handleError(function (arg0) {
        const ret = getObject(arg0).getCurrentTexture()
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_getPreferredCanvasFormat_4d28b652aa67cc74: function (arg0) {
      const ret = getObject(arg0).getPreferredCanvasFormat()
      return (__wbindgen_enum_GpuTextureFormat.indexOf(ret) + 1 || 102) - 1
    },
    __wbg_get_31af05bd4842a84f: function () {
      return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_new_617a8cdb8bb1130e: function () {
      const ret = new Object()
      return addHeapObject(ret)
    },
    __wbg_queue_17ba8833afbd540b: function (arg0) {
      const ret = getObject(arg0).queue
      return addHeapObject(ret)
    },
    __wbg_setBindGroup_4af09961dd6fd6d4: function (arg0, arg1, arg2) {
      getObject(arg0).setBindGroup(arg1 >>> 0, getObject(arg2))
    },
    __wbg_setIndexBuffer_d9fac7388da9021a: function (arg0, arg1, arg2) {
      getObject(arg0).setIndexBuffer(getObject(arg1), __wbindgen_enum_GpuIndexFormat[arg2])
    },
    __wbg_setPipeline_9870f87d9e0a49ab: function (arg0, arg1) {
      getObject(arg0).setPipeline(getObject(arg1))
    },
    __wbg_setVertexBuffer_7e35a3ca5e6c4878: function (arg0, arg1, arg2) {
      getObject(arg0).setVertexBuffer(arg1 >>> 0, getObject(arg2))
    },
    __wbg_set_a_d2dae9a62946ba86: function (arg0, arg1) {
      getObject(arg0).a = arg1
    },
    __wbg_set_address_mode_u_38bbe83e7cb70867: function (arg0, arg1) {
      getObject(arg0).addressModeU = __wbindgen_enum_GpuAddressMode[arg1]
    },
    __wbg_set_address_mode_v_e4dc81ae95d4e2d1: function (arg0, arg1) {
      getObject(arg0).addressModeV = __wbindgen_enum_GpuAddressMode[arg1]
    },
    __wbg_set_alpha_b14827cf8b4ac26a: function (arg0, arg1) {
      getObject(arg0).alpha = getObject(arg1)
    },
    __wbg_set_alpha_mode_16c3966c224ad4a9: function (arg0, arg1) {
      getObject(arg0).alphaMode = __wbindgen_enum_GpuCanvasAlphaMode[arg1]
    },
    __wbg_set_array_stride_c30294b65e05ecbf: function (arg0, arg1) {
      getObject(arg0).arrayStride = arg1 >>> 0
    },
    __wbg_set_attributes_9f3751b5d4cb6fbf: function (arg0, arg1, arg2) {
      getObject(arg0).attributes = getArrayJsValueViewFromWasm0(arg1, arg2)
    },
    __wbg_set_b_670dfc0631dcb9c1: function (arg0, arg1) {
      getObject(arg0).b = arg1
    },
    __wbg_set_bind_group_layouts_60a4869809302d79: function (arg0, arg1, arg2) {
      getObject(arg0).bindGroupLayouts = getArrayJsValueViewFromWasm0(arg1, arg2)
    },
    __wbg_set_binding_1d51e1a2d1c0cdaf: function (arg0, arg1) {
      getObject(arg0).binding = arg1 >>> 0
    },
    __wbg_set_binding_348f002e688081ac: function (arg0, arg1) {
      getObject(arg0).binding = arg1 >>> 0
    },
    __wbg_set_blend_3f83603fc878c51d: function (arg0, arg1) {
      getObject(arg0).blend = getObject(arg1)
    },
    __wbg_set_buffer_22331adbf81699d2: function (arg0, arg1) {
      getObject(arg0).buffer = getObject(arg1)
    },
    __wbg_set_buffer_b8d40a54af365605: function (arg0, arg1) {
      getObject(arg0).buffer = getObject(arg1)
    },
    __wbg_set_buffers_c1346a3c65c0829a: function (arg0, arg1, arg2) {
      getObject(arg0).buffers = getArrayJsValueViewFromWasm0(arg1, arg2)
    },
    __wbg_set_bytes_per_row_95041361899e65c1: function (arg0, arg1) {
      getObject(arg0).bytesPerRow = arg1 >>> 0
    },
    __wbg_set_clear_value_gpu_color_dict_c17321221601e286: function (arg0, arg1) {
      getObject(arg0).clearValue = getObject(arg1)
    },
    __wbg_set_code_4510e93549b3066e: function (arg0, arg1, arg2) {
      getObject(arg0).code = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_color_14d2fdcfc7117305: function (arg0, arg1) {
      getObject(arg0).color = getObject(arg1)
    },
    __wbg_set_color_attachments_367a5baf85bca057: function (arg0, arg1, arg2) {
      getObject(arg0).colorAttachments = getArrayJsValueViewFromWasm0(arg1, arg2)
    },
    __wbg_set_cull_mode_7a9f5499205a7f66: function (arg0, arg1) {
      getObject(arg0).cullMode = __wbindgen_enum_GpuCullMode[arg1]
    },
    __wbg_set_depth_clear_value_5063e6b8ebc5e409: function (arg0, arg1) {
      getObject(arg0).depthClearValue = arg1
    },
    __wbg_set_depth_compare_6bbd783f803d2663: function (arg0, arg1) {
      getObject(arg0).depthCompare = __wbindgen_enum_GpuCompareFunction[arg1]
    },
    __wbg_set_depth_load_op_a1b09a7ef6e4c3d4: function (arg0, arg1) {
      getObject(arg0).depthLoadOp = __wbindgen_enum_GpuLoadOp[arg1]
    },
    __wbg_set_depth_stencil_attachment_d17d58f9212bc033: function (arg0, arg1) {
      getObject(arg0).depthStencilAttachment = getObject(arg1)
    },
    __wbg_set_depth_stencil_feb50d4de7e35eb1: function (arg0, arg1) {
      getObject(arg0).depthStencil = getObject(arg1)
    },
    __wbg_set_depth_store_op_da4447aff70c723d: function (arg0, arg1) {
      getObject(arg0).depthStoreOp = __wbindgen_enum_GpuStoreOp[arg1]
    },
    __wbg_set_depth_write_enabled_88916d207b076ce9: function (arg0, arg1) {
      getObject(arg0).depthWriteEnabled = arg1 !== 0
    },
    __wbg_set_device_53f6c9076263d322: function (arg0, arg1) {
      getObject(arg0).device = getObject(arg1)
    },
    __wbg_set_dst_factor_cfb1cd4ae3e673d9: function (arg0, arg1) {
      getObject(arg0).dstFactor = __wbindgen_enum_GpuBlendFactor[arg1]
    },
    __wbg_set_entries_7c51a3643c761ecf: function (arg0, arg1, arg2) {
      getObject(arg0).entries = getArrayJsValueViewFromWasm0(arg1, arg2)
    },
    __wbg_set_entries_cc80db0de96ea4ff: function (arg0, arg1, arg2) {
      getObject(arg0).entries = getArrayJsValueViewFromWasm0(arg1, arg2)
    },
    __wbg_set_entry_point_a7593f073d0352f7: function (arg0, arg1, arg2) {
      getObject(arg0).entryPoint = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_entry_point_edfb9dd004493bc8: function (arg0, arg1, arg2) {
      getObject(arg0).entryPoint = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_format_036434fd3db220e7: function (arg0, arg1) {
      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1]
    },
    __wbg_set_format_67f2d982476ea95a: function (arg0, arg1) {
      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1]
    },
    __wbg_set_format_6bbbd4df6747733e: function (arg0, arg1) {
      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1]
    },
    __wbg_set_format_d1ce90a1fc3dd2cc: function (arg0, arg1) {
      getObject(arg0).format = __wbindgen_enum_GpuVertexFormat[arg1]
    },
    __wbg_set_format_d4c8ef73b087dab0: function (arg0, arg1) {
      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1]
    },
    __wbg_set_fragment_9bc5cc98c7c59fef: function (arg0, arg1) {
      getObject(arg0).fragment = getObject(arg1)
    },
    __wbg_set_front_face_8f4065ccd6ca4a56: function (arg0, arg1) {
      getObject(arg0).frontFace = __wbindgen_enum_GpuFrontFace[arg1]
    },
    __wbg_set_g_ac69babc4a0b2338: function (arg0, arg1) {
      getObject(arg0).g = arg1
    },
    __wbg_set_has_dynamic_offset_e2a0bd85eaf36f34: function (arg0, arg1) {
      getObject(arg0).hasDynamicOffset = arg1 !== 0
    },
    __wbg_set_height_3879aafd24f118f9: function (arg0, arg1) {
      getObject(arg0).height = arg1 >>> 0
    },
    __wbg_set_layout_4e86f7c1671a06d0: function (arg0, arg1) {
      getObject(arg0).layout = getObject(arg1)
    },
    __wbg_set_layout_f2b50454b73e9111: function (arg0, arg1) {
      getObject(arg0).layout = getObject(arg1)
    },
    __wbg_set_load_op_18ff54287ff40151: function (arg0, arg1) {
      getObject(arg0).loadOp = __wbindgen_enum_GpuLoadOp[arg1]
    },
    __wbg_set_mag_filter_91c348b29e1a6e57: function (arg0, arg1) {
      getObject(arg0).magFilter = __wbindgen_enum_GpuFilterMode[arg1]
    },
    __wbg_set_min_filter_fdbe96994784b13c: function (arg0, arg1) {
      getObject(arg0).minFilter = __wbindgen_enum_GpuFilterMode[arg1]
    },
    __wbg_set_module_168054323d22d57d: function (arg0, arg1) {
      getObject(arg0).module = getObject(arg1)
    },
    __wbg_set_module_1ad4e7343951303d: function (arg0, arg1) {
      getObject(arg0).module = getObject(arg1)
    },
    __wbg_set_offset_618dd5b4444a70c9: function (arg0, arg1) {
      getObject(arg0).offset = arg1 >>> 0
    },
    __wbg_set_operation_d8894b0f9aa3db27: function (arg0, arg1) {
      getObject(arg0).operation = __wbindgen_enum_GpuBlendOperation[arg1]
    },
    __wbg_set_primitive_3b6c52880715b903: function (arg0, arg1) {
      getObject(arg0).primitive = getObject(arg1)
    },
    __wbg_set_r_ccf9fe3e4d993555: function (arg0, arg1) {
      getObject(arg0).r = arg1
    },
    __wbg_set_resource_3367d3d5c5114a05: function (arg0, arg1) {
      getObject(arg0).resource = getObject(arg1)
    },
    __wbg_set_resource_gpu_buffer_binding_c689b0dc9379a99b: function (arg0, arg1) {
      getObject(arg0).resource = getObject(arg1)
    },
    __wbg_set_resource_gpu_texture_view_2ed0c241a5831597: function (arg0, arg1) {
      getObject(arg0).resource = getObject(arg1)
    },
    __wbg_set_rows_per_image_97b4a26f53457ed3: function (arg0, arg1) {
      getObject(arg0).rowsPerImage = arg1 >>> 0
    },
    __wbg_set_sampler_e7e837391d5b7c70: function (arg0, arg1) {
      getObject(arg0).sampler = getObject(arg1)
    },
    __wbg_set_shader_location_c7d2a36952c56851: function (arg0, arg1) {
      getObject(arg0).shaderLocation = arg1 >>> 0
    },
    __wbg_set_size_4716cf40ee7a64be: function (arg0, arg1) {
      getObject(arg0).size = arg1 >>> 0
    },
    __wbg_set_size_c2eb75980b76e0ac: function (arg0, arg1, arg2) {
      getObject(arg0).size = getArrayJsValueViewFromWasm0(arg1, arg2)
    },
    __wbg_set_source_3ffc7e2ebf9b8967: function (arg0, arg1) {
      getObject(arg0).source = getObject(arg1)
    },
    __wbg_set_src_factor_b29ea819b1b5d6f6: function (arg0, arg1) {
      getObject(arg0).srcFactor = __wbindgen_enum_GpuBlendFactor[arg1]
    },
    __wbg_set_step_mode_0877ef5a4eae6e5b: function (arg0, arg1) {
      getObject(arg0).stepMode = __wbindgen_enum_GpuVertexStepMode[arg1]
    },
    __wbg_set_store_op_6d2fb6cc3e66341e: function (arg0, arg1) {
      getObject(arg0).storeOp = __wbindgen_enum_GpuStoreOp[arg1]
    },
    __wbg_set_targets_0328c60fcfc0f564: function (arg0, arg1, arg2) {
      getObject(arg0).targets = getArrayJsValueViewFromWasm0(arg1, arg2)
    },
    __wbg_set_texture_5e4b2303dfbef0fa: function (arg0, arg1) {
      getObject(arg0).texture = getObject(arg1)
    },
    __wbg_set_texture_9f67e0e92f7c2af3: function (arg0, arg1) {
      getObject(arg0).texture = getObject(arg1)
    },
    __wbg_set_texture_e6c25e637d8a26a4: function (arg0, arg1) {
      getObject(arg0).texture = getObject(arg1)
    },
    __wbg_set_topology_36f1b64a3f922a23: function (arg0, arg1) {
      getObject(arg0).topology = __wbindgen_enum_GpuPrimitiveTopology[arg1]
    },
    __wbg_set_type_8e9e3a274f528f3e: function (arg0, arg1) {
      getObject(arg0).type = __wbindgen_enum_GpuSamplerBindingType[arg1]
    },
    __wbg_set_type_ff9e8f3110ad0cbf: function (arg0, arg1) {
      getObject(arg0).type = __wbindgen_enum_GpuBufferBindingType[arg1]
    },
    __wbg_set_usage_7177d2b5a0cb7ed1: function (arg0, arg1) {
      getObject(arg0).usage = arg1 >>> 0
    },
    __wbg_set_usage_aad5221dc614bcd1: function (arg0, arg1) {
      getObject(arg0).usage = arg1 >>> 0
    },
    __wbg_set_usage_e842e619c53799e7: function (arg0, arg1) {
      getObject(arg0).usage = arg1 >>> 0
    },
    __wbg_set_vertex_5b13839ffaff5f37: function (arg0, arg1) {
      getObject(arg0).vertex = getObject(arg1)
    },
    __wbg_set_view_gpu_texture_view_8d8dd7c0c832a505: function (arg0, arg1) {
      getObject(arg0).view = getObject(arg1)
    },
    __wbg_set_view_gpu_texture_view_9f7613e516713508: function (arg0, arg1) {
      getObject(arg0).view = getObject(arg1)
    },
    __wbg_set_visibility_78cfb96740c9deb5: function (arg0, arg1) {
      getObject(arg0).visibility = arg1 >>> 0
    },
    __wbg_set_width_4aa921b5f44a4f8b: function (arg0, arg1) {
      getObject(arg0).width = arg1 >>> 0
    },
    __wbg_static_accessor_GLOBAL_266715b9d96ba635: function () {
      const ret = typeof global === 'undefined' ? null : global
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_static_accessor_GLOBAL_THIS_10fb7dc1ae063179: function () {
      const ret = typeof globalThis === 'undefined' ? null : globalThis
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_static_accessor_SELF_0b583911f537483a: function () {
      const ret = typeof self === 'undefined' ? null : self
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_static_accessor_WINDOW_d7f903d1508cbdc4: function () {
      const ret = typeof window === 'undefined' ? null : window
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_submit_46ecaa46ea244579: function (arg0, arg1, arg2) {
      getObject(arg0).submit(getArrayJsValueViewFromWasm0(arg1, arg2))
    },
    __wbg_writeBuffer_2c02702ce0fa25c3: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).writeBuffer(getObject(arg1), arg2 >>> 0, getArrayU8FromWasm0(arg3, arg4))
      }, arguments)
    },
    __wbg_writeTexture_1fef8db24ba11cf3: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).writeTexture(
          getObject(arg1),
          getArrayU8FromWasm0(arg2, arg3),
          getObject(arg4),
          getObject(arg5)
        )
      }, arguments)
    },
    __wbindgen_generic_0000000000000001: function (arg0) {
      // Cast intrinsic for `F64 -> Externref`.
      const ret = arg0
      return addHeapObject(ret)
    },
    __wbindgen_generic_0000000000000002: function (arg0, arg1) {
      // Cast intrinsic for `Ref(String) -> Externref`.
      const ret = getStringFromWasm0(arg0, arg1)
      return addHeapObject(ret)
    },
    __wbindgen_object_clone_ref: function (arg0) {
      const ret = getObject(arg0)
      return addHeapObject(ret)
    },
    __wbindgen_object_drop_ref: function (arg0) {
      takeObject(arg0)
    },
  }
  return {
    __proto__: null,
    './luiskr_scene3d_bg.js': import0,
  }
}

const __wbindgen_enum_GpuAddressMode = ['clamp-to-edge', 'repeat', 'mirror-repeat']

const __wbindgen_enum_GpuBlendFactor = [
  'zero',
  'one',
  'src',
  'one-minus-src',
  'src-alpha',
  'one-minus-src-alpha',
  'dst',
  'one-minus-dst',
  'dst-alpha',
  'one-minus-dst-alpha',
  'src-alpha-saturated',
  'constant',
  'one-minus-constant',
  'src1',
  'one-minus-src1',
  'src1-alpha',
  'one-minus-src1-alpha',
]

const __wbindgen_enum_GpuBlendOperation = ['add', 'subtract', 'reverse-subtract', 'min', 'max']

const __wbindgen_enum_GpuBufferBindingType = ['uniform', 'storage', 'read-only-storage']

const __wbindgen_enum_GpuCanvasAlphaMode = ['opaque', 'premultiplied']

const __wbindgen_enum_GpuCompareFunction = [
  'never',
  'less',
  'equal',
  'less-equal',
  'greater',
  'not-equal',
  'greater-equal',
  'always',
]

const __wbindgen_enum_GpuCullMode = ['none', 'front', 'back']

const __wbindgen_enum_GpuFilterMode = ['nearest', 'linear']

const __wbindgen_enum_GpuFrontFace = ['ccw', 'cw']

const __wbindgen_enum_GpuIndexFormat = ['uint16', 'uint32']

const __wbindgen_enum_GpuLoadOp = ['load', 'clear']

const __wbindgen_enum_GpuPrimitiveTopology = [
  'point-list',
  'line-list',
  'line-strip',
  'triangle-list',
  'triangle-strip',
]

const __wbindgen_enum_GpuSamplerBindingType = ['filtering', 'non-filtering', 'comparison']

const __wbindgen_enum_GpuStoreOp = ['store', 'discard']

const __wbindgen_enum_GpuTextureFormat = [
  'r8unorm',
  'r8snorm',
  'r8uint',
  'r8sint',
  'r16unorm',
  'r16snorm',
  'r16uint',
  'r16sint',
  'r16float',
  'rg8unorm',
  'rg8snorm',
  'rg8uint',
  'rg8sint',
  'r32uint',
  'r32sint',
  'r32float',
  'rg16unorm',
  'rg16snorm',
  'rg16uint',
  'rg16sint',
  'rg16float',
  'rgba8unorm',
  'rgba8unorm-srgb',
  'rgba8snorm',
  'rgba8uint',
  'rgba8sint',
  'bgra8unorm',
  'bgra8unorm-srgb',
  'rgb9e5ufloat',
  'rgb10a2uint',
  'rgb10a2unorm',
  'rg11b10ufloat',
  'rg32uint',
  'rg32sint',
  'rg32float',
  'rgba16unorm',
  'rgba16snorm',
  'rgba16uint',
  'rgba16sint',
  'rgba16float',
  'rgba32uint',
  'rgba32sint',
  'rgba32float',
  'stencil8',
  'depth16unorm',
  'depth24plus',
  'depth24plus-stencil8',
  'depth32float',
  'depth32float-stencil8',
  'bc1-rgba-unorm',
  'bc1-rgba-unorm-srgb',
  'bc2-rgba-unorm',
  'bc2-rgba-unorm-srgb',
  'bc3-rgba-unorm',
  'bc3-rgba-unorm-srgb',
  'bc4-r-unorm',
  'bc4-r-snorm',
  'bc5-rg-unorm',
  'bc5-rg-snorm',
  'bc6h-rgb-ufloat',
  'bc6h-rgb-float',
  'bc7-rgba-unorm',
  'bc7-rgba-unorm-srgb',
  'etc2-rgb8unorm',
  'etc2-rgb8unorm-srgb',
  'etc2-rgb8a1unorm',
  'etc2-rgb8a1unorm-srgb',
  'etc2-rgba8unorm',
  'etc2-rgba8unorm-srgb',
  'eac-r11unorm',
  'eac-r11snorm',
  'eac-rg11unorm',
  'eac-rg11snorm',
  'astc-4x4-unorm',
  'astc-4x4-unorm-srgb',
  'astc-5x4-unorm',
  'astc-5x4-unorm-srgb',
  'astc-5x5-unorm',
  'astc-5x5-unorm-srgb',
  'astc-6x5-unorm',
  'astc-6x5-unorm-srgb',
  'astc-6x6-unorm',
  'astc-6x6-unorm-srgb',
  'astc-8x5-unorm',
  'astc-8x5-unorm-srgb',
  'astc-8x6-unorm',
  'astc-8x6-unorm-srgb',
  'astc-8x8-unorm',
  'astc-8x8-unorm-srgb',
  'astc-10x5-unorm',
  'astc-10x5-unorm-srgb',
  'astc-10x6-unorm',
  'astc-10x6-unorm-srgb',
  'astc-10x8-unorm',
  'astc-10x8-unorm-srgb',
  'astc-10x10-unorm',
  'astc-10x10-unorm-srgb',
  'astc-12x10-unorm',
  'astc-12x10-unorm-srgb',
  'astc-12x12-unorm',
  'astc-12x12-unorm-srgb',
]

const __wbindgen_enum_GpuVertexFormat = [
  'uint8',
  'uint8x2',
  'uint8x4',
  'sint8',
  'sint8x2',
  'sint8x4',
  'unorm8',
  'unorm8x2',
  'unorm8x4',
  'snorm8',
  'snorm8x2',
  'snorm8x4',
  'uint16',
  'uint16x2',
  'uint16x4',
  'sint16',
  'sint16x2',
  'sint16x4',
  'unorm16',
  'unorm16x2',
  'unorm16x4',
  'snorm16',
  'snorm16x2',
  'snorm16x4',
  'float16',
  'float16x2',
  'float16x4',
  'float32',
  'float32x2',
  'float32x3',
  'float32x4',
  'uint32',
  'uint32x2',
  'uint32x3',
  'uint32x4',
  'sint32',
  'sint32x2',
  'sint32x3',
  'sint32x4',
  'unorm10-10-10-2',
  'unorm8x4-bgra',
]

const __wbindgen_enum_GpuVertexStepMode = ['vertex', 'instance']
const Surface3dFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_surface3d_free(ptr, 1))

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1)
  const idx = heap_next
  heap_next = heap[idx]

  heap[idx] = obj
  return idx
}

function addBorrowedObject(obj) {
  if (stack_pointer == 1) throw new Error('out of js stack')
  heap[--stack_pointer] = obj
  return stack_pointer
}

function debugString(val) {
  // primitive types
  const type = typeof val
  if (type == 'number' || type == 'boolean' || val == null) {
    return `${val}`
  }
  if (type == 'string') {
    return `"${val}"`
  }
  if (type == 'symbol') {
    const description = val.description
    if (description == null) {
      return 'Symbol'
    } else {
      return `Symbol(${description})`
    }
  }
  if (type == 'function') {
    const name = val.name
    if (typeof name == 'string' && name.length > 0) {
      return `Function(${name})`
    } else {
      return 'Function'
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length
    let debug = '['
    if (length > 0) {
      debug += debugString(val[0])
    }
    for (let i = 1; i < length; i++) {
      debug += ', ' + debugString(val[i])
    }
    debug += ']'
    return debug
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val))
  let className
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1]
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val)
  }
  if (className == 'Object') {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return 'Object(' + JSON.stringify(val) + ')'
    } catch (_) {
      return 'Object'
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className
}

function dropObject(idx) {
  if (idx < 1028) return
  heap[idx] = heap_next
  heap_next = idx
}

function getArrayF32FromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len)
}

function getArrayJsValueViewFromWasm0(ptr, len) {
  ptr = ptr >>> 0
  const mem = getDataViewMemory0()
  const result = []
  for (let i = ptr; i < ptr + 4 * len; i += 4) {
    result.push(getObject(mem.getUint32(i, true)))
  }
  return result
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len)
}

let cachedDataViewMemory0 = null
function getDataViewMemory0() {
  if (
    cachedDataViewMemory0 === null ||
    cachedDataViewMemory0.buffer.detached === true ||
    (cachedDataViewMemory0.buffer.detached === undefined &&
      cachedDataViewMemory0.buffer !== wasm.memory.buffer)
  ) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer)
  }
  return cachedDataViewMemory0
}

let cachedFloat32ArrayMemory0 = null
function getFloat32ArrayMemory0() {
  if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
    cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer)
  }
  return cachedFloat32ArrayMemory0
}

function getStringFromWasm0(ptr, len) {
  return decodeText(ptr >>> 0, len)
}

let cachedUint32ArrayMemory0 = null
function getUint32ArrayMemory0() {
  if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
    cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer)
  }
  return cachedUint32ArrayMemory0
}

let cachedUint8ArrayMemory0 = null
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer)
  }
  return cachedUint8ArrayMemory0
}

function getObject(idx) {
  return heap[idx]
}

function handleError(f, args) {
  try {
    return f.apply(this, args)
  } catch (e) {
    wasm.__wbindgen_export3(addHeapObject(e))
  }
}

let heap = new Array(1024).fill(undefined)
heap.push(undefined, null, true, false)

let heap_next = heap.length

function isLikeNone(x) {
  return x === undefined || x === null
}

function passArray32ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 4, 4) >>> 0
  getUint32ArrayMemory0().set(arg, ptr / 4)
  WASM_VECTOR_LEN = arg.length
  return ptr
}

function passArrayF32ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 4, 4) >>> 0
  getFloat32ArrayMemory0().set(arg, ptr / 4)
  WASM_VECTOR_LEN = arg.length
  return ptr
}

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg)
    const ptr = malloc(buf.length, 1) >>> 0
    getUint8ArrayMemory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf)
    WASM_VECTOR_LEN = buf.length
    return ptr
  }

  let len = arg.length
  let ptr = malloc(len, 1) >>> 0

  const mem = getUint8ArrayMemory0()

  let offset = 0

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset)
    if (code > 0x7f) break
    mem[ptr + offset] = code
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset)
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len)
    const ret = cachedTextEncoder.encodeInto(arg, view)

    offset += ret.written
    ptr = realloc(ptr, len, offset, 1) >>> 0
  }

  WASM_VECTOR_LEN = offset
  return ptr
}

let stack_pointer = 1024

function takeObject(idx) {
  const ret = getObject(idx)
  dropObject(idx)
  return ret
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true })
cachedTextDecoder.decode()
const MAX_SAFARI_DECODE_BYTES = 2146435072
let numBytesDecoded = 0
function decodeText(ptr, len) {
  numBytesDecoded += len
  if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
    cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true })
    cachedTextDecoder.decode()
    numBytesDecoded = len
  }
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len))
}

const cachedTextEncoder = new TextEncoder()

if (!('encodeInto' in cachedTextEncoder)) {
  cachedTextEncoder.encodeInto = function (arg, view) {
    const buf = cachedTextEncoder.encode(arg)
    view.set(buf)
    return {
      read: arg.length,
      written: buf.length,
    }
  }
}

let WASM_VECTOR_LEN = 0

let wasmModule, wasmInstance, wasm
function __wbg_finalize_init(instance, module) {
  wasmInstance = instance
  wasm = instance.exports
  wasmModule = module
  cachedDataViewMemory0 = null
  cachedFloat32ArrayMemory0 = null
  cachedUint32ArrayMemory0 = null
  cachedUint8ArrayMemory0 = null
  return wasm
}

async function __wbg_load(module, imports) {
  if (typeof Response === 'function' && module instanceof Response) {
    if (!module.ok) {
      throw new Error(
        `failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`
      )
    }

    if (typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        return await WebAssembly.instantiateStreaming(module, imports)
      } catch (e) {
        const validResponse = expectedResponseType(module.type)

        if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
          console.warn(
            '`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n',
            e
          )
        } else {
          throw e
        }
      }
    }

    const bytes = await module.arrayBuffer()
    return await WebAssembly.instantiate(bytes, imports)
  } else {
    const instance = await WebAssembly.instantiate(module, imports)

    if (instance instanceof WebAssembly.Instance) {
      return { instance, module }
    } else {
      return instance
    }
  }

  function expectedResponseType(type) {
    switch (type) {
      case 'basic':
      case 'cors':
      case 'default':
        return true
    }
    return false
  }
}

function initSync(module) {
  if (wasm !== undefined) return wasm

  if (module !== undefined) {
    if (Object.getPrototypeOf(module) === Object.prototype) {
      ;({ module } = module)
    } else {
      console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
    }
  }

  const imports = __wbg_get_imports()
  if (!(module instanceof WebAssembly.Module)) {
    module = new WebAssembly.Module(module)
  }
  const instance = new WebAssembly.Instance(module, imports)
  return __wbg_finalize_init(instance, module)
}

async function __wbg_init(module_or_path) {
  if (wasm !== undefined) return wasm

  if (module_or_path !== undefined) {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ;({ module_or_path } = module_or_path)
    } else {
      console.warn(
        'using deprecated parameters for the initialization function; pass a single object instead'
      )
    }
  }

  if (module_or_path === undefined) {
    module_or_path = new URL('luiskr_scene3d_bg.wasm', import.meta.url)
  }
  const imports = __wbg_get_imports()

  if (
    typeof module_or_path === 'string' ||
    (typeof Request === 'function' && module_or_path instanceof Request) ||
    (typeof URL === 'function' && module_or_path instanceof URL)
  ) {
    module_or_path = fetch(module_or_path)
  }

  const { instance, module } = await __wbg_load(await module_or_path, imports)

  return __wbg_finalize_init(instance, module)
}

export { initSync, __wbg_init as default }
