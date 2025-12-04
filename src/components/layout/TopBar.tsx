'use client'

import React, { memo, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  User,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopBarProps {
  className?: string
  showSearch?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
}

function TopBarComponent({ 
  className, 
  showSearch = false, 
  searchValue = '', 
  onSearchChange 
}: TopBarProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleBack = () => router.back()
  const handleForward = () => router.forward()
  const handleSignIn = () => signIn('spotify')
  const handleSignOut = () => signOut()

  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      })
    }
  }

  const toggleProfileDropdown = () => {
    if (!isProfileOpen) calculateDropdownPosition()
    setIsProfileOpen(!isProfileOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      if (isProfileOpen) calculateDropdownPosition()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isProfileOpen])

  return (
    <div className={cn(
      'flex items-center justify-between h-16 px-6 liquid-glass border-b border-white/5 relative z-50',
      className
    )}>
      {/* Navigation Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full liquid-glass-strong flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleForward}
          className="w-9 h-9 rounded-full liquid-glass-strong flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-3">
        {status === 'loading' ? (
          <div className="w-9 h-9 rounded-full liquid-glass animate-pulse" />
        ) : session?.user ? (
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-2 p-1.5 pr-3 rounded-full liquid-glass-strong hover:bg-white/10 transition-all duration-300"
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-7 h-7 rounded-full ring-2 ring-white/20"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-spotify-green to-green-400 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-white hidden md:block">
                {session.user.name}
              </span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && typeof window !== 'undefined' && createPortal(
              <div
                className="fixed w-52 liquid-glass-strong rounded-xl shadow-2xl overflow-hidden animate-scale-in"
                style={{ 
                  zIndex: 999999,
                  top: dropdownPosition.top,
                  right: dropdownPosition.right
                }}
              >
                <div className="py-2">
                  <button
                    onClick={() => window.open('https://open.spotify.com', '_blank')}
                    className="flex items-center w-full px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4 mr-3 text-white/60" />
                    Open Spotify
                  </button>
                  <button
                    onClick={() => router.push('/settings')}
                    className="flex items-center w-full px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <Settings className="w-4 h-4 mr-3 text-white/60" />
                    Settings
                  </button>
                  <div className="my-1 mx-3 h-px bg-white/10" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-3 text-white/60" />
                    Log out
                  </button>
                </div>
              </div>,
              document.body
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSignIn}
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Sign up
            </button>
            <button
              onClick={handleSignIn}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-white text-black hover:scale-105 transition-all duration-300"
            >
              Log in
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed inset-0"
          style={{ zIndex: 999998 }}
          onClick={() => setIsProfileOpen(false)}
        />,
        document.body
      )}
    </div>
  )
}

export const TopBar = memo(TopBarComponent)
