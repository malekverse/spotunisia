import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import type { Session } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SpotifyService } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session & { accessToken?: string }
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const spotifyService = new SpotifyService(session.accessToken)
    
    // Get user's playlists as featured playlists
    const playlists = await spotifyService.getUserPlaylists(6, 0)
    
    // Transform the data to match our component structure
    const featuredPlaylists = playlists.items.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description || 'No description available',
      image: playlist.images?.[0]?.url || '/placeholder-playlist.svg',
      owner: playlist.owner.display_name || 'Unknown',
      trackCount: playlist.tracks?.total || 0,
    }))

    return NextResponse.json(featuredPlaylists)
  } catch (error) {
    console.error('Error fetching featured playlists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured playlists' },
      { status: 500 }
    )
  }
}