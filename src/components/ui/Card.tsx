'use client'

import * as React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: 'default' | 'glass' | 'elevated' | 'outlined' | 'gradient' | 'liquid-glass' | 'liquid-glass-strong' | 'liquid-glass-morphing'
  hover?: boolean
  interactive?: boolean
  children?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, interactive = false, ...props }, ref) => {
    const baseClasses = 'rounded-xl transition-all duration-300'
    
    const variants = {
      default: 'bg-spotify-dark-gray border border-spotify-gray/20 text-white',
      glass: 'glass border border-white/10 text-white',
      elevated: 'bg-spotify-dark-gray shadow-2xl border border-spotify-gray/20 text-white',
      outlined: 'bg-transparent border-2 border-spotify-gray/30 text-white',
      gradient: 'bg-gradient-to-br from-spotify-dark-gray to-spotify-gray border border-spotify-light-gray/20 text-white',
      'liquid-glass': 'liquid-glass border border-white/10 text-white',
      'liquid-glass-strong': 'liquid-glass-strong border border-white/20 text-white',
      'liquid-glass-morphing': 'liquid-glass-morphing border border-white/15 text-white',
    }

    const hoverEffects = hover ? 'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1' : ''
    const interactiveEffects = interactive ? 'cursor-pointer hover-lift' : ''

    const MotionDiv = motion.div

    return (
      <MotionDiv
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={interactive ? { 
          scale: 1.02,
          transition: { duration: 0.2, ease: "easeOut" }
        } : undefined}
        className={cn(
          baseClasses,
          variants[variant],
          hoverEffects,
          interactiveEffects,
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight text-white',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-spotify-text', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }