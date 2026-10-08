/**
 * @file docs/render.mjs
 * @description Build-time file → HTML renderers for the docs portal.
 *
 * Every portal entry renders as HTML no matter the source format:
 *   - markdown  → `marked` GFM conversion (tables, task lists, fenced
 *     code, autolinks, heading anchors — the GitHub rendering contract)
 *   - source code / scripts / styles → escaped <pre> with a language class
 *   - json      → pretty-printed, escaped
 *   - html      → sanitized into shadow-scoped markup: scripts, noscript
 *     shells and inline handlers stripped, <style> blocks kept so the
 *     report's own look + the project's CSS variables both apply
 *   - svg/images → media embed marker (the viewer picks the display)
 *   - everything else → escaped <pre>
 *
 * All renderers are pure functions so the portal's output is fully covered
 * by unit tests without touching the filesystem.
 */

import { marked } from 'marked'

// GitHub-flavored markdown: tables, strikethrough, task lists, autolinks.
marked.use({ gfm: true })

/** HTML-escapes a text fragment for inclusion in markup or <pre>. */
export const escapeHtml = (text) =>
  String(text)
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#39;')

/**
 * GitHub-style slug for a heading: lowercase, spaces → '-', strip anything
 * that isn't a word char, '-', or space. Matches GitHub's anchor scheme so
 * intra-document links keep working.
 */
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/gu, '')
    .replace(/[^\w\- ]+/gu, '')
    .trim()
    .replace(/\s+/gu, '-')

/**
 * Full markdown → HTML via `marked` with GFM enabled (tables, task lists,
 * fenced code, strikethrough, autolinks). A post-pass adds `id` anchors to
 * headings the same way GitHub does, and adds `loading="lazy"` to images.
 */
const renderMarkdown = (text) => {
  const html = marked.parse(text, { async: false })

  const slugged = html.replace(
    /<h([1-6])>([\s\S]*?)<\/h\1>/gu,
    (_m, level, inner) => `<h${level} id="${escapeHtml(slugify(inner))}">${inner}</h${level}>`
  )

  // Raw HTML inside markdown passes through marked verbatim — strip the
  // executable surface (same contract as sanitizeHtmlDoc on full docs).
  const safe = slugged
    .replace(/<script\b[\s\S]*?<\/script\s*>/giu, '')
    .replace(/<script\b[^>]*\/?\s*>/giu, '')
    .replace(/\son\w+="[^"]*"/giu, '')
    .replace(/\son\w+='[^']*'/giu, '')
    .replace(/\son\w+=[^\s>]+/giu, '')

  const lazy = safe.replace(/<img\s/gu, '<img loading="lazy" ')

  // ```mermaid fences → diagram placeholder divs; the viewer lazy-loads
  // mermaid and renders each block into a themed SVG (the GitHub flow).
  // The source stays escaped inside the div — a failed render still
  // reads as the diagram code.
  return lazy.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/giu,
    '<div class="docs-mermaid">$1</div>'
  )
}

/** Recursion cap — beyond it a nested value renders as a bounded <pre>. */
const JSON_DEPTH_CAP = 8

/** Row cap per object/array — the remainder collapses to a "+N more" line. */
const JSON_ROW_CAP = 400

/** Column cap for object-array tables (union of keys, first-N order). */
const JSON_COL_CAP = 10

/** Keys whose numeric value is a percentage → rendered with a meter bar. */
const JSON_PCT_KEY = /pct|percent|coverage|ratio/iu

/** Non-array object check for the JSON tree walk. */
const isJsonObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

/**
 * One JSON scalar → typed markup. Numbers under a pct-like key render as a
 * progress meter so coverage summaries read as dashboards, not dumps;
 * URLs become links; the rest gets a type-tagged span.
 */
const renderJsonScalar = (key, v) => {
  if (v === null || v === undefined) return '<span class="docs-json-null">null</span>'

  if (typeof v === 'boolean') return `<span class="docs-json-bool">${v}</span>`

  if (typeof v === 'number') {
    const shown = Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100)

    return JSON_PCT_KEY.test(key) && v >= 0 && v <= 100
      ? `<span class="docs-json-pct"><span class="docs-json-pct-bar" style="--docs-json-pct:${shown}"></span>${shown}%</span>`
      : `<span class="docs-json-num">${shown}</span>`
  }

  const text = escapeHtml(String(v))

  return /^https?:\/\//u.test(v)
    ? `<a class="docs-json-link" href="${text}" rel="noopener noreferrer">${text}</a>`
    : `<span class="docs-json-str">${text}</span>`
}

