'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  variant?: 'default' | 'spinner' | 'dots' | 'pulse' | 'music';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loading({ 
  variant = 'default', 
  size = 'md', 
  text,
  className 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'spinner') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={cn('animate-spin text-green-500', sizeClasses[size])} />
          {text && (
            <p className={cn('text-zinc-400', textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          {text && (
            <p className={cn('text-zinc-400', textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="flex flex-col items-center gap-3">
          <motion.div
            className={cn('bg-green-500 rounded-full', sizeClasses[size])}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
          {text && (
            <p className={cn('text-zinc-400', textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'music') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Music className={cn('text-green-500', sizeClasses[size])} />
          </motion.div>
          {text && (
            <p className={cn('text-zinc-400', textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default variant - skeleton-like loading
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className={cn('bg-zinc-700 rounded', sizeClasses[size])}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {text && (
          <p className={cn('text-zinc-400', textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

// Page-level loading component
export function PageLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loading variant="music" size="lg" text={text} />
    </div>
  );
}

// Skeleton loading for cards
export function SkeletonCard() {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 animate-pulse">
      <div className="bg-zinc-700 rounded-lg aspect-square mb-4"></div>
      <div className="space-y-2">
        <div className="bg-zinc-700 rounded h-4 w-3/4"></div>
        <div className="bg-zinc-700 rounded h-3 w-1/2"></div>
      </div>
    </div>
  );
}

// Skeleton loading for track rows
export function SkeletonTrack() {
  return (
    <div className="flex items-center gap-4 p-2 animate-pulse">
      <div className="bg-zinc-700 rounded w-12 h-12"></div>
      <div className="flex-1 space-y-2">
        <div className="bg-zinc-700 rounded h-4 w-1/3"></div>
        <div className="bg-zinc-700 rounded h-3 w-1/4"></div>
      </div>
      <div className="bg-zinc-700 rounded h-3 w-12"></div>
    </div>
  );
}

// Loading overlay for components
export function LoadingOverlay({ 
  isLoading, 
  children, 
  text = 'Loading...' 
}: { 
  isLoading: boolean; 
  children: React.ReactNode; 
  text?: string;
}) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <Loading variant="spinner" text={text} />
        </div>
      )}
    </div>
  );
}