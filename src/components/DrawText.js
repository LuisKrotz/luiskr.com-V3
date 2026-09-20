import drawTextStyles from '../sass/draw-text.scss?inline'
import { ATTRS } from '../core/constants.js'

function stripHtml(s) {
  if (!s || typeof s !== 'string') return ''
  let prev
  let curr = s
  do {
    prev = curr
    curr = curr.replace(/<[^>]*>/g, '')
  } while (curr !== prev)
  return curr
}

export class DrawText extends HTMLElement {
  static get observedAttributes() {
    return ['text', 'delay', 'offset', 'trigger', 'visible']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._isVisible = false
    this._hasAnimated = false
    this._observer = null
    this._animTimer = null
    this._isMounted = false
  }

  get text() {
    return this.getAttribute('text') || ''
  }

  set text(val) {
    this.setAttribute('text', val || '')
  }

  get delay() {
    return parseInt(this.getAttribute('delay') || '100', 10)
  }

  set delay(val) {
    this.setAttribute('delay', String(val))
  }

  get offset() {
    return parseInt(this.getAttribute('offset') || '0', 10)
  }

  set offset(val) {
    this.setAttribute('offset', String(val))
  }

  get triggerMode() {
    return this.getAttribute('trigger') || 'auto'
  }

  set triggerMode(val) {
    this.setAttribute('trigger', val)
  }

  get visible() {
    return this.hasAttribute('visible') && this.getAttribute('visible') !== 'false'
  }

  set visible(val) {
    if (val) this.setAttribute('visible', '')
    else this.removeAttribute('visible')
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

    if (name === 'visible' && this.triggerMode === 'prop') {
      if (this.visible && !this._isVisible) {
        this._startAnimation()
      }
    } else if (name === 'text') {
      if (this._isMounted) {
        this._hasAnimated = false
        this._isVisible = false
        this._updateDom()
        this._setupTrigger()
      }
    }
  }

  _updateDom() {
    const visibleClass = this._isVisible && !this._hasAnimated ? 'draw-text--visible' : ''
    const doneClass = this._hasAnimated ? 'draw-text--done' : ''

    // draw-text.scss provides ALL styles (including :host rules).
    // No inline style strings here — styles are in SCSS files only.
    this.shadowRoot.innerHTML = `
      <style>${drawTextStyles}</style>
      <span class="draw-text ${visibleClass} ${doneClass}">
        ${this._renderContent()}
      </span>
    `
  }

  /** Cached shadow-root query for the draw-text span — used across multiple methods */
  get _rootEl() {
    return this.shadowRoot.querySelector('.draw-text')
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
      rootEl.classList.remove('draw-text--visible', 'draw-text--done')
    }
  }

  _setupTrigger() {
    const trigger = this.triggerMode
    const text = this.text
    if (!text) return

    const isReduced = typeof document !== 'undefined' && document.documentElement.classList.contains('reduced-motion')
    if (isReduced) {
      this._hasAnimated = true
      this._isVisible = true
      const rootEl = this._rootEl
      if (rootEl) {
        rootEl.classList.add('draw-text--done')
        rootEl.classList.remove('draw-text--visible')
      }
      return
    }

    if (trigger === ATTRS.TRIGGER_VIEWPORT) {
      if (typeof window !== 'undefined') {
        const rect = this.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          this._startAnimation()
          return
        }
      }
      if (this._observer) this._observer.disconnect()
      this._observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry || !entry.isIntersecting) return
          if (this._observer) {
            this._observer.disconnect()
            this._observer = null
          }
          requestAnimationFrame(() => {
            this._startAnimation()
          })
        },
        { threshold: 0.05, rootMargin: '50px 0px' }
      )
      this._observer.observe(this)
    } else if (trigger === 'prop') {
      if (this.visible) {
        this._startAnimation()
      }
    } else {
      // 'auto'
      this._startAnimation()
    }
  }

  _startAnimation() {
    if (this._isVisible) return
    this._isVisible = true

    const isReduced = typeof document !== 'undefined' && document.documentElement.classList.contains('reduced-motion')
    if (isReduced) {
      this._hasAnimated = true
      const rootEl = this._rootEl
      if (rootEl) {
        rootEl.classList.add('draw-text--done')
      }
      return
    }

    const rootEl = this._rootEl
    if (rootEl) {
      rootEl.classList.add('draw-text--visible')
    }

    const text = this.text
    const delay = this.delay
    const offset = this.offset
    const chars = stripHtml(text).length
    // Time until the very last character's CSS animation (0.8s duration) completes
    const lastCharDelay = offset + Math.max(0, chars - 1) * delay
    const totalMs = Math.min(lastCharDelay + 800, 2000)

    if (this._animTimer) clearTimeout(this._animTimer)
    this._animTimer = setTimeout(() => {
      this._hasAnimated = true
      if (rootEl) {
        rootEl.classList.add('draw-text--done')
        rootEl.classList.remove('draw-text--visible')
      }
    }, totalMs)
    if (this._animTimer && typeof this._animTimer.unref === 'function') {
      this._animTimer.unref()
    }
  }


  _parseTokens(text) {
    let ci = 0

    const parseText = (str) => {
      const chunks = []
      // Split preserving spaces and punctuation
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
        const attrStr = match[4] || ''
        const inner = match[5] || ''
        result.push({ type: 'tag', tag, attrStr, chunks: parseText(inner) })
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

    if (!text) return ''

    const tokens = this._parseTokens(text)

    // wi = word index, used by mobile CSS for word-level stagger animation
    // (reduces ~200 char animations to ~10-20 word animations on small screens)
    let wi = 0

    const renderWord = (chars) => {
      const wordIdx = wi++

      const charsHtml = chars
        .map(
          (ch) =>
            `<span class="draw-text__char" style="--i: ${ch.ci}; --char-delay: ${delay}ms; --offset: ${offset}ms;">${ch.value}</span>`
        )
        .join('')

      // --word-delay: per-word stagger on mobile, capped at 120ms (never a marathon)
      const wordDelay = Math.min(delay * 4, 120)

      return `<span class="draw-text__word" aria-hidden="true" style="--wi: ${wordIdx}; --word-delay: ${wordDelay}ms; --offset: ${offset}ms;">${charsHtml}</span>`
    }

    const htmlParts = tokens.map((token) => {
      if (token.type === 'br') return '<br aria-hidden="true" />'
      if (token.type === 'space') return '<span class="draw-text__space" aria-hidden="true">&nbsp;</span>'
      if (token.type === 'word') return renderWord(token.chars)
      if (token.type === 'tag') {
        const innerContent = token.chunks
          .map((chunk) => {
            if (chunk.type === 'word') return renderWord(chunk.chars)
            if (chunk.type === 'space') return '<span class="draw-text__space" aria-hidden="true">&nbsp;</span>'
            return ''
          })
          .join('')
        return `<${token.tag} ${token.attrStr}>${innerContent}</${token.tag}>`
      }
      return ''
    })

    return htmlParts.join('')
  }
}

if (!customElements.get('draw-text')) {
  customElements.define('draw-text', DrawText)
}
