'use client'

import React from 'react'
import * as Toast from '@radix-ui/react-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastProps {
  id: string
  title: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastItemProps extends ToastProps {
  onClose: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastStyles = {
  success: 'border-green-500 bg-green-500/10 text-green-400',
  error: 'border-red-500 bg-red-500/10 text-red-400',
  warning: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
  info: 'border-blue-500 bg-blue-500/10 text-blue-400',
}

function ToastItem({ 
  id, 
  title, 
  description, 
  type = 'info', 
  action, 
  onClose 
}: ToastItemProps) {
  const Icon = toastIcons[type]

  return (
    <Toast.Root
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
        'bg-spotify-gray border-spotify-lightgray',
        toastStyles[type]
      )}
      duration={5000}
    >
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="grid gap-1">
          <Toast.Title className="text-sm font-semibold text-white">
            {title}
          </Toast.Title>
          {description && (
            <Toast.Description className="text-sm text-spotify-text">
              {description}
            </Toast.Description>
          )}
        </div>
      </div>

      {action && (
        <Toast.Action
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-spotify-lightgray bg-transparent px-3 text-sm font-medium text-white transition-colors hover:bg-spotify-lightgray focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          altText={action.label}
          onClick={action.onClick}
        >
          {action.label}
        </Toast.Action>
      )}

      <Toast.Close
        className="absolute right-2 top-2 rounded-md p-1 text-spotify-text opacity-0 transition-opacity hover:text-white focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        onClick={() => onClose(id)}
      >
        <X className="h-4 w-4" />
      </Toast.Close>
    </Toast.Root>
  )
}

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const addToast = React.useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const contextValue = React.useMemo(
    () => ({
      addToast,
      removeToast,
    }),
    [addToast, removeToast]
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toast.Provider swipeDirection="right">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <ToastItem {...toast} onClose={removeToast} />
            </motion.div>
          ))}
        </AnimatePresence>
        <Toast.Viewport className="fixed bottom-0 right-0 z-[100] m-0 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
      </Toast.Provider>
    </ToastContext.Provider>
  )
}

const ToastContext = React.createContext<{
  addToast: (toast: Omit<ToastProps, 'id'>) => void
  removeToast: (id: string) => void
} | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Convenience functions
export const toast = {
  success: (title: string, description?: string, action?: ToastProps['action']) => {
    // This will be implemented when the provider is available
    console.log('Success toast:', { title, description, action })
  },
  error: (title: string, description?: string, action?: ToastProps['action']) => {
    console.log('Error toast:', { title, description, action })
  },
  warning: (title: string, description?: string, action?: ToastProps['action']) => {
    console.log('Warning toast:', { title, description, action })
  },
  info: (title: string, description?: string, action?: ToastProps['action']) => {
    console.log('Info toast:', { title, description, action })
  },
}