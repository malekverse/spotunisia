export interface DownloadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface DownloadOptions {
  onProgress?: (progress: DownloadProgress) => void
  onStart?: () => void
  onComplete?: () => void
  onError?: (error: Error) => void
}

export async function downloadTrack(
  trackName: string,
  artistName: string,
  platform: string = 'youtube',
  options?: DownloadOptions
): Promise<void> {
  try {
    options?.onStart?.()

    const downloadUrl = `/api/download?trackName=${encodeURIComponent(trackName)}&artistName=${encodeURIComponent(artistName)}&platform=${platform}`
    
    const response = await fetch(downloadUrl)
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`)
    }

    const contentLength = response.headers.get('content-length')
    const total = contentLength ? parseInt(contentLength, 10) : 0
    
    // Get filename from Content-Disposition header or create one
    const contentDisposition = response.headers.get('content-disposition')
    let filename = `${trackName} - ${artistName}.m4a`
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    }

    // Create a readable stream
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Failed to get response stream')
    }

    // Create a new response with the stream for downloading
    const chunks: Uint8Array[] = []
    let loaded = 0

    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break
      
      chunks.push(value)
      loaded += value.length
      
      if (options?.onProgress && total > 0) {
        options.onProgress({
          loaded,
          total,
          percentage: Math.round((loaded / total) * 100)
        })
      }
    }

    // Create blob and download
    const blob = new Blob(chunks, { type: 'audio/mp4' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    URL.revokeObjectURL(url)
    
    options?.onComplete?.()
  } catch (error) {
    const downloadError = error instanceof Error ? error : new Error('Unknown download error')
    options?.onError?.(downloadError)
    throw downloadError
  }
}