#!/usr/bin/env node
/**
 * @file gen-docs.mjs
 * @description Generates docs/api/*.md from the JSDoc in src/. For every
 * source file it extracts the @file/@description header plus each documented
 * member (class, method, function) and writes one markdown page per file,
 * grouped by directory, with an index page that includes an ASCII schematic
 * of how the code areas map onto UX surfaces.
 *
 * Usage: node scripts/docs/gen-docs.mjs
 * Output: docs/api/<area>/<file>.md + docs/api/README.md
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, relative, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
// gen-docs.mjs sits at shared/scripts/docs/ → ROOT is three levels up.
const SRC_DIRS = [
  'shared/src',
  'core',
  'website',
  'cms',
  'experiments',
  'shared/local-modules',
].map((d) => join(ROOT, d))

// `--out <dir>` overrides the destination (build emits docs/jsdocs; the
// default docs/api keeps the curated API mirror).
const outArg = process.argv.indexOf('--out')
const OUT = join(ROOT, outArg > -1 ? process.argv[outArg + 1] : 'shared/docs/api')

/** Recursively collects .ts/.tsx/.js sources under dir (skipping .d.ts). */
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? walk(join(dir, e.name))
      : /\.(ts|tsx|js)$/.test(e.name) && !e.name.endsWith('.d.ts')
        ? [join(dir, e.name)]
        : []
  )

/** Extracts every `/** … *\/` block with the line that follows it. */
const jsdocBlocks = (src) => {
  const blocks = []
  const re = /\/\*\*([\s\S]*?)\*\/\s*\n\s*([^\n]*)/g

  let m
  while ((m = re.exec(src))) {
    blocks.push({ doc: m[1], code: m[2].trim() })
  }

  return blocks
}

/** Cleans a JSDoc body into lines of text without the leading `*`. */
const docLines = (doc) =>
  doc
    .split('\n')
    .map((l) => l.replace(/^\s*\*\s?/, '').trimEnd())
    .join('\n')
    .trim()

/** Splits a doc body into { desc, tags } where tags = [{tag, text}]. */
const parseDoc = (doc) => {
  const lines = docLines(doc).split('\n')
  const tags = []
  const desc = []

  for (const line of lines) {
    const tm = line.match(/^@(\w+)\s*(.*)$/)
    if (tm) tags.push({ tag: tm[1], text: tm[2].trim() })
    else if (tags.length === 0 && line) desc.push(line)
    else if (!line && tags.length === 0) desc.push('')
  }

  return { desc: desc.join('\n').trim(), tags }
}

