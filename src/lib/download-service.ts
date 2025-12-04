/**
 * Download Service
 * 
 * A clean, modular service for downloading music tracks.
 * Uses multiple strategies with proper fallbacks.
 */

export interface DownloadRequest {
  trackName: string;
  artistName?: string;
}

export interface DownloadResult {
  success: boolean;
  audioBuffer?: Buffer;
  filename?: string;
  contentType?: string;
  error?: string;
  source?: string;
}

interface SearchResult {
  videoId: string;
  title: string;
  url: string;
}

/**
 * Create a safe ASCII filename from track info
 */
function createSafeFilename(trackName: string, artistName?: string): string {
  // Remove all non-ASCII characters and special characters
  const safeName = trackName
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename chars
    .replace(/\s+/g, ' ')         // Normalize spaces
    .trim() || 'track';
  
  const safeArtist = artistName
    ? artistName
        .replace(/[^\x00-\x7F]/g, '')
        .replace(/[<>:"/\\|?*]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    : '';

  return safeArtist ? `${safeName} - ${safeArtist}.mp3` : `${safeName}.mp3`;
}

/**
 * Search YouTube for a track using play-dl
 */
async function searchYouTube(query: string): Promise<SearchResult | null> {
  try {
    // Dynamic import to avoid issues with server-side rendering
    const playdl = await import('play-dl');
    
    console.log('Searching YouTube for:', query);
    
    const results = await playdl.search(query, {
      limit: 3,
      source: { youtube: 'video' },
    });

    if (!results || results.length === 0) {
      console.log('No YouTube results found');
      return null;
    }

    const video = results[0];
    console.log('Found video:', video.title, '- ID:', video.id);
    
    return {
      videoId: video.id || '',
      title: video.title || query,
      url: video.url || `https://www.youtube.com/watch?v=${video.id}`,
    };
  } catch (error) {
    console.error('YouTube search error:', error);
    return null;
  }
}

/**
 * Search SoundCloud for a track
 */
async function searchSoundCloud(query: string): Promise<string | null> {
  try {
    const playdl = await import('play-dl');
    
    console.log('Searching SoundCloud for:', query);
    
    // Initialize SoundCloud if needed
    try {
      const clientId = await playdl.getFreeClientID();
      await playdl.setToken({
        soundcloud: { client_id: clientId },
      });
    } catch {
      // Already initialized or failed - continue anyway
    }
    
    const results = await playdl.search(query, {
      limit: 1,
      source: { soundcloud: 'tracks' },
    });

    if (!results || results.length === 0) {
      return null;
    }

    console.log('Found SoundCloud track:', results[0].name);
    return results[0].url;
  } catch (error) {
    console.error('SoundCloud search error:', error);
    return null;
  }
}

/**
 * Download using yt-dlp command line tool
 */
async function downloadWithYtDlp(url: string): Promise<Buffer | null> {
  try {
    const { spawn } = await import('child_process');
    
    console.log('Attempting yt-dlp download...');

    // Try different strategies
    const strategies = [
      // Strategy 1: Android client (most reliable)
      [
        '--format', 'bestaudio[ext=m4a]/bestaudio/best',
        '--extractor-args', 'youtube:player_client=android',
        '--user-agent', 'com.google.android.youtube/17.36.4 (Linux; U; Android 12; GB) gzip',
        '--no-check-certificate',
        '--geo-bypass',
      ],
      // Strategy 2: Web client
      [
        '--format', 'bestaudio[ext=m4a]/bestaudio/best',
        '--extractor-args', 'youtube:player_client=web',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        '--no-check-certificate',
      ],
      // Strategy 3: iOS client
      [
        '--format', 'bestaudio/best',
        '--extractor-args', 'youtube:player_client=ios',
        '--user-agent', 'com.google.ios.youtube/17.36.4 (iPhone14,3; U; CPU iOS 15_6 like Mac OS X)',
        '--no-check-certificate',
      ],
    ];

    for (const strategyArgs of strategies) {
      try {
        const args = [
          ...strategyArgs,
          '--output', '-',
          '--quiet',
          '--no-warnings',
          '--no-playlist',
          url,
        ];

        const result = await new Promise<Buffer | null>((resolve) => {
          const process = spawn('yt-dlp', args, {
            stdio: ['ignore', 'pipe', 'pipe'],
          });

          const chunks: Buffer[] = [];
          let stderr = '';

          process.stdout.on('data', (chunk: Buffer) => chunks.push(chunk));
          process.stderr.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });

          process.on('close', (code) => {
            if (code === 0 && chunks.length > 0) {
              const buffer = Buffer.concat(chunks);
              if (buffer.length > 10000) { // At least 10KB of audio
                console.log(`yt-dlp success: ${buffer.length} bytes`);
                resolve(buffer);
                return;
              }
            }
            console.log(`yt-dlp failed with code ${code}:`, stderr.slice(0, 200));
            resolve(null);
          });

          process.on('error', () => resolve(null));

          // 60 second timeout
          setTimeout(() => {
            process.kill();
            resolve(null);
          }, 60000);
        });

        if (result) return result;
      } catch {
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error('yt-dlp error:', error);
    return null;
  }
}

/**
 * Download using play-dl streaming
 */
async function downloadWithPlayDl(url: string): Promise<Buffer | null> {
  try {
    const playdl = await import('play-dl');
    
    console.log('Attempting play-dl stream download...');

    const stream = await playdl.stream(url, { quality: 2 });
    
    if (!stream || !stream.stream) {
      return null;
    }

    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      
      stream.stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      
      stream.stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        if (buffer.length > 10000) {
          console.log(`play-dl success: ${buffer.length} bytes`);
          resolve(buffer);
        } else {
          resolve(null);
        }
      });
      
      stream.stream.on('error', () => resolve(null));
      
      // 60 second timeout
      setTimeout(() => {
        stream.stream.destroy();
        resolve(null);
      }, 60000);
    });
  } catch (error) {
    console.error('play-dl error:', error);
    return null;
  }
}

