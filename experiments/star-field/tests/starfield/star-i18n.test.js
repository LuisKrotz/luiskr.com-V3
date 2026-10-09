/**
 * @file starfield/star-i18n.test.js
 * @description Star-field label loading — the SWR fetch of
 * pages/star-field for the current locale, the English fallback on a
 * locale miss, the no-snapshot no-op, the rejection arm, and
 * applyStarTranslations' null-tolerant assignment + re-render.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'

const dbData = { title: 'Star Field', hint: 'Drag to explore' }
const fetchFirebaseDb = jest.fn(async () => ({ exists: () => true, val: () => dbData }))

jest.unstable_mockModule('@core/utils/data/db.js', () => ({
  fetchFirebaseDb,
}))

const { loadStarTranslations, applyStarTranslations } = await import('../../star/i18n.js')
const store = (await import('@core/store.js')).default

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

beforeEach(() => {
  fetchFirebaseDb.mockClear()
  fetchFirebaseDb.mockImplementation(async () => ({ exists: () => true, val: () => dbData }))
})

describe('star i18n', () => {
  test('fetches the current locale node and applies it', async () => {
    const c = { _applyTranslations: jest.fn(), _lastLocale: null }

    loadStarTranslations(c)
    await flush()

    expect(fetchFirebaseDb).toHaveBeenCalled()
    expect(c._applyTranslations).toHaveBeenCalledWith(dbData)
    expect(c._lastLocale).toBe(store.getters.getlang().locale)
  })

  test('falls back to the English node on a locale miss', async () => {
    let calls = 0

    fetchFirebaseDb.mockImplementation(async () => {
      calls += 1

      return calls === 1 ? { exists: () => false } : { exists: () => true, val: () => dbData }
    })

    const c = { _applyTranslations: jest.fn() }

    loadStarTranslations(c)
    await flush()

    expect(fetchFirebaseDb).toHaveBeenCalledTimes(2)
    expect(c._applyTranslations).toHaveBeenCalledWith(dbData)
  })

  test('applies nothing when the English fallback is missing too', async () => {
    fetchFirebaseDb.mockImplementation(async () => ({ exists: () => false }))

    const c = { _applyTranslations: jest.fn() }

    loadStarTranslations(c)
    await flush()

    expect(c._applyTranslations).not.toHaveBeenCalled()
  })

  test('a falsy locale in the lang state falls back to English', async () => {
    const spy = jest
      .spyOn(store.getters, 'getlang')
      .mockReturnValue({ locale: null, database: '', pagesPath: '' })

    const c = { _applyTranslations: jest.fn() }

    loadStarTranslations(c)
    await flush()

    expect(c._applyTranslations).toHaveBeenCalledWith(dbData)

    spy.mockRestore()
  })

  test('a rejected fetch is logged and swallowed', async () => {
    fetchFirebaseDb.mockImplementation(async () => Promise.reject(new Error('db down')))

    const c = { _applyTranslations: jest.fn() }

    expect(() => loadStarTranslations(c)).not.toThrow()
    await flush()

    expect(c._applyTranslations).not.toHaveBeenCalled()
  })

  test('applyStarTranslations assigns the node and re-renders', () => {
    const c = { _updateDom: jest.fn(), translations: null }

    applyStarTranslations(c, dbData)

    expect(c.translations).toBe(dbData)
    expect(c._updateDom).toHaveBeenCalled()

    applyStarTranslations(c, null)

    expect(c.translations).toBeNull()
  })
})
