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
  background: linear-gradient(
    90deg,
    var(--skel-bg-1) 25%,
    var(--skel-bg-2) 50%,
    var(--skel-bg-3) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 2.4s ease-in-out infinite;
  border-radius: var(--radius-2xs);
}
.skeleton--round {
  border-radius: var(--radius-full);
}
@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
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
