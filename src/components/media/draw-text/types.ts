/**
 * @file draw-text/types.ts — token shapes for the char-staggered renderer.
 */

export interface DrawChar {
  ci: number
  value: string
}

/**
 * Draws token.
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
 * Draws timer.
 */
export type DrawTimer = ReturnType<typeof setTimeout> & { unref?: () => void }
