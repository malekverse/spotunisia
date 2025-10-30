'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { AppLayout } from '@/components/layout/AppLayout'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { TrackCard } from '@/components/ui/TrackCard'
import { HomepageSkeleton } from '@/components/ui/Loading';
import { PlaylistImage } from '@/components/ui/ImageWithFallback'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { downloadTrack } from '@/lib/download'



// Types for our data
interface Playlist {
  id: string
  name: string
  description: string
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
  preview_url?: string
  isPlaying: boolean
  isLiked: boolean
}



export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // State for real Spotify data
  const [featuredPlaylists, setFeaturedPlaylists] = useState<Playlist[]>([])
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([])
  const [madeForYou, setMadeForYou] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingTrackId, setDownloadingTrackId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      // Show fallback data when not authenticated
      setFallbackData()
      return
    }

    // Fetch real Spotify data
    fetchSpotifyData()
  }, [session, status, router])

  const fetchSpotifyData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch data from our API endpoints
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

      setFeaturedPlaylists(playlists)
      setRecentlyPlayed(recent)
      setMadeForYou(recommendations)
    } catch (err: unknown) {
      console.error('Error fetching Spotify data:', err)
      setError('Failed to load Spotify data')
      
      // Fallback to some basic data
      setFeaturedPlaylists([
        {
          id: 'fallback-1',
          name: 'Your Music',
          description: 'Connect to Spotify to see your playlists',
          image: '/placeholder-playlist.svg',
          owner: 'You',
          trackCount: 0,
        }
      ])
      setRecentlyPlayed([])
      setMadeForYou([])
    } finally {
      setLoading(false)
    }
  }

  const setFallbackData = () => {
    setLoading(true)
    
    // Set fallback playlists
    setFeaturedPlaylists([
      {
        id: 'demo-1',
        name: 'Demo Playlist',
        description: 'Sample tracks for testing',
        image: '/placeholder-playlist.svg',
        owner: 'Demo',
        trackCount: 5,
      },
      {
        id: 'demo-2',
        name: 'Popular Hits',
        description: 'Sign in to see your real playlists',
        image: '/placeholder-playlist.svg',
        owner: 'Demo',
        trackCount: 10,
      }
    ])

    // Set fallback tracks with preview URLs for testing
    const fallbackTracks: Track[] = [
      {
        id: 'demo-track-1',
        name: 'Demo Song 1',
        artist: 'Demo Artist',
        album: 'Demo Album',
        duration: 180000,
        image: '/placeholder-album.svg',
        preview_url: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        isPlaying: false,
        isLiked: false,
      },
      {
        id: 'demo-track-2',
        name: 'Demo Song 2',
        artist: 'Another Artist',
        album: 'Another Album',
        duration: 210000,
        image: '/placeholder-album.svg',
        preview_url: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a',
        isPlaying: false,
        isLiked: false,
      },
      {
        id: 'demo-track-3',
        name: 'Demo Song 3',
        artist: 'Third Artist',
        album: 'Third Album',
        duration: 195000,
        image: '/placeholder-album.svg',
        preview_url: 'https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/intromusic.ogg',
        isPlaying: false,
        isLiked: false,
      }
    ]

    setRecentlyPlayed(fallbackTracks)
    setMadeForYou(fallbackTracks)
    setLoading(false)
  }

  if (status === 'loading' || loading) {
    return <HomepageSkeleton />;
  }

  // Debug logging
  console.log('🏠 Home page render - Recently played tracks:', recentlyPlayed.length)
  console.log('🏠 Home page render - Made for you tracks:', madeForYou.length)
  console.log('🏠 Home page render - Session status:', status)

  const handlePlayPlaylist = (playlistId: string) => {
    console.log('Playing playlist:', playlistId)
  }

  const handleDownloadPlaylist = async (playlist: Playlist) => {
    try {
      console.log('Downloading playlist:', playlist.name)
      
      // For now, we'll create a simple implementation that downloads a few sample tracks
      // In a real implementation, you'd fetch the actual tracks from the playlist
      const sampleTracks = [
        { name: 'Sample Track 1', artist: 'Sample Artist 1' },
        { name: 'Sample Track 2', artist: 'Sample Artist 2' },
        { name: 'Sample Track 3', artist: 'Sample Artist 3' }
      ]
      
      const response = await fetch('/api/download-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tracks: sampleTracks,
          platform: 'youtube'
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to download playlist')
      }
      
      const result = await response.json()
      console.log('Playlist download initiated:', result)
      alert(`Playlist "${playlist.name}" download initiated! Check console for details.`)
    } catch (error) {
      console.error('Playlist download failed:', error)
      alert('Playlist download failed. Please try again.')
    }
  }

  const handlePlayTrack = (trackId: string) => {
    console.log('Playing track:', trackId)
  }

  const handleLikeTrack = (trackId: string) => {
    console.log('Liking track:', trackId)
  }

  const handleDownloadTrack = async (track: Track) => {
    try {
      setDownloadingTrackId(track.id)
      console.log('Downloading track:', track.name, 'by', track.artist)
      
      await downloadTrack(track.name, track.artist, 'youtube')
      
      console.log('Download completed for:', track.name)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    } finally {
      setDownloadingTrackId(null)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="liquid-glass-strong rounded-2xl p-8 mb-6 border border-white/10">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-spotify-green bg-clip-text text-transparent">
              Good {getGreeting().split(' ')[1]}, {session?.user?.name || 'there'}!
            </h1>
            <p className="text-spotify-text text-lg">
              Discover your next favorite song
            </p>
          </div>
          {error && (
            <div className="liquid-glass-strong border border-red-500/30 rounded-xl p-4 mb-4 animate-fade-in">
              <p className="text-red-400 text-sm">{error}</p>
              <Button
                onClick={fetchSpotifyData}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Try again
              </Button>
            </div>
          )}
        </motion.div>

        {/* Quick Access Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {featuredPlaylists.slice(0, 6).map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="liquid-glass-hover rounded-xl p-4 flex items-center space-x-4 transition-all duration-300 cursor-pointer group border border-white/10"
              onClick={() => handlePlayPlaylist(playlist.id)}
            >
              <div className="w-14 h-14 flex-shrink-0">
                <PlaylistImage
                  src={playlist.image}
                  alt={playlist.name}
                  className="w-full h-full rounded-lg shadow-lg"
                />
              </div>
              <span className="font-semibold text-white truncate text-sm">
                {playlist.name}
              </span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                <div className="w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center shadow-lg hover-glow">
                  <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recently Played */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="liquid-glass rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-white to-spotify-green bg-clip-text text-transparent">
            Recently played
          </h2>
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
        </motion.section>

        {/* Made for You */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="liquid-glass rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-white to-spotify-green bg-clip-text text-transparent">
            Made for you
          </h2>
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
        </motion.section>

        {/* Popular Playlists */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="liquid-glass rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-white to-spotify-green bg-clip-text text-transparent">
            Popular playlists
          </h2>
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
        </motion.section>
      </div>
    </AppLayout>
  )
}
