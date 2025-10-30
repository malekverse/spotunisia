import { NextRequest, NextResponse } from 'next/server';
import playdl from 'play-dl';

interface PlaylistTrack {
  trackName: string;
  artistName?: string;
  downloadUrl?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tracks, platform = 'youtube', quality = 'high', format = 'json' } = body;
    
    if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
      return NextResponse.json(
        { error: 'tracks array is required and must not be empty' },
        { status: 400 }
      );
    }

    const results: PlaylistTrack[] = [];
    const downloadPromises = tracks.map(async (track: any, index: number) => {
      try {
        const { trackName, artistName } = track;
        
        if (!trackName) {
          return {
            trackName: trackName || `Track ${index + 1}`,
            error: 'Track name is required'
          };
        }

        // Construct search query
        const query = artistName ? `${trackName} ${artistName}` : trackName;
        
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
          default:
            return {
              trackName,
              artistName,
              error: 'Unsupported platform for download. Use: youtube or soundcloud'
            };
        }

        if (!searchResults || searchResults.length === 0) {
          return {
            trackName,
            artistName,
            error: 'No results found'
          };
        }

        const foundTrack = searchResults[0];
        
        // Get stream info for download URL
        const streamInfo = await playdl.stream(foundTrack.url, {
          quality: quality === 'high' ? 'high' : 'low'
        });
        
        if (!streamInfo || !streamInfo.url) {
          return {
            trackName,
            artistName,
            error: 'Unable to get download stream'
          };
        }

        return {
          trackName,
          artistName,
          downloadUrl: streamInfo.url,
          title: foundTrack.title,
          duration: foundTrack.durationInSec,
          thumbnail: foundTrack.thumbnails?.[0]?.url,
          originalUrl: foundTrack.url
        };

      } catch (error) {
        return {
          trackName: track.trackName || `Track ${index + 1}`,
          artistName: track.artistName,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // Wait for all downloads to process
    const downloadResults = await Promise.all(downloadPromises);
    
    if (format === 'zip') {
      // For ZIP format, we would need additional libraries like JSZip
      // For now, return JSON with download URLs
      return NextResponse.json({
        success: true,
        message: 'ZIP format not yet implemented. Use individual download URLs.',
        data: {
          totalTracks: tracks.length,
          successfulTracks: downloadResults.filter(r => !r.error).length,
          failedTracks: downloadResults.filter(r => r.error).length,
          tracks: downloadResults
        }
      });
    }

    // Return JSON format with all download URLs
    return NextResponse.json({
      success: true,
      data: {
        totalTracks: tracks.length,
        successfulTracks: downloadResults.filter(r => !r.error).length,
        failedTracks: downloadResults.filter(r => r.error).length,
        tracks: downloadResults
      }
    });

  } catch (error) {
    console.error('Playlist download API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Playlist download endpoint',
    usage: {
      method: 'POST',
      body: {
        tracks: [
          { trackName: 'Song Name', artistName: 'Artist Name' }
        ],
        platform: 'youtube | soundcloud (default: youtube)',
        quality: 'high | low (default: high)',
        format: 'json | zip (default: json, zip not yet implemented)'
      }
    }
  });
}