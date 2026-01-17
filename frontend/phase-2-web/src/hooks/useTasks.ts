import { useState, useCallback } from 'react'
import { useTaskStore } from '@/lib/store'
import { taskApi } from '@/lib/api-client'

export const useTasks = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setTasks, addTask, updateTask, deleteTask } = useTaskStore()

  const fetchTasks = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true)
      const res = await taskApi.list(page, limit)
      setTasks(res.data.data)
      return res.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setTasks])

  const createTask = useCallback(async (data: any) => {
    try {
      setLoading(true)
      const res = await taskApi.create(data)
      addTask(res.data.data)
      return res.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task')
      throw err
    } finally {
      setLoading(false)
    }
  }, [addTask])

  const completeTask = useCallback(async (id: string) => {
    try {
      const res = await taskApi.complete(id)
      updateTask(id, res.data.data)
      return res.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete task')
      throw err
    }
  }, [updateTask])

  const removeTask = useCallback(async (id: string) => {
    try {
      await taskApi.delete(id)
      deleteTask(id)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task')
      throw err
    }
  }, [deleteTask])

  return { fetchTasks, createTask, completeTask, removeTask, loading, error }
}
