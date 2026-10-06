/**
 * @file media-convert/job.ts — dev-server job lifecycle + actions.
 */

import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import type { CmsMediaConverter } from './CmsMediaConverter.js'
import { API_BASE, PHASE, POLL_MS, type JobStatus } from './consts.js'

/**
 * Stops polling.
 * @param host — the host component
 */
export function stopPolling(host: CmsMediaConverter) {
  if (host._pollTimer) {
    clearTimeout(host._pollTimer)
    host._pollTimer = null
  }
}

/**
 * Creates job.
 * @param host — the host component
 */
export async function createJob(host: CmsMediaConverter) {
  const res = await fetch(`${API_BASE}/jobs`, { method: 'POST' })
  if (!res.ok) throw new Error(await errText(res, 'could not create job'))
  const { id } = (await res.json()) as { id: string }
  host.jobId = id
}

/**
 * The uploadAll value.
 * @param host — the host component
 */
export async function uploadAll(host: CmsMediaConverter) {
  host.uploaded = 0

  for (const item of host.queue) {
    const res = await fetch(`${API_BASE}/jobs/${host.jobId}/files`, {
      method: 'PUT',
      headers: {
        'x-file-path': encodeURIComponent(item.rel),
        'content-type': 'application/octet-stream',
      },
      body: item.file,
    })

    if (!res.ok) throw new Error(await errText(res, `upload failed: ${item.rel}`))

    host.uploaded++
    host._updateDom()
    host._bindEvents()
  }
}

/**
 * Starts convert.
 * @param host — the host component
 */
export async function startConvert(host: CmsMediaConverter) {
  const res = await fetch(`${API_BASE}/jobs/${host.jobId}/convert`, { method: 'POST' })
  if (!res.ok && res.status !== 202)
    throw new Error(await errText(res, 'conversion failed to start'))
  host._poll()
}

/**
 * The poll value.
 * @param host — the host component
 */
export async function poll(host: CmsMediaConverter) {
  host._stopPolling()

  const res = await fetch(`${API_BASE}/jobs/${host.jobId}`)
  if (!res.ok) {
    host.phase = PHASE.ERROR
    host.error = 'lost contact with the conversion server'
    host._updateDom()
    return
  }

  host.status = (await res.json()) as JobStatus

  if (host.status.status === 'running' || host.status.status === 'uploading') {
    host._updateDom()
    host._bindEvents()
    host._pollTimer = setTimeout(() => host._poll(), POLL_MS)
    return
  }

  host._finish()
}

/**
 * The finish value.
 * @param host — the host component
 */
export function finish(host: CmsMediaConverter) {
  const okCount = (host.status?.results || []).filter((r) => r.ok).length
  const failCount = (host.status?.results || []).filter((r) => !r.ok).length

  host.phase = okCount > 0 ? PHASE.DONE : PHASE.ERROR
  host.error =
    okCount > 0 ? CHAR_STRINGS.EMPTY : host.status?.error || 'no files could be converted'

  const msg = `Conversion finished: ${okCount} converted${failCount ? `, ${failCount} failed` : ''}`
  host._notify(msg)
  systemNotify('Media conversion complete', msg)

  host._updateDom()
  host._bindEvents()
}

/**
 * The systemNotify value.
 * @param title — the value
 * @param body — the value
 */
export function systemNotify(title: string, body: string): void {
  try {
    if (typeof Notification === TYPE_STRINGS.UNDEFINED) return
    if (Notification.permission === 'granted') {
      new Notification(title, { body })
    }
  } catch {
    // Notification API unavailable (e.g. insecure context) — toast still fires
  }
}

/**
 * The askNotifyPermission value.
 */
export async function askNotifyPermission() {
  try {
    if (typeof Notification !== TYPE_STRINGS.UNDEFINED && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  } catch {
    /* permission prompt unavailable */
  }
}

/**
 * Deletes job.
 * @param host — the host component
 */
export async function deleteJob(host: CmsMediaConverter) {
  try {
    if (host.jobId) await fetch(`${API_BASE}/jobs/${host.jobId}`, { method: 'DELETE' })
  } catch {
    /* job may already be gone */
  }
  host.jobId = null
}

/**
 * The errText value.
 * @param res — the value
 * @param fallback — the value
 * @returns Promise<string>
 */
export async function errText(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json()
    return data.error || fallback
  } catch {
    return res.status === 404 ? 'media converter API unavailable (dev server only)' : fallback
  }
}

/**
 * The run value.
 * @param host — the host component
 */
export async function run(host: CmsMediaConverter) {
  if (!host.queue.length) return

  host.error = CHAR_STRINGS.EMPTY
  host.phase = PHASE.UPLOADING
  host._updateDom()
  host._askNotifyPermission()

  try {
    await host._createJob()
    await host._uploadAll()

    host.phase = PHASE.CONVERTING
    host._updateDom()
    await host._startConvert()
  } catch (err) {
    host.phase = PHASE.ERROR
    host.error = String((err as Error).message || err)
    host._updateDom()
    host._bindEvents()
  }
}

/**
 * Resets.
 * @param host — the host component
 */
export function reset(host: CmsMediaConverter) {
  host._stopPolling()
  host._deleteJob()
  host.queue = []
  host.status = null
  host.uploaded = 0
  host.phase = PHASE.IDLE
  host.error = CHAR_STRINGS.EMPTY
  host._updateDom()
  host._bindEvents()
}
