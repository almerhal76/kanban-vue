// Firebase initialization checker
export const checkFirebaseConfig = () => {
    const requiredEnvVars = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID'
    ]

    const missing = requiredEnvVars.filter(varName => !import.meta.env[varName])

    if (missing.length > 0) {
        console.error('❌ Missing Firebase environment variables:', missing)
        return {
            isValid: false,
            missing,
            message: `Missing environment variables: ${missing.join(', ')}`
        }
    }

    return {
        isValid: true,
        missing: [],
        message: 'Firebase configuration is complete'
    }
}

export const logFirebaseStatus = () => {
    console.log('🔍 Firebase Environment Check:')
    console.log('NODE_ENV:', import.meta.env.MODE)
    console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing')
    console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing')
    console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing')
    console.log('VITE_FIREBASE_STORAGE_BUCKET:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing')
    console.log('VITE_FIREBASE_MESSAGING_SENDER_ID:', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing')
    console.log('VITE_FIREBASE_APP_ID:', import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing')
}