'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Music, Navigation, Volume2 } from 'lucide-react';
import { Button } from './Button';
import { formatShortcut, type KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsDialog({ isOpen, onClose }: KeyboardShortcutsProps) {
  const shortcuts: KeyboardShortcut[] = [
    // Playback shortcuts
    {
      key: ' ',
      action: () => {},
      description: 'Play/Pause',
      category: 'Playback'
    },
    {
      key: 'ArrowRight',
      action: () => {},
      description: 'Next track',
      category: 'Playback'
    },
    {
      key: 'ArrowLeft',
      action: () => {},
      description: 'Previous track',
      category: 'Playback'
    },
    {
      key: 's',
      ctrlKey: true,
      action: () => {},
      description: 'Toggle shuffle',
      category: 'Playback'
    },
    {
      key: 'r',
      ctrlKey: true,
      action: () => {},
      description: 'Toggle repeat',
      category: 'Playback'
    },
    // Volume shortcuts
    {
      key: 'ArrowUp',
      action: () => {},
      description: 'Volume up',
      category: 'Volume'
    },
    {
      key: 'ArrowDown',
      action: () => {},
      description: 'Volume down',
      category: 'Volume'
    },
    {
      key: 'm',
      action: () => {},
      description: 'Mute/Unmute',
      category: 'Volume'
    },
    // Navigation shortcuts
    {
      key: '1',
      ctrlKey: true,
      action: () => {},
      description: 'Go to Home',
      category: 'Navigation'
    },
    {
      key: '2',
      ctrlKey: true,
      action: () => {},
      description: 'Go to Search',
      category: 'Navigation'
    },
    {
      key: '3',
      ctrlKey: true,
      action: () => {},
      description: 'Go to Library',
      category: 'Navigation'
    },
    {
      key: ',',
      ctrlKey: true,
      action: () => {},
      description: 'Go to Settings',
      category: 'Navigation'
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => {},
      description: 'Focus search',
      category: 'Navigation'
    },
    // General shortcuts
    {
      key: '?',
      action: () => {},
      description: 'Show keyboard shortcuts',
      category: 'General'
    },
    {
      key: 'Escape',
      action: () => {},
      description: 'Close dialogs',
      category: 'General'
    }
  ];

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Playback':
        return <Music className="h-5 w-5" />;
      case 'Volume':
        return <Volume2 className="h-5 w-5" />;
      case 'Navigation':
        return <Navigation className="h-5 w-5" />;
      default:
        return <Keyboard className="h-5 w-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 w-full max-w-2xl max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <Keyboard className="h-6 w-6 text-green-500" />
                  <h2 className="text-xl font-bold text-white">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-green-500">
                          {getCategoryIcon(category)}
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          {category}
                        </h3>
                      </div>
                      
                      <div className="space-y-2">
                        {categoryShortcuts.map((shortcut, index) => (
                          <div
                            key={`${category}-${index}`}
                            className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                          >
                            <span className="text-zinc-300">
                              {shortcut.description}
                            </span>
                            <kbd className="px-2 py-1 text-xs font-mono bg-zinc-700 text-zinc-300 rounded border border-zinc-600">
                              {formatShortcut(shortcut)}
                            </kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
                <p className="text-sm text-zinc-400 text-center">
                  Press <kbd className="px-1 py-0.5 text-xs bg-zinc-700 rounded">?</kbd> to toggle this dialog
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to manage keyboard shortcuts dialog
export function useKeyboardShortcutsDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return {
    isOpen,
    open,
    close,
    toggle,
    KeyboardShortcutsDialog: (props: Omit<KeyboardShortcutsProps, 'isOpen' | 'onClose'>) => (
      <KeyboardShortcutsDialog {...props} isOpen={isOpen} onClose={close} />
    )
  };
}