'use client'

import * as React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface InputProps extends Omit<HTMLMotionProps<"input">, 'size'> {
  variant?: 'default' | 'glass' | 'outlined' | 'filled' | 'liquid-glass' | 'liquid-glass-strong'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  error?: boolean
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    variant = 'default',
    size = 'md',
    icon,
    iconPosition = 'left',
    error = false,
    success = false,
    ...props 
  }, ref) => {
    const baseClasses = 'flex w-full rounded-lg border transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spotify-green focus-visible:ring-offset-2 focus-visible:ring-offset-spotify-black disabled:cursor-not-allowed disabled:opacity-50'
    
    const variants = {
      default: 'bg-spotify-dark-gray border-spotify-gray/30 text-white placeholder:text-spotify-text hover:border-spotify-gray/50 focus:border-spotify-green',
      glass: 'glass border-white/20 text-white placeholder:text-white/60 hover:border-white/30 focus:border-spotify-green',
      outlined: 'bg-transparent border-2 border-spotify-gray/50 text-white placeholder:text-spotify-text hover:border-spotify-green/50 focus:border-spotify-green',
      filled: 'bg-spotify-gray border-transparent text-white placeholder:text-spotify-text hover:bg-spotify-light-gray focus:bg-spotify-light-gray focus:border-spotify-green',
      'liquid-glass': 'liquid-glass border-white/20 text-white placeholder:text-white/60 hover:border-white/30 focus:liquid-glass-strong focus:border-spotify-green',
      'liquid-glass-strong': 'liquid-glass-strong border-white/30 text-white placeholder:text-white/70 hover:border-white/40 focus:border-spotify-green',
    }
    
    const sizes = {
      sm: 'h-8 px-3 py-1 text-sm',
      md: 'h-10 px-3 py-2 text-sm',
      lg: 'h-12 px-4 py-3 text-base',
    }

    const statusClasses = error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : success 
      ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
      : ''

    const inputClasses = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      statusClasses,
      icon && iconPosition === 'left' ? 'pl-10' : '',
      icon && iconPosition === 'right' ? 'pr-10' : '',
      className
    )

    if (icon) {
      return (
        <div className="relative">
          {iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-text">
              {icon}
            </div>
          )}
          <motion.input
            type={type}
            className={inputClasses}
            ref={ref}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            {...props}
          />
          {iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-spotify-text">
              {icon}
            </div>
          )}
        </div>
      )
    }

    return (
      <motion.input
        type={type}
        className={inputClasses}
        ref={ref}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }