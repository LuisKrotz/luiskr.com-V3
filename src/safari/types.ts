/**
 * @file safari/types.ts
 * @description Shared structural types for the Safari runtime patches —
 * the element surface the patched prototypes rely on plus the prototype
 * shape used when re-binding methods via customElements.get().
 */

/** Structural surface the Safari patches rely on (BaseComponent subclasses). */
export interface SafariPatchableEl extends HTMLElement {
  classes?: string[]
  autoPlay?: boolean
  isVideo?: boolean
  isLoaded?: boolean
  mediaHeight?: number
  mediaWidth?: number
  mediaSrc?: string
  highResSrc?: string
  isIntersecting?: boolean
  canExpand?: boolean
  video?: string[]
  observer?: IntersectionObserver | null
  imgObserver?: IntersectionObserver | null
  source?: string
  shadowRoot: ShadowRoot | null
  $(_selector: string): HTMLElement | null
  $$(_selector: string): HTMLElement[]
  addScopedListener(
    _target: EventTarget | null,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions | boolean
  ): void
  openModal?(): void
  loadHighRes?(): void
  startClose?(): void
  _isMounted?: boolean
  _updateDom(): void
}

/**
 * The PatchableProto value.
 */
export interface PatchableProto {
  _renderInitial?: () => void
  _measureFit?: () => void
  onMounted?: () => void
  onDestroy?: () => void
  loadHighRes?: () => void
  _updateModalDOM?: () => void
}

/**
 * The PatchableCtor value.
 */
export type PatchableCtor = CustomElementConstructor & { prototype: PatchableProto }
