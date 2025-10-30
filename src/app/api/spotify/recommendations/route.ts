import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import type { Session } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SpotifyService } from '@/lib/spotify'

interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: { 
    name: string
    images?: Array<{ url: string }>
  }
  duration_ms: number
  preview_url: string | null
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session & { accessToken?: string }
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const spotifyService = new SpotifyService(session.accessToken)
    
    let seedTracks: string[] = []
    let seedArtists: string[] = []
    let seedGenres: string[] = ['pop', 'rock'] // Default fallback genres
    
    try {
      // Try to get user's saved tracks first
      const savedTracks = await spotifyService.getUserSavedTracks(5, 0)
      if (savedTracks.items && savedTracks.items.length > 0) {
        seedTracks = savedTracks.items.slice(0, 2).map(item => item.track.id)
        // Also get some artists from saved tracks
        seedArtists = savedTracks.items.slice(0, 2).map(item => item.track.artists[0].id)
      }
    } catch (error) {
      console.log('No saved tracks found, trying top tracks...')
    }
    
    // If no saved tracks, try to get user's top tracks
    if (seedTracks.length === 0) {
      try {
        const topTracks = await spotifyService.getUserTopTracks(5, 0, 'medium_term')
        if (topTracks.items && topTracks.items.length > 0) {
          seedTracks = topTracks.items.slice(0, 2).map(item => item.id)
          seedArtists = topTracks.items.slice(0, 2).map(item => item.artists[0].id)
        }
      } catch (error) {
        console.log('No top tracks found, trying top artists...')
      }
    }
    
    // If still no seeds, try to get user's top artists
    if (seedTracks.length === 0 && seedArtists.length === 0) {
      try {
        const topArtists = await spotifyService.getUserTopArtists(3, 0, 'medium_term')
        if (topArtists.items && topArtists.items.length > 0) {
          seedArtists = topArtists.items.slice(0, 3).map(item => item.id)
        }
      } catch (error) {
        console.log('No top artists found, using genre seeds only...')
      }
    }
    
    // Ensure we have at least one seed (required by Spotify API)
    if (seedTracks.length === 0 && seedArtists.length === 0) {
      // Use popular genre seeds as fallback
      seedGenres = ['pop', 'rock', 'indie']
    }
    
    // Get recommendations with our seed values
    const recommendations = await spotifyService.getRecommendations({
      seed_tracks: seedTracks,
      seed_artists: seedArtists,
      seed_genres: seedGenres,
      limit: 10
    })
    
    // Transform the data to match our component structure
    const recommendedTracks = recommendations.tracks.map((track: SpotifyTrack) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      duration: Math.floor(track.duration_ms / 1000),
      image: track.album.images?.[0]?.url || '/placeholder-album.svg',
      preview_url: track.preview_url,
      isPlaying: false,
      isLiked: false,
    }))

    return NextResponse.json(recommendedTracks)
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    
    // Fallback: return some mock data if recommendations fail
    const fallbackTracks = [
      {
        id: 'fallback-1',
        name: 'Discover New Music',
        artist: 'Various Artists',
        album: 'Recommendations',
        duration: 180,
        image: '/placeholder-album.svg',
        preview_url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
        isPlaying: false,
        isLiked: false,
      }
    ]
    
    return NextResponse.json(fallbackTracks)
  }
}