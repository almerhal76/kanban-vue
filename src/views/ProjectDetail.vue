<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-500">Memuat proyek...</div>
      </div>

      <div v-else-if="!project" class="text-center py-8">
        <div class="text-gray-500">Proyek tidak ditemukan</div>
        <router-link to="/dashboard" class="btn-primary mt-4">
          Kembali ke Dashboard
        </router-link>
      </div>

      <div v-else>
        <!-- Project Header -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ project.title }}</h1>
              <p class="text-gray-600 mt-1">{{ project.description }}</p>
            </div>
            <router-link to="/dashboard" class="btn-secondary">
              ← Kembali
            </router-link>
          </div>

          <div v-if="project.clients && project.clients.length > 0" class="flex flex-wrap gap-2">
            <span class="text-sm text-gray-500">Klien:</span>
            <span
              v-for="client in project.clients"
              :key="client"
              class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {{ client }}
            </span>
          </div>
        </div>

        <!-- Kanban Board -->
        <KanbanBoard
          :tasks="project.tasks || { todo: [], inProgress: [], done: [] }"
          @task-move="handleTaskMove"
          @task-click="handleTaskClick"
          @add-task="handleAddTask"
        />
      </div>
    </div>

    <!-- Task Modal -->
    <TaskModal
      :is-open="showTaskModal"
      :task="selectedTask"
      :loading="taskLoading"
      @close="closeTaskModal"
      @submit="handleTaskSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Layout/Navbar.vue'
import KanbanBoard from '@/components/Kanban/KanbanBoard.vue'
import TaskModal from '@/components/Modals/TaskModal.vue'

const route = useRoute()
const projectsStore = useProjectsStore()
const authStore = useAuthStore()

const loading = ref(true)
const showTaskModal = ref(false)
const selectedTask = ref(null)
const selectedColumn = ref('todo')
const taskLoading = ref(false)

const project = computed(() => {
  return projectsStore.projects.find(p => p.id === route.params.id)
})

onMounted(async () => {
  try {
    if (projectsStore.projects.length === 0) {
      await projectsStore.fetchProjects()
    }
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  } finally {
    loading.value = false
  }
})

const handleTaskMove = async (moveData) => {
  try {
    // Implementasi drag & drop akan memerlukan logika yang lebih kompleks
    // Untuk sekarang, kita skip implementasi ini
    console.log('Task move:', moveData)
  } catch (error) {
    console.error('Failed to move task:', error)
  }
}

const handleTaskClick = (task) => {
  if (authStore.canAddProgress || authStore.canCreateProject) {
    selectedTask.value = task
    showTaskModal.value = true
  }
}

const handleAddTask = (column) => {
  if (authStore.canAddProgress || authStore.canCreateProject) {
    selectedTask.value = null
    selectedColumn.value = column
    showTaskModal.value = true
  }
}

const closeTaskModal = () => {
  showTaskModal.value = false
  selectedTask.value = null
  selectedColumn.value = 'todo'
}

const handleTaskSubmit = async (taskData) => {
  try {
    taskLoading.value = true
    
    if (selectedTask.value) {
      // Update existing task
      await projectsStore.updateTask(route.params.id, selectedTask.value.id, taskData)
    } else {
      // Add new task
      await projectsStore.addTask(route.params.id, taskData, selectedColumn.value)
    }
    
    closeTaskModal()
  } catch (error) {
    console.error('Failed to save task:', error)
  } finally {
    taskLoading.value = false
  }
}
</script>