'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AppLayout } from '@/components/layout/AppLayout'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { TrackCard } from '@/components/ui/TrackCard'
import { Loading } from '@/components/ui/Loading'
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
  name: string
  artist: string
  album: string
  duration: number
  image: string
  isPlaying: boolean
  isLiked: boolean
}

// Mock data for demo
const featuredPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Today\'s Top Hits',
    description: 'The most played songs right now',
    image: '/placeholder-playlist.svg',
    owner: 'Spotify',
    trackCount: 50,
  },
  {
    id: '2',
    name: 'RapCaviar',
    description: 'New music from Drake, Travis Scott, and more',
    image: '/placeholder-playlist.svg',
    owner: 'Spotify',
    trackCount: 65,
  },
  {
    id: '3',
    name: 'Rock Classics',
    description: 'Rock legends & epic songs',
    image: '/placeholder-playlist.svg',
    owner: 'Spotify',
    trackCount: 100,
  },
  {
    id: '4',
    name: 'Chill Hits',
    description: 'Kick back to the best new and recent chill hits',
    image: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6',
    owner: 'Spotify',
    trackCount: 75,
  },
  {
    id: '5',
    name: 'Pop Rising',
    description: 'The biggest songs in pop right now',
    image: 'https://i.scdn.co/image/ab67706f00000002fe24d7084be472288cd6ee6c',
    owner: 'Spotify',
    trackCount: 40,
  },
  {
    id: '6',
    name: 'Discover Weekly',
    description: 'Your weekly mixtape of fresh music',
    image: 'https://i.scdn.co/image/ab67706f00000002c3af0c2355c24ed7023cd394',
    owner: 'Spotify',
    trackCount: 30,
  },
]

const recentlyPlayed: Track[] = [
  {
    id: '1',
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    image: '/placeholder-album.svg',
    isPlaying: false,
    isLiked: true,
  },
  {
    id: '2',
    name: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: 178,
    image: '/placeholder-album.svg',
    isPlaying: false,
    isLiked: false,
  },
  {
    id: '3',
    name: 'Stay',
    artist: 'The Kid LAROI, Justin Bieber',
    album: 'F*CK LOVE 3: OVER YOU',
    image: 'https://i.scdn.co/image/ab67616d0000b273c06f0e8b33ac2d246158253e',
    duration: 141,
    isPlaying: false,
    isLiked: true,
  },
  {
    id: '4',
    name: 'Industry Baby',
    artist: 'Lil Nas X, Jack Harlow',
    album: 'MONTERO',
    image: 'https://i.scdn.co/image/ab67616d0000b273e71f5011d68493c3b971c8c6',
    duration: 212,
    isPlaying: false,
    isLiked: false,
  },
]

const madeForYou: Playlist[] = [
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
  },
  {
    id: '3',
    name: 'Rock Classics',
    description: 'Rock legends & epic songs',
    image: 'https://i.scdn.co/image/ab67706f00000002fe24d7084be472288cd6ee6c',
    owner: 'Spotify',
    trackCount: 100,
  },
  {
    id: '4',
    name: 'Chill Hits',
    description: 'Kick back to the best new and recent chill hits',
    image: 'https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6',
    owner: 'Spotify',
    trackCount: 75,
  },
  {
    id: '5',
    name: 'Pop Rising',
    description: 'The biggest songs in pop right now',
    image: 'https://i.scdn.co/image/ab67706f00000002fe24d7084be472288cd6ee6c',
    owner: 'Spotify',
    trackCount: 40,
  },
]

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
    } catch (err) {
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
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            {getGreeting()}
          </h1>
          <p className="text-spotify-text">
            Let's find something amazing to listen to
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
              <button 
                onClick={fetchSpotifyData}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Try again
              </button>
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
              className="bg-spotify-lightgray rounded-md p-3 flex items-center space-x-3 hover:bg-spotify-gray transition-colors cursor-pointer group"
              onClick={() => handlePlayPlaylist(playlist.id)}
            >
              <div className="w-12 h-12 flex-shrink-0">
                <PlaylistImage
                  src={playlist.image}
                  alt={playlist.name}
                  className="w-full h-full rounded"
                />
              </div>
              <span className="font-medium text-white truncate">
                {playlist.name}
              </span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
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
        >
          <h2 className="text-2xl font-bold text-white mb-4">Recently played</h2>
          <div className="space-y-1">
            {recentlyPlayed.map((track, index) => (
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
        </motion.section>

        {/* Made for You */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Made for you</h2>
          <div className="space-y-1">
            {madeForYou.map((track, index) => (
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
        </motion.section>

        {/* Popular Playlists */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Popular playlists</h2>
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
