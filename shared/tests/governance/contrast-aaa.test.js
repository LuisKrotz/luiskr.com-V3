/**
 * @file contrast-aaa.test.js
 * @description WCAG Level AAA is a contrast LEVEL, not an axe tag — this
 * test compiles the real token sheet (base/_structure.scss) and computes
 * the WCAG 2.x relative-luminance ratio for every text-ink/surface pair
 * the site relies on, in BOTH themes. Floors: 7:1 for body/small text
 * (SC 1.4.6), 4.5:1 for large text, 3:1 for UI components and focus
 * indicators (SC 1.4.11 / 2.4.13). A token change that drops a pair below
 * its floor fails the suite — no browser needed.
 */

import path from 'path'
import { fileURLToPath } from 'url'
import * as sass from 'sass'
import { THEME_CSS_PROPS } from '@core/tokens/css/theme.js'
import { MENU_CSS_PROPS } from '@core/tokens/css/menu.js'

const C = { ...THEME_CSS_PROPS, ...MENU_CSS_PROPS }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SASS_BASE = path.join(__dirname, '..', '..', '..', 'core', 'sass', 'base')

// Relative luminance per WCAG 2.x — sRGB channel linearisation + Rec.709 weights.
const _lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
const luminance = (hex) => {
  const [r, g, b] = [0, 2, 4].map((i) => _lin(parseInt(hex.slice(i, i + 2), 16) / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const ratio = (fg, bg) => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a)
  return (hi + 0.05) / (lo + 0.05)
}

// Parses `prop: value;` pairs out of one compiled selector block.
const blockDecls = (css, selectorRe) => {
  const m = css.match(new RegExp(`${selectorRe}\\s*\\{([^}]*)\\}`))
  const decls = {}

  if (!m) return decls
  for (const d of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) decls[d[1]] = d[2].trim()

  return decls
}

// Resolves a token to a 6-digit hex: direct hex, or var(--x) chains
// resolved inside the theme map (dark values fall back to :root when the
// dark block doesn't override the token). Returns null for non-solid
// values (rgba(), color-mix(), gradients) — those pairs aren't audited.
const resolveHex = (name, theme) => {
  let val = theme[name]
  let guard = 0

  while (val && guard++ < 16) {
    const v = val.match(/^var\((--[\w-]+)\)$/)

    if (!v) break
    val = theme[v[1]]
  }

  const hex = val && val.match(/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i)

  return hex ? val.replace(/^#/, '').toLowerCase() : null
}

// [ink, surface, minimum ratio, why] — pairs reflect where each ink is
// actually painted (see component SCSS: text-muted is body caption ink on
// the light surfaces; text-muted-on-dark is reserved for always-dark bands).
const LIGHT_PAIRS = [
  [C.TEXT_PRIMARY, C.BG_PRIMARY, 7, 'body text on main surface'],
  [C.TEXT_PRIMARY, C.BG_SECONDARY, 7, 'body text on alt surface'],
  [C.TEXT_SECONDARY, C.BG_PRIMARY, 7, 'secondary text on main surface'],
  [C.TEXT_SECONDARY, C.BG_SECONDARY, 7, 'secondary text on alt surface'],
  [C.TEXT_MUTED, C.BG_PRIMARY, 7, 'muted captions on main surface'],
  [C.TEXT_MUTED, C.BG_SECONDARY, 7, 'muted captions on alt surface'],
  [C.TEXT_MUTED_ON_DARK, C.BG_DARK, 7, 'muted text on dark bands/modals'],
  [C.TEXT_MUTED_ON_DARK, C.BG_DARKER, 7, 'muted text on deepest band'],
  [C.MENU_INK, C.MENU_BG, 7, 'menu labels (small caps) on menu field'],
  [C.WHITE, C.BG_DARK, 7, 'inverted ink on contact/footer band'],
  [C.COLOR_ACCENT_CONTRAST, C.BG_PRIMARY, 3, 'focus ring / check icon (UI)'],
]

const DARK_PAIRS = [
  [C.TEXT_PRIMARY, C.BG_PRIMARY, 7, 'body text on main surface'],
  [C.TEXT_PRIMARY, C.BG_SECONDARY, 7, 'body text on alt surface'],
  [C.TEXT_SECONDARY, C.BG_PRIMARY, 7, 'secondary text on main surface'],
  [C.TEXT_MUTED, C.BG_PRIMARY, 7, 'muted captions on main surface'],
  [C.TEXT_MUTED, C.BG_SECONDARY, 7, 'muted captions on alt surface'],
  [C.TEXT_MUTED_ON_DARK, C.BG_DARK, 7, 'muted text on dark bands/modals'],
  [C.MENU_INK, C.MENU_BG, 7, 'menu labels on menu field'],
  [C.COLOR_ACCENT_CONTRAST, C.BG_PRIMARY, 3, 'focus ring / check icon (UI)'],
]

describe('WCAG AAA token contrast — compiled theme pairs', () => {
  const css = sass.compileString(
    `@import 'variables'; @import 'mixins'; @import 'placeholders'; @import 'structure';`,
    {
      loadPaths: [SASS_BASE],
      quietDeps: true,
      silenceDeprecations: ['import', 'global-builtin', 'legacy-js-api'],
    }
  ).css

  const light = blockDecls(css, ':root')
  const dark = { ...light, ...blockDecls(css, 'html\\.dark-mode') }

  const audit = (theme, pairs) =>
    pairs.map(([ink, surface, min, why]) => {
      const fg = resolveHex(ink, theme)
      const bg = resolveHex(surface, theme)

      if (!fg || !bg) return { ink, surface, min, why, fg, bg, ratio: null }

      return { ink, surface, min, why, fg, bg, ratio: ratio(fg, bg) }
    })

  test('light theme — every audited pair meets its WCAG floor', () => {
    const failures = []

    for (const r of audit(light, LIGHT_PAIRS)) {
      if (r.ratio === null) {
        failures.push(`${r.ink} on ${r.surface}: unresolvable token (${r.fg}/${r.bg})`)
      } else if (r.ratio < r.min) {
        failures.push(
          `${r.ink} (#${r.fg}) on ${r.surface} (#${r.bg}): ${r.ratio.toFixed(2)}:1 < ${r.min}:1 — ${r.why}`
        )
      }
    }

    expect(failures).toEqual([])
  })

  test('dark theme — every audited pair meets its WCAG floor', () => {
    const failures = []

    for (const r of audit(dark, DARK_PAIRS)) {
      if (r.ratio === null) {
        failures.push(`${r.ink} on ${r.surface}: unresolvable token (${r.fg}/${r.bg})`)
      } else if (r.ratio < r.min) {
        failures.push(
          `${r.ink} (#${r.fg}) on ${r.surface} (#${r.bg}): ${r.ratio.toFixed(2)} < ${r.min}:1 — ${r.why}`
        )
      }
    }

    expect(failures).toEqual([])
  })
})
