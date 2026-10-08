# `website/components/feedback/SiteToast.tsx`

&lt;site-toast&gt; — the in-page notification surface. notify()

| | |
|---|---|
| **Source** | `src/website/components/feedback/SiteToast.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `SiteToast`

The SiteToast — toast class.

### `push`

Queues a toast item and starts its auto-dismiss clock.
- `@param` item.text - body copy (already localized by the caller)
- `@param` item.type - NOTIFY_TYPES entry; styles the BEM modifier
- `@param` item.title - optional eyebrow heading
- `@param` item.duration - ms until auto-dismiss; ≤0 pins it
- `@returns` the item id (null when text was empty)

### (module scope)

Removes an item by id and cancels its pending auto-dismiss.
- `@param` {number} id

### (module scope)

Lifecycle: releases every pending dismiss timer.

### (module scope)

JSX template for the component's shadow DOM.
