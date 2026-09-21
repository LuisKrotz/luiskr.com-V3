import { STRINGS, STORAGE_KEYS } from '../core/constants.js'

const _dbCache = new Map()

export const fetchFirebaseDb = async (path) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  if (_dbCache.has(cleanPath)) {
    return _dbCache.get(cleanPath)
  }

  const promise = (async () => {
    const url = `https://luiskr-com.firebaseio.com/${cleanPath}.json`

    let cachedData = null

    try {
      if (typeof localStorage !== STRINGS.UNDEFINED) {
        const raw = localStorage.getItem(STORAGE_KEYS.FB_CACHE_PREFIX + cleanPath)

        if (raw) cachedData = JSON.parse(raw)
      }
    } catch {
      // Storage unavailable fallback
    }

    try {
      const res = await fetch(url)

      if (!res.ok) {
        if (cachedData !== null) {
          const wrapper = typeof cachedData !== STRINGS.OBJECT ? {} : cachedData

          return Object.assign(wrapper, {
            exists: () => true,
            val: () => cachedData,
          })
        }

        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()

      try {
        if (typeof localStorage !== STRINGS.UNDEFINED && data !== null && data !== undefined) {
          localStorage.setItem(STORAGE_KEYS.FB_CACHE_PREFIX + cleanPath, JSON.stringify(data))
        }
      } catch {
        // Quota exceeded fallback
      }

      const isNull = data === null || data === undefined

      const wrapper = isNull || typeof data !== STRINGS.OBJECT ? {} : data

      return Object.assign(wrapper, {
        exists: () => !isNull,
        val: () => data,
      })
    } catch {
      if (cachedData !== null) {
        const wrapper = typeof cachedData !== STRINGS.OBJECT ? {} : cachedData

        return Object.assign(wrapper, {
          exists: () => true,
          val: () => cachedData,
        })
      }

      return {
        exists: () => false,
        val: () => null,
      }
    }
  })()

  _dbCache.set(cleanPath, promise)

  return promise
}

