'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  onClose: () => void
  duration?: number
}

const icons = {
  success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  error:   <XCircle className="w-4 h-4 text-red-500" />,
  warning: <AlertCircle className="w-4 h-4 text-amber-500" />,
}

const styles = {
  success: 'border-emerald-100 bg-emerald-50',
  error:   'border-red-100 bg-red-50',
  warning: 'border-amber-100 bg-amber-50',
}

export function Toast({ message, type = 'success', onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-md',
        'animate-fade-up min-w-72 max-w-sm',
        styles[type]
      )}
    >
      {icons[type]}
      <p className="text-sm font-medium text-gray-800 flex-1">{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
export function ToastContainer({ toasts, onRemove }: {
  toasts: { id: string; message: string; type: ToastType }[]
  onRemove: (id: string) => void
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => onRemove(t.id)}
        />
      ))}
    </div>
  )
}