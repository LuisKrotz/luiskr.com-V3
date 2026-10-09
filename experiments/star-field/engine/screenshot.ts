/**
 * @file engine/screenshot.ts
 * @description PNG capture for the star-field engine: renders one frame,
 * waits a RAF for the GPU write, then downloads — toDataURL first with a
 * toBlob/object-URL fallback for tainted or oversized canvases. Mirrors
 * the earth engine's screenshot contract.
 */
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { NET_STRINGS } from '@core/tokens/strings/net.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import type { SFState } from './types.js'
import { devError, devWarn } from '@core/devlog.js'

/** Download filename stem — the timestamp suffix lands at capture time. */
const FILENAME_STEM = 'star-field-screenshot-'

/**
 * Renders one frame and downloads the canvas as PNG. `toDataURL` throws
 * on tainted canvases and returns 'data:,' on oversized ones — both fall
 * back to `toBlob` + an object URL.
 * @param s Engine state.
 */
export async function takeStarScreenshot(s: SFState): Promise<void> {
  if (!s.canvas || !s.renderer) return

  try {
    if (s.scene && s.camera) s.renderer.render(s.scene, s.camera)

    await new Promise<void>((r) => requestAnimationFrame(() => r()))

    const canvas = s.canvas
    let dataUrl = ''

    try {
      dataUrl = canvas.toDataURL(NET_STRINGS.IMAGE_PNG)
    } catch (err) {
      devWarn('[StarField] toDataURL fallback:', err)
    }

    if (!dataUrl || dataUrl === 'data:,') {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, NET_STRINGS.IMAGE_PNG)
      )

      // A null blob means capture failed outright — clear the empty
      // 'data:,' sentinel so the download is skipped rather than saved.
      dataUrl = blob ? URL.createObjectURL(blob) : ''
    }

    if (dataUrl) {
      const a = document.createElement(HTML_TAGS.A)

      a.style.display = STATE_STRINGS.NONE

      a.download = `${FILENAME_STEM}${Date.now()}.png`

      a.href = dataUrl

      document.body.appendChild(a)

      a.click()

      setTimeout(() => {
        a.remove()

        if (dataUrl.startsWith(NET_STRINGS.BLOB_COLON)) URL.revokeObjectURL(dataUrl)
      }, 1000)
    }
  } catch (e) {
    devError('[StarField] Screenshot failed:', e)
  }
}
