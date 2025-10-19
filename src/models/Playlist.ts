import mongoose, { Document, Schema } from 'mongoose'

export interface IPlaylist extends Document {
  spotifyId?: string
  name: string
  description?: string
  images: Array<{
    url: string
    height?: number
    width?: number
  }>
  owner: {
    id: string
    displayName: string
  }
  public: boolean
  collaborative: boolean
  tracks: Array<{
    spotifyId: string
    addedAt: Date
    addedBy: string
    downloaded: boolean
    downloadPath?: string
  }>
  followers: number
  isCustom: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
}

const PlaylistSchema = new Schema<IPlaylist>({
  spotifyId: {
    type: String,
    sparse: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  images: [{
    url: String,
    height: Number,
    width: Number
  }],
  owner: {
    id: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      required: true
    }
  },
  public: {
    type: Boolean,
    default: false
  },
  collaborative: {
    type: Boolean,
    default: false
  },
  tracks: [{
    spotifyId: {
      type: String,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    addedBy: {
      type: String,
      required: true
    },
    downloaded: {
      type: Boolean,
      default: false
    },
    downloadPath: String
  }],
  followers: {
    type: Number,
    default: 0
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
PlaylistSchema.index({ spotifyId: 1 })
PlaylistSchema.index({ userId: 1 })
PlaylistSchema.index({ 'owner.id': 1 })

export default mongoose.models.Playlist || mongoose.model<IPlaylist>('Playlist', PlaylistSchema)