'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glass' | 'outlined' | 'filled' | 'liquid-glass' | 'liquid-glass-strong'
  error?: boolean
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', error = false, success = false, ...props }, ref) => {
    const baseClasses = 'flex w-full rounded-lg border transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spotify-green disabled:cursor-not-allowed disabled:opacity-50'
    
    const variants = {
      default: 'bg-spotify-dark-gray border-spotify-gray/30 text-white placeholder:text-spotify-text hover:border-spotify-gray/50 focus:border-spotify-green',
      glass: 'bg-white/10 border-white/20 text-white placeholder:text-white/60 hover:border-white/30 focus:border-spotify-green',
      outlined: 'bg-transparent border-2 border-spotify-gray/50 text-white placeholder:text-spotify-text hover:border-spotify-green/50 focus:border-spotify-green',
      filled: 'bg-spotify-gray border-transparent text-white placeholder:text-spotify-text hover:bg-spotify-light-gray focus:bg-spotify-light-gray focus:border-spotify-green',
      'liquid-glass': 'bg-white/5 border-white/20 text-white placeholder:text-white/60 hover:border-white/30 focus:border-spotify-green',
      'liquid-glass-strong': 'bg-white/10 border-white/30 text-white placeholder:text-white/70 hover:border-white/40 focus:border-spotify-green',
    }

    const statusClasses = error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : success 
      ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
      : ''

    return (
      <input
        type={type}
        className={cn(
          baseClasses,
          variants[variant],
          statusClasses,
          'h-10 px-3 py-2 text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
