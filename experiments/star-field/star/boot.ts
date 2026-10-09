/**
 * @file star/boot.ts
 * @description Engine bootstrap for StarField — constructs StarFieldEngine
 * on the persistent canvas with progress/ready/select/approach/hover
 * callbacks, mirrors progress into the loader overlay, and dismisses the
 * overlay on first usable frame (or on a failed boot, when the CSS
 * fallback surface takes over). Mirrors space/boot.ts's contract.
 */
import { SF_CLASSES } from '@core/tokens/classes/starfield.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { ANIMATION_DURATIONS } from '@core/tokens/motion/animation.js'
import store from '@core/store.js'
import { StarFieldEngine } from '../starfield-engine.js'
import { prefetchDossier } from './dossier.js'
import type { StarField } from '../StarField.js'
import { devError } from '@core/devlog.js'

/**
 * Mirrors an engine progress event into the loader overlay — message,
 * rounded percent text, and the bar fill width. Nodes are optional-chained
 * so a partial render can't throw mid-boot.
 * @param c The StarField element.
 * @param msg Stage message.
 * @param pct Progress 0–100.
 */
export function updateStarLoader(c: StarField, msg: string, pct: number): void {
  const loaderMsg = c.$(`.${SF_CLASSES.SF_LOADER_MSG}`)
  const loaderVal = c.$(`.${SF_CLASSES.SF_LOADER_VAL}`)
  const loaderBar = c.$(`.${SF_CLASSES.SF_LOADER_BAR_FILL}`)

  if (loaderMsg) loaderMsg.textContent = msg
  if (loaderVal) loaderVal.textContent = String(Math.round(pct))
  if (loaderBar) loaderBar.style.width = `${pct}%`
}

/**
 * Constructs the StarFieldEngine and wires its lifecycle: progress →
 * loader overlay; select → dossier load + live announce; approach →
 * dossier prefetch; hover → live announce; ready → reduced-motion flag +
 * loader dismiss. A failed init still resolves the loader so the page
 * isn't stuck behind a broken overlay.
 * @param c The StarField element.
 */
export function initStarFieldEngine(c: StarField): void {
  const canvas = c._getCanvasEl()

  if (!canvas || c._engine || c._isInitializing) return

  c._isInitializing = true

  c._engine = new StarFieldEngine(canvas, {
    onProgress: (msg: string, pct: number) => c._updateLoader(msg, pct),
    onSelect: (id: string) => c._selectBody(id),
    onApproach: (id: string) => prefetchDossier(id),
    onHover: (id: string | null) => c._handleHover(id),
    onReady: () => {
      c._isInitializing = false

      c._sfReady = true

      c._sfFailed = c._engine?.failed === true

      if (c._sfFailed) c._canvasEl?.classList.add(STATE_CLASSES.IS_FALLBACK)

      c._engine?.setReducedMotion(store.getters.getReducedMotion())

      if (c._sfFailed) c._updateDom()

      c._dismissLoader()
    },
  })

  c._engine.init().catch((err) => {
    devError('[StarField] Engine init error:', err)
    c._isInitializing = false
    c._sfReady = true
    c._sfFailed = true

    c._canvasEl?.classList.add(STATE_CLASSES.IS_FALLBACK)

    c._updateDom()

    c._dismissLoader()
  })
}

/**
 * Fades the loader overlay to transparent then removes it after the CSS
 * transition completes — removing earlier would clip the fade, removing
 * never would leave an invisible overlay intercepting pointer events.
 * @param c The StarField element.
 */
export function dismissStarLoader(c: StarField): void {
  const loader = c.$<HTMLElement>(`.${SF_CLASSES.SF_LOADER}`)

  if (loader) {
    loader.style.opacity = CHAR_STRINGS.ZERO

    setTimeout(() => loader.remove(), ANIMATION_DURATIONS.LOADER_FADE_MS)
  }
}
