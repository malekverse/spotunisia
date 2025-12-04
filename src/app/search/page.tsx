'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Search as SearchIcon, X, Clock } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { TrackCard } from '@/components/ui/TrackCard'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { Loading, SearchPageSkeleton } from '@/components/ui/Loading'
import { downloadTrack } from '@/lib/download'

interface Track {
  id: string
  name: string
  artist: string
  album: string
  image: string
  duration: number
  preview_url?: string | null
  isLiked?: boolean
}

interface Playlist {
  id: string
  name: string
  description?: string
  image: string
  owner: string
  trackCount: number
}

interface Artist {
  id: string
  name: string
  image: string
  followers: number
}

interface SearchResults {
  tracks: Track[]
  artists: Artist[]
  playlists: Playlist[]
}

interface BrowseCategory {
  id: string
  name: string
  image: string
  color: string
}

// Recent searches helpers
const getRecentSearches = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]')
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
  } catch {}
}

const defaultCategories: BrowseCategory[] = [
  { id: 'pop', name: 'Pop', color: 'from-pink-500 to-rose-600', image: '' },
  { id: 'hip-hop', name: 'Hip-Hop', color: 'from-orange-500 to-amber-600', image: '' },
  { id: 'rock', name: 'Rock', color: 'from-red-500 to-red-700', image: '' },
  { id: 'electronic', name: 'Electronic', color: 'from-violet-500 to-purple-700', image: '' },
  { id: 'jazz', name: 'Jazz', color: 'from-blue-500 to-indigo-700', image: '' },
  { id: 'classical', name: 'Classical', color: 'from-emerald-500 to-teal-700', image: '' },
  { id: 'country', name: 'Country', color: 'from-yellow-500 to-orange-600', image: '' },
  { id: 'rnb', name: 'R&B', color: 'from-fuchsia-500 to-pink-700', image: '' },
]

export default function SearchPage() {
  const { data: session, status } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [categories, setCategories] = useState<BrowseCategory[]>(defaultCategories)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'tracks' | 'playlists' | 'artists'>('all')
  const [downloadingTrackId, setDownloadingTrackId] = useState<string | null>(null)

  useEffect(() => {
    setRecentSearches(getRecentSearches())
    if (session) {
      fetch('/api/spotify/browse-categories?limit=12')
        .then(res => res.ok ? res.json() : defaultCategories)
        .then(setCategories)
        .catch(() => setCategories(defaultCategories))
    }
  }, [session])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery.trim())
      } else {
        setSearchResults(null)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const performSearch = async (query: string) => {
    setIsSearching(true)
    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&limit=20`)
      if (res.ok) {
        const results = await res.json()
        setSearchResults(results)
        saveRecentSearch(query)
        setRecentSearches(getRecentSearches())
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handlePlayTrack = useCallback((trackId: string) => {
    const track = searchResults?.tracks.find(t => t.id === trackId)
    if (track && window.playTrack) {
      window.playTrack({ ...track, preview_url: track.preview_url || undefined })
    }
  }, [searchResults])

  const handleDownloadTrack = async (track: Track) => {
    setDownloadingTrackId(track.id)
    try {
      await downloadTrack(track.name, track.artist)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setDownloadingTrackId(null)
    }
  }

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches')
    setRecentSearches([])
  }

  if (status === 'loading') {
    return (
      <AppLayout showSearch={false}>
        <SearchPageSkeleton />
      </AppLayout>
    )
  }

  const filteredResults = searchResults ? {
    tracks: activeFilter === 'all' || activeFilter === 'tracks' ? searchResults.tracks : [],
    artists: activeFilter === 'all' || activeFilter === 'artists' ? searchResults.artists : [],
    playlists: activeFilter === 'all' || activeFilter === 'playlists' ? searchResults.playlists : [],
  } : null

  return (
    <AppLayout showSearch={false}>
      <div className="space-y-6 animate-fade-in">
        {/* Search Input */}
        <div className="sticky top-0 z-20 py-4 -mx-6 px-6">
          <div className="liquid-glass-strong rounded-2xl p-4 border border-white/10 shadow-xl">
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to listen to?"
                className="w-full pl-12 pr-10 h-12 bg-white/5 border border-white/10 hover:border-white/20 focus:border-spotify-green/50 text-white placeholder:text-white/40 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-spotify-green/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading */}
        {isSearching && (
          <div className="flex justify-center py-8">
            <Loading variant="spinner" size="md" />
          </div>
        )}

        {/* Search Results */}
        {filteredResults && !isSearching ? (
          <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['all', 'tracks', 'artists', 'playlists'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-white text-black shadow-lg'
                      : 'liquid-glass text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Tracks */}
            {filteredResults.tracks.length > 0 && (
              <section className="liquid-glass rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-bold text-white mb-4">Songs</h2>
                <div className="space-y-1">
                  {filteredResults.tracks.slice(0, 10).map((track, index) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      index={index + 1}
                      onPlay={handlePlayTrack}
                      onLike={() => {}}
                      onDownload={handleDownloadTrack}
                      showIndex={true}
                      isDownloading={downloadingTrackId === track.id}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Artists */}
            {filteredResults.artists.length > 0 && (
              <section className="liquid-glass rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-bold text-white mb-4">Artists</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredResults.artists.slice(0, 6).map((artist) => (
                    <div key={artist.id} className="text-center group cursor-pointer">
                      <div className="relative w-full aspect-square rounded-full overflow-hidden mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                        {artist.image ? (
                          <Image
                            src={artist.image}
                            alt={artist.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5" />
                        )}
                      </div>
                      <p className="text-white font-medium truncate">{artist.name}</p>
                      <p className="text-white/40 text-sm">Artist</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Playlists */}
            {filteredResults.playlists.length > 0 && (
              <section className="liquid-glass rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-bold text-white mb-4">Playlists</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {filteredResults.playlists.slice(0, 5).map((playlist) => (
                    <PlaylistCard
                      key={playlist.id}
                      playlist={playlist}
                      onPlay={() => {}}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {filteredResults.tracks.length === 0 && 
             filteredResults.artists.length === 0 && 
             filteredResults.playlists.length === 0 && (
              <div className="text-center py-12 liquid-glass rounded-2xl">
                <p className="text-white/60 text-lg">No results found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}
          </div>
        ) : !searchQuery && (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <section className="liquid-glass rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-white/60" />
                    Recent searches
                  </h2>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setSearchQuery(search)}
                      className="px-4 py-2 liquid-glass-hover rounded-full text-white text-sm transition-all duration-300 hover:bg-white/10"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Browse Categories */}
            <section className="liquid-glass rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-6">Browse all</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSearchQuery(category.name)}
                    className={`relative h-32 rounded-xl overflow-hidden bg-gradient-to-br ${category.color} p-4 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group`}
                  >
                    <span className="text-white font-bold text-lg relative z-10">{category.name}</span>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={80}
                        height={80}
                        className="absolute bottom-0 right-0 rotate-25 translate-x-4 translate-y-2 opacity-80"
                      />
                    )}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </AppLayout>
  )
}
