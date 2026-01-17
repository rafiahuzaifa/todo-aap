'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { TaskForm } from '@/components/forms/task-form'
import { TaskCard } from '@/components/cards/task-card'
import { useAuthStore } from '@/lib/store'
import { TableSkeleton } from '@/components/ui/skeleton'

interface Task {
  id: string | number
  title: string
  description?: string
  status?: 'pending' | 'in-progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  created_at: string
}

export default function Dashboard() {
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const hasRedirected = useRef(false) // ← prevents infinite loop

  useEffect(() => {
    // Prevent multiple redirects in the same render cycle / hydration
    if (hasRedirected.current) return

    if (!isLoggedIn) {
      hasRedirected.current = true
      router.replace('/login')
      return
    }

    // Only fetch if logged in
    fetchTasks()
  }, [isLoggedIn]) // ← removed router from deps (it's stable anyway)

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token/session expired → logout & redirect
          useAuthStore.getState().logout?.() // if you have logout action
          router.replace('/login')
          return
        }
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      setTasks(data.data || data || [])
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (formData: any) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchTasks()
      } else if (res.status === 401) {
        router.replace('/login')
      }
    } catch (err) {
      console.error('Create task failed:', err)
    }
  }

  // Show loading state during auth check & data fetch
  if (isLoading || !isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-lg font-medium text-slate-600">
          {isLoggedIn ? 'Loading your tasks...' : 'Checking authentication...'}
        </div>
        {!isLoggedIn && <p className="mt-2 text-sm text-slate-500">Redirecting to login...</p>}
      </div>
    )
  }

  return (
    <>
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900">Your Tasks</h1>
            <p className="mt-2 text-lg text-slate-600">
              Manage and organize your daily tasks efficiently
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <TaskForm onSubmit={handleCreateTask} />
            </div>

            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">All Tasks</h2>
              </div>

              {tasks.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                  <p className="text-lg text-slate-600">
                    No tasks yet. Create your first task to get started!
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status || 'pending'}
                      priority={task.priority || 'medium'}
                      createdAt={task.created_at}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}