let wasmInstance = null

// Initialize WebAssembly engine inside Web Worker thread
fetch('/wasm/engine.wasm')
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
    const colW =
      wasmInstance && wasmInstance.calc_column_width
        ? wasmInstance.calc_column_width(N, containerW, gap)
        : (containerW - (N - 1) * gap) / N

    const colH = Array(N).fill(0)
    const COMP_MULTS = [0.56, 0.58, 0.54, 0.57, 0.55]

    const results = (items || []).map((item, i) => {
      const isFeat = !!item.featured
      const mult = isFeat ? 0.48 : COMP_MULTS[i % COMP_MULTS.length]
      const span = isFeat && N > 1 ? 2 : 1
      const itemW = span * colW + (span - 1) * gap
      const imageH = Math.round(itemW * mult)

      let bestCol = 0
      let bestTop = Infinity
      for (let c = 0; c <= N - span; c++) {
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
  } else if (type === 'COMPUTE_TEXT_TIMING') {
    const { totalChars = 0, targetDurationMs = 1800, idx = 0, charsBefore = 0 } = payload
    const delay =
      wasmInstance && wasmInstance.calc_draw_text_delay
        ? Math.max(6, Math.min(22, Math.round(wasmInstance.calc_draw_text_delay(totalChars, targetDurationMs))))
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
      hash = ((hash << 5) + hash) + url.charCodeAt(i)
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
              { id, type: 'DECODE_IMAGE_WASM_RESULT', results: { bitmap, width: bitmap.width, height: bitmap.height } },
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

    const decodeOne = async ({ url, width, height, index }) => {
      try {
        const res = await fetch(url, { cache: 'force-cache' })
        if (!res.ok) return { index, bitmap: null, error: `HTTP ${res.status}` }
        const blob = await res.blob()

        const opts = { colorSpaceConversion: 'none', premultiplyAlpha: 'none', imageOrientation: 'from-image' }
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
        const transferList = results
          .filter((r) => r.bitmap)
          .map((r) => r.bitmap)

        self.postMessage(
          { id, type: 'DECODE_IMAGE_BATCH_WASM_RESULT', results },
          transferList
        )
      })
      .catch((err) => {
        self.postMessage({ id, type: 'DECODE_IMAGE_BATCH_WASM_ERROR', error: err?.message })
      })
  } else if (type === 'DECODE_MEDIA_URL_WASM') {
    // Legacy single-URL path — kept for backward compatibility
    const { url } = payload
    if (!url) return

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
      self.postMessage({ id, type: 'PREFETCH_VIDEO_WASM_RESULT', results: { variants: [], best: null, poster: null } })
      return
    }

    const fetchVariant = async ({ url: vUrl, quality, width, height }) => {
      try {
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

        return { url: vUrl, quality, width, height, status, contentType, totalBytes, acceptsRanges, primed: status === 206 || status === 200 }
      } catch (err) {
        return { url: vUrl, quality, width, height, primed: false, error: err?.message }
      }
    }

    // Parallel fetch all quality variants + poster simultaneously
    const [variantResults, posterBitmap] = await Promise.all([
      Promise.all(variants.map(fetchVariant)),
      posterUrl
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
          best: variantResults.filter((v) => v.primed).sort((a, b) => (b.width || 0) - (a.width || 0))[0] || null,
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
    if (!probeUrl) return

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
        results: { url: probeUrl, codec, contentType, totalBytes, acceptsRanges, supportsStreaming: acceptsRanges && status === 206 },
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
          results: { url: segUrl, byteStart, byteEnd: byteEnd ?? byteStart + buffer.byteLength - 1, byteLength: buffer.byteLength, buffer },
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

      const viewBoxMatch = svgText.match(/viewBox=["'][\d.\-]+\s+[\d.\-]+\s+([\d.]+)\s+([\d.]+)["']/)
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
  }
}
