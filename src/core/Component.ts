/**
 * @file Component.ts
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

import { COMMON_ATTRS } from '@/core/tokens/attrs/common.js'
import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { COMMON_SELECTORS } from '@/core/tokens/selectors/common.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { BASE_HOST_STYLES } from '@/core/tokens/styles.js'
import { syncSkeletonLayer, destroySkeletonLayer } from '@/utils/canvas/loaders/skeleton-webgl.js'
import type { SkeletonWebGL } from '@/utils/canvas/loaders/skeleton-webgl.js'

// Module-level CSSStyleSheet cache — each unique style string is parsed once
// and the resulting sheet is shared across all component instances via adoptedStyleSheets.
const _sharedSheets = new Map<string, CSSStyleSheet>()

/**
 * Type contract for component state — a loose reactive state bag subclasses
 * narrow via their own declarations.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- state keys are declared per-component; unknown would force a cast at every read
export type ComponentState = Record<string, any>

type ScopedStore = { subscribe(_fn: () => void): () => void }

/**
 * Base class every view/component extends. Owns the four things the app
 * relies on being uniform:
 *  1. Shadow root + one stylesheet injection strategy (adoptedStyleSheets
 *     with a shared-sheet cache, `<style>` fallback on old engines);
 *  2. `setState → render → _updateDom` reactive cycle;
 *  3. automatic teardown — scoped listeners, store subs, and the WebGL
 *     skeleton layer are released in disconnectedCallback;
 *  4. lifecycle hooks subclasses implement: render(), onInit, onMounted,
 *     onUpdated, onStoreUpdate(store), onDestroy.
 */
export class BaseComponent extends HTMLElement {
  /** `?inline` SCSS text injected once per shadow root. */
  protected _componentStyles: string
  protected _eventDisposers: Array<() => void> = []
  protected _storeUnsubscribers: Array<() => void> = []
  _isMounted = false
  protected _styleNode: HTMLStyleElement | Element | null = null
  _contentNode: HTMLElement | Element | null = null
  /** Live WebGL skeleton layer, owned by syncSkeletonLayer()/destroySkeletonLayer(). */
  _skeletonLayer: SkeletonWebGL | null = null
  public state: ComponentState = {}

  /**
   * Lifecycle hooks — declared on the base so `?.()` calls are type-safe and
   * subclasses get a documented override point.
   */
  onInit?(): void
  onMounted?(): void
  onUpdated?(): void
  onStoreUpdate?(_store: ScopedStore): void
  onDestroy?(): void

  constructor(styles: string = CHAR_STRINGS.EMPTY) {
    super()

    this.attachShadow({ mode: COMMON_ATTRS.OPEN as ShadowRootMode })
    this._componentStyles = styles
  }

  /**
   * Set partial state and re-render content (NOT styles).
   */
  setState(updater: ComponentState | ((_state: ComponentState) => ComponentState)): void {
    const next =
      typeof updater === TYPE_STRINGS.FUNCTION
        ? (updater as (_s: ComponentState) => ComponentState)(this.state)
        : updater

    this.state = { ...this.state, ...next }
    this._updateDom()
  }

  /**
   * DOM insertion — runs onInit (data setup), the one-time style/content
   * build (_renderInitial), then onMounted + onUpdated so a first render is
   * indistinguishable from an update, and finally registers this element
   * with the WebGL skeleton scanner (no-op when no skeletons are present).
   */
  connectedCallback(): void {
    this.onInit?.()
    this._renderInitial()
    this._isMounted = true
    this.onMounted?.()
    this.onUpdated?.()
    syncSkeletonLayer(this)
  }

  /**
   * DOM removal — tears down in reverse order: scoped listeners, store
   * subscriptions, the WebGL skeleton layer for this element, then the
   * subclass's onDestroy (engine/audio/observer cleanup).
   */
  disconnectedCallback(): void {
    this._isMounted = false
    this._eventDisposers.forEach((dispose) => dispose())
    this._eventDisposers = []
    this._storeUnsubscribers.forEach((unsub) => unsub())
    this._storeUnsubscribers = []
    destroySkeletonLayer(this)
    this.onDestroy?.()
  }

  /** Safe scoped querySelector inside Shadow Root. */
  $<T extends Element = HTMLElement>(selector: string): T | null {
    return this.shadowRoot ? this.shadowRoot.querySelector<T>(selector) : null
  }

  /** Safe scoped querySelectorAll inside Shadow Root. */
  $$<T extends Element = HTMLElement>(selector: string): T[] {
    return this.shadowRoot ? Array.from(this.shadowRoot.querySelectorAll<T>(selector)) : []
  }

