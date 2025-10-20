'use client';

import React, { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useKeyboardShortcuts, useNavigationShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useKeyboardShortcutsDialog } from '@/components/ui/KeyboardShortcuts';

interface KeyboardShortcutsContextType {
  openShortcutsDialog: () => void;
  closeShortcutsDialog: () => void;
  toggleShortcutsDialog: () => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | null>(null);

export function useKeyboardShortcutsContext() {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcutsContext must be used within KeyboardShortcutsProvider');
  }
  return context;
}

interface KeyboardShortcutsProviderProps {
  children: React.ReactNode;
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  const router = useRouter();
  const { isOpen, open, close, toggle, KeyboardShortcutsDialog: Dialog } = useKeyboardShortcutsDialog();

  // Navigation shortcuts
  useNavigationShortcuts({
    onGoHome: () => router.push('/'),
    onGoSearch: () => {
      router.push('/search');
      // Focus search input after navigation
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    },
    onGoLibrary: () => router.push('/library'),
    onGoSettings: () => router.push('/settings'),
  });

  // Global shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: '?',
        action: toggle,
        description: 'Show keyboard shortcuts',
        category: 'General'
      },
      {
        key: 'Escape',
        action: () => {
          if (isOpen) {
            close();
          }
        },
        description: 'Close dialogs',
        category: 'General'
      }
    ]
  });

  const contextValue: KeyboardShortcutsContextType = {
    openShortcutsDialog: open,
    closeShortcutsDialog: close,
    toggleShortcutsDialog: toggle,
  };

  return (
    <KeyboardShortcutsContext.Provider value={contextValue}>
      {children}
      <Dialog />
    </KeyboardShortcutsContext.Provider>
  );
}