/**
 * @file intro-loader.ts
 * @description Boot loader overlay: types the spec-sheet lines
 * (loader.lines from translations) as decoding terminal text while the app
 * bootstraps, then fades out. Honors reduced motion (instant finish).
 */

import { LOADER_CLASSES } from '@core/tokens/classes/loader.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { FALLBACK_APP } from '@core/locale/fallback.js'
import store from '@core/store.js'

const SPEC_LOGS: string[] = FALLBACK_APP.loader.lines

/**
 * Command-Line & Spec-Driven Intro Loader
 *
 * Establishes the Software Engineer identity before transitioning into the UX/UI.
 * Displays a bold centered percentage load counter and rapid spec terminal sequence.
 */
export class IntroLoader {
  rootContainer: HTMLElement
  onComplete: (() => void) | null
  container: HTMLElement | null = null
  percentEl: HTMLElement | null = null
  terminalEl: HTMLElement | null = null
  progress = 0
  animId: number | null = null
  startTime: number

  constructor(rootContainer: HTMLElement = document.body, onComplete: (() => void) | null = null) {
    this.rootContainer = rootContainer

    this.onComplete = onComplete

    this.startTime = performance.now()

    this.init()
  }

  /** Builds the overlay DOM + starts the line sequence. */
  init(): void {
    if (typeof window === TYPE_STRINGS.UNDEFINED || typeof document === TYPE_STRINGS.UNDEFINED)
      return

    if (sessionStorage.getItem('lk_intro_shown')) {
      this.onComplete?.()

      return
    }

    if (store.getters.getReducedMotion()) {
      sessionStorage.setItem('lk_intro_shown', '1')

      this.onComplete?.()

      return
    }

    this.container = document.createElement(HTML_TAGS.DIV)

    this.container.className = LOADER_CLASSES.INTRO_LOADER

    this.percentEl = document.createElement(HTML_TAGS.DIV)

    this.percentEl.className = LOADER_CLASSES.INTRO_LOADER_PERCENT

    this.percentEl.textContent = `0${CHAR_STRINGS.PERCENT}`

    this.terminalEl = document.createElement(HTML_TAGS.DIV)

    this.terminalEl.className = LOADER_CLASSES.INTRO_LOADER_TERMINAL

    this.container.appendChild(this.percentEl)

    this.container.appendChild(this.terminalEl)

    this.rootContainer.appendChild(this.container)

    this.runAnimation()
  }

  /** Steps through the spec lines with the decode-in effect. */
  runAnimation(): void {
    const duration = 1000

    const update = (now: number) => {
      const elapsed = now - this.startTime

      const t = Math.min(elapsed / duration, 1.0)

      this.progress = Math.round(t * 100)

      if (this.percentEl) {
        this.percentEl.textContent = `${this.progress}${CHAR_STRINGS.PERCENT}`
      }

      const logIndex = Math.min(Math.floor(t * SPEC_LOGS.length), SPEC_LOGS.length - 1)

      if (this.terminalEl && this.terminalEl.children.length <= logIndex) {
        const line = document.createElement(HTML_TAGS.DIV)

        line.className = LOADER_CLASSES.INTRO_LOADER_LINE

        line.textContent = SPEC_LOGS[this.terminalEl.children.length]

        this.terminalEl.appendChild(line)
      }

      if (t < 1.0) {
        this.animId = requestAnimationFrame(update)
      } else {
        sessionStorage.setItem('lk_intro_shown', '1')

        setTimeout(() => {
          this.finish()
        }, 150)
      }
    }

    this.animId = requestAnimationFrame(update)
  }

  /** Completes the loader: fades the overlay and calls onComplete. */
  finish(): void {
    if (!this.container) return

    this.container.classList.add(LOADER_CLASSES.INTRO_LOADER_HIDDEN)

    setTimeout(() => {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container)

        this.container = null
      }

      this.onComplete?.()
    }, 450)
  }

  /** Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd. */
  destroy(): void {
    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)

      this.container = null
    }
  }
}
