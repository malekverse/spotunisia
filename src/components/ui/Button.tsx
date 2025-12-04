'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'destructive' | 'glass' | 'liquid-glass' | 'gradient' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  rounded?: boolean
}

export function Button({
  variant = 'default',
  size = 'md',
  className,
  children,
  loading = false,
  disabled,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spotify-green disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    default: 'bg-spotify-gray text-white hover:bg-spotify-light-gray',
    primary: 'bg-spotify-green text-black hover:bg-spotify-green/90 font-semibold',
    secondary: 'bg-spotify-dark-gray text-white hover:bg-spotify-gray',
    ghost: 'text-spotify-text hover:text-white hover:bg-white/10',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    glass: 'bg-white/10 text-white hover:bg-white/20 border border-white/20',
    'liquid-glass': 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
    gradient: 'bg-gradient-to-r from-spotify-green to-green-400 text-black font-semibold',
    outline: 'border-2 border-spotify-green text-spotify-green hover:bg-spotify-green hover:text-black',
  }
  
  const sizes = {
    xs: 'h-7 px-2 text-xs rounded-md',
    sm: 'h-8 px-3 text-sm rounded-md',
    md: 'h-10 px-4 py-2 rounded-lg',
    lg: 'h-12 px-6 text-lg rounded-lg',
    xl: 'h-14 px-8 text-xl rounded-xl',
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        rounded && 'rounded-full',
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      )}
    </button>
  )
}
