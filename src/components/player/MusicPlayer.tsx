'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX,
  Heart,
  Download,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn, formatDuration } from '@/lib/utils'
import { useMusicPlayerShortcuts } from '@/hooks/useKeyboardShortcuts'

interface Track {
  id: string
  name: string
  artist: string
  album: string
  image: string
  duration: number
  preview_url?: string
  isLiked?: boolean
  isDownloaded?: boolean
}

interface MusicPlayerProps {
  currentTrack?: Track
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onShuffle: () => void
  onRepeat: () => void
  onLike: (trackId: string) => void
  onDownload: (trackId: string) => void
  isShuffled: boolean
  repeatMode: 'off' | 'all' | 'one'
  className?: string
}

export function MusicPlayer({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onShuffle,
  onRepeat,
  onLike,
  onDownload,
  isShuffled,
  repeatMode,
  className
}: MusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Volume control handlers
  const handleVolumeUp = () => {
    const newVolume = Math.min(1, volume + 0.1)
    setVolume(newVolume)
    setIsMuted(false)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleVolumeDown = () => {
    const newVolume = Math.max(0, volume - 0.1)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0
    }
  }

  // Keyboard shortcuts
  useMusicPlayerShortcuts({
    onPlayPause,
    onNext,
    onPrevious,
    onVolumeUp: handleVolumeUp,
    onVolumeDown: handleVolumeDown,
    onMute: toggleMute,
    onShuffle,
    onRepeat,
    enabled: !!currentTrack
  })

  // Update audio element when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack?.preview_url) {
      audioRef.current.src = currentTrack.preview_url
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [currentTrack, volume, isMuted])

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Update current time
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => onNext()

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onNext])

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentTrack) return

    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * currentTrack.duration
    
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newVolume = Math.max(0, Math.min(1, percent))
    
    setVolume(newVolume)
    setIsMuted(false)
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  if (!currentTrack) {
    return null
  }

  return (
    <motion.div
      layout
      className={cn(
        'fixed bottom-0 left-0 right-0 liquid-glass-strong border-t border-white/20 z-50 backdrop-blur-xs',
        isExpanded ? 'h-screen' : 'h-24',
        className
      )}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      <audio ref={audioRef} />
      
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col bg-gradient-to-b from-primary/20 to-spotify-black"
          >
            {/* Expanded Player Header */}
            <div className="flex justify-between items-center p-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-white hover:bg-white/10"
              >
                <Minimize2 className="w-5 h-5" />
              </Button>
              <span className="text-sm text-spotify-text">Playing from Playlist</span>
              <div className="w-10" />
            </div>

            {/* Expanded Track Info */}
            <div className="flex-1 flex flex-col items-center justify-center px-8">
              <motion.img
                layoutId="track-image"
                src={currentTrack.image}
                alt={currentTrack.name}
                className="w-80 h-80 rounded-lg shadow-2xl mb-8"
              />
              
              <div className="text-center mb-8">
                <motion.h1 
                  layoutId="track-name"
                  className="text-3xl font-bold text-white mb-2"
                >
                  {currentTrack.name}
                </motion.h1>
                <motion.p 
                  layoutId="track-artist"
                  className="text-xl text-spotify-text"
                >
                  {currentTrack.artist}
                </motion.p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md mb-8">
                <div 
                  className="w-full h-1 bg-spotify-lightgray rounded-full cursor-pointer group"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-white rounded-full relative group-hover:bg-primary transition-colors"
                    style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-spotify-text mt-2">
                  <span>{formatDuration(currentTime)}</span>
                  <span>{formatDuration(currentTrack.duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-6 mb-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShuffle}
                  className={cn(
                    'text-spotify-text hover:text-white',
                    isShuffled && 'text-primary'
                  )}
                >
                  <Shuffle className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrevious}
                  className="text-white hover:scale-110 transition-transform"
                >
                  <SkipBack className="w-6 h-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={onPlayPause}
                  className="w-14 h-14 rounded-full bg-white text-black hover:scale-110 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNext}
                  className="text-white hover:scale-110 transition-transform"
                >
                  <SkipForward className="w-6 h-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRepeat}
                  className={cn(
                    'text-spotify-text hover:text-white',
                    repeatMode !== 'off' && 'text-primary'
                  )}
                >
                  <Repeat className="w-5 h-5" />
                  {repeatMode === 'one' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLike(currentTrack.id)}
                  className={cn(
                    'text-spotify-text hover:text-white',
                    currentTrack.isLiked && 'text-primary'
                  )}
                >
                  <Heart className={cn('w-6 h-6', currentTrack.isLiked && 'fill-current')} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(currentTrack.id)}
                  className={cn(
                    'text-spotify-text hover:text-white',
                    currentTrack.isDownloaded && 'text-primary'
                  )}
                >
                  <Download className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="compact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="h-full flex items-center px-6 py-3"
          >
            {/* Track Info */}
            <motion.div 
              className="flex items-center space-x-4 flex-1 min-w-0"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", damping: 20, stiffness: 400 }}
            >
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.img
                  layoutId="track-image"
                  src={currentTrack.image}
                  alt={currentTrack.name}
                  className="w-14 h-14 rounded-xl cursor-pointer shadow-lg border border-white/10 object-cover"
                  onClick={() => setIsExpanded(true)}
                />
                <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </motion.div>
              <div className="min-w-0 flex-1">
                <motion.p 
                  layoutId="track-name"
                  className="text-white text-sm font-semibold truncate cursor-pointer hover:text-spotify-green transition-colors duration-200"
                  onClick={() => setIsExpanded(true)}
                  whileHover={{ x: 2 }}
                >
                  {currentTrack.name}
                </motion.p>
                <motion.p 
                  layoutId="track-artist"
                  className="text-spotify-text text-xs truncate cursor-pointer hover:text-white transition-colors duration-200"
                  whileHover={{ x: 2 }}
                >
                  {currentTrack.artist}
                </motion.p>
              </div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLike(currentTrack.id)}
                  className={cn(
                    'text-spotify-text hover:text-white transition-all duration-200',
                    currentTrack.isLiked && 'text-red-500 hover:text-red-400'
                  )}
                >
                  <Heart className={cn('w-4 h-4 transition-all duration-200', currentTrack.isLiked && 'fill-current')} />
                </Button>
              </motion.div>
            </motion.div>

            {/* Controls */}
            <motion.div 
              className="flex items-center space-x-4 flex-1 justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 20, stiffness: 300 }}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShuffle}
                  className={cn(
                    'w-8 h-8 p-0 text-spotify-text hover:text-white hidden md:flex transition-all duration-200 liquid-glass-hover rounded-lg',
                    isShuffled && 'text-spotify-green hover:text-spotify-green'
                  )}
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrevious}
                  className="w-8 h-8 p-0 text-white hover:text-spotify-green transition-all duration-200 liquid-glass-hover rounded-lg"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPlayPause}
                  className="w-12 h-12 p-0 rounded-full bg-gradient-to-br from-white to-gray-100 text-black hover:from-spotify-green hover:to-green-400 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </Button>
                {isPlaying && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-spotify-green"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNext}
                  className="w-8 h-8 p-0 text-white hover:text-spotify-green transition-all duration-200 liquid-glass-hover rounded-lg"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRepeat}
                  className={cn(
                    'w-8 h-8 p-0 text-spotify-text hover:text-white hidden md:flex transition-all duration-200 liquid-glass-hover rounded-lg',
                    repeatMode !== 'off' && 'text-spotify-green hover:text-spotify-green'
                  )}
                >
                  <Repeat className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Progress & Volume */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              <div className="hidden md:flex items-center space-x-2 text-xs text-spotify-text">
                <span>{formatDuration(currentTime)}</span>
                <div 
                  className="w-24 h-1 bg-spotify-lightgray rounded-full cursor-pointer group"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-white rounded-full relative group-hover:bg-primary transition-colors"
                    style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <span>{formatDuration(currentTrack.duration)}</span>
              </div>

              <div className="hidden lg:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-spotify-text hover:text-white"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <div 
                  className="w-20 h-1 bg-spotify-lightgray rounded-full cursor-pointer group"
                  onClick={handleVolumeChange}
                >
                  <div 
                    className="h-full bg-white rounded-full relative group-hover:bg-primary transition-colors"
                    style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="text-spotify-text hover:text-white hidden md:flex"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}