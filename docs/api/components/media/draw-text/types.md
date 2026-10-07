# `components/media/draw-text/types.ts`

| | |
|---|---|
| **Source** | `src/components/media/draw-text/types.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### (module scope)

One glyph of a staggered draw — `ci` is the global character index used to
compute the per-char animation delay, `value` the printable character.

### (module scope)

A node of the draw-text token tree — `type` discriminates text vs markup
chunks; `chars` holds the staggered glyphs, `tag`/`attrStr`/`inner` carry parsed
markup, `chunks` nests child tokens so recursion walks one uniform shape.

### (module scope)

A setTimeout handle that may be Node's Timeout — `unref` exists only in
Node, so the intersection type keeps `.unref?.()` callable in workers/tests.
