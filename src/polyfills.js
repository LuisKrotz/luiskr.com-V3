/**
 * @file polyfills.js
 * @description Critical polyfills for iOS Safari 14.x – 15.3 compatibility.
 *
 * iOS 14.x is missing: structuredClone, Array.prototype.at, Object.hasOwn
 * iOS 15.0–15.3 is missing: structuredClone, Array.prototype.at, Object.hasOwn
 * iOS 15.4+ has all of these natively.
 *
 * These must run BEFORE any app module evaluates — they're imported first in
 * main.js so ES module evaluation order guarantees they're in place.
 */

// ── structuredClone ────────────────────────────────────────────────────────
// Native in iOS 15.4+ / Safari 15.4+.
// Polyfill uses JSON round-trip (covers all POJO / array / primitive payloads
// used in this app; Blob/Map/Set are handled by the try-catch in wasm-pool.js).
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = function structuredClone(val) {
    try {
      return JSON.parse(JSON.stringify(val))
    } catch {
      return val
    }
  }
}

// ── Array.prototype.at ─────────────────────────────────────────────────────
// Native in iOS 15.4+ / Safari 15.4+.
if (!Array.prototype.at) {
  Object.defineProperty(Array.prototype, 'at', {
    value: function at(n) {
      n = Math.trunc(n) || 0
      if (n < 0) n += this.length
      if (n < 0 || n >= this.length) return undefined
      return this[n]
    },
    writable: true,
    configurable: true,
    enumerable: false,
  })
}

// ── String.prototype.at ────────────────────────────────────────────────────
// Same availability as Array.prototype.at.
if (!String.prototype.at) {
  Object.defineProperty(String.prototype, 'at', {
    value: function at(n) {
      n = Math.trunc(n) || 0
      if (n < 0) n += this.length
      if (n < 0 || n >= this.length) return undefined
      return this[n]
    },
    writable: true,
    configurable: true,
    enumerable: false,
  })
}

// ── Object.hasOwn ──────────────────────────────────────────────────────────
// Native in iOS 15.4+ / Safari 15.4+.
if (!Object.hasOwn) {
  Object.defineProperty(Object, 'hasOwn', {
    value: function hasOwn(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key)
    },
    writable: true,
    configurable: true,
    enumerable: false,
  })
}

// ── queueMicrotask ─────────────────────────────────────────────────────────
// Available in Safari 12.1+. Safety net for very old devices.
if (typeof globalThis.queueMicrotask !== 'function') {
  globalThis.queueMicrotask = function queueMicrotask(fn) {
    Promise.resolve().then(fn).catch((e) => setTimeout(() => { throw e }))
  }
}

// ── Lightweight inert polyfill ─────────────────────────────────────────────
// Native in iOS 15.4+ / Safari 15.4+.
// Without this, carousel ghost-clone slides are keyboard-focusable on older iOS,
// which causes touch-event leakage into hidden slides and can break swipe gestures.
if (typeof HTMLElement !== 'undefined' && !('inert' in HTMLElement.prototype)) {
  const INERT_SELECTOR = 'a,button,input,select,textarea,area,[tabindex]:not([tabindex="-1"])'

  Object.defineProperty(HTMLElement.prototype, 'inert', {
    enumerable: true,
    get() {
      return this.hasAttribute('inert')
    },
    set(val) {
      if (val) {
        this.setAttribute('inert', '')
        this.setAttribute('aria-hidden', 'true')

        this.querySelectorAll(INERT_SELECTOR).forEach((el) => {
          if (!el.hasAttribute('data-inert-tabindex')) {
            el.setAttribute('data-inert-tabindex', el.getAttribute('tabindex') || '')
          }

          el.setAttribute('tabindex', '-1')
        })
      } else {
        this.removeAttribute('inert')
        this.removeAttribute('aria-hidden')

        this.querySelectorAll('[data-inert-tabindex]').forEach((el) => {
          const saved = el.getAttribute('data-inert-tabindex')

          if (saved === '') {
            el.removeAttribute('tabindex')
          } else {
            el.setAttribute('tabindex', saved)
          }

          el.removeAttribute('data-inert-tabindex')
        })
      }
    },
  })
}
