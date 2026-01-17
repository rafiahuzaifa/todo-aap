'use client'

import { useState, useEffect } from 'react'
import { taskApi } from '@/lib/api-client'

export const useAnalytics = () => {
  const [stats, setStats] = useState<any>(null)
  const [trends, setTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await taskApi.list(1, 1)
      // Mock stats calculation
      const tasks = response.data.data
      const completed = tasks.filter((t: any) => t.completed).length
      const total = tasks.length

      setStats({
        total_tasks: total,
        completed_tasks: completed,
        pending_tasks: total - completed,
        completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      })

      // Mock trends
      const mockTrends = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: Math.floor(Math.random() * 5),
      }))
      setTrends(mockTrends.reverse())
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return { stats, trends, loading, refetch: fetchStats }
}
