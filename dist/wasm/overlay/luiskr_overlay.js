/* @ts-self-types="./luiskr_overlay.d.ts" */

/**
 * Public wasm surface. `RefCell` interior-mutates around wasm-bindgen's
 * `&self`/`&mut self` exports without JS-visible ceremony.
 */
export class Overlay {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    OverlayFinalization.unregister(this)
    return ptr
  }
  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_overlay_free(ptr, 0)
  }
  /**
   * Burn sim data: four ink tints [core, mid, edge, scorch] × rgba.
   * @param {number} id
   * @param {Float32Array} flat
   */
  burn_set_colors(id, flat) {
    const ptr0 = passArrayF32ToWasm0(flat, wasm.__wbindgen_export)
    const len0 = WASM_VECTOR_LEN
    wasm.overlay_burn_set_colors(this.__wbg_ptr, id, ptr0, len0)
  }
  /**
   * Burn sim direction: +1 burn, −1 rebuild (un-hover replay).
   * @param {number} id
   * @param {number} dir
   */
  burn_set_dir(id, dir) {
    wasm.overlay_burn_set_dir(this.__wbg_ptr, id, dir)
  }
  /**
   * Burn sim data: per-column ink occupancy bytes.
   * @param {number} id
   * @param {Uint8Array} ink
   */
  burn_set_ink(id, ink) {
    const ptr0 = passArray8ToWasm0(ink, wasm.__wbindgen_export)
    const len0 = WASM_VECTOR_LEN
    wasm.overlay_burn_set_ink(this.__wbg_ptr, id, ptr0, len0)
  }
  /**
   * Burn sim data: letter table (f32×6 per letter).
   * @param {number} id
   * @param {Float32Array} flat
   */
  burn_set_letters(id, flat) {
    const ptr0 = passArrayF32ToWasm0(flat, wasm.__wbindgen_export)
    const len0 = WASM_VECTOR_LEN
    wasm.overlay_burn_set_letters(this.__wbg_ptr, id, ptr0, len0)
  }
  /**
   * Burn sim stage — pushed per frame before `frame`: global progress
   * 0..1 + jagged-edge amplitude in device px.
   * @param {number} id
   * @param {number} stage
   * @param {number} jag_amp
   */
  burn_set_stage(id, stage, jag_amp) {
    wasm.overlay_burn_set_stage(this.__wbg_ptr, id, stage, jag_amp)
  }
  /**
   * One frame — the only per-tick entry point, and the whole reason
   * the architecture works. Five stages, each chosen to cost the
   * minimum the hardware allows:
   *
   * 1. **Drain input** — replay every queued event once. Hover is
   *    recomputed only on move/down (up and wheel don't change what's
   *    under the pointer — skipping their hit_tests is a deliberate
   *    cost cut).
   * 2. **Tick sims** — burn particles advance in dt-space and emit
   *    quads into the shared buffer (one instanced draw covers ALL
   *    particles of ALL widgets).
   * 3. **Upload** — ONE `write_buffer` memcpy per frame; the instance
   *    buffer is grown geometrically (`next_power_of_two`) so steady
   *    frames never recreate it — allocation-free like the Vecs.
   * 4. **Encode** — clear once, then: quad pass → per-widget scissored
   *    draws (paint order = rect.y sort, mirroring DOM order) → text.
   *    One encoder, one render pass — state changes between widgets
   *    are pipeline+bind swaps, cheap driver commands.
   * 5. **Present** — mailbox mode drops stale frames rather than
   *    queueing latency.
   *
   * `dt` is in SECONDS — see the module doc's dt-space note.
   * @param {number} dt
   */
  frame(dt) {
    wasm.overlay_frame(this.__wbg_ptr, dt)
  }
  /**
   * The group under the pointer from the latest drain — the bridge
   * reads it after `frame` to route click intents to the DOM router.
   * @returns {number}
   */
  hover_group() {
    const ret = wasm.overlay_hover_group(this.__wbg_ptr)
    return ret >>> 0
  }
  /**
   * Request adapter/device and configure the canvas surface. Called
   * once from the bridge; failure propagates so the bridge falls back
   * to DOM rendering.
   * @param {HTMLCanvasElement} canvas
   * @returns {Promise<void>}
   */
  init(canvas) {
    const ret = wasm.overlay_init(this.__wbg_ptr, addHeapObject(canvas))
    return takeObject(ret)
  }
  /**
   * Pointer to the f32 input ring — JS writes records directly into
   * wasm linear memory here. No copy, no call per event.
   * @returns {number}
   */
  input_buffer_ptr() {
    const ret = wasm.overlay_input_buffer_ptr(this.__wbg_ptr)
    return ret >>> 0
  }
  /**
   * Pointer to the [head, tail] i32 meta pair — JS bumps head after
   * each record write, Rust drains from tail during `frame`.
   * @returns {number}
   */
  input_meta_ptr() {
    const ret = wasm.overlay_input_meta_ptr(this.__wbg_ptr)
    return ret >>> 0
  }
  /**
   * Loads a route font (Raleway/Fira bytes) into the glyphon font db.
   * @param {string} family
   * @param {Uint8Array} bytes
   */
  install_font(family, bytes) {
    const ptr0 = passStringToWasm0(family, wasm.__wbindgen_export, wasm.__wbindgen_export2)
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passArray8ToWasm0(bytes, wasm.__wbindgen_export)
    const len1 = WASM_VECTOR_LEN
    wasm.overlay_install_font(this.__wbg_ptr, ptr0, len0, ptr1, len1)
  }
  /**
   * Constructs an un-initialized overlay — `init` must follow before
   * `frame`. Split because wgpu init is async on wasm32.
   */
  constructor() {
    const ret = wasm.overlay_new()
    this.__wbg_ptr = ret
    OverlayFinalization.register(this, this.__wbg_ptr, this)
    return this
  }
  /**
   * Pushes a decoded video frame (WebCodecs → RGBA) into a media
   * widget's texture — the video hot path: one write_texture, no
   * bind-group rebuild, size changes recreate the slot.
   * @param {number} id
   * @param {Uint8Array} rgba
   * @param {number} w
   * @param {number} h
   */
  push_video_frame(id, rgba, w, h) {
    const ptr0 = passArray8ToWasm0(rgba, wasm.__wbindgen_export)
    const len0 = WASM_VECTOR_LEN
    wasm.overlay_push_video_frame(this.__wbg_ptr, id, ptr0, len0, w, h)
  }
  /**
   * Registers a media widget rect — media quads draw through the
   * textured pipeline; the id is shared with the slot table above.
   * Same signature family as `register_widget` but no kind — media
   * widgets are always textured quads.
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @returns {number}
   */
  register_media(x, y, w, h) {
    const ret = wasm.overlay_register_media(this.__wbg_ptr, x, y, w, h)
    return ret >>> 0
  }
  /**
   * Registers a widget region on the overlay. `kind` is a
   * `widgets::kinds` discriminant; the rect is canvas CSS px. Returns
   * a stable id for state pushes + teardown, 0 when the kind is
   * unknown or the GPU isn't live (bridge keeps its DOM fallback).
   * @param {number} kind
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @returns {number}
   */
  register_widget(kind, x, y, w, h) {
    const ret = wasm.overlay_register_widget(this.__wbg_ptr, kind, x, y, w, h)
    return ret >>> 0
  }
  /**
   * Reconfigures the surface + text viewport after a canvas resize.
   * `scale` is devicePixelRatio — text jobs stay in CSS px, glyphon
   * rasterizes at device px so glyphs stay crisp at 120Hz+.
   * @param {number} w
   * @param {number} h
   */
  resize(w, h) {
    wasm.overlay_resize(this.__wbg_ptr, w, h)
  }
  /**
   * Tells the overlay the canvas's CSS size — the bridge calls this
   * alongside `resize(device px)` so scissor math can convert widget
   * rects (CSS px) into surface pixels.
   * @param {number} w
   * @param {number} h
   */
  set_css_size(w, h) {
    wasm.overlay_set_css_size(this.__wbg_ptr, w, h)
  }
  /**
   * Registers/replaces a mirrored text node. Called on DOM content
   * change — not per frame. `id` is the bridge's stable slot for the
   * DOM node; re-calling with an existing id updates in place.
   * @param {number} id
   * @param {string} text
   * @param {number} x
   * @param {number} y
   * @param {number} size
   * @param {number} max_width_px
   * @param {string} family
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   * @param {number} bl
   * @param {number} bt
   * @param {number} br
   * @param {number} bb
   */
  set_text(id, text, x, y, size, max_width_px, family, r, g, b, a, bl, bt, br, bb) {
    const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export, wasm.__wbindgen_export2)
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passStringToWasm0(family, wasm.__wbindgen_export, wasm.__wbindgen_export2)
    const len1 = WASM_VECTOR_LEN
    wasm.overlay_set_text(
      this.__wbg_ptr,
      id,
      ptr0,
      len0,
      x,
      y,
      size,
      max_width_px,
      ptr1,
      len1,
      r,
      g,
      b,
      a,
      bl,
      bt,
      br,
      bb
    )
  }
  /**
   * Moves/resizes a widget region — the bridge calls this when the
   * DOM rect it mirrors moves (layout shift, resize, scroll of the
   * containing surface). The widget's own `res` uniform updates too
   * so shaders keep their original px-space math.
   * @param {number} id
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  set_widget_rect(id, x, y, w, h) {
    wasm.overlay_set_widget_rect(this.__wbg_ptr, id, x, y, w, h)
  }
  /**
   * Writes the widget's uniform block — raw f32s in the layout the
   * widget's `*.rs` documents. Called per state change (per frame for
   * time/progress, once per event for ripple/click stamps).
   * @param {number} id
   * @param {Float32Array} values
   */
  set_widget_uniform(id, values) {
    const ptr0 = passArrayF32ToWasm0(values, wasm.__wbindgen_export)
    const len0 = WASM_VECTOR_LEN
    wasm.overlay_set_widget_uniform(this.__wbg_ptr, id, ptr0, len0)
  }
  /**
   * Removes a widget — GPU resources drop with the handle.
   * @param {number} id
   */
  unregister_widget(id) {
    wasm.overlay_unregister_widget(this.__wbg_ptr, id)
  }
  /**
   * Uploads both flag textures (RGBA8) and finishes the flag bind
   * group. `tex2` may repeat `tex1` for non-split flags.
   * @param {number} id
   * @param {Uint8Array} rgba_a
   * @param {number} w_a
   * @param {number} h_a
   * @param {Uint8Array} rgba_b
   * @param {number} w_b
   * @param {number} h_b
   */
  upload_flag_textures(id, rgba_a, w_a, h_a, rgba_b, w_b, h_b) {
    const ptr0 = passArray8ToWasm0(rgba_a, wasm.__wbindgen_export)
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passArray8ToWasm0(rgba_b, wasm.__wbindgen_export)
    const len1 = WASM_VECTOR_LEN
    wasm.overlay_upload_flag_textures(
      this.__wbg_ptr,
      id,
      ptr0,
      len0,
      w_a,
      h_a,
      ptr1,
      len1,
      w_b,
      h_b
    )
  }
  /**
   * Decodes an image (jpeg/png/webp) in Rust and binds it to a media
   * widget — decode runs in wasm, off the main thread, no
   * createImageBitmap round trip. Returns false on decode failure so
   * the bridge keeps the DOM <img> (manifest-gated fallback).
   * @param {number} id
   * @param {Uint8Array} bytes
   * @returns {boolean}
   */
  upload_media_image(id, bytes) {
    const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export)
    const len0 = WASM_VECTOR_LEN
    const ret = wasm.overlay_upload_media_image(this.__wbg_ptr, id, ptr0, len0)
    return ret !== 0
  }
  /**
   * Writes the skeleton sheet — the per-rect vec4 fields the shader
   * loops (rects/meta/sbase/sink, `skeleton::RECT_FIELDS` per rect).
   * @param {number} id
   * @param {Float32Array} values
   */
  write_skel_sheet(id, values) {
    const ptr0 = passArrayF32ToWasm0(values, wasm.__wbindgen_export)
    const len0 = WASM_VECTOR_LEN
    wasm.overlay_write_skel_sheet(this.__wbg_ptr, id, ptr0, len0)
  }
}
if (Symbol.dispose) Overlay.prototype[Symbol.dispose] = Overlay.prototype.free
function __wbg_get_imports() {
  const import0 = {
    __proto__: null,
    __wbg_Window_0dc65f28a4345887: function (arg0) {
      const ret = getObject(arg0).Window
      return addHeapObject(ret)
    },
    __wbg_WorkerGlobalScope_262c8e34a919509f: function (arg0) {
      const ret = getObject(arg0).WorkerGlobalScope
      return addHeapObject(ret)
    },
    __wbg___wbindgen_boolean_get_5b446f51afd21013: function (arg0) {
      const v = getObject(arg0)
      const ret = typeof v === 'boolean' ? v : undefined
      return isLikeNone(ret) ? 0xffffff : ret ? 1 : 0
    },
    __wbg___wbindgen_debug_string_4687d8d8c2017d52: function (arg0, arg1) {
      const ret = debugString(getObject(arg1))
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2)
      const len1 = WASM_VECTOR_LEN
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true)
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true)
    },
    __wbg___wbindgen_is_function_1f9d30630b8b1d3d: function (arg0) {
      const ret = typeof getObject(arg0) === 'function'
      return ret
    },
    __wbg___wbindgen_is_null_e343b7d08827ba72: function (arg0) {
      const ret = getObject(arg0) === null
      return ret
    },
    __wbg___wbindgen_is_undefined_8865fb403f8fe9d8: function (arg0) {
      const ret = getObject(arg0) === undefined
      return ret
    },
    __wbg___wbindgen_number_get_2e0e7dee9f701a71: function (arg0, arg1) {
      const obj = getObject(arg1)
      const ret = typeof obj === 'number' ? obj : undefined
      getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true)
      getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true)
    },
    __wbg___wbindgen_string_get_0380ccaa2f57f0d9: function (arg0, arg1) {
      const obj = getObject(arg1)
      const ret = typeof obj === 'string' ? obj : undefined
      var ptr1 = isLikeNone(ret)
        ? 0
        : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2)
      var len1 = WASM_VECTOR_LEN
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true)
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true)
    },
    __wbg___wbindgen_throw_41e9ee4f547fc59a: function (arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1))
    },
    __wbg__wbg_cb_unref_dcc1a90847f04c41: function (arg0) {
      getObject(arg0)._wbg_cb_unref()
    },
    __wbg_activeTexture_11079673eac5c921: function (arg0, arg1) {
      getObject(arg0).activeTexture(arg1 >>> 0)
    },
    __wbg_activeTexture_2fad46c01cafe6b1: function (arg0, arg1) {
      getObject(arg0).activeTexture(arg1 >>> 0)
    },
    __wbg_attachShader_8920a5beea54aba7: function (arg0, arg1, arg2) {
      getObject(arg0).attachShader(getObject(arg1), getObject(arg2))
    },
    __wbg_attachShader_9567ae57af6746d5: function (arg0, arg1, arg2) {
      getObject(arg0).attachShader(getObject(arg1), getObject(arg2))
    },
    __wbg_beginQuery_eaee271e7ccd67d1: function (arg0, arg1, arg2) {
      getObject(arg0).beginQuery(arg1 >>> 0, getObject(arg2))
    },
    __wbg_beginRenderPass_1636be9bc8e33c43: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).beginRenderPass(getObject(arg1))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_bindAttribLocation_6a6f66cbe96ef24e: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).bindAttribLocation(
        getObject(arg1),
        arg2 >>> 0,
        getStringFromWasm0(arg3, arg4)
      )
    },
    __wbg_bindAttribLocation_ade0ee986a734cdf: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).bindAttribLocation(
        getObject(arg1),
        arg2 >>> 0,
        getStringFromWasm0(arg3, arg4)
      )
    },
    __wbg_bindBufferRange_a5aef3642afdabc8: function (arg0, arg1, arg2, arg3, arg4, arg5) {
      getObject(arg0).bindBufferRange(arg1 >>> 0, arg2 >>> 0, getObject(arg3), arg4, arg5)
    },
    __wbg_bindBuffer_0324f62b876c4403: function (arg0, arg1, arg2) {
      getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2))
    },
    __wbg_bindBuffer_2195e89b585ce0c3: function (arg0, arg1, arg2) {
      getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2))
    },
    __wbg_bindFramebuffer_22e4b8e6e6d8d0e8: function (arg0, arg1, arg2) {
      getObject(arg0).bindFramebuffer(arg1 >>> 0, getObject(arg2))
    },
    __wbg_bindFramebuffer_378eb18ef219d37a: function (arg0, arg1, arg2) {
      getObject(arg0).bindFramebuffer(arg1 >>> 0, getObject(arg2))
    },
    __wbg_bindRenderbuffer_db090531fb28de34: function (arg0, arg1, arg2) {
      getObject(arg0).bindRenderbuffer(arg1 >>> 0, getObject(arg2))
    },
    __wbg_bindRenderbuffer_e0c5aeef245a913a: function (arg0, arg1, arg2) {
      getObject(arg0).bindRenderbuffer(arg1 >>> 0, getObject(arg2))
    },
    __wbg_bindSampler_9b9743706aee71d1: function (arg0, arg1, arg2) {
      getObject(arg0).bindSampler(arg1 >>> 0, getObject(arg2))
    },
    __wbg_bindTexture_3cf008f256f3ed99: function (arg0, arg1, arg2) {
      getObject(arg0).bindTexture(arg1 >>> 0, getObject(arg2))
    },
    __wbg_bindTexture_613a47b8917a0ccd: function (arg0, arg1, arg2) {
      getObject(arg0).bindTexture(arg1 >>> 0, getObject(arg2))
    },
    __wbg_bindVertexArrayOES_3141815cb8234a6e: function (arg0, arg1) {
      getObject(arg0).bindVertexArrayOES(getObject(arg1))
    },
    __wbg_bindVertexArray_f58af0a346185ec5: function (arg0, arg1) {
      getObject(arg0).bindVertexArray(getObject(arg1))
    },
    __wbg_blendColor_68fc6d6454f2128d: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).blendColor(arg1, arg2, arg3, arg4)
    },
    __wbg_blendColor_a6256f41d1925899: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).blendColor(arg1, arg2, arg3, arg4)
    },
    __wbg_blendEquationSeparate_0a17fa4ea863d445: function (arg0, arg1, arg2) {
      getObject(arg0).blendEquationSeparate(arg1 >>> 0, arg2 >>> 0)
    },
    __wbg_blendEquationSeparate_fa2d4e5dde5ad8b3: function (arg0, arg1, arg2) {
      getObject(arg0).blendEquationSeparate(arg1 >>> 0, arg2 >>> 0)
    },
    __wbg_blendEquation_5fb8aee6a55cf900: function (arg0, arg1) {
      getObject(arg0).blendEquation(arg1 >>> 0)
    },
    __wbg_blendEquation_d21914e937b14896: function (arg0, arg1) {
      getObject(arg0).blendEquation(arg1 >>> 0)
    },
    __wbg_blendFuncSeparate_28abe082febb1a26: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0)
    },
    __wbg_blendFuncSeparate_2af9d47f7efc0452: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0)
    },
    __wbg_blendFunc_491ee1105079ce76: function (arg0, arg1, arg2) {
      getObject(arg0).blendFunc(arg1 >>> 0, arg2 >>> 0)
    },
    __wbg_blendFunc_589e4252bb396484: function (arg0, arg1, arg2) {
      getObject(arg0).blendFunc(arg1 >>> 0, arg2 >>> 0)
    },
    __wbg_blitFramebuffer_7b39bfec6cfece56: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5,
      arg6,
      arg7,
      arg8,
      arg9,
      arg10
    ) {
      getObject(arg0).blitFramebuffer(
        arg1,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7,
        arg8,
        arg9 >>> 0,
        arg10 >>> 0
      )
    },
    __wbg_bufferData_50f5eb06469330e4: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).bufferData(arg1 >>> 0, arg2, arg3 >>> 0)
    },
    __wbg_bufferData_53e0f7a06b58fe81: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).bufferData(arg1 >>> 0, getObject(arg2), arg3 >>> 0)
    },
    __wbg_bufferData_5fa44d94fe7a3878: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).bufferData(arg1 >>> 0, getObject(arg2), arg3 >>> 0)
    },
    __wbg_bufferData_bad7ce562b6a9eac: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).bufferData(arg1 >>> 0, arg2, arg3 >>> 0)
    },
    __wbg_bufferSubData_22c4c420e0f67cda: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).bufferSubData(arg1 >>> 0, arg2, getObject(arg3))
    },
    __wbg_bufferSubData_8609cd8a2c013181: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).bufferSubData(arg1 >>> 0, arg2, getObject(arg3))
    },
    __wbg_buffer_56ec2905a66f58b9: function (arg0) {
      const ret = getObject(arg0).buffer
      return addHeapObject(ret)
    },
    __wbg_call_187d372bd5fdd4aa: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_clearBufferfv_05f7fc7252e623eb: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).clearBufferfv(arg1 >>> 0, arg2, getArrayF32FromWasm0(arg3, arg4))
    },
    __wbg_clearBufferiv_e8e740accbd0f2df: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).clearBufferiv(arg1 >>> 0, arg2, getArrayI32FromWasm0(arg3, arg4))
    },
    __wbg_clearBufferuiv_e7f50f91f2195e38: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).clearBufferuiv(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4))
    },
    __wbg_clearDepth_4840a5497ae51286: function (arg0, arg1) {
      getObject(arg0).clearDepth(arg1)
    },
    __wbg_clearDepth_5a119c24c5d193bc: function (arg0, arg1) {
      getObject(arg0).clearDepth(arg1)
    },
    __wbg_clearStencil_1b8b8c727f598eec: function (arg0, arg1) {
      getObject(arg0).clearStencil(arg1)
    },
    __wbg_clearStencil_e4383e4a543e7997: function (arg0, arg1) {
      getObject(arg0).clearStencil(arg1)
    },
    __wbg_clear_175cf3cb6d98d72b: function (arg0, arg1) {
      getObject(arg0).clear(arg1 >>> 0)
    },
    __wbg_clear_cb96796cc568b7c8: function (arg0, arg1) {
      getObject(arg0).clear(arg1 >>> 0)
    },
    __wbg_clientWaitSync_73122aa040ce343d: function (arg0, arg1, arg2, arg3) {
      const ret = getObject(arg0).clientWaitSync(getObject(arg1), arg2 >>> 0, arg3 >>> 0)
      return ret
    },
    __wbg_colorMask_4d6afbbbc3022fbe: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0)
    },
    __wbg_colorMask_8c903995f6f873be: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0)
    },
    __wbg_compileShader_073a75409aaf96d2: function (arg0, arg1) {
      getObject(arg0).compileShader(getObject(arg1))
    },
    __wbg_compileShader_c2b53ff3a8851f60: function (arg0, arg1) {
      getObject(arg0).compileShader(getObject(arg1))
    },
    __wbg_compressedTexSubImage2D_4942a783e20221c2: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5,
      arg6,
      arg7,
      arg8
    ) {
      getObject(arg0).compressedTexSubImage2D(
        arg1 >>> 0,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7 >>> 0,
        getObject(arg8)
      )
    },
    __wbg_compressedTexSubImage2D_4c408678ff5f3056: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5,
      arg6,
      arg7,
      arg8,
      arg9
    ) {
      getObject(arg0).compressedTexSubImage2D(
        arg1 >>> 0,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7 >>> 0,
        arg8,
        arg9
      )
    },
    __wbg_compressedTexSubImage2D_80961cdbbd2b3aea: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5,
      arg6,
      arg7,
      arg8
    ) {
      getObject(arg0).compressedTexSubImage2D(
        arg1 >>> 0,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7 >>> 0,
        getObject(arg8)
      )
    },
    __wbg_compressedTexSubImage3D_1e0f86237d82f8b9: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5,
      arg6,
      arg7,
      arg8,
      arg9,
      arg10
    ) {
      getObject(arg0).compressedTexSubImage3D(
        arg1 >>> 0,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7,
        arg8,
        arg9 >>> 0,
        getObject(arg10)
      )
    },
    __wbg_compressedTexSubImage3D_682e402a0ac201ba: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5,
      arg6,
      arg7,
      arg8,
      arg9,
      arg10,
      arg11
    ) {
      getObject(arg0).compressedTexSubImage3D(
        arg1 >>> 0,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7,
        arg8,
        arg9 >>> 0,
        arg10,
        arg11
      )
    },
    __wbg_configure_a85ef99634672c4a: function () {
      return handleError(function (arg0, arg1) {
        getObject(arg0).configure(getObject(arg1))
      }, arguments)
    },
    __wbg_copyBufferSubData_e82219c4834bd9ae: function (arg0, arg1, arg2, arg3, arg4, arg5) {
      getObject(arg0).copyBufferSubData(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5)
    },
    __wbg_copyTexSubImage2D_455fba12cf4a776c: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5,
      arg6,
      arg7,
      arg8
    ) {
      getObject(arg0).copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8)
    },
    __wbg_copyTexSubImage2D_fe71e36efa520f37: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5,
      arg6,
      arg7,
      arg8
    ) {
      getObject(arg0).copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8)
    },
    __wbg_copyTexSubImage3D_717cd6c97934f2e6: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5,
      arg6,
      arg7,
      arg8,
      arg9
    ) {
      getObject(arg0).copyTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9)
    },
    __wbg_createBindGroupLayout_0f080b11fd4b5ffe: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).createBindGroupLayout(getObject(arg1))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_createBindGroup_4a548d28221a3724: function (arg0, arg1) {
      const ret = getObject(arg0).createBindGroup(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_createBuffer_d1dd23bf8704564c: function (arg0) {
      const ret = getObject(arg0).createBuffer()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createBuffer_de348fec3cfa3bd1: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).createBuffer(getObject(arg1))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_createBuffer_ffe613371d42cfd3: function (arg0) {
      const ret = getObject(arg0).createBuffer()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createCommandEncoder_f1ebf253171c6c1b: function (arg0, arg1) {
      const ret = getObject(arg0).createCommandEncoder(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_createFramebuffer_2c6b5b0f49c88e5d: function (arg0) {
      const ret = getObject(arg0).createFramebuffer()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createFramebuffer_d0969af4e9886297: function (arg0) {
      const ret = getObject(arg0).createFramebuffer()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createPipelineLayout_8d969fc745f20f23: function (arg0, arg1) {
      const ret = getObject(arg0).createPipelineLayout(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_createProgram_cbf448e6f18a9402: function (arg0) {
      const ret = getObject(arg0).createProgram()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createProgram_e0c81b0d2b8d0fd0: function (arg0) {
      const ret = getObject(arg0).createProgram()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createQuery_ec241083d0b36197: function (arg0) {
      const ret = getObject(arg0).createQuery()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createRenderPipeline_1dbdc88da325f5dc: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).createRenderPipeline(getObject(arg1))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_createRenderbuffer_2b17e9fe2e6fb4be: function (arg0) {
      const ret = getObject(arg0).createRenderbuffer()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createRenderbuffer_c864095d6ebd60d0: function (arg0) {
      const ret = getObject(arg0).createRenderbuffer()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createSampler_1b330d9da0c6523f: function (arg0) {
      const ret = getObject(arg0).createSampler()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createSampler_80b553fb1915ad98: function (arg0, arg1) {
      const ret = getObject(arg0).createSampler(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_createShaderModule_4a697f05633fc0d8: function (arg0, arg1) {
      const ret = getObject(arg0).createShaderModule(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_createShader_6c1a2295587878a5: function (arg0, arg1) {
      const ret = getObject(arg0).createShader(arg1 >>> 0)
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createShader_7c9d99a21ecb08c0: function (arg0, arg1) {
      const ret = getObject(arg0).createShader(arg1 >>> 0)
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createTexture_01e8e591b64237de: function (arg0) {
      const ret = getObject(arg0).createTexture()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createTexture_423ec5113612ebe8: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).createTexture(getObject(arg1))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_createTexture_5f2583508ebe379b: function (arg0) {
      const ret = getObject(arg0).createTexture()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createVertexArrayOES_a8dc8498b56df937: function (arg0) {
      const ret = getObject(arg0).createVertexArrayOES()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createVertexArray_b223ea69dd08fcab: function (arg0) {
      const ret = getObject(arg0).createVertexArray()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_createView_d928ef35cd04a244: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).createView(getObject(arg1))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_cullFace_12123c1c97f1ba2c: function (arg0, arg1) {
      getObject(arg0).cullFace(arg1 >>> 0)
    },
    __wbg_cullFace_1a01f0b6d5aeb687: function (arg0, arg1) {
      getObject(arg0).cullFace(arg1 >>> 0)
    },
    __wbg_deleteBuffer_070e58aaaf2a7a8b: function (arg0, arg1) {
      getObject(arg0).deleteBuffer(getObject(arg1))
    },
    __wbg_deleteBuffer_7775ee9e248c8468: function (arg0, arg1) {
      getObject(arg0).deleteBuffer(getObject(arg1))
    },
    __wbg_deleteFramebuffer_3f8ab330098bf8e6: function (arg0, arg1) {
      getObject(arg0).deleteFramebuffer(getObject(arg1))
    },
    __wbg_deleteFramebuffer_570d3b214a509fa2: function (arg0, arg1) {
      getObject(arg0).deleteFramebuffer(getObject(arg1))
    },
    __wbg_deleteProgram_822906f0368175d0: function (arg0, arg1) {
      getObject(arg0).deleteProgram(getObject(arg1))
    },
    __wbg_deleteProgram_b524b30ad176cdb4: function (arg0, arg1) {
      getObject(arg0).deleteProgram(getObject(arg1))
    },
    __wbg_deleteQuery_266895df9763e0b3: function (arg0, arg1) {
      getObject(arg0).deleteQuery(getObject(arg1))
    },
    __wbg_deleteRenderbuffer_826c9b43b7ea68f5: function (arg0, arg1) {
      getObject(arg0).deleteRenderbuffer(getObject(arg1))
    },
    __wbg_deleteRenderbuffer_f4e121a3ab21c605: function (arg0, arg1) {
      getObject(arg0).deleteRenderbuffer(getObject(arg1))
    },
    __wbg_deleteSampler_f8afded8bf215d53: function (arg0, arg1) {
      getObject(arg0).deleteSampler(getObject(arg1))
    },
    __wbg_deleteShader_a70f6cc1918d67eb: function (arg0, arg1) {
      getObject(arg0).deleteShader(getObject(arg1))
    },
    __wbg_deleteShader_da18a294158c2d15: function (arg0, arg1) {
      getObject(arg0).deleteShader(getObject(arg1))
    },
    __wbg_deleteSync_4f0be28b03f50495: function (arg0, arg1) {
      getObject(arg0).deleteSync(getObject(arg1))
    },
    __wbg_deleteTexture_78c170241204a466: function (arg0, arg1) {
      getObject(arg0).deleteTexture(getObject(arg1))
    },
    __wbg_deleteTexture_9f42750adb092e4f: function (arg0, arg1) {
      getObject(arg0).deleteTexture(getObject(arg1))
    },
    __wbg_deleteVertexArrayOES_e01f31634d466176: function (arg0, arg1) {
      getObject(arg0).deleteVertexArrayOES(getObject(arg1))
    },
    __wbg_deleteVertexArray_ca9768805d051d49: function (arg0, arg1) {
      getObject(arg0).deleteVertexArray(getObject(arg1))
    },
    __wbg_depthFunc_92e96d8f46a23300: function (arg0, arg1) {
      getObject(arg0).depthFunc(arg1 >>> 0)
    },
    __wbg_depthFunc_a41fb5adacb22e09: function (arg0, arg1) {
      getObject(arg0).depthFunc(arg1 >>> 0)
    },
    __wbg_depthMask_06ecff4d4514c38f: function (arg0, arg1) {
      getObject(arg0).depthMask(arg1 !== 0)
    },
    __wbg_depthMask_0d7c3dec3b8405ee: function (arg0, arg1) {
      getObject(arg0).depthMask(arg1 !== 0)
    },
    __wbg_depthRange_24c7969249461e8e: function (arg0, arg1, arg2) {
      getObject(arg0).depthRange(arg1, arg2)
    },
    __wbg_depthRange_6a4e169ccf314148: function (arg0, arg1, arg2) {
      getObject(arg0).depthRange(arg1, arg2)
    },
    __wbg_destroy_dff0d2e2d812bef3: function (arg0) {
      getObject(arg0).destroy()
    },
    __wbg_disableVertexAttribArray_11c9f11bee30c9d8: function (arg0, arg1) {
      getObject(arg0).disableVertexAttribArray(arg1 >>> 0)
    },
    __wbg_disableVertexAttribArray_c4c8af1f9e4120d4: function (arg0, arg1) {
      getObject(arg0).disableVertexAttribArray(arg1 >>> 0)
    },
    __wbg_disable_19fe787eccdf0272: function (arg0, arg1) {
      getObject(arg0).disable(arg1 >>> 0)
    },
    __wbg_disable_81b2cb5f8cea15ae: function (arg0, arg1) {
      getObject(arg0).disable(arg1 >>> 0)
    },
    __wbg_document_9854e03c05fc8834: function (arg0) {
      const ret = getObject(arg0).document
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_drawArraysInstancedANGLE_b76512b5abba6668: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).drawArraysInstancedANGLE(arg1 >>> 0, arg2, arg3, arg4)
    },
    __wbg_drawArraysInstanced_9b44aa78a087154d: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).drawArraysInstanced(arg1 >>> 0, arg2, arg3, arg4)
    },
    __wbg_drawArrays_08872e02fb57b847: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3)
    },
    __wbg_drawArrays_741af5c3f8db636f: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3)
    },
    __wbg_drawBuffersWEBGL_c1bc0bbfd584c9b2: function (arg0, arg1) {
      getObject(arg0).drawBuffersWEBGL(getObject(arg1))
    },
    __wbg_drawBuffers_7a58bd4729f7a1fc: function (arg0, arg1) {
      getObject(arg0).drawBuffers(getObject(arg1))
    },
    __wbg_drawElementsInstancedANGLE_c3fc0cfa9e29a1bc: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5
    ) {
      getObject(arg0).drawElementsInstancedANGLE(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5)
    },
    __wbg_drawElementsInstanced_d7c396aa034159b6: function (arg0, arg1, arg2, arg3, arg4, arg5) {
      getObject(arg0).drawElementsInstanced(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5)
    },
    __wbg_draw_144fe15cf5de8254: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).draw(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0)
    },
    __wbg_enableVertexAttribArray_1496b78a8dbab9fd: function (arg0, arg1) {
      getObject(arg0).enableVertexAttribArray(arg1 >>> 0)
    },
    __wbg_enableVertexAttribArray_d52693866bc8b8dd: function (arg0, arg1) {
      getObject(arg0).enableVertexAttribArray(arg1 >>> 0)
    },
    __wbg_enable_6eeb9c0e9b483cee: function (arg0, arg1) {
      getObject(arg0).enable(arg1 >>> 0)
    },
    __wbg_enable_cb4fc19b51148c37: function (arg0, arg1) {
      getObject(arg0).enable(arg1 >>> 0)
    },
    __wbg_endQuery_73863d04a795d520: function (arg0, arg1) {
      getObject(arg0).endQuery(arg1 >>> 0)
    },
    __wbg_end_68d2bd9f647a2a38: function (arg0) {
      getObject(arg0).end()
    },
    __wbg_fenceSync_330293024adb66bc: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).fenceSync(arg1 >>> 0, arg2 >>> 0)
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_finish_7d949e916fb756c0: function (arg0) {
      const ret = getObject(arg0).finish()
      return addHeapObject(ret)
    },
    __wbg_finish_7dc4e63765afdf59: function (arg0, arg1) {
      const ret = getObject(arg0).finish(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_flush_13b162660ad850d2: function (arg0) {
      getObject(arg0).flush()
    },
    __wbg_flush_a5ad38200881ac35: function (arg0) {
      getObject(arg0).flush()
    },
    __wbg_framebufferRenderbuffer_1c6337e0030411f3: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, getObject(arg4))
    },
    __wbg_framebufferRenderbuffer_f019e9231b142c0d: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, getObject(arg4))
    },
    __wbg_framebufferTexture2D_73c52f23ec33aa22: function (arg0, arg1, arg2, arg3, arg4, arg5) {
      getObject(arg0).framebufferTexture2D(
        arg1 >>> 0,
        arg2 >>> 0,
        arg3 >>> 0,
        getObject(arg4),
        arg5
      )
    },
    __wbg_framebufferTexture2D_caddefa1f767646e: function (arg0, arg1, arg2, arg3, arg4, arg5) {
      getObject(arg0).framebufferTexture2D(
        arg1 >>> 0,
        arg2 >>> 0,
        arg3 >>> 0,
        getObject(arg4),
        arg5
      )
    },
    __wbg_framebufferTextureLayer_1d5c0f0e3234e521: function (arg0, arg1, arg2, arg3, arg4, arg5) {
      getObject(arg0).framebufferTextureLayer(arg1 >>> 0, arg2 >>> 0, getObject(arg3), arg4, arg5)
    },
    __wbg_framebufferTextureMultiviewOVR_77f19224ff7be6ef: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5,
      arg6
    ) {
      getObject(arg0).framebufferTextureMultiviewOVR(
        arg1 >>> 0,
        arg2 >>> 0,
        getObject(arg3),
        arg4,
        arg5,
        arg6
      )
    },
    __wbg_frontFace_6751b4b97f997aeb: function (arg0, arg1) {
      getObject(arg0).frontFace(arg1 >>> 0)
    },
    __wbg_frontFace_b064adb15b6f3772: function (arg0, arg1) {
      getObject(arg0).frontFace(arg1 >>> 0)
    },
    __wbg_getBufferSubData_dd23246099b166d1: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).getBufferSubData(arg1 >>> 0, arg2, getObject(arg3))
    },
    __wbg_getContext_051324720aa5b7e8: function () {
      return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2), getObject(arg3))
        return isLikeNone(ret) ? 0 : addHeapObject(ret)
      }, arguments)
    },
    __wbg_getContext_189ce278aa985704: function () {
      return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2), getObject(arg3))
        return isLikeNone(ret) ? 0 : addHeapObject(ret)
      }, arguments)
    },
    __wbg_getContext_635e36719cad2623: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2))
        return isLikeNone(ret) ? 0 : addHeapObject(ret)
      }, arguments)
    },
    __wbg_getContext_e567868594d2e0c6: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2))
        return isLikeNone(ret) ? 0 : addHeapObject(ret)
      }, arguments)
    },
    __wbg_getCurrentTexture_a516a0b9b636961a: function () {
      return handleError(function (arg0) {
        const ret = getObject(arg0).getCurrentTexture()
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_getExtension_abfda2c5db286b07: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getExtension(getStringFromWasm0(arg1, arg2))
        return isLikeNone(ret) ? 0 : addHeapObject(ret)
      }, arguments)
    },
    __wbg_getIndexedParameter_0f49864473e337fa: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getIndexedParameter(arg1 >>> 0, arg2 >>> 0)
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_getMappedRange_3505c06e92dc304c: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getMappedRange(arg1, arg2)
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_getParameter_974595a6624c6c10: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).getParameter(arg1 >>> 0)
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_getParameter_a97f491753b05668: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).getParameter(arg1 >>> 0)
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_getPreferredCanvasFormat_78b186193f25cd47: function (arg0) {
      const ret = getObject(arg0).getPreferredCanvasFormat()
      return (__wbindgen_enum_GpuTextureFormat.indexOf(ret) + 1 || 96) - 1
    },
    __wbg_getProgramInfoLog_208fb1ff31006495: function (arg0, arg1, arg2) {
      const ret = getObject(arg1).getProgramInfoLog(getObject(arg2))
      var ptr1 = isLikeNone(ret)
        ? 0
        : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2)
      var len1 = WASM_VECTOR_LEN
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true)
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true)
    },
    __wbg_getProgramInfoLog_3276b294d6d42fe2: function (arg0, arg1, arg2) {
      const ret = getObject(arg1).getProgramInfoLog(getObject(arg2))
      var ptr1 = isLikeNone(ret)
        ? 0
        : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2)
      var len1 = WASM_VECTOR_LEN
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true)
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true)
    },
    __wbg_getProgramParameter_50bafab01cf88652: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0)
      return addHeapObject(ret)
    },
    __wbg_getProgramParameter_fc7124bb9fb7c675: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0)
      return addHeapObject(ret)
    },
    __wbg_getQueryParameter_937ba13f77db778f: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).getQueryParameter(getObject(arg1), arg2 >>> 0)
      return addHeapObject(ret)
    },
    __wbg_getShaderInfoLog_7e0cbba353ca95da: function (arg0, arg1, arg2) {
      const ret = getObject(arg1).getShaderInfoLog(getObject(arg2))
      var ptr1 = isLikeNone(ret)
        ? 0
        : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2)
      var len1 = WASM_VECTOR_LEN
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true)
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true)
    },
    __wbg_getShaderInfoLog_bb64c5a52df0b7a3: function (arg0, arg1, arg2) {
      const ret = getObject(arg1).getShaderInfoLog(getObject(arg2))
      var ptr1 = isLikeNone(ret)
        ? 0
        : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2)
      var len1 = WASM_VECTOR_LEN
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true)
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true)
    },
    __wbg_getShaderParameter_745acf10b8e45e31: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0)
      return addHeapObject(ret)
    },
    __wbg_getShaderParameter_e55ea9c456df5484: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0)
      return addHeapObject(ret)
    },
    __wbg_getSupportedExtensions_1459bad37860c0c3: function (arg0) {
      const ret = getObject(arg0).getSupportedExtensions()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_getSupportedProfiles_7b2acfa66b565d24: function (arg0) {
      const ret = getObject(arg0).getSupportedProfiles()
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_getSyncParameter_bb4be47b67bfa2f8: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).getSyncParameter(getObject(arg1), arg2 >>> 0)
      return addHeapObject(ret)
    },
    __wbg_getUniformBlockIndex_5e2252ceb34531a5: function (arg0, arg1, arg2, arg3) {
      const ret = getObject(arg0).getUniformBlockIndex(
        getObject(arg1),
        getStringFromWasm0(arg2, arg3)
      )
      return ret
    },
    __wbg_getUniformLocation_50ba45dade572703: function (arg0, arg1, arg2, arg3) {
      const ret = getObject(arg0).getUniformLocation(
        getObject(arg1),
        getStringFromWasm0(arg2, arg3)
      )
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_getUniformLocation_cb4e3e121235f91a: function (arg0, arg1, arg2, arg3) {
      const ret = getObject(arg0).getUniformLocation(
        getObject(arg1),
        getStringFromWasm0(arg2, arg3)
      )
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_get_fd12a9100976c296: function (arg0, arg1) {
      const ret = getObject(arg0)[arg1 >>> 0]
      return isLikeNone(ret) ? 0 : addHeapObject(ret)
    },
    __wbg_get_unchecked_288889d017702237: function (arg0, arg1) {
      const ret = getObject(arg0)[arg1 >>> 0]
      return addHeapObject(ret)
    },
    __wbg_gpu_03716d242aac2a7a: function (arg0) {
      const ret = getObject(arg0).gpu
      return addHeapObject(ret)
    },
    __wbg_height_fc97e1a0c2e7331f: function (arg0) {
      const ret = getObject(arg0).height
      return ret
    },
    __wbg_includes_9b0dfa946c313621: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).includes(getObject(arg1), arg2)
      return ret
    },
    __wbg_instanceof_GpuAdapter_331cc7dcda68de8c: function (arg0) {
      let result
      try {
        result = getObject(arg0) instanceof GPUAdapter
      } catch (_) {
        result = false
      }
      const ret = result
      return ret
    },
    __wbg_instanceof_GpuCanvasContext_4ea475a10f693c29: function (arg0) {
      let result
      try {
        result = getObject(arg0) instanceof GPUCanvasContext
      } catch (_) {
        result = false
      }
      const ret = result
      return ret
    },
    __wbg_instanceof_HtmlCanvasElement_0a30c11fbbf41841: function (arg0) {
      let result
      try {
        result = getObject(arg0) instanceof HTMLCanvasElement
      } catch (_) {
        result = false
      }
      const ret = result
      return ret
    },
    __wbg_instanceof_WebGl2RenderingContext_64c994c14c0790fb: function (arg0) {
      let result
      try {
        result = getObject(arg0) instanceof WebGL2RenderingContext
      } catch (_) {
        result = false
      }
      const ret = result
      return ret
    },
    __wbg_instanceof_Window_82d71df4eddf88bc: function (arg0) {
      let result
      try {
        result = getObject(arg0) instanceof Window
      } catch (_) {
        result = false
      }
      const ret = result
      return ret
    },
    __wbg_invalidateFramebuffer_4f576db65bb37d6a: function () {
      return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).invalidateFramebuffer(arg1 >>> 0, getObject(arg2))
      }, arguments)
    },
    __wbg_is_4b278c0bd3caba97: function (arg0, arg1) {
      const ret = Object.is(getObject(arg0), getObject(arg1))
      return ret
    },
    __wbg_label_9850c9fa8a462e67: function (arg0, arg1) {
      const ret = getObject(arg1).label
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2)
      const len1 = WASM_VECTOR_LEN
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true)
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true)
    },
    __wbg_length_7f3c00c40364105e: function (arg0) {
      const ret = getObject(arg0).length
      return ret
    },
    __wbg_length_d4bdea10311bd9cf: function (arg0) {
      const ret = getObject(arg0).length
      return ret
    },
    __wbg_limits_ea41c3962a6b95bc: function (arg0) {
      const ret = getObject(arg0).limits
      return addHeapObject(ret)
    },
    __wbg_linkProgram_571a9ea00d38ff83: function (arg0, arg1) {
      getObject(arg0).linkProgram(getObject(arg1))
    },
    __wbg_linkProgram_acdc299c43d734a0: function (arg0, arg1) {
      getObject(arg0).linkProgram(getObject(arg1))
    },
    __wbg_maxBindGroups_2bf4f99a58a6309f: function (arg0) {
      const ret = getObject(arg0).maxBindGroups
      return ret
    },
    __wbg_maxBindingsPerBindGroup_dacc570aa61d0dca: function (arg0) {
      const ret = getObject(arg0).maxBindingsPerBindGroup
      return ret
    },
    __wbg_maxBufferSize_99fc9443bb4067ba: function (arg0) {
      const ret = getObject(arg0).maxBufferSize
      return ret
    },
    __wbg_maxColorAttachmentBytesPerSample_2da4920e0acebc0e: function (arg0) {
      const ret = getObject(arg0).maxColorAttachmentBytesPerSample
      return ret
    },
    __wbg_maxColorAttachments_bebac93064a9d843: function (arg0) {
      const ret = getObject(arg0).maxColorAttachments
      return ret
    },
    __wbg_maxComputeInvocationsPerWorkgroup_ccd6b7df84154e21: function (arg0) {
      const ret = getObject(arg0).maxComputeInvocationsPerWorkgroup
      return ret
    },
    __wbg_maxComputeWorkgroupSizeX_0e4f5019b8ab256e: function (arg0) {
      const ret = getObject(arg0).maxComputeWorkgroupSizeX
      return ret
    },
    __wbg_maxComputeWorkgroupSizeY_8276aa965a003c45: function (arg0) {
      const ret = getObject(arg0).maxComputeWorkgroupSizeY
      return ret
    },
    __wbg_maxComputeWorkgroupSizeZ_977746dd442595bd: function (arg0) {
      const ret = getObject(arg0).maxComputeWorkgroupSizeZ
      return ret
    },
    __wbg_maxComputeWorkgroupStorageSize_ce16b9d5d8733780: function (arg0) {
      const ret = getObject(arg0).maxComputeWorkgroupStorageSize
      return ret
    },
    __wbg_maxComputeWorkgroupsPerDimension_3b7b8e447a68f678: function (arg0) {
      const ret = getObject(arg0).maxComputeWorkgroupsPerDimension
      return ret
    },
    __wbg_maxDynamicStorageBuffersPerPipelineLayout_8355a4388945b17c: function (arg0) {
      const ret = getObject(arg0).maxDynamicStorageBuffersPerPipelineLayout
      return ret
    },
    __wbg_maxDynamicUniformBuffersPerPipelineLayout_977505074842a93f: function (arg0) {
      const ret = getObject(arg0).maxDynamicUniformBuffersPerPipelineLayout
      return ret
    },
    __wbg_maxSampledTexturesPerShaderStage_e946a03f2f1039de: function (arg0) {
      const ret = getObject(arg0).maxSampledTexturesPerShaderStage
      return ret
    },
    __wbg_maxSamplersPerShaderStage_14d367c8faabd3bc: function (arg0) {
      const ret = getObject(arg0).maxSamplersPerShaderStage
      return ret
    },
    __wbg_maxStorageBufferBindingSize_4a8221c2bde16572: function (arg0) {
      const ret = getObject(arg0).maxStorageBufferBindingSize
      return ret
    },
    __wbg_maxStorageBuffersPerShaderStage_0f46960801ff4626: function (arg0) {
      const ret = getObject(arg0).maxStorageBuffersPerShaderStage
      return ret
    },
    __wbg_maxStorageTexturesPerShaderStage_55c540c36a9a8670: function (arg0) {
      const ret = getObject(arg0).maxStorageTexturesPerShaderStage
      return ret
    },
    __wbg_maxTextureArrayLayers_ff0524af946d2147: function (arg0) {
      const ret = getObject(arg0).maxTextureArrayLayers
      return ret
    },
    __wbg_maxTextureDimension1D_7e7b3134d878963f: function (arg0) {
      const ret = getObject(arg0).maxTextureDimension1D
      return ret
    },
    __wbg_maxTextureDimension2D_4cebfd3132f9db9c: function (arg0) {
      const ret = getObject(arg0).maxTextureDimension2D
      return ret
    },
    __wbg_maxTextureDimension3D_487f24962e39588f: function (arg0) {
      const ret = getObject(arg0).maxTextureDimension3D
      return ret
    },
    __wbg_maxUniformBufferBindingSize_a7c5e53f603450e4: function (arg0) {
      const ret = getObject(arg0).maxUniformBufferBindingSize
      return ret
    },
    __wbg_maxUniformBuffersPerShaderStage_b4a0c0df66ad558d: function (arg0) {
      const ret = getObject(arg0).maxUniformBuffersPerShaderStage
      return ret
    },
    __wbg_maxVertexAttributes_6561757d6b756306: function (arg0) {
      const ret = getObject(arg0).maxVertexAttributes
      return ret
    },
    __wbg_maxVertexBufferArrayStride_32ac993891416ff9: function (arg0) {
      const ret = getObject(arg0).maxVertexBufferArrayStride
      return ret
    },
    __wbg_maxVertexBuffers_933477de1b5f4825: function (arg0) {
      const ret = getObject(arg0).maxVertexBuffers
      return ret
    },
    __wbg_minStorageBufferOffsetAlignment_e1f616695b1de18f: function (arg0) {
      const ret = getObject(arg0).minStorageBufferOffsetAlignment
      return ret
    },
    __wbg_minUniformBufferOffsetAlignment_c3f7877c57eab7a0: function (arg0) {
      const ret = getObject(arg0).minUniformBufferOffsetAlignment
      return ret
    },
    __wbg_navigator_2156486643462a87: function (arg0) {
      const ret = getObject(arg0).navigator
      return addHeapObject(ret)
    },
    __wbg_navigator_c9bce48d4b578c9c: function (arg0) {
      const ret = getObject(arg0).navigator
      return addHeapObject(ret)
    },
    __wbg_new_617a8cdb8bb1130e: function () {
      const ret = new Object()
      return addHeapObject(ret)
    },
    __wbg_new_ee2291f50781bf1d: function () {
      const ret = new Array()
      return addHeapObject(ret)
    },
    __wbg_new_from_slice_9a868026ffa4208a: function (arg0, arg1) {
      const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1))
      return addHeapObject(ret)
    },
    __wbg_new_typed_b01cb72a8af741a3: function (arg0, arg1) {
      try {
        var state0 = { a: arg0, b: arg1 }
        var cb0 = (arg0, arg1) => {
          const a = state0.a
          state0.a = 0
          try {
            return __wasm_bindgen_func_elem_7711(a, state0.b, arg0, arg1)
          } finally {
            state0.a = a
          }
        }
        const ret = new Promise(cb0)
        return addHeapObject(ret)
      } finally {
        state0.a = 0
      }
    },
    __wbg_new_with_byte_offset_and_length_2f5d7fc2a828b74d: function (arg0, arg1, arg2) {
      const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0)
      return addHeapObject(ret)
    },
    __wbg_of_d5dbecdc59e02e34: function (arg0) {
      const ret = Array.of(getObject(arg0))
      return addHeapObject(ret)
    },
    __wbg_pixelStorei_af18e636b3e7b725: function (arg0, arg1, arg2) {
      getObject(arg0).pixelStorei(arg1 >>> 0, arg2)
    },
    __wbg_pixelStorei_cb4e43466f5b8703: function (arg0, arg1, arg2) {
      getObject(arg0).pixelStorei(arg1 >>> 0, arg2)
    },
    __wbg_polygonOffset_81dc8ca84e29572b: function (arg0, arg1, arg2) {
      getObject(arg0).polygonOffset(arg1, arg2)
    },
    __wbg_polygonOffset_8f922d9173d8849d: function (arg0, arg1, arg2) {
      getObject(arg0).polygonOffset(arg1, arg2)
    },
    __wbg_prototypesetcall_bc27214492979395: function (arg0, arg1, arg2) {
      Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), getObject(arg2))
    },
    __wbg_push_2baf45db356cf468: function (arg0, arg1) {
      const ret = getObject(arg0).push(getObject(arg1))
      return ret
    },
    __wbg_queryCounterEXT_9016a6ffa350b4b2: function (arg0, arg1, arg2) {
      getObject(arg0).queryCounterEXT(getObject(arg1), arg2 >>> 0)
    },
    __wbg_querySelectorAll_6aebfe3df1fb2014: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).querySelectorAll(getStringFromWasm0(arg1, arg2))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_querySelector_ecbc2550705b235f: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).querySelector(getStringFromWasm0(arg1, arg2))
        return isLikeNone(ret) ? 0 : addHeapObject(ret)
      }, arguments)
    },
    __wbg_queueMicrotask_9833f9a49df95a49: function (arg0) {
      const ret = getObject(arg0).queueMicrotask
      return addHeapObject(ret)
    },
    __wbg_queueMicrotask_a72f977e97f23c5f: function (arg0) {
      queueMicrotask(getObject(arg0))
    },
    __wbg_queue_7fafbac0ddb6c670: function (arg0) {
      const ret = getObject(arg0).queue
      return addHeapObject(ret)
    },
    __wbg_readBuffer_b5d9a34a2f3d20d5: function (arg0, arg1) {
      getObject(arg0).readBuffer(arg1 >>> 0)
    },
    __wbg_readPixels_31e44e70558ac590: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        getObject(arg0).readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, getObject(arg7))
      }, arguments)
    },
    __wbg_readPixels_3321086a7818a739: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        getObject(arg0).readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, getObject(arg7))
      }, arguments)
    },
    __wbg_readPixels_eb030cd9976eeca5: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        getObject(arg0).readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7)
      }, arguments)
    },
    __wbg_renderbufferStorageMultisample_ed16f3ef446e3bc7: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5
    ) {
      getObject(arg0).renderbufferStorageMultisample(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5)
    },
    __wbg_renderbufferStorage_52b131bbf3112b3a: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4)
    },
    __wbg_renderbufferStorage_bca487b0dea425b8: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4)
    },
    __wbg_requestAdapter_dc3b730968f39ede: function (arg0, arg1) {
      const ret = getObject(arg0).requestAdapter(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_requestDevice_0666fa181666d96b: function (arg0, arg1) {
      const ret = getObject(arg0).requestDevice(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_resolve_0076e10020304ede: function (arg0) {
      const ret = Promise.resolve(getObject(arg0))
      return addHeapObject(ret)
    },
    __wbg_samplerParameterf_2d62cb907392e2d6: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).samplerParameterf(getObject(arg1), arg2 >>> 0, arg3)
    },
    __wbg_samplerParameteri_a5615e67ed0b654b: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).samplerParameteri(getObject(arg1), arg2 >>> 0, arg3)
    },
    __wbg_scissor_12ddc324094acd50: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).scissor(arg1, arg2, arg3, arg4)
    },
    __wbg_scissor_a9468482697c2bdb: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).scissor(arg1, arg2, arg3, arg4)
    },
    __wbg_setBindGroup_1e20fc6d5b3ffe60: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).setBindGroup(
          arg1 >>> 0,
          getObject(arg2),
          getArrayU32FromWasm0(arg3, arg4),
          arg5,
          arg6 >>> 0
        )
      }, arguments)
    },
    __wbg_setBindGroup_3e9afe0921b76fc0: function (arg0, arg1, arg2) {
      getObject(arg0).setBindGroup(arg1 >>> 0, getObject(arg2))
    },
    __wbg_setPipeline_88a119262ecbb240: function (arg0, arg1) {
      getObject(arg0).setPipeline(getObject(arg1))
    },
    __wbg_setScissorRect_2162009921a7d37e: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).setScissorRect(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0)
    },
    __wbg_setVertexBuffer_6a8d07ae366fb470: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).setVertexBuffer(arg1 >>> 0, getObject(arg2), arg3)
    },
    __wbg_setVertexBuffer_8538c8d57ff796e6: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).setVertexBuffer(arg1 >>> 0, getObject(arg2), arg3, arg4)
    },
    __wbg_set_145a351398b48c65: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2))
        return ret
      }, arguments)
    },
    __wbg_set_34d08fd992d43d61: function (arg0, arg1, arg2) {
      getObject(arg0).set(getObject(arg1), arg2 >>> 0)
    },
    __wbg_set_a_0e9ffd7edfa8a9f0: function (arg0, arg1) {
      getObject(arg0).a = arg1
    },
    __wbg_set_access_3a025015b8de87b2: function (arg0, arg1) {
      getObject(arg0).access = __wbindgen_enum_GpuStorageTextureAccess[arg1]
    },
    __wbg_set_address_mode_u_a09823787fe8d44a: function (arg0, arg1) {
      getObject(arg0).addressModeU = __wbindgen_enum_GpuAddressMode[arg1]
    },
    __wbg_set_address_mode_v_ba2b151a62621475: function (arg0, arg1) {
      getObject(arg0).addressModeV = __wbindgen_enum_GpuAddressMode[arg1]
    },
    __wbg_set_address_mode_w_4454e22a72f0df4c: function (arg0, arg1) {
      getObject(arg0).addressModeW = __wbindgen_enum_GpuAddressMode[arg1]
    },
    __wbg_set_alpha_658ed1dfc4154d22: function (arg0, arg1) {
      getObject(arg0).alpha = getObject(arg1)
    },
    __wbg_set_alpha_mode_d40fc95f2f0a65b8: function (arg0, arg1) {
      getObject(arg0).alphaMode = __wbindgen_enum_GpuCanvasAlphaMode[arg1]
    },
    __wbg_set_alpha_to_coverage_enabled_627ce591dddc23f7: function (arg0, arg1) {
      getObject(arg0).alphaToCoverageEnabled = arg1 !== 0
    },
    __wbg_set_array_layer_count_372c4a910f9741ae: function (arg0, arg1) {
      getObject(arg0).arrayLayerCount = arg1 >>> 0
    },
    __wbg_set_array_stride_aa1d7ec2f2866247: function (arg0, arg1) {
      getObject(arg0).arrayStride = arg1
    },
    __wbg_set_aspect_c490b83df964e769: function (arg0, arg1) {
      getObject(arg0).aspect = __wbindgen_enum_GpuTextureAspect[arg1]
    },
    __wbg_set_attributes_6d60f4f903a301a8: function (arg0, arg1) {
      getObject(arg0).attributes = getObject(arg1)
    },
    __wbg_set_b_fb8e7191ce2f917c: function (arg0, arg1) {
      getObject(arg0).b = arg1
    },
    __wbg_set_base_array_layer_2ab45d90e7a581f7: function (arg0, arg1) {
      getObject(arg0).baseArrayLayer = arg1 >>> 0
    },
    __wbg_set_base_mip_level_2ae99b85d1e778e9: function (arg0, arg1) {
      getObject(arg0).baseMipLevel = arg1 >>> 0
    },
    __wbg_set_beginning_of_pass_write_index_1997e8ae19580364: function (arg0, arg1) {
      getObject(arg0).beginningOfPassWriteIndex = arg1 >>> 0
    },
    __wbg_set_bind_group_layouts_2a3fbfe6301f7cc2: function (arg0, arg1) {
      getObject(arg0).bindGroupLayouts = getObject(arg1)
    },
    __wbg_set_binding_6c7ed77073549aaa: function (arg0, arg1) {
      getObject(arg0).binding = arg1 >>> 0
    },
    __wbg_set_binding_799d4a2ff61a29c4: function (arg0, arg1) {
      getObject(arg0).binding = arg1 >>> 0
    },
    __wbg_set_blend_8b5f0206031032b9: function (arg0, arg1) {
      getObject(arg0).blend = getObject(arg1)
    },
    __wbg_set_buffer_4564be0900c8093c: function (arg0, arg1) {
      getObject(arg0).buffer = getObject(arg1)
    },
    __wbg_set_buffer_52ccf9f23c8c8d74: function (arg0, arg1) {
      getObject(arg0).buffer = getObject(arg1)
    },
    __wbg_set_buffers_894c092e99bf8541: function (arg0, arg1) {
      getObject(arg0).buffers = getObject(arg1)
    },
    __wbg_set_bytes_per_row_1cfe3bbc2f242df7: function (arg0, arg1) {
      getObject(arg0).bytesPerRow = arg1 >>> 0
    },
    __wbg_set_clear_value_c6eaca1e9b16e209: function (arg0, arg1) {
      getObject(arg0).clearValue = getObject(arg1)
    },
    __wbg_set_code_22962864d78928e2: function (arg0, arg1, arg2) {
      getObject(arg0).code = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_color_attachments_f027806af3f83980: function (arg0, arg1) {
      getObject(arg0).colorAttachments = getObject(arg1)
    },
    __wbg_set_color_c1b12d789a2ea5d0: function (arg0, arg1) {
      getObject(arg0).color = getObject(arg1)
    },
    __wbg_set_compare_1807a293c48e067f: function (arg0, arg1) {
      getObject(arg0).compare = __wbindgen_enum_GpuCompareFunction[arg1]
    },
    __wbg_set_compare_624c2c00fd10c924: function (arg0, arg1) {
      getObject(arg0).compare = __wbindgen_enum_GpuCompareFunction[arg1]
    },
    __wbg_set_count_c6179bb884c328ef: function (arg0, arg1) {
      getObject(arg0).count = arg1 >>> 0
    },
    __wbg_set_cull_mode_3233e59624672d4e: function (arg0, arg1) {
      getObject(arg0).cullMode = __wbindgen_enum_GpuCullMode[arg1]
    },
    __wbg_set_depth_bias_6e7bad3a03bae686: function (arg0, arg1) {
      getObject(arg0).depthBias = arg1
    },
    __wbg_set_depth_bias_clamp_c3e46e20b1319eb6: function (arg0, arg1) {
      getObject(arg0).depthBiasClamp = arg1
    },
    __wbg_set_depth_bias_slope_scale_e4faf95c5d1e38a2: function (arg0, arg1) {
      getObject(arg0).depthBiasSlopeScale = arg1
    },
    __wbg_set_depth_clear_value_22ac16071c012963: function (arg0, arg1) {
      getObject(arg0).depthClearValue = arg1
    },
    __wbg_set_depth_compare_7f7567a7e8d2a20f: function (arg0, arg1) {
      getObject(arg0).depthCompare = __wbindgen_enum_GpuCompareFunction[arg1]
    },
    __wbg_set_depth_fail_op_36618aa2c112a8b4: function (arg0, arg1) {
      getObject(arg0).depthFailOp = __wbindgen_enum_GpuStencilOperation[arg1]
    },
    __wbg_set_depth_load_op_6c5eb58390842042: function (arg0, arg1) {
      getObject(arg0).depthLoadOp = __wbindgen_enum_GpuLoadOp[arg1]
    },
    __wbg_set_depth_or_array_layers_d021b9602446c0c8: function (arg0, arg1) {
      getObject(arg0).depthOrArrayLayers = arg1 >>> 0
    },
    __wbg_set_depth_read_only_9df48fdffe0aa66e: function (arg0, arg1) {
      getObject(arg0).depthReadOnly = arg1 !== 0
    },
    __wbg_set_depth_stencil_7c07649e913ec16e: function (arg0, arg1) {
      getObject(arg0).depthStencil = getObject(arg1)
    },
    __wbg_set_depth_stencil_attachment_de6bf51d002eb908: function (arg0, arg1) {
      getObject(arg0).depthStencilAttachment = getObject(arg1)
    },
    __wbg_set_depth_store_op_bb2ba04b36c7bdd9: function (arg0, arg1) {
      getObject(arg0).depthStoreOp = __wbindgen_enum_GpuStoreOp[arg1]
    },
    __wbg_set_depth_write_enabled_c0ecc7101fe87bf8: function (arg0, arg1) {
      getObject(arg0).depthWriteEnabled = arg1 !== 0
    },
    __wbg_set_device_c7cc69d60d9cf106: function (arg0, arg1) {
      getObject(arg0).device = getObject(arg1)
    },
    __wbg_set_dimension_7f0364deea72ace0: function (arg0, arg1) {
      getObject(arg0).dimension = __wbindgen_enum_GpuTextureViewDimension[arg1]
    },
    __wbg_set_dimension_b140d4ffc52ab9f4: function (arg0, arg1) {
      getObject(arg0).dimension = __wbindgen_enum_GpuTextureDimension[arg1]
    },
    __wbg_set_dst_factor_53d01078ea67659a: function (arg0, arg1) {
      getObject(arg0).dstFactor = __wbindgen_enum_GpuBlendFactor[arg1]
    },
    __wbg_set_end_of_pass_write_index_52644fc3d56949b1: function (arg0, arg1) {
      getObject(arg0).endOfPassWriteIndex = arg1 >>> 0
    },
    __wbg_set_entries_e5ad285e3289950f: function (arg0, arg1) {
      getObject(arg0).entries = getObject(arg1)
    },
    __wbg_set_entries_e8be1c8eb246cf26: function (arg0, arg1) {
      getObject(arg0).entries = getObject(arg1)
    },
    __wbg_set_entry_point_519259f79c5a8e4d: function (arg0, arg1, arg2) {
      getObject(arg0).entryPoint = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_entry_point_d4b0da956bd6b2ba: function (arg0, arg1, arg2) {
      getObject(arg0).entryPoint = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_fail_op_9d9650df23ba2111: function (arg0, arg1) {
      getObject(arg0).failOp = __wbindgen_enum_GpuStencilOperation[arg1]
    },
    __wbg_set_format_0e52ea7b9384ac6b: function (arg0, arg1) {
      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1]
    },
    __wbg_set_format_1ed4e12702593d8e: function (arg0, arg1) {
      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1]
    },
    __wbg_set_format_423f8c1de58d873f: function (arg0, arg1) {
      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1]
    },
    __wbg_set_format_4f6e506395604296: function (arg0, arg1) {
      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1]
    },
    __wbg_set_format_672708c6c96d3a04: function (arg0, arg1) {
      getObject(arg0).format = __wbindgen_enum_GpuVertexFormat[arg1]
    },
    __wbg_set_format_7c2a49ba44065a80: function (arg0, arg1) {
      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1]
    },
    __wbg_set_format_db451b4d880fc239: function (arg0, arg1) {
      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1]
    },
    __wbg_set_fragment_6d9f8c36b406d9b4: function (arg0, arg1) {
      getObject(arg0).fragment = getObject(arg1)
    },
    __wbg_set_front_face_dc4795f2754276bf: function (arg0, arg1) {
      getObject(arg0).frontFace = __wbindgen_enum_GpuFrontFace[arg1]
    },
    __wbg_set_g_5fbc9fad3ad27a7c: function (arg0, arg1) {
      getObject(arg0).g = arg1
    },
    __wbg_set_has_dynamic_offset_b5f5f44b752da2e2: function (arg0, arg1) {
      getObject(arg0).hasDynamicOffset = arg1 !== 0
    },
    __wbg_set_height_c9789c1c77eaedff: function (arg0, arg1) {
      getObject(arg0).height = arg1 >>> 0
    },
    __wbg_set_height_fc3358fe68410392: function (arg0, arg1) {
      getObject(arg0).height = arg1 >>> 0
    },
    __wbg_set_height_fde391767df1ce27: function (arg0, arg1) {
      getObject(arg0).height = arg1 >>> 0
    },
    __wbg_set_label_021ea25609809a07: function (arg0, arg1, arg2) {
      getObject(arg0).label = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_label_415b065ec3fb4f48: function (arg0, arg1, arg2) {
      getObject(arg0).label = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_label_5fa4c422680863eb: function (arg0, arg1, arg2) {
      getObject(arg0).label = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_label_7b502181277e1279: function (arg0, arg1, arg2) {
      getObject(arg0).label = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_label_8b2b2c1877722f9a: function (arg0, arg1, arg2) {
      getObject(arg0).label = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_label_8d581de453b70e55: function (arg0, arg1, arg2) {
      getObject(arg0).label = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_label_9bd0253bfeba31f3: function (arg0, arg1, arg2) {
      getObject(arg0).label = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_label_b096894575aaba1e: function (arg0, arg1, arg2) {
      getObject(arg0).label = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_label_b5b02ca1f89a90ec: function (arg0, arg1, arg2) {
      getObject(arg0).label = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_label_d775c1defc56c544: function (arg0, arg1, arg2) {
      getObject(arg0).label = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_label_e426b73942527b8e: function (arg0, arg1, arg2) {
      getObject(arg0).label = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_label_f20461bed18e52e3: function (arg0, arg1, arg2) {
      getObject(arg0).label = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_label_f6a207f7f83dc626: function (arg0, arg1, arg2) {
      getObject(arg0).label = getStringFromWasm0(arg1, arg2)
    },
    __wbg_set_layout_34c410044847aa48: function (arg0, arg1) {
      getObject(arg0).layout = getObject(arg1)
    },
    __wbg_set_layout_61b88e458ca5dc7d: function (arg0, arg1) {
      getObject(arg0).layout = getObject(arg1)
    },
    __wbg_set_load_op_5b310bb9c61eb1d5: function (arg0, arg1) {
      getObject(arg0).loadOp = __wbindgen_enum_GpuLoadOp[arg1]
    },
    __wbg_set_lod_max_clamp_83c3eaae40b5d729: function (arg0, arg1) {
      getObject(arg0).lodMaxClamp = arg1
    },
    __wbg_set_lod_min_clamp_c13c1046f64fccaa: function (arg0, arg1) {
      getObject(arg0).lodMinClamp = arg1
    },
    __wbg_set_mag_filter_b34a0f82f66fd504: function (arg0, arg1) {
      getObject(arg0).magFilter = __wbindgen_enum_GpuFilterMode[arg1]
    },
    __wbg_set_mapped_at_creation_461c27df7c64ac7b: function (arg0, arg1) {
      getObject(arg0).mappedAtCreation = arg1 !== 0
    },
    __wbg_set_mask_16f0fb977a077e6d: function (arg0, arg1) {
      getObject(arg0).mask = arg1 >>> 0
    },
    __wbg_set_max_anisotropy_33280b9303d377c0: function (arg0, arg1) {
      getObject(arg0).maxAnisotropy = arg1
    },
    __wbg_set_min_binding_size_2fd83a7bce6fc84a: function (arg0, arg1) {
      getObject(arg0).minBindingSize = arg1
    },
    __wbg_set_min_filter_18e71b62b66d6a52: function (arg0, arg1) {
      getObject(arg0).minFilter = __wbindgen_enum_GpuFilterMode[arg1]
    },
    __wbg_set_mip_level_1df7434229448f62: function (arg0, arg1) {
      getObject(arg0).mipLevel = arg1 >>> 0
    },
    __wbg_set_mip_level_count_9cfaadd4d97253b4: function (arg0, arg1) {
      getObject(arg0).mipLevelCount = arg1 >>> 0
    },
    __wbg_set_mip_level_count_cc06dd5cc8da32fa: function (arg0, arg1) {
      getObject(arg0).mipLevelCount = arg1 >>> 0
    },
    __wbg_set_mipmap_filter_37622626d458c955: function (arg0, arg1) {
      getObject(arg0).mipmapFilter = __wbindgen_enum_GpuMipmapFilterMode[arg1]
    },
    __wbg_set_module_1bff0ef07bc49331: function (arg0, arg1) {
      getObject(arg0).module = getObject(arg1)
    },
    __wbg_set_module_574e5aee4331f373: function (arg0, arg1) {
      getObject(arg0).module = getObject(arg1)
    },
    __wbg_set_multisample_f57845304ba73461: function (arg0, arg1) {
      getObject(arg0).multisample = getObject(arg1)
    },
    __wbg_set_multisampled_935682e740c8dac5: function (arg0, arg1) {
      getObject(arg0).multisampled = arg1 !== 0
    },
    __wbg_set_offset_0a36ff790807cdfd: function (arg0, arg1) {
      getObject(arg0).offset = arg1
    },
    __wbg_set_offset_3cac50c03a339f62: function (arg0, arg1) {
      getObject(arg0).offset = arg1
    },
    __wbg_set_offset_7fc612b79c557829: function (arg0, arg1) {
      getObject(arg0).offset = arg1
    },
    __wbg_set_operation_d4755de4993bb6bf: function (arg0, arg1) {
      getObject(arg0).operation = __wbindgen_enum_GpuBlendOperation[arg1]
    },
    __wbg_set_origin_aa76a76dc965377e: function (arg0, arg1) {
      getObject(arg0).origin = getObject(arg1)
    },
    __wbg_set_pass_op_533e59101ae79854: function (arg0, arg1) {
      getObject(arg0).passOp = __wbindgen_enum_GpuStencilOperation[arg1]
    },
    __wbg_set_power_preference_0ff4caf1d78a9780: function (arg0, arg1) {
      getObject(arg0).powerPreference = __wbindgen_enum_GpuPowerPreference[arg1]
    },
    __wbg_set_primitive_928272ce7b250184: function (arg0, arg1) {
      getObject(arg0).primitive = getObject(arg1)
    },
    __wbg_set_query_set_256baf2505706dbf: function (arg0, arg1) {
      getObject(arg0).querySet = getObject(arg1)
    },
    __wbg_set_r_d482350b90f66f22: function (arg0, arg1) {
      getObject(arg0).r = arg1
    },
    __wbg_set_required_features_ee015feb3bb46e2b: function (arg0, arg1) {
      getObject(arg0).requiredFeatures = getObject(arg1)
    },
    __wbg_set_resolve_target_cf716fc86d56d49d: function (arg0, arg1) {
      getObject(arg0).resolveTarget = getObject(arg1)
    },
    __wbg_set_resource_adeca9e90e1291a9: function (arg0, arg1) {
      getObject(arg0).resource = getObject(arg1)
    },
    __wbg_set_rows_per_image_5da7ca4e10fa05b5: function (arg0, arg1) {
      getObject(arg0).rowsPerImage = arg1 >>> 0
    },
    __wbg_set_sample_count_47e00797c7c7007e: function (arg0, arg1) {
      getObject(arg0).sampleCount = arg1 >>> 0
    },
    __wbg_set_sample_type_f21f11f4b4085a2f: function (arg0, arg1) {
      getObject(arg0).sampleType = __wbindgen_enum_GpuTextureSampleType[arg1]
    },
    __wbg_set_sampler_faa53060dad855d4: function (arg0, arg1) {
      getObject(arg0).sampler = getObject(arg1)
    },
    __wbg_set_shader_location_732ba25997f99074: function (arg0, arg1) {
      getObject(arg0).shaderLocation = arg1 >>> 0
    },
    __wbg_set_size_3ce80484fe014d70: function (arg0, arg1) {
      getObject(arg0).size = arg1
    },
    __wbg_set_size_ec0879fafa1f7f60: function (arg0, arg1) {
      getObject(arg0).size = arg1
    },
    __wbg_set_size_f3bdb3b76d69ce2e: function (arg0, arg1) {
      getObject(arg0).size = getObject(arg1)
    },
    __wbg_set_src_factor_6325dccd3632ca02: function (arg0, arg1) {
      getObject(arg0).srcFactor = __wbindgen_enum_GpuBlendFactor[arg1]
    },
    __wbg_set_stencil_back_977d937f4a2aea06: function (arg0, arg1) {
      getObject(arg0).stencilBack = getObject(arg1)
    },
    __wbg_set_stencil_clear_value_ef31b2c0d12da2b2: function (arg0, arg1) {
      getObject(arg0).stencilClearValue = arg1 >>> 0
    },
    __wbg_set_stencil_front_a16dbeef8ddf654b: function (arg0, arg1) {
      getObject(arg0).stencilFront = getObject(arg1)
    },
    __wbg_set_stencil_load_op_2bda5d883d7144ab: function (arg0, arg1) {
      getObject(arg0).stencilLoadOp = __wbindgen_enum_GpuLoadOp[arg1]
    },
    __wbg_set_stencil_read_mask_cdba22ff97b765e5: function (arg0, arg1) {
      getObject(arg0).stencilReadMask = arg1 >>> 0
    },
    __wbg_set_stencil_read_only_73585db3e480ce39: function (arg0, arg1) {
      getObject(arg0).stencilReadOnly = arg1 !== 0
    },
    __wbg_set_stencil_store_op_c25139982e6199cf: function (arg0, arg1) {
      getObject(arg0).stencilStoreOp = __wbindgen_enum_GpuStoreOp[arg1]
    },
    __wbg_set_stencil_write_mask_37ea11c2cfe654c4: function (arg0, arg1) {
      getObject(arg0).stencilWriteMask = arg1 >>> 0
    },
    __wbg_set_step_mode_ac09182f2ffc02f9: function (arg0, arg1) {
      getObject(arg0).stepMode = __wbindgen_enum_GpuVertexStepMode[arg1]
    },
    __wbg_set_storage_texture_d8bd64b59571a6f2: function (arg0, arg1) {
      getObject(arg0).storageTexture = getObject(arg1)
    },
    __wbg_set_store_op_7330f77e7616004a: function (arg0, arg1) {
      getObject(arg0).storeOp = __wbindgen_enum_GpuStoreOp[arg1]
    },
    __wbg_set_strip_index_format_5926dd63cfa44857: function (arg0, arg1) {
      getObject(arg0).stripIndexFormat = __wbindgen_enum_GpuIndexFormat[arg1]
    },
    __wbg_set_targets_7c73183a12a957e2: function (arg0, arg1) {
      getObject(arg0).targets = getObject(arg1)
    },
    __wbg_set_texture_0601e2dc5424513c: function (arg0, arg1) {
      getObject(arg0).texture = getObject(arg1)
    },
    __wbg_set_texture_d38afc883df646c2: function (arg0, arg1) {
      getObject(arg0).texture = getObject(arg1)
    },
    __wbg_set_timestamp_writes_8fb776a718ade3b9: function (arg0, arg1) {
      getObject(arg0).timestampWrites = getObject(arg1)
    },
    __wbg_set_topology_69b5f25779091d7a: function (arg0, arg1) {
      getObject(arg0).topology = __wbindgen_enum_GpuPrimitiveTopology[arg1]
    },
    __wbg_set_type_336070a0bd5481c7: function (arg0, arg1) {
      getObject(arg0).type = __wbindgen_enum_GpuBufferBindingType[arg1]
    },
    __wbg_set_type_5229687b3589bb10: function (arg0, arg1) {
      getObject(arg0).type = __wbindgen_enum_GpuSamplerBindingType[arg1]
    },
    __wbg_set_usage_6c6fc8226c337ad8: function (arg0, arg1) {
      getObject(arg0).usage = arg1 >>> 0
    },
    __wbg_set_usage_78b7be73aa90cfd0: function (arg0, arg1) {
      getObject(arg0).usage = arg1 >>> 0
    },
    __wbg_set_usage_a43a1605e508ea21: function (arg0, arg1) {
      getObject(arg0).usage = arg1 >>> 0
    },
    __wbg_set_usage_b5a7dc195085b58e: function (arg0, arg1) {
      getObject(arg0).usage = arg1 >>> 0
    },
    __wbg_set_vertex_3bcd2e7cbc333978: function (arg0, arg1) {
      getObject(arg0).vertex = getObject(arg1)
    },
    __wbg_set_view_8d0c46c633d57f1d: function (arg0, arg1) {
      getObject(arg0).view = getObject(arg1)
    },
    __wbg_set_view_dimension_11b23089a475c4f6: function (arg0, arg1) {
      getObject(arg0).viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1]
    },
    __wbg_set_view_dimension_12a9363db2b90aa8: function (arg0, arg1) {
      getObject(arg0).viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1]
    },
    __wbg_set_view_e53bc62c1806468e: function (arg0, arg1) {
      getObject(arg0).view = getObject(arg1)
    },
    __wbg_set_view_formats_34fa0f58e15c05c7: function (arg0, arg1) {
      getObject(arg0).viewFormats = getObject(arg1)
    },
    __wbg_set_view_formats_8f0e5c8999d03426: function (arg0, arg1) {
      getObject(arg0).viewFormats = getObject(arg1)
    },
    __wbg_set_visibility_d5104b65ecbecfb1: function (arg0, arg1) {
      getObject(arg0).visibility = arg1 >>> 0
    },
    __wbg_set_width_0ca908d167690992: function (arg0, arg1) {
      getObject(arg0).width = arg1 >>> 0
    },
    __wbg_set_width_b0e1267db4b196b5: function (arg0, arg1) {
      getObject(arg0).width = arg1 >>> 0
    },
    __wbg_set_width_f4beed5df54549b2: function (arg0, arg1) {
      getObject(arg0).width = arg1 >>> 0
    },
    __wbg_set_write_mask_0e892ff393c2878b: function (arg0, arg1) {
      getObject(arg0).writeMask = arg1 >>> 0
    },
    __wbg_set_x_d5a0f838d03cc0c8: function (arg0, arg1) {
      getObject(arg0).x = arg1 >>> 0
    },
    __wbg_set_y_fa0f8ba06a4aca5a: function (arg0, arg1) {
      getObject(arg0).y = arg1 >>> 0
    },
    __wbg_set_z_2cb0edac0ad5210f: function (arg0, arg1) {
      getObject(arg0).z = arg1 >>> 0
    },
    __wbg_shaderSource_06379dac249994dd: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).shaderSource(getObject(arg1), getStringFromWasm0(arg2, arg3))
    },
    __wbg_shaderSource_c8812639b47d87b9: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).shaderSource(getObject(arg1), getStringFromWasm0(arg2, arg3))
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
    __wbg_stencilFuncSeparate_3f31dcd12a0d4785: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0)
    },
    __wbg_stencilFuncSeparate_f168b66c597aa85f: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0)
    },
    __wbg_stencilMaskSeparate_b30c097ea6b98504: function (arg0, arg1, arg2) {
      getObject(arg0).stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0)
    },
    __wbg_stencilMaskSeparate_ff739f8711e9fd42: function (arg0, arg1, arg2) {
      getObject(arg0).stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0)
    },
    __wbg_stencilMask_9e18cc018897c747: function (arg0, arg1) {
      getObject(arg0).stencilMask(arg1 >>> 0)
    },
    __wbg_stencilMask_a22be64c66abd825: function (arg0, arg1) {
      getObject(arg0).stencilMask(arg1 >>> 0)
    },
    __wbg_stencilOpSeparate_7d01185cbdb89d99: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0)
    },
    __wbg_stencilOpSeparate_c5af5f5dbd237bea: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0)
    },
    __wbg_submit_a0eef27ac882fdbc: function (arg0, arg1) {
      getObject(arg0).submit(getObject(arg1))
    },
    __wbg_texImage2D_82bf2b4c8aa9a1db: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).texImage2D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7 >>> 0,
          arg8 >>> 0,
          arg9
        )
      }, arguments)
    },
    __wbg_texImage2D_a856af552acdc9d9: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).texImage2D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7 >>> 0,
          arg8 >>> 0,
          getObject(arg9)
        )
      }, arguments)
    },
    __wbg_texImage2D_ca3d0fe24620ec85: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).texImage2D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7 >>> 0,
          arg8 >>> 0,
          getObject(arg9)
        )
      }, arguments)
    },
    __wbg_texImage3D_29a847f33877ed12: function () {
      return handleError(function (
        arg0,
        arg1,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7,
        arg8,
        arg9,
        arg10
      ) {
        getObject(arg0).texImage3D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7,
          arg8 >>> 0,
          arg9 >>> 0,
          getObject(arg10)
        )
      }, arguments)
    },
    __wbg_texImage3D_78fb39719c620063: function () {
      return handleError(function (
        arg0,
        arg1,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7,
        arg8,
        arg9,
        arg10
      ) {
        getObject(arg0).texImage3D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7,
          arg8 >>> 0,
          arg9 >>> 0,
          arg10
        )
      }, arguments)
    },
    __wbg_texParameteri_647fdb1426809cb5: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).texParameteri(arg1 >>> 0, arg2 >>> 0, arg3)
    },
    __wbg_texParameteri_7864076abcdb03e0: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).texParameteri(arg1 >>> 0, arg2 >>> 0, arg3)
    },
    __wbg_texStorage2D_cf2bd991072d9efb: function (arg0, arg1, arg2, arg3, arg4, arg5) {
      getObject(arg0).texStorage2D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5)
    },
    __wbg_texStorage3D_74b701c2b176380c: function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
      getObject(arg0).texStorage3D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5, arg6)
    },
    __wbg_texSubImage2D_07337d0974e99c39: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).texSubImage2D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7 >>> 0,
          arg8 >>> 0,
          getObject(arg9)
        )
      }, arguments)
    },
    __wbg_texSubImage2D_196472d4111ce5b6: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).texSubImage2D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7 >>> 0,
          arg8 >>> 0,
          getObject(arg9)
        )
      }, arguments)
    },
    __wbg_texSubImage2D_24cf5097ebaa84cc: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).texSubImage2D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7 >>> 0,
          arg8 >>> 0,
          getObject(arg9)
        )
      }, arguments)
    },
    __wbg_texSubImage2D_31a0c2797aa04f32: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).texSubImage2D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7 >>> 0,
          arg8 >>> 0,
          arg9
        )
      }, arguments)
    },
    __wbg_texSubImage2D_5e90c7a719d40256: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).texSubImage2D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7 >>> 0,
          arg8 >>> 0,
          getObject(arg9)
        )
      }, arguments)
    },
    __wbg_texSubImage2D_64e36398b8f046ac: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).texSubImage2D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7 >>> 0,
          arg8 >>> 0,
          getObject(arg9)
        )
      }, arguments)
    },
    __wbg_texSubImage2D_bb322aae90f7657f: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).texSubImage2D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7 >>> 0,
          arg8 >>> 0,
          getObject(arg9)
        )
      }, arguments)
    },
    __wbg_texSubImage2D_d7bffff06a3b8315: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).texSubImage2D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7 >>> 0,
          arg8 >>> 0,
          getObject(arg9)
        )
      }, arguments)
    },
    __wbg_texSubImage3D_001f2e62ed945b72: function () {
      return handleError(function (
        arg0,
        arg1,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7,
        arg8,
        arg9,
        arg10,
        arg11
      ) {
        getObject(arg0).texSubImage3D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7,
          arg8,
          arg9 >>> 0,
          arg10 >>> 0,
          getObject(arg11)
        )
      }, arguments)
    },
    __wbg_texSubImage3D_5143d5af7e182ddc: function () {
      return handleError(function (
        arg0,
        arg1,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7,
        arg8,
        arg9,
        arg10,
        arg11
      ) {
        getObject(arg0).texSubImage3D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7,
          arg8,
          arg9 >>> 0,
          arg10 >>> 0,
          getObject(arg11)
        )
      }, arguments)
    },
    __wbg_texSubImage3D_53c6014e2d129891: function () {
      return handleError(function (
        arg0,
        arg1,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7,
        arg8,
        arg9,
        arg10,
        arg11
      ) {
        getObject(arg0).texSubImage3D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7,
          arg8,
          arg9 >>> 0,
          arg10 >>> 0,
          getObject(arg11)
        )
      }, arguments)
    },
    __wbg_texSubImage3D_5d773fc7a8cd4d08: function () {
      return handleError(function (
        arg0,
        arg1,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7,
        arg8,
        arg9,
        arg10,
        arg11
      ) {
        getObject(arg0).texSubImage3D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7,
          arg8,
          arg9 >>> 0,
          arg10 >>> 0,
          getObject(arg11)
        )
      }, arguments)
    },
    __wbg_texSubImage3D_adb96e37e6949ec9: function () {
      return handleError(function (
        arg0,
        arg1,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7,
        arg8,
        arg9,
        arg10,
        arg11
      ) {
        getObject(arg0).texSubImage3D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7,
          arg8,
          arg9 >>> 0,
          arg10 >>> 0,
          getObject(arg11)
        )
      }, arguments)
    },
    __wbg_texSubImage3D_d4e74595e01f7f71: function () {
      return handleError(function (
        arg0,
        arg1,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7,
        arg8,
        arg9,
        arg10,
        arg11
      ) {
        getObject(arg0).texSubImage3D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7,
          arg8,
          arg9 >>> 0,
          arg10 >>> 0,
          getObject(arg11)
        )
      }, arguments)
    },
    __wbg_texSubImage3D_e0d113b7047a5130: function () {
      return handleError(function (
        arg0,
        arg1,
        arg2,
        arg3,
        arg4,
        arg5,
        arg6,
        arg7,
        arg8,
        arg9,
        arg10,
        arg11
      ) {
        getObject(arg0).texSubImage3D(
          arg1 >>> 0,
          arg2,
          arg3,
          arg4,
          arg5,
          arg6,
          arg7,
          arg8,
          arg9 >>> 0,
          arg10 >>> 0,
          arg11
        )
      }, arguments)
    },
    __wbg_then_c949d5a25a4e78f8: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).then(getObject(arg1), getObject(arg2))
      return addHeapObject(ret)
    },
    __wbg_then_e71170d78fcf8954: function (arg0, arg1) {
      const ret = getObject(arg0).then(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_uniform1f_9cfecfaeb8cf43c1: function (arg0, arg1, arg2) {
      getObject(arg0).uniform1f(getObject(arg1), arg2)
    },
    __wbg_uniform1f_b5856e35a43b65a1: function (arg0, arg1, arg2) {
      getObject(arg0).uniform1f(getObject(arg1), arg2)
    },
    __wbg_uniform1i_531b98c4a7177366: function (arg0, arg1, arg2) {
      getObject(arg0).uniform1i(getObject(arg1), arg2)
    },
    __wbg_uniform1i_fc2dc8cadc49d8ec: function (arg0, arg1, arg2) {
      getObject(arg0).uniform1i(getObject(arg1), arg2)
    },
    __wbg_uniform1ui_353c67ec681b540c: function (arg0, arg1, arg2) {
      getObject(arg0).uniform1ui(getObject(arg1), arg2 >>> 0)
    },
    __wbg_uniform2fv_319c49f0ce340f26: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform2fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3))
    },
    __wbg_uniform2fv_a7d3c1830d18c1b2: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform2fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3))
    },
    __wbg_uniform2iv_65f36fc9777697d7: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform2iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3))
    },
    __wbg_uniform2iv_ca9cb507409b9ad1: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform2iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3))
    },
    __wbg_uniform2uiv_c95af5fb653ccb86: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform2uiv(getObject(arg1), getArrayU32FromWasm0(arg2, arg3))
    },
    __wbg_uniform3fv_055ea5ac38af4fce: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform3fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3))
    },
    __wbg_uniform3fv_58520ffe22a6e27c: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform3fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3))
    },
    __wbg_uniform3iv_0590e8b7eff2a791: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform3iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3))
    },
    __wbg_uniform3iv_e91b1410dc299f50: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform3iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3))
    },
    __wbg_uniform3uiv_9992491000463a52: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform3uiv(getObject(arg1), getArrayU32FromWasm0(arg2, arg3))
    },
    __wbg_uniform4f_22bfec882308eec2: function (arg0, arg1, arg2, arg3, arg4, arg5) {
      getObject(arg0).uniform4f(getObject(arg1), arg2, arg3, arg4, arg5)
    },
    __wbg_uniform4f_8dd8f311e656ca0d: function (arg0, arg1, arg2, arg3, arg4, arg5) {
      getObject(arg0).uniform4f(getObject(arg1), arg2, arg3, arg4, arg5)
    },
    __wbg_uniform4fv_3ef2f5121fcb78ae: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform4fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3))
    },
    __wbg_uniform4fv_cf8ff646c36232c8: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform4fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3))
    },
    __wbg_uniform4iv_6fc5436b4f876039: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform4iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3))
    },
    __wbg_uniform4iv_99c2b07787d362d6: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform4iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3))
    },
    __wbg_uniform4uiv_a6fb3237d9df7ed4: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniform4uiv(getObject(arg1), getArrayU32FromWasm0(arg2, arg3))
    },
    __wbg_uniformBlockBinding_07116582301fb019: function (arg0, arg1, arg2, arg3) {
      getObject(arg0).uniformBlockBinding(getObject(arg1), arg2 >>> 0, arg3 >>> 0)
    },
    __wbg_uniformMatrix2fv_34b2245136106a2f: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).uniformMatrix2fv(
        getObject(arg1),
        arg2 !== 0,
        getArrayF32FromWasm0(arg3, arg4)
      )
    },
    __wbg_uniformMatrix2fv_611c7fcb378f057e: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).uniformMatrix2fv(
        getObject(arg1),
        arg2 !== 0,
        getArrayF32FromWasm0(arg3, arg4)
      )
    },
    __wbg_uniformMatrix2x3fv_6b33a76d09b6c00f: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).uniformMatrix2x3fv(
        getObject(arg1),
        arg2 !== 0,
        getArrayF32FromWasm0(arg3, arg4)
      )
    },
    __wbg_uniformMatrix2x4fv_66c787e2d0a5dd0a: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).uniformMatrix2x4fv(
        getObject(arg1),
        arg2 !== 0,
        getArrayF32FromWasm0(arg3, arg4)
      )
    },
    __wbg_uniformMatrix3fv_472e7824735acce1: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).uniformMatrix3fv(
        getObject(arg1),
        arg2 !== 0,
        getArrayF32FromWasm0(arg3, arg4)
      )
    },
    __wbg_uniformMatrix3fv_83fdc9c3c0d43204: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).uniformMatrix3fv(
        getObject(arg1),
        arg2 !== 0,
        getArrayF32FromWasm0(arg3, arg4)
      )
    },
    __wbg_uniformMatrix3x2fv_33df849b78b8556e: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).uniformMatrix3x2fv(
        getObject(arg1),
        arg2 !== 0,
        getArrayF32FromWasm0(arg3, arg4)
      )
    },
    __wbg_uniformMatrix3x4fv_8914dc5121a813b4: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).uniformMatrix3x4fv(
        getObject(arg1),
        arg2 !== 0,
        getArrayF32FromWasm0(arg3, arg4)
      )
    },
    __wbg_uniformMatrix4fv_dff9738d995fd0b1: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).uniformMatrix4fv(
        getObject(arg1),
        arg2 !== 0,
        getArrayF32FromWasm0(arg3, arg4)
      )
    },
    __wbg_uniformMatrix4fv_e691d7f14d3609f7: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).uniformMatrix4fv(
        getObject(arg1),
        arg2 !== 0,
        getArrayF32FromWasm0(arg3, arg4)
      )
    },
    __wbg_uniformMatrix4x2fv_1c9ccf4427b82548: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).uniformMatrix4x2fv(
        getObject(arg1),
        arg2 !== 0,
        getArrayF32FromWasm0(arg3, arg4)
      )
    },
    __wbg_uniformMatrix4x3fv_a84b16e0a7abee2c: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).uniformMatrix4x3fv(
        getObject(arg1),
        arg2 !== 0,
        getArrayF32FromWasm0(arg3, arg4)
      )
    },
    __wbg_unmap_86f345d7fc3ecd10: function (arg0) {
      getObject(arg0).unmap()
    },
    __wbg_useProgram_5bdae58fd9f9826f: function (arg0, arg1) {
      getObject(arg0).useProgram(getObject(arg1))
    },
    __wbg_useProgram_e075c2902e420761: function (arg0, arg1) {
      getObject(arg0).useProgram(getObject(arg1))
    },
    __wbg_vertexAttribDivisorANGLE_659fb027198a47c3: function (arg0, arg1, arg2) {
      getObject(arg0).vertexAttribDivisorANGLE(arg1 >>> 0, arg2 >>> 0)
    },
    __wbg_vertexAttribDivisor_7575d382215322f7: function (arg0, arg1, arg2) {
      getObject(arg0).vertexAttribDivisor(arg1 >>> 0, arg2 >>> 0)
    },
    __wbg_vertexAttribIPointer_fc8057c62cfcc63c: function (arg0, arg1, arg2, arg3, arg4, arg5) {
      getObject(arg0).vertexAttribIPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5)
    },
    __wbg_vertexAttribPointer_24b495e18df325dc: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5,
      arg6
    ) {
      getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6)
    },
    __wbg_vertexAttribPointer_54d56b18f71a946d: function (
      arg0,
      arg1,
      arg2,
      arg3,
      arg4,
      arg5,
      arg6
    ) {
      getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6)
    },
    __wbg_viewport_16936692526e2ce6: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).viewport(arg1, arg2, arg3, arg4)
    },
    __wbg_viewport_e35d16c542d2ce70: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).viewport(arg1, arg2, arg3, arg4)
    },
    __wbg_width_3d0dce3d9892e35e: function (arg0) {
      const ret = getObject(arg0).width
      return ret
    },
    __wbg_writeBuffer_280ac7924a1b1df0: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).writeBuffer(getObject(arg1), arg2, getObject(arg3), arg4, arg5)
      }, arguments)
    },
    __wbg_writeTexture_9d6295813b0ef4a1: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).writeTexture(
          getObject(arg1),
          getObject(arg2),
          getObject(arg3),
          getObject(arg4)
        )
      }, arguments)
    },
    __wbindgen_generic_0000000000000001: function (arg0, arg1) {
      // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 2075, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
      const ret = makeMutClosure(arg0, arg1, __wasm_bindgen_func_elem_7690)
      return addHeapObject(ret)
    },
    __wbindgen_generic_0000000000000002: function (arg0) {
      // Cast intrinsic for `F64 -> Externref`.
      const ret = arg0
      return addHeapObject(ret)
    },
    __wbindgen_generic_0000000000000003: function (arg0, arg1) {
      // Cast intrinsic for `Ref(Slice(F32)) -> NamedExternref("Float32Array")`.
      const ret = getArrayF32FromWasm0(arg0, arg1)
      return addHeapObject(ret)
    },
    __wbindgen_generic_0000000000000004: function (arg0, arg1) {
      // Cast intrinsic for `Ref(Slice(I16)) -> NamedExternref("Int16Array")`.
      const ret = getArrayI16FromWasm0(arg0, arg1)
      return addHeapObject(ret)
    },
    __wbindgen_generic_0000000000000005: function (arg0, arg1) {
      // Cast intrinsic for `Ref(Slice(I32)) -> NamedExternref("Int32Array")`.
      const ret = getArrayI32FromWasm0(arg0, arg1)
      return addHeapObject(ret)
    },
    __wbindgen_generic_0000000000000006: function (arg0, arg1) {
      // Cast intrinsic for `Ref(Slice(I8)) -> NamedExternref("Int8Array")`.
      const ret = getArrayI8FromWasm0(arg0, arg1)
      return addHeapObject(ret)
    },
    __wbindgen_generic_0000000000000007: function (arg0, arg1) {
      // Cast intrinsic for `Ref(Slice(U16)) -> NamedExternref("Uint16Array")`.
      const ret = getArrayU16FromWasm0(arg0, arg1)
      return addHeapObject(ret)
    },
    __wbindgen_generic_0000000000000008: function (arg0, arg1) {
      // Cast intrinsic for `Ref(Slice(U32)) -> NamedExternref("Uint32Array")`.
      const ret = getArrayU32FromWasm0(arg0, arg1)
      return addHeapObject(ret)
    },
    __wbindgen_generic_0000000000000009: function (arg0, arg1) {
      // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
      const ret = getArrayU8FromWasm0(arg0, arg1)
      return addHeapObject(ret)
    },
    __wbindgen_generic_000000000000000a: function (arg0, arg1) {
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
    './luiskr_overlay_bg.js': import0,
  }
}

