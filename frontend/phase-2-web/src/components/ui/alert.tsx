import { cn } from '@/lib/utils'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error'
  children: React.ReactNode
}

const variantStyles = {
  default: 'border-blue-200 bg-blue-50 text-blue-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  error: 'border-red-200 bg-red-50 text-red-800',
}

export function Alert({
  variant = 'default',
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border px-4 py-3 text-sm',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <h5 className={cn('mb-1 font-semibold', className)} {...props} />
  )
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm opacity-90', className)} {...props} />
  )
}
