'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Shield,
  Palette,
  Download,
  Volume2,
  HelpCircle,
  ChevronRight,
  Check
} from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loading } from '@/components/ui/Loading'
import { cn } from '@/lib/utils'

interface SettingSection {
  id: string
  title: string
  icon: React.ReactNode
  items: SettingItem[]
}

interface SettingItem {
  id: string
  label: string
  description?: string
  type: 'toggle' | 'select' | 'range' | 'button'
  value?: string | number | boolean
  options?: { label: string; value: string | number | boolean }[]
  min?: number
  max?: number
  step?: number
}

export default function SettingsPage() {
  const { status } = useSession()
  const router = useRouter()

  const [settings, setSettings] = useState({
    // Account settings
    autoplay: true,
    crossfade: false,
    gaplessPlayback: true,
    
    // Audio settings
    audioQuality: 'high',
    volumeLevel: 80,
    normalizeVolume: true,
    
    // Download settings
    downloadQuality: 'high',
    downloadOverCellular: false,
    autoDownload: true,
    
    // Notification settings
    playlistUpdates: true,
    newReleases: true,
    concertAlerts: false,
    
    // Privacy settings
    privateSession: false,
    showRecentlyPlayed: true,
    shareListeningActivity: true,
    
    // Display settings
    theme: 'dark',
    language: 'en',
    showFriendActivity: true,
    
    // Accessibility settings
    highContrast: false,
    reducedMotion: false,
    screenReader: false
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-spotify-black">
        <Loading variant="music" size="lg" />
      </div>
    )
  }

  // Redirect to sign-in if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  const updateSetting = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const settingSections: SettingSection[] = [
    {
      id: 'account',
      title: 'Account',
      icon: <User className="w-5 h-5" />,
      items: [
        {
          id: 'autoplay',
          label: 'Autoplay',
          description: 'Allow Spotify to automatically play similar songs when your music ends',
          type: 'toggle',
          value: settings.autoplay
        },
        {
          id: 'crossfade',
          label: 'Crossfade',
          description: 'Allows you to crossfade between songs',
          type: 'toggle',
          value: settings.crossfade
        },
        {
          id: 'gaplessPlayback',
          label: 'Gapless Playback',
          description: 'Allows gapless playback',
          type: 'toggle',
          value: settings.gaplessPlayback
        }
      ]
    },
    {
      id: 'audio',
      title: 'Audio Quality',
      icon: <Volume2 className="w-5 h-5" />,
      items: [
        {
          id: 'audioQuality',
          label: 'Streaming Quality',
          description: 'Select your preferred audio quality',
          type: 'select',
          value: settings.audioQuality,
          options: [
            { label: 'Low (96 kbps)', value: 'low' },
            { label: 'Normal (160 kbps)', value: 'normal' },
            { label: 'High (320 kbps)', value: 'high' },
            { label: 'Very High (HiFi)', value: 'hifi' }
          ]
        },
        {
          id: 'volumeLevel',
          label: 'Volume Level',
          type: 'range',
          value: settings.volumeLevel,
          min: 0,
          max: 100,
          step: 1
        },
        {
          id: 'normalizeVolume',
          label: 'Normalize Volume',
          description: 'Set the same volume level for all tracks',
          type: 'toggle',
          value: settings.normalizeVolume
        }
      ]
    },
    {
      id: 'download',
      title: 'Download',
      icon: <Download className="w-5 h-5" />,
      items: [
        {
          id: 'downloadQuality',
          label: 'Download Quality',
          type: 'select',
          value: settings.downloadQuality,
          options: [
            { label: 'Normal (160 kbps)', value: 'normal' },
            { label: 'High (320 kbps)', value: 'high' }
          ]
        },
        {
          id: 'downloadOverCellular',
          label: 'Download using cellular',
          description: 'Allow downloads over cellular data',
          type: 'toggle',
          value: settings.downloadOverCellular
        },
        {
          id: 'autoDownload',
          label: 'Auto Download',
          description: 'Automatically download new episodes and songs',
          type: 'toggle',
          value: settings.autoDownload
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      items: [
        {
          id: 'playlistUpdates',
          label: 'Playlist Updates',
          description: 'Get notified when playlists you follow are updated',
          type: 'toggle',
          value: settings.playlistUpdates
        },
        {
          id: 'newReleases',
          label: 'New Releases',
          description: 'Get notified about new releases from artists you follow',
          type: 'toggle',
          value: settings.newReleases
        },
        {
          id: 'concertAlerts',
          label: 'Concert Alerts',
          description: 'Get notified about concerts near you',
          type: 'toggle',
          value: settings.concertAlerts
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          id: 'privateSession',
          label: 'Private Session',
          description: 'When turned on, your listening activity is hidden from others',
          type: 'toggle',
          value: settings.privateSession
        },
        {
          id: 'showRecentlyPlayed',
          label: 'Recently Played Artists',
          description: 'Show your recently played artists on your profile',
          type: 'toggle',
          value: settings.showRecentlyPlayed
        },
        {
          id: 'shareListeningActivity',
          label: 'Share Listening Activity',
          description: 'Share what you\'re listening to with followers',
          type: 'toggle',
          value: settings.shareListeningActivity
        }
      ]
    },
    {
      id: 'display',
      title: 'Display',
      icon: <Palette className="w-5 h-5" />,
      items: [
        {
          id: 'theme',
          label: 'Theme',
          type: 'select',
          value: settings.theme,
          options: [
            { label: 'Dark', value: 'dark' },
            { label: 'Light', value: 'light' },
            { label: 'Auto', value: 'auto' }
          ]
        },
        {
          id: 'language',
          label: 'Language',
          type: 'select',
          value: settings.language,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
            { label: 'Italian', value: 'it' }
          ]
        },
        {
          id: 'showFriendActivity',
          label: 'Show Friend Activity',
          description: 'See what your friends are listening to',
          type: 'toggle',
          value: settings.showFriendActivity
        }
      ]
    }
  ]

  const renderSettingItem = (item: SettingItem) => {
    switch (item.type) {
      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-white font-medium">{item.label}</p>
              {item.description && (
                <p className="text-sm text-spotify-text mt-1">{item.description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateSetting(item.id, !item.value)}
              className={cn(
                'w-12 h-6 rounded-full p-0 transition-colors',
                item.value ? 'bg-primary' : 'bg-spotify-gray'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 bg-white rounded-full transition-transform',
                  item.value ? 'translate-x-6' : 'translate-x-0.5'
                )}
              />
            </Button>
          </div>
        )

      case 'select':
        return (
          <div>
            <p className="text-white font-medium mb-2">{item.label}</p>
            {item.description && (
              <p className="text-sm text-spotify-text mb-3">{item.description}</p>
            )}
            <div className="space-y-2">
              {item.options?.map((option) => (
                <Button
                  key={String(option.value)}
                  variant="ghost"
                  onClick={() => updateSetting(item.id, option.value)}
                  className={cn(
                    'w-full justify-between text-left',
                    item.value === option.value && 'bg-spotify-lightgray'
                  )}
                >
                  <span>{option.label}</span>
                  {item.value === option.value && <Check className="w-4 h-4" />}
                </Button>
              ))}
            </div>
          </div>
        )

      case 'range':
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-medium">{item.label}</p>
              <span className="text-sm text-spotify-text">{item.value}%</span>
            </div>
            <input
              type="range"
              min={item.min}
              max={item.max}
              step={item.step}
              value={Number(item.value)}
              onChange={(e) => updateSetting(item.id, parseInt(e.target.value))}
              className="w-full h-2 bg-spotify-gray rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AppLayout showSearch={false}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-spotify-text">Manage your account settings and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingSections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <Card className="p-6 bg-spotify-lightgray">
                <div className="flex items-center space-x-3 mb-6">
                  {section.icon}
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>

                <div className="space-y-6">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                      className="pb-6 border-b border-spotify-gray last:border-b-0 last:pb-0"
                    >
                      {renderSettingItem(item)}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-spotify-lightgray">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <HelpCircle className="w-5 h-5 mr-3" />
              Support & About
            </h2>

            <div className="space-y-4">
              <Button
                variant="ghost"
                className="w-full justify-between text-left"
              >
                <span className="text-white">Help & Support</span>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between text-left"
              >
                <span className="text-white">Terms of Service</span>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between text-left"
              >
                <span className="text-white">Privacy Policy</span>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between text-left"
              >
                <span className="text-white">About Spotify Clone</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 bg-red-900/20 border border-red-500/30">
            <h2 className="text-xl font-bold text-red-400 mb-6">Danger Zone</h2>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                Clear Cache
              </Button>

              <Button
                variant="outline"
                className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                Reset All Settings
              </Button>

              <Button
                variant="outline"
                className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #1db954;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #1db954;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </AppLayout>
  )
}