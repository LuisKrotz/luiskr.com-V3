/**
 * @file docs-schema-updatejsonld-clear-arm.test.js
 * @description Split from docs-schema.test.js — covers the "updateJsonLd clear arm" describe.
 */
import { updateJsonLd } from '@core/utils/schema.js'
import { SCHEMA_STRINGS } from '@core/tokens/strings/schema.js'

const _DOC_PAGE = { name: 'guide.md', type: 'file', mtime: '2026-01-02T03:04:05.000Z' }
const _DIR_PAGE = { name: 'architecture', type: 'dir' }

describe('updateJsonLd clear arm', () => {
  test('null removes the graph node; repeated null is a no-op', () => {
    updateJsonLd({ '@type': 'One' })

    const el = document.getElementById(SCHEMA_STRINGS.JSON_LD_SCRIPT_ID)

    expect(el).not.toBeNull()

    updateJsonLd(null)

    expect(document.getElementById(SCHEMA_STRINGS.JSON_LD_SCRIPT_ID)).toBeNull()

    // No node present — the optional-chain null arm.
    expect(() => updateJsonLd(undefined)).not.toThrow()
  })

  test('SSR guard — no document means no DOM work at all', () => {
    const origDoc = globalThis.document

    delete globalThis.document

    expect(() => updateJsonLd({ '@type': 'One' })).not.toThrow()
    expect(() => updateJsonLd(null)).not.toThrow()

    globalThis.document = origDoc
  })
})
