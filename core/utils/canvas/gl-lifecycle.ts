/**
 * @file gl-lifecycle.ts
 * @description Shared context-loss + release plumbing for the quad-based
 * WebGL widgets. Two rules keep the browser's context pool healthy:
 *
 * 1. Never preventDefault() on `webglcontextlost`. A prevented loss asks
 *    the browser to restore the context — every widget's deliberate
 *    `loseContext()` in destroy() would then resurrect a zombie context
 *    no one draws to. Real losses take the permanent CSS/2D fallback.
 * 2. Detach the loss listener BEFORE an intentional `loseContext()` so
 *    teardown never races the async event into the fallback path.
 */
import { GL_EVENTS } from '@core/tokens/events/dom.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

/** Minimal surface every quad-based widget/renderer exposes for teardown. */
export interface QuadGLResources {
  gl: WebGLRenderingContext | WebGL2RenderingContext | null
  program: WebGLProgram | null
  quadBuffer: WebGLBuffer | null
}

/**
 * Attaches a `webglcontextlost` listener that runs `onLost` (the widget's
 * fallback trigger) without preventDefault — a lost context stays lost
 * and the CSS/2D fallback takes over. Returns the bound handler so
 * `releaseQuadGL` can detach it before an intentional `loseContext()`.
 */
export const watchContextLoss = (canvas: HTMLCanvasElement, onLost: () => void): EventListener => {
  const handler: EventListener = () => {
    onLost()
  }

  canvas.addEventListener(GL_EVENTS.WEBGL_CONTEXT_LOST, handler, false)

  return handler
}

/**
 * Frees the quad program + buffer and force-loses the context. The
 * `onLost` listener (from watchContextLoss) is detached first so the
 * asynchronous loss event cannot fire the widget's fallback (or mark
 * the canvas) during a deliberate teardown — and without preventDefault
 * no zombie context is ever restored.
 */
export const releaseQuadGL = (
  canvas: HTMLCanvasElement | null,
  host: QuadGLResources,
  onLost: EventListener | null = null
): void => {
  const gl = host.gl

  if (!gl) return

  if (canvas && onLost) {
    canvas.removeEventListener(GL_EVENTS.WEBGL_CONTEXT_LOST, onLost)
  }

  if (host.quadBuffer) gl.deleteBuffer(host.quadBuffer)

  if (host.program) gl.deleteProgram(host.program)

  // `?.loseContext` alone isn't enough — some stub/extension objects return a
  // truthy value that isn't callable, so check the member is a function first.
  const loseExt = gl.getExtension?.(WEBGL_STRINGS.WEBGL_LOSE_CONTEXT)

  if (loseExt && typeof loseExt.loseContext === TYPE_STRINGS.FUNCTION) loseExt.loseContext()

  host.gl = null

  host.program = null

  host.quadBuffer = null
}
