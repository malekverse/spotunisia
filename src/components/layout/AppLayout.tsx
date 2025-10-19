'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MusicPlayer } from '../player/MusicPlayer'
import { ChatBot, ChatButton } from '../ai/ChatBot'
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
  const [isChatBotVisible, setIsChatBotVisible] = useState(false)
  const [hasNewChatMessage, setHasNewChatMessage] = useState(false)

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

  const handlePlayTrack = (trackId: string) => {
    // Implement play specific track logic
    console.log('Playing track:', trackId)
    setIsPlaying(true)
  }

  const handleLikeTrack = (trackId: string) => {
    // Implement like track logic
    console.log('Liking track:', trackId)
  }

  const handleChatBotToggle = () => {
    setIsChatBotVisible(!isChatBotVisible)
    if (!isChatBotVisible) {
      setHasNewChatMessage(false)
    }
  }



  return (
    <div className="h-screen flex flex-col bg-spotify-black">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
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
      <ChatBot
        isVisible={isChatBotVisible}
        onClose={() => setIsChatBotVisible(false)}
        onPlayTrack={handlePlayTrack}
        onLikeTrack={handleLikeTrack}
        currentContext={{
          page: 'home',
          currentTrack: currentTrack?.id,
          recentTracks: [],
          mood: 'energetic'
        }}
      />

      {/* Chat Button */}
      {!isChatBotVisible && (
        <ChatButton
          onClick={handleChatBotToggle}
          hasNewMessage={hasNewChatMessage}
        />
      )}
    </div>
  )
}