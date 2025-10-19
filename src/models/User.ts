import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  spotifyId: string
  email: string
  displayName: string
  images: Array<{
    url: string
    height?: number
    width?: number
  }>
  country: string
  followers: number
  product: string
  accessToken: string
  refreshToken: string
  tokenExpiresAt: Date
  preferences: {
    aiRecommendations: boolean
    downloadQuality: 'low' | 'medium' | 'high'
    autoPlay: boolean
    crossfade: number
    volume: number
  }
  likedSongs: string[]
  playlists: string[]
  recentlyPlayed: Array<{
    trackId: string
    playedAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  spotifyId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    height: Number,
    width: Number
  }],
  country: String,
  followers: {
    type: Number,
    default: 0
  },
  product: String,
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  tokenExpiresAt: {
    type: Date,
    required: true
  },
  preferences: {
    aiRecommendations: {
      type: Boolean,
      default: true
    },
    downloadQuality: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'high'
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    crossfade: {
      type: Number,
      default: 0,
      min: 0,
      max: 12
    },
    volume: {
      type: Number,
      default: 0.8,
      min: 0,
      max: 1
    }
  },
  likedSongs: [{
    type: String
  }],
  playlists: [{
    type: String
  }],
  recentlyPlayed: [{
    trackId: String,
    playedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)