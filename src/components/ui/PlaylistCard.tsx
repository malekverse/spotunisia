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
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        transition: { type: "spring", damping: 20, stiffness: 300 }
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'group relative liquid-glass-morphing p-6 cursor-pointer transition-all duration-500 liquid-glass-hover border border-white/10 hover:border-white/20 shadow-lg hover:shadow-2xl',
        className
      )}
    >
      {/* Playlist Image */}
      <motion.div 
        className="relative mb-6 overflow-hidden rounded-xl"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
      >
        <PlaylistImage
          src={playlist.image}
          alt={playlist.name}
          className="shadow-2xl border border-white/10 rounded-xl"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
        
        {/* Play Button Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ 
            opacity: isHovered || playlist.isPlaying ? 1 : 0,
            scale: isHovered || playlist.isPlaying ? 1 : 0.8,
            y: isHovered || playlist.isPlaying ? 0 : 10
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="absolute bottom-3 right-3"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onPlay(playlist.id)
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-spotify-green to-green-400 text-black hover:from-green-400 hover:to-spotify-green hover:scale-110 transition-all duration-300 shadow-2xl border-2 border-white/20"
          >
            {playlist.isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </Button>
        </motion.div>

        {/* Playing Indicator */}
        {playlist.isPlaying && (
          <motion.div 
            className="absolute top-3 left-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="flex space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-spotify-green rounded-full shadow-lg"
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
          </motion.div>
        )}
      </motion.div>

      {/* Playlist Info */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.h3 
          className="font-bold text-white truncate group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-spotify-green group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 text-lg"
          whileHover={{ x: 2 }}
        >
          {playlist.name}
        </motion.h3>
        
        {playlist.description && (
          <motion.p 
            className="text-sm text-spotify-text/80 line-clamp-2 leading-relaxed group-hover:text-spotify-text transition-colors duration-300"
            whileHover={{ x: 2 }}
          >
            {playlist.description}
          </motion.p>
        )}
        
        <motion.p 
          className="text-xs text-spotify-text/60 group-hover:text-spotify-text/80 transition-colors duration-300 font-medium"
          whileHover={{ x: 2 }}
        >
          By {playlist.owner} • {playlist.trackCount} songs
        </motion.p>
      </motion.div>
    </motion.div>
  )
}