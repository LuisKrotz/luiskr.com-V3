#!/usr/bin/env node
/**
 * One-shot codemod: replaces formulaic stub JSDoc ("The X constant.",
 * "The X value.") with descriptions derived from the declaration that
 * follows. Only rewrites exact stub blocks — hand-written docs untouched.
 * Usage: node scripts/docs/normalize-stub-docs.mjs <file...> [--dry]
 */
import fs from 'node:fs'

const VOCAB = {
  CLASSES: 'class-name',
  ATTRS: 'attribute-name',
  ATTR_VALUES: 'attribute-value',
  TAGS: 'element tag-name',
  EVENTS: 'event-name',
  IDS: 'element-id',
  SELECTORS: 'selector',
  STRINGS: 'string',
  PATHS: 'path',
  URLS: 'URL',
  KEYS: 'key',
  PARAMS: 'parameter',
  CSS_PROPS: 'CSS custom-property',
  MUTATIONS: 'store-mutation name',
  TEXT: 'UI text',
  UI_KEYS: 'UI-text key',
  DIMENSIONS: 'dimension',
  MEDIA_QUERIES: 'media-query',
  STORAGE_KEYS: 'storage-key',
  BREAKPOINTS: 'breakpoint',
  LOCALES: 'locale',
  THEME: 'theme',
  VARIANTS: 'variant class-name',
}

const humanize = (name) =>
  name
    .replace(/^_/, '')
    .replace(/_([A-Z]+)$/, '') // strip trailing vocab word
    .toLowerCase()
    .replace(/_/g, ' ')

const vocabWord = (name) => {
  const last = name.split('_').pop()
  return VOCAB[last] || VOCAB[name] || null
}

const describeConst = (name, init) => {
  const lit = init.match(/^'([^']*)'/)?.[1]

  if (name.startsWith('_B_'))
    return `BEM block fragment \`${lit ?? '…'}\` — declared once here; every domain class token composes from this fragment (zero-hardcoding rule 9).`
  if (name.startsWith('_K_'))
    return `Shared key token \`${lit ?? '…'}\` — single source for a literal repeated across modules (zero-hardcoding rule 5).`
  if (name.startsWith('_'))
    return `Internal scalar token \`${lit ?? '…'}\` — composed by the token groups in this module.`
  if (/^Object\.freeze\(\{/.test(init)) {
    const v = vocabWord(name)
    const domain = humanize(name)
    const what = v ? `${domain} ${v}` : domain
    return `Frozen ${what} map — sole declaration site for these tokens; consumers read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token contract immutable at runtime.`
  }
  if (/^Object\.freeze\(\[/.test(init) || init.startsWith('['))
    return `Frozen ${humanize(name)} list — the ordered source for this token set.`
  if (lit !== undefined)
    return `Scalar token \`${lit}\` — the sole declaration site for this literal.`
  if (/^\d/.test(init) || /^-?\d/.test(init))
    return `Numeric token — the sole declaration site for this value.`
  return null
}

const describeDecl = (name, decl) => {
  if (/^export\s+(type|interface)\s/.test(decl))
    return `Type contract for ${name} — the shape consumers rely on.`
  if (/^export\s+(async\s+)?function|^export\s+const\s+\w+\s*=\s*(async\s*)?\(/.test(decl))
    return `Helper for this module — see implementation for behavior.`
  if (/^export\s+class/.test(decl)) return `Class ${name} — see members.`
  return null
}

const STUB =
  /\/\*\*\n(\s*\*\s*The (\w+) (constant|value|helper)\.\s*\n)\s*\*\/\n(\s*(export\s+)?(const|let|type|interface|function|class|async)[^\n{=]*=?\s*([^\n]*))?/g

const dry = process.argv.includes('--dry')
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'))
let changed = 0

for (const file of files) {
  let src = fs.readFileSync(file, 'utf8')
  let n = 0

  src = src.replace(STUB, (m, stubLine, name, kind, declLine, _e, kw, init) => {
    const rest = init || ''
    let desc = kind === 'constant' || kind === 'helper' ? describeConst(name, rest) : null

    if (!desc && declLine) desc = describeDecl(name, declLine)
    if (!desc && (kind === 'value' || !declLine)) desc = `Token ${name} — see usage sites for role.`
    if (!desc) return m

    const indent = stubLine.match(/^\s*/)[0]
    const words = desc.split(' ')
    const lines = []
    let cur = ''
    for (const w of words) {
      if ((cur + ' ' + w).trim().length > 90) {
        lines.push(cur.trim())
        cur = w
      } else cur += ' ' + w
    }
    lines.push(cur.trim())
    const doc = `/**\n${lines.map((l) => `${indent ? indent : ' '}${indent.trim() === '*' ? '' : '* '}${l}`).join('\n')}\n */\n`
    n++
    return doc + (declLine || '')
  })

  if (n && !dry) {
    fs.writeFileSync(file, src)
    changed++
  }
  if (n) console.log(`${dry ? '[dry] ' : ''}${file}: ${n} stubs rewritten`)
}
console.log(`files changed: ${changed}`)
