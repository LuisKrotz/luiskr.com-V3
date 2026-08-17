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

self.onmessage = (e) => {
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
  }
}
