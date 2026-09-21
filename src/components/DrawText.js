import drawTextStyles from '../sass/draw-text.scss?inline'
import { ATTRS, CLASSES, SELECTORS, TAGS, STRINGS } from '../core/constants.js'
import { onScrollStop } from '../utils/scroll-state.js'

const stripHtml = (s) => {
  if (!s || typeof s !== STRINGS.STRING) return ATTRS.EMPTY

  let prev

  let curr = s

  do {
    prev = curr

    curr = curr.replace(/<[^>]*>/g, ATTRS.EMPTY)
  } while (curr !== prev)

  return curr
}

export class DrawText extends HTMLElement {
  static get observedAttributes() {
    return [ATTRS.TEXT, ATTRS.DELAY, ATTRS.OFFSET, ATTRS.TRIGGER, ATTRS.VISIBLE]
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    this._isVisible = false

    this._hasAnimated = false

    this._observer = null

    this._animTimer = null

    this._isMounted = false

    this._styleEl = null

    this._contentEl = null
  }

  get text() {
    return this.getAttribute(ATTRS.TEXT) || ATTRS.EMPTY
  }

  set text(val) {
    this.setAttribute(ATTRS.TEXT, val || ATTRS.EMPTY)
  }

  get delay() {
    return parseInt(this.getAttribute(ATTRS.DELAY) || '100', 10)
  }

  set delay(val) {
    this.setAttribute(ATTRS.DELAY, String(val))
  }

  get offset() {
    return parseInt(this.getAttribute(ATTRS.OFFSET) || '0', 10)
  }

  set offset(val) {
    this.setAttribute(ATTRS.OFFSET, String(val))
  }

  get triggerMode() {
    return this.getAttribute(ATTRS.TRIGGER) || ATTRS.AUTO
  }

  set triggerMode(val) {
    this.setAttribute(ATTRS.TRIGGER, val)
  }

  get visible() {
    return this.hasAttribute(ATTRS.VISIBLE) && this.getAttribute(ATTRS.VISIBLE) !== ATTRS.FALSE
  }

  set visible(val) {
    if (val) this.setAttribute(ATTRS.VISIBLE, ATTRS.EMPTY)
    else this.removeAttribute(ATTRS.VISIBLE)
  }

  connectedCallback() {
    this._isMounted = true

    this._updateDom()

    this._setupTrigger()
  }

  disconnectedCallback() {
    this._isMounted = false

    if (this._observer) {
      this._observer.disconnect()

      this._observer = null
    }

    if (this._animTimer) {
      clearTimeout(this._animTimer)

      this._animTimer = null
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return

    if (name === ATTRS.VISIBLE && this.triggerMode === ATTRS.PROP) {
      if (this.visible && !this._isVisible) {
        this._startAnimation()
      }
    } else if (name === ATTRS.TEXT) {
      if (this._isMounted) {
        this._hasAnimated = false

        this._isVisible = false

        this._updateDom()

        this._setupTrigger()
      }
    }
  }

  _updateDom() {
    const visibleClass = this._isVisible && !this._hasAnimated ? CLASSES.DRAW_TEXT_VISIBLE : ATTRS.EMPTY

    const doneClass = this._hasAnimated ? CLASSES.DRAW_TEXT_DONE : ATTRS.EMPTY

    if (this.hasAttribute(ATTRS.ARIA_LABEL)) {
      this.removeAttribute(ATTRS.ARIA_LABEL)
    }

    if (!this._styleEl) {
      this._styleEl = document.createElement('style')

      this._styleEl.textContent = drawTextStyles

      this.shadowRoot.appendChild(this._styleEl)
    }

    if (!this._contentEl) {
      this._contentEl = document.createElement('span')

      this.shadowRoot.appendChild(this._contentEl)
    }

    this._contentEl.className = `${CLASSES.DRAW_TEXT} ${visibleClass} ${doneClass}`.trim()

    this._contentEl.innerHTML = this._renderContent()
  }

  /** Cached shadow-root query for the draw-text span — used across multiple methods */
  get _rootEl() {
    return this._contentEl || this.shadowRoot.querySelector(SELECTORS.DRAW_TEXT)
  }

  trigger() {
    this._startAnimation()
  }

  reset() {
    this._isVisible = false

    this._hasAnimated = false

    if (this._animTimer) {
      clearTimeout(this._animTimer)

      this._animTimer = null
    }

    const rootEl = this._rootEl

    if (rootEl) {
      rootEl.classList.remove(CLASSES.DRAW_TEXT_VISIBLE, CLASSES.DRAW_TEXT_DONE)
    }
  }

  _setupTrigger() {
    const trigger = this.triggerMode

    const text = this.text

    if (!text) return

    const isReduced = typeof document !== STRINGS.UNDEFINED && document.documentElement.classList.contains(CLASSES.REDUCED_MOTION)

    if (isReduced) {
      this._hasAnimated = true

      this._isVisible = true

      const rootEl = this._rootEl

      if (rootEl) {
        rootEl.classList.add(CLASSES.DRAW_TEXT_DONE)

        rootEl.classList.remove(CLASSES.DRAW_TEXT_VISIBLE)
      }

      return
    }

    if (trigger === ATTRS.TRIGGER_VIEWPORT) {
      if (this._observer) this._observer.disconnect()

      this._observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry || !entry.isIntersecting) return

          if (this._observer) {
            this._observer.disconnect()

            this._observer = null
          }

          onScrollStop(() => {
            requestAnimationFrame(() => {
              this._startAnimation()
            })
          })
        },
        { threshold: 0.05, rootMargin: ATTRS.ROOT_MARGIN_50 }
      )

