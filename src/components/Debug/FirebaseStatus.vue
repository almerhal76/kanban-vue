<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
    <h3 class="text-lg font-semibold mb-3">🔥 Firebase Status</h3>
    
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">API Key:</span>
        <span :class="status.apiKey ? 'text-green-600' : 'text-red-600'">
          {{ status.apiKey ? '✅ Set' : '❌ Missing' }}
        </span>
      </div>
      
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Auth Domain:</span>
        <span :class="status.authDomain ? 'text-green-600' : 'text-red-600'">
          {{ status.authDomain ? '✅ Set' : '❌ Missing' }}
        </span>
      </div>
      
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Project ID:</span>
        <span :class="status.projectId ? 'text-green-600' : 'text-red-600'">
          {{ status.projectId ? '✅ Set' : '❌ Missing' }}
        </span>
      </div>
      
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Storage Bucket:</span>
        <span :class="status.storageBucket ? 'text-green-600' : 'text-red-600'">
          {{ status.storageBucket ? '✅ Set' : '❌ Missing' }}
        </span>
      </div>
      
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Messaging Sender ID:</span>
        <span :class="status.messagingSenderId ? 'text-green-600' : 'text-red-600'">
          {{ status.messagingSenderId ? '✅ Set' : '❌ Missing' }}
        </span>
      </div>
      
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">App ID:</span>
        <span :class="status.appId ? 'text-green-600' : 'text-red-600'">
          {{ status.appId ? '✅ Set' : '❌ Missing' }}
        </span>
      </div>
    </div>
    
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700">Overall Status:</span>
        <span :class="isConfigured ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
          {{ isConfigured ? '✅ Configured' : '❌ Incomplete' }}
        </span>
      </div>
      
      <div v-if="!isConfigured" class="mt-2 text-sm text-red-600">
        <p>⚠️ Firebase configuration is incomplete!</p>
        <p class="mt-1">Please check your .env file and restart the development server.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const status = computed(() => ({
  apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: !!import.meta.env.VITE_FIREBASE_APP_ID
}))

const isConfigured = computed(() => {
  return status.value.apiKey && 
         status.value.authDomain && 
         status.value.projectId && 
         status.value.storageBucket && 
         status.value.messagingSenderId && 
         status.value.appId
})
</script>