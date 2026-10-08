#!/usr/bin/env node
/**
 * @file sassdoc-lite.mjs
 * @description Security-focused replacement for the unmaintained `sassdoc`
 * toolchain. sassdoc@2.7.4 drags a cluster of advisories with no upstream
 * fix (html-minifier ReDoS, sassdoc-extras prototype pollution, marked
 * ReDoS, semver-regex ReDoS, got redirect-to-socket, update-notifier, and
 * the js-yaml→argparse→sprintf-js DoS path), so the dependency is removed
 * entirely and this dependency-free generator produces the same artifact:
 * `shared/docs/sassdoc/index.html`, a single semantic HTML page the docs
 * portal renders inline (it inherits the project's own stylesheet there).
 *
 * Contract: scans every module's `.scss` (shared/src, core, website, cms,
 * experiments) for `///` doc blocks attached to
 * `$var`, `@function`, `@mixin`, and `%placeholder` declarations; parses
 * `@param`/`@return`/`@output` tags; and writes one index.html with every
 * user-supplied byte HTML-escaped — no markdown eval, no template eval,
 * no network, no transitive deps.
 *
 * Usage: `yarn docs:sassdoc` (invoked by `yarn docs`).
 */

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SRC_DIRS = ['shared/src', 'core', 'website', 'cms', 'experiments'].map((d) =>
  path.join(ROOT, d)
)
const OUT_DIR = path.join(ROOT, 'shared', 'docs', 'sassdoc')
const OUT_FILE = path.join(OUT_DIR, 'index.html')

/** HTML-escapes every byte of user-originated text before emission. */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

/** Recursively lists `.scss` files under `dir` (self-similar tree walk). */
function* walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) yield* walk(p)
    else if (ent.isFile() && ent.name.endsWith('.scss')) yield p
  }
}

/**
 * Classifies the code line that follows a `///` block into the sassdoc
 * item taxonomy and extracts the declared name.
 */
const classify = (line) => {
  const trimmed = line.trim()
  let m

  if ((m = trimmed.match(/^\$([\w-]+)\s*:/))) return { type: 'variable', name: m[1], code: trimmed }
  if ((m = trimmed.match(/^@function\s+([\w-]+)\s*(\([^)]*\))?/)))
    return { type: 'function', name: m[1], code: trimmed }
  if ((m = trimmed.match(/^@mixin\s+([\w-]+)\s*(\([^)]*\))?/)))
    return { type: 'mixin', name: m[1], code: trimmed }
  if ((m = trimmed.match(/^%([\w-]+)/))) return { type: 'placeholder', name: m[1], code: trimmed }

  return null
}

/**
 * Splits a `///` block into prose lines and structured `@tag` lines.
 * Supported tags: `@param`, `@return`, `@output`, `@deprecated` —
 * everything else is preserved as a raw tag line so nothing is dropped.
 */
const parseBlock = (docLines) => {
  const item = { desc: [], params: [], returns: null, tags: [] }

  for (const raw of docLines) {
    const line = raw.replace(/^\s*\/\/\/?\s?/, '')
    const tag = line.match(/^@(\w+)\s*(.*)$/)

    if (!tag) {
      item.desc.push(line)
      continue
    }

    const [, name, rest] = tag

    if (name === 'param') {
      const m = rest.match(/^\{([^}]+)\}\s+(\S+)\s*(?:\[(.*?)\])?\s*-?\s*(.*)$/)
      item.params.push(
        m
          ? { type: m[1], name: m[2], def: m[3] || null, desc: m[4] || '' }
          : { type: '', name: rest, def: null, desc: '' }
      )
    } else if (name === 'return' || name === 'returns') {
      const m = rest.match(/^\{([^}]+)\}\s*(.*)$/)
      item.returns = m ? { type: m[1], desc: m[2] || '' } : { type: '', desc: rest }
    } else {
      item.tags.push({ name, body: rest })
    }
  }

  return item
}

/** Parses one .scss file into its documented item list. */
const parseFile = (file) => {
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  const items = []
  let doc = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (/^\s*\/\/\//.test(line)) {
      doc = doc || []
      doc.push(line)
      continue
    }

    if (doc) {
      const meta = classify(line)

      if (meta) {
        items.push({ ...parseBlock(doc), ...meta })
      }

      doc = null
    }
  }

  return items
}

/** Renders one documented item as an escaped definition block. */
const renderItem = (it) => {
  const params = it.params
    .map(
      (p) =>
        `<li><code>${esc(p.name)}</code>` +
        (p.type ? ` <span class="sd-type">${esc(p.type)}</span>` : '') +
        (p.def ? ` <span class="sd-def">default: <code>${esc(p.def)}</code></span>` : '') +
        (p.desc ? ` — ${esc(p.desc)}` : '') +
        '</li>'
    )
    .join('')

  return `<article class="sd-item sd-item--${esc(it.type)}" id="${esc(it.type)}-${esc(it.name)}">
    <h3><code>${esc(it.name)}</code> <span class="sd-kind">${esc(it.type)}</span></h3>
    <pre class="sd-sig"><code>${esc(it.code)}</code></pre>
    ${it.desc.length ? `<p>${esc(it.desc.join(' '))}</p>` : ''}
    ${params ? `<h4>Parameters</h4><ul>${params}</ul>` : ''}
    ${it.returns ? `<h4>Returns</h4><p><span class="sd-type">${esc(it.returns.type)}</span> ${esc(it.returns.desc)}</p>` : ''}
    ${it.tags.map((t) => `<p class="sd-tag"><code>@${esc(t.name)}</code> ${esc(t.body)}</p>`).join('')}
  </article>`
}

const main = () => {
  const files = SRC_DIRS.filter((d) => fs.existsSync(d))
    .flatMap((d) => [...walk(d)])
    .sort()
  const groups = files
    .map((f) => ({ file: path.relative(ROOT, f), items: parseFile(f) }))
    .filter((g) => g.items.length)

  const toc = groups
    .map(
      (g) =>
        `<li><a href="#file-${esc(g.file.replace(/[^\w-]+/g, '-'))}">${esc(g.file)}</a> (${g.items.length})</li>`
    )
    .join('\n      ')

  const body = groups
    .map(
      (g) => `<section id="file-${esc(g.file.replace(/[^\w-]+/g, '-'))}">
    <h2>${esc(g.file)}</h2>
    ${g.items.map(renderItem).join('\n    ')}
  </section>`
    )
    .join('\n  ')

  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${esc(pkg.name)} — Sass API</title>
  <meta name="viewport" content="width=device-width" />
  <meta name="description" content="Sass design-token and mixin API reference generated from /// doc blocks." />
</head>
<body>
  <h1>Sass API — ${esc(pkg.name)} ${esc(pkg.version || '')}</h1>
  <p>Generated from <code>///</code> doc blocks across the module tree. Every item is
  a compile-time token, function, mixin, or placeholder consumed by the component sheets.</p>
  <nav aria-label="Files"><ul>
      ${toc}
  </ul></nav>
  ${body}
</body>
</html>
`

  // Wipe the previous emission so stale vendor assets (the old theme shipped
  // jquery/fuse/prism bundles) never linger next to the regenerated index.
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(OUT_FILE, html)

  const total = groups.reduce((n, g) => n + g.items.length, 0)
  process.stdout.write(
    `sassdoc-lite: ${total} items from ${groups.length} files → ${path.relative(ROOT, OUT_FILE)}\n`
  )
}

main()
