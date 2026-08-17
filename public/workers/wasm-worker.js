let wasmInstance = null

// Web Worker thread WebAssembly initialization
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
  const { id, type, payload } = e.data
  if (type === 'BATCH_LAYOUT') {
    const { items, cols, containerW, gap } = payload
    const colW = wasmInstance && wasmInstance.calc_column_width
      ? wasmInstance.calc_column_width(cols, containerW, gap)
      : (containerW - (cols - 1) * gap) / cols

    const results = (items || []).map((item, i) => {
      const mult = item.featured ? 0.48 : 0.55
      const span = item.featured && cols > 1 ? 2 : 1
      const itemW = span * colW + (span - 1) * gap
      const imageH = Math.round(itemW * mult)
      return { index: i, itemW, imageH, colW }
    })
    self.postMessage({ id, type: 'BATCH_LAYOUT_RESULT', results })
  }
}