function __wasm_bindgen_func_elem_7711(arg0, arg1, arg2, arg3) {
  wasm.__wasm_bindgen_func_elem_7711(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3))
}

function __wasm_bindgen_func_elem_7690(arg0, arg1, arg2) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    wasm.__wasm_bindgen_func_elem_7690(retptr, arg0, arg1, addHeapObject(arg2))
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true)
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true)
    if (r1) {
      throw takeObject(r0)
    }
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
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

const __wbindgen_enum_GpuMipmapFilterMode = ['nearest', 'linear']

const __wbindgen_enum_GpuPowerPreference = ['low-power', 'high-performance']

const __wbindgen_enum_GpuPrimitiveTopology = [
  'point-list',
  'line-list',
  'line-strip',
  'triangle-list',
  'triangle-strip',
]

const __wbindgen_enum_GpuSamplerBindingType = ['filtering', 'non-filtering', 'comparison']

const __wbindgen_enum_GpuStencilOperation = [
  'keep',
  'zero',
  'replace',
  'invert',
  'increment-clamp',
  'decrement-clamp',
  'increment-wrap',
  'decrement-wrap',
]

const __wbindgen_enum_GpuStorageTextureAccess = ['write-only', 'read-only', 'read-write']

const __wbindgen_enum_GpuStoreOp = ['store', 'discard']

