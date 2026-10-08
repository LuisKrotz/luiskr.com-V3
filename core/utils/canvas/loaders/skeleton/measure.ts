/**
 * @file skeleton-measure.ts
 * @description DOM measurement for SkeletonWebGL, extracted from
 * skeleton-webgl.ts — queries the content wrapper's skeleton
 * placeholders, converts their client rects into layer-relative boxes,
 * samples per-rect palette tokens, and resizes/repositions the overlay
 * canvas to the union box before uploading to the shader buffers.
 */

import { SKELETON_CSS_PROPS } from '@core/tokens/css/skeleton.js'
import { SKELETON_SELECTORS } from '@core/tokens/selectors/skeleton.js'
import type { SkeletonWebGL, SkelRect } from '../skeleton-webgl.js'
import { SKELETON_GLYPH, SKELETON_RENDER } from '@core/tokens/motion/skeleton.js'

/** Re-measures the skeleton DOM rects into the layer's draw list. */
export function measureSkeleton(layer: SkeletonWebGL): void {
  if (!layer.useWebGL || !layer.host) return

  if (layer.resolveStart) return

  const nodes = Array.from(layer.content.querySelectorAll(SKELETON_SELECTORS.SKELETON_ANY))

  if (!nodes.length || !layer.canvas) return

  if (layer.canvas.parentNode !== layer.root) layer.root.appendChild(layer.canvas)

  // Content re-renders swap every placeholder node: keep the observer bound
  // to the live set so post-data layout shifts (fonts, decoded media) still
  // re-measure, and so nodes that start zero-sized get tracked once they grow.
  if (layer._ro) {
    const current = new Set(nodes)

    layer._observed.forEach((el) => {
      if (!current.has(el)) {
        layer._ro?.unobserve(el)

        layer._observed.delete(el)
      }
    })

    nodes.forEach((el) => {
      if (!layer._observed.has(el)) {
        layer._ro?.observe(el)

        layer._observed.add(el)
      }
    })
  }

  const hostRect = layer.host.getBoundingClientRect()

  // Rects are positioned against the host's padding box (the canvas's
  // containing block) and clipped to it — a placeholder that overflows its
  // host must not let the overlay canvas paint into sibling components.
  const padX = layer.host.clientLeft

  const padY = layer.host.clientTop

  // display:contents hosts report 0 client box — fall back to the border box
  // so the clip never degenerates to nothing.
  const boundW = layer.host.clientWidth || Math.ceil(hostRect.width)

  const boundH = layer.host.clientHeight || Math.ceil(hostRect.height)

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

      // getComputedStyle forces a style resolution per node per measure —
      // cache it per element (placeholder styles only change on a theme
      // flip, which sampleTheme() detects and clears this cache on).
      let style = layer._styleCache.get(el)

      if (!style) {
        const cs = getComputedStyle(el)

        style = {
          lineHeight: parseFloat(cs.lineHeight),
          radius: parseFloat(cs.borderTopLeftRadius) || 0,
          textLike: el.matches(SKELETON_SELECTORS.SKELETON_TEXT_LIKE),
          baseStr: cs.getPropertyValue(SKELETON_CSS_PROPS.SKEL_BG_1),
          inkStr: cs.getPropertyValue(SKELETON_CSS_PROPS.SKEL_INK),
        }

        layer._styleCache.set(el, style)
      }

      const lh = style.lineHeight

      const isText = style.textLike || (r.height < SKELETON_GLYPH.TEXT_MAX_HEIGHT && r.height > 0)

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
      const base = layer._parseCssColor(style.baseStr) || layer.base

      const ink = layer._parseCssColor(style.inkStr) || layer.ink

      const x = Math.max(r.left - hostRect.left - padX, 0)

      const y = Math.max(r.top - hostRect.top - padY, 0)

      const w = Math.min(r.left - hostRect.left - padX + r.width, boundW) - x

      const h = Math.min(r.top - hostRect.top - padY + r.height, boundH) - y

      return {
        x,
        y,
        w,
        h,
        radius: style.radius,
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
