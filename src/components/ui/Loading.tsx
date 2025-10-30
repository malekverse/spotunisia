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

// Homepage skeleton loader with liquid glass effects that matches the actual layout
export function HomepageSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-spotify-black">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Skeleton */}
        <div className="w-64 flex-shrink-0 hidden md:block">
          <div className="flex flex-col h-full liquid-glass border-r border-white/10 text-white">
            {/* Logo Skeleton */}
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-10 h-10 backdrop-blur-sm bg-gradient-to-br from-gray-400/30 to-gray-500/20 border border-white/10 rounded-xl"
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div 
                  className="backdrop-blur-sm bg-gradient-to-r from-gray-400/25 to-gray-500/15 border border-white/10 rounded-lg h-6 w-32"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.2,
                  }}
                />
              </div>
            </motion.div>

            {/* Navigation Skeleton */}
            <motion.div 
              className="px-3 space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`nav-${i}`}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <motion.div 
                    className="w-5 h-5 backdrop-blur-sm bg-gradient-to-br from-gray-400/30 to-gray-500/20 border border-white/10 rounded"
                    animate={{
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                      duration: 1.5 + i * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.1,
                    }}
                  />
                  <motion.div 
                    className="backdrop-blur-sm bg-gradient-to-r from-gray-400/25 to-gray-500/15 border border-white/10 rounded h-4 w-20"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 1.3 + i * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.15,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Create Playlist Button Skeleton */}
            <motion.div 
              className="px-6 py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div 
                className="backdrop-blur-md bg-gradient-to-r from-gray-400/20 to-gray-500/10 border border-white/10 rounded-xl h-10 w-full"
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* Library Section Skeleton */}
            <motion.div 
              className="flex-1 px-3 space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div 
                className="px-4 py-3 backdrop-blur-sm bg-gradient-to-r from-gray-400/20 to-gray-500/10 border border-white/10 rounded h-4 w-24"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              />
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`library-${i}`}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                >
                  <motion.div 
                    className="w-5 h-5 backdrop-blur-sm bg-gradient-to-br from-gray-400/30 to-gray-500/20 border border-white/10 rounded"
                    animate={{
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                      duration: 1.4 + i * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.5 + i * 0.1,
                    }}
                  />
                  <motion.div 
                    className="backdrop-blur-sm bg-gradient-to-r from-gray-400/25 to-gray-500/15 border border-white/10 rounded h-4 w-24"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 1.2 + i * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.5 + i * 0.15,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Install App Button Skeleton */}
            <motion.div 
              className="p-6 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.div 
                className="backdrop-blur-md bg-gradient-to-r from-gray-400/20 to-gray-500/10 border border-white/10 rounded-xl h-10 w-full"
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.8,
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar Skeleton */}
          <motion.div 
            className="sticky top-0 z-10 backdrop-blur-md bg-gradient-to-r from-spotify-gray/80 to-spotify-black/80 border-b border-white/10 p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-8 h-8 backdrop-blur-sm bg-gradient-to-br from-gray-400/30 to-gray-500/20 border border-white/10 rounded-full"
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div 
                  className="w-8 h-8 backdrop-blur-sm bg-gradient-to-br from-gray-400/30 to-gray-500/20 border border-white/10 rounded-full"
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.2,
                  }}
                />
              </div>
              <motion.div 
                className="w-10 h-10 backdrop-blur-sm bg-gradient-to-br from-gray-400/30 to-gray-500/20 border border-white/10 rounded-full"
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.4,
                }}
              />
            </div>
          </motion.div>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-gray/50 to-spotify-black p-6">
            <div className="space-y-8">
              {/* Welcome Section Skeleton */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <motion.div
                  className="liquid-glass-strong rounded-2xl p-8 mb-6 border border-white/10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <motion.div 
                    className="backdrop-blur-sm bg-gradient-to-r from-gray-400/30 to-gray-500/20 border border-white/10 rounded-xl h-10 w-80 mb-4"
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.div 
                    className="backdrop-blur-sm bg-gradient-to-r from-gray-500/20 to-gray-400/30 border border-white/10 rounded-lg h-6 w-64"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.2,
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Quick Access Cards Skeleton */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`quick-access-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="liquid-glass-hover rounded-xl p-4 flex items-center space-x-4 border border-white/10"
                  >
                    <motion.div 
                      className="w-14 h-14 backdrop-blur-sm bg-gradient-to-br from-gray-400/30 to-gray-500/20 border border-white/10 rounded-lg"
                      animate={{
                        opacity: [0.4, 0.7, 0.4],
                      }}
                      transition={{
                        duration: 1.5 + i * 0.1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.1,
                      }}
                    />
                    <motion.div 
                      className="backdrop-blur-sm bg-gradient-to-r from-gray-400/25 to-gray-500/15 border border-white/10 rounded h-4 w-32"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 1.3 + i * 0.1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.15,
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Recently Played Section Skeleton */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="liquid-glass rounded-2xl p-6 border border-white/10"
              >
                <motion.div 
                  className="backdrop-blur-sm bg-gradient-to-r from-gray-400/25 to-gray-500/15 border border-white/10 rounded-lg h-8 w-48 mb-6"
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <div className="space-y-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`recent-${i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
                    >
                      <SkeletonTrack />
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Made For You Section Skeleton */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="liquid-glass rounded-2xl p-6 border border-white/10"
              >
                <motion.div 
                  className="backdrop-blur-sm bg-gradient-to-r from-gray-400/25 to-gray-500/15 border border-white/10 rounded-lg h-8 w-36 mb-6"
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.3,
                  }}
                />
                <div className="space-y-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`made-for-you-${i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
                    >
                      <SkeletonTrack />
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Popular Playlists Section Skeleton */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="liquid-glass rounded-2xl p-6 border border-white/10"
              >
                <motion.div 
                  className="backdrop-blur-sm bg-gradient-to-r from-gray-400/25 to-gray-500/15 border border-white/10 rounded-lg h-8 w-44 mb-6"
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`popular-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: (i * 0.1) + 0.3, ease: 'easeOut' }}
                    >
                      <SkeletonCard />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </div>
          </main>
        </div>
      </div>

      {/* Music Player Skeleton */}
      <motion.div 
        className="h-20 bg-spotify-dark-gray border-t border-white/10 flex items-center justify-between px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-14 h-14 backdrop-blur-sm bg-gradient-to-br from-gray-400/30 to-gray-500/20 border border-white/10 rounded-lg"
            animate={{
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div className="space-y-2">
            <motion.div 
              className="backdrop-blur-sm bg-gradient-to-r from-gray-400/25 to-gray-500/15 border border-white/10 rounded h-4 w-32"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2,
              }}
            />
            <motion.div 
              className="backdrop-blur-sm bg-gradient-to-r from-gray-500/15 to-gray-400/25 border border-white/10 rounded h-3 w-24"
              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.4,
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`player-control-${i}`}
              className="w-8 h-8 backdrop-blur-sm bg-gradient-to-br from-gray-400/30 to-gray-500/20 border border-white/10 rounded-full"
              animate={{
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 1.5 + i * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`player-right-${i}`}
              className="w-6 h-6 backdrop-blur-sm bg-gradient-to-br from-gray-400/30 to-gray-500/20 border border-white/10 rounded"
              animate={{
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 1.3 + i * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </motion.div>
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