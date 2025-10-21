import SpotifyProvider from 'next-auth/providers/spotify'
import connectDB from './mongodb'
import User from '@/models/User'

interface SpotifyUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  images?: Array<{ url: string; height: number; width: number }>
}

interface RefreshTokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
}

interface TokenWithSpotify {
  accessToken?: string
  refreshToken?: string
  expiresAt?: number
  spotifyId?: string
  error?: string
}

const scopes = [
  'user-read-email',
  'user-read-private',
  'user-library-read',
  'user-library-modify',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-follow-read',
  'user-follow-modify',
  'streaming'
].join(' ')

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: scopes,
        },
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, account, user }: { token: any; account: any; user: any }) {
      if (account && user) {
        // Initial sign in
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
        token.spotifyId = user.id
        
        // Save user to database
        await connectDB()
        
        const existingUser = await User.findOne({ spotifyId: user.id })
        
        if (!existingUser) {
          await User.create({
            spotifyId: user.id,
            email: user.email,
            displayName: user.name,
            images: (user as SpotifyUser).images || [],
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            tokenExpiresAt: new Date(account.expires_at! * 1000),
          })
        } else {
          // Update tokens
          await User.findByIdAndUpdate(existingUser._id, {
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            tokenExpiresAt: new Date(account.expires_at! * 1000),
          })
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken as string
      session.user.id = token.spotifyId as string
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt' as const,
  },
}

async function refreshAccessToken(token: TokenWithSpotify): Promise<TokenWithSpotify> {
  try {
    const url = 'https://accounts.spotify.com/api/token'
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken || '',
      }),
      method: 'POST',
    })

    const refreshedTokens: RefreshTokenResponse = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    // Update database with new tokens
    await connectDB()
    await User.findOneAndUpdate(
      { spotifyId: token.spotifyId },
      {
        accessToken: refreshedTokens.access_token,
        refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        tokenExpiresAt: new Date(Date.now() + refreshedTokens.expires_in * 1000),
      }
    )

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}