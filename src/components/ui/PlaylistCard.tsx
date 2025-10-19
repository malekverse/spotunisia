'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/Button'
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
  className?: string
}

export function PlaylistCard({ playlist, onPlay, className }: PlaylistCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'group relative bg-spotify-gray p-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-spotify-lightgray',
        className
      )}
    >
      {/* Playlist Image */}
      <div className="relative mb-4">
        <PlaylistImage
          src={playlist.image}
          alt={playlist.name}
          className="shadow-lg"
        />
        
        {/* Play Button Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered || playlist.isPlaying ? 1 : 0,
            scale: isHovered || playlist.isPlaying ? 1 : 0.8
          }}
          className="absolute bottom-2 right-2"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onPlay(playlist.id)
            }}
            className="w-12 h-12 rounded-full bg-primary text-black hover:scale-110 transition-transform shadow-lg"
          >
            {playlist.isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>
        </motion.div>

        {/* Playing Indicator */}
        {playlist.isPlaying && (
          <div className="absolute top-2 left-2">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  animate={{
                    height: [4, 12, 4],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Playlist Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-white truncate group-hover:text-primary transition-colors">
          {playlist.name}
        </h3>
        
        {playlist.description && (
          <p className="text-sm text-spotify-text line-clamp-2 leading-relaxed">
            {playlist.description}
          </p>
        )}
        
        <p className="text-xs text-spotify-text">
          By {playlist.owner} • {playlist.trackCount} songs
        </p>
      </div>
    </motion.div>
  )
}