const __wbindgen_enum_GpuTextureAspect = ['all', 'stencil-only', 'depth-only']

const __wbindgen_enum_GpuTextureDimension = ['1d', '2d', '3d']

const __wbindgen_enum_GpuTextureFormat = [
  'r8unorm',
  'r8snorm',
  'r8uint',
  'r8sint',
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

const __wbindgen_enum_GpuTextureSampleType = [
  'float',
  'unfilterable-float',
  'depth',
  'sint',
  'uint',
]

const __wbindgen_enum_GpuTextureViewDimension = ['1d', '2d', '2d-array', 'cube', 'cube-array', '3d']

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
const OverlayFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_overlay_free(ptr, 1))

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1)
  const idx = heap_next
  heap_next = heap[idx]

  heap[idx] = obj
  return idx
}

const CLOSURE_DTORS =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((state) => wasm.__wbindgen_export4(state.a, state.b))

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

function getArrayI16FromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return getInt16ArrayMemory0().subarray(ptr / 2, ptr / 2 + len)
}

function getArrayI32FromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return getInt32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len)
}

function getArrayI8FromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return getInt8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len)
}

function getArrayU16FromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return getUint16ArrayMemory0().subarray(ptr / 2, ptr / 2 + len)
}

function getArrayU32FromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len)
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

let cachedInt16ArrayMemory0 = null
function getInt16ArrayMemory0() {
  if (cachedInt16ArrayMemory0 === null || cachedInt16ArrayMemory0.byteLength === 0) {
    cachedInt16ArrayMemory0 = new Int16Array(wasm.memory.buffer)
  }
  return cachedInt16ArrayMemory0
}

