'use client'

import React from 'react'
import { Heart, MoreHorizontal, Download, Loader2 } from 'lucide-react'
import { AlbumImage } from '@/components/ui/ImageWithFallback'
import { cn } from '@/lib/utils'

interface Track {
  id: string
  name: string
  artist: string
  album: string
  image: string
  duration: number
  preview_url?: string | null
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
  onDownload?: (track: Track) => void
  onMore?: (track: Track) => void
  showImage?: boolean
  showIndex?: boolean
  compact?: boolean
  showDateAdded?: boolean
  className?: string
  isDownloading?: boolean
}

export function TrackCard({
  track,
  index,
  onPlay,
  onLike,
  onDownload,
  onMore,
  showImage = true,
  showIndex = false,
  compact = false,
  showDateAdded = false,
  className,
  isDownloading = false
}: TrackCardProps) {
  
  const handlePlayClick = () => {
    console.log('Track clicked:', track.name)
    if (typeof window !== 'undefined' && window.playTrack) {
      // Convert null preview_url to undefined for window.playTrack
      window.playTrack({
        ...track,
        preview_url: track.preview_url ?? undefined
      })
    } else {
      onPlay(track.id)
    }
  }

  return (
    <div
      onClick={handlePlayClick}
      className={cn(
        'group flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300',
        'hover:bg-white/5 hover:shadow-lg hover:shadow-black/20',
        track.isPlaying && 'liquid-glass-strong border border-spotify-green/20 shadow-lg shadow-spotify-green/10',
        className
      )}
    >
      {/* Index */}
      {showIndex && (
        <div className="w-8 flex items-center justify-center mr-4">
          <span className={cn(
            'text-sm font-medium tabular-nums',
            track.isPlaying ? 'text-spotify-green' : 'text-white/50'
          )}>
            {index}
          </span>
        </div>
      )}

      {/* Track Image */}
      {showImage && (
        <div className="relative mr-4">
          <div className={cn(
            'w-12 h-12 rounded-lg overflow-hidden shadow-lg transition-all duration-300',
            'group-hover:shadow-xl group-hover:scale-105',
            track.isPlaying && 'ring-2 ring-spotify-green/50'
          )}>
            <AlbumImage
              src={track.image}
              alt={track.name}
              size="sm"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Playing Indicator */}
          {track.isPlaying && (
            <div className="absolute -bottom-1 -right-1 animate-scale-in">
              <div className="flex space-x-0.5 bg-black/80 backdrop-blur-sm rounded-full px-1.5 py-1">
                <div className="w-0.5 bg-spotify-green rounded-full animate-pulse" style={{ height: '6px', animationDelay: '0ms' }} />
                <div className="w-0.5 bg-spotify-green rounded-full animate-pulse" style={{ height: '10px', animationDelay: '150ms' }} />
                <div className="w-0.5 bg-spotify-green rounded-full animate-pulse" style={{ height: '6px', animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h4 className={cn(
          'font-semibold truncate text-sm transition-colors duration-300',
          track.isPlaying ? 'text-spotify-green' : 'text-white group-hover:text-white'
        )}>
          {track.name}
        </h4>
        <p className="text-xs text-white/50 truncate group-hover:text-white/70 transition-colors duration-300">
          {track.artist}
        </p>
      </div>

      {/* Album Name (hidden on mobile) */}
      {!compact && (
        <div className="hidden md:block flex-1 min-w-0 mx-4">
          <p className="text-sm text-white/40 truncate group-hover:text-white/60 transition-colors duration-300">
            {track.album}
          </p>
        </div>
      )}

      {/* Date Added (hidden on mobile) */}
      {showDateAdded && track.dateAdded && (
        <div className="hidden md:block w-28 mx-4">
          <p className="text-sm text-white/40 tabular-nums">
            {new Date(track.dateAdded).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Action Buttons - Always Visible */}
      <div className="flex items-center space-x-1">
        {/* Like Button */}
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation()
            onLike?.(track.id)
          }}
        >
          <Heart 
            className={cn(
              'w-5 h-5 transition-all duration-300',
              track.isLiked 
                ? 'text-spotify-green fill-current scale-110' 
                : 'text-white/40 hover:text-white hover:scale-110'
            )} 
          />
        </button>

        {/* Download Button */}
        {onDownload && (
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
            onClick={(e) => {
              e.stopPropagation()
              onDownload?.(track)
            }}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin text-spotify-green" />
            ) : (
              <Download 
                className={cn(
                  'w-5 h-5 transition-all duration-300',
                  track.isDownloaded 
                    ? 'text-spotify-green' 
                    : 'text-white/40 hover:text-white hover:scale-110'
                )} 
              />
            )}
          </button>
        )}

        {/* More Options Button */}
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation()
            onMore?.(track)
          }}
        >
          <MoreHorizontal className="w-5 h-5 text-white/40 hover:text-white transition-colors duration-300" />
        </button>
      </div>
    </div>
  )
}
