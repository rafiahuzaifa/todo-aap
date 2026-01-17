import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn('mb-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({
  className,
  children,
  ...props
}: CardProps) {
  return (
    <h3 className={cn('text-xl font-semibold text-slate-900', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({
  className,
  children,
  ...props
}: CardProps) {
  return (
    <p className={cn('text-sm text-slate-600', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn('mt-6 flex items-center gap-4 border-t border-slate-200 pt-6', className)} {...props}>
      {children}
    </div>
  )
}
