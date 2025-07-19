import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'
import { logFirebaseStatus, checkFirebaseConfig } from './utils/firebaseCheck'

// Check Firebase configuration on startup
console.log('🚀 Starting Kanban Management System...')
logFirebaseStatus()

const configCheck = checkFirebaseConfig()
if (!configCheck.isValid) {
    console.error('❌ Firebase configuration error:', configCheck.message)
    console.error('💡 Please check your .env file and restart the development server')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')