'use client'

import { useTaskStore } from '@/lib/store'
import { useTasks } from '@/hooks'
import { useEffect, useState } from 'react'

export default function TaskList() {
  const { tasks } = useTaskStore()
  const { fetchTasks } = useTasks()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks().then(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-8">Loading tasks...</div>

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="luxury-card p-16 rounded-2xl text-center animate-fade-in">
          <div className="inline-block p-4 bg-gradient-to-br from-[#D4AF37] to-[#F4E4C1] rounded-lg mb-4 text-4xl">
            📝
          </div>
          <p className="text-[#999] text-lg font-medium">No tasks yet</p>
          <p className="text-[#666] text-sm mt-2">Create your first task to get started and organize your work</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="luxury-card p-6 rounded-2xl border-l-4 border-[#D4AF37] hover:border-[#F4E4C1] transition-all hover:shadow-xl animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Task Title */}
              <h4 className="font-bold text-lg text-[#F4E4C1] mb-2">{task.title}</h4>

              {/* Task Description */}
              {task.description && (
                <p className="text-[#999] text-sm mb-4 leading-relaxed">{task.description}</p>
              )}

              {/* Task Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-[#333]">
                <div className="flex items-center gap-3">
                  {/* Priority Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      task.priority === 'high'
                        ? 'bg-red-900 bg-opacity-60 text-red-200 border border-red-700'
                        : task.priority === 'medium'
                        ? 'bg-yellow-900 bg-opacity-60 text-yellow-200 border border-yellow-700'
                        : 'bg-green-900 bg-opacity-60 text-green-200 border border-green-700'
                    }`}
                  >
                    {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      task.completed
                        ? 'bg-blue-900 bg-opacity-60 text-blue-200 border border-blue-700'
                        : 'bg-purple-900 bg-opacity-60 text-purple-200 border border-purple-700'
                    }`}
                  >
                    {task.completed ? '✓ Done' : '⏳ Pending'}
                  </span>
                </div>

                {/* Last Updated */}
                <span className="text-[#666] text-xs">
                  Created just now
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
