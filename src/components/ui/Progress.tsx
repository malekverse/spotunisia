'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  variant?: 'default' | 'music' | 'loading' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  animated?: boolean
}

export function Progress({
  value = 0,
  max = 100,
  variant = 'default',
  size = 'md',
  showValue = false,
  animated = false,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const baseClasses = 'relative w-full overflow-hidden rounded-full'
  
  const variants = {
    default: 'bg-spotify-gray',
    music: 'bg-spotify-gray hover:bg-spotify-light-gray cursor-pointer',
    loading: 'bg-spotify-dark-gray',
    gradient: 'bg-gradient-to-r from-spotify-gray to-spotify-light-gray',
  }
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const fillVariants = {
    default: 'bg-spotify-green',
    music: 'bg-spotify-green hover:bg-spotify-green-hover',
    loading: 'bg-gradient-to-r from-spotify-green to-spotify-green-hover',
    gradient: 'bg-gradient-to-r from-spotify-green via-spotify-green-hover to-spotify-green',
  }

  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      <div className={cn(baseClasses, variants[variant], sizes[size])}>
        <motion.div
          className={cn('h-full rounded-full transition-all duration-300', fillVariants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 0.5 : 0.3, 
            ease: "easeOut" 
          }}
        />
        
        {/* Glow effect for music variant */}
        {variant === 'music' && percentage > 0 && (
          <motion.div
            className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
            style={{ left: `${percentage}%`, marginLeft: '-6px' }}
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
          />
        )}
        
        {/* Loading animation */}
        {variant === 'loading' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        )}
      </div>
      
      {showValue && (
        <span className="text-xs text-spotify-text font-medium min-w-[3rem] text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}

// Music-specific progress component
export function MusicProgress({
  currentTime = 0,
  duration = 0,
  onSeek,
  className,
  ...props
}: {
  currentTime?: number
  duration?: number
  onSeek?: (time: number) => void
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const progressRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!progressRef.current || !onSeek) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * duration
    
    onSeek(Math.max(0, Math.min(newTime, duration)))
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp)
      return () => document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div className={cn('flex items-center gap-3 w-full', className)} {...props}>
      <span className="text-xs text-spotify-text font-medium min-w-[2.5rem]">
        {formatTime(currentTime)}
      </span>
      
      <div 
        ref={progressRef}
        className="flex-1 group cursor-pointer"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
      >
        <Progress
          value={currentTime}
          max={duration}
          variant="music"
          size="sm"
          className="group-hover:scale-y-150 transition-transform duration-200"
        />
      </div>
      
      <span className="text-xs text-spotify-text font-medium min-w-[2.5rem]">
        {formatTime(duration)}
      </span>
    </div>
  )
}