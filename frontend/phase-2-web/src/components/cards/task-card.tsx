'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

interface TaskCardProps {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

const statusConfig = {
  pending: { label: 'Pending', icon: AlertCircle, color: 'warning' },
  'in-progress': { label: 'In Progress', icon: Clock, color: 'info' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'success' },
}

const priorityConfig = {
  low: { label: 'Low', badge: 'default' },
  medium: { label: 'Medium', badge: 'warning' },
  high: { label: 'High', badge: 'error' },
}

export function TaskCard({
  title,
  description,
  status,
  priority,
  createdAt,
}: Omit<TaskCardProps, 'id'>) {
  const statusInfo = statusConfig[status]
  const priorityInfo = priorityConfig[priority]
  const StatusIcon = statusInfo.icon

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-start justify-between gap-4">
          <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
          <Badge variant={priorityInfo.badge as any}>
            {priorityInfo.label}
          </Badge>
        </div>
        {description && (
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">
              {statusInfo.label}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
