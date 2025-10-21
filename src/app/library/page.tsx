'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Music, 
  Heart, 
  Download, 
  Clock, 
  Grid3X3, 
  List, 
  Search,
  Plus,
  Filter,
  ArrowUpDown
} from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { TrackCard } from '@/components/ui/TrackCard'
import { Loading } from '@/components/ui/Loading'
import { cn } from '@/lib/utils'



// Mock data for user's library
const userPlaylists = [
  {
    id: '1',
    name: 'My Playlist #1',
    description: 'Created by you • 23 songs',
    image: 'https://i.scdn.co/image/ab67706f00000002c3af0c2355c24ed7023cd394',
    owner: 'You',
    trackCount: 23,
    isOwned: true,
  },
  {
    id: '2',
    name: 'Chill Vibes',
    description: 'Created by you • 45 songs',
    image: 'https://i.scdn.co/image/ab67706f00000002a91c10fe9472d9bd89802e5a',
    owner: 'You',
    trackCount: 45,
    isOwned: true,
  },
  {
    id: '3',
    name: 'Workout Mix',
    description: 'Created by you • 32 songs',
    image: 'https://i.scdn.co/image/ab67706f00000002fe24d7084be472288cd6ee6c',
    owner: 'You',
    trackCount: 32,
    isOwned: true,
  },
  {
    id: '4',
    name: 'Today\'s Top Hits',
    description: 'Spotify • 50 songs',
    image: 'https://i.scdn.co/image/ab67706f00000002c6f8d0b6e0c6c6e8a8c2f5c7',
    owner: 'Spotify',
    trackCount: 50,
    isOwned: false,
  },
  {
    id: '5',
    name: 'Discover Weekly',
    description: 'Spotify • 30 songs',
    image: 'https://i.scdn.co/image/ab67706f00000002be82673b5f79d9658ec0a9fd',
    owner: 'Spotify',
    trackCount: 30,
    isOwned: false,
  }
]

const likedSongs = [
  {
    id: '1',
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    image: 'https://i.scdn.co/image/ab67616d0000b273c06f0e8b33c6e8a8c2f5c7e1',
    duration: 200,
    isLiked: true,
    dateAdded: '2024-01-15',
  },
  {
    id: '2',
    name: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    image: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a',
    duration: 178,
    isLiked: true,
    dateAdded: '2024-01-14',
  },
  {
    id: '3',
    name: 'Stay',
    artist: 'The Kid LAROI, Justin Bieber',
    album: 'F*CK LOVE 3: OVER YOU',
    image: 'https://i.scdn.co/image/ab67616d0000b273c4dee8b6c2b5b0c8f0b5c7e1',
    duration: 141,
    isLiked: true,
    dateAdded: '2024-01-13',
  },
  {
    id: '4',
    name: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    image: 'https://i.scdn.co/image/ab67616d0000b273c4dee8b6c2b5b0c8f0b5c7e1',
    duration: 203,
    isLiked: true,
    dateAdded: '2024-01-12',
  }
]

const downloadedSongs = [
  {
    id: '1',
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    image: 'https://i.scdn.co/image/ab67616d0000b273c06f0e8b33c6e8a8c2f5c7e1',
    duration: 200,
    isLiked: true,
    isDownloaded: true,
  },
  {
    id: '2',
    name: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    image: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a',
    duration: 178,
    isLiked: true,
    isDownloaded: true,
  }
]

type ViewMode = 'grid' | 'list'
type FilterType = 'all' | 'playlists' | 'artists' | 'albums'
type SortType = 'recent' | 'alphabetical' | 'creator'

