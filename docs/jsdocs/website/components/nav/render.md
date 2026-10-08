# `website/components/nav/render.tsx`

JSX template for &lt;app-nav&gt;, extracted from AppNav.tsx —

| | |
|---|---|
| **Source** | `src/website/components/nav/render.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `renderAppNav`

Renders the <app-nav> template: logo, burger strip, and the fullscreen
menu overlay. Returns '' while the media-expand modal is open — an empty
render wipes the nav DOM so its z-index/focus can never compete with the
modal chrome. The CTA label chain (contact → scroll-up at page bottom →
related on project routes) mirrors the menu item order.
- `@param` nav AppNav instance — reads its getters/state, calls delegates.
- `@returns` JSX tree, or '' while a modal owns the screen.
