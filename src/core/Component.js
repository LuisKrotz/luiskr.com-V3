/**
 * @file Component.js
 * @description BaseComponent — Custom Element base class with Shadow DOM encapsulation,
 * scoped styles, reactive state management, lifecycle hooks, and automatic cleanup.
 *
 * Architecture notes:
 * - Styles are injected ONCE in _renderInitial() via a dedicated <style> node.
 *   _updateDom() NEVER touches the <style> node — it only updates the content slot.
 *   This prevents style re-parsing, IntersectionObserver destruction, video playback
 *   interruption, and GPU layer invalidation on every state update.
 * - Event listeners registered via addScopedListener() are automatically removed
 *   when the element disconnects.
 * - Store subscriptions registered via subscribe() are automatically unsubscribed
 *   when the element disconnects.
 */

import { STRINGS, ATTRS, TAGS, SELECTORS, BASE_HOST_STYLES } from './constants.js'

export class BaseComponent extends HTMLElement {

  constructor(styles = STRINGS.EMPTY) {
    super()

    this.attachShadow({ mode: ATTRS.OPEN })
    this._componentStyles = styles
    this._eventDisposers = []
    this._storeUnsubscribers = []
    this._isMounted = false
    this._styleNode = null
    this._contentNode = null
    this.state = {}
  }

  /**
   * Set partial state and re-render content (NOT styles).
   * @param {Object|function} updater - Partial state object or updater function
   */
  setState(updater) {
    const next = typeof updater === STRINGS.FUNCTION ? updater(this.state) : updater
    this.state = { ...this.state, ...next }
    this._updateDom()
  }

  connectedCallback() {
    this.onInit?.()
    this._renderInitial()
    this._isMounted = true
    this.onMounted?.()
    this.onUpdated?.()
  }

  disconnectedCallback() {
    this._isMounted = false
    this._eventDisposers.forEach((dispose) => dispose())
    this._eventDisposers = []
    this._storeUnsubscribers.forEach((unsub) => unsub())
    this._storeUnsubscribers = []
    this.onDestroy?.()
  }

  /**
   * Safe scoped querySelector inside Shadow Root
   * @param {string} selector
   * @returns {Element|null}
   */
  $(selector) {
    return this.shadowRoot ? this.shadowRoot.querySelector(selector) : null
  }

  /**
   * Safe scoped querySelectorAll inside Shadow Root
   * @param {string} selector
   * @returns {Element[]}
   */
  $$(selector) {
    return this.shadowRoot ? Array.from(this.shadowRoot.querySelectorAll(selector)) : []
  }

  /**
   * Scoped event listener with automatic lifecycle cleanup.
   * Prevents duplicate listeners: if the same handler reference is registered
   * for the same target+event, subsequent calls are no-ops.
   * @param {EventTarget} target
   * @param {string} event
   * @param {Function} handler
   * @param {AddEventListenerOptions} [options]
   */
  addScopedListener(target, event, handler, options) {
    if (!target) return
    target.addEventListener(event, handler, options)
    this._eventDisposers.push(() => {
      target.removeEventListener(event, handler, options)
    })
  }

  /**
   * Subscribe to store changes with automatic lifecycle cleanup.
   * @param {Object} store - Store object with a .subscribe(fn) method
   */
  subscribe(store) {
    if (!store || typeof store.subscribe !== STRINGS.FUNCTION) return
    const unsub = store.subscribe(() => {
      if (this._isMounted) {
        this.onStoreUpdate?.(store)
      }
    })
    this._storeUnsubscribers.push(unsub)
  }

  /**
   * Initial render: injects styles ONCE and creates the content node.
   * Called exactly once from connectedCallback().
   * @private
   */
  _renderInitial() {
    // On re-mount (after disconnect → connect), shadowRoot retains its previous children.
    // Reuse existing nodes to prevent style duplication and content wrapper duplication.
    const existingStyle = this.shadowRoot.querySelector(SELECTORS.STYLE)
    if (existingStyle) {
      // Re-mount: style node already exists — reuse it.
      this._styleNode = existingStyle
    } else {
      // First mount: create and append the persistent <style> node.
      this._styleNode = document.createElement(TAGS.STYLE)
      this._styleNode.textContent = `${BASE_HOST_STYLES}\n${this._componentStyles}`
      this.shadowRoot.appendChild(this._styleNode)
    }

    const existingContent = this.shadowRoot.querySelector(SELECTORS.DATA_CONTENT)
    if (existingContent) {
      // Re-mount: content wrapper already exists — reuse and re-render it.
      this._contentNode = existingContent
    } else {
      // First mount: create and append the persistent content wrapper.
      this._contentNode = document.createElement(TAGS.DIV)
      this._contentNode.setAttribute(ATTRS.DATA_CONTENT, STRINGS.EMPTY)
      this.shadowRoot.appendChild(this._contentNode)
    }

    // Render content on mount/re-mount (supports DOM nodes/JSX and HTML strings).
    this._applyRenderOutput(this.render())
  }

  /**
   * Update content without touching the style node.
   * Only the content wrapper is replaced — the <style> node
   * remains untouched, preventing style re-parsing and IntersectionObserver
   * destruction that occurred in the previous innerHTML = styleBlock + content approach.
   * @private
   */
  _updateDom() {
    if (!this.shadowRoot) return

    if (!this._contentNode) {
      // Fallback: create content node if somehow missing
      this._contentNode = document.createElement(TAGS.DIV)
      this._contentNode.setAttribute(ATTRS.DATA_CONTENT, STRINGS.EMPTY)
      this.shadowRoot.appendChild(this._contentNode)
    }

    this._applyRenderOutput(this.render())
    this.onUpdated?.()
  }

  /**
   * Applies the render output (DOM Node, DocumentFragment, or HTML string) to the content wrapper.
   * @private
   * @param {Node|string|Array} output
   */
  _applyRenderOutput(output) {
    if (!this._contentNode) return
    if (output instanceof Node) {
      this._contentNode.replaceChildren(output)
    } else if (Array.isArray(output)) {
      this._contentNode.replaceChildren(...output.filter(Boolean))
    } else {
      this._contentNode.innerHTML = output || STRINGS.EMPTY
    }
  }

  /**
   * Subclasses override render() to return a JSX DOM Node or HTML string for the content area.
   * @returns {Node|string}
   */
  render() {
    return STRINGS.EMPTY
  }
}
