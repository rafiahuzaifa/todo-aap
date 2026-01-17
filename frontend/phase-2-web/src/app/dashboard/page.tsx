'use client'

import Header from '@/components/Header'
import CreateTaskForm from '@/components/CreateTaskForm'
import TaskList from '@/components/TaskList'
import { useAuthStore } from '@/lib/store'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) return <div>Redirecting...</div>

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Dashboard Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold gold-text mb-3">Your Tasks</h1>
          <p className="text-[#999] text-lg">Manage and organize your daily tasks efficiently</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Task Form - Takes 1 column on large screens */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
            <CreateTaskForm />
          </div>

          {/* Task List - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="space-y-2 mb-6">
              <p className="text-sm text-[#999] uppercase tracking-widest font-semibold">📊 All Tasks</p>
              <div className="h-1 w-12 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] rounded-full"></div>
            </div>
            <TaskList />
          </div>
        </div>
      </main>
    </div>
  )
}
