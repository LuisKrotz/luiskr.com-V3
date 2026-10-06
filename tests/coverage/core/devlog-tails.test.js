/**
 * @file devlog-tails.test.js
 * @description Coverage tails for src/core/devlog.ts — the zero-console
 * diagnostics sink (project rule 12). Asserts level tagging, ring-buffer
 * eviction, copy-on-read, the devtools global handle, and clearDevLog.
 */
import { describe, test, expect } from '@jest/globals'
import {
  devWarn,
  devError,
  devInfo,
  getDevLog,
  clearDevLog,
} from '@/core/devlog.js'
import { DEV_LOG, LOG_LEVELS } from '@/core/tokens/data/log.js'

describe('devlog', () => {
  test('buffers entries with level + timestamp + parts', () => {
    clearDevLog()
    devWarn('w1')
    devError('e1')
    devInfo('i1')

    const entries = getDevLog()

    expect(entries).toHaveLength(3)
    expect(entries.map((e) => e.level)).toEqual([
      LOG_LEVELS.WARN,
      LOG_LEVELS.ERROR,
      LOG_LEVELS.INFO,
    ])
    expect(entries[0].parts).toEqual(['w1'])
    expect(entries.every((e) => typeof e.t === 'number')).toBe(true)
  })

  test('evicts the oldest entry past MAX_ENTRIES', () => {
    clearDevLog()

    for (let i = 0; i < DEV_LOG.MAX_ENTRIES + 2; i++) devInfo(i)

    const entries = getDevLog()

    expect(entries).toHaveLength(DEV_LOG.MAX_ENTRIES)
    expect(entries[0].parts).toEqual([2])
  })

  test('getDevLog returns a copy — mutating it does not touch the buffer', () => {
    clearDevLog()
    devWarn('x')

    const copy = getDevLog()
    copy.push({ t: 0, level: LOG_LEVELS.ERROR, parts: [] })
    copy.length = 0

    expect(getDevLog()).toHaveLength(1)
  })

  test('clearDevLog empties the buffer', () => {
    devError('y')
    clearDevLog()

    expect(getDevLog()).toEqual([])
  })

  test('exposes a devtools handle on globalThis', () => {
    const handle = globalThis[DEV_LOG.GLOBAL_KEY]

    expect(typeof handle).toBe('function')
    expect(handle()).toEqual(getDevLog())
  })
})
