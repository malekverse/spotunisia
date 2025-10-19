'use client'

import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  User,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface TopBarProps {
  className?: string
  showSearch?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export function TopBar({ 
  className, 
  showSearch = false, 
  searchValue = '', 
  onSearchChange 
}: TopBarProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)

  const handleBack = () => {
    router.back()
  }

  const handleForward = () => {
    router.forward()
  }

  const handleSignIn = () => {
    signIn('spotify')
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div className={cn(
      'flex items-center justify-between h-16 px-6 bg-spotify-black/95 backdrop-blur-sm border-b border-spotify-gray',
      className
    )}>
      {/* Navigation Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="w-8 h-8 p-0 rounded-full bg-spotify-gray hover:bg-spotify-lightgray"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleForward}
          className="w-8 h-8 p-0 rounded-full bg-spotify-gray hover:bg-spotify-lightgray"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-spotify-text" />
            <Input
              type="text"
              placeholder="What do you want to listen to?"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 bg-spotify-gray border-none text-white placeholder:text-spotify-text focus:bg-spotify-lightgray"
            />
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="flex items-center space-x-4">
        {status === 'loading' ? (
          <div className="w-8 h-8 rounded-full bg-spotify-gray animate-pulse" />
        ) : session?.user ? (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-1 rounded-full bg-spotify-gray hover:bg-spotify-lightgray transition-colors"
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-white hidden md:block">
                {session.user.name}
              </span>
            </motion.button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-spotify-gray rounded-md shadow-lg border border-spotify-lightgray z-50"
              >
                <div className="py-1">
                  <button
                    onClick={() => window.open('https://open.spotify.com', '_blank')}
                    className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-spotify-lightgray"
                  >
                    <ExternalLink className="w-4 h-4 mr-3" />
                    Open Spotify
                  </button>
                  <button
                    onClick={() => router.push('/settings')}
                    className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-spotify-lightgray"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <hr className="my-1 border-spotify-lightgray" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-spotify-lightgray"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Log out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignIn}
              className="text-spotify-text hover:text-white"
            >
              Sign up
            </Button>
            <Button
              variant="spotify"
              size="sm"
              onClick={handleSignIn}
              className="px-6"
            >
              Log in
            </Button>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  )
}