'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AlbumImage } from '@/components/ui/ImageWithFallback'
import { cn } from '@/lib/utils'

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
  onMore?: (track: Track) => void
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
  onMore,
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
      whileHover={{ 
         scale: 1.015,
         backgroundColor: 'rgba(255, 255, 255, 0.08)',
         boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
         transition: { 
           type: "spring", 
           damping: 50, 
           stiffness: 800,
           duration: 0.05
         }
       }}
       whileTap={{ 
         scale: 0.995,
         transition: { duration: 0.02 }
       }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'group flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 liquid-glass-hover border border-transparent hover:border-white/15',
        track.isPlaying && 'liquid-glass-strong border-spotify-green/30 bg-spotify-green/5',
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
        <motion.div 
          className="relative mr-4"
          whileHover={{ 
            scale: 1.08,
            rotateY: 5,
            z: 10
          }}
          transition={{ 
             type: "spring", 
             damping: 40, 
             stiffness: 1000,
             duration: 0.05
           }}
        >
          <motion.div
            className="w-14 h-14 rounded-xl overflow-hidden shadow-lg ring-2 ring-transparent group-hover:ring-spotify-green/40 transition-all duration-500 relative"
            style={{ clipPath: 'inset(0 round 12px)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{
               boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(29, 185, 84, 0.3)",
               transition: { duration: 0.05 }
             }}
          >
            <motion.div
               className="absolute inset-0 rounded-xl overflow-hidden"
               whileHover={{ scale: 1.1 }}
               transition={{ duration: 0.05, ease: "easeOut" }}
             >
              <AlbumImage
                src={track.image}
                alt={track.name}
                size="sm"
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>
            
            {/* Subtle gradient overlay on hover */}
            <motion.div
               className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-spotify-green/20 rounded-xl opacity-0 z-10"
               whileHover={{ opacity: 1 }}
               transition={{ duration: 0.05 }}
             />
          </motion.div>
          
          {/* Play Button Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                 initial={{ 
                   opacity: 0,
                   backdropFilter: "blur(0px)"
                 }}
                 animate={{ 
                   opacity: 1,
                   backdropFilter: "blur(8px)"
                 }}
                 exit={{ 
                   opacity: 0,
                   backdropFilter: "blur(0px)"
                 }}
                 transition={{ 
                   duration: 0.15,
                   ease: "easeOut"
                 }}
                 className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl z-20"
               >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ 
                     type: "spring", 
                     damping: 30, 
                     stiffness: 800,
                     delay: 0.02
                   }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    className="w-10 h-10 rounded-full bg-spotify-green hover:bg-spotify-green/90 p-0 shadow-2xl hover:shadow-spotify-green/50 transition-all duration-300 border-2 border-white/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      onPlay(track.id)
                    }}
                  >
                    <motion.div
                      whileHover={{ x: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Playing Indicator */}
          {track.isPlaying && (
            <motion.div 
              className="absolute -bottom-1 -right-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="flex space-x-0.5 bg-black/70 backdrop-blur-sm rounded-full px-1.5 py-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-spotify-green rounded-full shadow-sm"
                    animate={{
                      height: [2, 8, 2],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Track Info */}
      <motion.div 
        className="flex-1 min-w-0"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.h4 
          className={cn(
            'font-semibold truncate transition-all duration-500 text-base',
            track.isPlaying 
              ? 'text-spotify-green' 
              : 'text-white group-hover:text-spotify-green/90'
          )}
          whileHover={{ 
             x: 3,
             transition: { type: "spring", damping: 40, stiffness: 800, duration: 0.05 }
           }}
        >
          {track.name}
        </motion.h4>
        <motion.p 
          className="text-sm text-spotify-text/70 truncate group-hover:text-spotify-text transition-colors duration-400 font-medium"
          whileHover={{ 
             x: 3,
             transition: { 
               type: "spring", 
               damping: 40, 
               stiffness: 1000,
               duration: 0.05
             }
           }}
        >
          {track.artist}
        </motion.p>
      </motion.div>

      {/* Album Name or Date Added (hidden on mobile) */}
      {!compact && (
        <motion.div 
          className="hidden md:block flex-1 min-w-0 mx-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.p 
            className="text-sm text-spotify-text/80 truncate group-hover:text-spotify-text transition-colors duration-300 font-medium"
            whileHover={{ x: 2 }}
          >
            {track.album}
          </motion.p>
        </motion.div>
      )}

      {/* Date Added (hidden on mobile) */}
      {showDateAdded && track.dateAdded && (
        <motion.div 
          className="hidden md:block w-32 mx-4"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{
            scale: 1.05,
            rotateY: 2,
            z: 10,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
          transition={{
            delay: 0.4,
            type: "spring",
            damping: 25,
            stiffness: 400,
            duration: 0.15,
          }}
        >
          <motion.p 
            className="text-sm text-spotify-text/80 group-hover:text-spotify-text transition-colors duration-300 font-mono font-medium"
          >
            {new Date(track.dateAdded).toLocaleDateString()}
          </motion.p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div 
        className="flex items-center space-x-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Like Button */}
        <AnimatePresence>
          {(isHovered || track.isLiked) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 10 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 400,
                duration: 0.3
              }}
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 p-0 hover:bg-white/15 rounded-full transition-all duration-300 hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    onLike?.(track.id)
                  }}
                >
                  <motion.div
                    animate={track.isLiked ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart 
                      className={cn(
                        'w-5 h-5 transition-all duration-300',
                        track.isLiked 
                          ? 'text-spotify-green fill-current drop-shadow-lg' 
                          : 'text-spotify-text/70 hover:text-white'
                      )} 
                    />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* More Options */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 10 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 400, 
                delay: 0.1,
                duration: 0.3
              }}
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 p-0 hover:bg-white/15 rounded-full transition-all duration-300 hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMore?.(track)
                  }}
                >
                  <MoreHorizontal className="w-5 h-5 text-spotify-text/70 hover:text-white transition-colors duration-300" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}