/**
 * @file skeleton-measure.ts
 * @description DOM measurement for SkeletonWebGL, extracted from
 * skeleton-webgl.ts — queries the content wrapper's skeleton
 * placeholders, converts their client rects into layer-relative boxes,
 * samples per-rect palette tokens, and resizes/repositions the overlay
 * canvas to the union box before uploading to the shader buffers.
 */

import { SKELETON_CSS_PROPS } from '@/core/tokens/css/skeleton.js'
import { SKELETON_SELECTORS } from '@/core/tokens/selectors/skeleton.js'
import type { SkeletonWebGL, SkelRect } from '../skeleton-webgl.js'
import { SKELETON_GLYPH, SKELETON_RENDER } from '@/core/tokens/motion/skeleton.js'

/** Re-measures the skeleton DOM rects into the layer's draw list. */
export function measureSkeleton(layer: SkeletonWebGL): void {
  if (!layer.useWebGL || !layer.host) return

  if (layer.resolveStart) return

  const nodes = Array.from(layer.content.querySelectorAll(SKELETON_SELECTORS.SKELETON_ANY))

  if (!nodes.length || !layer.canvas) return

  if (layer.canvas.parentNode !== layer.root) layer.root.appendChild(layer.canvas)

  const hostRect = layer.host.getBoundingClientRect()

  // Host-level palette first: per-rect sampling below falls back to it
  layer._sampleTheme()

  const dpr =
    Math.min(window.devicePixelRatio || 1, SKELETON_RENDER.MAX_DPR) * SKELETON_RENDER.RENDER_SCALE

  type SkelRectMaybe = Omit<SkelRect, 'base' | 'ink'> & {
    base: number[] | null
    ink: number[] | null
  }

  const boxes = nodes
    .slice(0, SKELETON_RENDER.MAX_RECTS)
    .map((el): SkelRectMaybe => {
      const r = el.getBoundingClientRect()

      const cs = getComputedStyle(el)

      const lh = parseFloat(cs.lineHeight)

      const isText =
        el.matches(SKELETON_SELECTORS.SKELETON_TEXT_LIKE) ||
        (r.height < SKELETON_GLYPH.TEXT_MAX_HEIGHT && r.height > 0)

      const row =
        isText && Number.isFinite(lh) && lh > 0 && r.height > lh * 1.4 ? lh : isText ? r.height : 0

      const cell = isText
        ? Math.max(
            SKELETON_GLYPH.CELL_MIN,
            Math.min(SKELETON_GLYPH.CELL_MAX, (row || r.height) * 0.55)
          )
        : SKELETON_GLYPH.CELL_MEDIA

      // Per-rect palette: dark surfaces override --skel-* tokens locally, so
      // each placeholder contributes the shade it actually shows.
      const base =
        layer._parseCssColor(cs.getPropertyValue(SKELETON_CSS_PROPS.SKEL_BG_1)) || layer.base

      const ink =
        layer._parseCssColor(cs.getPropertyValue(SKELETON_CSS_PROPS.SKEL_INK)) || layer.ink

      return {
        x: r.left - hostRect.left,
        y: r.top - hostRect.top,
        w: r.width,
        h: r.height,
        radius: parseFloat(cs.borderTopLeftRadius) || 0,
        cell,
        row,
        base,
        ink,
      }
    })
    .filter((b): b is SkelRect => b.w > 0 && b.h > 0 && !!b.base && !!b.ink)

  if (!boxes.length) return

  const minX = Math.min(...boxes.map((b) => b.x))

  const minY = Math.min(...boxes.map((b) => b.y))

  const maxX = Math.max(...boxes.map((b) => b.x + b.w))

  const maxY = Math.max(...boxes.map((b) => b.y + b.h))

  layer.origin = { x: minX, y: minY }

  const w = Math.ceil(maxX - minX)

  const h = Math.ceil(maxY - minY)

  layer.canvas.style.transform = `translate(${minX}px, ${minY}px)`

  layer.canvas.style.width = `${w}px`

  layer.canvas.style.height = `${h}px`

  const bw = Math.round(w * dpr)

  const bh = Math.round(h * dpr)

  if (layer.canvas.width !== bw || layer.canvas.height !== bh) {
    layer.canvas.width = bw

    layer.canvas.height = bh
  }

  layer.dpr = dpr

  layer.rects = boxes

  layer._upload()
}
