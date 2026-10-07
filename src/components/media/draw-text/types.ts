/**
 * @file draw-text/types.ts — token shapes for the char-staggered renderer.
 */
/* istanbul ignore file */

/**
 * One glyph of a staggered draw — `ci` is the global character index used to
 * compute the per-char animation delay, `value` the printable character.
 */
export interface DrawChar {
  ci: number
  value: string
}

/**
 * A node of the draw-text token tree — `type` discriminates text vs markup
 * chunks; `chars` holds the staggered glyphs, `tag`/`attrStr`/`inner` carry parsed
 * markup, `chunks` nests child tokens so recursion walks one uniform shape.
 */
export interface DrawToken {
  type: string
  chars?: DrawChar[]
  tag?: string
  attrStr?: string
  inner?: string
  chunks?: DrawToken[]
}

/**
 * A setTimeout handle that may be Node's Timeout — `unref` exists only in
 * Node, so the intersection type keeps `.unref?.()` callable in workers/tests.
 */
export type DrawTimer = ReturnType<typeof setTimeout> & { unref?: () => void }
