'use client'

import { useState, useEffect } from 'react'
import { useRealtimeTaskUpdates } from './useWebSocket'
import { useTaskStore } from '@/lib/store'

export const useRealtimeTasks = () => {
  const [notifications, setNotifications] = useState<any[]>([])
  const { subscribeToTaskUpdates, subscribeToNotifications } = useRealtimeTaskUpdates()
  const { updateTask } = useTaskStore()

  useEffect(() => {
    const unsubscribeUpdates = subscribeToTaskUpdates((data: any) => {
      if (data.action === 'status_changed') {
        updateTask(data.task_id, data.data)
      }
    })

    const unsubscribeNotifications = subscribeToNotifications((data: any) => {
      setNotifications((prev) => [data.data, ...prev].slice(0, 10))
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n !== data.data))
      }, 5000)
    })

    return () => {
      unsubscribeUpdates?.()
      unsubscribeNotifications?.()
    }
  }, [subscribeToTaskUpdates, subscribeToNotifications, updateTask])

  return { notifications }
}
