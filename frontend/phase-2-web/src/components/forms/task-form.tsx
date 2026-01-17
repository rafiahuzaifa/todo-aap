'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Textarea, Select } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface TaskFormProps {
  onSubmit?: (data: any) => void
  isLoading?: boolean
}

export function TaskForm({ onSubmit, isLoading }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    setFormData({ title: '', description: '', priority: 'medium' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Task</CardTitle>
        <CardDescription>
          Add a new task to your list
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add more details..."
            rows={4}
          />

          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            Create Task
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
