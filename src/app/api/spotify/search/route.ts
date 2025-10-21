import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import type { Session } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SpotifyService } from '@/lib/spotify'

interface PlaylistWithTracks {
  id: string
  name: string
  description?: string
  images?: Array<{ url: string }>
  owner?: { display_name?: string }
  tracks?: { total: number }
  uri: string
  external_urls: { spotify: string }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session & { accessToken?: string }
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const types = searchParams.get('types')?.split(',') || ['track', 'artist', 'album', 'playlist']
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const spotifyService = new SpotifyService(session.accessToken)
    
    // Search using Spotify API
    const searchResults = await spotifyService.search(query.trim(), types, limit)
    
    // Transform the data to match our component structure
    const transformedResults = {
      tracks: searchResults.tracks?.items?.filter(track => track && track.id)?.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist',
        album: track.album?.name || 'Unknown Album',
        duration: Math.floor((track.duration_ms || 0) / 1000),
        image: track.album?.images?.[0]?.url || '/placeholder-album.svg',
        isLiked: false, // We'll need to check this separately if needed
        uri: track.uri,
        preview_url: track.preview_url,
        external_urls: track.external_urls,
      })) || [],
      
      artists: searchResults.artists?.items?.filter(artist => artist && artist.id)?.map((artist) => ({
        id: artist.id,
        name: artist.name,
        image: artist.images?.[0]?.url || '/placeholder-artist.svg',
        followers: artist.followers?.total || 0,
        genres: artist.genres || [],
        uri: artist.uri,
        external_urls: artist.external_urls,
      })) || [],
      
      albums: searchResults.albums?.items?.filter(album => album && album.id)?.map((album) => ({
        id: album.id,
        name: album.name,
        artist: album.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist',
        image: album.images?.[0]?.url || '/placeholder-album.svg',
        releaseDate: album.release_date,
        trackCount: album.total_tracks || 0,
        uri: album.uri,
        external_urls: album.external_urls,
      })) || [],
      
      playlists: searchResults.playlists?.items?.filter(playlist => playlist && playlist.id)?.map((playlist: PlaylistWithTracks) => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description || 'No description available',
        image: playlist.images?.[0]?.url || '/placeholder-playlist.svg',
        owner: playlist.owner?.display_name || 'Unknown',
        trackCount: playlist.tracks?.total || 0,
        uri: playlist.uri,
        external_urls: playlist.external_urls,
      })) || [],
    }

    return NextResponse.json(transformedResults)
  } catch (error) {
    console.error('Error searching Spotify:', error)
    return NextResponse.json(
      { error: 'Failed to search Spotify' },
      { status: 500 }
    )
  }
}