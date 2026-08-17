export async function fetchFirebaseDb(path) {
  const url = `https://luiskr-com.firebaseio.com/${path}.json`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch {
    return null
  }
}