/** Guesses a member name from the line after the JSDoc block. */
const memberName = (code) => {
  const m =
    code.match(/^(?:export\s+)?(?:async\s+)?(?:static\s+)?(?:get\s+|set\s+)?([#\w$]+)\s*[=(]/u) ||
    code.match(/^(?:export\s+)?(?:class|function|const|let|var)\s+([#\w$]+)/u) ||
    code.match(/^([#\w$]+)\s*:/u)

  return m ? m[1] : null
}

/** First sentence of a doc description, trimmed to ~110 chars. */
const short = (text, n = 110) => {
  const first = text.split(/\.\s|\n/)[0].trim()

  return first.length > n ? `${first.slice(0, n)}…` : first
}

/** Escapes angle brackets so <element-name> isn't swallowed as raw HTML. */
const esc = (text) => text.replace(/</g, '&lt;').replace(/>/g, '&gt;')

const AREA_META = {
  '': { title: 'Entry points', ux: 'Boot surfaces: what the user sees first on each bundle.' },
  core: { title: 'Core engine', ux: 'Shared primitives every surface builds on — no direct UI.' },
  routes: { title: 'Routes', ux: 'One page of the site per file — the URL the visitor lands on.' },
  components: {
    title: 'Site components',
    ux: 'Shadow-DOM widgets — the visible UI of the public site.',
  },
  'components/legal': { title: 'Site components / legal', ux: 'Footer shown on legal pages.' },
  'components/portfolio': {
    title: 'Site components / portfolio',
    ux: 'Related-projects strip on case-study pages.',
  },
  utils: { title: 'Utils', ux: 'Runtime services behind the scenes (WASM, GL, scroll, media).' },
  'utils/canvas': {
    title: 'Utils / canvas widgets',
    ux: 'WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows.',
  },
  playground: { title: 'Earth Playground', ux: 'The /earth-playground WebGPU experience.' },
  cms: { title: 'CMS', ux: 'Admin bundle — editors for every database node.' },
  'cms/routes': { title: 'CMS / routes', ux: 'Login screen and the dashboard shell.' },
  'cms/about': { title: 'CMS / about editor', ux: 'About-section editor card.' },
  'cms/deploy-info': {
    title: 'CMS / deploy info',
    ux: 'Deploy reports viewer — lighthouse, coverage, scans.',
  },
  'cms/footer': { title: 'CMS / footer editor', ux: 'Footer + legal links editor card.' },
  'cms/lang': { title: 'CMS / lang editor', ux: 'Raw JSON dictionary editor card.' },
  'cms/media-convert': {
    title: 'CMS / media convert',
    ux: 'Batch image→WebP conversion pipeline UI.',
  },
  'cms/playground-editor': {
    title: 'CMS / playground editor',
    ux: 'Earth-playground labels, defaults and route slugs editor.',
  },
  'cms/portfolio': {
    title: 'CMS / portfolio editor',
    ux: 'Portfolio list + related-projects editor card.',
  },
  'cms/projects': { title: 'CMS / projects editor', ux: 'Per-project sections editor card.' },
  'cms/dev': { title: 'CMS / dev', ux: 'Offline dev mock — never shipped.' },
}

/** Longest-prefix AREA_META lookup so deeper module dirs inherit their parent's UX note. */
const areaMeta = (dir) => {
  let d = dir
  while (d && !(d in AREA_META)) d = d.slice(0, d.lastIndexOf('/'))
  return AREA_META[d] || AREA_META['']
}

const files = SRC_DIRS.flatMap((d) => walk(d)).sort()
const areas = new Map()

for (const file of files) {
  const rel = relative(ROOT, file)
  const dir = dirname(rel) === '.' ? '' : dirname(rel)
  const src = readFileSync(file, 'utf8')
  const blocks = jsdocBlocks(src)

  // First block is the @file header when it carries @file or @description.
  let header = null
  let memberBlocks = blocks

  if (blocks.length && /@(file|description)/.test(blocks[0].doc)) {
    const p = parseDoc(blocks[0].doc)
    header = {
      name: p.tags.find((t) => t.tag === 'file')?.text || basename(file),
      desc: p.tags.find((t) => t.tag === 'description')?.text || p.desc,
    }
    memberBlocks = blocks.slice(1)
  }

  const members = memberBlocks
    .map((b) => ({ name: memberName(b.code), ...parseDoc(b.doc) }))
    .filter((m) => m.desc || m.tags.length)

  if (!areas.has(dir)) areas.set(dir, [])
  areas.get(dir).push({ rel, header, members })
}

// ── Emit per-file pages ──────────────────────────────────────────────────────
if (existsSync(OUT)) rmSync(OUT, { recursive: true })

for (const [dir, entries] of areas) {
  const areaDir = join(OUT, dir)
  mkdirSync(areaDir, { recursive: true })

  for (const { rel, header, members } of entries) {
    const page = basename(rel).replace(/\.(ts|tsx|js)$/, '') + '.md'
    const lines = []

    lines.push(`# \`${rel}\``)
    lines.push('')
    if (header?.desc) {
      lines.push(esc(header.desc))
      lines.push('')
    }
    lines.push('| | |')
    lines.push('|---|---|')
    lines.push(`| **Source** | \`src/${rel}\` |`)
    const meta = areaMeta(dir)
    lines.push(`| **UX surface** | ${meta.ux} |`)
    lines.push('')

    if (members.length) {
      lines.push('## Members')
      lines.push('')
      for (const m of members) {
        lines.push(m.name ? `### \`${m.name}\`` : '### (module scope)')
        lines.push('')
        if (m.desc) lines.push(m.desc)
        for (const t of m.tags) {
          if (t.tag === 'private') lines.push('`@private`')
          else if (t.tag === 'param' || t.tag === 'returns') lines.push(`- \`@${t.tag}\` ${t.text}`)
          else if (t.tag === 'file' || t.tag === 'description') continue
        }
        lines.push('')
      }
    }

    writeFileSync(join(areaDir, page), lines.join('\n'))
  }
}

// ── Index page with schematic ────────────────────────────────────────────────
const idx = []
idx.push('# API Docs — generated from JSDoc')
idx.push('')
idx.push('> Generated by `scripts/docs/gen-docs.mjs`. Each page mirrors the JSDoc in the')
idx.push('> matching source file and notes which UX surface the code drives.')
idx.push('')
idx.push('## Code → UX map')
idx.push('')
idx.push('```')
idx.push(' index.html ──► src/main.ts ──► <app-shell> App.tsx')
idx.push('                                   │')
idx.push('                     core/router/router.ts ──► view factory')
idx.push('                                   │')
idx.push('   ┌──────────────┬───────────────┼────────────────┬──────────────┐')
idx.push(' Home.tsx     Project.tsx     Legal.tsx     NotFound.tsx  (website/views/)')
idx.push('   │              │               │              │')
idx.push('   └──────► website/components/<domain>/<Comp>.tsx + <domain>/<comp>/ modules')
idx.push('              (nav, home, carousel, media, dialogs, portfolio, feedback)')
idx.push('                                   │')
idx.push('       core (Component · jsx · store · i18n) + core/utils/* domains')
idx.push('')
idx.push(' cms/index.html ──► cms/main.ts ──► CmsDashboard')
idx.push('                                   └─► cms/<feature>/ editors')
idx.push('                                         └─► Firebase translations/*')
idx.push('                                                   │  (same DB the site reads)')
idx.push(' /earth-playground ──► experiments/earth-playground/SpacePlayground + earth/ engine')
idx.push('```')
idx.push('')

for (const [dir, entries] of areas) {
  const meta = areaMeta(dir)
  idx.push(`## ${meta.title}`)
  idx.push('')
  idx.push(`*${meta.ux}*`)
  idx.push('')
  idx.push('| File | What it does |')
  idx.push('|---|---|')
  for (const { rel, header } of entries) {
    const page = `${dir ? `${dir}/` : ''}${basename(rel).replace(/\.(ts|tsx|js)$/, '')}.md`
    idx.push(`| [\`${basename(rel)}\`](${page}) | ${esc(short(header?.desc || '—'))} |`)
  }
  idx.push('')
}

writeFileSync(join(OUT, 'README.md'), idx.join('\n'))

const total = files.length
const pages = [...areas.values()].reduce((n, a) => n + a.length, 0)
console.log(
  `gen-docs: ${pages} pages generated from ${total} source files → ${relative(ROOT, OUT)}/`
)
