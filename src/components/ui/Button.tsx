'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'destructive' | 'glass' | 'liquid-glass' | 'gradient' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  rounded?: boolean
  glow?: boolean
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
  glow = false,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group'
  
  const variants = {
    default: 'bg-spotify-gray text-white hover:bg-spotify-light-gray border border-spotify-light-gray/20',
    primary: 'bg-spotify-green text-black hover:bg-spotify-green-hover font-semibold shadow-lg hover:shadow-xl',
    secondary: 'bg-spotify-dark-gray text-white hover:bg-spotify-gray border border-spotify-gray/30',
    ghost: 'text-spotify-text hover:text-white hover:bg-spotify-gray/50',
    destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-lg',
    glass: 'glass text-white hover:bg-white/10 border-white/20',
    'liquid-glass': 'liquid-glass-hover text-white border-white/20',
    gradient: 'bg-gradient-to-r from-spotify-green to-spotify-green-hover text-black font-semibold shadow-lg hover:shadow-xl',
    outline: 'border-2 border-spotify-green text-spotify-green hover:bg-spotify-green hover:text-black',
  }
  
  const sizes = {
    xs: 'h-7 px-2 text-xs rounded-md',
    sm: 'h-8 px-3 text-sm rounded-md',
    md: 'h-10 px-4 py-2 rounded-lg',
    lg: 'h-12 px-6 text-lg rounded-lg',
    xl: 'h-14 px-8 text-xl rounded-xl',
  }

  const glowEffect = glow ? 'hover-glow' : ''
  const roundedClass = rounded ? 'rounded-full' : ''
  const fullWidthClass = fullWidth ? 'w-full' : ''

  return (
    <motion.button
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1, ease: "easeOut" }
      }}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        glowEffect,
        roundedClass,
        fullWidthClass,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effect */}
      <span className="absolute inset-0 overflow-hidden rounded-inherit">
        <span className="absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 transition-transform duration-300 rounded-inherit" />
      </span>
      
      {/* Content */}
      <span className="relative flex items-center gap-2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </>
        )}
      </span>
      
      {/* Gradient overlay for enhanced hover effect */}
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      )}
    </motion.button>
  )
}