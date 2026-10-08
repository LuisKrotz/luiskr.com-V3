/**
 * @file lang-dialog/webgl.ts — mounts/tears down the dialog's canvas widgets
 * (one FlagWebGL per language option + the CloseButtonWebGL header control).
 */

import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { FLAG_CLASSES } from '@core/tokens/classes/flags.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { LANG_OPTIONS } from '@core/i18n.js'
import { CloseButtonWebGL } from '@core/utils/canvas/widgets/close-button.js'
import { FlagWebGL } from '@core/utils/canvas/widgets/flag-webgl.js'
import type { LangDialog } from '../LangDialog.js'

/** Mounts the header close button on its live canvas (rebuilds on swap). */
function mountCloseButton(host: LangDialog): void {
  const closeCanvas = host.$<HTMLCanvasElement>(`.${PREF_CLASSES.PREF_CLOSE_CANVAS}`)

  if (!closeCanvas) return

  if (host._closeBtn && host._closeBtn.canvas !== closeCanvas) {
    host._closeBtn.destroy()

    host._closeBtn = null
  }

  if (!host._closeBtn) {
    host._closeBtn = new CloseButtonWebGL(closeCanvas, () => host.close())
  }
}

/** Mounts one FlagWebGL per `data-flag` canvas. */
function mountFlags(host: LangDialog): void {
  if (!host._flags) {
    host._flags = {}
  }

  const flagCanvases = host.$$<HTMLCanvasElement>(`.${FLAG_CLASSES.FLAG_CANVAS}`)

  flagCanvases.forEach((canvas) => {
    const code = canvas.getAttribute(DATA_ATTRS.DATA_FLAG)

    if (!code) return

    const langOpt = LANG_OPTIONS.find((l) => l.code === code)

    if (!langOpt) return

    const existing = host._flags[code]

    if (existing && existing.canvas !== canvas) {
      existing.destroy()

      delete host._flags[code]
    }

    if (!host._flags[code]) {
      host._flags[code] = new FlagWebGL(canvas, langOpt)
    }
  })
}

/** Mounts all WebGL widgets onto the freshly rendered canvases. */
export function mountWebGLControls(host: LangDialog): void {
  if (!host.isOpen) return

  if (typeof window === TYPE_STRINGS.UNDEFINED) return

  mountCloseButton(host)

  mountFlags(host)
}

/** Tears down the mounted flag/close GL widgets. */
export function destroyWebGLControls(host: LangDialog): void {
  if (host._closeBtn) {
    host._closeBtn.destroy()

    host._closeBtn = null
  }

  if (host._flags) {
    Object.values(host._flags).forEach((f) => f.destroy())

    host._flags = {}
  }
}
