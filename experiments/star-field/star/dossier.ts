/**
 * @file star/dossier.ts
 * @description Lazy dossier loader for star-field bodies — fetches
 * `public/data/<id>.json` on selection or camera approach, caches per
 * body id, and pushes the resolved dossier into the component so the
 * info panel re-renders. Approach prefetches fill the cache only, so a
 * later select never hits the network.
 */
import { SF_DATA_BASE } from '@core/tokens/starfield/textures.js'
import type { SFDossier } from '../engine/types.js'
import type { StarField } from '../StarField.js'
import { devError, devWarn } from '@core/devlog.js'

/** In-flight + resolved dossier cache — body id → dossier (or promise). */
const _cache = new Map<string, Promise<SFDossier | null>>()

/**
 * Fetches one dossier JSON — cached per id; a failed fetch resolves null
 * (the panel falls back to the catalog name) rather than throwing.
 * @param id Body id matching `public/data/<id>.json`.
 * @returns The dossier or null on fetch/parse failure.
 */
export function fetchDossier(id: string): Promise<SFDossier | null> {
  let pending = _cache.get(id)

  if (!pending) {
    pending = fetch(`${SF_DATA_BASE}/${id}.json`)
      .then((res) => {
        if (!res.ok) {
          devWarn('[StarField] dossier fetch failed:', id, res.status)

          return null
        }

        return res.json() as Promise<SFDossier>
      })
      .catch((e) => {
        devError('[StarField] dossier error:', id, e)

        return null
      })

    _cache.set(id, pending)
  }

  return pending
}

/**
 * Selection path — marks the panel loading, prefetches, then assigns the
 * resolved dossier only when the selection is still current (a fast
 * second select must not have a slow first response overwrite it).
 * @param c The StarField component.
 * @param id Selected body id.
 */
export function loadDossier(c: StarField, id: string): void {
  c._selectedId = id
  c._dossierLoading = true
  c._dossier = null

  c._updateDom()

  fetchDossier(id).then((dossier) => {
    if (c._selectedId !== id) return

    c._dossierLoading = false
    c._dossier = dossier

    c._updateDom()
  })
}

/**
 * Approach path — warms the cache without touching the panel; the select
 * path later resolves instantly from `_cache`.
 * @param id Approached body id.
 */
export function prefetchDossier(id: string): void {
  fetchDossier(id)
}
