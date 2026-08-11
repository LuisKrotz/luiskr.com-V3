import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyDeDr3LDdc34IDBAQc-6BiUOeI32_Hd7HI',
  authDomain: 'luiskr-com.firebaseapp.com',
  databaseURL: 'https://luiskr-com.firebaseio.com',
  projectId: 'luiskr-com',
  storageBucket: 'luiskr-com.appspot.com',
  messagingSenderId: '967717102790',
  appId: '1:967717102790:web:eea19f216fd097a08163c7',
  measurementId: 'G-B2CJGG5FS9',
}

export const app = initializeApp(firebaseConfig)

// Dynamic Auth loader (loaded only for Admin/CMS)
let _authInstance = null
let _authPromise = null

export async function getAuthInstance() {
  if (_authInstance) return _authInstance
  if (!_authPromise) {
    _authPromise = import('firebase/auth').then(({ getAuth }) => {
      _authInstance = getAuth(app)
      return _authInstance
    })
  }
  return await _authPromise
}

// Dynamic Database loader for CMS admin writes
let _dbInstance = null
let _dbPromise = null

export async function getDbInstance() {
  if (_dbInstance) return _dbInstance
  if (!_dbPromise) {
    _dbPromise = import('firebase/database').then(({ getDatabase }) => {
      _dbInstance = getDatabase(app)
      return _dbInstance
    })
  }
  return await _dbPromise
}

// Backward compatibility proxies
export const auth = new Proxy({}, {
  get(target, prop) {
    if (_authInstance) return _authInstance[prop]
    return undefined
  }
})

export const db = new Proxy({}, {
  get(target, prop) {
    if (_dbInstance) return _dbInstance[prop]
    return undefined
  }
})

export async function signInWithGoogle() {
  const auth = await getAuthInstance()
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  return await signInWithPopup(auth, provider)
}

export async function logoutUser() {
  const auth = await getAuthInstance()
  const { signOut } = await import('firebase/auth')
  return await signOut(auth)
}

export async function onAuthChange(callback) {
  const auth = await getAuthInstance()
  const { onAuthStateChanged } = await import('firebase/auth')
  return onAuthStateChanged(auth, callback)
}

const _fetchCache = new Map()

// Lightweight HTTP REST reader for database (zero WebSockets, zero unload listeners)
export async function fetchFirebaseDb(path) {
  const cleanPath = (path || '').toString().replace(/^\//, '')
  const url = `${firebaseConfig.databaseURL}/${cleanPath}.json`

  if (_fetchCache.has(url)) {
    return await _fetchCache.get(url)
  }

  const promise = (async () => {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      return {
        exists: () => data !== null && data !== undefined,
        val: () => data,
      }
    } catch (err) {
      console.warn('REST DB fetch failed, falling back to SDK', err)
      const { ref, child, get } = await import('firebase/database')
      const db = await getDbInstance()
      return await get(child(ref(db), cleanPath))
    }
  })()

  _fetchCache.set(url, promise)
  return await promise
}

export function clearDbCache() {
  _fetchCache.clear()
}
