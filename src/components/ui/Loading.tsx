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
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <motion.div
              className={cn('backdrop-blur-xl bg-gradient-to-br from-white/10 to-green-500/20 border border-white/30 rounded-full p-3 shadow-2xl', sizeClasses[size])}
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <Loader2 className={cn('animate-spin text-white drop-shadow-lg', sizeClasses[size])} />
            </motion.div>
            {/* Glow effect */}
            <motion.div
              className={cn('absolute inset-0 rounded-full border border-green-400/50', sizeClasses[size])}
              animate={{
                scale: [1, 1.2],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          </div>
          {text && (
            <motion.div
              className="backdrop-blur-md bg-white/5 border border-white/20 rounded-lg px-3 py-1"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <p className={cn('text-white font-medium', textSizeClasses[size])}>
                {text}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="flex flex-col items-center gap-4">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full backdrop-blur-md bg-gradient-to-br from-green-400/80 to-purple-500/80 border border-white/30 shadow-lg"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6],
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
          {text && (
            <motion.div
              className="backdrop-blur-md bg-white/5 border border-white/20 rounded-lg px-3 py-1"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <p className={cn('text-white font-medium', textSizeClasses[size])}>
                {text}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <motion.div
              className={cn('rounded-full backdrop-blur-xl bg-gradient-to-br from-green-400/60 to-purple-500/60 border border-white/40 shadow-2xl', sizeClasses[size])}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Outer ripple effect */}
            <motion.div
              className={cn('absolute inset-0 rounded-full border-2 border-green-400/50', sizeClasses[size])}
              animate={{
                scale: [1, 1.8],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          </div>
          {text && (
            <motion.div
              className="backdrop-blur-md bg-white/5 border border-white/20 rounded-lg px-3 py-1"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <p className={cn('text-white font-medium', textSizeClasses[size])}>
                {text}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'music') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="flex flex-col items-center gap-6">
          {/* Main loader container with liquid glass effect */}
          <div className="relative">
            {/* Outer ring with liquid glass morphing */}
            <motion.div
              className="w-24 h-24 rounded-full backdrop-blur-xl bg-gradient-to-br from-white/10 via-green-500/20 to-purple-500/20 border border-white/30 shadow-2xl"
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              {/* Inner pulsing core */}
              <motion.div
                className="absolute inset-2 rounded-full bg-gradient-to-br from-green-400/30 to-purple-600/30 backdrop-blur-sm border border-white/20"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Central music icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      rotate: -360,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                      scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
                    }}
                  >
                    <Music className="w-6 h-6 text-white drop-shadow-lg" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-purple-500 shadow-lg"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                }}
                animate={{
                  rotate: 360,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeInOut',
                }}
                initial={{
                  x: Math.round(Math.cos((i * 60) * Math.PI / 180) * 40),
                  y: Math.round(Math.sin((i * 60) * Math.PI / 180) * 40),
                }}
              />
            ))}

            {/* Ripple effects */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`ripple-${i}`}
                className="absolute inset-0 rounded-full border border-green-400/30"
                animate={{
                  scale: [1, 2.5],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Audio wave visualization */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`wave-${i}`}
                className="w-1 bg-gradient-to-t from-green-500 to-purple-500 rounded-full"
                animate={{
                  height: [8, 24, 8],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Enhanced text with liquid glass effect */}
          {text && (
            <motion.div
              className="backdrop-blur-md bg-white/5 border border-white/20 rounded-xl px-4 py-2"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <p className={cn('text-white font-medium drop-shadow-lg', textSizeClasses[size])}>
                {text}
              </p>
            </motion.div>
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

// Skeleton loading for cards with liquid glass effects
export function SkeletonCard() {
  return (
    <motion.div 
      className="backdrop-blur-xl bg-gradient-to-br from-white/5 via-gray-500/10 to-black/20 border border-white/20 rounded-xl p-4 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Album/Playlist Image Skeleton */}
      <motion.div 
        className="relative aspect-square mb-4 rounded-xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-gray-400/20 to-gray-600/30 border border-white/10"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
      
      {/* Text Skeletons */}
      <div className="space-y-3">
        <motion.div 
          className="backdrop-blur-sm bg-gradient-to-r from-gray-400/30 to-gray-500/20 border border-white/10 rounded-lg h-4 w-3/4"
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        />
        <motion.div 
          className="backdrop-blur-sm bg-gradient-to-r from-gray-500/20 to-gray-400/30 border border-white/10 rounded-lg h-3 w-1/2"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.4,
          }}
        />
      </div>
    </motion.div>
  );
}

// Skeleton loading for track rows with liquid glass effects
export function SkeletonTrack() {
  return (
    <motion.div 
      className="flex items-center gap-4 p-3 backdrop-blur-md bg-gradient-to-r from-white/5 to-gray-500/10 border border-white/10 rounded-lg shadow-lg"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Track Image Skeleton */}
      <motion.div 
        className="relative w-12 h-12 rounded-lg overflow-hidden backdrop-blur-sm bg-gradient-to-br from-gray-400/30 to-gray-600/20 border border-white/10"
        animate={{
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
      
      {/* Track Info Skeletons */}
      <div className="flex-1 space-y-2">
        <motion.div 
          className="backdrop-blur-sm bg-gradient-to-r from-gray-400/25 to-gray-500/15 border border-white/10 rounded h-4 w-1/3"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.1,
          }}
        />
        <motion.div 
          className="backdrop-blur-sm bg-gradient-to-r from-gray-500/15 to-gray-400/25 border border-white/10 rounded h-3 w-1/4"
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        />
      </div>
      
      {/* Duration Skeleton */}
      <motion.div 
        className="backdrop-blur-sm bg-gradient-to-r from-gray-400/20 to-gray-500/10 border border-white/10 rounded h-3 w-12"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3,
        }}
      />
    </motion.div>
  );
}

// Homepage skeleton loader - content only (sidebar/navbar rendered by AppLayout)
export function HomepageSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section Skeleton */}
      <div className="mb-6">
        <div className="liquid-glass-strong rounded-2xl p-8 border border-white/10">
          <div className="h-10 w-80 bg-white/10 rounded-xl mb-4 animate-pulse" />
          <div className="h-6 w-64 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Quick Access Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={`quick-${i}`}
            className="flex items-center liquid-glass rounded-lg overflow-hidden"
          >
            <div className="w-16 h-16 bg-white/10 animate-pulse" />
            <div className="flex-1 px-4">
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Recently Played Section Skeleton */}
      <section className="liquid-glass rounded-2xl p-6 border border-white/5">
        <div className="h-7 w-40 bg-white/10 rounded-lg mb-6 animate-pulse" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={`recent-${i}`} className="flex items-center p-3 rounded-lg">
              <div className="w-8 mr-4">
                <div className="h-4 w-4 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-md mr-4 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-white/10 rounded mb-2 animate-pulse" />
                <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Made For You Section Skeleton */}
      <section className="liquid-glass rounded-2xl p-6 border border-white/5">
        <div className="h-7 w-32 bg-white/10 rounded-lg mb-6 animate-pulse" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={`made-${i}`} className="flex items-center p-3 rounded-lg">
              <div className="w-8 mr-4">
                <div className="h-4 w-4 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-md mr-4 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-white/10 rounded mb-2 animate-pulse" />
                <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Playlists Section Skeleton */}
      <section className="liquid-glass rounded-2xl p-6 border border-white/5">
        <div className="h-7 w-36 bg-white/10 rounded-lg mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={`playlist-${i}`} className="p-4 rounded-xl bg-white/5">
              <div className="w-full aspect-square bg-white/10 rounded-lg mb-4 animate-pulse" />
              <div className="h-4 w-24 bg-white/10 rounded mb-2 animate-pulse" />
              <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Search page skeleton loader
