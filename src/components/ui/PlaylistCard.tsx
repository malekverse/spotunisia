'use client'

import React from 'react'
import { Play, Download } from 'lucide-react'
import { PlaylistImage } from '@/components/ui/ImageWithFallback'
import { cn } from '@/lib/utils'

interface Playlist {
  id: string
  name: string
  description?: string
  image: string
  owner: string
  trackCount: number
  isPlaying?: boolean
}

interface PlaylistCardProps {
  playlist: Playlist
  onPlay: (playlistId: string) => void
  onDownload?: (playlist: Playlist) => void
  className?: string
}

export function PlaylistCard({ playlist, onPlay, onDownload, className }: PlaylistCardProps) {
  return (
    <div
      className={cn(
        'group p-4 rounded-xl cursor-pointer transition-all duration-300',
        'liquid-glass-hover hover:shadow-xl hover:shadow-black/30',
        'border border-transparent hover:border-white/10',
        className
      )}
      onClick={() => onPlay(playlist.id)}
    >
      {/* Playlist Image */}
      <div className="relative mb-4">
        <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-all duration-300">
          <PlaylistImage
            src={playlist.image}
            alt={playlist.name}
            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Play Button */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPlay(playlist.id)
            }}
            className="w-12 h-12 rounded-full bg-spotify-green text-black flex items-center justify-center shadow-lg shadow-spotify-green/30 hover:scale-105 hover:shadow-spotify-green/50 transition-all duration-300"
          >
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          </button>
        </div>

        {/* Download Button */}
        {onDownload && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDownload(playlist)
              }}
              className="w-8 h-8 rounded-full liquid-glass-strong text-white flex items-center justify-center hover:bg-white/20 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Playing indicator */}
        {playlist.isPlaying && (
          <div className="absolute top-2 left-2">
            <div className="flex space-x-0.5 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
              <div className="w-0.5 bg-spotify-green rounded-full animate-pulse" style={{ height: '8px' }} />
              <div className="w-0.5 bg-spotify-green rounded-full animate-pulse" style={{ height: '12px', animationDelay: '0.1s' }} />
              <div className="w-0.5 bg-spotify-green rounded-full animate-pulse" style={{ height: '8px', animationDelay: '0.2s' }} />
            </div>
          </div>
        )}
      </div>

      {/* Playlist Info */}
      <div>
        <h3 className="font-semibold text-white truncate text-sm mb-1 group-hover:text-white transition-colors duration-300">
          {playlist.name}
        </h3>
        {playlist.description && (
          <p className="text-xs text-white/40 line-clamp-2 mb-1 group-hover:text-white/60 transition-colors duration-300">
            {playlist.description}
          </p>
        )}
        <p className="text-xs text-white/30">
          By {playlist.owner}
        </p>
      </div>
    </div>
  )
}
