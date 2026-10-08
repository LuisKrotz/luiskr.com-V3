/**
 * @file grid-overlay.test.js
 * @description Compiles the real SCSS for BOTH sides of the layout gutter
 * contract — %MAXAREA (content padding) and html.show-grid (debug overlay
 * custom props) — and asserts they emit the same gutter at every breakpoint.
 * The overlay was historically a hand-synced subset of breakpoints and
 * drifted from the layout; the shared $grid-steps map + grid-steps mixin
 * make drift impossible, and this test locks that invariant in.
 */

import path from 'path'
import { fileURLToPath } from 'url'
import * as sass from 'sass'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SASS_BASE = path.join(__dirname, '..', '..', '..', 'core', 'sass', 'base')

// Extracts `prop: value` declarations grouped by their media query from
// compiled CSS — each `@media` chunk is searched for the selector's block,
// and the head of the stylesheet supplies the unprefixed `base` block.
const declsByMedia = (css, selectorRe) => {
  const out = {}
  const head = css.split('@media')[0]
  const base = head.match(new RegExp(`${selectorRe} \\{([^}]+)\\}`))

  if (base) out.base = base[1]

  for (const m of css.matchAll(/@media \(min-width: (\d+)px\) \{([\s\S]*?)\n\}/g)) {
    const block = m[2].match(new RegExp(`${selectorRe} \\{([^}]+)\\}`))

    if (block) out[m[1]] = block[1]
  }

  return out
}

const propValue = (decls, prop) => {
  const m = decls.match(new RegExp(`${prop}:\\s*([^;]+);`))

  return m ? m[1].trim() : null
}

// Reads the live $grid-steps map so the test automatically tracks any
// breakpoint added to the token table — no hand-maintained list here.
const gridSteps = () => {
  const vars = fs.readFileSync(path.join(SASS_BASE, '_variables.scss'), 'utf-8')
  const mapBlock = vars.match(/\$grid-steps:\s*\(([^)]+)\)/s)[1]
  const steps = []

  for (const m of mapBlock.matchAll(/(\d+):\s*\$gap-(\d+)/g)) steps.push(Number(m[1]))

  return steps
}

describe('Grid overlay — compiled parity with %MAXAREA gutters', () => {
  const overlayCss = sass.compile(path.join(SASS_BASE, '_grid-overlay.scss'), {
    quietDeps: true,
    silenceDeprecations: ['import', 'global-builtin', 'legacy-js-api'],
  }).css

  // %MAXAREA is a placeholder — compile a probe consumer that extends it.
  const probeCss = sass.compileString(
    `@import 'variables'; @import 'mixins'; @import 'placeholders'; .probe { @extend %MAXAREA; }`,
    {
      loadPaths: [SASS_BASE],
      quietDeps: true,
      silenceDeprecations: ['import', 'global-builtin', 'legacy-js-api'],
    }
  ).css

  const layout = declsByMedia(probeCss, '\\.probe')
  const overlay = declsByMedia(overlayCss, 'html\\.show-grid')
  const steps = gridSteps()

  test('every $grid-steps entry produces a media query in BOTH stylesheets', () => {
    // Steps above the 272 base each emit one (step − 1)px min-width query.
    const expected = steps.filter((s) => s > 272).map((s) => String(s - 1))

    for (const mq of expected) {
      expect(layout[mq]).toBeTruthy()
      expect(overlay[mq]).toBeTruthy()
    }
  })

  test('overlay gutter equals %MAXAREA padding at every breakpoint', () => {
    const baseGutter = propValue(overlay.base, '--_grid-gutter')
    const basePad = propValue(layout.base, 'padding')

    // padding shorthand: "0 <gutter> 0" — middle term is the gutter.
    expect(basePad.split(/\s+/)[1]).toBe(baseGutter)

    for (const s of steps.filter((x) => x > 272)) {
      const mq = String(s - 1)
      const gutter = propValue(overlay[mq], '--_grid-gutter')
      const pad = propValue(layout[mq], 'padding')

      expect(gutter).toBeTruthy()
      expect(pad.split(/\s+/)[1]).toBe(gutter)
    }
  })

  test('overlay exposes a column count at every breakpoint', () => {
    for (const key of Object.keys(overlay)) {
      expect(propValue(overlay[key], '--_grid-cols')).toBeTruthy()
    }
  })

  test('gutter strictly increases or holds across ascending breakpoints', () => {
    const seq = steps.map((s) => {
      const key = s === 272 ? 'base' : String(s - 1)

      return parseFloat(propValue(overlay[key], '--_grid-gutter'))
    })

    for (let i = 1; i < seq.length; i++) expect(seq[i]).toBeGreaterThanOrEqual(seq[i - 1])
  })
})
