'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Types
export interface Track {
  id: string
  name: string
  artist: string
  album: string
  image: string
  duration: number
  preview_url?: string
  isLiked?: boolean
  isDownloaded?: boolean
  uri?: string
  external_urls?: {
    spotify: string
  }
}

export interface Playlist {
  id: string
  name: string
  description?: string
  image: string
  owner: string
  trackCount: number
  tracks?: Track[]
  isPlaying?: boolean
  collaborative?: boolean
  public?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  image?: string
  country?: string
  followers?: number
  premium?: boolean
}

// Music Player Store
interface MusicPlayerState {
  // Current playback
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  volume: number
  isMuted: boolean
  
  // Queue management
  queue: Track[]
  currentIndex: number
  history: Track[]
  
  // Player modes
  isShuffled: boolean
  repeatMode: 'off' | 'track' | 'playlist'
  crossfadeEnabled: boolean
  crossfadeDuration: number
  
  // Player UI
  isExpanded: boolean
  showLyrics: boolean
  showQueue: boolean
  
  // Actions
  setCurrentTrack: (track: Track | null) => void
  setIsPlaying: (playing: boolean) => void
  setCurrentTime: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  addToQueue: (track: Track) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  playNext: () => void
  playPrevious: () => void
  toggleShuffle: () => void
  setRepeatMode: (mode: 'off' | 'track' | 'playlist') => void
  toggleExpanded: () => void
  toggleLyrics: () => void
  toggleQueue: () => void
  setCrossfade: (enabled: boolean, duration?: number) => void
}

export const useMusicPlayerStore = create<MusicPlayerState>()(
  persist(
    (set) => ({
      // Initial state
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      volume: 0.8,
      isMuted: false,
      queue: [],
      currentIndex: 0,
      history: [],
      isShuffled: false,
      repeatMode: 'off',
      crossfadeEnabled: false,
      crossfadeDuration: 3,
      isExpanded: false,
      showLyrics: false,
      showQueue: false,

      // Actions
      setCurrentTrack: (track) => set({ currentTrack: track }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      
      addToQueue: (track) => set((state) => ({
        queue: [...state.queue, track]
      })),
      
      removeFromQueue: (index) => set((state) => ({
        queue: state.queue.filter((_, i) => i !== index)
      })),
      
      clearQueue: () => set({ queue: [] }),
      
      playNext: () => set((state) => {
        const nextIndex = state.currentIndex + 1
        if (nextIndex < state.queue.length) {
          const nextTrack = state.queue[nextIndex]
          return {
            currentIndex: nextIndex,
            currentTrack: nextTrack,
            history: state.currentTrack ? [...state.history, state.currentTrack] : state.history
          }
        }
        return state
      }),
      
      playPrevious: () => set((state) => {
        if (state.history.length > 0) {
          const previousTrack = state.history[state.history.length - 1]
          return {
            currentTrack: previousTrack,
            history: state.history.slice(0, -1)
          }
        }
        return state
      }),
      
      toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),
      
      setRepeatMode: (mode) => set({ repeatMode: mode }),
      
      toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
      
      toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics })),
      
      toggleQueue: () => set((state) => ({ showQueue: !state.showQueue })),
      
      setCrossfade: (enabled, duration = 3) => set({
        crossfadeEnabled: enabled,
        crossfadeDuration: duration
      }),
    }),
    {
      name: 'music-player-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
        isShuffled: state.isShuffled,
        repeatMode: state.repeatMode,
        crossfadeEnabled: state.crossfadeEnabled,
        crossfadeDuration: state.crossfadeDuration,
      }),
    }
  )
)

// UI Store
interface UIState {
  // Theme and appearance
  theme: 'dark' | 'light' | 'auto'
  accentColor: string
  compactMode: boolean
  
  // Layout
  sidebarCollapsed: boolean
  showNowPlayingBar: boolean
  
  // Modals and overlays
  showSettings: boolean
  showProfile: boolean
  showCreatePlaylist: boolean
  
  // Search
  recentSearches: string[]
  searchFilters: {
    type: string[]
    year?: number
    genre?: string
  }
  
