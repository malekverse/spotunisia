'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { TrackCard } from '@/components/ui/TrackCard'
import { HomepageSkeleton } from '@/components/ui/Loading'
import { PlaylistImage } from '@/components/ui/ImageWithFallback'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { downloadTrack } from '@/lib/download'
import { Play, RefreshCw } from 'lucide-react'

interface Playlist {
  id: string
  name: string
  description?: string
  image: string
  owner: string
  trackCount: number
}

interface Track {
  id: string
  uniqueKey?: string
  name: string
  artist: string
  album: string
  duration: number
  image: string
  preview_url?: string | null
  isPlaying?: boolean
  isLiked?: boolean
}

// Cache for fetched data
const dataCache: {
  playlists: Playlist[] | null
  recent: Track[] | null
  recommendations: Track[] | null
  timestamp: number
} = {
  playlists: null,
  recent: null,
  recommendations: null,
  timestamp: 0
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [featuredPlaylists, setFeaturedPlaylists] = useState<Playlist[]>(dataCache.playlists || [])
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>(dataCache.recent || [])
  const [madeForYou, setMadeForYou] = useState<Track[]>(dataCache.recommendations || [])
  const [loading, setLoading] = useState(!dataCache.playlists)
  const [error, setError] = useState<string | null>(null)
  const [downloadingTrackId, setDownloadingTrackId] = useState<string | null>(null)
  const [greeting, setGreeting] = useState('') // Avoid hydration mismatch

  // Set greeting on client side only to avoid hydration mismatch
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('morning')
    else if (hour < 18) setGreeting('afternoon')
    else setGreeting('evening')
  }, [])

  const setFallbackData = useCallback(() => {
    const fallbackPlaylists = [
      { id: 'demo-1', name: 'Demo Playlist', description: 'Sign in to see your playlists', image: '/placeholder-playlist.svg', owner: 'Spotunisia', trackCount: 10 },
      { id: 'demo-2', name: 'Top Hits', description: 'Popular tracks', image: '/placeholder-playlist.svg', owner: 'Spotunisia', trackCount: 20 },
    ]
    const fallbackTracks = [
      { id: 'demo-track-1', name: 'Demo Song 1', artist: 'Demo Artist', album: 'Demo Album', duration: 180, image: '/placeholder-album.svg', preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 'demo-track-2', name: 'Demo Song 2', artist: 'Demo Artist', album: 'Demo Album', duration: 210, image: '/placeholder-album.svg', preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    ]
    setFeaturedPlaylists(fallbackPlaylists)
    setRecentlyPlayed(fallbackTracks)
    setMadeForYou(fallbackTracks)
    setLoading(false)
  }, [])

  const fetchSpotifyData = useCallback(async () => {
    // Check cache first
    const now = Date.now()
    if (dataCache.playlists && (now - dataCache.timestamp) < CACHE_DURATION) {
      setFeaturedPlaylists(dataCache.playlists)
      setRecentlyPlayed(dataCache.recent || [])
      setMadeForYou(dataCache.recommendations || [])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const [playlistsRes, recentRes, recommendationsRes] = await Promise.all([
        fetch('/api/spotify/featured-playlists'),
        fetch('/api/spotify/recently-played'),
        fetch('/api/spotify/recommendations')
      ])

      if (!playlistsRes.ok || !recentRes.ok || !recommendationsRes.ok) {
        throw new Error('Failed to fetch Spotify data')
      }

      const [playlists, recent, recommendations] = await Promise.all([
        playlistsRes.json(),
        recentRes.json(),
        recommendationsRes.json()
      ])

      // Update cache
      dataCache.playlists = playlists
      dataCache.recent = recent
      dataCache.recommendations = recommendations
      dataCache.timestamp = now

      setFeaturedPlaylists(playlists)
      setRecentlyPlayed(recent)
      setMadeForYou(recommendations)
    } catch (err) {
      console.error('Error fetching Spotify data:', err)
      setError('Failed to load Spotify data')
      setFallbackData()
    } finally {
      setLoading(false)
    }
  }, [setFallbackData])

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      setFallbackData()
      return
    }
    fetchSpotifyData()
  }, [session, status, fetchSpotifyData, setFallbackData])

  const handlePlayTrack = (trackId: string) => {
    const track = [...recentlyPlayed, ...madeForYou].find(t => t.id === trackId)
    if (track && window.playTrack) {
      window.playTrack({
        ...track,
        preview_url: track.preview_url || undefined
      })
    }
  }

  const handleLikeTrack = (trackId: string) => {
    console.log('Like track:', trackId)
  }

  const handlePlayPlaylist = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`)
  }

  const handleDownloadPlaylist = (playlist: Playlist) => {
    console.log('Download playlist:', playlist.id)
  }

  const handleDownloadTrack = async (track: Track) => {
    if (downloadingTrackId) return
    setDownloadingTrackId(track.id)
    try {
      await downloadTrack(track.name, track.artist, {
        onProgress: (p) => console.log(`Download: ${p.percentage}%`),
        onError: (e) => console.error('Download error:', e)
      })
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setDownloadingTrackId(null)
    }
  }


  if (loading && !featuredPlaylists.length) {
    return (
      <AppLayout>
        <HomepageSkeleton />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="liquid-glass-strong rounded-2xl p-8 border border-white/10 shadow-2xl">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent mb-2">
              {greeting ? `Good ${greeting}, ` : 'Hello, '}{session?.user?.name || 'there'}!
            </h1>
            <p className="text-white/60 text-lg">
              Discover your next favorite song
            </p>
          </div>
          {error && (
            <div className="mt-4 liquid-glass border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
              <button 
                onClick={fetchSpotifyData} 
                className="mt-2 flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try again</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuredPlaylists.slice(0, 6).map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => handlePlayPlaylist(playlist.id)}
              className="flex items-center liquid-glass rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:bg-white/10 hover:shadow-lg group"
            >
              <div className="w-16 h-16 flex-shrink-0">
                <PlaylistImage
                  src={playlist.image}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="flex-1 px-4 font-semibold text-white text-sm truncate">
                {playlist.name}
              </span>
              <div className="pr-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center shadow-lg shadow-spotify-green/30 hover:scale-105 transition-transform duration-300">
                  <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recently Played */}
        <section className="liquid-glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-6">Recently played</h2>
          <div className="space-y-1">
            {recentlyPlayed.map((track, index) => (
              <TrackCard
                key={track.uniqueKey || track.id}
                track={track}
                index={index + 1}
                onPlay={handlePlayTrack}
                onLike={handleLikeTrack}
                onDownload={handleDownloadTrack}
                showIndex={true}
                isDownloading={downloadingTrackId === track.id}
              />
            ))}
          </div>
        </section>

        {/* Made for You */}
        <section className="liquid-glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-6">Made for you</h2>
          <div className="space-y-1">
            {madeForYou.map((track, index) => (
              <TrackCard
                key={track.uniqueKey || track.id}
                track={track}
                index={index + 1}
                onPlay={handlePlayTrack}
                onLike={handleLikeTrack}
                onDownload={handleDownloadTrack}
                showIndex={true}
                isDownloading={downloadingTrackId === track.id}
              />
            ))}
          </div>
        </section>

        {/* Popular Playlists */}
        <section className="liquid-glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-6">Popular playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featuredPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onPlay={handlePlayPlaylist}
                onDownload={handleDownloadPlaylist}
              />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
