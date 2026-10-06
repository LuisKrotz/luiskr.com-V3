/**
 * @file jsx-transformer.js
 * Jest code transformer: converts JSX to h() calls synchronously
 * using rolldown/utils transformSync (same engine as Vite / oxc).
 * Handles .js/.jsx/.ts/.tsx — TypeScript sources are stripped and
 * transformed with lang 'ts'/'tsx'.
 *
 * Exports both `process` (sync, required by Jest) and `processAsync`
 * for compatibility.
 */

import { transformSync } from 'rolldown/utils'

const LANG_FOR = {
  '.js': 'jsx',
  '.jsx': 'jsx',
  '.ts': 'ts',
  '.tsx': 'tsx',
  '.mjs': 'jsx',
  '.mts': 'ts',
}

/** @type {import('@jest/transform').SyncTransformer} */
const transformer = {
  process(sourceText, sourcePath) {
    if (sourcePath.includes('/node_modules/')) {
      return { code: sourceText }
    }

    const ext = sourcePath.slice(sourcePath.lastIndexOf('.'))
    const lang = LANG_FOR[ext]

    if (!lang) {
      return { code: sourceText }
    }

    // oxc picks parser options from the filename extension — .js sources get
    // a .jsx alias so JSX parses in plain-js files (project convention).
    const filename = ext === '.js' ? `${sourcePath.slice(0, -3)}.jsx` : sourcePath

    const result = transformSync(filename, sourceText, {
      lang,
      jsx: { runtime: 'classic', pragma: 'h', pragmaFrag: 'Fragment' },
      // `import.meta.env` is a Vite compile-time global — under Jest it does
      // not exist, so map it to a runtime global tests can populate per-file
      // (undefined by default, which keeps every env check falsy as before).
      define: { 'import.meta.env': 'globalThis.__VITE_ENV__' },
    })

    if (result.errors && result.errors.length > 0) {
      const errMsg = result.errors.map((e) => e.message || String(e)).join('\n')
      throw new Error(`JSX transform failed for ${sourcePath}:\n${errMsg}`)
    }

    return { code: result.code, map: result.map }
  },

  async processAsync(sourceText, sourcePath) {
    return transformer.process(sourceText, sourcePath)
  },
}

export default transformer
