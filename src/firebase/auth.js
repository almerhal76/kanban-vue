import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './config'

// Validate Firebase instances
if (!auth) {
  throw new Error('Firebase Auth not initialized. Please check your Firebase configuration.')
}

if (!db) {
  throw new Error('Firestore not initialized. Please check your Firebase configuration.')
}

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export const registerUser = async (email, password, userData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // Simpan data user ke Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    role: userData.role || 'viewer', // default role
    name: userData.name,
    createdAt: new Date()
  })

  return user
}

export const logoutUser = async () => {
  await signOut(auth)
}

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}

export const getUserRole = async (uid) => {
  const userDoc = await getDoc(doc(db, 'users', uid))
  if (userDoc.exists()) {
    return userDoc.data().role
  }
  return null
}