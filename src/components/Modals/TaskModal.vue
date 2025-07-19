<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">
          {{ isEditing ? 'Edit Task' : 'Tambah Task Baru' }}
        </h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Judul Task
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Masukkan judul task"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Masukkan deskripsi task"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Prioritas
            </label>
            <select
              v-model="form.priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Ditugaskan kepada
            </label>
            <input
              v-model="form.assignedTo"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Nama klien/penanggung jawab"
            />
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="closeModal"
            class="btn-secondary"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary"
          >
            {{ loading ? 'Menyimpan...' : (isEditing ? 'Update' : 'Tambah') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  task: Object,
  loading: Boolean
})

const emit = defineEmits(['close', 'submit'])

const isEditing = ref(false)
const form = ref({
  title: '',
  description: '',
  priority: 'medium',
  assignedTo: ''
})

watch(() => props.task, (newTask) => {
  if (newTask) {
    isEditing.value = true
    form.value = {
      title: newTask.title || '',
      description: newTask.description || '',
      priority: newTask.priority || 'medium',
      assignedTo: newTask.assignedTo || ''
    }
  } else {
    isEditing.value = false
    resetForm()
  }
}, { immediate: true })

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: ''
  }
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleSubmit = () => {
  emit('submit', { ...form.value })
}
</script>