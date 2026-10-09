/**
 * @file starfield/star-dossier.test.js
 * @description Lazy dossier loader — fetchDossier caches per body id and
 * resolves null on HTTP/parse failures; loadDossier fills the component
 * panel and ignores stale resolutions; prefetchDossier warms the cache
 * without touching the host.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'

import { fetchDossier, loadDossier, prefetchDossier } from '../../star/dossier.js'
import { getDevLog, clearDevLog } from '@core/devlog.js'
import { LOG_LEVELS } from '@core/tokens/data/log.js'

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

const jsonRes = (body) => ({ ok: true, json: async () => body })

let origFetch

beforeEach(() => {
  origFetch = globalThis.fetch
  clearDevLog()
})

afterEach(() => {
  globalThis.fetch = origFetch
})

describe('star dossier loader', () => {
  test('fetchDossier resolves the payload and caches per id', async () => {
    const body = { id: 'ceres', name: 'Ceres' }
    const fetchMock = jest.fn(async () => jsonRes(body))

    globalThis.fetch = fetchMock

    const first = await fetchDossier('ceres')
    const second = await fetchDossier('ceres')

    expect(first).toBe(body)
    expect(second).toBe(body)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  test('fetchDossier resolves null on a non-ok response', async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 404 }))

    expect(await fetchDossier('pluto')).toBeNull()
    expect(getDevLog().filter((e) => e.level === LOG_LEVELS.WARN).length).toBeGreaterThan(0)
  })

  test('fetchDossier resolves null when fetch rejects', async () => {
    globalThis.fetch = jest.fn(async () => {
      throw new Error('offline')
    })

    expect(await fetchDossier('sirius')).toBeNull()
    expect(getDevLog().filter((e) => e.level === LOG_LEVELS.ERROR).length).toBeGreaterThan(0)
  })

  test('loadDossier flags loading then publishes the dossier', async () => {
    const body = { id: 'vega', name: 'Vega' }

    globalThis.fetch = jest.fn(async () => jsonRes(body))

    const c = { _updateDom: jest.fn() }

    loadDossier(c, 'vega')

    expect(c._selectedId).toBe('vega')
    expect(c._dossierLoading).toBe(true)
    expect(c._dossier).toBeNull()
    expect(c._updateDom).toHaveBeenCalled()

    await flush()

    expect(c._dossierLoading).toBe(false)
    expect(c._dossier).toBe(body)
  })

  test('loadDossier drops a stale resolution after a newer select', async () => {
    const bodies = {
      trappist: { id: 'trappist-1', name: 'TRAPPIST-1' },
      betel: { id: 'betelgeuse', name: 'Betelgeuse' },
    }
    let release

    globalThis.fetch = jest.fn(
      (url) =>
        new Promise((resolve) => {
          if (String(url).includes('trappist')) release = () => resolve(jsonRes(bodies.trappist))
          else resolve(jsonRes(bodies.betel))
        })
    )

    const c = { _updateDom: jest.fn() }

    loadDossier(c, 'trappist-1')
    loadDossier(c, 'betelgeuse')
    release()
    await flush()

    expect(c._dossier).toBe(bodies.betel)
    expect(c._selectedId).toBe('betelgeuse')
  })

  test('prefetchDossier warms the cache so select resolves instantly', async () => {
    const body = { id: 'helix-nebula', name: 'Helix Nebula' }
    const fetchMock = jest.fn(async () => jsonRes(body))

    globalThis.fetch = fetchMock

    prefetchDossier('helix-nebula')
    await flush()

    expect(fetchMock).toHaveBeenCalledTimes(1)

    const c = { _updateDom: jest.fn() }

    loadDossier(c, 'helix-nebula')
    await flush()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(c._dossier).toBe(body)
  })
})
