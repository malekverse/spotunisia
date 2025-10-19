import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SpotifyService } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const spotifyService = new SpotifyService(session.accessToken)
    
    // Get recently played tracks
    const recentlyPlayed = await spotifyService.getRecentlyPlayed(10)
    
    // Transform the data to match our component structure
    const tracks = recentlyPlayed.items.map((item) => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists.map(artist => artist.name).join(', '),
      album: item.track.album.name,
      duration: Math.floor(item.track.duration_ms / 1000),
      image: item.track.album.images?.[0]?.url || '/placeholder-album.svg',
      isPlaying: false,
      isLiked: false, // We'll need to check this separately if needed
    }))

    return NextResponse.json(tracks)
  } catch (error) {
    console.error('Error fetching recently played tracks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recently played tracks' },
      { status: 500 }
    )
  }
}