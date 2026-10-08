import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
/* eslint-disable no-var, @typescript-eslint/no-this-alias -- ES5-era polyfill semantics (var-hoisted constructors, `this` walks) are deliberate. */
/**
 * @file legacy-polyfills/dom.js
 * @description Small DOM/runtime shims for pre-2019 engines, hand-rolled so
 * they stay ES5-safe even before core-js lands: queueMicrotask,
 * requestIdleCallback, structuredClone, AbortController stub,
 * Element.closest/matches, NodeList.forEach, CustomEvent constructor, and
 * the `inert` property. Loaded only when any guarded API is missing.
 */
// queueMicrotask — defer without inheriting setTimeout's minimum delay.
if (typeof queueMicrotask !== TYPE_STRINGS.FUNCTION) {
  window.queueMicrotask = function queueMicrotask(fn: VoidFunction) {
    Promise.resolve()
      .then(fn)
      .catch(function (e: unknown) {
        setTimeout(function () {
          throw e
        })
      })
  }
}

// requestIdleCallback — route warming and analytics scheduling degrade to a
// short timeout; semantics preserved (an "idle" slot, just not spec-timed).
if (typeof requestIdleCallback !== TYPE_STRINGS.FUNCTION) {
  window.requestIdleCallback = function requestIdleCallback(cb: IdleRequestCallback) {
    var start = Date.now()
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start))
        },
      })
    }, 1)
  }
  window.cancelIdleCallback = function cancelIdleCallback(id: number) {
    clearTimeout(id)
  }
}

// structuredClone — JSON round-trip covers the POJO/array payloads the app
// moves through it (wasm-pool catches non-serializable cases upstream).
if (typeof structuredClone !== TYPE_STRINGS.FUNCTION) {
  ;(window as unknown as Record<string, unknown>).structuredClone = function structuredClone(
    val: unknown
  ) {
    try {
      return JSON.parse(JSON.stringify(val))
    } catch (e) {
      void e
      return val
    }
  }
}

// AbortController — fetch cancellation; a no-op stub keeps the API shape.
if (typeof AbortController !== TYPE_STRINGS.FUNCTION) {
  ;(window as unknown as Record<string, unknown>).AbortController = function AbortController(this: {
    signal: { aborted: boolean; addEventListener: () => void; removeEventListener: () => void }
    abort: () => void
  }) {
    this.signal = {
      aborted: false,
      addEventListener: function () {},
      removeEventListener: function () {},
    }
    this.abort = function () {
      this.signal.aborted = true
    }
  }
}

// Element.matches/closest — IE/EdgeHTML used msMatchesSelector and lacked
// closest entirely; the JSX event-delegation paths depend on both.
if (typeof Element !== TYPE_STRINGS.UNDEFINED) {
  if (!Element.prototype.matches) {
    const proto = Element.prototype as unknown as Record<string, typeof Element.prototype.matches>
    Element.prototype.matches = proto.msMatchesSelector || proto.webkitMatchesSelector
  }
  if (!Element.prototype.closest) {
    Element.prototype.closest = function closest(this: Element, sel: string) {
      var el: Node | null = this
      while (el && el.nodeType === 1) {
        if ((el as Element).matches(sel)) return el as Element
        el = (el as Element).parentElement || el.parentNode
      }
      return null
    }
  }
}

// NodeList.forEach — querySelectorAll results are traversed everywhere.
if (typeof NodeList !== TYPE_STRINGS.UNDEFINED && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach as unknown as NodeList['forEach']
}

// CustomEvent constructor — IE/EdgeHTML only support createEvent.
if (typeof window.CustomEvent !== TYPE_STRINGS.FUNCTION) {
  var CustomEventPolyfill = function (event: string, params?: CustomEventInit) {
    params = params || { bubbles: false, cancelable: false, detail: null }
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles || false, params.cancelable || false, params.detail)
    return evt
  }
  CustomEventPolyfill.prototype = window.Event ? window.Event.prototype : {}
  ;(window as unknown as Record<string, unknown>).CustomEvent = CustomEventPolyfill
}

// inert — used by carousel ghost clones; attribute + tabindex sweep mirrors
// the semantics closely enough for legacy engines.
if (typeof HTMLElement !== TYPE_STRINGS.UNDEFINED && !('inert' in HTMLElement.prototype)) {
  var INERT_SELECTOR = 'a,button,input,select,textarea,area,[tabindex]:not([tabindex="-1"])'
  Object.defineProperty(HTMLElement.prototype, 'inert', {
    enumerable: true,
    configurable: true,
    get: function (this: HTMLElement) {
      return this.hasAttribute('inert')
    },
    set: function (this: HTMLElement, val: boolean) {
      var items, i
      if (val) {
        this.setAttribute('inert', '')
        this.setAttribute('aria-hidden', 'true')
        items = this.querySelectorAll(INERT_SELECTOR)
        for (i = 0; i < items.length; i++) {
          if (!items[i].hasAttribute('data-inert-tabindex')) {
            items[i].setAttribute('data-inert-tabindex', items[i].getAttribute('tabindex') || '')
          }
          items[i].setAttribute('tabindex', '-1')
        }
      } else {
        this.removeAttribute('inert')
        this.removeAttribute('aria-hidden')
        items = this.querySelectorAll('[data-inert-tabindex]')
        for (i = 0; i < items.length; i++) {
          var saved = items[i].getAttribute('data-inert-tabindex')
          if (saved === '') items[i].removeAttribute('tabindex')
          else items[i].setAttribute('tabindex', saved as string)
          items[i].removeAttribute('data-inert-tabindex')
        }
      }
    },
  })
}
