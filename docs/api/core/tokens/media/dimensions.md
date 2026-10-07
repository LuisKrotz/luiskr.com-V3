# `core/tokens/media/dimensions.ts`

Canonical pixel dimensions + media timing tokens split per

| | |
|---|---|
| **Source** | `src/core/tokens/media/dimensions.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `GENERIC_DIMENSIONS`

Frozen generic dimension map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `AWARD_ICON_SIZE`

Fallback intrinsic px for award-icon images when the CMS row omits width/height — declares a stable box so lazy loads don't shift layout.

### `ITEM_FALLBACK_HEIGHT`

Fallback intrinsic height for media items missing `size` — portrait-leaning so the aspect projection stays conservative

### `IMAGE_DIMENSIONS`

Image decode budgets shared by progressive media pipelines.

### `MAX_DECODE_PIXELS`

4096² pixels: preserves the former memory ceiling without rejecting tall, narrow screenshots.

### `VIDEO_DIMENSIONS`

Frozen video dimension map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `FLAG_DIMENSIONS`

Frozen flag-icon geometry map — flag images are drawn at small pixel
sizes where every px counts: NAV (18×13) for the locale picker, DIALOG
(60×44) for the language dialog, SPLIT widths for the half-flag
divider, and `FLAG_DEFAULT_ASPECT` 1.5 (3:2, the most common national
flag ratio) as the fallback when a flag lacks intrinsic dims.

### `NAV_DIMENSIONS`

Frozen nav dimension map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.

### `MOSAIC_DIMENSIONS`

Frozen mosaic dimension map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `GRAVATAR_SIZES`

Frozen gravatar map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `SCROLL_TIMINGS`

Frozen scroll-timing map (ms) — `SCROLL_DURATION_FULL` paces animated
page scrolls, `SCROLL_DURATION_REDUCED` is the slower ramp under
prefers-reduced-motion (longer, gentler rather than instant so the jump
stays perceivable), `SCROLL_INIT_DELAY` defers scroll restoration until
after first paint settles.

### `DRAW_TIMINGS`

Frozen draw-text timing map (ms + observer fraction) — caps and defaults
for the per-character staggered reveal: `EXTRA_MS`/`MAX_MS` bound total
animation length regardless of string size, `WORD_MAX_DELAY`/
`DEFAULT_DELAY` shape the per-word stagger, `OBSERVER_THRESHOLD` (0.05)
is the IntersectionObserver visibility fraction that triggers a draw,
and the `MENU_LABEL_*` triple paces nav-item labels so each item's
underline lands right after its last character.
