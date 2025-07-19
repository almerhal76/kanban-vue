import { db, auth } from '@/firebase/config'
import { collection, getDocs } from 'firebase/firestore'

// Test Firestore connection
export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...')

    // Try to read from projects collection
    const projectsCollection = collection(db, 'projects')
    const snapshot = await getDocs(projectsCollection)

    console.log('✅ Firestore connection successful!')
    console.log(`Found ${snapshot.size} projects in database`)

    return true
  } catch (error) {
    console.error('❌ Firestore connection failed:', error)
    return false
  }
}

// Test Authentication
export const testAuthConnection = async () => {
  try {
    console.log('Testing Firebase Authentication...')

    // Check if auth object is available
    if (auth) {
      console.log('✅ Firebase Authentication successful!')
      console.log('Current user:', auth.currentUser?.email || 'Not logged in')
      return true
    }

    return false
  } catch (error) {
    console.error('❌ Authentication connection failed:', error)
    return false
  }
}

// Test complete Firebase setup
export const testFirebaseSetup = async () => {
  console.log('🔥 Testing Firebase Setup...')
  console.log('================================')

  // Check environment variables first
  console.log('🔍 Environment Variables Check:')
  console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing')
  console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing')
  console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing')
  console.log('VITE_FIREBASE_STORAGE_BUCKET:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing')
  console.log('VITE_FIREBASE_MESSAGING_SENDER_ID:', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing')
  console.log('VITE_FIREBASE_APP_ID:', import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing')
  console.log('================================')

  const firestoreOk = await testFirestoreConnection()
  const authOk = await testAuthConnection()

  console.log('================================')
  console.log('📊 Test Results:')
  console.log(`Firestore: ${firestoreOk ? '✅ OK' : '❌ Failed'}`)
  console.log(`Authentication: ${authOk ? '✅ OK' : '❌ Failed'}`)

  if (firestoreOk && authOk) {
    console.log('🎉 Firebase setup is working correctly!')
    console.log('📝 You can now register a new account or login')
  } else {
    console.log('⚠️  Please check your Firebase configuration')
    console.log('💡 Make sure you have:')
    console.log('   - Created Firebase project')
    console.log('   - Enabled Authentication (Email/Password)')
    console.log('   - Created Firestore database')
    console.log('   - Added Firebase config to .env file')
    console.log('   - Restarted development server after changing .env')
  }

  return firestoreOk && authOk
}