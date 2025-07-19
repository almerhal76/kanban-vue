import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Konfigurasi lama yang membaca dari .env (bisa Anda aktifkan kembali nanti)
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   ...(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID && {
//     measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
//   })
// }

// --- KONFIGURASI BARU ---
// Menggunakan konfigurasi baru yang Anda berikan.
const firebaseConfig = {
  apiKey: "AIzaSyCxpejk2TihmLbB_faV7-718tdDZUmeVE4",
  authDomain: "kanban-eabea.firebaseapp.com",
  projectId: "kanban-eabea",
  storageBucket: "kanban-eabea.firebasestorage.app",
  messagingSenderId: "1047158886576",
  appId: "1:1047158886576:web:571e84071ceda5e22d6b75",
  measurementId: "G-DT643D9KT3"
};



// Debug logging untuk memastikan konfigurasi terbaca
console.log('🔥 Firebase Config Debug:')
console.log('API Key:', firebaseConfig.apiKey ? '✅ Set' : '❌ Missing')
console.log('Auth Domain:', firebaseConfig.authDomain ? '✅ Set' : '❌ Missing')
console.log('Project ID:', firebaseConfig.projectId ? '✅ Set' : '❌ Missing')
console.log('Storage Bucket:', firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing')
console.log('Messaging Sender ID:', firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing')
console.log('App ID:', firebaseConfig.appId ? '✅ Set' : '❌ Missing')

// Validasi konfigurasi
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('❌ Firebase configuration is incomplete!')
  console.error('Please check your .env file and make sure all Firebase variables are set.')
}

// Validate required config before initialization
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
const missingFields = requiredFields.filter(field => !firebaseConfig[field])

if (missingFields.length > 0) {
  console.error('❌ Missing Firebase configuration fields:', missingFields)
  throw new Error(`Firebase configuration incomplete. Missing: ${missingFields.join(', ')}`)
}

let app, db, auth

try {
  console.log('🔥 Initializing Firebase with config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
  })

  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  auth = getAuth(app)

  console.log('✅ Firebase initialized successfully')
  console.log('✅ Auth instance created:', !!auth)
  console.log('✅ Firestore instance created:', !!db)
} catch (error) {
  console.error('❌ Firebase initialization failed:', error)
  console.error('Config used:', firebaseConfig)
  throw error
}

export { db, auth }
export default app