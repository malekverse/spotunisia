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
        'fixed bottom-0 left-0 right-0 bg-spotify-gray border-t border-spotify-lightgray z-50',
        isExpanded ? 'h-screen' : 'h-20',
        className
      )}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex items-center px-4"
          >
            {/* Track Info */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <motion.img
                layoutId="track-image"
                src={currentTrack.image}
                alt={currentTrack.name}
                className="w-12 h-12 rounded cursor-pointer"
                onClick={() => setIsExpanded(true)}
              />
              <div className="min-w-0 flex-1">
                <motion.p 
                  layoutId="track-name"
                  className="text-white text-sm font-medium truncate cursor-pointer hover:underline"
                  onClick={() => setIsExpanded(true)}
                >
                  {currentTrack.name}
                </motion.p>
                <motion.p 
                  layoutId="track-artist"
                  className="text-spotify-text text-xs truncate cursor-pointer hover:underline"
                >
                  {currentTrack.artist}
                </motion.p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(currentTrack.id)}
                className={cn(
                  'text-spotify-text hover:text-white',
                  currentTrack.isLiked && 'text-primary'
                )}
              >
                <Heart className={cn('w-4 h-4', currentTrack.isLiked && 'fill-current')} />
              </Button>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4 flex-1 justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onShuffle}
                className={cn(
                  'text-spotify-text hover:text-white hidden md:flex',
                  isShuffled && 'text-primary'
                )}
              >
                <Shuffle className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onPrevious}
                className="text-white hover:scale-110 transition-transform"
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onPlayPause}
                className="w-8 h-8 rounded-full bg-white text-black hover:scale-110 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                className="text-white hover:scale-110 transition-transform"
              >
                <SkipForward className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onRepeat}
                className={cn(
                  'text-spotify-text hover:text-white hidden md:flex',
                  repeatMode !== 'off' && 'text-primary'
                )}
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>

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