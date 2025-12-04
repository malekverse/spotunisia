'use client'

import React, { useRef, useEffect, memo } from 'react'
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
  Loader2
} from 'lucide-react'
import { cn, formatDuration } from '@/lib/utils'
import { useMusicPlayerShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useMusicPlayerStore } from '@/lib/store'
import { AlbumImage } from '@/components/ui/ImageWithFallback'

function MusicPlayerComponent() {
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    isLoading,
    isShuffled,
    repeatMode,
    audioError,
    setIsPlaying,
    setCurrentTime,
    setVolume,
    toggleMute,
    setLoading,
    setAudioError,
    playNext,
    playPrevious,
    toggleShuffle,
    setRepeatMode
  } = useMusicPlayerStore()

  // Handlers
  const handleVolumeUp = () => {
    const newVolume = Math.min(1, volume + 0.1)
    setVolume(newVolume)
    if (audioRef.current) audioRef.current.volume = newVolume
  }

  const handleVolumeDown = () => {
    const newVolume = Math.max(0, volume - 0.1)
    setVolume(newVolume)
    if (audioRef.current) audioRef.current.volume = newVolume
  }

  const handleToggleMute = () => {
    toggleMute()
    if (audioRef.current) audioRef.current.volume = !isMuted ? 0 : volume
  }

  const handlePlayPause = () => setIsPlaying(!isPlaying)

  const handleRepeat = () => {
    const modes: ('off' | 'track' | 'playlist')[] = ['off', 'track', 'playlist']
    const idx = modes.indexOf(repeatMode)
    setRepeatMode(modes[(idx + 1) % modes.length])
  }

  // Keyboard shortcuts
  useMusicPlayerShortcuts({
    onPlayPause: handlePlayPause,
    onNext: playNext,
    onPrevious: playPrevious,
    onVolumeUp: handleVolumeUp,
    onVolumeDown: handleVolumeDown,
    onMute: handleToggleMute,
    onShuffle: toggleShuffle,
    onRepeat: handleRepeat,
    enabled: !!currentTrack
  })

  // Set audio source when track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return

    const audio = audioRef.current
    const audioSrc = currentTrack.preview_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    
    console.log('Setting audio source:', audioSrc)
    setLoading(true, currentTrack.id)
    setAudioError(null)
    
    audio.src = audioSrc
    audio.volume = isMuted ? 0 : volume
    audio.load()

    const handleCanPlay = () => {
      console.log('Audio ready')
      setLoading(false, null)
      if (isPlaying) {
        audio.play().catch(err => {
          console.error('Play error:', err)
          setAudioError('Playback failed')
          setIsPlaying(false)
        })
      }
    }

    const handleError = () => {
      console.error('Audio error')
      setAudioError('Failed to load audio')
      setLoading(false, null)
      setIsPlaying(false)
    }

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
    }
  }, [currentTrack?.id])

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return
    
    if (isPlaying && audioRef.current.readyState >= 2) {
      audioRef.current.play().catch(() => setIsPlaying(false))
    } else if (!isPlaying) {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Time update
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onEnded = () => playNext()

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
    }
  }, [playNext, setCurrentTime])

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentTrack) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = percent * currentTrack.duration
  }

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const newVolume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setVolume(newVolume)
    if (audioRef.current) audioRef.current.volume = newVolume
  }

  if (!currentTrack) return null

  const progress = currentTrack.duration > 0 ? (currentTime / currentTrack.duration) * 100 : 0

  return (
    <div className="h-24 liquid-glass-strong border-t border-white/10 flex items-center px-4 shadow-2xl">
      <audio ref={audioRef} />
      
      {/* Track Info */}
      <div className="flex items-center space-x-4 w-72 min-w-0">
        <div className={cn(
          'w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-lg transition-all duration-300',
          isPlaying && 'ring-2 ring-spotify-green/50 shadow-spotify-green/20'
        )}>
          <AlbumImage
            src={currentTrack.image}
            alt={currentTrack.name}
            size="sm"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className={cn(
            'text-white text-sm font-semibold truncate transition-colors duration-300',
            isPlaying && 'text-spotify-green'
          )}>
            {currentTrack.name}
          </p>
          <p className="text-white/50 text-xs truncate">{currentTrack.artist}</p>
        </div>
        <button className={cn(
          'p-2 rounded-full transition-all duration-300',
          currentTrack.isLiked ? 'text-spotify-green' : 'text-white/40 hover:text-white'
        )}>
          <Heart className={cn('w-5 h-5', currentTrack.isLiked && 'fill-current')} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-2">
          <button
            onClick={toggleShuffle}
            className={cn(
              'p-2 rounded-full transition-all duration-300',
              isShuffled ? 'text-spotify-green' : 'text-white/40 hover:text-white'
            )}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          
          <button
            onClick={playPrevious}
            className="p-2 rounded-full text-white/70 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={handlePlayPause}
            disabled={isLoading}
            className="w-12 h-12 rounded-full bg-white text-black hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          
          <button
            onClick={playNext}
            className="p-2 rounded-full text-white/70 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleRepeat}
            className={cn(
              'p-2 rounded-full transition-all duration-300',
              repeatMode !== 'off' ? 'text-spotify-green' : 'text-white/40 hover:text-white'
            )}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center space-x-3">
          <span className="text-xs text-white/50 w-10 text-right tabular-nums">{formatDuration(currentTime)}</span>
          <div 
            className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer group"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-white rounded-full group-hover:bg-spotify-green transition-colors relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 translate-x-1/2 shadow-lg transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-white/50 w-10 tabular-nums">{formatDuration(currentTrack.duration)}</span>
        </div>

        {/* Error message */}
        {audioError && (
          <p className="text-red-400 text-xs mt-1">{audioError}</p>
        )}
      </div>

      {/* Volume */}
      <div className="w-40 flex items-center justify-end space-x-2">
        <button
          onClick={handleToggleMute}
          className="p-2 rounded-full text-white/50 hover:text-white transition-colors"
        >
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <div 
          className="w-24 h-1 bg-white/10 rounded-full cursor-pointer group"
          onClick={handleVolumeChange}
        >
          <div 
            className="h-full bg-white rounded-full group-hover:bg-spotify-green transition-colors"
            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export const MusicPlayer = memo(MusicPlayerComponent)
