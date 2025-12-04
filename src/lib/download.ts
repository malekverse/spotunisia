/**
 * Client-side Download Helper
 * 
 * Handles downloading music tracks from the browser.
 * Communicates with the download API and triggers file downloads.
 */

export interface DownloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface DownloadCallbacks {
  onProgress?: (progress: DownloadProgress) => void;
  onStart?: () => void;
  onComplete?: (filename: string) => void;
  onError?: (error: Error) => void;
}

export class DownloadError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: string
  ) {
    super(message);
    this.name = 'DownloadError';
  }
}

/**
 * Download a track by name and artist
 */
export async function downloadTrack(
  trackName: string,
  artistName?: string,
  callbacks?: DownloadCallbacks
): Promise<void> {
  try {
    callbacks?.onStart?.();

    // Make request to download API
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trackName,
        artistName,
      }),
    });

    // Handle error responses
    if (!response.ok) {
      let errorMessage = 'Download failed';
      let details: string | undefined;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        details = errorData.details;
      } catch {
        // Response wasn't JSON
        errorMessage = `Download failed with status ${response.status}`;
      }

      throw new DownloadError(errorMessage, response.status, details);
    }

    // Get content info
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    
    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `${trackName}${artistName ? ` - ${artistName}` : ''}.mp3`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch) {
        filename = decodeURIComponent(filenameMatch[1]);
      }
    }

    // Read the response stream with progress tracking
    const reader = response.body?.getReader();
    if (!reader) {
      throw new DownloadError('Failed to read response stream');
    }

    const chunks: Uint8Array[] = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;

      // Report progress if we know the total size
      if (callbacks?.onProgress && total > 0) {
        callbacks.onProgress({
          loaded,
          total,
          percentage: Math.round((loaded / total) * 100),
        });
      }
    }

    // Verify we got data
    if (chunks.length === 0 || loaded === 0) {
      throw new DownloadError('No data received from server');
    }

    // Create blob and trigger download
    const blob = new Blob(chunks as BlobPart[], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);

    callbacks?.onComplete?.(filename);
  } catch (error) {
    const downloadError = error instanceof DownloadError 
      ? error 
      : new DownloadError(
          error instanceof Error ? error.message : 'Unknown download error'
        );
    
    callbacks?.onError?.(downloadError);
    throw downloadError;
  }
}

/**
 * Check if a track is currently being downloaded
 * (Utility for managing download state in components)
 */
export function createDownloadManager() {
  const activeDownloads = new Set<string>();

  return {
    isDownloading(trackId: string): boolean {
      return activeDownloads.has(trackId);
    },

    async download(
      trackId: string,
      trackName: string,
      artistName?: string,
      callbacks?: DownloadCallbacks
    ): Promise<void> {
      if (activeDownloads.has(trackId)) {
        console.warn('Download already in progress for:', trackId);
        return;
      }

      activeDownloads.add(trackId);

      try {
        await downloadTrack(trackName, artistName, {
          ...callbacks,
          onComplete: (filename) => {
            activeDownloads.delete(trackId);
            callbacks?.onComplete?.(filename);
          },
          onError: (error) => {
            activeDownloads.delete(trackId);
            callbacks?.onError?.(error);
          },
        });
      } catch (error) {
        activeDownloads.delete(trackId);
        throw error;
      }
    },
  };
}