  /**
   * Scoped event listener with automatic lifecycle cleanup.
   * Prevents duplicate listeners: if the same handler reference is registered
   * for the same target+event, subsequent calls are no-ops.
   */
  addScopedListener(
    target: EventTarget | null,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions | boolean
  ): void {
    if (!target) return

    target.addEventListener(event, handler, options)
    this._eventDisposers.push(() => {
      target.removeEventListener(event, handler, options)
    })
  }

  /**
   * Subscribe to store changes with automatic lifecycle cleanup.
   */
  subscribe(store: ScopedStore | null | undefined): void {
    if (!store || typeof store.subscribe !== TYPE_STRINGS.FUNCTION) return

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
   */
  protected _renderInitial(): void {
    // On re-mount (after disconnect → connect), shadowRoot retains its previous children.
    // Reuse existing nodes to prevent style duplication and content wrapper duplication.
    const sr = this.shadowRoot

    if (!sr) return

    // ── Constructable StyleSheet (adoptedStyleSheets) ─────────────────────────
    // One CSSStyleSheet is parsed once per unique style string and shared across
    // all instances — far cheaper than injecting a <style> tag per element.
    // Fallback: <style> injection for browsers without constructable stylesheet support.
    if (
      typeof CSSStyleSheet !== TYPE_STRINGS.UNDEFINED &&
      'replaceSync' in CSSStyleSheet.prototype
    ) {
      const styleText = `${BASE_HOST_STYLES}\n${this._componentStyles}`

      if (!_sharedSheets.has(styleText)) {
        const sheet = new CSSStyleSheet()

        sheet.replaceSync(styleText)
        _sharedSheets.set(styleText, sheet)
      }

      sr.adoptedStyleSheets = [_sharedSheets.get(styleText) as CSSStyleSheet]
    } else {
      // Legacy fallback: reuse existing <style> node across re-mounts
      const existingStyle = sr.querySelector(COMMON_SELECTORS.STYLE)

      if (existingStyle) {
        this._styleNode = existingStyle
      } else {
        this._styleNode = document.createElement(HTML_TAGS.STYLE)
        this._styleNode.textContent = `${BASE_HOST_STYLES}\n${this._componentStyles}`
        sr.appendChild(this._styleNode)
      }
    }

    const existingContent = sr.querySelector(COMMON_SELECTORS.DATA_CONTENT)

    if (existingContent) {
      // Re-mount: content wrapper already exists — reuse and re-render it.
      this._contentNode = existingContent
    } else {
      // First mount: create and append the persistent content wrapper.
      this._contentNode = document.createElement(HTML_TAGS.DIV)
      this._contentNode.setAttribute(DATA_ATTRS.DATA_CONTENT, CHAR_STRINGS.EMPTY)
      sr.appendChild(this._contentNode)
    }

    // Render content on mount/re-mount (supports DOM nodes/JSX and HTML strings).
    this._applyRenderOutput(this.render())
  }

  /**
   * Update content without touching the style node.
   * Only the content wrapper is replaced — the <style> node
   * remains untouched, preventing style re-parsing and IntersectionObserver
   * destruction that occurred in the previous innerHTML = styleBlock + content approach.
   */
  _updateDom(): void {
    if (!this.shadowRoot) return

    if (!this._contentNode) {
      // Fallback: create content node if somehow missing
      this._contentNode = document.createElement(HTML_TAGS.DIV)
      this._contentNode.setAttribute(DATA_ATTRS.DATA_CONTENT, CHAR_STRINGS.EMPTY)
      this.shadowRoot.appendChild(this._contentNode)
    }

    this._applyRenderOutput(this.render())
    this.onUpdated?.()
    syncSkeletonLayer(this)
  }

  /**
   * Applies the render output (DOM Node, DocumentFragment, or HTML string) to the content wrapper.
   */
  protected _applyRenderOutput(
    output: Node | string | Array<Node | null | undefined> | null | undefined
  ): void {
    if (!this._contentNode) return

    if (output instanceof Node) {
      this._contentNode.replaceChildren(output)
    } else if (Array.isArray(output)) {
      this._contentNode.replaceChildren(...output.filter((n): n is Node => Boolean(n)))
    } else {
      this._contentNode.innerHTML = output || CHAR_STRINGS.EMPTY
    }
  }

  /**
   * Subclasses render() to return a JSX DOM Node or HTML string for the content area.
   */
  render(): Node | string | Array<Node | null | undefined> | null {
    return CHAR_STRINGS.EMPTY
  }
}
