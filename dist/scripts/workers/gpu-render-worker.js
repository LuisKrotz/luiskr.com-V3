/**
 * @file gpu-render-worker.js — the off-main-thread render thread for
 * the site's WebGPU widgets. The main thread transfers each widget's
 * canvas here via `canvas.transferToOffscreen()` and posts only
 * mount/frame/resize/input messages; every wasm artifact, the shared
 * GPUDevice, and all per-frame draw submissions live on THIS thread —
 * the page's main thread never touches a widget draw call.
 *
 *   probe        → { ok } capability handshake (worker WebGPU support)
 *   mount        → { id, url, cls, manual, canvas: OffscreenCanvas }
 *                  imports the artifact glue, instantiates the widget,
 *                  init(canvas, device) — device is requested HERE so
 *                  GPU objects never cross threads. Non-manual widgets
 *                  get their own pump loop on this thread.
 *   call         → { id, m, args } forwards widget methods (set_state,
 *                  tap, click, set_ink, upload_atlas, set_chars, …) —
 *                  transferables (ImageBitmap/ArrayBuffer) move zero-copy.
 *   frame        → { id, dt } manual-drive step (draw-text's own pacing)
 *   resize       → { id, w, h } device-px backing size + widget.resize
 *   set-active   → { id, on } viewport/hidden gating from the bridge
 *   probe-frame  → { id, ms, replyId } end-state frame + painted-pixel
 *                  readback (draw-text's overlay self-verify)
 *   destroy      → { id } stops the pump and frees the wasm box
 *
 * Replies: probe-ack · mounted · mount-fail · dead · call-result ·
 * frame-result · probe-result.
 *
 * Frame pacing: dedicated workers have no rAF — the pump uses
 * setTimeout at ~60Hz. Ambient widgets don't need vsync-locked
 * pacing; the one path that does (draw-text) drives `frame` messages
 * from the main thread's own rAF, so it keeps full refresh rate.
 */

const FRAME_MS = 16

/** bytesPerRow alignment required by copyTextureToBuffer. */
const COPY_PITCH = 256

/** Live widget records — id → { widget, canvas, manual, active, last, timer }. */
const widgets = new Map()

/** The worker's own shared GPUDevice — one device serves every canvas. */
let devicePromise = null

/**
 * wasm-pack `init` is not reentrant-safe: `__wbg_init` reads the
 * module-level `wasm` binding, then awaits instantiate — a concurrent
 * second call re-instantiates and swaps the heap under live widgets
 * (RefCell flags read garbage → 'gpu slot poisoned'). Memoize per
 * artifact URL so concurrent mounts share one instantiation.
 */
const moduleInit = new Map()

/** `initModule` — fetch + instantiate the artifact glue once per URL. */
const initModule = (url) => {
  let p = moduleInit.get(url)

  if (!p) {
    p = (async () => {
      const mod = await import(/* @vite-ignore */ url)

      await mod.default()

      return mod
    })()

    moduleInit.set(url, p)
  }

  return p
}

/** Request the worker-side device once; clears on loss so mounts re-request. */
const getDevice = async () => {
  if (!devicePromise) {
    devicePromise = (async () => {
      try {
        const adapter = await navigator.gpu?.requestAdapter()

        if (!adapter) return null

        const device = await adapter.requestDevice()

        if (!device) return null

        device.lost.then(() => {
          devicePromise = null
        })

        return device
      } catch {
        return null
      }
    })()
  }

  const device = await devicePromise

  if (!device) devicePromise = null

  return device
}

/**
 * Stop a record's pump loop.
 * @param rec The widget record.
 */
const stop = (rec) => {
  rec.active = false

  if (rec.timer) clearTimeout(rec.timer)

  rec.timer = 0
}

/**
 * The worker-side render pump — owns `widget.frame(dt)` for
 * RAF-driven kinds. A wasm-boundary throw or a false return disarms
 * the pump and reports `dead` so the bridge can fall back.
 * @param rec The widget record.
 */
const pump = (rec) => {
  if (!rec.active || rec.manual) return

  const now = performance.now()
  const dt = (now - rec.last) / 1000

  rec.last = now

  try {
    if (rec.widget.frame(dt) === false) {
      stop(rec)
      self.postMessage({ type: 'dead', id: rec.id })

      return
    }
  } catch (e) {
    stop(rec)
    self.postMessage({ type: 'dead', id: rec.id, error: String((e && e.message) || e) })

    return
  }

  rec.timer = setTimeout(() => pump(rec), FRAME_MS)
}

/**
 * `probeFrame` — the draw-text overlay's self-verify, worker-side:
 * jump the stagger to end state, read the canvas texture back through
 * the worker's device, count painted pixels.
 * @param rec The widget record.
 * @param ms The probe timestamp (past the last char's end).
 * @returns Painted coverage ratio 0..1, or -1 on any readback failure.
 */
