/**
 * @file space/boot.ts
 * @description Earth engine bootstrap for SpacePlayground — creates the
 * EarthBackground on the persistent canvas with ready/progress callbacks,
 * mirrors progress into the loader overlay, dismisses it on first usable
 * frame, and applies persisted localStorage settings to engine + panel.
 */

import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'
import { SP_CLASSES } from '@/core/tokens/classes/playground.js'
import { CAROUSEL_CSS_PROPS } from '@/core/tokens/css/carousel.js'
import { ANIMATION_DURATIONS } from '@/core/tokens/motion/animation.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import store from '@/core/store.js'
import { EarthBackground } from '../earth-background.js'
import { PARAM_HANDLERS, SP_INPUT_TYPES } from './controls.js'
import type { SpacePlayground } from '../SpacePlayground.js'
import { devError } from '@/core/devlog.js'

/**
 * Mirrors an engine progress event into the loader overlay — message,
 * rounded percent text, and the bar's width style. All three nodes are
 * optional-chained so a partial loader render can't throw mid-boot.
 * @param c The SpacePlayground element.
 * @param msg Stage message from the engine ('loading textures', …).
 * @param pct Progress 0–100.
 */
export function updateSpaceLoader(c: SpacePlayground, msg: string, pct: number): void {
  const loaderMsg = c.$(`.${SP_CLASSES.SP_LOADER_MSG}`)
  const loaderVal = c.$(`.${SP_CLASSES.SP_LOADER_VAL}`)
  const loaderBar = c.$(`.${SP_CLASSES.SP_LOADER_BAR_FILL}`)

  if (loaderMsg) loaderMsg.textContent = msg
  if (loaderVal) loaderVal.textContent = String(Math.round(pct))
  if (loaderBar) loaderBar.style.width = `${pct}%`
}

/**
 * Constructs the EarthBackground engine on the persistent canvas and
 * wires its lifecycle: progress → loader overlay, ready → apply persisted
 * settings + reduced-motion flag + dismiss. The `_isInitializingEarth`
 * latch prevents double-init while init() is still awaiting. A failed
 * init still marks `_earthReady` and dismisses the loader so the page
 * isn't stuck behind a broken overlay.
 * @param c The SpacePlayground element.
 */
export function initSpaceEarth(c: SpacePlayground): void {
  const canvas = c._getCanvasEl()

  if (!canvas || c._earthBg || c._isInitializingEarth) return

  c._isInitializingEarth = true

  c._earthBg = new EarthBackground(canvas, {
    onProgress: (msg: string, pct: number) => c._updateLoader(msg, pct),
    onReady: () => {
      c._isInitializingEarth = false

      c._earthReady = true

      c._earthBg?.setReducedMotion(store.getters.getReducedMotion())

      // Apply persisted settings
      c._applyPersistedSettings()

      c._syncPanel()

      c._dismissLoader()
    },
  })

  c._earthBg.init().catch((err) => {
    devError('[SpacePlayground] Earth init error:', err)
    c._isInitializingEarth = false
    c._earthReady = true

    c._dismissLoader()
  })
}

/**
 * Fades the loader overlay to transparent, then removes it after the CSS
 * transition completes — removing earlier would clip the fade, removing
 * never would leave an invisible overlay intercepting pointer events.
 * @param c The SpacePlayground element.
 */
export function dismissSpaceLoader(c: SpacePlayground): void {
  const loader = c.$<HTMLElement>(`.${SP_CLASSES.SP_LOADER}`)

  if (loader) {
    loader.style.opacity = CHAR_STRINGS.ZERO

    setTimeout(() => loader.remove(), ANIMATION_DURATIONS.LOADER_FADE_MS)
  }
}

/**
 * Replays the persisted settings object onto the live engine and panel:
 * each saved param runs through PARAM_HANDLERS (the same dispatch live
 * edits use), then the matching DOM input's value/checked + slider
 * track-fill + row label are synced so the panel reflects restored state.
 * @param c The SpacePlayground element.
 */
export function applyPersistedSettings(c: SpacePlayground): void {
  const saved = c._savedSettings
  const bg = c._earthBg

  if (!saved || !bg) return

  Object.entries(saved).forEach(([param, val]) => {
    const handler = PARAM_HANDLERS[param]

    if (handler) handler(bg, val)

    // Sync input value in the DOM
    const input = c.shadowRoot?.querySelector<HTMLInputElement>(
      `[${DATA_ATTRS.DATA_PARAM}="${param}"]`
    )

    if (input) {
      if (input.type === SP_INPUT_TYPES.CHECKBOX) {
        input.checked = Boolean(val)
      } else {
        input.value = String(val)

        const min = Number(input.min)

        const max = Number(input.max)

        // Track-fill %: normalize value into 0–100 across the slider's
        // range so the CSS can paint the filled portion of the thumb path.
        const pct = Math.max(0, Math.min(100, ((Number(val) - min) / (max - min)) * 100))

        input.style.setProperty(CAROUSEL_CSS_PROPS.RANGE_PCT, `${pct}%`)

        const row = input.closest(`.${SP_CLASSES.SP_ROW}`)

        const valEl = row?.querySelector(`.${SP_CLASSES.SP_VAL}`)

        if (valEl) valEl.textContent = String(val)
      }
    }
  })
}
