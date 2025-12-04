import { NextRequest, NextResponse } from 'next/server';
import { downloadTrack } from '@/lib/download-service';

/**
 * Download API Route
 * 
 * Clean, simple API for downloading music tracks.
 * Supports both GET and POST methods.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackName, artistName } = body;

    // Validate required fields
    if (!trackName || typeof trackName !== 'string') {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          message: 'trackName is required and must be a string',
        },
        { status: 400 }
      );
    }

    console.log(`Download API: Processing request for "${trackName}"${artistName ? ` by ${artistName}` : ''}`);

    // Download the track
    const result = await downloadTrack({
      trackName: trackName.trim(),
      artistName: artistName?.trim(),
    });

    // Handle failure
    if (!result.success || !result.audioBuffer) {
      return NextResponse.json(
        {
          error: 'Download failed',
          message: result.error || 'Unable to download the track. Please try again.',
        },
        { status: 404 }
      );
    }

    // Return the audio file
    console.log(`Download API: Success - ${result.filename} (${result.audioBuffer.length} bytes) via ${result.source}`);
    
    return new NextResponse(new Uint8Array(result.audioBuffer), {
      status: 200,
      headers: {
        'Content-Type': result.contentType || 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(result.filename || 'track.mp3')}"`,
        'Content-Length': result.audioBuffer.length.toString(),
        'Cache-Control': 'no-cache',
        'X-Download-Source': result.source || 'unknown',
      },
    });
  } catch (error) {
    console.error('Download API error:', error);
    
    return NextResponse.json(
      {
        error: 'Server error',
        message: 'An unexpected error occurred. Please try again later.',
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

    // Validate required fields
    if (!trackName) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'trackName query parameter is required',
        },
        { status: 400 }
      );
    }

    console.log(`Download API (GET): Processing request for "${trackName}"${artistName ? ` by ${artistName}` : ''}`);

    // Download the track
    const result = await downloadTrack({
      trackName: trackName.trim(),
      artistName: artistName?.trim() || undefined,
    });

    // Handle failure
    if (!result.success || !result.audioBuffer) {
      return NextResponse.json(
        {
          error: 'Download failed',
          message: result.error || 'Unable to download the track. Please try again.',
        },
        { status: 404 }
      );
    }

    // Return the audio file
    console.log(`Download API (GET): Success - ${result.filename} (${result.audioBuffer.length} bytes) via ${result.source}`);
    
    return new NextResponse(new Uint8Array(result.audioBuffer), {
      status: 200,
      headers: {
        'Content-Type': result.contentType || 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(result.filename || 'track.mp3')}"`,
        'Content-Length': result.audioBuffer.length.toString(),
        'Cache-Control': 'no-cache',
        'X-Download-Source': result.source || 'unknown',
      },
    });
  } catch (error) {
    console.error('Download API (GET) error:', error);
    
    return NextResponse.json(
      {
        error: 'Server error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
