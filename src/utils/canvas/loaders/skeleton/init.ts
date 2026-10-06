/**
 * @file skeleton-init.ts — bootstrap for the skeleton layer: canvas
 * creation inside the component's shadow root, shared-renderer acquire
 * (failure → pure-CSS shimmer fallback), resize observation, pool
 * registration, and the idle-deferred loop start.
 */

import { SKELETON_CLASSES } from '@/core/tokens/classes/skeleton.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { WINDOW_EVENTS } from '@/core/tokens/events/dom.js'
import { SKELETON_SELECTORS } from '@/core/tokens/selectors/skeleton.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'
import { webglPool } from '../../webgl-pool.js'
import { skeletonRenderer } from './renderer.js'
import type { SkeletonWebGL } from '../skeleton-webgl.js'
import { SKELETON_RENDER, SKELETON_WARN } from '@/core/tokens/motion/skeleton.js'

/** Boot: builds the overlay canvas, acquires the pooled renderer, starts observing. */
export function init(host: SkeletonWebGL): void {
  if (typeof document === TYPE_STRINGS.UNDEFINED) return

  host.canvas = document.createElement(HTML_TAGS.CANVAS)

  host.canvas.className = SKELETON_CLASSES.SKELETON_LAYER

  host.canvas.setAttribute(SKELETON_WARN.ARIA_HIDDEN, STATE_STRINGS.TRUE)

  host.renderer = skeletonRenderer.acquire()

  const canvas = host.canvas

  host.ctx = host.renderer ? canvas.getContext(WEBGL_STRINGS.CONTEXT_2D) : null

  if (!host.renderer || !host.ctx) {
    if (host.renderer) skeletonRenderer.release()

    host.renderer = null

    host.canvas = null

    return
  }

  host.useWebGL = true

  window.addEventListener(WINDOW_EVENTS.RESIZE, host._onResize, { passive: true })

  // Placeholders settle after fonts/SVG placeholders load: follow their size
  if (typeof ResizeObserver !== TYPE_STRINGS.UNDEFINED) {
    host._ro = new ResizeObserver(() => host._scheduleRefresh())

    host._ro.observe(host.host)

    host.content
      .querySelectorAll(SKELETON_SELECTORS.SKELETON_ANY)
      .forEach((el) => host._ro?.observe(el))
  }

  host.host.classList.add(SKELETON_CLASSES.HAS_SKELETON_LAYER)

  host.refresh()

  // Off-screen layers stop rendering; they resume when scrolled into view
  webglPool.register(host.canvas, host)

  // Let first paint and the critical path finish before the field starts moving
  const begin = () => {
    host._idleId = null

    if (host.useWebGL && !host.animId) host._loop()
  }

  host._idleId =
    typeof requestIdleCallback === TYPE_STRINGS.FUNCTION
      ? requestIdleCallback(begin, { timeout: SKELETON_RENDER.START_DELAY })
      : (setTimeout(begin, SKELETON_RENDER.START_DELAY) as unknown as number)
}
