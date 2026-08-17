let wasmInstance = null

// Instantiate WebAssembly module for high-performance grid math
if (typeof window !== 'undefined' && 'WebAssembly' in window) {
  fetch('/wasm/layout.wasm')
    .then((res) => {
      if (!res.ok) throw new Error('WASM load error')
      return res.arrayBuffer()
    })
    .then((bytes) => WebAssembly.instantiate(bytes))
    .then(({ instance }) => {
      wasmInstance = instance.exports
    })
    .catch(() => {
      // Graceful JS fallback
    })
}

export function calcColumnWidth(cols, width, gap) {
  if (wasmInstance && wasmInstance.calc_column_width) {
    return wasmInstance.calc_column_width(cols, width, gap)
  }
  return (width - (cols - 1) * gap) / cols
}

export function calcCardHeight(colWidth, aspectRatio, padding = 0) {
  if (wasmInstance && wasmInstance.calc_card_height) {
    return wasmInstance.calc_card_height(colWidth, aspectRatio, padding)
  }
  return colWidth / (aspectRatio || 1.777) + padding
}
