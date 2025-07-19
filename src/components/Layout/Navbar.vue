<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/dashboard" class="text-xl font-bold text-primary-600">
            Kanban Management
          </router-link>
        </div>
        
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">
            {{ authStore.user?.email }}
          </span>
          <span class="px-2 py-1 text-xs font-medium rounded-full" :class="roleClass">
            {{ roleText }}
          </span>
          <button @click="handleLogout" class="btn-secondary text-sm">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const roleClass = computed(() => {
  switch (authStore.userRole) {
    case 'admin':
      return 'bg-green-100 text-green-800'
    case 'editor':
      return 'bg-blue-100 text-blue-800'
    case 'viewer':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const roleText = computed(() => {
  switch (authStore.userRole) {
    case 'admin':
      return 'Admin'
    case 'editor':
      return 'Editor'
    case 'viewer':
      return 'Viewer'
    default:
      return 'Unknown'
  }
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>