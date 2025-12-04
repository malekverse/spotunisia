import { NextRequest, NextResponse } from 'next/server';
import playdl from 'play-dl';

// Type for the track result from playdl search
interface TrackResult {
  url: string;
  title?: string;
  name?: string;
  durationInSec?: number;
  thumbnails?: { url: string }[];
  thumbnail?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const platform = searchParams.get('platform') || 'youtube';
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Search for the track
    let searchResults;
    
    switch (platform) {
      case 'youtube':
        searchResults = await playdl.search(query, {
          limit: 1,
          source: { youtube: 'video' }
        });
        break;
      case 'soundcloud':
        searchResults = await playdl.search(query, {
          limit: 1,
          source: { soundcloud: 'tracks' }
        });
        break;
      case 'spotify':
        searchResults = await playdl.search(query, {
          limit: 1,
          source: { spotify: 'track' }
        });
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported platform. Use: youtube, soundcloud, or spotify' },
          { status: 400 }
        );
    }

    if (!searchResults || searchResults.length === 0) {
      console.log('Stream API: No search results found for query:', query);
      return NextResponse.json(
        { error: 'No results found' },
        { status: 404 }
      );
    }

    const track = searchResults[0] as TrackResult;
    const trackTitle = track.title || track.name || 'Unknown';
    console.log('Stream API: Found track:', trackTitle);
    console.log('Stream API: Track URL:', track.url);
    
    // Ensure we have a valid track and URL
    if (!track || !track.url) {
      return NextResponse.json(
        { error: 'Track or URL not found' },
        { status: 404 }
      );
    }
    
    // Get stream info using the track URL
    const streamInfo = await playdl.stream(track.url);
    
    if (!streamInfo || !streamInfo.stream) {
      return NextResponse.json(
        { error: 'Unable to get stream' },
        { status: 500 }
      );
    }

    const thumbnail = track.thumbnails?.[0]?.url || track.thumbnail;

    // Return the stream URL and metadata
    return NextResponse.json({
      success: true,
      data: {
        streamUrl: track.url, // Return the original URL for client-side playback
        title: trackTitle,
        duration: track.durationInSec,
        thumbnail,
        platform,
        originalUrl: track.url
      }
    });

  } catch (error) {
    console.error('Stream API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackName, artistName, platform = 'youtube' } = body;
    
    if (!trackName) {
      return NextResponse.json(
        { error: 'trackName is required' },
        { status: 400 }
      );
    }

    // Construct search query
    const query = artistName ? `${trackName} ${artistName}` : trackName;
    console.log('Stream API: Searching for:', query);
    
    // Use the GET logic with the constructed query
    const searchParams = new URLSearchParams({
      q: query,
      platform
    });
    
    const getRequest = new NextRequest(`${request.url}?${searchParams.toString()}`);
    return GET(getRequest);
    
  } catch (error) {
    console.error('Stream POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
