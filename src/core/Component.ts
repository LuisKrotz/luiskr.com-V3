/**
 * @file Component.ts
 * @description BaseComponent — Custom Element base class with Shadow DOM encapsulation,
 * scoped styles, reactive state management, lifecycle hooks, and automatic cleanup.
 *
 * Architecture notes:
 * - Styles are injected ONCE in _renderInitial() via a dedicated <style> node.
 *   _updateDom() NEVER touches the <style> node — it only updates the content slot.
 *   This prevents style re-parsing, IntersectionObserver destruction, video playback
 *   interruption, and GPU layer invalidation on every state update. Re-parsing a
 *   stylesheet also tears down composited layers, which was the source of visible
 *   flicker on skeleton/canvas surfaces before the split existed.
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

/**
 * Module-level CSSStyleSheet cache keyed by the full style text. Each unique
 * style string is parsed once via `CSSStyleSheet.replaceSync` and the resulting
 * sheet is shared across every component instance through
 * `ShadowRoot.adoptedStyleSheets` — parsing CSS is the expensive part, so one
 * sheet per component class (not per element) is the intended ratio. The Map
 * also makes re-mounts free: the same key hits the same cached sheet.
 */
const _sharedSheets = new Map<string, CSSStyleSheet>()

/**
 * Type contract for component state — a loose reactive state bag subclasses
 * narrow via their own declarations.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- state keys are declared per-component; unknown would force a cast at every read
export type ComponentState = Record<string, any>

/**
 * Minimal structural type for the store contract used here: anything exposing
 * `subscribe(fn) → unsubscribe`. The real store satisfies it, and tests can
 * pass a stub without importing the full singleton graph.
 */
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

  /**
   * Disposers for listeners added via addScopedListener(). Drained in
   * disconnectedCallback so elements never leak listeners across mounts —
   * critical for elements that move in the DOM (carousel reorder, route swap).
   */
  protected _eventDisposers: Array<() => void> = []

  /**
   * Unsubscribe callbacks from store.subscribe(). Drained on disconnect so a
   * detached element stops receiving store pushes and can be GC'd.
   */
  protected _storeUnsubscribers: Array<() => void> = []

  /**
   * Whether the element is currently connected. Read by the store-subscription
   * wrapper to skip onStoreUpdate on detached elements (a store push arriving
   * between disconnect and GC must not re-render into a dead shadow root).
   */
  _isMounted = false

  /** The `<style>` fallback node, only populated on engines without constructable stylesheets. */
  protected _styleNode: HTMLStyleElement | Element | null = null

  /**
   * Persistent content wrapper inside the shadow root. _updateDom swaps only
   * this node's children — the style mechanism stays untouched (see file
   * header for why that split exists).
   */
  _contentNode: HTMLElement | Element | null = null

  /** Live WebGL skeleton layer, owned by syncSkeletonLayer()/destroySkeletonLayer(). */
  _skeletonLayer: SkeletonWebGL | null = null

  /** Reactive state bag — written only through setState() so updates always re-render. */
  public state: ComponentState = {}

  /**
   * Lifecycle hooks — declared on the base so `?.()` calls are type-safe and
   * subclasses get a documented override point. Order on first connect:
   * onInit → _renderInitial → onMounted → onUpdated.
   */
  onInit?(): void
  onMounted?(): void
  onUpdated?(): void
  onStoreUpdate?(_store: ScopedStore): void
  onDestroy?(): void

  /**
   * Attach an open shadow root and stash the component's `?inline` CSS text.
   * `mode: 'open'` keeps `element.shadowRoot` readable — the codebase and the
   * happy-dom tests both rely on that handle for assertions and scoped
   * queries; 'closed' would break both without buying real encapsulation.
   * @param styles Component-local CSS text (Vite `?inline` import).
   */
  constructor(styles: string = CHAR_STRINGS.EMPTY) {
    super()

    this.attachShadow({ mode: COMMON_ATTRS.OPEN as ShadowRootMode })
    this._componentStyles = styles
  }

  /**
   * Set partial state and re-render content (NOT styles). Accepts either a
   * patch object or a React-style updater function — the function form is
   * required when the next state derives from the previous state, since
   * reads of `this.state` outside the updater can race with queued renders.
   * The merge is a shallow spread: keys not present in `next` survive, which
   * lets components update one field without re-sending the whole bag.
   * @param updater Partial state patch, or (prevState) => patch.
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
   * Per the Custom Elements spec this callback can fire multiple times —
   * every branch below is written to be idempotent on re-mount.
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
   * subclass's onDestroy (engine/audio/observer cleanup). `_isMounted` flips
   * first so an in-flight store push during teardown hits the guard in
   * subscribe() rather than rendering into a disconnecting root.
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

  /**
   * Safe scoped querySelector inside Shadow Root. Returns null instead of
   * throwing when the shadow root is absent (detached construction in tests).
   * @param selector CSS selector evaluated against this.shadowRoot.
   * @returns First matching element or null.
   */
  $<T extends Element = HTMLElement>(selector: string): T | null {
    return this.shadowRoot ? this.shadowRoot.querySelector<T>(selector) : null
  }

  /**
   * Safe scoped querySelectorAll inside Shadow Root — materialized into a
   * real Array so callers get .map/.filter/forEach (NodeList lacks some
   * iteration methods on older engines).
   * @param selector CSS selector evaluated against this.shadowRoot.
   * @returns Array of matching elements (never null).
   */
  $$<T extends Element = HTMLElement>(selector: string): T[] {
    return this.shadowRoot ? Array.from(this.shadowRoot.querySelectorAll<T>(selector)) : []
  }

  /**
   * Scoped event listener with automatic lifecycle cleanup.
   * Prevents duplicate listeners: the DOM itself dedupes identical
   * (type, listener, capture) tuples per MDN addEventListener semantics, and
   * every registration is mirrored into _eventDisposers so disconnect removes
   * it even when the listener captured instance state.
   * @param target EventTarget to listen on (null → no-op).
   * @param event Event type token.
   * @param handler Listener callback or listener object.
   * @param options Passive/capture/once options forwarded verbatim.
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
   * Subscribe to store changes with automatic lifecycle cleanup. The wrapper
   * gates on _isMounted: a store push landing while the element is detached
   * (mid-move or already removed) is dropped instead of rendering into a
   * dead shadow root — the next connectedCallback renders fresh state anyway.
   * @param store Store-like object exposing subscribe(); null/invalid → no-op.
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
   * Called exactly once from connectedCallback() — but on re-mount the shadow
   * root retains children from the previous mount, so both style and content
   * paths reuse existing nodes instead of duplicating them.
   */
  protected _renderInitial(): void {
    // On re-mount (after disconnect → connect), shadowRoot retains its previous children.
    // Reuse existing nodes to prevent style duplication and content wrapper duplication.
    const sr = this.shadowRoot

    if (!sr) return

    // ── Constructable StyleSheet (adoptedStyleSheets) ─────────────────────────
    // One CSSStyleSheet is parsed once per unique style string and shared across
    // all instances — far cheaper than injecting a <style> tag per element.
    // 'replaceSync' is the feature probe: it is the synchronous parse entry
    // point, and its presence implies adoptedStyleSheets support (shipped
    // together in Chromium 73/Safari 16.4/Firefox 101).
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

      // Assigning the array replaces (not appends) — safe on re-mount because
      // the same cache key resolves to the identical shared sheet.
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
      // First mount: create and append the persistent content wrapper. The
      // data-content attribute is the selector hook reused on re-mount.
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
   * destruction that occurred in the previous innerHTML = styleBlock + content
   * approach (a single string assignment re-parsed all CSS and rebuilt every
   * tracked element on every state change).
   */
  _updateDom(): void {
    if (!this.shadowRoot) return

    if (!this._contentNode) {
      // Defensive fallback — normally unreachable since _renderInitial always
      // creates the node, but a subclass calling setState() before connect
      // would otherwise throw on the null dereference below.
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
   * Three accepted shapes, resolved in priority order:
   *  - Node → `replaceChildren(node)` — the JSX fast path, keeps DOM identity.
   *  - Array → `replaceChildren(...filtered)` — fragment-style multi-root
   *    render; nullish entries are filtered so conditional JSX slots can just
   *    return null.
   *  - string/nullish → `innerHTML` — legacy string templates; '' clears.
   * @param output Render result from render().
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
   * The base implementation returns an empty string so instantiating the base
   * class directly (tests, scaffolding) produces an empty-but-valid shadow root.
   * @returns DOM output for _applyRenderOutput.
   */
  render(): Node | string | Array<Node | null | undefined> | null {
    return CHAR_STRINGS.EMPTY
  }
}
