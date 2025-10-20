'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  delay?: number
  className?: string
  variant?: 'default' | 'dark' | 'glass' | 'liquid-glass' | 'liquid-glass-strong'
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 500,
  className,
  variant = 'default',
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const variants = {
    default: 'bg-spotify-dark-gray border border-spotify-gray/20 text-white',
    dark: 'bg-spotify-black border border-spotify-gray/30 text-white',
    glass: 'glass border border-white/10 text-white',
    'liquid-glass': 'liquid-glass border border-white/10 text-white',
    'liquid-glass-strong': 'liquid-glass-strong border border-white/20 text-white',
  }

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        let x = 0
        let y = 0

        // Calculate position based on side
        switch (side) {
          case 'top':
            x = rect.left + rect.width / 2
            y = rect.top - 8
            break
          case 'bottom':
            x = rect.left + rect.width / 2
            y = rect.bottom + 8
            break
          case 'left':
            x = rect.left - 8
            y = rect.top + rect.height / 2
            break
          case 'right':
            x = rect.right + 8
            y = rect.top + rect.height / 2
            break
        }

        setPosition({ x, y })
        setIsVisible(true)
      }
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getTransformOrigin = () => {
    switch (side) {
      case 'top':
        return 'bottom center'
      case 'bottom':
        return 'top center'
      case 'left':
        return 'right center'
      case 'right':
        return 'left center'
      default:
        return 'center'
    }
  }

  const getTranslateClasses = () => {
    switch (side) {
      case 'top':
        return '-translate-x-1/2 -translate-y-full'
      case 'bottom':
        return '-translate-x-1/2'
      case 'left':
        return '-translate-x-full -translate-y-1/2'
      case 'right':
        return '-translate-y-1/2'
      default:
        return '-translate-x-1/2 -translate-y-full'
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              zIndex: 9999,
              transformOrigin: getTransformOrigin(),
            }}
            className={cn(
              'px-3 py-2 text-xs font-medium rounded-lg shadow-lg pointer-events-none',
              'max-w-xs break-words',
              getTranslateClasses(),
              variants[variant],
              className
            )}
          >
            {content}
            
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-2 h-2 rotate-45',
                variants[variant].includes('glass') ? 'glass' : 'bg-inherit border-inherit',
                {
                  'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-t border-l': side === 'top',
                  'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-b border-r': side === 'bottom',
                  'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-t border-r': side === 'left',
                  'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-b border-l': side === 'right',
                }
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Simple tooltip hook for programmatic use
export function useTooltip() {
  const [isVisible, setIsVisible] = React.useState(false)
  const [content, setContent] = React.useState<React.ReactNode>('')
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  const show = (content: React.ReactNode, x: number, y: number) => {
    setContent(content)
    setPosition({ x, y })
    setIsVisible(true)
  }

  const hide = () => {
    setIsVisible(false)
  }

  return { isVisible, content, position, show, hide }
}