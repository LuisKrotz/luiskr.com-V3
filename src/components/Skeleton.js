import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import { CLASSES } from '../core/constants.js'
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
    return ['width', 'height', 'rounded', 'block']
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
    const width = this.getAttribute('width') || '100%'
    const height = this.getAttribute('height') || '1em'
    const rounded = this.hasAttribute('rounded')
    const block = this.hasAttribute('block')
    const radius = rounded ? 'var(--radius-full)' : 'var(--radius-2xs)'

    const wasmStyle = calcWasmSkeletonStyle(width, height, radius)

    return (
      <div
        className={`${CLASSES.SKELETON} ${rounded ? CLASSES.SKELETON_ROUND : ''} ${block ? CLASSES.SKELETON_BLOCK : ''}`}
        style={wasmStyle}
        aria-hidden="true"
      />
    )
  }
}

if (!customElements.get('ui-skeleton')) {
  customElements.define('ui-skeleton', UiSkeleton)
}
