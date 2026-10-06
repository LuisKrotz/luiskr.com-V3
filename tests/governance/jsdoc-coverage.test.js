/**
 * @file jsdoc-coverage.test.js
 * @description Governance for AGENTS.md rule 20 — every exported declaration
 * in src/ must carry a JSDoc block, and every SCSS file must open with a
 * header comment explaining the UI surface it styles. Keeps the codebase
 * self-documenting for consumers, agents, and the generated docs/jsdocs site.
 */
import { readdirSync, readFileSync, statSync } from 'fs'
import path from 'path'
import { DOM_STRINGS } from '@/core/tokens/strings/dom.js'

const SRC = path.join(process.cwd(), DOM_STRINGS.SRC)

/** Recursively collects source files under `dir` matching `exts`. */
const collect = (dir, exts, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = path.join(dir, e)

    if (statSync(p).isDirectory()) collect(p, exts, out)
    else if (exts.some((x) => p.endsWith(x))) out.push(p)
  }

  return out
}

const CODE_FILES = collect(SRC, ['.ts', '.tsx', '.js'])
const SCSS_FILES = collect(SRC, ['.scss'])

// Exported declarations: `export [async|declare|default] (fn|class|const|…)`
const EXPORT_RE =
  /^export\s+(?:declare\s+)?(?:async\s+)?(?:default\s+)?(?:function|class|const|let|var|interface|type|enum)\s+[\w$]+/

describe('JSDoc coverage — every exported declaration is documented', () => {
  test('all src code files have JSDoc on every exported declaration', () => {
    const missing = []

    for (const file of CODE_FILES) {
      const lines = readFileSync(file, 'utf8').split('\n')

      lines.forEach((line, i) => {
        if (!EXPORT_RE.test(line)) return

        // Walk backwards past blank lines and `//` line comments (eslint
        // directives legitimately sit between a docblock and its decl), then
        // require the first substantive line to close a JSDoc block (`*/`).
        let j = i - 1

        while (j >= 0 && (/^\s*$/.test(lines[j]) || /^\s*\/\//.test(lines[j]))) j--

        if (j < 0 || !/\*\/\s*$/.test(lines[j])) {
          missing.push(`${path.relative(process.cwd(), file)}:${i + 1} ${line.trim().slice(0, 80)}`)
        }
      })
    }

    expect(missing).toEqual([])
  })

  test('every scss file opens with a header comment block', () => {
    const missing = []

    for (const file of SCSS_FILES) {
      const head = readFileSync(file, 'utf8').split('\n').slice(0, 12).join('\n')

      if (!/(\/\/|\/\*)/.test(head)) missing.push(path.relative(process.cwd(), file))
    }

    expect(missing).toEqual([])
  })
})
