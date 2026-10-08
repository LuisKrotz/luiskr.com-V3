/**
 * @file docs/folder-svg.ts
 * @description Deterministic animated folder glyphs for the docs grid.
 *
 * Each folder/file card gets an inline SVG generated FROM ITS NAME: a
 * hash of the label picks thread count, phase, curvature and drift so no
 * two folders look alike. The geometry is an abstract folder silhouette —
 * a tab + body outline — overlaid with slow-drifting "threads" (quadratic
 * Béziers animated via SMIL `stroke-dashoffset`), matching the site's
 * organic-line aesthetic. Colors are `currentColor`/CSS-var driven so the
 * artwork follows the active theme — no hardcoded palette.
 */

import { DOCS_CLASSES } from '@core/tokens/classes/docs.js'
import { DOCS_UNITS } from '@core/tokens/strings/docs.js'
import { h } from '@core/jsx.js'

/** SVG viewport box shared by every generated glyph (unit-agnostic). */
const VIEW_BOX = '0 0 96 72'

/**
 * Deterministic 32-bit-ish name hash — walks the string with a rolling
 * multiply-add; the modulus lives in DOCS_UNITS so the spread stays tuned.
 */
const hashName = (name: string): number => {
  let h = 0

  for (let i = 0; i < name.length; i++) {
    h = (h * 33 + name.charCodeAt(i)) % DOCS_UNITS.FOLDER_HASH_MOD
  }

  return h
}

/** Maps a hash slice to a bounded float in [min, max]. */
const ranged = (seed: number, shift: number, min: number, max: number): number => {
  const n = ((seed >> shift) % 1000) / 1000

  return min + n * (max - min)
}

/**
 * Builds one animated thread path — a shallow cubic arc across the folder
 * body whose phase/amplitude come from the name hash. Two SMIL animations
 * run on it: `d` morphs the control points between the resting shape and
 * a mirrored wave (the "lines wave" contract — valid because both paths
 * share the same command structure), and `stroke-dashoffset` keeps the
 * dash pattern drifting slowly for an organic "breathing" feel.
 */
const thread = (seed: number, idx: number): SVGElement => {
  const y = 34 + ranged(seed, idx * 3, -10, 14) + idx * 4

  const c1x = ranged(seed, idx * 5 + 1, 14, 40)
  const c1y = y - ranged(seed, idx * 7 + 2, 6, 20)
  const c2x = ranged(seed, idx * 9 + 3, 52, 82)
  const c2y = y + ranged(seed, idx * 11 + 4, 6, 20)

  const dash = Math.round(ranged(seed, idx * 13 + 5, 40, 110))

  const dur = ranged(seed, idx * 17 + 6, 6, 14).toFixed(1)

  const waveDur = ranged(seed, idx * 19 + 7, 4, 9).toFixed(1)

  // Resting arc vs mirrored-wave arc — control points swap their y
  // offsets so the stroke undulates like a sine, then eases back.
  const d1 = `M 6 ${y.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} 90 ${(y - 4).toFixed(1)}`

  const d2 = `M 6 ${(y + 2).toFixed(1)} C ${c1x.toFixed(1)} ${c2y.toFixed(1)} ${c2x.toFixed(1)} ${c1y.toFixed(1)} 90 ${(y - 2).toFixed(1)}`

  return (
    <path className={DOCS_CLASSES.DOCS_FOLDER_THREAD} d={d1} strokeDasharray={`${dash} ${dash}`}>
      <animate
        attributeName="d"
        values={`${d1};${d2};${d1}`}
        dur={`${waveDur}s`}
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to={String(dash * 2)}
        dur={`${dur}s`}
        repeatCount="indefinite"
      />
    </path>
  ) as SVGElement
}

/**
 * Deterministic animated folder SVG for a manifest node name.
 * @param name Folder/file display name — hashed for the artwork.
 * @param isDir Directory glyphs show threads; files show a folded corner.
 * @returns The SVG subtree (JSX-created, namespaced).
 */
export const folderSvg = (name: string, isDir = true): SVGElement => {
  const seed = hashName(name)

  const threads = []

  const count = 3 + (seed % 3)

  for (let i = 0; i < count; i++) threads.push(thread(seed, i))

  const tabW = 18 + (seed % 14)

  return (
    <svg
      className={DOCS_CLASSES.DOCS_FOLDER}
      viewBox={VIEW_BOX}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {isDir ? (
        <path
          className="docs-folder-body"
          d={`M 8 20 L ${8 + tabW} 20 L ${12 + tabW} 26 L 88 26 L 88 62 L 8 62 Z`}
        />
      ) : (
        <path
          className="docs-folder-body"
          d="M 18 8 L 62 8 L 78 24 L 78 64 L 18 64 Z M 62 8 L 62 24 L 78 24"
        />
      )}
      {threads}
    </svg>
  ) as SVGElement
}
