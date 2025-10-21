'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search as SearchIcon, Clock, TrendingUp } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Input } from '@/components/ui/Input'
import { TrackCard } from '@/components/ui/TrackCard'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { Loading } from '@/components/ui/Loading'
import { cn } from '@/lib/utils'

// Types for search results
interface Artist {
  id: string
  name: string
  image: string
  followers: number
  genres: string[]
}

interface Album {
  id: string
  name: string
  artist: string
  image: string
  releaseDate: string
  trackCount: number
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

interface Playlist {
  id: string
  name: string
  description?: string
  image: string
  owner: string
  trackCount: number
  isPlaying?: boolean
}

interface SearchResults {
  tracks: Track[]
  artists: Artist[]
  albums: Album[]
  playlists: Playlist[]
}

interface BrowseCategory {
  id: string
  name: string
  image: string
  color: string
}

// Recent searches from localStorage
const getRecentSearches = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('recentSearches')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveRecentSearch = (query: string) => {
  if (typeof window === 'undefined') return
  try {
    const recent = getRecentSearches()
    const updated = [query, ...recent.filter(q => q !== query)].slice(0, 5)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  } catch {
    // Ignore localStorage errors
  }
}

export default function SearchPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [browseCategories, setBrowseCategories] = useState<BrowseCategory[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'tracks' | 'playlists' | 'artists' | 'albums'>('all')
  const [error, setError] = useState<string | null>(null)

  // All useEffect hooks must be called before any conditional returns
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    // Load recent searches from localStorage
    setRecentSearches(getRecentSearches())
    
    // Load browse categories when component mounts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session as any)?.accessToken) {
      fetchBrowseCategories()
    }
  }, [session])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery, false) // Don't save to history on auto-search
      } else {
        setSearchResults(null)
        setError(null)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const fetchBrowseCategories = async () => {
    try {
      setIsLoadingCategories(true)
      const response = await fetch('/api/spotify/browse-categories?limit=20')
      
      if (!response.ok) {
        throw new Error('Failed to fetch browse categories')
      }
      
      const categories = await response.json()
      setBrowseCategories(categories)
    } catch (error) {
      console.error('Error fetching browse categories:', error)
      // Set fallback categories if API fails
      setBrowseCategories([
        { id: 'pop', name: 'Pop', color: 'bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600', image: '/placeholder-category.svg' },
        { id: 'hip-hop', name: 'Hip-Hop', color: 'bg-gradient-to-br from-orange-400 via-orange-500 to-red-500', image: '/placeholder-category.svg' },
        { id: 'rock', name: 'Rock', color: 'bg-gradient-to-br from-red-400 via-red-500 to-red-600', image: '/placeholder-category.svg' },
        { id: 'electronic', name: 'Electronic', color: 'bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600', image: '/placeholder-category.svg' },
        { id: 'jazz', name: 'Jazz', color: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600', image: '/placeholder-category.svg' },
        { id: 'classical', name: 'Classical', color: 'bg-gradient-to-br from-green-400 via-green-500 to-emerald-600', image: '/placeholder-category.svg' },
        { id: 'country', name: 'Country', color: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500', image: '/placeholder-category.svg' },
        { id: 'rnb', name: 'R&B', color: 'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500', image: '/placeholder-category.svg' },
        { id: 'alternative', name: 'Alternative', color: 'bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500', image: '/placeholder-category.svg' },
        { id: 'latin', name: 'Latin', color: 'bg-gradient-to-br from-rose-400 via-pink-500 to-red-500', image: '/placeholder-category.svg' },
        { id: 'indie', name: 'Indie', color: 'bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-500', image: '/placeholder-category.svg' },
        { id: 'funk', name: 'Funk', color: 'bg-gradient-to-br from-lime-400 via-green-500 to-emerald-500', image: '/placeholder-category.svg' }
      ])
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const performSearch = async (query: string, saveToHistory: boolean = true) => {
    if (!query.trim()) {
      setSearchResults(null)
      setError(null)
      return
    }

    setIsSearching(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query.trim())}&limit=20`)
      
      if (!response.ok) {
        throw new Error('Failed to search')
      }
      
      const results = await response.json()
      setSearchResults(results)
      
      // Only save to recent searches when explicitly requested (e.g., on Enter press or manual search)
      if (saveToHistory) {
        saveRecentSearch(query.trim())
        setRecentSearches(getRecentSearches())
      }
    } catch (error) {
      console.error('Error searching:', error)
      setError('Failed to search. Please try again.')
      setSearchResults(null)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (query: string) => {
    performSearch(query, true) // Save to history when manually triggered
  }

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
    handleSearch(categoryName) // Trigger search and save to history
  }

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search)
    handleSearch(search) // Trigger search and save to history
  }

  const clearRecentSearches = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches')
      setRecentSearches([])
    }
  }

  const getFilteredResults = () => {
    if (!searchResults) return null

    switch (activeFilter) {
      case 'tracks':
        return { tracks: searchResults.tracks, artists: [], albums: [], playlists: [] }
      case 'artists':
        return { tracks: [], artists: searchResults.artists, albums: [], playlists: [] }
      case 'albums':
        return { tracks: [], artists: [], albums: searchResults.albums, playlists: [] }
      case 'playlists':
        return { tracks: [], artists: [], albums: [], playlists: searchResults.playlists }
      default:
        return searchResults
    }
  }

  const filteredResults = getFilteredResults()

  // Animation variants for enhanced motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <AppLayout showSearch={false}>
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Search Header */}
        <motion.div 
          className="sticky top-0 z-20 pb-6"
          variants={itemVariants}
        >
          <div className="liquid-glass-strong rounded-2xl p-6 border border-white/20 shadow-2xl backdrop-blur-xs">
            <motion.div 
              className="relative"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.div
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <SearchIcon className="text-white/70 w-6 h-6" />
              </motion.div>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleSearch(searchQuery.trim())
                  }
                }}
                placeholder="What do you want to listen to?"
                variant="liquid-glass"
                className="pl-14 h-14 text-lg text-white placeholder:text-white/50 border-white/20 focus:border-white/40 transition-all duration-300"
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  onClick={() => setSearchQuery('')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {filteredResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
            variants={itemVariants}
          >
            {/* Filter Tabs */}
            <motion.div 
              className="flex gap-3 overflow-x-auto pb-2"
              role="tablist"
              aria-label="Search filters"
              variants={itemVariants}
            >
              {(['all', 'tracks', 'artists', 'albums', 'playlists'] as const).map((filter, index) => (
                <motion.button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 capitalize ${
                    activeFilter === filter
                      ? 'liquid-glass-morphing text-white shadow-lg scale-105'
                      : 'liquid-glass text-white/80 hover:text-white hover:scale-102'
                  }`}
                  role="tab"
                  aria-selected={activeFilter === filter}
                  aria-controls="filter-results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  whileHover={{ 
                    scale: activeFilter === filter ? 1.05 : 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeFilter === filter && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-spotify-green/20 to-blue-500/20 rounded-full"
                      layoutId="activeFilter"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">
                    {filter}
                    {filter === 'all' && searchResults && (
                      <span className="ml-1 text-xs opacity-70">
                        ({(searchResults.tracks?.length || 0) + 
                          (searchResults.artists?.length || 0) + 
                          (searchResults.albums?.length || 0) + 
                          (searchResults.playlists?.length || 0)})
                      </span>
                    )}
                    {filter !== 'all' && searchResults && (
                      <span className="ml-1 text-xs opacity-70">
                        ({searchResults[filter]?.length || 0})
                      </span>
                    )}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            {/* Top Result */}
            {activeFilter === 'all' && filteredResults.tracks.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <motion.h2 
                  className="text-2xl font-bold text-white mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Top result
                </motion.h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    className="liquid-glass-morphing p-8 rounded-2xl cursor-pointer group border border-white/10 shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-6">
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image
                          src={filteredResults.tracks[0].image}
                          alt={filteredResults.tracks[0].name}
                          width={96}
                          height={96}
                          className="w-24 h-24 rounded-xl shadow-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl" />
                      </motion.div>
                      <div className="flex-1">
                        <motion.h3 
                          className="text-3xl font-bold text-white mb-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.8 }}
                        >
                          {filteredResults.tracks[0].name}
                        </motion.h3>
                        <motion.p 
                          className="text-white/70 text-lg"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.9 }}
                        >
                          Song • {filteredResults.tracks[0].artist}
                        </motion.p>
                        <motion.div 
                          className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <button
                            onClick={() => handlePlayTrack(filteredResults.tracks[0].id)}
                            className="liquid-glass-strong rounded-full w-14 h-14 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg border border-white/20"
                          >
                            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Songs</h3>
                    <div className="space-y-1">
                      {filteredResults.tracks.slice(0, 4).map((track: Track, index: number) => (
                        <TrackCard
                          key={track.id}
                          track={track}
                          index={index + 1}
                          onPlay={handlePlayTrack}
                          onLike={handleLikeTrack}
                          showIndex={false}
                          compact={true}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Songs Section */}
            {(activeFilter === 'all' || activeFilter === 'tracks') && filteredResults.tracks.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Songs {activeFilter === 'tracks' && `(${filteredResults.tracks.length})`}
                </h2>
                <div className="space-y-1">
                  {filteredResults.tracks.map((track: Track, index: number) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      index={index + 1}
                      onPlay={handlePlayTrack}
                      onLike={handleLikeTrack}
                      showIndex={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Artists Section */}
            {(activeFilter === 'all' || activeFilter === 'artists') && filteredResults.artists.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.h2 
                  className="text-2xl font-bold text-white mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Artists {activeFilter === 'artists' && `(${filteredResults.artists.length})`}
                </motion.h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {filteredResults.artists.map((artist: Artist, index: number) => (
                    <motion.div 
                      key={artist.id} 
                      className="liquid-glass-morphing p-6 rounded-2xl cursor-pointer group border border-white/10 shadow-xl"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-center">
                        <motion.div
                          className="relative mb-4"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image
                            src={artist.image}
                            alt={artist.name}
                            width={200}
                            height={200}
                            className="w-full aspect-square rounded-full object-cover shadow-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
                        </motion.div>
                        <motion.h3 
                          className="text-white font-semibold mb-2 truncate"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                        >
                          {artist.name}
                        </motion.h3>
                        <motion.p 
                          className="text-white/70 text-sm mb-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                        >
                          Artist
                        </motion.p>
                        <motion.div 
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <button className="liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg border border-white/20 mx-auto">
                            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Albums Section */}
            {(activeFilter === 'all' || activeFilter === 'albums') && filteredResults.albums.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <motion.h2 
                  className="text-2xl font-bold text-white mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  Albums {activeFilter === 'albums' && `(${filteredResults.albums.length})`}
                </motion.h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredResults.albums.map((album: Album, index: number) => (
                    <motion.div 
                      key={album.id} 
                      className="liquid-glass-morphing p-5 rounded-2xl cursor-pointer group border border-white/10 shadow-xl"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div>
                        <motion.div
                          className="relative mb-4"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image
                            src={album.image}
                            alt={album.name}
                            width={200}
                            height={200}
                            className="w-full aspect-square rounded-xl object-cover shadow-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl" />
                        </motion.div>
                        <motion.h3 
                          className="text-white font-semibold mb-2 truncate"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                        >
                          {album.name}
                        </motion.h3>
                        <motion.p 
                          className="text-white/70 text-sm truncate mb-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                        >
                          {album.artist}
                        </motion.p>
                        <motion.p 
                          className="text-white/50 text-xs mb-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                        >
                          {new Date(album.releaseDate).getFullYear()} • {album.trackCount} tracks
                        </motion.p>
                        <motion.div 
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <button className="liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg border border-white/20">
                            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Playlists Section */}
            {(activeFilter === 'all' || activeFilter === 'playlists') && filteredResults.playlists.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Playlists {activeFilter === 'playlists' && `(${filteredResults.playlists.length})`}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredResults.playlists.map((playlist: Playlist) => (
                    <PlaylistCard
                      key={playlist.id}
                      playlist={playlist}
                      onPlay={handlePlayPlaylist}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {filteredResults && 
             filteredResults.tracks.length === 0 && 
             filteredResults.artists.length === 0 && 
             filteredResults.albums.length === 0 && 
             filteredResults.playlists.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                <p className="text-spotify-text">
                  Try searching for something else or check your spelling.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-8"
            variants={itemVariants}
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="liquid-glass-strong rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <motion.h2 
                      className="text-2xl font-bold text-white flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                      >
                        <Clock className="w-6 h-6 mr-3 text-white/80" />
                      </motion.div>
                      Recent searches
                    </motion.h2>
                    <motion.button
                      onClick={clearRecentSearches}
                      className="liquid-glass px-4 py-2 rounded-full text-white/70 hover:text-white transition-all duration-300 border border-white/20 hover:border-white/40"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear all
                    </motion.button>
                  </div>
                  <div className="space-y-3">
                    {recentSearches.map((search, index) => (
                      <motion.div
                        key={search}
                        initial={{ opacity: 0, x: -30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                        className="liquid-glass-morphing flex items-center space-x-4 p-4 rounded-xl cursor-pointer group border border-white/10 shadow-lg"
                        onClick={() => handleRecentSearchClick(search)}
                        whileHover={{ 
                          scale: 1.02,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div 
                          className="w-12 h-12 liquid-glass rounded-xl flex items-center justify-center border border-white/20"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SearchIcon className="w-5 h-5 text-white/70" />
                        </motion.div>
                        <motion.span 
                          className="text-white group-hover:text-white/90 transition-colors font-medium"
                          initial={{ opacity: 0.8 }}
                          whileHover={{ opacity: 1 }}
                        >
                          {search}
                        </motion.span>
                        <motion.div
                          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={{ x: -10 }}
                          whileHover={{ x: 0 }}
                        >
                          <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Browse Categories */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="liquid-glass-strong p-6 rounded-2xl"
            >
              <motion.h2 
                className="text-2xl font-bold text-white mb-6 flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TrendingUp className="w-6 h-6 mr-2" />
                Browse all
              </motion.h2>
              
              {isLoadingCategories ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <motion.div 
                      key={index} 
                      className="h-32 liquid-glass rounded-lg animate-pulse"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {browseCategories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -5,
                        filter: "brightness(1.1) saturate(1.2)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'relative h-32 rounded-xl cursor-pointer overflow-hidden group',
                        category.color
                      )}
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30" />
                      <div className="absolute inset-0 backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl" />
                      <motion.div 
                        className="p-4 h-full flex flex-col justify-between relative z-10"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.h3 
                          className="text-white font-bold text-xl drop-shadow-lg"
                          initial={{ opacity: 0.9 }}
                          whileHover={{ 
                            opacity: 1,
                            textShadow: "0 0 20px rgba(255,255,255,0.5)"
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {category.name}
                        </motion.h3>
                        <motion.div 
                          className="self-end transform rotate-12 group-hover:rotate-6 transition-transform"
                          whileHover={{ 
                            rotate: 6,
                            scale: 1.1,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded shadow-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          </motion.div>
        )}

        {/* Loading State */}
        {isSearching && (
          <motion.div 
            className="flex items-center justify-center py-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="liquid-glass-strong p-8 rounded-2xl flex flex-col items-center space-y-4"
              animate={{ 
                scale: [1, 1.02, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div 
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.p 
                className="text-white/70 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Searching...
              </motion.p>
            </motion.div>
           </motion.div>
         )}
       </motion.div>
    </AppLayout>
  )
}