const probeFrame = async (rec, ms) => {
  try {
    if (rec.widget.frame(ms / 1000) === false) return -1

    const device = await getDevice()

    if (!device) return -1

    const ctx = rec.canvas.getContext('webgpu')
    const tex = ctx.getCurrentTexture()
    const pitch = Math.ceil((tex.width * 4) / COPY_PITCH) * COPY_PITCH

    const buf = device.createBuffer({
      size: pitch * tex.height,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    })

    const enc = device.createCommandEncoder()

    enc.copyTextureToBuffer(
      { texture: tex },
      { buffer: buf, bytesPerRow: pitch, rowsPerImage: tex.height },
      [tex.width, tex.height]
    )

    device.queue.submit([enc.finish()])
    await buf.mapAsync(GPUMapMode.READ)

    const px = new Uint8Array(buf.getMappedRange())

    let painted = 0

    for (let row = 0; row < tex.height; row++) {
      const base = row * pitch

      for (let col = 0; col < tex.width; col++) {
        if (px[base + col * 4 + 3] > 0) painted++
      }
    }

    buf.unmap()
    buf.destroy()

    return painted / (tex.width * tex.height)
  } catch {
    return -1
  }
}

/**
 * `mount` — import the artifact, instantiate the widget, init it on
 * the transferred OffscreenCanvas. Manual records skip the pump —
 * their caller paces `frame` messages itself.
 */
const mount = async ({ id, url, cls, manual, canvas }) => {
  try {
    const device = await getDevice()

    if (!device) {
      self.postMessage({ type: 'mount-fail', id })

      return
    }

    const mod = await initModule(url)

    const WidgetClass = mod[cls]
    const widget = new WidgetClass()

    try {
      await widget.init(canvas, device)
    } catch (err) {
      // init failed after the box was allocated — free it or the
      // instance's wasm heap keeps the dead record forever.
      try {
        if (widget.__wbg_ptr) widget.free?.()
      } catch {
        /* a corrupt free is contained — the widget is dead either way */
      }

      throw err
    }

    const rec = { id, widget, canvas, manual, active: true, last: performance.now(), timer: 0 }

    widgets.set(id, rec)
    self.postMessage({ type: 'mounted', id })

    if (!manual) pump(rec)
  } catch (e) {
    self.postMessage({ type: 'mount-fail', id, error: String((e && e.message) || e) })
  }
}

self.onmessage = async (e) => {
  const d = e.data || {}

  if (d.type === 'probe') {
    const ok =
      typeof self !== 'undefined' && !!self.navigator?.gpu && typeof OffscreenCanvas !== 'undefined'

    self.postMessage({ type: 'probe-ack', ok })

    return
  }

  if (d.type === 'mount') {
    await mount(d)

    return
  }

  const rec = widgets.get(d.id)

  if (!rec) return

  if (d.type === 'call') {
    try {
      // Await the method — wasm-bindgen async exports (upload_atlas,
      // set_chars, …) return Promises; posting one raw is an
      // unserializable clone and the caller would stall to timeout.
      const result = await rec.widget[d.m]?.(...(d.args || []))

      if (d.replyId !== undefined) {
        self.postMessage({ type: 'call-result', replyId: d.replyId, result: result ?? null })
      }
    } catch (err) {
      if (d.replyId !== undefined) {
        self.postMessage({
          type: 'call-result',
          replyId: d.replyId,
          error: String((err && err.message) || err),
        })
      }
    }

    return
  }

  if (d.type === 'frame') {
    // Offscreen manual widgets idle — the bridge forwards set-active
    // for RAF kinds; manual callers pace frames only while revealed.
    if (!rec.active) return

    let alive = true

    try {
      alive = rec.widget.frame(d.dt) !== false
    } catch {
      alive = false
    }

    if (!alive) {
      self.postMessage({ type: 'frame-result', id: rec.id, alive: false })
      stop(rec)
    }

    return
  }

  if (d.type === 'resize-dims') {
    // Element-side canvas.width=/height= writes — OffscreenCanvas dims
    // only; the caller's own widget.resize follows on its message.
    try {
      rec.canvas.width = d.w
      rec.canvas.height = d.h
    } catch {
      /* stale surface — the next frame reports the widget dead */
    }

    return
  }

  if (d.type === 'resize') {
    try {
      rec.canvas.width = d.w
      rec.canvas.height = d.h
      rec.widget.resize(d.w, d.h)
    } catch {
      /* a stale surface reports dead on the next frame — no-op here */
    }

    return
  }

  if (d.type === 'set-active') {
    rec.active = !!d.on

    if (rec.active && !rec.manual && !rec.timer) {
      rec.last = performance.now()
      pump(rec)
    }

    if (!rec.active && rec.timer) stop(rec)

    return
  }

  if (d.type === 'probe-frame') {
    const coverage = await probeFrame(rec, d.ms)

    self.postMessage({ type: 'probe-result', replyId: d.replyId, coverage })

    return
  }

  if (d.type === 'destroy') {
    stop(rec)

    try {
      // wasm-bindgen free() is not idempotent — free only while the
      // box pointer is live (the registry then never re-enters it).
      if (rec.widget.__wbg_ptr) rec.widget.free?.()
    } catch {
      /* a corrupt free is contained — the widget is dead either way */
    }

    widgets.delete(d.id)
  }
}
