'use client';

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category?: string;
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ 
  shortcuts, 
  enabled = true 
}: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = !!shortcut.ctrlKey === event.ctrlKey;
      const shiftMatch = !!shortcut.shiftKey === event.shiftKey;
      const altMatch = !!shortcut.altKey === event.altKey;
      const metaMatch = !!shortcut.metaKey === event.metaKey;

      return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch;
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  return { shortcuts };
}

// Predefined shortcuts for music player
export function useMusicPlayerShortcuts({
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeUp,
  onVolumeDown,
  onMute,
  onShuffle,
  onRepeat,
  enabled = true
}: {
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
  onMute?: () => void;
  onShuffle?: () => void;
  onRepeat?: () => void;
  enabled?: boolean;
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: ' ',
      action: () => onPlayPause?.(),
      description: 'Play/Pause',
      category: 'Playback'
    },
    {
      key: 'ArrowRight',
      action: () => onNext?.(),
      description: 'Next track',
      category: 'Playback'
    },
    {
      key: 'ArrowLeft',
      action: () => onPrevious?.(),
      description: 'Previous track',
      category: 'Playback'
    },
    {
      key: 'ArrowUp',
      action: () => onVolumeUp?.(),
      description: 'Volume up',
      category: 'Volume'
    },
    {
      key: 'ArrowDown',
      action: () => onVolumeDown?.(),
      description: 'Volume down',
      category: 'Volume'
    },
    {
      key: 'm',
      action: () => onMute?.(),
      description: 'Mute/Unmute',
      category: 'Volume'
    },
    {
      key: 's',
      ctrlKey: true,
      action: () => onShuffle?.(),
      description: 'Toggle shuffle',
      category: 'Playback'
    },
    {
      key: 'r',
      ctrlKey: true,
      action: () => onRepeat?.(),
      description: 'Toggle repeat',
      category: 'Playback'
    }
  ];

  return useKeyboardShortcuts({ shortcuts, enabled });
}

// Navigation shortcuts
export function useNavigationShortcuts({
  onGoHome,
  onGoSearch,
  onGoLibrary,
  onGoSettings,
  enabled = true
}: {
  onGoHome?: () => void;
  onGoSearch?: () => void;
  onGoLibrary?: () => void;
  onGoSettings?: () => void;
  enabled?: boolean;
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      ctrlKey: true,
      action: () => onGoHome?.(),
      description: 'Go to Home',
      category: 'Navigation'
    },
    {
      key: '2',
      ctrlKey: true,
      action: () => onGoSearch?.(),
      description: 'Go to Search',
      category: 'Navigation'
    },
    {
      key: '3',
      ctrlKey: true,
      action: () => onGoLibrary?.(),
      description: 'Go to Library',
      category: 'Navigation'
    },
    {
      key: ',',
      ctrlKey: true,
      action: () => onGoSettings?.(),
      description: 'Go to Settings',
      category: 'Navigation'
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => onGoSearch?.(),
      description: 'Focus search',
      category: 'Navigation'
    }
  ];

  return useKeyboardShortcuts({ shortcuts, enabled });
}

// Format shortcut for display
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.shiftKey) parts.push('Shift');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.metaKey) parts.push('Cmd');
  
  // Format special keys
  let key = shortcut.key;
  switch (key.toLowerCase()) {
    case ' ':
      key = 'Space';
      break;
    case 'arrowup':
      key = '↑';
      break;
    case 'arrowdown':
      key = '↓';
      break;
    case 'arrowleft':
      key = '←';
      break;
    case 'arrowright':
      key = '→';
      break;
    default:
      key = key.toUpperCase();
  }
  
  parts.push(key);
  
  return parts.join(' + ');
}