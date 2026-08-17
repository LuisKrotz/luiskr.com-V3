let wasmInstance = null

// Instantiate WebAssembly Engine module for high-performance carousel, animations, grid layout & media math
if (typeof window !== 'undefined' && 'WebAssembly' in window) {
  fetch('/wasm/engine.wasm')
    .then((res) => {
      if (!res.ok) throw new Error('WASM load error')
      return res.arrayBuffer()
    })
    .then((bytes) => WebAssembly.instantiate(bytes))
    .then(({ instance }) => {
      wasmInstance = instance.exports
    })
    .catch(() => {
      // Fallback
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

export function calcCarouselRingOffset(elapsed, duration, circumference) {
  if (wasmInstance && wasmInstance.calc_carousel_ring_offset) {
    return wasmInstance.calc_carousel_ring_offset(elapsed, duration, circumference)
  }
  return (elapsed / duration) * circumference
}

export function calcCarouselScrollTarget(idx, slideWidth, gap = 0) {
  if (wasmInstance && wasmInstance.calc_carousel_scroll_target) {
    return wasmInstance.calc_carousel_scroll_target(idx, slideWidth, gap)
  }
  return idx * (slideWidth + gap)
}

export function calcEaseOutCubic(t) {
  if (wasmInstance && wasmInstance.calc_ease_out_cubic) {
    return wasmInstance.calc_ease_out_cubic(t)
  }
  const f = 1 - t
  return 1 - f * f * f
}

export function calcDrawTextDelay(totalChars, targetDurationMs = 1800) {
  if (wasmInstance && wasmInstance.calc_draw_text_delay) {
    return Math.max(
      6,
      Math.min(22, Math.round(wasmInstance.calc_draw_text_delay(totalChars, targetDurationMs)))
    )
  }
  return Math.max(6, Math.min(22, Math.round(targetDurationMs / (totalChars || 1))))
}

export function calcDrawTextOffset(idx, charsBefore, delay) {
  if (wasmInstance && wasmInstance.calc_draw_text_offset) {
    return wasmInstance.calc_draw_text_offset(idx, charsBefore, delay)
  }
  return charsBefore * delay + idx * 30
}

export function calcColsForWidth(vw) {
  return vw < 540
    ? 1
    : vw < 960
      ? 2
      : vw < 1440
        ? 3
        : vw < 1920
          ? 4
          : vw < 2100
            ? 5
            : vw < 2560
              ? 6
              : 7
}

export function calcResponsivePadding(vw) {
  return vw < 320 ? 13 : vw < 540 ? 21 : vw < 768 ? 34 : vw < 1024 ? 55 : vw < 1680 ? 89 : 144
}

export function calcAspectScaled(width, height, maxW = 1920) {
  if (!width || width <= maxW) return height
  return Math.round(height * (maxW / width))
}
