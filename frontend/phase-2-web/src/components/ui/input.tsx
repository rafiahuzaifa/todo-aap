import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({
  label,
  error,
  hint,
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-all duration-200 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-50 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-50',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-slate-500">{hint}</p>
      )}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({
  label,
  error,
  hint,
  className,
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition-all duration-200 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-50 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-50',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-slate-500">{hint}</p>
      )}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: Array<{ value: string; label: string }>
}

export function Select({
  label,
  error,
  hint,
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 transition-all duration-200 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-50 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-50',
          className
        )}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-slate-500">{hint}</p>
      )}
    </div>
  )
}
