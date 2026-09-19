/**
 * @file jsx-transformer.js
 * Jest code transformer: converts JSX to h() calls synchronously
 * using rolldown/utils transformSync (same engine as Vite / oxc).
 *
 * Exports both `process` (sync, required by Jest) and `processAsync`
 * for compatibility.
 */

import { transformSync } from 'rolldown/utils'

/** @type {import('@jest/transform').SyncTransformer} */
const transformer = {
  process(sourceText, sourcePath) {
    if (sourcePath.includes('/node_modules/')) {
      return { code: sourceText }
    }
    if (!sourcePath.endsWith('.js') && !sourcePath.endsWith('.jsx')) {
      return { code: sourceText }
    }

    const filename = sourcePath.endsWith('.js')
      ? sourcePath.slice(0, -3) + '.jsx'
      : sourcePath

    const result = transformSync(filename, sourceText, {
      lang: 'jsx',
      jsx: { runtime: 'classic', pragma: 'h', pragmaFrag: 'Fragment' },
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
