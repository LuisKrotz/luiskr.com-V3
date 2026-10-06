/**
 * @file safari-patch.js
 * @description Runtime Safari/iOS workaround layer, loaded via
 * safari-loader.js only when the Safari probe in main.js matches.
 *
 * Sections:
 *   1. Marks <html> with .is-safari so stylesheets can gate WebKit-only fixes.
 *   2-3. Neuters the GPU/WASM acceleration paths — Safari's compositor and
 *        worker+WebAssembly combos cause memory bloat and texture artifacts.
 *   4. Strips will-change/transform/backface-visibility from existing media
 *        (fixes the iOS compositing flicker on figures).
 *   5. Per-component patches applied via customElements.whenDefined:
 *        - CustomCarousel: injects safari-carousel styles into the shadow root.
 *        - MediaFigure: safari-media styles, lazy thumbnails, force-muted
 *          autoplay videos with touch-unlock, and a tap-vs-scroll expand
 *          gesture that bypasses iOS's unreliable click synthesis.
 *        - ViewProject: manual modal positioning — iOS doesn't layer
 *          <dialog> correctly, so the expand dialog is moved to document.body
 *          and styled fixed/100dvh by hand.
 *        - MediaExpanded: explicit touchend close (click is unreliable) and
 *          muted playsinline autoplay for expanded videos.
 */

import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { patchCarousel } from './patches/carousel.js'
import { patchMediaExpanded } from './patches/media-expanded.js'
import { patchMediaFigure } from './patches/media-figure.js'
import { patchViewProject } from './patches/view-project.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { gpuAccel } from '@/utils/gpu/gpu-accel.js'
import { wasmPool } from '@/utils/wasm/wasm-pool.js'
import { localMediaCache } from '@/utils/media/local-media-cache.js'
import { wasmMediaThreads } from '@/utils/wasm/wasm-media-threads.js'

// ── 1. Mark HTML element with Safari class ────────────────────────────────────
if (typeof document !== TYPE_STRINGS.UNDEFINED && document.documentElement) {
  document.documentElement.classList.add(STATE_CLASSES.IS_SAFARI)
}

// ── 2. Disable GPU compositor layer bloat & WebGL textures on Safari/iOS ───────
Object.assign(gpuAccel, {
  accelerateElementGPU: () => {},
  processTextureGPU: () => {},
  processImageGPU: () => {},
  processBitmapGPU: () => {},
  processVideoGPU: () => {},
})

// ── 3. Bypass WASM worker pool & memory-heavy caches on Safari/iOS ─────────────
Object.assign(wasmPool, { dispatch: () => Promise.resolve(null) })

Object.assign(localMediaCache, {
  fetchOrGetLocalMedia: (url: string) => Promise.resolve(url),
  getLocalMedia: () => Promise.resolve(null),
  storeLocalMedia: (url: string) => Promise.resolve(url),
})

Object.assign(wasmMediaThreads, { decodeMediaInSeparateThread: () => Promise.resolve(null) })

// ── 4. Retroactive cleanup of any existing DOM elements ───────────────────────
if (typeof document !== TYPE_STRINGS.UNDEFINED) {
  const existingFigures = document.querySelectorAll(COMPONENT_TAGS.MEDIA_FIGURE)

  existingFigures.forEach((mf) => {
    const el = mf as HTMLElement

    el.style.willChange = ATTR_VALUES.EMPTY

    el.style.transform = ATTR_VALUES.EMPTY

    el.style.backfaceVisibility = ATTR_VALUES.EMPTY
  })
}

// ── 5. Component Patches ──────────────────────────────────────────────────────
if (typeof customElements !== TYPE_STRINGS.UNDEFINED) {
  patchCarousel()

  patchMediaFigure()

  patchViewProject()

  patchMediaExpanded()
}
