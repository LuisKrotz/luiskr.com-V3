---
name: perf-compute-offload
description: Off-main-thread compute — WASM worker pool for batch CPU work, worker threads, GPU/WebGPU/WebGL/NPU paths, and keeping the main thread free for input and paint.
---

# Compute Offload — WASM, Workers, GPU

The main thread should render and answer input. Batch CPU work belongs in the WASM pool, workers, or on GPU.

## WASM pool — the primary offload vehicle

`core/utils/wasm/wasm-pool.ts` dispatches work to `scripts/wasm/engine.wasm` in a worker, with JS fallbacks per function. Existing consumers: `wasm-css`, `wasm-image-decoder`, `wasm-layout`, `wasm-media-threads`, `wasm-scroll`, `wasm-string`.

- Route **batch** CPU work through the pool: layout fitting, media decode, hashing, text shaping, physics — anything measurable >1–2 ms when done on main thread.
- Do NOT offload chatty, fine-grained calls — one round trip to a worker costs ~0.05–0.3 ms plus structured-clone serialization; per-frame or per-element calls lose. Batch inputs, one dispatch.
- Every wasm function needs a JS fallback arm — coverage gates apply to both; fallbacks live beside the consumer (see `draw-text/fit.ts` pattern).
- WASM module warm-up is lazy and on-demand — keep it off the critical path; first dispatch can stay a cold JS-fallback call.

## Workers & parallelism

- Worker parallelism is bounded by `hardwareConcurrency` — the pool sizes itself; don't hand-roll thread counts.
- Use `SharedArrayBuffer`/transferable `ArrayBuffer` for large payloads (COOP/COEP headers are already configured for this) — avoid postMessage clones of multi-MB data.
- Workers must never touch the DOM. Return plain data; the main thread writes.

## GPU / WebGPU / WebGL

- `core/utils/gpu/` — `gpu-accel` (WebGPU), `gpu-info`, `npu-predict` (ONNX NPU probe). `core/utils/canvas/` — `webgl-pool`, `webgl-mode`, `gl-lifecycle`, widget canvas pipeline.
- **WebGPU → WebGL fallback** is automatic; every GPU feature must degrade gracefully (es2016-tier browsers get the WebGL path, no-WebGL gets canvas2d).
- The Chromium warning `powerPreference is currently ignored when calling requestAdapter() on Windows` comes from inside three.js — it is advisory, not a failure; the adapter still initializes. Do not "fix" it from app code. On Windows, GPU compositing is handled by the browser's compositor — `transform`/`opacity` animations and canvas work hit GPU automatically.
- Per-frame math belongs in shaders or sync local math; uniforms update, geometry stays resident — never re-upload buffers per frame.
- NPU (`npu-predict`) is probe-gated — keep it behind capability detection and idle-scheduled, never blocking render.

## Scheduling hierarchy

1. GPU shader / canvas — per-frame, compositor-aligned.
2. `requestAnimationFrame` — visual updates, synced with vsync; coalesced scroll/tick handlers.
3. WASM worker — batch CPU >1 ms, async result.
4. `requestIdleCallback` / `scheduler.postTask` — prefetch, warm-up, non-urgent state; must yield and re-check before continuing.
5. Main thread sync — only for work under ~0.5 ms or strictly required for paint.

## Verification

- Trace-bucket `EvaluateScript`/`wasm` events — batch jobs should appear off the gesture window.
- Confirm fallback arms covered: `yarn test` stays 100% per-file.
- GPU features: verify on a real WebGL-only path (force `?webgl` or disable WebGPU in flags) before shipping.
