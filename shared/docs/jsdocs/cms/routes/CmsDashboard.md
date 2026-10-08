# `cms/routes/CmsDashboard.tsx`

&lt;view-cms-dashboard&gt; — the authenticated CMS shell: header

| | |
|---|---|
| **Source** | `src/cms/routes/CmsDashboard.tsx` |
| **UX surface** | Login screen and the dashboard shell. |

## Members

### `ViewCmsDashboard`

The ViewCmsDashboard — cms dashboard class.

### (module scope)

Lifecycle: verifies auth session and binds tab/navigation events.

### (module scope)

Lifecycle: unbinds listeners.

### `handleLogout`

Signs the user out (drops back to <admin-login> via auth listener).

### `showNotification`

Transient toast — writes the message, then auto-dismisses after
3.5s (long enough to read a "saved!" confirmation, short enough to
not linger over the next edit). A second notification resets the
timer instead of stacking toasts.

### (module scope)

Wires tab clicks, logout and cms-notification events.

### `renderTabComponent`

Tab → editor element mapping. The media-converter tab is localhost-
gated (IS_LOCALHOST): the conversion pipeline shells out to local
ffmpeg, so it only exists where the dev server runs.

### (module scope)

JSX template: sidebar + tab outlet.
