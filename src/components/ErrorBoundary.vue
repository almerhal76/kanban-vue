<template>
  <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-red-50">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <svg class="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-medium text-red-800">
            Firebase Configuration Error
          </h3>
        </div>
      </div>
      
      <div class="text-sm text-red-700 mb-4">
        <p class="mb-2">{{ errorMessage }}</p>
        <p>Please check your Firebase configuration and try again.</p>
      </div>
      
      <div class="bg-red-100 border border-red-200 rounded p-3 mb-4">
        <h4 class="font-medium text-red-800 mb-2">Quick Fix Steps:</h4>
        <ol class="text-sm text-red-700 space-y-1">
          <li>1. Check your <code class="bg-red-200 px-1 rounded">.env</code> file exists</li>
          <li>2. Verify all Firebase environment variables are set</li>
          <li>3. Restart the development server</li>
          <li>4. Check Firebase Console for project settings</li>
        </ol>
      </div>
      
      <div class="flex space-x-3">
        <button 
          @click="retry" 
          class="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
        <button 
          @click="showDetails = !showDetails" 
          class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          {{ showDetails ? 'Hide' : 'Show' }} Details
        </button>
      </div>
      
      <div v-if="showDetails" class="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
        <pre>{{ errorDetails }}</pre>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')
const showDetails = ref(false)

onErrorCaptured((error) => {
  console.error('Error caught by boundary:', error)
  
  hasError.value = true
  
  if (error.message.includes('configuration-not-found') || error.message.includes('Firebase')) {
    errorMessage.value = 'Firebase is not properly configured. Please check your environment variables.'
  } else {
    errorMessage.value = error.message || 'An unexpected error occurred.'
  }
  
  errorDetails.value = error.stack || error.toString()
  
  return false
})

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = ''
  showDetails.value = false
  
  // Reload the page to retry initialization
  window.location.reload()
}
</script>