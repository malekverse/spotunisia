import { NextRequest, NextResponse } from 'next/server';
import * as playdl from 'play-dl';
import { exec } from 'child_process';
import { promisify } from 'util';

const { search, video_info } = playdl;

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackName, artistName, platform = 'youtube', quality = 'high' } = body;
    
    if (!trackName) {
      return NextResponse.json(
        { error: 'trackName is required' },
        { status: 400 }
      );
    }

    // Construct search query
    const query = artistName ? `${trackName} ${artistName}` : trackName;
    console.log('Download API: Searching for:', query);
    
    // Search for the track
    let searchResults;
    
    try {
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
          return NextResponse.json(
            { error: 'Unsupported platform for download. Use: youtube or soundcloud' },
            { status: 400 }
          );
      }
    } catch (searchError) {
      console.error('Search error:', searchError);
      return NextResponse.json(
        { 
          error: 'Search service temporarily unavailable',
          message: 'Unable to search for tracks at the moment. Please try again later.',
          details: searchError instanceof Error ? searchError.message : 'Unknown search error'
        },
        { status: 503 }
      );
    }

    if (!searchResults || searchResults.length === 0) {
      console.log('Download API: No search results found for query:', query);
      return NextResponse.json(
        { 
          error: 'No results found',
          message: `No tracks found for "${query}". Try different search terms.`
        },
        { status: 404 }
      );
    }

    const track = searchResults[0];
    console.log('Download API: Found track:', track.title);
    console.log('Download API: Full track object:', JSON.stringify(track, null, 2));
    
    // Get the correct URL property
    const trackUrl = track.url || track.link || track.webpage_url;
    console.log('Download API: Track URL:', trackUrl);
    
    // Ensure we have a valid track and URL
    if (!track || !trackUrl) {
      return NextResponse.json(
        { 
          error: 'Track or URL not found',
          message: 'The found track does not have a valid download URL.'
        },
        { status: 404 }
      );
    }
    
    // Validate the URL format before proceeding
    if (!trackUrl || typeof trackUrl !== 'string') {
      console.log('Download API: Invalid URL format:', trackUrl);
      return NextResponse.json(
        { 
          error: 'Invalid URL format',
          message: 'The track URL is not in a valid format for downloading.'
        },
        { status: 400 }
      );
    }

    console.log('Download API: Using track URL directly:', trackUrl);
    console.log('About to stream with play-dl using track URL:', trackUrl);
    
    try {
      // Get video info using play-dl for metadata
      const videoInfo = await playdl.video_info(trackUrl);
      if (!videoInfo || !videoInfo.video_details) {
        return NextResponse.json({ error: 'Failed to get video info' }, { status: 400 });
      }

      // Use yt-dlp to get direct download URL with fallback strategies
       let downloadUrl: string;
       let extractionMethod = 'unknown';
       
       // Strategy 1: yt-dlp with best audio format
       try {
         console.log('Trying yt-dlp with best audio format...');
         const { stdout } = await execAsync(`yt-dlp --get-url --format "bestaudio[ext=m4a]/bestaudio" "${trackUrl}"`);
         downloadUrl = stdout.trim();
         
         if (downloadUrl && downloadUrl.startsWith('http')) {
           extractionMethod = 'yt-dlp-bestaudio';
           console.log('✅ yt-dlp bestaudio extraction successful');
         } else {
           throw new Error('Invalid URL from yt-dlp bestaudio');
         }
       } catch (error) {
         console.log('❌ yt-dlp bestaudio failed, trying fallback strategies...');
         
         // Strategy 2: yt-dlp with any audio format
         try {
           console.log('Trying yt-dlp with any audio format...');
           const { stdout } = await execAsync(`yt-dlp --get-url --format "bestaudio" "${trackUrl}"`);
           downloadUrl = stdout.trim();
           
           if (downloadUrl && downloadUrl.startsWith('http')) {
             extractionMethod = 'yt-dlp-any-audio';
             console.log('✅ yt-dlp any audio extraction successful');
           } else {
             throw new Error('Invalid URL from yt-dlp any audio');
           }
         } catch (error2) {
           console.log('❌ yt-dlp any audio failed, trying worst quality...');
           
           // Strategy 3: yt-dlp with worst quality (most likely to work)
           try {
             console.log('Trying yt-dlp with worst quality...');
             const { stdout } = await execAsync(`yt-dlp --get-url --format "worstaudio" "${trackUrl}"`);
             downloadUrl = stdout.trim();
             
             if (downloadUrl && downloadUrl.startsWith('http')) {
               extractionMethod = 'yt-dlp-worst-audio';
               console.log('✅ yt-dlp worst audio extraction successful');
             } else {
               throw new Error('Invalid URL from yt-dlp worst audio');
             }
           } catch (error3) {
             console.error('❌ All yt-dlp strategies failed:', { error, error2, error3 });
             return NextResponse.json({ 
               error: 'Failed to extract download URL', 
               details: 'All extraction strategies failed',
               strategies_tried: ['bestaudio[ext=m4a]/bestaudio', 'bestaudio', 'worstaudio']
             }, { status: 500 });
           }
         }
       }
       
       console.log(`Using extraction method: ${extractionMethod}`);

      // Fetch the audio stream from the direct URL
      const response = await fetch(downloadUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'audio/*,*/*;q=0.9',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'identity',
          'Range': 'bytes=0-',
        }
      });

      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch audio stream' }, { status: 500 });
      }

      const stream = response.body;
      console.log('Stream created successfully using yt-dlp hybrid approach');

      // Set appropriate headers for download
      const headers = new Headers();
      headers.set('Content-Type', response.headers.get('content-type') || 'audio/mp4');
      
      // Sanitize filename to remove non-ASCII characters
      const sanitizedTitle = (videoInfo.video_details.title || trackName)
        .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
        .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
        .trim() || 'audio'; // Fallback if title becomes empty
      
      headers.set('Content-Disposition', `attachment; filename="${sanitizedTitle}.m4a"`);
      headers.set('Cache-Control', 'no-cache');
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('X-Extraction-Method', extractionMethod);
      headers.set('X-Video-Title', sanitizedTitle);
      headers.set('X-Video-Duration', videoInfo.video_details.durationInSec?.toString() || 'unknown');
      
      // Add content-length if available
       const contentLength = response.headers.get('content-length');
       if (contentLength) {
         headers.set('Content-Length', contentLength);
       }

       // Return the stream directly (fetch response body is already a ReadableStream)
       return new NextResponse(stream, { headers });

    } catch (streamError) {
      console.error('Stream creation error:', streamError);
      
      // Provide user-friendly error messages
      let errorMessage = 'Unable to create download stream.';
      let statusCode = 500;
      
      if (streamError instanceof Error) {
        if (streamError.message.includes('403')) {
          errorMessage = 'YouTube has temporarily blocked download requests. This is common and usually resolves within a few hours.';
          statusCode = 503;
        } else if (streamError.message.includes('parsing')) {
          errorMessage = 'YouTube has updated their system. Downloads are temporarily unavailable while we update our service.';
          statusCode = 503;
        } else if (streamError.message.includes('network')) {
          errorMessage = 'Network error occurred. Please check your internet connection and try again.';
          statusCode = 503;
        }
      }
      
      return NextResponse.json(
        { 
          error: 'Download service unavailable',
          message: errorMessage,
          suggestion: 'Try again in a few minutes, or contact support if the issue persists.',
          details: streamError instanceof Error ? streamError.message : 'Unknown streaming error'
        },
        { status: statusCode }
      );
    }

  } catch (error) {
    console.error('Download API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Download service error',
        message: 'An unexpected error occurred while processing your download request.',
        suggestion: 'Please try again later or contact support if the issue persists.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackName = searchParams.get('trackName');
    const artistName = searchParams.get('artistName');
    const platform = searchParams.get('platform') || 'youtube';
    const quality = searchParams.get('quality') || 'high';
    
    if (!trackName) {
      return NextResponse.json(
        { error: 'trackName parameter is required' },
        { status: 400 }
      );
    }

    console.log('Download API GET: Searching for:', trackName, artistName);

    // Handle platform validation
    if (platform !== 'youtube' && platform !== 'soundcloud') {
      return NextResponse.json(
        { error: 'Unsupported platform for download. Use: youtube or soundcloud' },
        { status: 400 }
      );
    }

    // Search for the track
    let searchResults;
    try {
      searchResults = await search(`${trackName} ${artistName || ''}`, {
        limit: 1,
        source: { youtube: platform === 'youtube' ? 'video' : false }
      });
    } catch (searchError) {
      console.error('Search error:', searchError);
      return NextResponse.json({
        error: 'Search service temporarily unavailable',
        message: 'Unable to search for the requested track. Please try again later.',
        details: searchError instanceof Error ? searchError.message : 'Unknown search error'
      }, { status: 503 });
    }

    if (!searchResults || searchResults.length === 0) {
      return NextResponse.json({
        error: 'No results found',
        message: 'Could not find the requested track. Please check the track name and artist.',
        suggestion: 'Try searching with different keywords or check the spelling.'
      }, { status: 404 });
    }

    const track = searchResults[0];
    console.log('Download API GET: Found track:', track.title);
    console.log('Download API GET: Track URL:', track.url);

    let trackUrl: string;
    if (track.url) {
      trackUrl = track.url;
      console.log('Download API GET: Using track URL directly:', trackUrl);
    } else {
      return NextResponse.json({
        error: 'Track or URL not found',
        message: 'The track was found but no playable URL is available.',
        suggestion: 'Try a different track or platform.'
      }, { status: 404 });
    }

    // Validate URL format
    if (!trackUrl.includes('youtube.com/watch') && !trackUrl.includes('youtu.be/')) {
      return NextResponse.json({
        error: 'Invalid URL format',
        message: 'The track URL is not in a supported format.',
        suggestion: 'Only YouTube URLs are currently supported.'
      }, { status: 400 });
    }

    console.log('About to stream with play-dl using track URL:', trackUrl);

    // Get video info first
    let info;
    try {
      info = await video_info(trackUrl);
    } catch (infoError) {
      console.error('Failed to get video info:', infoError);
      return NextResponse.json({ error: 'Failed to get video info' }, { status: 400 });
    }

    // Try yt-dlp with multiple fallback strategies
    let downloadUrl: string;
    let extractionMethod: string;

    try {
      console.log('Trying yt-dlp with best audio format...');
      const result = await execAsync(`yt-dlp --get-url -f "bestaudio[ext=m4a]/bestaudio" "${trackUrl}"`);
      downloadUrl = result.stdout.trim();
      
      if (!downloadUrl || !downloadUrl.startsWith('http')) {
        throw new Error('Invalid URL from yt-dlp bestaudio');
      }
      extractionMethod = 'yt-dlp-bestaudio';
      console.log('✅ yt-dlp bestaudio extraction successful');
    } catch (error) {
      console.log('❌ yt-dlp bestaudio failed, trying fallback strategies...');
      
      try {
        console.log('Trying yt-dlp with any audio format...');
        const result2 = await execAsync(`yt-dlp --get-url -f "bestaudio" "${trackUrl}"`);
        downloadUrl = result2.stdout.trim();
        
        if (!downloadUrl || !downloadUrl.startsWith('http')) {
          throw new Error('Invalid URL from yt-dlp any audio');
        }
        extractionMethod = 'yt-dlp-any-audio';
        console.log('✅ yt-dlp any audio extraction successful');
      } catch (error2) {
        console.log('❌ yt-dlp any audio failed, trying worst quality...');
        
        try {
          console.log('Trying yt-dlp with worst audio quality...');
          const result3 = await execAsync(`yt-dlp --get-url -f "worstaudio" "${trackUrl}"`);
          downloadUrl = result3.stdout.trim();
          
          if (!downloadUrl || !downloadUrl.startsWith('http')) {
            throw new Error('Invalid URL from yt-dlp worst audio');
          }
          extractionMethod = 'yt-dlp-worst-audio';
          console.log('✅ yt-dlp worst audio extraction successful');
        } catch (error3) {
          console.error('❌ All yt-dlp strategies failed:', { error, error2, error3 });
          return NextResponse.json({
            error: 'Failed to extract download URL',
            details: 'All extraction strategies failed',
            message: 'Unable to process this track for download. The video may be restricted or unavailable.'
          }, { status: 500 });
        }
      }
    }

    console.log(`Using extraction method: ${extractionMethod}`);

    // Fetch the audio stream
    let response: Response;
    try {
      response = await fetch(downloadUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (fetchError) {
      console.error('Failed to fetch audio stream:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch audio stream' }, { status: 500 });
    }

    // Set response headers
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('content-type') || 'audio/mp4');
    
    // Sanitize filename to remove non-ASCII characters
    const sanitizedTitle = (info.video_details.title || trackName)
      .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
      .trim() || 'audio'; // Fallback if title becomes empty
    
    headers.set('Content-Disposition', `attachment; filename="${sanitizedTitle}.m4a"`);
    headers.set('Cache-Control', 'no-cache');
    headers.set('X-Extraction-Method', extractionMethod);
    headers.set('X-Video-Title', sanitizedTitle);
    headers.set('X-Video-Duration', info.video_details.durationInSec?.toString() || '0');
    
    if (response.headers.get('content-length')) {
      headers.set('Content-Length', response.headers.get('content-length')!);
    }

    console.log('Stream created successfully using yt-dlp hybrid approach');

    // Return the stream directly
    return new NextResponse(response.body, {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('Download GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}