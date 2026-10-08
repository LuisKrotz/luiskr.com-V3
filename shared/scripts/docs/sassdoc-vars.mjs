#!/usr/bin/env node
/**
 * sassdoc-vars.mjs — inserts `///` sassdoc comments above every `$var:`
 * declaration in a Sass variables file. Trailing `// note` comments are
 * folded into the doc line; the description falls back to a per-prefix
 * template derived from the token name.
 *
 * Usage: node scripts/docs/sassdoc-vars.mjs <file.scss>
 * Idempotent: vars already preceded by `///` are skipped.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const file = process.argv[2]
if (!file) {
  process.stderr.write('usage: sassdoc-vars.mjs <file.scss>\n')
  process.exit(1)
}

/** Per-prefix description templates — keep the why, not just the what. */
const describe = (raw, trailing) => {
  if (trailing) return trailing.replace(/^[a-z]/, (c) => c.toUpperCase())

  const name = raw.replace(/^\$/, '')
  const num = name.match(/-(\d+)$/)?.[1]

  if (name.startsWith('color-'))
    return `Raw palette color — published as a --${name}-raw CSS var by _structure.scss`
  if (name.startsWith('cms-'))
    return 'CMS admin-chrome token — compile-time only (dark panel theme)'
  if (name.startsWith('vw-'))
    return `Viewport width breakpoint (${num}px) — px, used for breakpoint arithmetic`
  if (name.startsWith('un-'))
    return `Unitless viewport width for ${num}px — consumed by grid-max-area arithmetic`
  if (name.startsWith('gap-')) return `Grid gutter (unitless px) at the ${num}px viewport step`
  if (name.startsWith('grid-max-area-'))
    return `Max content width at the ${num}px step (un − 2·gap)`
  if (name.startsWith('bk-'))
    return `Media-query breakpoint — vw-${num} − 1px; consumed by the layout-${num} mixin`
  if (name.startsWith('space-')) return 'Fibonacci spacing step (unitless — converted via to-rem())'
  if (name.startsWith('z-'))
    return 'z-index layer — the scale is declared once here, in stacking order'
  if (name.startsWith('font-'))
    return 'Font stack token — compile-time source for the matching CSS var'

  return 'Compile-time design token — see the file header for the $-var → CSS-var contract'
}

const lines = readFileSync(file, 'utf8').split('\n')
const out = []

for (const line of lines) {
  const m = line.match(/^(\$[\w-]+):\s*(.+?);\s*(?:\/\/\s*(.*))?$/)

  const prevDoc = out.length && /^\/\/\//.test(out[out.length - 1].trim())

  if (m && !prevDoc) {
    // Keep a plain `//` group note on its own line; only fold trailing notes.
    out.push(`/// ${describe(m[1], m[3])}`)
    out.push(`${m[1]}: ${m[2]};`)
  } else {
    out.push(line)
  }
}

writeFileSync(file, out.join('\n'))
console.log(`${file}: done`)
