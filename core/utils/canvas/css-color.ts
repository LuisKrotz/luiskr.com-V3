/**
 * @file css-color.ts
 * @description Shared CSS-color parser for the canvas widgets — converts
 * `#rgb`/`#rrggbb`, `rgb()/rgba()`, and resolved `color(srgb r g b)`
 * (what getComputedStyle returns for color-mix()) into 0–1 RGB triples
 * for shader uniforms. Returns null for anything unparseable.
 */

import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

const RGB_RE = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i

const SRGB_RE = /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/i

/** Parses a CSS color string into a [r, g, b] 0–1 triple, or null. */
export const parseCssColor = (str: unknown): number[] | null => {
  if (typeof str !== TYPE_STRINGS.STRING) return null

  const value = (str as string).trim()

  const hex = value.match(HEX_RE)

  if (hex) {
    let h = hex[1]

    if (h.length === 3)
      h = h
        .split(CHAR_STRINGS.EMPTY)
        .map((c: string) => c + c)
        .join(CHAR_STRINGS.EMPTY)

    const int = parseInt(h, 16)

    return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255]
  }

  const rgb = value.match(RGB_RE)

  if (rgb) return rgb.slice(1, 4).map((n: string) => Math.min(Number(n), 255) / 255)

  const srgb = value.match(SRGB_RE)

  return srgb ? srgb.slice(1, 4).map(Number) : null
}
