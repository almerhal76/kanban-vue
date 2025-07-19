<template>
  <div class="flex space-x-6 overflow-x-auto pb-4">
    <div
      v-for="(column, columnKey) in columns"
      :key="columnKey"
      class="kanban-column min-w-80 flex-shrink-0"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-700">{{ column.title }}</h3>
        <span class="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
          {{ tasks[columnKey]?.length || 0 }}
        </span>
      </div>
      
      <draggable
        v-model="tasks[columnKey]"
        group="tasks"
        :disabled="!canEdit"
        @change="handleTaskMove($event, columnKey)"
        class="min-h-64"
        item-key="id"
      >
        <template #item="{ element: task }">
          <div class="task-card" @click="$emit('task-click', task)">
            <div class="flex items-start justify-between mb-2">
              <h4 class="font-medium text-gray-900 text-sm">{{ task.title }}</h4>
              <span 
                class="text-xs px-2 py-1 rounded-full"
                :class="getPriorityClass(task.priority)"
              >
                {{ task.priority }}
              </span>
            </div>
            
            <p class="text-gray-600 text-sm mb-3">{{ task.description }}</p>
            
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span v-if="task.assignedTo">{{ task.assignedTo }}</span>
              <span>{{ formatDate(task.createdAt) }}</span>
            </div>
          </div>
        </template>
      </draggable>
      
      <button
        v-if="canEdit"
        @click="$emit('add-task', columnKey)"
        class="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        + Tambah Task
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  tasks: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['task-move', 'task-click', 'add-task'])

const authStore = useAuthStore()

const canEdit = computed(() => authStore.canAddProgress || authStore.canCreateProject)

const columns = {
  todo: { title: 'To Do' },
  inProgress: { title: 'In Progress' },
  done: { title: 'Done' }
}

const handleTaskMove = (event, columnKey) => {
  if (event.moved) {
    emit('task-move', {
      taskId: event.moved.element.id,
      fromColumn: event.moved.oldIndex,
      toColumn: columnKey,
      newIndex: event.moved.newIndex
    })
  }
}

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (date) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('id-ID')
}
</script>