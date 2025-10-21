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

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/auth/signin')
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

  if (status === 'loading' || loading) {
    return <HomepageSkeleton />;
  }

  // Redirect to sign-in if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  const handlePlayPlaylist = (playlistId: string) => {
    console.log('Playing playlist:', playlistId)
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
                showIndex={true}
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
                key={track.id}
                track={track}
                index={index + 1}
                onPlay={handlePlayTrack}
                onLike={handleLikeTrack}
                showIndex={true}
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
              />
            ))}
          </div>
        </motion.section>
      </div>
    </AppLayout>
  )
}
