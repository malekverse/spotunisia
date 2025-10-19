'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search as SearchIcon, Clock, TrendingUp } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { TrackCard } from '@/components/ui/TrackCard'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import { cn } from '@/lib/utils'

// Mock data for search categories
const searchCategories = [
  {
    id: '1',
    name: 'Pop',
    color: 'bg-pink-500',
    image: 'https://i.scdn.co/image/ab67706f00000002c3af0c2355c24ed7023cd394'
  },
  {
    id: '2',
    name: 'Hip-Hop',
    color: 'bg-orange-500',
    image: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6'
  },
  {
    id: '3',
    name: 'Rock',
    color: 'bg-red-500',
    image: 'https://i.scdn.co/image/ab67706f00000002fe24d7084be472288cd6ee6c'
  },
  {
    id: '4',
    name: 'Electronic',
    color: 'bg-purple-500',
    image: 'https://i.scdn.co/image/ab67706f00000002c6f8d0b6e0c6c6e8a8c2f5c7'
  },
  {
    id: '5',
    name: 'Jazz',
    color: 'bg-blue-500',
    image: 'https://i.scdn.co/image/ab67706f00000002a91c10fe9472d9bd89802e5a'
  },
  {
    id: '6',
    name: 'Classical',
    color: 'bg-green-500',
    image: 'https://i.scdn.co/image/ab67706f00000002c4dee8b6c2b5b0c8f0b5c7e1'
  },
  {
    id: '7',
    name: 'Country',
    color: 'bg-yellow-500',
    image: 'https://i.scdn.co/image/ab67706f00000002be82673b5f79d9658ec0a9fd'
  },
  {
    id: '8',
    name: 'R&B',
    color: 'bg-indigo-500',
    image: 'https://i.scdn.co/image/ab67706f00000002c06f0e8b33c6e8a8c2f5c7e1'
  }
]

// Mock search results
const mockSearchResults = {
  tracks: [
    {
      id: '1',
      name: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      image: 'https://i.scdn.co/image/ab67616d0000b273c06f0e8b33c6e8a8c2f5c7e1',
      duration: 200,
      isLiked: true,
    },
    {
      id: '2',
      name: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      image: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a',
      duration: 178,
      isLiked: false,
    },
    {
      id: '3',
      name: 'Stay',
      artist: 'The Kid LAROI, Justin Bieber',
      album: 'F*CK LOVE 3: OVER YOU',
      image: 'https://i.scdn.co/image/ab67616d0000b273c4dee8b6c2b5b0c8f0b5c7e1',
      duration: 141,
      isLiked: true,
    }
  ],
  playlists: [
    {
      id: '1',
      name: 'Today\'s Top Hits',
      description: 'The most played songs right now',
      image: 'https://i.scdn.co/image/ab67706f00000002c3af0c2355c24ed7023cd394',
      owner: 'Spotify',
      trackCount: 50,
    },
    {
      id: '2',
      name: 'RapCaviar',
      description: 'New music from Drake, Travis Scott, and more',
      image: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6',
      owner: 'Spotify',
      trackCount: 65,
    }
  ]
}

const recentSearches = [
  'The Weeknd',
  'Olivia Rodrigo',
  'Drake',
  'Taylor Swift',
  'Billie Eilish'
]

export default function SearchPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'tracks' | 'playlists' | 'artists'>('all')

  // All useEffect hooks must be called before any conditional returns
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null)
      return
    }

    setIsSearching(true)
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockSearchResults)
      setIsSearching(false)
    }, 500)
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-spotify-black">
        <Loading variant="music" size="lg" />
      </div>
    )
  }

  // Redirect to sign-in if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  const handlePlayTrack = (trackId: string) => {
    console.log('Playing track:', trackId)
  }

  const handleLikeTrack = (trackId: string) => {
    console.log('Liking track:', trackId)
  }

  const handleDownloadTrack = (trackId: string) => {
    console.log('Downloading track:', trackId)
  }

  const handlePlayPlaylist = (playlistId: string) => {
    console.log('Playing playlist:', playlistId)
  }

  const handleCategoryClick = (categoryName: string) => {
    setSearchQuery(categoryName)
  }

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search)
  }

  return (
    <AppLayout showSearch={false}>
      <div className="space-y-6">
        {/* Search Header */}
        <div className="sticky top-0 bg-spotify-black/80 backdrop-blur-md z-10 pb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-text w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              className="pl-12 h-12 text-lg bg-white text-black placeholder:text-gray-500 border-none"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Filter Tabs */}
            <div className="flex space-x-2">
              {(['all', 'tracks', 'playlists', 'artists'] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? 'spotify' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    'capitalize',
                    activeFilter !== filter && 'text-white hover:text-white'
                  )}
                >
                  {filter}
                </Button>
              ))}
            </div>

            {/* Top Result */}
            {activeFilter === 'all' && searchResults.tracks.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Top result</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 bg-spotify-lightgray hover:bg-spotify-gray transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <img
                        src={searchResults.tracks[0].image}
                        alt={searchResults.tracks[0].name}
                        className="w-20 h-20 rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {searchResults.tracks[0].name}
                        </h3>
                        <p className="text-spotify-text">
                          Song • {searchResults.tracks[0].artist}
                        </p>
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="spotify"
                            size="sm"
                            onClick={() => handlePlayTrack(searchResults.tracks[0].id)}
                            className="rounded-full w-12 h-12"
                          >
                            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Songs</h3>
                    <div className="space-y-1">
                      {searchResults.tracks.slice(0, 4).map((track: any, index: number) => (
                        <TrackCard
                          key={track.id}
                          track={track}
                          index={index + 1}
                          onPlay={handlePlayTrack}
                          onLike={handleLikeTrack}
                          onDownload={handleDownloadTrack}
                          showIndex={false}
                          compact={true}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Songs Section */}
            {(activeFilter === 'all' || activeFilter === 'tracks') && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
                <div className="space-y-1">
                  {searchResults.tracks.map((track: any, index: number) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      index={index + 1}
                      onPlay={handlePlayTrack}
                      onLike={handleLikeTrack}
                      onDownload={handleDownloadTrack}
                      showIndex={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Playlists Section */}
            {(activeFilter === 'all' || activeFilter === 'playlists') && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Playlists</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {searchResults.playlists.map((playlist: any) => (
                    <PlaylistCard
                      key={playlist.id}
                      playlist={playlist}
                      onPlay={handlePlayPlaylist}
                    />
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-2" />
                  Recent searches
                </h2>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <motion.div
                      key={search}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-spotify-lightgray cursor-pointer group"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      <div className="w-10 h-10 bg-spotify-gray rounded flex items-center justify-center">
                        <SearchIcon className="w-5 h-5 text-spotify-text" />
                      </div>
                      <span className="text-white group-hover:text-primary transition-colors">
                        {search}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Browse Categories */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                Browse all
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'relative h-32 rounded-lg cursor-pointer overflow-hidden group',
                      category.color
                    )}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
                    <div className="p-4 h-full flex flex-col justify-between">
                      <h3 className="text-white font-bold text-xl">
                        {category.name}
                      </h3>
                      <div className="self-end transform rotate-12 group-hover:rotate-6 transition-transform">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-16 h-16 rounded shadow-lg"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}