/**
 * Main download function - orchestrates the download process
 */
export async function downloadTrack(request: DownloadRequest): Promise<DownloadResult> {
  const { trackName, artistName } = request;
  
  // Build search query
  const query = artistName ? `${trackName} ${artistName}` : trackName;
  console.log('=== Download request for:', query, '===');

  // Create safe filename upfront
  const filename = createSafeFilename(trackName, artistName);

  // Step 1: Search YouTube
  const youtubeResult = await searchYouTube(query);
  
  if (youtubeResult) {
    // Try yt-dlp first (most reliable)
    let buffer = await downloadWithYtDlp(youtubeResult.url);
    
    if (buffer) {
      return {
        success: true,
        audioBuffer: buffer,
        filename,
        contentType: 'audio/mpeg',
        source: 'youtube-ytdlp',
      };
    }

    // Try play-dl as fallback
    buffer = await downloadWithPlayDl(youtubeResult.url);
    
    if (buffer) {
      return {
        success: true,
        audioBuffer: buffer,
        filename,
        contentType: 'audio/mpeg',
        source: 'youtube-playdl',
      };
    }
  }

  // Step 2: Try SoundCloud as fallback
  console.log('YouTube failed, trying SoundCloud...');
  const soundcloudUrl = await searchSoundCloud(query);
  
  if (soundcloudUrl) {
    const buffer = await downloadWithPlayDl(soundcloudUrl);
    
    if (buffer) {
      return {
        success: true,
        audioBuffer: buffer,
        filename,
        contentType: 'audio/mpeg',
        source: 'soundcloud',
      };
    }
  }

  // All methods failed
  console.log('=== All download methods failed ===');
  return {
    success: false,
    error: `Could not download "${trackName}". The track may be unavailable or restricted.`,
  };
}