/** Nested container → a count badge inside table cells (keeps rows tight). */
const jsonNestBadge = (v) =>
  `<span class="docs-json-nest">${Array.isArray(v) ? `[${v.length} items]` : `{${Object.keys(v).length} keys}`}</span>`

/**
 * Arrays → a real table when every row is a flat object (the report-row
 * shape — axe violations, snyk entries), otherwise an ordered value list.
 */
const renderJsonArray = (arr, depth) => {
  if (!arr.length) return '<p class="docs-json-empty">[]</p>'

  const shown = arr.slice(0, JSON_ROW_CAP)

  const more =
    arr.length > JSON_ROW_CAP
      ? `<p class="docs-json-more">… ${arr.length - JSON_ROW_CAP} more</p>`
      : ''

  if (arr.every(isJsonObject)) {
    const cols = [...new Set(shown.flatMap((o) => Object.keys(o)))].slice(0, JSON_COL_CAP)

    const head = `<thead><tr>${cols.map((c) => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>`

    const body = shown
      .map(
        (o) =>
          `<tr>${cols
            .map((c) => {
              const v = o[c]

              return `<td>${
                v !== undefined && (isJsonObject(v) || Array.isArray(v))
                  ? jsonNestBadge(v)
                  : renderJsonScalar(c, v === undefined ? null : v)
              }</td>`
            })
            .join('')}</tr>`
      )
      .join('')

    return `<table class="docs-json-table">${head}<tbody>${body}</tbody></table>${more}`
  }

  const items = shown.map((v) => `<li>${renderJsonValue('', v, depth + 1)}</li>`).join('')

  return `<ol class="docs-json-list">${items}</ol>${more}`
}

/**
 * Objects → key/field rows; nested objects recurse into their own section
 * so a coverage-summary reads file → metrics → numbers instead of braces.
 */
const renderJsonObject = (obj, depth) => {
  const entries = Object.entries(obj)

  if (!entries.length) return '<p class="docs-json-empty">{}</p>'

  const rows = entries
    .slice(0, JSON_ROW_CAP)
    .map(
      ([k, v]) =>
        `<div class="docs-json-row"><dt>${escapeHtml(k)}</dt><dd>${renderJsonValue(k, v, depth + 1)}</dd></div>`
    )
    .join('')

  const more =
    entries.length > JSON_ROW_CAP
      ? `<p class="docs-json-more">… ${entries.length - JSON_ROW_CAP} more entries</p>`
      : ''

  return `<dl class="docs-json-obj">${rows}</dl>${more}`
}

/** Value dispatcher — scalars inline, containers recursive, depth-capped. */
const renderJsonValue = (key, v, depth) => {
  if (v === null || typeof v !== 'object') return renderJsonScalar(key, v)

  if (depth >= JSON_DEPTH_CAP) {
    return `<pre class="docs-code"><code>${escapeHtml(JSON.stringify(v))}</code></pre>`
  }

  return Array.isArray(v) ? renderJsonArray(v, depth) : renderJsonObject(v, depth)
}

/**
 * JSON → parsed, structured markup: real numbers, key/field rows and
 * tables — never a raw dump. Unparseable input falls back to escaped text.
 */
const renderJson = (text) => {
  let data

  try {
    data = JSON.parse(text)
  } catch {
    return `<pre class="docs-code"><code>${escapeHtml(text)}</code></pre>`
  }

  return `<div class="docs-json">${renderJsonValue('', data, 0)}</div>`
}

/** Language-id map for the code <pre> class — display label only. */
const LANG_BY_EXT = Object.freeze({
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  mjs: 'javascript',
  jsx: 'javascript',
  scss: 'scss',
  css: 'css',
  html: 'html',
  xml: 'xml',
  svg: 'svg',
  yml: 'yaml',
  yaml: 'yaml',
  toml: 'toml',
  sh: 'shell',
  zsh: 'shell',
  bash: 'shell',
})