export default function LibraryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'playlists' | 'liked' | 'downloaded'>('playlists')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'liked' || tab === 'downloaded') {
      setActiveTab(tab)
    }
  }, [searchParams])

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

  const handleCreatePlaylist = () => {
    console.log('Creating new playlist')
  }

  const filteredPlaylists = userPlaylists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.owner.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLikedSongs = likedSongs.filter(song =>
    song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredDownloadedSongs = downloadedSongs.filter(song =>
    song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppLayout showSearch={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Your Library</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="text-spotify-text hover:text-white"
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-spotify-text hover:text-white"
            >
              <Filter className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-spotify-text hover:text-white"
            >
              <ArrowUpDown className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-text w-5 h-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in Your Library"
            className="pl-12 bg-spotify-lightgray border-none text-white placeholder:text-spotify-text"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-spotify-lightgray rounded-lg p-1 w-fit">
          {(['playlists', 'liked', 'downloaded'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'capitalize px-4 py-2 rounded-md',
                activeTab !== tab && 'text-spotify-text hover:text-white'
              )}
            >
              {tab === 'playlists' && <Music className="w-4 h-4 mr-2" />}
              {tab === 'liked' && <Heart className="w-4 h-4 mr-2" />}
              {tab === 'downloaded' && <Download className="w-4 h-4 mr-2" />}
              {tab === 'playlists' ? 'Playlists' : tab === 'liked' ? 'Liked Songs' : 'Downloaded'}
            </Button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'playlists' && (
            <div className="space-y-6">
              {/* Create Playlist Button */}
              <Button
                variant="outline"
                onClick={handleCreatePlaylist}
                className="w-full sm:w-auto border-spotify-text text-spotify-text hover:text-white hover:border-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Playlist
              </Button>

              {/* Playlists Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredPlaylists.map((playlist, index) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <PlaylistCard
                        playlist={playlist}
                        onPlay={handlePlayPlaylist}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredPlaylists.map((playlist, index) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-4 p-3 rounded-md hover:bg-spotify-lightgray group cursor-pointer"
                      onClick={() => handlePlayPlaylist(playlist.id)}
                    >
                      <Image
                        src={playlist.image}
                        alt={playlist.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{playlist.name}</h3>
                        <p className="text-spotify-text text-sm">{playlist.description}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="default"
                          size="sm"
                          className="rounded-full w-10 h-10"
                        >
                          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'liked' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-blue-300 rounded flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white fill-current" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Liked Songs</h2>
                  <p className="text-spotify-text">{likedSongs.length} songs</p>
                </div>
                <Button
                  variant="default"
                  size="lg"
                  className="rounded-full ml-auto"
                  onClick={() => handlePlayTrack('liked-songs')}
                >
                  <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </Button>
              </div>

              <div className="space-y-1">
                {filteredLikedSongs.map((track, index) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TrackCard
                      track={track}
                      index={index + 1}
                      onPlay={handlePlayTrack}
                      onLike={handleLikeTrack}
                      showIndex={true}
                      showDateAdded={true}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'downloaded' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-700 to-green-400 rounded flex items-center justify-center">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Downloaded</h2>
                  <p className="text-spotify-text">{downloadedSongs.length} songs</p>
                </div>
                <Button
                  variant="default"
                  size="lg"
                  className="rounded-full ml-auto"
                  onClick={() => handlePlayTrack('downloaded-songs')}
                >
                  <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </Button>
              </div>

              <div className="space-y-1">
                {filteredDownloadedSongs.map((track, index) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TrackCard
                      track={track}
                      index={index + 1}
                      onPlay={handlePlayTrack}
                      onLike={handleLikeTrack}
                      showIndex={true}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {((activeTab === 'playlists' && filteredPlaylists.length === 0) ||
          (activeTab === 'liked' && filteredLikedSongs.length === 0) ||
          (activeTab === 'downloaded' && filteredDownloadedSongs.length === 0)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-spotify-lightgray rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'playlists' && <Music className="w-8 h-8 text-spotify-text" />}
              {activeTab === 'liked' && <Heart className="w-8 h-8 text-spotify-text" />}
              {activeTab === 'downloaded' && <Download className="w-8 h-8 text-spotify-text" />}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {activeTab === 'playlists' && 'No playlists found'}
              {activeTab === 'liked' && 'No liked songs found'}
              {activeTab === 'downloaded' && 'No downloaded songs found'}
            </h3>
            <p className="text-spotify-text mb-6">
              {searchQuery ? 'Try adjusting your search.' : 'Start building your library.'}
            </p>
            {activeTab === 'playlists' && !searchQuery && (
              <Button variant="default" onClick={handleCreatePlaylist}>
                Create your first playlist
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </AppLayout>
  )
}