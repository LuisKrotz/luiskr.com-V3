/**
 * @file media-convert/consts.ts — job phases, API route, poll cadence, types.
 */

import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'

/**
 * Scalar token `/api/media-convert` — the sole declaration site for this literal.
 */
export const API_BASE = '/api/media-convert'

// Job state machine: idle → uploading (per-file PUTs) → converting
// (server pipeline) → done | error. The render switches on this.
/**
 * phases.
 */
export const PHASE = Object.freeze({
  IDLE: 'idle',
  UPLOADING: 'uploading',
  CONVERTING: 'converting',
  DONE: 'done',
  ERROR: 'error',
})
/**
 * Numeric token — the sole declaration site for this value.
 */
export const POLL_MS = 800 // job-status poll cadence — fast enough for live progress, light on the dev server
/**
 * The mime hint constant.
 */
export const MIME_HINT = 'image/*,video/*,.mov,.mkv,.webm,.avi,.m4v,.heic,.avif,.tif,.tiff' // file-picker filter covering every format ffmpeg accepts
/**
 * The empty constant.
 */
export const EMPTY = CHAR_STRINGS.EMPTY

/**
 * Queues item.
 */
export interface QueueItem {
  file: File
  rel: string
}

/**
 * Type contract for JobResult — the shape consumers rely on.
 */
export interface JobResult {
  ok: boolean
  in: string
  outs?: string[]
  error?: string
}

/**
 * Type contract for JobStatus — the shape consumers rely on.
 */
export interface JobStatus {
  status?: string
  error?: string
  current?: string
  done?: number
  total?: number
  results?: JobResult[]
}
