import { cn } from '@/lib/utils'

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table
        className={cn('w-full text-left text-sm', className)}
        {...props}
      />
    </div>
  )
}

export function TableHead({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn('border-b border-slate-200 bg-slate-50', className)}
      {...props}
    />
  )
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-slate-200', className)} {...props} />
}

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'transition-colors duration-200 ease-in-out hover:bg-slate-50',
        className
      )}
      {...props}
    />
  )
}

export function TableHeader({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'px-6 py-3 font-semibold text-slate-700',
        className
      )}
      {...props}
    />
  )
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-6 py-4 text-slate-700', className)} {...props} />
  )
}
