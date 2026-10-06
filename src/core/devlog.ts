/**
 * @file devlog.ts
 * @description Zero-console diagnostics sink (project rule: no console.* in
 * src). warn/error/info call sites append {ts, level, parts} to a capped
 * ring buffer instead of printing — enough signal for postmortems without
 * polluting the production console. Inspect in devtools via
 * `__lkDevLog()`; tests read the same buffer through `getDevLog()`.
 */

import { DEV_LOG, LOG_LEVELS } from './tokens/data/log.js'

/** One buffered diagnostic entry. */
export interface DevLogEntry {
  /** Unix-ms timestamp of the call. */
  t: number
  /** 'warn' | 'error' | 'info' — from LOG_LEVELS. */
  level: string
  /** The original call arguments, unserialized. */
  parts: unknown[]
}

/** Ring buffer of recent diagnostics (bounded by DEV_LOG.MAX_ENTRIES). */
const _entries: DevLogEntry[] = []

/**
 * Appends an entry, evicting the oldest when the buffer is full.
 * @param level — LOG_LEVELS value
 * @param parts — original call arguments
 */
const push = (level: string, parts: unknown[]): void => {
  _entries.push({ t: Date.now(), level, parts })

  if (_entries.length > DEV_LOG.MAX_ENTRIES) _entries.shift()
}

/**
 * Buffers a warning diagnostic.
 * @param parts — warning detail
 */
export const devWarn = (...parts: unknown[]): void => push(LOG_LEVELS.WARN, parts)

/**
 * Buffers an error diagnostic.
 * @param parts — error detail
 */
export const devError = (...parts: unknown[]): void => push(LOG_LEVELS.ERROR, parts)

/**
 * Buffers an info diagnostic.
 * @param parts — info detail
 */
export const devInfo = (...parts: unknown[]): void => push(LOG_LEVELS.INFO, parts)

/**
 * Returns a copy of the buffered entries (oldest → newest).
 * @returns buffered diagnostics
 */
export const getDevLog = (): DevLogEntry[] => _entries.slice()

/** Empties the buffer — used by tests to isolate assertions. */
export const clearDevLog = (): void => {
  _entries.length = 0
}

// Devtools handle: `__lkDevLog()` in the console dumps the buffer without
// this module ever touching console.* itself.
;(globalThis as Record<string, unknown>)[DEV_LOG.GLOBAL_KEY] = getDevLog
