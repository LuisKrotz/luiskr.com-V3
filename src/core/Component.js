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

const BASE_HOST_STYLES =
  ':host { display: block; font-family: var(--font-primary); color: var(--text-primary); box-sizing: border-box; }\n' +
  ':host > [data-content] { display: contents; }\n' +
  '@keyframes skeleton-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }\n' +
  '.skeleton, .skeleton--shimmer, .skeleton-cover, .skeleton-placeholder, .skeleton--media, .skeleton-media, ' +
  '.skeleton--title, .skeleton-title-sm, .skeleton-title-md, .skeleton-title-lg, .skeleton--hero, ' +
  '.skeleton--text-line, .skeleton-para-full, .skeleton-para-94, .skeleton-para-98, .skeleton-para-65, ' +
  '.skeleton-section-title, .skeleton-badge, .skeleton-footer-link, .skeleton-footer-note-1, .skeleton-footer-note-2 ' +
  '{ position: relative; overflow: hidden; background: var(--skel-bg-1); }\n' +
  '.skeleton::before, .skeleton--shimmer::before, .skeleton-cover::before, .skeleton-placeholder::before, .skeleton--media::before, .skeleton-media::before, ' +
  '.skeleton--title::before, .skeleton-title-sm::before, .skeleton-title-md::before, .skeleton-title-lg::before, .skeleton--hero::before, ' +
  '.skeleton--text-line::before, .skeleton-para-full::before, .skeleton-para-94::before, .skeleton-para-98::before, .skeleton-para-65::before, ' +
  '.skeleton-section-title::before, .skeleton-badge::before, .skeleton-footer-link::before, .skeleton-footer-note-1::before, .skeleton-footer-note-2::before ' +
  '{ content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, var(--skel-bg-2) 50%, transparent 100%); transform: translateX(-100%); animation: skeleton-shimmer 2.4s ease-in-out infinite; will-change: transform; pointer-events: none; }\n' +
  '.skeleton--round { border-radius: 50%; }\n' +
  '.skeleton--block { display: block; }'

export class BaseComponent extends HTMLElement {

  constructor(styles = '') {
    super()
    this.attachShadow({ mode: 'open' })
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
    const next = typeof updater === 'function' ? updater(this.state) : updater
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
    if (!store || typeof store.subscribe !== 'function') return
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
    const existingStyle = this.shadowRoot.querySelector('style')
    if (existingStyle) {
      // Re-mount: style node already exists — reuse it.
      this._styleNode = existingStyle
    } else {
      // First mount: create and append the persistent <style> node.
      this._styleNode = document.createElement('style')
      this._styleNode.textContent = `${BASE_HOST_STYLES}\n${this._componentStyles}`
      this.shadowRoot.appendChild(this._styleNode)
    }

    const existingContent = this.shadowRoot.querySelector('[data-content]')
    if (existingContent) {
      // Re-mount: content wrapper already exists — reuse and re-render it.
      this._contentNode = existingContent
    } else {
      // First mount: create and append the persistent content wrapper.
      this._contentNode = document.createElement('div')
      this._contentNode.setAttribute('data-content', '')
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
      this._contentNode = document.createElement('div')
      this._contentNode.setAttribute('data-content', '')
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
      this._contentNode.innerHTML = output || ''
    }
  }

  /**
   * Subclasses override render() to return a JSX DOM Node or HTML string for the content area.
   * @returns {Node|string}
   */
  render() {
    return ''
  }
}
