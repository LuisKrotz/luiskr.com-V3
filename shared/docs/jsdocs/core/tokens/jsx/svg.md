# `core/tokens/jsx/svg.ts`

SVG vocabulary tokens — the XML namespace plus the tag set

| | |
|---|---|
| **Source** | `src/core/tokens/jsx/svg.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `SVG_TAGS`

Tag names that require `createElementNS(SVG_NS, tag)` — the `h()` JSX
factory consults this set; any tag not listed goes through the HTML
path. Covers the full SVG2 tag vocabulary so consumers never maintain
their own lists.
