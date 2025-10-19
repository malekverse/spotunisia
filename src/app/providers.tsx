'use client'

import { SessionProvider } from 'next-auth/react'
import { KeyboardShortcutsProvider } from '@/components/providers/KeyboardShortcutsProvider'
import { ToastProvider } from '@/components/ui/Toast'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ToastProvider>
        <KeyboardShortcutsProvider>
          {children}
        </KeyboardShortcutsProvider>
      </ToastProvider>
    </SessionProvider>
  )
}