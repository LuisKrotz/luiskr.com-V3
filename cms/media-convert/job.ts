/**
 * @file media-convert/job.ts — dev-server job lifecycle + actions.
 *
 * Pipeline: run() → createJob (POST /jobs) → uploadAll (PUT per file)
 * → startConvert (POST /jobs/:id/convert) → poll loop (GET /jobs/:id
 * every POLL_MS while the server reports running/uploading) → finish.
 * reset() tears down job + queue so a new batch starts clean.
 */

import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { NET_STRINGS } from '@core/tokens/strings/net.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import type { CmsMediaConverter } from './CmsMediaConverter.js'
import { API_BASE, PHASE, POLL_MS, type JobStatus } from './consts.js'

/**
 * Cancels the pending poll timer — called before every new poll schedule
 * and on reset so only one timer is ever armed.
 * @param host The CmsMediaConverter element.
 */
export function stopPolling(host: CmsMediaConverter) {
  if (host._pollTimer) {
    clearTimeout(host._pollTimer)
    host._pollTimer = null
  }
}

/**
 * POSTs an empty job to the dev server and stores the returned id on the
 * host — every subsequent request hangs off host.jobId.
 * @param host The CmsMediaConverter element.
 * @throws Error with the server's message when the job can't be created.
 */
export async function createJob(host: CmsMediaConverter) {
  const res = await fetch(`${API_BASE}/jobs`, { method: NET_STRINGS.METHOD_POST })
  if (!res.ok) throw new Error(await errText(res, 'could not create job'))
  const { id } = (await res.json()) as { id: string }
  host.jobId = id
}

/**
 * PUTs every queued file sequentially — the dev server is single-purpose
 * and serial uploads keep progress (`host.uploaded`) truthful. Re-renders
 * after each file so the progress counter animates live.
 * @param host The CmsMediaConverter element.
 * @throws Error naming the failed file when a PUT is rejected.
 */
export async function uploadAll(host: CmsMediaConverter) {
  host.uploaded = 0

  for (const item of host.queue) {
    const res = await fetch(`${API_BASE}/jobs/${host.jobId}/files`, {
      method: NET_STRINGS.METHOD_PUT,
      headers: {
        [NET_STRINGS.HEADER_FILE_PATH]: encodeURIComponent(item.rel),
        [NET_STRINGS.HEADER_CONTENT_TYPE]: NET_STRINGS.MIME_OCTET_STREAM,
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
 * Kicks off the server-side conversion and starts the poll loop. A 202
 * counts as success (job accepted, still queueing); any other failure
 * throws.
 * @param host The CmsMediaConverter element.
 * @throws Error when the server refuses to start the conversion.
 */
export async function startConvert(host: CmsMediaConverter) {
  const res = await fetch(`${API_BASE}/jobs/${host.jobId}/convert`, {
    method: NET_STRINGS.METHOD_POST,
  })
  if (!res.ok && res.status !== 202)
    throw new Error(await errText(res, 'conversion failed to start'))
  host._poll()
}

/**
 * One poll tick: fetches job status, re-arms the timer while the server
 * reports running/uploading, and finishes (or errors) on a terminal
 * state. A failed GET is treated as server loss — the phase flips to
 * ERROR rather than polling forever.
 * @param host The CmsMediaConverter element.
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

  if (
    host.status.status === NET_STRINGS.JOB_RUNNING ||
    host.status.status === NET_STRINGS.JOB_UPLOADING
  ) {
    host._updateDom()
    host._bindEvents()
    host._pollTimer = setTimeout(() => host._poll(), POLL_MS)
    return
  }

  host._finish()
}

/**
 * Terminal handler — counts per-file results, sets DONE when at least one
 * converted (ERROR otherwise), notifies via toast AND the OS Notification
 * API (long jobs may run while the tab is backgrounded), then re-renders.
 * @param host The CmsMediaConverter element.
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
 * Fires an OS-level Notification when permission is already granted —
 * silent no-op otherwise (the in-app toast always runs too, so this is a
 * progressive enhancement for backgrounded tabs).
 * @param title Notification title.
 * @param body Notification body text.
 */
export function systemNotify(title: string, body: string): void {
  try {
    if (typeof Notification === TYPE_STRINGS.UNDEFINED) return
    if (Notification.permission === STATE_STRINGS.GRANTED) {
      new Notification(title, { body })
    }
  } catch {
    // Notification API unavailable (e.g. insecure context) — toast still fires
  }
}

/**
 * Requests Notification permission up front (during run()) so the
 * completion notification can fire later — no-op unless the permission
 * is still 'default' (never re-prompts a denied user).
 */
export async function askNotifyPermission() {
  try {
    if (
      typeof Notification !== TYPE_STRINGS.UNDEFINED &&
      Notification.permission === STATE_STRINGS.DEFAULT
    ) {
      await Notification.requestPermission()
    }
  } catch {
    /* permission prompt unavailable */
  }
}

/**
 * DELETEs the job on the dev server (cleanup of uploaded tmp files) then
 * clears host.jobId — a missing job is tolerated (idempotent teardown).
 * @param host The CmsMediaConverter element.
 */
export async function deleteJob(host: CmsMediaConverter) {
  try {
    if (host.jobId)
      await fetch(`${API_BASE}/jobs/${host.jobId}`, { method: NET_STRINGS.METHOD_DELETE })
  } catch {
    /* job may already be gone */
  }
  host.jobId = null
}

/**
 * Extracts the server's `error` field from a JSON error body; falls back
 * to the given message — or a dev-server hint on 404 (the API only exists
 * under the dev middleware, so a 404 there means "not running dev").
 * @param res The failed Response.
 * @param fallback Message used when the body has no `error`.
 * @returns The human-readable error.
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
 * Full pipeline orchestrator: create → upload → convert, flipping
 * host.phase at each stage and re-rendering. Errors land on the ERROR
 * phase with the server's message so the UI shows the real failure.
 * @param host The CmsMediaConverter element.
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
 * Returns the component to its initial state — stops polling, deletes
 * the remote job, clears queue/status/counters, and re-renders IDLE.
 * @param host The CmsMediaConverter element.
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
