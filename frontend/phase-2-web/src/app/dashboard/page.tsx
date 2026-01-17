'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { TaskForm } from '@/components/forms/task-form'
import { TaskCard } from '@/components/cards/task-card'
import { useAuthStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TableSkeleton } from '@/components/ui/skeleton'

export default function Dashboard() {
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()
  const [tasks, setTasks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      fetchTasks()
    }
  }, [isLoggedIn, router])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      const data = await response.json()
      setTasks(data.data || [])
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (formData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  if (!isLoggedIn) return <div>Redirecting...</div>

  return (
    <>
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900">
              Your Tasks
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              Manage and organize your daily tasks efficiently
            </p>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Create Task Form */}
            <div className="lg:col-span-1">
              <TaskForm onSubmit={handleCreateTask} />
            </div>

            {/* Task List */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  All Tasks
                </h2>
              </div>

              {isLoading ? (
                <TableSkeleton rows={5} />
              ) : tasks.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                  <p className="text-lg text-slate-600">
                    No tasks yet. Create your first task to get started!
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
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
