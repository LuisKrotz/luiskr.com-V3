# `core/tokens/events/dom.ts`

Native DOM event-name tokens split by input modality —

| | |
|---|---|
| **Source** | `src/core/tokens/events/dom.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `MOUSE_EVENTS`

Frozen mouse event-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `TOUCH_EVENTS`

Frozen touch event-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `POINTER_EVENTS`

Frozen pointer event-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `KEYBOARD_EVENTS`

Frozen keyboard event-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `FOCUS_EVENTS`

Frozen focus event-name map — `focusin`/`focusout` bubble (needed for
delegation on shadow hosts) while `focus`/`blur` do not; both pairs are
kept so listeners pick the right variant for the propagation model.

### `FORM_EVENTS`

Frozen form event-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `DRAG_EVENTS`

Frozen drag event-name map — the HTML5 drag-and-drop subset used by CMS
upload zones (`drop` fires on the target, `dragover` must be
preventDefault'ed for drop to be allowed per the DnD spec).

### `WINDOW_EVENTS`

Frozen window event-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `MEDIA_EVENTS`

Frozen media event-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `ANIMATION_EVENTS`

Frozen animation event-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `GL_EVENTS`

Frozen gl event-name map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.

### `ORBIT_EVENTS`

Frozen orbit-control event-name map — three.js OrbitControls lifecycle
events (user gesture start/end, per-frame change).

### `CLIPBOARD_EVENTS`

Frozen clipboard event-name map — copy/cut/selection events the docs
portal intercepts for its source-code copy guard.
