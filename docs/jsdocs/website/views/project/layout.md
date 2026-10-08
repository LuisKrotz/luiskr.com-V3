# `website/views/project/layout.ts`

Layout helpers for ViewProject — per-section height from the first media ratio, text stagger delays, and the landscape-group detector that forces carousel mode.

| | |
|---|---|
| **Source** | `src/website/views/project/layout.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `sectionItemHeight`

Per-section CSS height: the FIRST media item's intrinsic ratio applied
to the viewport width — min(100vw·h/w, SKELETON_ITEM_HEIGHT). Emitting
the height before decode means the section never reflows when media
arrives. Sections without a sized media array fall back to the fixed
skeleton height. `toFixed(4)` keeps the calc string compact while
preserving sub-pixel accuracy.
- `@param` c The ViewProject instance (unused — part of the method facade).
- `@param` section One section's children; the media array is detected by shape.
- `@returns` A CSS `min()` height expression.

### `textDelay`

Per-char draw delay for a section's text run: counts REAL characters
(HTML stripped — tags don't consume stagger time), then sizes the
interval so the whole run lands inside DRAW_TARGET_MS. Non-array input
gets the fallback delay so malformed CMS data still animates.
- `@param` c The ViewProject instance (unused — facade signature).
- `@param` items Section text items (expected string[]).
- `@returns` Per-char delay in ms.

### `textOffset`

Start offset for the text run at index `idx`: cumulative real chars of
the preceding items × the per-char delay, plus the per-index step — so
sequential sections cascade rather than all starting at t=0.
- `@param` c The ViewProject instance — supplies textDelay via the facade.
- `@param` items Section text items (expected string[]).
- `@param` idx Index of this item in the section.
- `@returns` Start offset in ms (0 for non-array input).

### `isLandscapeGroup`

Whether a media group is all-landscape — those can't pair side-by-side
in the two-up layout, so they force the carousel into scroll mode.
- `@param` c The ViewProject instance (unused — facade signature).
- `@param` group A media item array (shape-checked, not trusted).
- `@returns` true when every item is landscape and the group is non-empty.