/**
 * Sanitizes a full HTML document for inline rendering inside the portal
 * viewer's shadow root. Keeps every `<style>` block (they only reach the
 * shadow tree, so a report's own look survives without leaking into the
 * page chrome) and keeps the document's markup so it inherits the
 * project's CSS variables + the viewer's generic element styles.
 *
 * Removed:
 *   - `<script>` / `<noscript>` — noscript blocks are what surfaced the
 *     "requires JavaScript" fallback text inside the sandboxed iframe.
 *   - `<iframe>/<object>/<embed>` — no nested browsing contexts.
 *   - `<base>` / `<meta>` / `<link>` — no navigation or external fetches.
 *   - `on*` event-handler attributes — defense in depth on top of the
 *     build-time trust boundary.
 */
const sanitizeHtmlDoc = (doc, linkResolver = null) => {
  const styles = [...doc.matchAll(/<style\b[^>]*>[\s\S]*?<\/style\s*>/giu)].map((m) => m[0])

  // Local <link rel="stylesheet"> refs (istanbul reports: base.css,
  // prettify.css) get inlined — external CSS would 404 under the portal
  // route anyway, and inline <style> is the only styling that survives
  // into the shadow root. Non-resolvable/external hrefs stay stripped.
  if (linkResolver) {
    for (const m of doc.matchAll(/<link\b[^>]*>/giu)) {
      const tag = m[0]

      if (!/rel\s*=\s*["']?stylesheet/iu.test(tag)) continue

      const href =
        /\bhref\s*=\s*"([^"]*)"/iu.exec(tag)?.[1] || /\bhref\s*=\s*'([^']*)'/iu.exec(tag)?.[1]

      if (!href || /^[a-z]+:|^\/\//iu.test(href)) continue

      const css = linkResolver(href)

      // `</style` inside inlined CSS would close the element early — a
      // space after `</` neutralizes it without changing the rules.
      if (css) styles.push(`<style>${css.replace(/<\/style/giu, '< /style')}</style>`)
    }
  }

  const bodyMatch = /<body\b[^>]*>([\s\S]*?)<\/body\s*>/iu.exec(doc)

  let inner = bodyMatch ? bodyMatch[1] : doc

  inner = inner
    .replace(/<script\b[\s\S]*?<\/script\s*>/giu, '')
    .replace(/<script\b[^>]*\/?\s*>/giu, '')
    .replace(/<noscript\b[\s\S]*?<\/noscript\s*>/giu, '')
    .replace(
      /<(?:iframe|object|embed|base|link|meta)\b[^>]*>[\s\S]*?<\/(?:iframe|object|embed)\s*>/giu,
      ''
    )
    .replace(/<(?:iframe|object|embed|base|link|meta|title)\b[^>]*\/?\s*>/giu, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/giu, '')
    .replace(/\son\w+="[^"]*"/giu, '')
    .replace(/\son\w+='[^']*'/giu, '')
    .replace(/\son\w+=[^\s>]+/giu, '')

  return `${styles.join('\n')}\n${inner}`
}

/**
 * Dispatches a file to the right renderer.
 * @param {string} format        Format tag emitted by scan.mjs.
 * @param {string} content       Raw file text.
 * @param {string} ext           Lower-cased extension without the dot.
 * @param {object} [opts]        Optional: `linkResolver(href)` → CSS text
 *                               for inlining a report's local stylesheet
 *                               links (istanbul `base.css`/`prettify.css`).
 * @returns {string} Rendered markup, safe for the viewer's innerHTML paint.
 */
export const renderFile = (format, content, ext, opts = {}) => {
  switch (format) {
    case 'markdown':
      return `<article class="docs-md">${renderMarkdown(content)}</article>`

    case 'html':
      // Sanitized for inline rendering inside the viewer's shadow root —
      // project CSS variables apply, scripts/noscript shells are gone.
      return `<div class="docs-html">${sanitizeHtmlDoc(content, opts.linkResolver || null)}</div>`

    case 'json':
      return renderJson(content)

    case 'code': {
      const lang = LANG_BY_EXT[ext] || ext || 'text'

      return `<pre class="docs-code"><code class="lang-${lang}">${escapeHtml(content)}</code></pre>`
    }

    default:
      return `<pre class="docs-code">${escapeHtml(content)}</pre>`
  }
}
