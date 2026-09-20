const _dbCache = new Map()

export async function fetchFirebaseDb(path) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  if (_dbCache.has(cleanPath)) {
    return _dbCache.get(cleanPath)
  }

  const promise = (async () => {
    const url = `https://luiskr-com.firebaseio.com/${cleanPath}.json`

    try {
      const res = await fetch(url)

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()

      const isNull = data === null || data === undefined

      const wrapper = isNull || typeof data !== 'object' ? {} : data

      return Object.assign(wrapper, {
        exists: () => !isNull,
        val: () => data,
      })
    } catch {
      return {
        exists: () => false,
        val: () => null,
      }
    }
  })()

  _dbCache.set(cleanPath, promise)

  return promise
}