export function SearchPageSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search Input Skeleton */}
      <div className="sticky top-0 z-20 py-4 -mx-6 px-6">
        <div className="liquid-glass-strong rounded-2xl p-4 border border-white/10">
          <div className="relative max-w-2xl mx-auto">
            <div className="h-12 bg-white/10 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Browse Categories Skeleton */}
      <section className="liquid-glass rounded-2xl p-6 border border-white/5">
        <div className="h-7 w-28 bg-white/10 rounded-lg mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={`cat-${i}`}
              className="h-32 rounded-xl bg-gradient-to-br from-white/10 to-white/5 animate-pulse"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// Library page skeleton loader
export function LibraryPageSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Skeleton */}
      <div className="liquid-glass-strong rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 w-40 bg-white/10 rounded-lg animate-pulse" />
          <div className="flex space-x-2">
            <div className="h-10 w-10 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-10 w-10 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </div>
        {/* Tabs Skeleton */}
        <div className="flex space-x-2">
          {[...Array(4)].map((_, i) => (
            <div key={`tab-${i}`} className="h-10 w-24 bg-white/10 rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <section className="liquid-glass rounded-2xl p-6 border border-white/5">
        <div className="h-7 w-32 bg-white/10 rounded-lg mb-6 animate-pulse" />
        
        {/* Grid View Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={`item-${i}`} className="p-4 rounded-xl bg-white/5">
              <div className="w-full aspect-square bg-white/10 rounded-lg mb-4 animate-pulse" />
              <div className="h-4 w-24 bg-white/10 rounded mb-2 animate-pulse" />
              <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
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