  // Notifications
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message: string
    timestamp: number
  }>
  
  // Actions
  setTheme: (theme: 'dark' | 'light' | 'auto') => void
  setAccentColor: (color: string) => void
  toggleCompactMode: () => void
  toggleSidebar: () => void
  toggleNowPlayingBar: () => void
  toggleSettings: () => void
  toggleProfile: () => void
  toggleCreatePlaylist: () => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
  setSearchFilters: (filters: UIState['searchFilters']) => void
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      theme: 'dark',
      accentColor: '#1DB954',
      compactMode: false,
      sidebarCollapsed: false,
      showNowPlayingBar: true,
      showSettings: false,
      showProfile: false,
      showCreatePlaylist: false,
      recentSearches: [],
      searchFilters: {
        type: ['track', 'artist', 'album', 'playlist']
      },
      notifications: [],

      // Actions
      setTheme: (theme) => set({ theme }),
      setAccentColor: (color) => set({ accentColor: color }),
      toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleNowPlayingBar: () => set((state) => ({ showNowPlayingBar: !state.showNowPlayingBar })),
      toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),
      toggleProfile: () => set((state) => ({ showProfile: !state.showProfile })),
      toggleCreatePlaylist: () => set((state) => ({ showCreatePlaylist: !state.showCreatePlaylist })),
      
      addRecentSearch: (query) => set((state) => ({
        recentSearches: [query, ...state.recentSearches.filter(s => s !== query)].slice(0, 10)
      })),
      
      clearRecentSearches: () => set({ recentSearches: [] }),
      
      setSearchFilters: (filters) => set({ searchFilters: filters }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now()
          },
          ...state.notifications
        ].slice(0, 5) // Keep only last 5 notifications
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        accentColor: state.accentColor,
        compactMode: state.compactMode,
        sidebarCollapsed: state.sidebarCollapsed,
        showNowPlayingBar: state.showNowPlayingBar,
        recentSearches: state.recentSearches,
        searchFilters: state.searchFilters,
      }),
    }
  )
)

// Library Store
interface LibraryState {
  // User's music library
  likedTracks: Track[]
  playlists: Playlist[]
  followedArtists: string[]
  recentlyPlayed: Track[]
  downloadedTracks: Track[]
  
  // Actions
  addLikedTrack: (track: Track) => void
  removeLikedTrack: (trackId: string) => void
  addPlaylist: (playlist: Playlist) => void
  removePlaylist: (playlistId: string) => void
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void
  followArtist: (artistId: string) => void
  unfollowArtist: (artistId: string) => void
  addToRecentlyPlayed: (track: Track) => void
  downloadTrack: (track: Track) => void
  removeDownload: (trackId: string) => void
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      // Initial state
      likedTracks: [],
      playlists: [],
      followedArtists: [],
      recentlyPlayed: [],
      downloadedTracks: [],

      // Actions
      addLikedTrack: (track) => set((state) => ({
        likedTracks: [track, ...state.likedTracks.filter(t => t.id !== track.id)]
      })),
      
      removeLikedTrack: (trackId) => set((state) => ({
        likedTracks: state.likedTracks.filter(t => t.id !== trackId)
      })),
      
      addPlaylist: (playlist) => set((state) => ({
        playlists: [playlist, ...state.playlists]
      })),
      
      removePlaylist: (playlistId) => set((state) => ({
        playlists: state.playlists.filter(p => p.id !== playlistId)
      })),
      
      updatePlaylist: (playlistId, updates) => set((state) => ({
        playlists: state.playlists.map(p => 
          p.id === playlistId ? { ...p, ...updates } : p
        )
      })),
      
      followArtist: (artistId) => set((state) => ({
        followedArtists: [...state.followedArtists, artistId]
      })),
      
      unfollowArtist: (artistId) => set((state) => ({
        followedArtists: state.followedArtists.filter(id => id !== artistId)
      })),
      
      addToRecentlyPlayed: (track) => set((state) => ({
        recentlyPlayed: [track, ...state.recentlyPlayed.filter(t => t.id !== track.id)].slice(0, 50)
      })),
      
      downloadTrack: (track) => set((state) => ({
        downloadedTracks: [track, ...state.downloadedTracks.filter(t => t.id !== track.id)]
      })),
      
      removeDownload: (trackId) => set((state) => ({
        downloadedTracks: state.downloadedTracks.filter(t => t.id !== trackId)
      })),
    }),
    {
      name: 'library-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)