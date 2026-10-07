/**
 * @file close-button-init.ts — boot + GL setup for the close button:
 * size detection (canvas box → parent button → 55px design fallback),
 * the DPR-capped backing store, context-loss → CSS-X fallback, and the
 * program build via the shared gl-program helper.
 */

import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'
import { createQuadProgram, getUniforms } from '../../gl-program.js'
import { releaseQuadGL, watchContextLoss } from '../../gl-lifecycle.js'
import { webglPool } from '../../webgl-pool.js'
import { CLOSE_BUTTON_FS, CLOSE_BUTTON_VS } from './shaders.js'
import { glContextOptions } from '@/utils/gpu/gpu-info.js'
import type { CloseButtonWebGL } from '../close-button.js'
import { webglContext } from '../../webgl-mode.js'
import { devWarn } from '@/core/devlog.js'

/** Design dimension of the expand-modal close button (px). */
const FALLBACK_SIZE = 55

/** Min measured size before a rect counts as "laid out". */
const MIN_MEASURED = 10

/** Width deltas below this are sub-pixel noise — skip the re-size. */
const RESIZE_EPS = 2

/** Backing-store DPR cap — the shader's AA bands need ≤2×, not more. */
function cappedDpr(): number {
  return Math.min((typeof window !== TYPE_STRINGS.UNDEFINED ? window.devicePixelRatio : 1) || 1, 2)
}

/** Applies the DPR-scaled backing-store size for the current CSS size. */
function applyBackingStore(host: CloseButtonWebGL): void {
  const dpr = cappedDpr()

  host.canvas.width = Math.round(host.width * dpr)

  host.canvas.height = Math.round(host.height * dpr)
}

/** Re-measures + re-sizes the backing store when the host box changes. */
function observeResize(host: CloseButtonWebGL): void {
  if (typeof ResizeObserver === TYPE_STRINGS.UNDEFINED) return

  host._ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = entry.contentRect.width

      const h = entry.contentRect.height

      if (
        w > MIN_MEASURED &&
        (Math.abs(w - host.width) > RESIZE_EPS || Math.abs(h - host.height) > RESIZE_EPS)
      ) {
        host.width = w

        host.height = h || w

        applyBackingStore(host)

        if (host.gl) {
          host.gl.viewport(0, 0, host.canvas.width, host.canvas.height)
        }
      }
    }
  })

  if (host.canvas.parentElement) {
    host._ro.observe(host.canvas.parentElement)
  } else {
    host._ro.observe(host.canvas)
  }
}

/** Context-loss → CSS ::before/::after X strokes on the parent button. */
export function onContextLost(host: CloseButtonWebGL): void {
  host.useWebGL = false

  host.gl = null

  if (host.animId) {
    cancelAnimationFrame(host.animId)

    host.animId = null
  }

  host.canvas.classList.add(STATE_CLASSES.IS_FALLBACK)
}

/** Boot sequence: GL init → event binding → render start; fully degrades to the fallback path. */
export function init(host: CloseButtonWebGL): void {
  if (!host.canvas || typeof host.canvas.getContext !== TYPE_STRINGS.FUNCTION) return

  const rect = host.canvas.getBoundingClientRect?.()

  const parentRect = host.canvas.parentElement?.getBoundingClientRect?.()

  // Sizing: prefer the canvas's own box, fall back to the parent button's
  // (the canvas may be 0-sized until styles land), else 55px — the
  // expand-modal close button's design dimension.
  const detectedW =
    rect && rect.width > MIN_MEASURED
      ? rect.width
      : parentRect && parentRect.width > MIN_MEASURED
        ? parentRect.width
        : FALLBACK_SIZE

  host.width = detectedW

  host.height =
    rect && rect.height > MIN_MEASURED
      ? rect.height
      : parentRect && parentRect.height > MIN_MEASURED
        ? parentRect.height
        : detectedW

  applyBackingStore(host)

  observeResize(host)

  // No preventDefault on context loss: a prevented loss asks the browser
  // to restore the context, and our deliberate loseContext() in destroy()
  // would resurrect a zombie that silently exhausts the context pool.
  host._onContextLost = watchContextLoss(host.canvas, () => onContextLost(host))

  initWebGL(host)

  if (!host.useWebGL) {
    // getContext('webgl') failed — a canvas that failed once can never hand
    // out a 2d context either, so the CSS X is the only reliable fallback.
    // Do NOT clone/replace: the host component keeps a persistent reference
    // to this element across re-renders.
    host.canvas.classList.add(STATE_CLASSES.IS_FALLBACK)
  }

  host.bindEvents()

  // Offscreen close buttons release their GL entirely; restore() rebuilds it.
  webglPool.register(host.canvas, host)

  host.animate()
}

/** Creates the WebGL context, compiles the shader program and sets up uniforms/buffers; falls back on any failure. */
export function initWebGL(host: CloseButtonWebGL): void {
  // Fallback-first: the semantic button shows its CSS X immediately and keeps
  // it through unsupported/context/program-failure paths. A successful first
  // frame removes this marker synchronously after GL setup.
  host.canvas.classList.add(STATE_CLASSES.IS_FALLBACK)

  try {
    const attrs = glContextOptions({ alpha: true, antialias: true })

    const gl = webglContext(host.canvas, attrs) as WebGLRenderingContext | null

    if (!gl) return

    const built = createQuadProgram(gl, CLOSE_BUTTON_VS, CLOSE_BUTTON_FS, 'CloseButton', {
      premultiplied: false,
      warn: (stage: string, info: unknown) =>
        devWarn(
          `CloseButton ${stage === WEBGL_STRINGS.VERTEX_STAGE ? 'vs' : stage === WEBGL_STRINGS.FRAGMENT_STAGE ? 'fs' : 'program'} error:`,
          info
        ),
    })

    if (!built) {
      host.gl = gl

      releaseQuadGL(host.canvas, host, host._onContextLost)

      return
    }

    host.gl = gl

    host.program = built.program

    host.quadBuffer = built.quadBuffer

    const u = getUniforms(gl, built.program, {
      u_resolution: 'u_resolution',
      u_time: 'u_time',
      u_liquid: 'u_liquid',
      u_draw: 'u_draw',
      u_rot: 'u_rot',
      u_click_time: 'u_click_time',
    })

    host.uResolution = u.u_resolution

    host.uTime = u.u_time

    host.uLiquid = u.u_liquid

    host.uDraw = u.u_draw

    host.uRot = u.u_rot

    host.uClickTime = u.u_click_time

    host.aPos = gl.getAttribLocation(built.program, WEBGL_STRINGS.A_POS)

    host.useWebGL = true

    host.canvas.classList.remove(STATE_CLASSES.IS_FALLBACK)
  } catch (e) {
    devWarn('CloseButton WebGL fallback:', e)

    host.useWebGL = false

    host.canvas.classList.add(STATE_CLASSES.IS_FALLBACK)
  }
}
