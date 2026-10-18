/* @ts-self-types="./luiskr_flag.d.ts" */

/**
 * Public wasm surface — one flag canvas per instance.
 */
export class Flag {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    FlagFinalization.unregister(this)
    return ptr
  }
  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_flag_free(ptr, 0)
  }
  /**
   * `frame` — one animation tick: pack, write, draw. Skips silently
   * until textures land (no bind group yet — an unbound draw would
   * be a validation error).
   *
   * @param dt Seconds since the previous call.
   * @param {number} dt
   */
  frame(dt) {
    wasm.flag_frame(this.__wbg_ptr, dt)
  }
  /**
   * `init` — device + pipeline + sampler; the bind group builds
   * once textures land (`upload_textures` → `rebind`).
   *
   * @param canvas The widget's dedicated canvas.
   * @returns Ok on a live surface, Err(JsValue) on failure.
   * @param {HTMLCanvasElement} canvas
   * @returns {Promise<void>}
   */
  init(canvas) {
    const ret = wasm.flag_init(this.__wbg_ptr, addHeapObject(canvas))
    return takeObject(ret)
  }
  /**
   * `Flag::new` — un-initialized widget; `init` must follow.
   */
  constructor() {
    const ret = wasm.flag_new()
    this.__wbg_ptr = ret
    FlagFinalization.register(this, this.__wbg_ptr, this)
    return this
  }
  /**
   * `resize` — canvas-bitmap change → surface re-configure.
   *
   * @param _w Device-pixel width (element-side).
   * @param _h Device-pixel height.
   * @param {number} w
   * @param {number} h
   */
  resize(w, h) {
    wasm.flag_resize(this.__wbg_ptr, w, h)
  }
  /**
   * `set_size` — the canvas's CSS-pixel size (res + rect).
   *
   * @param w Canvas width in CSS pixels.
   * @param h Canvas height in CSS pixels.
   * @param {number} w
   * @param {number} h
   */
  set_size(w, h) {
    wasm.flag_set_size(this.__wbg_ptr, w, h)
  }
  /**
   * `set_state` — bundled scalar update: hover amount, the locale
   * personality, and the split-flag geometry.
   *
   * @param hover 0..1 hover amount.
   * @param anim Locale personality 0..11 (`GPU_FLAG_ANIMS`).
   * @param is_split 0 single / 1 split flag.
   * @param split_x Seam position 0..1.
   * @param {number} hover
   * @param {number} anim
   * @param {number} is_split
   * @param {number} split_x
   */
  set_state(hover, anim, is_split, split_x) {
    wasm.flag_set_state(this.__wbg_ptr, hover, anim, is_split, split_x)
  }
  /**
   * `upload_textures` — stage one or two RGBA8 flag images. Single-
   * flag widgets pass `rgba_b` identical to `rgba_a` (the shader
   * reads tex2 only when is_split=1 — a duplicate binding is the
   * cheapest no-op). Rebuilds the bind group so the new textures go
   * live next frame.
   *
   * @param rgba_a Packed RGBA8 pixels of the primary flag.
   * @param w_a Primary texture width px.
   * @param h_a Primary texture height px.
   * @param rgba_b Packed RGBA8 pixels of the secondary flag.
   * @param w_b Secondary texture width px.
   * @param h_b Secondary texture height px.
   * @param {Uint8Array} rgba_a
   * @param {number} w_a
   * @param {number} h_a
   * @param {Uint8Array} rgba_b
   * @param {number} w_b
   * @param {number} h_b
   */
  upload_textures(rgba_a, w_a, h_a, rgba_b, w_b, h_b) {
    const ptr0 = passArray8ToWasm0(rgba_a, wasm.__wbindgen_export)
    const len0 = WASM_VECTOR_LEN
    const ptr1 = passArray8ToWasm0(rgba_b, wasm.__wbindgen_export)
    const len1 = WASM_VECTOR_LEN
    wasm.flag_upload_textures(this.__wbg_ptr, ptr0, len0, w_a, h_a, ptr1, len1, w_b, h_b)
  }
}
if (Symbol.dispose) Flag.prototype[Symbol.dispose] = Flag.prototype.free
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
    __wbg___wbindgen_is_function_1f9d30630b8b1d3d: function (arg0) {
      const ret = typeof getObject(arg0) === 'function'
      return ret
    },
    __wbg___wbindgen_is_undefined_8865fb403f8fe9d8: function (arg0) {
      const ret = getObject(arg0) === undefined
      return ret
    },
    __wbg___wbindgen_throw_41e9ee4f547fc59a: function (arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1))
    },
    __wbg__wbg_cb_unref_dcc1a90847f04c41: function (arg0) {
      getObject(arg0)._wbg_cb_unref()
    },
    __wbg_beginRenderPass_46bc75d13eaf7381: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).beginRenderPass(getObject(arg1))
        return addHeapObject(ret)
      }, arguments)
    },
    __wbg_call_187d372bd5fdd4aa: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2))
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
    __wbg_gpu_d217bb3813d12cf1: function (arg0) {
      const ret = getObject(arg0).gpu
      return addHeapObject(ret)
    },
    __wbg_instanceof_GpuAdapter_dbd098644266b228: function (arg0) {
      let result
      try {
        result = getObject(arg0) instanceof GPUAdapter
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
    __wbg_navigator_2156486643462a87: function (arg0) {
      const ret = getObject(arg0).navigator
      return addHeapObject(ret)
    },
    __wbg_new_617a8cdb8bb1130e: function () {
      const ret = new Object()
      return addHeapObject(ret)
    },
    __wbg_new_typed_b01cb72a8af741a3: function (arg0, arg1) {
      try {
        var state0 = { a: arg0, b: arg1 }
        var cb0 = (arg0, arg1) => {
          const a = state0.a
          state0.a = 0
          try {
            return __wasm_bindgen_func_elem_739(a, state0.b, arg0, arg1)
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
    __wbg_queueMicrotask_9833f9a49df95a49: function (arg0) {
      const ret = getObject(arg0).queueMicrotask
      return addHeapObject(ret)
    },
    __wbg_queueMicrotask_a72f977e97f23c5f: function (arg0) {
      queueMicrotask(getObject(arg0))
    },
    __wbg_queue_17ba8833afbd540b: function (arg0) {
      const ret = getObject(arg0).queue
      return addHeapObject(ret)
    },
    __wbg_requestAdapter_ed5bc205588abf80: function (arg0) {
      const ret = getObject(arg0).requestAdapter()
      return addHeapObject(ret)
    },
    __wbg_requestDevice_a6f2e5cbbbf80722: function (arg0) {
      const ret = getObject(arg0).requestDevice()
      return addHeapObject(ret)
    },
    __wbg_resolve_0076e10020304ede: function (arg0) {
      const ret = Promise.resolve(getObject(arg0))
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
    __wbg_set_format_6bbbd4df6747733e: function (arg0, arg1) {
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
    __wbg_set_operation_d8894b0f9aa3db27: function (arg0, arg1) {
      getObject(arg0).operation = __wbindgen_enum_GpuBlendOperation[arg1]
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
    __wbg_set_size_4716cf40ee7a64be: function (arg0, arg1) {
      getObject(arg0).size = arg1 >>> 0
    },
    __wbg_set_size_c2eb75980b76e0ac: function (arg0, arg1, arg2) {
      getObject(arg0).size = getArrayJsValueViewFromWasm0(arg1, arg2)
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
    __wbg_set_texture_9f67e0e92f7c2af3: function (arg0, arg1) {
      getObject(arg0).texture = getObject(arg1)
    },
    __wbg_set_texture_e6c25e637d8a26a4: function (arg0, arg1) {
      getObject(arg0).texture = getObject(arg1)
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
    __wbg_set_vertex_5b13839ffaff5f37: function (arg0, arg1) {
      getObject(arg0).vertex = getObject(arg1)
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
    __wbg_then_c949d5a25a4e78f8: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).then(getObject(arg1), getObject(arg2))
      return addHeapObject(ret)
    },
    __wbg_then_e71170d78fcf8954: function (arg0, arg1) {
      const ret = getObject(arg0).then(getObject(arg1))
      return addHeapObject(ret)
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
    __wbindgen_generic_0000000000000001: function (arg0, arg1) {
      // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 21, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
      const ret = makeMutClosure(arg0, arg1, __wasm_bindgen_func_elem_725)
      return addHeapObject(ret)
    },
    __wbindgen_generic_0000000000000002: function (arg0, arg1) {
      // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("GPUDevice")], shim_idx: 17, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
      const ret = makeMutClosure(arg0, arg1, __wasm_bindgen_func_elem_160)
      return addHeapObject(ret)
    },
    __wbindgen_generic_0000000000000003: function (arg0, arg1) {
      // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("any")], shim_idx: 17, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
      const ret = makeMutClosure(arg0, arg1, __wasm_bindgen_func_elem_160_10)
      return addHeapObject(ret)
    },
    __wbindgen_generic_0000000000000004: function (arg0) {
      // Cast intrinsic for `F64 -> Externref`.
      const ret = arg0
      return addHeapObject(ret)
    },
    __wbindgen_generic_0000000000000005: function (arg0, arg1) {
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
    './luiskr_flag_bg.js': import0,
  }
}

function __wasm_bindgen_func_elem_739(arg0, arg1, arg2, arg3) {
  wasm.__wasm_bindgen_func_elem_739(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3))
}

function __wasm_bindgen_func_elem_725(arg0, arg1, arg2) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    wasm.__wasm_bindgen_func_elem_725(retptr, arg0, arg1, addHeapObject(arg2))
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true)
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true)
    if (r1) {
      throw takeObject(r0)
    }
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}

function __wasm_bindgen_func_elem_160(arg0, arg1, arg2) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    wasm.__wasm_bindgen_func_elem_160(retptr, arg0, arg1, addHeapObject(arg2))
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true)
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true)
    if (r1) {
      throw takeObject(r0)
    }
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}

function __wasm_bindgen_func_elem_160_10(arg0, arg1, arg2) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    wasm.__wasm_bindgen_func_elem_160_10(retptr, arg0, arg1, addHeapObject(arg2))
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

const __wbindgen_enum_GpuFilterMode = ['nearest', 'linear']

const __wbindgen_enum_GpuLoadOp = ['load', 'clear']

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
const FlagFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_flag_free(ptr, 1))

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
    module_or_path = new URL('luiskr_flag_bg.wasm', import.meta.url)
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
