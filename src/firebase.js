import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

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
export const db = getDatabase(app)
export const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

export async function signInWithGoogle() {
  return await signInWithPopup(auth, googleProvider)
}

export async function logoutUser() {
  return await signOut(auth)
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}