      this._observer.observe(this)
    } else if (trigger === ATTRS.PROP) {
      if (this.visible) {
        this._startAnimation()
      }
    } else {
      this._startAnimation()
    }
  }

  _startAnimation() {
    if (this._isVisible) return

    this._isVisible = true

    const isReduced = typeof document !== STRINGS.UNDEFINED && document.documentElement.classList.contains(CLASSES.REDUCED_MOTION)

    if (isReduced) {
      this._hasAnimated = true

      const rootEl = this._rootEl

      if (rootEl) {
        rootEl.classList.add(CLASSES.DRAW_TEXT_DONE)
      }

      return
    }

    const rootEl = this._rootEl

    if (rootEl) {
      rootEl.classList.add(CLASSES.DRAW_TEXT_VISIBLE)
    }

    const text = this.text

    const delay = this.delay

    const offset = this.offset

    const chars = stripHtml(text).length

    const lastCharDelay = offset + Math.max(0, chars - 1) * delay

    const totalMs = Math.min(lastCharDelay + 800, 2000)

    if (this._animTimer) clearTimeout(this._animTimer)

    this._animTimer = setTimeout(() => {
      this._hasAnimated = true

      if (rootEl) {
        rootEl.classList.add(CLASSES.DRAW_TEXT_DONE)

        rootEl.classList.remove(CLASSES.DRAW_TEXT_VISIBLE)
      }
    }, totalMs)

    if (this._animTimer && typeof this._animTimer.unref === STRINGS.FUNCTION) {
      this._animTimer.unref()
    }
  }

  _parseTokens(text) {
    let ci = 0

    const parseText = (str) => {
      const chunks = []

      const parts = str.split(' ')

      parts.forEach((part, idx) => {
        if (part.length) {
          const chars = []

          for (const ch of part) {
            chars.push({ ci: ci++, value: ch })
          }

          chunks.push({ type: 'word', chars })
        }

        if (idx < parts.length - 1) {
          ci++

          chunks.push({ type: 'space' })
        }
      })

      return chunks
    }

    const result = []

    const regex = /(<br\s*\/?>)|(<(\w+)([^>]*)>(.*?)<\/\3>)|([^<]+)/gi

    let match

    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        result.push({ type: 'br' })
      } else if (match[2]) {
        const tag = match[3]

        const attrStr = match[4] || ATTRS.EMPTY

        const inner = match[5] || ATTRS.EMPTY

        result.push({ type: 'tag', tag, attrStr, inner, chunks: parseText(inner) })
      } else if (match[6]) {
        result.push(...parseText(match[6]))
      }
    }

    return result
  }

  _renderContent() {
    const text = this.text

    const delay = this.delay

    const offset = this.offset

    if (!text) return ATTRS.EMPTY

    const tokens = this._parseTokens(text)

    let wi = 0

    const renderWord = (chars) => {
      const wordIdx = wi++

      const charsHtml = chars
        .map(
          (ch) =>
            `<span class="${CLASSES.DRAW_TEXT_CHAR}" style="--i: ${ch.ci}; --char-delay: ${delay}ms; --offset: ${offset}ms;">${ch.value}</span>`
        )
        .join(ATTRS.EMPTY)

      const wordDelay = Math.min(delay * 4, 120)

      return `<span class="${CLASSES.DRAW_TEXT_WORD}" aria-hidden="true" style="--wi: ${wordIdx}; --word-delay: ${wordDelay}ms; --offset: ${offset}ms;">${charsHtml}</span>`
    }

    const htmlParts = tokens.map((token) => {
      if (token.type === 'br') return '<br aria-hidden="true" />'

      if (token.type === 'space') return `<span class="${CLASSES.DRAW_TEXT_SPACE}" aria-hidden="true">&nbsp;</span>`

      if (token.type === 'word') return renderWord(token.chars)

      if (token.type === 'tag') {
        const innerContent = token.chunks
          .map((chunk) => {
            if (chunk.type === 'word') return renderWord(chunk.chars)

            if (chunk.type === 'space') return `<span class="${CLASSES.DRAW_TEXT_SPACE}" aria-hidden="true">&nbsp;</span>`

            return ATTRS.EMPTY
          })
          .join(ATTRS.EMPTY)

        const labelAttr =
          token.tag.toLowerCase() === 'a' && !token.attrStr.includes('aria-label')
            ? ` aria-label="${stripHtml(token.inner || ATTRS.EMPTY)}"`
            : ATTRS.EMPTY

        return `<${token.tag} ${token.attrStr}${labelAttr}>${innerContent}</${token.tag}>`
      }

      return ATTRS.EMPTY
    })

    return htmlParts.join(ATTRS.EMPTY)
  }
}

if (!customElements.get(TAGS.DRAW_TEXT)) {
  customElements.define(TAGS.DRAW_TEXT, DrawText)
}
