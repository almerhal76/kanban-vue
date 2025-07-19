import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginUser, registerUser, logoutUser, getCurrentUser, getUserRole } from '@/firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userRole = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const canCreateProject = computed(() => userRole.value === 'admin')
  const canAddProgress = computed(() => ['admin', 'editor'].includes(userRole.value))
  const canViewOnly = computed(() => userRole.value === 'viewer')

  const login = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      const userData = await loginUser(email, password)
      user.value = userData
      userRole.value = await getUserRole(userData.uid)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (email, password, userData) => {
    try {
      loading.value = true
      error.value = null
      const newUser = await registerUser(email, password, userData)
      user.value = newUser
      userRole.value = userData.role
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      user.value = null
      userRole.value = null
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        user.value = currentUser
        userRole.value = await getUserRole(currentUser.uid)
      }
    } catch (err) {
      console.error('Auth check failed:', err)
    }
  }

  return {
    user,
    userRole,
    loading,
    error,
    isAuthenticated,
    canCreateProject,
    canAddProgress,
    canViewOnly,
    login,
    register,
    logout,
    checkAuth
  }
})