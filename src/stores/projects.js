import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchProjects = async () => {
    try {
      loading.value = true
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      projects.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      error.value = err.message
      console.error('Error fetching projects:', err)
    } finally {
      loading.value = false
    }
  }

  const createProject = async (projectData) => {
    try {
      loading.value = true
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
        tasks: {
          todo: [],
          inProgress: [],
          done: []
        }
      })

      const newProject = {
        id: docRef.id,
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
        tasks: {
          todo: [],
          inProgress: [],
          done: []
        }
      }

      projects.value.unshift(newProject)
      return newProject
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (projectId, updates) => {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        ...updates,
        updatedAt: new Date()
      })

      const index = projects.value.findIndex(p => p.id === projectId)
      if (index !== -1) {
        projects.value[index] = {
          ...projects.value[index],
          ...updates,
          updatedAt: new Date()
        }
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId))
      projects.value = projects.value.filter(p => p.id !== projectId)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const addTask = async (projectId, task, column = 'todo') => {
    try {
      const project = projects.value.find(p => p.id === projectId)
      if (!project) throw new Error('Project not found')

      const newTask = {
        id: Date.now().toString(),
        ...task,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedTasks = {
        ...project.tasks,
        [column]: [...project.tasks[column], newTask]
      }

      await updateProject(projectId, { tasks: updatedTasks })
      return newTask
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const moveTask = async (projectId, taskId, fromColumn, toColumn, newIndex) => {
    try {
      const project = projects.value.find(p => p.id === projectId)
      if (!project) throw new Error('Project not found')

      const task = project.tasks[fromColumn].find(t => t.id === taskId)
      if (!task) throw new Error('Task not found')

      const updatedTasks = { ...project.tasks }

      // Remove from source column
      updatedTasks[fromColumn] = updatedTasks[fromColumn].filter(t => t.id !== taskId)

      // Add to destination column
      updatedTasks[toColumn].splice(newIndex, 0, {
        ...task,
        updatedAt: new Date()
      })

      await updateProject(projectId, { tasks: updatedTasks })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateTask = async (projectId, taskId, updates) => {
    try {
      const project = projects.value.find(p => p.id === projectId)
      if (!project) throw new Error('Project not found')

      const updatedTasks = { ...project.tasks }

      // Find and update task in any column
      for (const column in updatedTasks) {
        const taskIndex = updatedTasks[column].findIndex(t => t.id === taskId)
        if (taskIndex !== -1) {
          updatedTasks[column][taskIndex] = {
            ...updatedTasks[column][taskIndex],
            ...updates,
            updatedAt: new Date()
          }
          break
        }
      }

      await updateProject(projectId, { tasks: updatedTasks })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    addTask,
    moveTask,
    updateTask
  }
})