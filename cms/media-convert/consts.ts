/**
 * @file media-convert/consts.ts — job phases, API route, poll cadence, types.
 */

import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'

/**
 * Dev-server API mount point for the conversion endpoints — sole
 * declaration site for this literal.
 */
export const API_BASE = '/api/media-convert'

/**
 * Job state machine: idle → uploading (per-file PUTs) → converting
 * (server pipeline) → done | error. The component render switches on this.
 */
export const PHASE = Object.freeze({
  IDLE: 'idle',
  UPLOADING: 'uploading',
  CONVERTING: 'converting',
  DONE: 'done',
  ERROR: 'error',
})

/** Job-status poll cadence — fast enough for live progress, light on the dev server. */
export const POLL_MS = 800

/** File-picker accept filter covering every input format ffmpeg accepts. */
export const MIME_HINT = 'image/*,video/*,.mov,.mkv,.webm,.avi,.m4v,.heic,.avif,.tif,.tiff'

/** Re-export of the shared empty-string token for this module's API. */
export const EMPTY = CHAR_STRINGS.EMPTY

/** One queued upload — the File blob plus its job-relative path. */
export interface QueueItem {
  /** The picked File payload (PUT body). */
  file: File
  /** Path relative to the job root — sent as the x-file-path header. */
  rel: string
}

/** Per-file outcome reported by the conversion server. */
export interface JobResult {
  /** Whether this file converted successfully. */
  ok: boolean
  /** The input path the result corresponds to. */
  in: string
  /** Output artifact paths when ok. */
  outs?: string[]
  /** Error message when !ok. */
  error?: string
}

/** Job-status payload polled from GET /jobs/:id. */
export interface JobStatus {
  /** Server phase string ('running'|'uploading'|terminal). */
  status?: string
  /** Server-side error message when failed. */
  error?: string
  /** Currently-processing file path (progress display). */
  current?: string
  /** Files completed so far. */
  done?: number
  /** Total files in the job. */
  total?: number
  /** Per-file results once the job settles. */
  results?: JobResult[]
}
