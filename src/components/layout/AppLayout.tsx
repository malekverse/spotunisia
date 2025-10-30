'use client'

import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MusicPlayer } from '../player/MusicPlayer'
import ChatBot from '../ai/ChatBot'
import { cn } from '@/lib/utils'
import { useMusicPlayerStore } from '@/lib/store'

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

interface AppLayoutProps {
  children: React.ReactNode
  showSearch?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export function AppLayout({ 
  children, 
  showSearch = false, 
  searchValue = '', 
  onSearchChange 
}: AppLayoutProps) {
  const { data: session } = useSession()
  
  // Use the music player store
  const {
    currentTrack,
    isPlaying,
    isShuffled,
    repeatMode,
    queue,
    currentIndex,
    setCurrentTrack,
    setIsPlaying,
    setLoading,
    setAudioError,
    playNext,
    playPrevious,
    toggleShuffle,
    setRepeatMode,
    addToQueue
  } = useMusicPlayerStore()

  // Global play function that can be called from anywhere in the app
  const playTrack = (track: Track) => {
    try {
      // Validate track data
      if (!track || !track.id) {
        console.error('Invalid track data provided')
        setAudioError('Invalid track data')
        return
      }
      
      // Clear any previous errors
      setAudioError(null)
      
      // If no preview URL is available, provide a fallback
      const trackWithFallback = {
        ...track,
        preview_url: track.preview_url || 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3'
      }
      
      // Set loading state
      setLoading(true, track.id)
      
      setCurrentTrack(trackWithFallback)
      setIsPlaying(true)
      
      // Add to queue if not already there
      const isInQueue = queue.some(queueTrack => queueTrack.id === track.id)
      if (!isInQueue) {
        addToQueue(trackWithFallback)
      }
    } catch (error) {
      console.error('Error in playTrack:', error)
      setAudioError(error instanceof Error ? error.message : 'Failed to play track')
      setLoading(false, null)
      setIsPlaying(false)
    }
  }

  // Make playTrack available globally
  useEffect(() => {
    // Store the playTrack function globally so other components can access it
    ;(window as any).playTrack = playTrack
  }, [playTrack])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    playNext()
  }

  const handlePrevious = () => {
    playPrevious()
  }

  const handleShuffle = () => {
    toggleShuffle()
  }

  const handleRepeat = () => {
    const modes: ('off' | 'track' | 'playlist')[] = ['off', 'track', 'playlist']
    const currentModeIndex = modes.indexOf(repeatMode)
    const nextIndex = (currentModeIndex + 1) % modes.length
    setRepeatMode(modes[nextIndex])
  }

  const handleLike = (trackId: string) => {
    if (currentTrack && currentTrack.id === trackId) {
      setCurrentTrack({
        ...currentTrack,
        isLiked: !currentTrack.isLiked
      })
    }
  }

  const handleDownload = (trackId: string) => {
    if (currentTrack && currentTrack.id === trackId) {
      setCurrentTrack({
        ...currentTrack,
        isDownloaded: !currentTrack.isDownloaded
      })
    }
  }







  return (
    <div className="h-screen flex flex-col bg-spotify-black">
      <div className={cn(
        "flex flex-1 overflow-hidden",
        currentTrack ? "pb-24" : "pb-0"
      )}>
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar */}
          <TopBar 
            showSearch={showSearch}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-gray/50 to-spotify-black p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Music Player */}
      {currentTrack && (
        <MusicPlayer />
      )}

      {/* AI Chatbot */}
      <ChatBot currentTrack={currentTrack} />
    </div>
  )
}