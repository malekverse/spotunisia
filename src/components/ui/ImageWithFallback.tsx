'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface ImageWithFallbackProps {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
  width?: number
  height?: number
  onLoad?: () => void
  onError?: () => void
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  className,
  width,
  height,
  onLoad,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
    onError?.()
  }

  const handleLoad = () => {
    onLoad?.()
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn('object-cover', className)}
      width={width}
      height={height}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  )
}

// Specific components for different image types
interface PlaylistImageProps {
  src: string
  alt: string
  className?: string
}

export function PlaylistImage({ src, alt, className }: PlaylistImageProps) {
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      fallbackSrc="/placeholder-playlist.svg"
      className={cn('w-full aspect-square rounded-md', className)}
    />
  )
}

interface AlbumImageProps {
  src: string
  alt: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-full aspect-square'
}

export function AlbumImage({ src, alt, className, size = 'lg' }: AlbumImageProps) {
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      fallbackSrc="/placeholder-album.svg"
      className={cn('rounded', sizeClasses[size], className)}
    />
  )
}