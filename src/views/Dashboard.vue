<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Firebase Debug Status (only show if there are issues) -->
      <FirebaseStatus v-if="showDebug" />
      
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard Proyek</h1>
        
        <div class="flex space-x-3">
          <button
            @click="toggleDebug"
            class="btn-secondary text-sm"
            title="Toggle Firebase Debug"
          >
            🔍 Debug
          </button>
          <button
            @click="testFirebase"
            class="btn-secondary text-sm"
            title="Test Firebase Connection"
          >
            🔥 Test Firebase
          </button>
          <button
            v-if="authStore.canCreateProject"
            @click="showCreateProject = true"
            class="btn-primary"
          >
            + Buat Proyek Baru
          </button>
        </div>
      </div>

      <div v-if="projectsStore.loading" class="text-center py-8">
        <div class="text-gray-500">Memuat proyek...</div>
      </div>

      <div v-else-if="projectsStore.projects.length === 0" class="text-center py-12">
        <div class="text-gray-500 mb-4">Belum ada proyek</div>
        <button
          v-if="authStore.canCreateProject"
          @click="showCreateProject = true"
          class="btn-primary"
        >
          Buat Proyek Pertama
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in projectsStore.projects"
          :key="project.id"
          class="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
          @click="goToProject(project.id)"
        >
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-900">{{ project.title }}</h3>
            <span class="text-xs text-gray-500">
              {{ formatDate(project.createdAt) }}
            </span>
          </div>
          
          <p class="text-gray-600 text-sm mb-4">{{ project.description }}</p>
          
          <div class="flex items-center justify-between text-sm">
            <div class="flex space-x-4">
              <span class="text-gray-500">
                Todo: {{ project.tasks?.todo?.length || 0 }}
              </span>
              <span class="text-blue-600">
                Progress: {{ project.tasks?.inProgress?.length || 0 }}
              </span>
              <span class="text-green-600">
                Done: {{ project.tasks?.done?.length || 0 }}
              </span>
            </div>
          </div>
          
          <div v-if="project.clients && project.clients.length > 0" class="mt-3">
            <div class="text-xs text-gray-500 mb-1">Klien:</div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="client in project.clients"
                :key="client"
                class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {{ client }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create Project -->
    <div v-if="showCreateProject" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Buat Proyek Baru</h3>
          <button @click="showCreateProject = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleCreateProject">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Proyek
              </label>
              <input
                v-model="projectForm.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Masukkan nama proyek"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                v-model="projectForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Masukkan deskripsi proyek"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Klien (pisahkan dengan koma)
              </label>
              <input
                v-model="clientsInput"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Klien A, Klien B, Klien C"
              />
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showCreateProject = false"
              class="btn-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="projectsStore.loading"
              class="btn-primary"
            >
              {{ projectsStore.loading ? 'Membuat...' : 'Buat Proyek' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import { testFirebaseSetup } from '@/utils/testFirebase'
import Navbar from '@/components/Layout/Navbar.vue'
import FirebaseStatus from '@/components/Debug/FirebaseStatus.vue'

const router = useRouter()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()

const showCreateProject = ref(false)
const showDebug = ref(false)
const projectForm = ref({
  title: '',
  description: ''
})
const clientsInput = ref('')

onMounted(() => {
  projectsStore.fetchProjects()
})

const formatDate = (date) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('id-ID')
}

const goToProject = (projectId) => {
  router.push(`/project/${projectId}`)
}

const toggleDebug = () => {
  showDebug.value = !showDebug.value
}

const testFirebase = async () => {
  await testFirebaseSetup()
}

const handleCreateProject = async () => {
  try {
    const clients = clientsInput.value
      .split(',')
      .map(client => client.trim())
      .filter(client => client.length > 0)

    await projectsStore.createProject({
      ...projectForm.value,
      clients,
      createdBy: authStore.user.uid
    })

    // Reset form
    projectForm.value = { title: '', description: '' }
    clientsInput.value = ''
    showCreateProject.value = false
  } catch (error) {
    console.error('Failed to create project:', error)
  }
}
</script>