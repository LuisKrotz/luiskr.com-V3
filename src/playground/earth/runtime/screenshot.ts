/**
 * @file earth/screenshot.ts
 * @description PNG capture for the Earth engine, extracted from
 * earth-background.ts: temporarily bumps pixel ratio to 2×, renders one
 * frame, waits a RAF for the GPU write, then downloads — toDataURL first
 * with a toBlob/object-URL fallback for tainted or oversized canvases.
 */
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { NET_STRINGS } from '@/core/tokens/strings/net.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { handleEarthResize } from './frame.js'
import type { EarthState } from './state.js'

/** Renders one frame at 2× resolutionScale and downloads it as PNG. */
export const takeEarthScreenshot = async (s: EarthState): Promise<void> => {
  if (!s.canvas || !s.renderer) return

  const old = s.render.resolutionScale

  s.render.resolutionScale = 2

  handleEarthResize(s)

  try {
    // Render one frame at high res
    if (s.pipeline) {
      s.pipeline.render()
    } else if (s.scene && s.camera) {
      s.renderer.render(s.scene, s.camera)
    }

    // Wait a frame for GPU to finish writing to canvas
    await new Promise<void>((r) => requestAnimationFrame(() => r()))

    const canvas = s.canvas
    let dataUrl = ''

    try {
      dataUrl = canvas.toDataURL(NET_STRINGS.IMAGE_PNG)
    } catch (err) {
      console.warn('[EarthBG] toDataURL fallback:', err)
    }

    if (!dataUrl || dataUrl === 'data:,') {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, NET_STRINGS.IMAGE_PNG)
      )

      if (blob) {
        dataUrl = URL.createObjectURL(blob)
      }
    }

    if (dataUrl) {
      const a = document.createElement(HTML_TAGS.A)

      a.style.display = STATE_STRINGS.NONE

      a.download = `earth-screenshot-${Date.now()}.png`

      a.href = dataUrl

      document.body.appendChild(a)

      a.click()

      setTimeout(() => {
        a.remove()

        if (dataUrl.startsWith(NET_STRINGS.BLOB_COLON)) URL.revokeObjectURL(dataUrl)
      }, 1000)
    }
  } catch (e) {
    console.error('[EarthBG] Screenshot failed:', e)
  } finally {
    s.render.resolutionScale = old

    handleEarthResize(s)
  }
}
