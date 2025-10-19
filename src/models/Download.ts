import mongoose, { Document, Schema } from 'mongoose'

export interface IDownload extends Document {
  userId: string
  spotifyTrackId: string
  trackName: string
  artistName: string
  albumName: string
  duration: number
  filePath: string
  fileSize: number
  quality: 'low' | 'medium' | 'high'
  format: string
  downloadedAt: Date
  lastAccessed: Date
  playCount: number
  isAvailable: boolean
}

const DownloadSchema = new Schema<IDownload>({
  userId: {
    type: String,
    required: true
  },
  spotifyTrackId: {
    type: String,
    required: true
  },
  trackName: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  albumName: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  quality: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  format: {
    type: String,
    default: 'mp3'
  },
  downloadedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  playCount: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Compound index for user and track
DownloadSchema.index({ userId: 1, spotifyTrackId: 1 }, { unique: true })
DownloadSchema.index({ userId: 1 })
DownloadSchema.index({ downloadedAt: -1 })

export default mongoose.models.Download || mongoose.model<IDownload>('Download', DownloadSchema)