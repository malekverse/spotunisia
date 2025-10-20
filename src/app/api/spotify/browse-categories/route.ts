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

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const spotifyService = new SpotifyService(session.accessToken)
    
    try {
      // Get browse categories from Spotify
      const categories = await spotifyService.getBrowseCategories(limit, offset)
      
      // Transform the data to match our component structure
      const transformedCategories = categories.categories.items.map((category) => ({
        id: category.id,
        name: category.name,
        image: category.icons?.[0]?.url || '/placeholder-category.svg',
        color: `bg-${['pink', 'orange', 'red', 'purple', 'blue', 'green', 'yellow', 'indigo'][Math.floor(Math.random() * 8)]}-500`,
      }))

      return NextResponse.json(transformedCategories)
    } catch (error) {
      console.error('Error fetching browse categories from Spotify:', error)
      
      // Fallback to some default categories if Spotify API fails
      const fallbackCategories = [
        {
          id: 'pop',
          name: 'Pop',
          color: 'bg-pink-500',
          image: '/placeholder-category.svg'
        },
        {
          id: 'hip-hop',
          name: 'Hip-Hop',
          color: 'bg-orange-500',
          image: '/placeholder-category.svg'
        },
        {
          id: 'rock',
          name: 'Rock',
          color: 'bg-red-500',
          image: '/placeholder-category.svg'
        },
        {
          id: 'electronic',
          name: 'Electronic',
          color: 'bg-purple-500',
          image: '/placeholder-category.svg'
        },
        {
          id: 'jazz',
          name: 'Jazz',
          color: 'bg-blue-500',
          image: '/placeholder-category.svg'
        },
        {
          id: 'classical',
          name: 'Classical',
          color: 'bg-green-500',
          image: '/placeholder-category.svg'
        },
        {
          id: 'country',
          name: 'Country',
          color: 'bg-yellow-500',
          image: '/placeholder-category.svg'
        },
        {
          id: 'rnb',
          name: 'R&B',
          color: 'bg-indigo-500',
          image: '/placeholder-category.svg'
        }
      ]
      
      return NextResponse.json(fallbackCategories)
    }
  } catch (error) {
    console.error('Error in browse categories endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to fetch browse categories' },
      { status: 500 }
    )
  }
}