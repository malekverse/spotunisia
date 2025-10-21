'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MusicPlayer } from '../player/MusicPlayer'
import ChatBot from '../ai/ChatBot'
import { cn } from '@/lib/utils'


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
  const [currentTrack, setCurrentTrack] = useState<Track | undefined>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')


  // Mock current track for demo
  useEffect(() => {
    if (session && !currentTrack) {
      setCurrentTrack({
        id: '1',
        name: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        image: 'https://i.scdn.co/image/ab67616d0000b273c06f0e8b33c6e8a8c2f5c7e1',
        duration: 200,
        preview_url: 'https://p.scdn.co/mp3-preview/...',
        isLiked: false,
        isDownloaded: false
      })
    }
  }, [session, currentTrack])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    // Implement next track logic
    console.log('Next track')
  }

  const handlePrevious = () => {
    // Implement previous track logic
    console.log('Previous track')
  }

  const handleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const handleRepeat = () => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one']
    const currentIndex = modes.indexOf(repeatMode)
    const nextIndex = (currentIndex + 1) % modes.length
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
        <MusicPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onShuffle={handleShuffle}
          onRepeat={handleRepeat}
          onLike={handleLike}
          onDownload={handleDownload}
          isShuffled={isShuffled}
          repeatMode={repeatMode}
        />
      )}

      {/* AI Chatbot */}
      <ChatBot currentTrack={currentTrack} />
    </div>
  )
}