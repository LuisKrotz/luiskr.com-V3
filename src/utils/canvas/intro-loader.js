import { CLASSES, STRINGS, TAGS } from '../../core/constants.js'
import store from '../../core/store.js'

const SPEC_LOGS = [
  '[SYS_BOOT] INITIALIZING ARCHITECTURE v3.8',
  '[GPU_CORE] ALLOCATING SHADER PIPELINES',
  '[WASM_ENG] THREAD POOL READY: 4 WORKERS',
  '[VRAM_MGR] POOL & PURGE PROTOCOL ENGAGED',
  '[RUNTIME] SYSTEM VERIFIED: LAUNCHING INTERFACE',
]

/**
 * Command-Line & Spec-Driven Intro Loader
 *
 * Establishes the Software Engineer identity before transitioning into the UX/UI.
 * Displays a bold centered percentage load counter and rapid spec terminal sequence.
 */
export class IntroLoader {
  constructor(rootContainer = document.body, onComplete = null) {
    this.rootContainer = rootContainer

    this.onComplete = onComplete

    this.container = null

    this.percentEl = null

    this.terminalEl = null

    this.progress = 0

    this.animId = null

    this.startTime = performance.now()

    this.init()
  }

  init() {
    if (typeof window === STRINGS.UNDEFINED || typeof document === STRINGS.UNDEFINED) return

    if (sessionStorage.getItem('lk_intro_shown')) {
      this.onComplete?.()

      return
    }

    if (store.getters.getReducedMotion()) {
      sessionStorage.setItem('lk_intro_shown', '1')

      this.onComplete?.()

      return
    }

    this.container = document.createElement(TAGS.DIV)

    this.container.className = CLASSES.INTRO_LOADER

    this.percentEl = document.createElement(TAGS.DIV)

    this.percentEl.className = CLASSES.INTRO_LOADER_PERCENT

    this.percentEl.textContent = '0%'

    this.terminalEl = document.createElement(TAGS.DIV)

    this.terminalEl.className = CLASSES.INTRO_LOADER_TERMINAL

    this.container.appendChild(this.percentEl)

    this.container.appendChild(this.terminalEl)

    this.rootContainer.appendChild(this.container)

    this.runAnimation()
  }

  runAnimation() {
    const duration = 1000

    const update = (now) => {
      const elapsed = now - this.startTime

      const t = Math.min(elapsed / duration, 1.0)

      this.progress = Math.round(t * 100)

      if (this.percentEl) {
        this.percentEl.textContent = `${this.progress}%`
      }

      const logIndex = Math.min(Math.floor(t * SPEC_LOGS.length), SPEC_LOGS.length - 1)

      if (this.terminalEl && this.terminalEl.children.length <= logIndex) {
        const line = document.createElement(TAGS.DIV)

        line.className = CLASSES.INTRO_LOADER_LINE

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

  finish() {
    if (!this.container) return

    this.container.classList.add(CLASSES.INTRO_LOADER_HIDDEN)

    setTimeout(() => {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container)

        this.container = null
      }

      this.onComplete?.()
    }, 450)
  }

  destroy() {
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
