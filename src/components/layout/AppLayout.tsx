'use client'

import React, { useEffect, useCallback, memo } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MusicPlayer } from '../player/MusicPlayer'
import ChatBot from '../ai/ChatBot'
import { cn } from '@/lib/utils'
import { useMusicPlayerStore } from '@/lib/store'

// Extend the global Window interface
declare global {
  interface Window {
    playTrack?: (track: Track) => void
  }
}

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

// Memoized main content wrapper to prevent re-renders
const MainContent = memo(function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-gray/30 to-spotify-black p-6">
      {children}
    </main>
  )
})

export function AppLayout({ 
  children, 
  showSearch = false, 
  searchValue = '', 
  onSearchChange 
}: AppLayoutProps) {
  // Use the music player store with shallow equality check
  const currentTrack = useMusicPlayerStore(state => state.currentTrack)
  const queue = useMusicPlayerStore(state => state.queue)
  const setCurrentTrack = useMusicPlayerStore(state => state.setCurrentTrack)
  const setIsPlaying = useMusicPlayerStore(state => state.setIsPlaying)
  const setLoading = useMusicPlayerStore(state => state.setLoading)
  const setAudioError = useMusicPlayerStore(state => state.setAudioError)
  const addToQueue = useMusicPlayerStore(state => state.addToQueue)

  // Global play function that can be called from anywhere in the app
  const playTrack = useCallback((track: Track) => {
    // Validate track data
    if (!track || !track.id) {
      console.error('Invalid track data provided')
      setAudioError('Invalid track data')
      return
    }
    
    console.log('Playing track:', track.name)
    
    // Clear any previous errors
    setAudioError(null)
    
    // Use the track's preview_url or a fallback
    const trackToPlay = {
      ...track,
      preview_url: track.preview_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    }
    
    // Set loading state
    setLoading(true, track.id)
    
    setCurrentTrack(trackToPlay)
    setIsPlaying(true)
    
    // Add to queue if not already there
    const isInQueue = queue.some(queueTrack => queueTrack.id === track.id)
    if (!isInQueue) {
      addToQueue(trackToPlay)
    }
  }, [queue, setAudioError, setLoading, setCurrentTrack, setIsPlaying, addToQueue])

  // Make playTrack available globally - only set once
  useEffect(() => {
    window.playTrack = playTrack
    return () => {
      window.playTrack = undefined
    }
  }, [playTrack])

  return (
    <div className="h-screen flex flex-col bg-spotify-black">
      <div className={cn(
        "flex flex-1 overflow-hidden",
        currentTrack ? "pb-20" : "pb-0"
      )}>
        {/* Sidebar - memoized */}
        <div className="w-60 flex-shrink-0 hidden md:block">
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
          <MainContent>
            {children}
          </MainContent>
        </div>
      </div>

      {/* Music Player - always render but hide when no track */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 transition-transform duration-300",
        currentTrack ? "translate-y-0" : "translate-y-full"
      )}>
        <MusicPlayer />
      </div>

      {/* AI Chatbot */}
      <ChatBot currentTrack={currentTrack ?? undefined} />
    </div>
  )
}