let cachedInt32ArrayMemory0 = null
function getInt32ArrayMemory0() {
  if (cachedInt32ArrayMemory0 === null || cachedInt32ArrayMemory0.byteLength === 0) {
    cachedInt32ArrayMemory0 = new Int32Array(wasm.memory.buffer)
  }
  return cachedInt32ArrayMemory0
}

let cachedInt8ArrayMemory0 = null
function getInt8ArrayMemory0() {
  if (cachedInt8ArrayMemory0 === null || cachedInt8ArrayMemory0.byteLength === 0) {
    cachedInt8ArrayMemory0 = new Int8Array(wasm.memory.buffer)
  }
  return cachedInt8ArrayMemory0
}

function getStringFromWasm0(ptr, len) {
  return decodeText(ptr >>> 0, len)
}

let cachedUint16ArrayMemory0 = null
function getUint16ArrayMemory0() {
  if (cachedUint16ArrayMemory0 === null || cachedUint16ArrayMemory0.byteLength === 0) {
    cachedUint16ArrayMemory0 = new Uint16Array(wasm.memory.buffer)
  }
  return cachedUint16ArrayMemory0
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

function makeMutClosure(arg0, arg1, f) {
  const state = { a: arg0, b: arg1, cnt: 1 }
  const real = (...args) => {
    // First up with a closure we increment the internal reference
    // count. This ensures that the Rust closure environment won't
    // be deallocated while we're invoking it.
    state.cnt++
    const a = state.a
    state.a = 0
    try {
      return f(a, state.b, ...args)
    } finally {
      state.a = a
      real._wbg_cb_unref()
    }
  }
  real._wbg_cb_unref = () => {
    if (--state.cnt === 0) {
      wasm.__wbindgen_export4(state.a, state.b)
      state.a = 0
      CLOSURE_DTORS.unregister(state)
    }
  }
  CLOSURE_DTORS.register(real, state, state)
  return real
}

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0
  getUint8ArrayMemory0().set(arg, ptr / 1)
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
  cachedInt16ArrayMemory0 = null
  cachedInt32ArrayMemory0 = null
  cachedInt8ArrayMemory0 = null
  cachedUint16ArrayMemory0 = null
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
    module_or_path = new URL('luiskr_overlay_bg.wasm', import.meta.url)
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
