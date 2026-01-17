'use client'

import { useTasks } from '@/hooks'
import { useState } from 'react'

export default function CreateTaskForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const { createTask, loading } = useTasks()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createTask({ title, description, priority })
      setTitle('')
      setDescription('')
      setPriority('medium')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="luxury-card p-8 rounded-2xl space-y-6 mb-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">✨</span>
        <h3 className="text-2xl font-bold gold-text">Create New Task</h3>
      </div>

      {/* Title Field */}
      <div className="form-group">
        <label className="form-label">📝 Task Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="input-luxury w-full px-4 py-3 border rounded-lg"
          required
        />
        <p className="form-hint">Be specific and clear about your task</p>
      </div>

      {/* Description Field */}
      <div className="form-group">
        <label className="form-label">📋 Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details about this task..."
          className="input-luxury w-full px-4 py-3 border rounded-lg resize-none"
          rows={4}
        />
        <p className="form-hint">Add context and important notes</p>
      </div>

      {/* Priority Field */}
      <div className="form-group">
        <label className="form-label">⚡ Priority Level</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="input-luxury w-full px-4 py-3 border rounded-lg cursor-pointer"
        >
          <option value="low" className="bg-[#1a1a1a] text-[#E0E0E0]">🟢 Low - Can wait</option>
          <option value="medium" className="bg-[#1a1a1a] text-[#E0E0E0]">🟡 Medium - Important</option>
          <option value="high" className="bg-[#1a1a1a] text-[#E0E0E0]">🔴 High - Urgent</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="luxury-btn w-full py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold uppercase tracking-wider mt-6"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span> Creating...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>➕</span> Create Task
          </span>
        )}
      </button>
    </form>
  )
}
