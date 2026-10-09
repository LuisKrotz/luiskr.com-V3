/**
 * @file tests/star-field.test.js
 * @description Module integrity suite for the star-field experiment —
 * barrel surface, catalog↔dossier consistency (every catalog body must
 * ship a `public/data/<id>.json`, and every dossier a catalog entry),
 * group ordering and dossier-shape validation against the real files.
 * Tests are JavaScript by design (Rule 17).
 */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { SF_GROUPS } from '@core/tokens/starfield/kinds.js'

const moduleRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = path.join(moduleRoot, 'public', 'data')

const DOSSIER_KEYS = ['id', 'name', 'kind', 'tagline', 'facts', 'history', 'source']

describe('star-field module', () => {
  it('exports its public surface', async () => {
    const mod = await import('../index.js')

    expect(mod.StarField).toBeDefined()
    expect(mod.StarFieldEngine).toBeDefined()
    expect(Array.isArray(mod.SF_CATALOG)).toBe(true)
    expect(mod.SF_GROUP_ORDER).toBeDefined()
    expect(typeof mod.sfCatalogByGroup).toBe('function')
  })

  it('registers the <view-star-field> custom element', async () => {
    await import('../index.js')

    expect(customElements.get(VIEW_TAGS.VIEW_STAR_FIELD)).toBeDefined()
  })

  it('catalog bodies each ship a dossier JSON, and vice versa', async () => {
    const { SF_CATALOG } = await import('../engine/catalog.js')

    const files = new Set(readdirSync(dataDir).filter((f) => f.endsWith('.json')))

    for (const def of SF_CATALOG) {
      const file = `${def.id}.json`

      expect(files.has(file)).toBe(true)

      files.delete(file)
    }

    // Every dossier on disk must be reachable through the catalog — an
    // orphan JSON would never lazy-load.
    expect([...files]).toEqual([])
  })

  it('dossier files carry the full SFDossier shape', async () => {
    const { SF_CATALOG } = await import('../engine/catalog.js')

    for (const def of SF_CATALOG) {
      const dossier = JSON.parse(readFileSync(path.join(dataDir, `${def.id}.json`), 'utf8'))

      for (const key of DOSSIER_KEYS) {
        expect(dossier[key]).toBeDefined()
      }

      expect(dossier.id).toBe(def.id)
      expect(dossier.kind).toBe(def.kind)
      expect(Array.isArray(dossier.facts)).toBe(true)
      expect(dossier.facts.length).toBeGreaterThan(0)
      expect(typeof dossier.source).toBe('string')
      expect(dossier.source.length).toBeGreaterThan(0)
    }
  })

  it('groups every catalog body and orders the drawer groups', async () => {
    const { SF_CATALOG, SF_GROUP_ORDER, sfCatalogByGroup } = await import('../engine/catalog.js')

    const groups = sfCatalogByGroup()

    let total = 0

    for (const [key, defs] of groups) {
      expect(Object.values(SF_GROUPS)).toContain(key)

      total += defs.length
    }

    expect(total).toBe(SF_CATALOG.length)

    for (const key of SF_GROUP_ORDER) {
      expect(groups.has(key)).toBe(true)
    }
  })
})
