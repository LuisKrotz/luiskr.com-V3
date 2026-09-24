import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import { CLASSES, ATTRS, STRINGS, TAGS } from '../core/constants.js'
import { calcWasmSkeletonStyle } from '../utils/wasm-css.js'

const skeletonStyles = `
:host {
  display: inline-block;
  vertical-align: middle;
}
:host([block]) {
  display: block;
}
.skeleton {
  position: relative;
  overflow: hidden;
  background: var(--skel-bg-1);
  border-radius: var(--radius-2xs);
}
.skeleton::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--skel-bg-2) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: skeleton-shimmer 2.4s ease-in-out infinite;
  will-change: transform;
  pointer-events: none;
}
.skeleton--round {
  border-radius: var(--radius-full);
}
@keyframes skeleton-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`

export class UiSkeleton extends BaseComponent {
  static get observedAttributes() {
    return [ATTRS.WIDTH, ATTRS.HEIGHT, ATTRS.ROUNDED, ATTRS.BLOCK]
  }

  constructor() {
    super(skeletonStyles)
  }

  attributeChangedCallback() {
    if (this._isMounted) {
      this._updateDom()
    }
  }

  render() {
    const width = this.getAttribute(ATTRS.WIDTH) || STRINGS.PERCENT_100

    const height = this.getAttribute(ATTRS.HEIGHT) || STRINGS.ONE_EM

    const rounded = this.hasAttribute(ATTRS.ROUNDED)

    const block = this.hasAttribute(ATTRS.BLOCK)

    const radius = rounded ? STRINGS.VAR_RADIUS_FULL : STRINGS.VAR_RADIUS_2XS

    const wasmStyle = calcWasmSkeletonStyle(width, height, radius)

    return (
      <div
        className={`${CLASSES.SKELETON} ${rounded ? CLASSES.SKELETON_ROUND : STRINGS.EMPTY} ${block ? CLASSES.SKELETON_BLOCK : STRINGS.EMPTY}`}
        style={wasmStyle}
        aria-hidden={ATTRS.TRUE}
      />
    )
  }
}

if (!customElements.get(TAGS.UI_SKELETON)) {
  customElements.define(TAGS.UI_SKELETON, UiSkeleton)
}

