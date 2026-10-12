let wasmInstance = null

// Initialize WebAssembly engine inside Web Worker thread
fetch('/scripts/wasm/engine.wasm')
  .then((res) => {
    if (!res.ok) throw new Error('WASM fetch failed')
    return res.arrayBuffer()
  })
  .then((bytes) => WebAssembly.instantiate(bytes))
  .then(({ instance }) => {
    wasmInstance = instance.exports
    self.postMessage({ type: 'READY' })
  })
  .catch((err) => {
    self.postMessage({ type: 'ERROR', error: err ? err.message : 'WASM init error' })
  })

self.onmessage = async (e) => {
  const { id, type, payload } = e.data || {}
  if (!type) return

  if (type === 'BATCH_LAYOUT') {
    const { items, cols, containerW, gap } = payload
    const N = cols || 1
    const colW = Math.floor(
      wasmInstance && wasmInstance.calc_column_width
        ? wasmInstance.calc_column_width(N, containerW, gap)
        : (containerW - (N - 1) * gap) / N
    )

    const colH = Array(N).fill(0)
    const COMP_MULTS = [0.56, 0.58, 0.54, 0.57, 0.55]

    const results = (items || []).map((item, i) => {
      const isFeat = !!item.featured
      const mult = isFeat ? 0.48 : COMP_MULTS[i % COMP_MULTS.length]
      const span = N >= 14 ? (isFeat ? 6 : 4) : isFeat && N > 1 ? 2 : 1
      const itemW = span * colW + (span - 1) * gap
      const imageH = Math.round(itemW * mult)

      const candidates =
        N >= 14
          ? span === 6
            ? [0, 8, 4]
            : [0, 4, 6, 8, 10]
          : Array.from({ length: N - span + 1 }, (_, c) => c)

      let bestCol = 0
      let bestTop = Infinity
      for (const c of candidates) {
        let top = 0
        for (let s = 0; s < span; s++) top = Math.max(top, colH[c + s])
        if (top < bestTop) {
          bestTop = top
          bestCol = c
        }
      }

      const top = bestTop
      const left = bestCol * (colW + gap)
      for (let s = 0; s < span; s++) colH[bestCol + s] = top + imageH + gap

      return { index: i, itemW, imageH, colW, top, left }
    })

    const totalHeight = Math.max(...colH) - gap
    self.postMessage({ id, type: 'BATCH_LAYOUT_RESULT', results, totalHeight })
  } else if (type === 'PROCESS_MEDIA_ANALYTICS') {
    const { width, height, isVideo } = payload
    const aspectRatio = (width || 16) / (height || 9)
    const cardH =
      wasmInstance && wasmInstance.calc_card_height
        ? wasmInstance.calc_card_height(width, aspectRatio, 0)
        : width / aspectRatio

    self.postMessage({
      id,
      type: 'MEDIA_ANALYTICS_RESULT',
      results: { aspectRatio, cardH, isVideo },
    })
  } else if (type === 'COMPUTE_SPRING_PHYSICS') {
    const { current = 0, target = 1, velocity = 0, stiffness = 180, damping = 12 } = payload
    const distance = target - current
    const force = distance * stiffness
    const dampForce = velocity * damping
    const accel = force - dampForce
    const newVelocity = velocity + accel * 0.016
    const newPosition = current + newVelocity * 0.016

    self.postMessage({
      id,
      type: 'SPRING_PHYSICS_RESULT',
      results: { position: newPosition, velocity: newVelocity },
    })
  } else if (type === 'DOCS_SCENE_LAYOUT') {
    // Docs architecture scene: batch radial-tree positions off-thread.
    // Payload: { depths: number[], angles: number[] } — results carry the
    // flattened xyz triplets in node order (the formula mirrors the
    // main-thread fallback in arch-scene.ts; DOCS_UNITS is the source).
    const { depths = [], angles = [] } = payload
    const xyz = new Float32Array(depths.length * 3)

    for (let i = 0; i < depths.length; i++) {
      const d = depths[i]
      const a = angles[i]
      const r = 6 + d * 9

      xyz[i * 3] = Math.cos(a) * r
      xyz[i * 3 + 1] = ((d % 3) - 1) * 4 + Math.sin(a * 2) * 1.5
      xyz[i * 3 + 2] = Math.sin(a) * r
    }

    self.postMessage({ id, type: 'DOCS_SCENE_LAYOUT_RESULT', results: { xyz } }, [xyz.buffer])
  } else if (type === 'COMPUTE_TEXT_TIMING') {
    const { totalChars = 0, targetDurationMs = 1800, idx = 0, charsBefore = 0 } = payload
    const delay =
      wasmInstance && wasmInstance.calc_draw_text_delay
        ? Math.max(
            6,
            Math.min(
              22,
              Math.round(wasmInstance.calc_draw_text_delay(totalChars, targetDurationMs))
            )
          )
        : Math.max(6, Math.min(22, Math.round(targetDurationMs / (totalChars || 1))))
    const offset =
      wasmInstance && wasmInstance.calc_draw_text_offset
        ? wasmInstance.calc_draw_text_offset(idx, charsBefore, delay)
        : charsBefore * delay + idx * 30

    self.postMessage({
      id,
      type: 'TEXT_TIMING_RESULT',
      results: { delay, offset },
    })
  } else if (type === 'COMPUTE_MEDIA_HASH') {
    const { url = '' } = payload
    let hash = 5381
    for (let i = 0; i < url.length; i++) {
      hash = (hash << 5) + hash + url.charCodeAt(i)
      hash |= 0
    }
    const key = 'media_hash_' + Math.abs(hash).toString(36)
    self.postMessage({
      id,
      type: 'MEDIA_HASH_RESULT',
      results: { key, hash: Math.abs(hash) },
    })
  } else if (type === 'DECODE_IMAGE_WASM') {
    // Single-image WASM decode with GPU-hardware resize at decode time.
    // resizeWidth/resizeHeight instruct the GPU to resize during decompression,
    // avoiding any software-side scaling. colorSpaceConversion:'none' and
    // premultiplyAlpha:'none' skip CPU color-space transforms.
    const { blob, width, height } = payload
    if (!blob) return

    const bitmapOptions = {}
    if (width > 0) bitmapOptions.resizeWidth = width
    if (height > 0) bitmapOptions.resizeHeight = height
    if (width > 0 || height > 0) bitmapOptions.resizeQuality = 'high'
    bitmapOptions.colorSpaceConversion = 'none'
    bitmapOptions.premultiplyAlpha = 'none'
    bitmapOptions.imageOrientation = 'from-image'

    createImageBitmap(blob, bitmapOptions)
      .then((bitmap) => {
        self.postMessage(
          {
            id,
            type: 'DECODE_IMAGE_WASM_RESULT',
            results: { bitmap, width: bitmap.width, height: bitmap.height },
          },
          [bitmap]
        )
      })
      .catch((err) => {
        // Fallback: decode without options (browser may not support all options)
        createImageBitmap(blob)
          .then((bitmap) => {
            self.postMessage(
              {
                id,
                type: 'DECODE_IMAGE_WASM_RESULT',
                results: { bitmap, width: bitmap.width, height: bitmap.height },
              },
              [bitmap]
            )
          })
          .catch(() => {
            self.postMessage({ id, type: 'DECODE_IMAGE_WASM_ERROR', error: err?.message })
          })
      })
  } else if (type === 'DECODE_IMAGE_BATCH_WASM') {
    // Parallel batch decode: fetch + GPU-hardware decode all images in a single
    // worker invocation using Promise.all. All resulting ImageBitmaps are
    // transferred back zero-copy in a single postMessage transferList.
    // Each item: { url, width, height, index }
    const { items } = payload
    if (!items || !items.length) {
      self.postMessage({ id, type: 'DECODE_IMAGE_BATCH_WASM_RESULT', results: [] })
      return
    }

    const isCrossOrigin = (u) =>
      typeof u === 'string' && u.startsWith('http') && !u.startsWith(self.location.origin)

    const decodeOne = async ({ url, width, height, index }) => {
      try {
        if (!url || isCrossOrigin(url)) {
          return { index, url, bitmap: null, error: 'Cross-origin fetch avoided' }
        }

        const res = await fetch(url, { cache: 'force-cache' })
        if (!res.ok) return { index, bitmap: null, error: `HTTP ${res.status}` }
        const blob = await res.blob()

        const opts = {
          colorSpaceConversion: 'none',
          premultiplyAlpha: 'none',
          imageOrientation: 'from-image',
        }
        if (width > 0) opts.resizeWidth = width
        if (height > 0) opts.resizeHeight = height
        if (width > 0 || height > 0) opts.resizeQuality = 'high'

        try {
          const bitmap = await createImageBitmap(blob, opts)
          return { index, url, bitmap, width: bitmap.width, height: bitmap.height }
        } catch {
          // Fallback without options
          const bitmap = await createImageBitmap(blob)
          return { index, url, bitmap, width: bitmap.width, height: bitmap.height }
        }
      } catch (err) {
        return { index, url, bitmap: null, error: err?.message }
      }
    }

    // Fan-out: decode all images in parallel within this worker
    Promise.all(items.map(decodeOne))
      .then((results) => {
        const transferList = results.filter((r) => r.bitmap).map((r) => r.bitmap)

        self.postMessage({ id, type: 'DECODE_IMAGE_BATCH_WASM_RESULT', results }, transferList)
      })
      .catch((err) => {
        self.postMessage({ id, type: 'DECODE_IMAGE_BATCH_WASM_ERROR', error: err?.message })
      })
  } else if (type === 'DECODE_MEDIA_URL_WASM') {
    // Legacy single-URL path — kept for backward compatibility
    const { url } = payload
    if (!url) return

    if (
      typeof url === 'string' &&
      url.startsWith('http') &&
      !url.startsWith(self.location.origin)
    ) {
      self.postMessage({
        id,
        type: 'DECODE_MEDIA_URL_WASM_ERROR',
        error: 'Cross-origin fetch avoided',
      })
      return
    }

    fetch(url, { cache: 'force-cache' })
      .then((res) => {
        if (!res.ok) throw new Error('Fetch failed')
        return res.blob()
      })
      .then((blob) => createImageBitmap(blob))
      .then((bitmap) => {
        self.postMessage(
          {
            id,
            type: 'DECODE_MEDIA_URL_WASM_RESULT',
            results: { bitmap, width: bitmap.width, height: bitmap.height },
          },
          [bitmap]
        )
      })
      .catch((err) => {
        self.postMessage({ id, type: 'DECODE_MEDIA_URL_WASM_ERROR', error: err?.message })
      })
  } else if (type === 'PREFETCH_VIDEO_WASM') {
    // Multi-threaded parallel quality-variant prefetch.
    // Fetches all provided quality URLs simultaneously using Promise.all so the
    // best available stream is ready the moment the element enters the viewport.
    // payload: { variants: [{ url, quality, width, height }], posterUrl? }
    const { variants = [], posterUrl } = payload
    if (!variants.length) {
      self.postMessage({
        id,
        type: 'PREFETCH_VIDEO_WASM_RESULT',
        results: { variants: [], best: null, poster: null },
      })
      return
    }

    const fetchVariant = async ({ url: vUrl, quality, width, height }) => {
      try {
        if (
          !vUrl ||
          (typeof vUrl === 'string' &&
            vUrl.startsWith('http') &&
            !vUrl.startsWith(self.location.origin))
        ) {
          return { url: vUrl, quality, width, height, primed: false, error: 'Cross-origin avoided' }
        }

        // Range-request first 256 KB to prime the browser cache without a full
        // download — enough for the browser to begin buffering immediately.
        const rangeRes = await fetch(vUrl, {
          cache: 'force-cache',
          headers: { Range: 'bytes=0-262143' },
        })
        const status = rangeRes.status
        const contentType = rangeRes.headers.get('content-type') || ''
        const contentRange = rangeRes.headers.get('content-range') || ''
        const acceptsRanges = rangeRes.headers.get('accept-ranges') === 'bytes'
        let totalBytes = 0
        const m = contentRange.match(/\/(\d+)$/)
        if (m) totalBytes = parseInt(m[1], 10)

        return {
          url: vUrl,
          quality,
          width,
          height,
          status,
          contentType,
          totalBytes,
          acceptsRanges,
          primed: status === 206 || status === 200,
        }
      } catch (err) {
        return { url: vUrl, quality, width, height, primed: false, error: err?.message }
      }
    }

    // Parallel fetch all quality variants + poster simultaneously
    const [variantResults, posterBitmap] = await Promise.all([
      Promise.all(variants.map(fetchVariant)),
      posterUrl &&
      typeof posterUrl === 'string' &&
      (!posterUrl.startsWith('http') || posterUrl.startsWith(self.location.origin))
        ? fetch(posterUrl, { cache: 'force-cache' })
            .then((r) => (r.ok ? r.blob() : null))
            .then((b) => (b ? createImageBitmap(b) : null))
            .catch(() => null)
        : Promise.resolve(null),
    ])

    const transferList = posterBitmap ? [posterBitmap] : []

    self.postMessage(
      {
        id,
        type: 'PREFETCH_VIDEO_WASM_RESULT',
        results: {
          variants: variantResults,
          best:
            variantResults
              .filter((v) => v.primed)
              .sort((a, b) => (b.width || 0) - (a.width || 0))[0] || null,
          poster: posterBitmap,
        },
      },
      transferList
    )
  } else if (type === 'PROBE_VIDEO_WASM') {
    // Lightweight probe: fetch first 128 KB to detect codec, resolution,
    // and range support without downloading the full file.
    // Used by the NPU predictor to pick the best quality variant early.
    // payload: { url }
    const { url: probeUrl } = payload
    if (
      !probeUrl ||
      (typeof probeUrl === 'string' &&
        probeUrl.startsWith('http') &&
        !probeUrl.startsWith(self.location.origin))
    ) {
      self.postMessage({ id, type: 'PROBE_VIDEO_WASM_RESULT', results: null })
      return
    }

    try {
      const res = await fetch(probeUrl, {
        cache: 'force-cache',
        headers: { Range: 'bytes=0-131071' },
      })
      const contentType = res.headers.get('content-type') || ''
      const contentRange = res.headers.get('content-range') || ''
      const acceptsRanges = res.headers.get('accept-ranges') === 'bytes'
      const status = res.status
      let totalBytes = 0
      const rm = contentRange.match(/\/(\d+)$/)
      if (rm) totalBytes = parseInt(rm[1], 10)

      let codec = 'unknown'
      if (contentType.includes('mp4')) codec = 'h264/mp4'
      else if (contentType.includes('webm')) codec = 'vp9/webm'
      else if (contentType.includes('ogg')) codec = 'theora/ogg'
      else if (contentType.includes('av1') || contentType.includes('avif')) codec = 'av1'

      self.postMessage({
        id,
        type: 'PROBE_VIDEO_WASM_RESULT',
        results: {
          url: probeUrl,
          codec,
          contentType,
          totalBytes,
          acceptsRanges,
          supportsStreaming: acceptsRanges && status === 206,
        },
      })
    } catch (err) {
      self.postMessage({ id, type: 'PROBE_VIDEO_WASM_ERROR', error: err?.message })
    }
  } else if (type === 'DECODE_VIDEO_SEGMENT_WASM') {
    // Segment fetch: retrieve a specific byte range of a video file, returning
    // the raw ArrayBuffer zero-copy for use with WebCodecs or MediaSource API.
    // Multiple workers can handle concurrent segments in parallel.
    // payload: { url, byteStart, byteEnd }
    const { url: segUrl, byteStart = 0, byteEnd } = payload
    if (!segUrl) return

    try {
      const rangeHeader = byteEnd != null ? `bytes=${byteStart}-${byteEnd}` : `bytes=${byteStart}-`
      const res = await fetch(segUrl, { cache: 'force-cache', headers: { Range: rangeHeader } })

      if (!res.ok && res.status !== 206) throw new Error(`HTTP ${res.status}`)

      const buffer = await res.arrayBuffer()

      self.postMessage(
        {
          id,
          type: 'DECODE_VIDEO_SEGMENT_WASM_RESULT',
          results: {
            url: segUrl,
            byteStart,
            byteEnd: byteEnd ?? byteStart + buffer.byteLength - 1,
            byteLength: buffer.byteLength,
            buffer,
          },
        },
        [buffer]
      )
    } catch (err) {
      self.postMessage({ id, type: 'DECODE_VIDEO_SEGMENT_WASM_ERROR', error: err?.message })
    }
  } else if (type === 'DECODE_SVG_WASM') {
    // Fetch an SVG off the main thread and parse its intrinsic dimensions
    // (viewBox, width, height attributes) via regex — no DOM required.
    // Returns: { svgText, intrinsicWidth, intrinsicHeight, aspectRatio }
    // payload: { url }
    const { url: svgUrl } = payload
    if (!svgUrl) return

    try {
      const res = await fetch(svgUrl, { cache: 'force-cache' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const svgText = await res.text()

      // Extract dimensions from viewBox="x y w h" or width/height attributes
      let intrinsicWidth = 0
      let intrinsicHeight = 0

      const viewBoxMatch = svgText.match(/viewBox=["'][\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)["']/)
      if (viewBoxMatch) {
        intrinsicWidth = parseFloat(viewBoxMatch[1])
        intrinsicHeight = parseFloat(viewBoxMatch[2])
      }

      if (!intrinsicWidth) {
        const wMatch = svgText.match(/\bwidth=["']([0-9.]+)(?:px)?["']/)
        if (wMatch) intrinsicWidth = parseFloat(wMatch[1])
      }

      if (!intrinsicHeight) {
        const hMatch = svgText.match(/\bheight=["']([0-9.]+)(?:px)?["']/)
        if (hMatch) intrinsicHeight = parseFloat(hMatch[1])
      }

      const aspectRatio = intrinsicHeight > 0 ? intrinsicWidth / intrinsicHeight : 0

      self.postMessage({
        id,
        type: 'DECODE_SVG_WASM_RESULT',
        results: { url: svgUrl, svgText, intrinsicWidth, intrinsicHeight, aspectRatio },
      })
    } catch (err) {
      self.postMessage({ id, type: 'DECODE_SVG_WASM_ERROR', error: err?.message })
    }
  } else if (
    type === 'SF_FILL_SPIRAL' ||
    type === 'SF_FILL_ELLIPTICAL' ||
    type === 'SF_FILL_DUST' ||
    type === 'SF_FILL_SPECKLES' ||
    type === 'SF_FILL_BELT' ||
    type === 'SF_DECODE_DEEPFIELD'
  ) {
    // Star-field buffer fills — chunked by absolute index so a galaxy
    // sized job runs on several workers at once. The math mirrors the
    // main-thread fallbacks in engine/spiral.ts, star-cloud.ts,
    // belt.ts and structures.ts exactly: per-point RNG streams are
    // LCGs seeded `seed ^ (i+1)·p.SEED_STEP` (the Fibonacci hash step),
    // which makes any [i0,i1) range reproducible anywhere. All tuning
    // constants arrive in `p` (the live SF_SPIRAL/SF_STRUCTURE/SF_BELT/
    // scale token bags) so worker output can never drift from tokens.
    const p = payload.p || {}
    const { seed = 0, count = 0, i0 = 0, i1 = count } = payload
    const randOf = (i) => {
      let st = (seed ^ Math.imul(i + 1, p.SEED_STEP >>> 0)) >>> 0
      return () => {
        st = (Math.imul(st, 1664525) + 1013904223) >>> 0
        return st / 4294967296
      }
    }

    const n = Math.max(0, i1 - i0)
    const pos = new Float32Array(n * 3)
    const col = new Float32Array(n * 3)
    let kept = 0

    if (type === 'SF_FILL_SPIRAL') {
      const { radius = 1, arms = 4, thick = 1, halo = 0, jitter = 0, bubble } = payload
      const bulgeCount = Math.floor(count * p.BULGE)
      const haloCount = Math.floor(count * halo)
      const g = seed * (p.GOLDEN - 1)
      const barTilt = (g - Math.floor(g)) * Math.PI * 2
      const barCos = Math.cos(barTilt)
      const barSin = Math.sin(barTilt)
      const warpPhase = barTilt + Math.PI / 2

      for (let i = i0; i < i1; i++) {
        const rand = randOf(i)
        const o = (i - i0) * 3
        const inHalo = i >= count - haloCount
        const inBulge = i < bulgeCount

        if (inHalo) {
          const rr = Math.abs(rand() + rand() - 1) * radius * p.HALO_RADIUS
          const u = rand() * 2 - 1
          const theta = rand() * Math.PI * 2
          const s = Math.sqrt(1 - u * u)

          pos[o] = Math.cos(theta) * s * rr
          pos[o + 1] = u * rr
          pos[o + 2] = Math.sin(theta) * s * rr

          const k = 0.5 + 0.5 * (rr / (radius * p.HALO_RADIUS))
          col[o] = (p.CORE_R + (p.EDGE_R - p.CORE_R) * k) * p.HALO_DIM
          col[o + 1] = (p.CORE_G + (p.EDGE_G - p.CORE_G) * k) * p.HALO_DIM
          col[o + 2] = (p.CORE_B + (p.EDGE_B - p.CORE_B) * k) * p.HALO_DIM
        } else {
          const r = inBulge
            ? Math.abs(rand() + rand() - 1) * radius * 0.16
            : Math.sqrt(rand()) * radius * p.DISC_SPREAD

          const lr = Math.log(Math.max(r, p.ARM_LOG_RMIN) / p.ARM_LOG_R0)
          const arm = i % arms
          const armB =
            p.ARM_LOG_B * p.ARM_PITCH_TIGHT * (1 + p.ARM_PITCH_VAR * Math.sin(arm * p.GOLDEN_ANGLE))
          const armLum = 1 - p.ARM_LUM_VAR * Math.abs(Math.sin(arm * p.GOLDEN_ANGLE))
          const base =
            lr * armB +
            (arm * Math.PI * 2) / arms +
            Math.sin(r * p.ARM_SWAY_FREQ + arm * p.GOLDEN_ANGLE) *
              p.ARM_SWAY_AMP *
              (p.ARM_SWAY_CORE + (1 - p.ARM_SWAY_CORE) * Math.min(1, r / radius))

          const rimK = inBulge
            ? 0
            : p.ARM_JITTER_CORE + (p.ARM_JITTER_RIM - p.ARM_JITTER_CORE) * (r / radius)
          const spur = !inBulge && rand() < p.ARM_SPUR_FRAC
          const jj = jitter * rimK + (spur ? p.ARM_SPUR_JITTER : 0)
          const scatter = inBulge ? 0 : rand() + rand() + rand() - 1.5
          const angle = inBulge
            ? rand() * Math.PI * 2
            : base + (spur ? Math.PI / arms : 0) + scatter * jj

          const y = (rand() + rand() - 1) * radius * p.THIN * thick * (inBulge ? 3.2 : 1)
          const rn = Math.min(1, r / radius)
          const yy = inBulge
            ? y
            : y * (1 + rn * p.DISC_FLARE) +
              p.DISC_WARP * radius * rn * rn * Math.sin(angle - warpPhase)

          pos[o] = Math.cos(angle) * r
          pos[o + 1] = yy
          pos[o + 2] = Math.sin(angle) * r

          if (inBulge) {
            const u = pos[o] * barCos + pos[o + 2] * barSin
            const v = -pos[o] * barSin + pos[o + 2] * barCos
            pos[o] = u * p.BAR_X * barCos - v * barSin
            pos[o + 2] = u * p.BAR_X * barSin + v * barCos
          }

          const k = inBulge ? 0.22 : r / radius
          const w = Math.sin(angle * p.KNOT_LOBES - lr * p.KNOT_DRIFT)
          const knot = inBulge ? 1 : 1 - p.KNOT_DEPTH + p.KNOT_DEPTH * w * w
          const hot = inBulge ? 0 : Math.max(0, w) ** p.KNOT_POW
          const lum = 1 + (rand() + rand() - 1) * p.LUM_JITTER
          const hii = !inBulge && rand() < p.HII_FRAC
          const hotR = hii ? p.HII_R : p.KNOT_HOT_R
          const hotG = hii ? p.HII_G : p.KNOT_HOT_G
          const hotB = hii ? p.HII_B : p.KNOT_HOT_B
          const edge = Math.min(
            1,
            Math.max(
              0,
              (radius * p.DISC_SPREAD - r) / (radius * (p.DISC_SPREAD - p.EDGE_FADE_START))
            )
          )
          const lane = inBulge ? 0 : 1 - Math.min(1, Math.abs(scatter) * p.LANE_SCATTER_INV)
          const laneMix = lane * p.LANE_MIX
          const glow = knot * edge * armLum * lum
          const hotEdge = hot * edge * armLum

          const baseR = p.CORE_R + (p.EDGE_R - p.CORE_R) * k
          const baseG = p.CORE_G + (p.EDGE_G - p.CORE_G) * k
          const baseB = p.CORE_B + (p.EDGE_B - p.CORE_B) * k

          col[o] = (baseR + (p.LANE_R - baseR) * laneMix) * glow + hotEdge * hotR
          col[o + 1] = (baseG + (p.LANE_G - baseG) * laneMix) * glow + hotEdge * hotG
          col[o + 2] = (baseB + (p.LANE_B - baseB) * laneMix) * glow + hotEdge * hotB
        }

        if (bubble) {
          const dx0 = pos[o] - bubble.x
          const dy0 = pos[o + 1] - bubble.y
          const dz0 = pos[o + 2] - bubble.z
          const inside = dx0 * dx0 + dy0 * dy0 + dz0 * dz0 < bubble.r * bubble.r
          if (inside && rand() < p.BUBBLE_KEEP) {
            col[o] *= p.BUBBLE_DIM
            col[o + 1] *= p.BUBBLE_DIM
            col[o + 2] *= p.BUBBLE_DIM
          } else if (inside) {
            let tries = 0
            while (tries++ < 8) {
              const dx = pos[o] - bubble.x
              const dy = pos[o + 1] - bubble.y
              const dz = pos[o + 2] - bubble.z
              if (dx * dx + dy * dy + dz * dz >= bubble.r * bubble.r) break
              const rr = Math.hypot(pos[o], pos[o + 2])
              const a = rand() * Math.PI * 2
              pos[o] = Math.cos(a) * rr
              pos[o + 1] = (rand() + rand() - 1) * radius * p.THIN * thick
              pos[o + 2] = Math.sin(a) * rr
            }
          }
        }
      }
      kept = n
    } else if (type === 'SF_FILL_ELLIPTICAL') {
      const { radius = 1, tint = [1, 1, 1] } = payload

      for (let i = i0; i < i1; i++) {
        const rand = randOf(i)
        const o = (i - i0) * 3
        const r = Math.abs(rand() + rand() + rand() - 1.5) * radius * p.ELLIPSE_RADIAL
        const u = rand() * 2 - 1
        const theta = rand() * Math.PI * 2
        const s = Math.sqrt(1 - u * u)

        pos[o] = Math.cos(theta) * s * r
        pos[o + 1] = u * r * p.ELLIPSE_FLAT
        pos[o + 2] = Math.sin(theta) * s * r

        const k = Math.min(1, r / radius)
        const edgeNorm = r / (radius * p.ELLIPSE_RADIAL * 1.5)
        const edgeFade =
          1 - Math.min(1, Math.max(0, (edgeNorm - p.ELLIPSE_EDGE) / (1 - p.ELLIPSE_EDGE)))
        const bright = (p.ELLIPSE_CORE - k * p.ELLIPSE_FADE) * edgeFade

        col[o] = tint[0] * bright
        col[o + 1] = tint[1] * bright
        col[o + 2] = tint[2] * bright
      }
      kept = n
    } else if (type === 'SF_FILL_DUST') {
      const { radius = 1, arms = 4 } = payload

      for (let i = i0; i < i1; i++) {
        const rand = randOf(i)
        const o = (i - i0) * 3
        const r = (p.DUST_R_MIN + (p.DUST_R_MAX - p.DUST_R_MIN) * Math.sqrt(rand())) * radius
        const lr = Math.log(Math.max(r, p.ARM_LOG_RMIN) / p.ARM_LOG_R0)
        const arm = i % arms
        const gapB =
          p.ARM_LOG_B *
          p.ARM_PITCH_TIGHT *
          (1 + p.ARM_PITCH_VAR * Math.sin((arm + 0.5) * p.GOLDEN_ANGLE))
        const base =
          lr * gapB +
          ((arm + 0.5) * Math.PI * 2) / arms +
          Math.sin(r * p.ARM_SWAY_FREQ + (arm + 0.5) * p.GOLDEN_ANGLE) *
            p.ARM_SWAY_AMP *
            (p.ARM_SWAY_CORE + (1 - p.ARM_SWAY_CORE) * Math.min(1, r / radius))
        const angle = base + (rand() + rand() + rand() - 1.5) * p.DUST_JITTER
        const y = (rand() + rand() - 1) * radius * p.THIN * p.VOLUMETRIC_THICK * 0.4

        pos[o] = Math.cos(angle) * r
        pos[o + 1] = y
        pos[o + 2] = Math.sin(angle) * r
        col[o] = p.DUST_R
        col[o + 1] = p.DUST_G
        col[o + 2] = p.DUST_B
      }
      kept = n
    } else if (type === 'SF_FILL_SPECKLES') {
      // Member-galaxy knots along a seeded filament axis — the preamble
      // (axis, perpendicular basis, knot offsets) ships in the payload so
      // every chunk scatters around identical geometry; member points use
      // per-point hashed streams for chunkability.
      const {
        radius = 1,
        tint = [1, 1, 1],
        axis = [1, 0, 0],
        lat1 = [0, 1, 0],
        lat2 = [0, 0, 1],
        knotAt = [0],
      } = payload
      const fillR = radius * p.SPECKLE_FILL
      const knots = knotAt.length

      for (let i = i0; i < i1; i++) {
        const rand = randOf(i)
        const o = (i - i0) * 3
        const g = () => (rand() + rand() + rand() - 1.5) * fillR * 0.14
        const ki = Math.floor(rand() * knots)
        const along = knotAt[ki] + g() * 1.6
        const l1 = g()
        const l2 = g() * p.SPECKLE_FLATTEN

        pos[o] = axis[0] * along + lat1[0] * l1 + lat2[0] * l2
        pos[o + 1] = axis[1] * along + lat1[1] * l1 + lat2[1] * l2
        pos[o + 2] = axis[2] * along + lat1[2] * l1 + lat2[2] * l2

        const bright = p.SPECKLE_DIM + rand() * (1 - p.SPECKLE_DIM)
        col[o] = tint[0] * bright
        col[o + 1] = tint[1] * bright
        col[o + 2] = tint[2] * bright
      }
      kept = n
    } else if (type === 'SF_FILL_BELT') {
      // Annulus with Kirkwood-lane rejection — candidates are per-index
      // seeded, rejected draws compact out of the chunk's kept count.
      const { inner = 0, width = 1, puff = 0, lanes = 0, tint = [1, 1, 1] } = payload

      for (let i = i0; i < i1; i++) {
        const rand = randOf(i)
        const r = inner + Math.sqrt(rand()) * width
        const angle = rand() * Math.PI * 2
        const lane = Math.sin(r * lanes)

        if (lanes > 0 && rand() > 1 - p.GAP_DEPTH * lane * lane) continue

        const o = kept * 3
        pos[o] = Math.cos(angle) * r
        pos[o + 1] = (rand() + rand() - 1) * puff
        pos[o + 2] = Math.sin(angle) * r

        const albedo = 1 - p.ALBEDO_JITTER / 2 + rand() * p.ALBEDO_JITTER
        col[o] = tint[0] * albedo
        col[o + 1] = tint[1] * albedo
        col[o + 2] = tint[2] * albedo
        kept++
      }
    } else if (type === 'SF_DECODE_DEEPFIELD') {
      // Packed Float32 record decode — heliocentric galactic ly → chart
      // units via the three-tier compression, B-V → spectral tint ramp,
      // magnitude → brightness with the survey edge fade. `data` arrives
      // as a structured-cloned Uint8Array of record bytes (header
      // already stripped; `count` carries the record total) so the main
      // thread keeps its buffer when the fallback must run.
      const { data } = payload
      const bytes = data instanceof Uint8Array ? data : new Uint8Array(data || [])
      const stride = p.STRIDE || 6
      const total = Math.min(
        count,
        Math.floor(bytes.byteLength / 4 / stride),
        p.MAX_STARS || Infinity
      )
      const f32 = new Float32Array(bytes.buffer, bytes.byteOffset, total * stride)
      const [i0r, i1r] = [i0 || 0, Math.min(i1 || total, total)]

      const chartDist = (ly) => {
        if (ly <= 0) return 0
        const ge = p.GALACTIC_BREAK / p.GALACTIC_LY
        if (ly <= p.GALACTIC_BREAK) return ly / p.GALACTIC_LY
        const le = ge + p.LOCAL_GROUP_BREAK / p.LOCAL_GROUP_LY - p.GALACTIC_BREAK / p.LOCAL_GROUP_LY
        if (ly <= p.LOCAL_GROUP_BREAK) return ge + (ly - p.GALACTIC_BREAK) / p.LOCAL_GROUP_LY
        return Math.min(le + (ly - p.LOCAL_GROUP_BREAK) / p.COSMIC_LY, p.COSMIC_CLAMP)
      }

      const spec = (ci) => {
        const lerpC = (a, b, k) => [
          a[0] + (b[0] - a[0]) * k,
          a[1] + (b[1] - a[1]) * k,
          a[2] + (b[2] - a[2]) * k,
        ]
        if (ci <= p.CI_LOW) return p.STAR_BLUE
        if (ci <= p.CI_WARM) return lerpC(p.STAR_BLUE, p.STAR_WHITE, ci / (p.CI_WARM - p.CI_LOW))
        if (ci <= p.CI_GOLD)
          return lerpC(p.STAR_WHITE, p.STAR_GOLD, (ci - p.CI_WARM) / (p.CI_GOLD - p.CI_WARM))
        if (ci <= p.CI_RED)
          return lerpC(p.STAR_GOLD, p.STAR_RED, (ci - p.CI_GOLD) / (p.CI_RED - p.CI_GOLD))
        return p.STAR_RED
      }

      for (let i = i0r; i < i1r; i++) {
        const b = i * stride
        const gx = f32[b]
        const gy = f32[b + 1]
        const gz = f32[b + 2]
        const dLy = Math.sqrt(gx * gx + gy * gy + gz * gz)
        const kind = f32[b + 5]

        if (kind === p.KIND_STAR && dLy > p.STAR_MAX_LY) continue

        const k = dLy > 0 ? chartDist(dLy) / dLy : 0
        const o = kept * 3
        pos[o] = -gx * k
        pos[o + 1] = gz * k
        pos[o + 2] = gy * k

        const mag = f32[b + 3]
        const ci = f32[b + 4]
        const rgb =
          kind === p.KIND_EXOPLANET ? p.EXO_TINT : kind === p.KIND_DSO ? p.DSO_TINT : spec(ci)
        const edge =
          kind === p.KIND_DSO ? 1 : 1 - Math.min(1, Math.max(0, (dLy - p.EDGE_LY) / p.EDGE_BAND_LY))
        const bright = Math.max(p.MAG_FLOOR, p.MAG_BIAS - mag * p.MAG_SLOPE) * edge

        col[o] = rgb[0] * bright
        col[o + 1] = rgb[1] * bright
        col[o + 2] = rgb[2] * bright
        kept++
      }
    }

    self.postMessage({ id, type: type + '_RESULT', results: { pos, col, kept } }, [
      pos.buffer,
      col.buffer,
    ])
  }
}
