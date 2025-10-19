'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Heart, Download, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AlbumImage } from '@/components/ui/ImageWithFallback'
import { cn, formatDuration } from '@/lib/utils'

interface Track {
  id: string
  name: string
  artist: string
  album: string
  image: string
  duration: number
  isLiked?: boolean
  isDownloaded?: boolean
  isPlaying?: boolean
  dateAdded?: string
}

interface TrackCardProps {
  track: Track
  index?: number
  onPlay: (trackId: string) => void
  onLike: (trackId: string) => void
  onDownload: (trackId: string) => void
  showImage?: boolean
  showIndex?: boolean
  compact?: boolean
  showDateAdded?: boolean
  className?: string
}

export function TrackCard({
  track,
  index,
  onPlay,
  onLike,
  onDownload,
  showImage = true,
  showIndex = false,
  compact = false,
  showDateAdded = false,
  className
}: TrackCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'group flex items-center p-2 rounded-md cursor-pointer transition-colors duration-200',
        className
      )}
    >
      {/* Index or Play Button */}
      <div className="w-8 flex items-center justify-center mr-4">
        {showIndex && !isHovered && !track.isPlaying ? (
          <span className="text-sm text-spotify-text">{index}</span>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPlay(track.id)}
            className="w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {track.isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white ml-0.5" />
            )}
          </Button>
        )}
      </div>

      {/* Track Image */}
      {showImage && (
        <div className="relative mr-4">
          <AlbumImage
            src={track.image}
            alt={track.name}
            size="sm"
          />
          {track.isPlaying && (
            <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            </div>
          )}
        </div>
      )}

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium truncate',
          track.isPlaying ? 'text-primary' : 'text-white'
        )}>
          {track.name}
        </p>
        <p className="text-xs text-spotify-text truncate">
          {track.artist}
        </p>
      </div>

      {/* Album Name or Date Added (hidden on mobile) */}
      {!compact && (
        <div className="hidden md:block flex-1 min-w-0 mx-4">
          <p className="text-sm text-spotify-text truncate">
            {track.album}
          </p>
        </div>
      )}

      {/* Date Added (hidden on mobile) */}
      {showDateAdded && track.dateAdded && (
        <div className="hidden md:block w-32 mx-4">
          <p className="text-sm text-spotify-text">
            {new Date(track.dateAdded).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike(track.id)}
          className={cn(
            'w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity',
            track.isLiked && 'opacity-100 text-primary'
          )}
        >
          <Heart className={cn('w-4 h-4', track.isLiked && 'fill-current')} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDownload(track.id)}
          className={cn(
            'w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity',
            track.isDownloaded && 'opacity-100 text-primary'
          )}
        >
          <Download className="w-4 h-4" />
        </Button>

        <span className="text-xs text-spotify-text w-12 text-right">
          {formatDuration(track.duration)}
        </span>

        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}