# `website/components/feedback/CookieBanner.tsx`

&lt;cookie-banner&gt; — consent notice bar: accept/decline

| | |
|---|---|
| **Source** | `src/website/components/feedback/CookieBanner.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `CookieBanner`

The CookieBanner — banner class.

### `translations`

Setter/getter — APP translations for the banner copy.

### (module scope)

Lifecycle: re-measures after any render flips banner visibility.

### (module scope)

Lifecycle: releases the height observer when the element detaches.

### (module scope)

Publishes the banner's rendered height to --cookie-banner-h on the
document root so page content gets bottom clearance on every route —
the fixed banner would otherwise cover the footer until answered.
Removes the property entirely while hidden so pages reclaim the space.

### `_bindEvents`

Wires accept/decline button clicks.

### `handleAction`

Persists the consent answer and hides the banner.

### (module scope)

JSX template for the component's shadow DOM.
