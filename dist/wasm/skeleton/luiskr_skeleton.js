/* @ts-self-types="./luiskr_skeleton.d.ts" */

/**
 * Public wasm surface — one skeleton canvas per instance. A page may
 * mount several (hero + content areas shimmer independently).
 */
export class Skeleton {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    SkeletonFinalization.unregister(this)
    return ptr
  }
  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_skeleton_free(ptr, 0)
  }
  /**
   * `frame` — one animation tick. Per-frame cost: one ~64 B uniform
   * write + one pass + one 3-vertex draw. The fragment loop early-
   * outs per rect — bounded and cheap.
   *
   * @param dt Seconds since the previous `frame` call.
   * @param {number} dt
   */
  frame(dt) {
    wasm.skeleton_frame(this.__wbg_ptr, dt)
  }
  /**
   * `init` — acquire adapter/device, configure the canvas, compile
   * the pipeline, allocate the uniform + sheet buffers. Rejection
   * propagates to JS, which falls back to the WebGL/CSS skeleton.
   *
   * @param canvas The dedicated canvas this surface paints.
   * @param device The shared GPUDevice (one per page, from the JS bridge).
   * @returns Ok on a configured surface, Err(JsValue) on failure.
   * @param {HTMLCanvasElement} canvas
   * @param {GPUDevice} device
   */
  init(canvas, device) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.skeleton_init(retptr, this.__wbg_ptr, addHeapObject(canvas), addHeapObject(device))
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true)
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true)
      if (r1) {
        throw takeObject(r0)
      }
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * `Skeleton::new` — un-initialized surface; `init` must follow.
   * Split because the device request is an async browser promise.
   */
  constructor() {
    const ret = wasm.skeleton_new()
    this.__wbg_ptr = ret
    SkeletonFinalization.register(this, this.__wbg_ptr, this)
    return this
  }
  /**
   * `resize` — re-configure the surface after a canvas-bitmap
   * change + store the DEVICE-pixel size as the shader's `rect`
   * (the whole-canvas clip, in `frag`'s device units).
   *
   * @param w Device-pixel width (element CSS px × DPR).
   * @param h Device-pixel height.
   * @param {number} w
   * @param {number} h
   */
  resize(w, h) {
    wasm.skeleton_resize(this.__wbg_ptr, w, h)
  }
  /**
   * `set_size` — the canvas's CSS-pixel size. Feeds the shader's
   * `res` field (the widget rect IS the whole canvas — device-px
   * `rect` is written by `resize` instead).
   *
   * @param w Canvas width in CSS pixels.
   * @param h Canvas height in CSS pixels.
   * @param {number} w
   * @param {number} h
   */
  set_size(w, h) {
    wasm.skeleton_set_size(this.__wbg_ptr, w, h)
  }
  /**
   * `set_state` — scalar updates bundled to keep the JS call count
   * low: resolve progress, ink alpha, live rect count.
   *
   * @param resolve 0..1 resolve progress (collapse+fade driver).
   * @param ink_alpha Global glyph opacity multiplier.
   * @param count Live rect count, clamped to MAX_RECTS.
   * @param {number} resolve
   * @param {number} ink_alpha
   * @param {number} count
   */
  set_state(resolve, ink_alpha, count) {
    wasm.skeleton_set_state(this.__wbg_ptr, resolve, ink_alpha, count)
  }
  /**
   * `write_sheet` — upload the per-rect data block: 16 f32s per
   * rect — [x,y,w,h][radius,cell,row_h,unused][sbase rgb,unused]
   * [sink rgb,unused]. Truncated at MAX_RECTS rows; `count` (set
   * via `set_state`) decides how many rows the GPU reads.
   *
   * @param values Flat f32 sheet — 16 values per rect row.
   * @param {Float32Array} values
   */
  write_sheet(values) {
    const ptr0 = passArrayF32ToWasm0(values, wasm.__wbindgen_export)
    const len0 = WASM_VECTOR_LEN
    wasm.skeleton_write_sheet(this.__wbg_ptr, ptr0, len0)
  }
}
if (Symbol.dispose) Skeleton.prototype[Symbol.dispose] = Skeleton.prototype.free
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
    __wbg_createShaderModule_274373c4cacce3a0: function (arg0, arg1) {
      const ret = getObject(arg0).createShaderModule(getObject(arg1))
      return addHeapObject(ret)
    },
    __wbg_createView_7520397d720e9d7d: function () {
      return handleError(function (arg0) {
        const ret = getObject(arg0).createView()
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_draw_b3ff1fa9ff891153: function (arg0, arg1) {
      getObject(arg0).draw(arg1 >>> 0)
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
    __wbg_setPipeline_9870f87d9e0a49ab: function (arg0, arg1) {
      getObject(arg0).setPipeline(getObject(arg1))
    },
    __wbg_setScissorRect_78603d18fd6477a3: function (arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).setScissorRect(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0)
    },
    __wbg_set_a_d2dae9a62946ba86: function (arg0, arg1) {
      getObject(arg0).a = arg1
    },
    __wbg_set_alpha_b14827cf8b4ac26a: function (arg0, arg1) {
      getObject(arg0).alpha = getObject(arg1)
    },
    __wbg_set_alpha_mode_16c3966c224ad4a9: function (arg0, arg1) {
      getObject(arg0).alphaMode = __wbindgen_enum_GpuCanvasAlphaMode[arg1]
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
    __wbg_set_format_d4c8ef73b087dab0: function (arg0, arg1) {
      getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1]
    },
    __wbg_set_fragment_9bc5cc98c7c59fef: function (arg0, arg1) {
      getObject(arg0).fragment = getObject(arg1)
    },
    __wbg_set_g_ac69babc4a0b2338: function (arg0, arg1) {
      getObject(arg0).g = arg1
    },
    __wbg_set_has_dynamic_offset_e2a0bd85eaf36f34: function (arg0, arg1) {
      getObject(arg0).hasDynamicOffset = arg1 !== 0
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
    __wbg_set_module_168054323d22d57d: function (arg0, arg1) {
      getObject(arg0).module = getObject(arg1)
    },
    __wbg_set_module_1ad4e7343951303d: function (arg0, arg1) {
      getObject(arg0).module = getObject(arg1)
    },
    __wbg_set_operation_d8894b0f9aa3db27: function (arg0, arg1) {
      getObject(arg0).operation = __wbindgen_enum_GpuBlendOperation[arg1]
    },
    __wbg_set_r_ccf9fe3e4d993555: function (arg0, arg1) {
      getObject(arg0).r = arg1
    },
    __wbg_set_resource_gpu_buffer_binding_c689b0dc9379a99b: function (arg0, arg1) {
      getObject(arg0).resource = getObject(arg1)
    },
    __wbg_set_size_4716cf40ee7a64be: function (arg0, arg1) {
      getObject(arg0).size = arg1 >>> 0
    },
    __wbg_set_src_factor_b29ea819b1b5d6f6: function (arg0, arg1) {
      getObject(arg0).srcFactor = __wbindgen_enum_GpuBlendFactor[arg1]
    },
    __wbg_set_store_op_6d2fb6cc3e66341e: function (arg0, arg1) {
      getObject(arg0).storeOp = __wbindgen_enum_GpuStoreOp[arg1]
    },
    __wbg_set_targets_0328c60fcfc0f564: function (arg0, arg1, arg2) {
      getObject(arg0).targets = getArrayJsValueViewFromWasm0(arg1, arg2)
    },
    __wbg_set_type_ff9e8f3110ad0cbf: function (arg0, arg1) {
      getObject(arg0).type = __wbindgen_enum_GpuBufferBindingType[arg1]
    },
    __wbg_set_usage_7177d2b5a0cb7ed1: function (arg0, arg1) {
      getObject(arg0).usage = arg1 >>> 0
    },
    __wbg_set_usage_e842e619c53799e7: function (arg0, arg1) {
      getObject(arg0).usage = arg1 >>> 0
    },
    __wbg_set_vertex_5b13839ffaff5f37: function (arg0, arg1) {
      getObject(arg0).vertex = getObject(arg1)
    },
    __wbg_set_view_gpu_texture_view_9f7613e516713508: function (arg0, arg1) {
      getObject(arg0).view = getObject(arg1)
    },
    __wbg_set_visibility_78cfb96740c9deb5: function (arg0, arg1) {
      getObject(arg0).visibility = arg1 >>> 0
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
    __wbindgen_generic_0000000000000001: function (arg0, arg1) {
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
    './luiskr_skeleton_bg.js': import0,
  }
}

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

const __wbindgen_enum_GpuLoadOp = ['load', 'clear']

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
const SkeletonFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_skeleton_free(ptr, 1))

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1)
  const idx = heap_next
  heap_next = heap[idx]

  heap[idx] = obj
  return idx
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
    module_or_path = new URL('luiskr_skeleton_bg.wasm', import.meta.url)
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
