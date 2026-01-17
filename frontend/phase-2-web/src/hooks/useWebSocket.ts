'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/lib/store'
import WebSocketClient from '@/lib/websocket'

export const useWebSocket = () => {
  const wsRef = useRef<WebSocketClient | null>(null)
  const { token } = useAuthStore()

  useEffect(() => {
    if (!token) return

    const ws = new WebSocketClient(token)
    ws.connect()
      .then(() => {
        wsRef.current = ws
        // Send initial presence update
        ws.send('presence', { status: 'online' })
      })
      .catch((error) => {
        console.error('Failed to connect WebSocket:', error)
      })

    return () => {
      ws.disconnect()
    }
  }, [token])

  return wsRef.current
}

export const useRealtimeTaskUpdates = () => {
  const ws = useWebSocket()

  const subscribeToTaskUpdates = (callback: Function) => {
    if (!ws) return

    ws.on('task_update', (data) => {
      callback(data)
    })

    return () => {
      ws.off('task_update', callback)
    }
  }

  const subscribeToNotifications = (callback: Function) => {
    if (!ws) return

    ws.on('notification', (data) => {
      callback(data)
    })

    return () => {
      ws.off('notification', callback)
    }
  }

  const sendTaskStatusUpdate = (taskId: string, status: string) => {
    if (!ws) return
    ws.send('task_status', { task_id: taskId, status })
  }

  return {
    subscribeToTaskUpdates,
    subscribeToNotifications,
    sendTaskStatusUpdate,
  }
}
