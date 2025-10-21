'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, right: 0 })
  const buttonRef = React.useRef<HTMLButtonElement>(null)

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

  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const scrollY = window.scrollY
      setDropdownPosition({
        top: rect.bottom + scrollY + 8, // 8px gap
        right: window.innerWidth - rect.right
      })
    }
  }

  const toggleProfileDropdown = () => {
    if (!isProfileOpen) {
      calculateDropdownPosition()
    }
    setIsProfileOpen(!isProfileOpen)
  }

  // Recalculate position on window resize
  React.useEffect(() => {
    const handleResize = () => {
      if (isProfileOpen) {
        calculateDropdownPosition()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isProfileOpen])

  return (
    <motion.div 
      className={cn(
        'flex items-center justify-between h-18 px-6 liquid-glass border-b border-white/10 relative z-50 overflow-visible',
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navigation Controls */}
      <motion.div 
        className="flex items-center space-x-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="w-10 h-10 p-0 rounded-full liquid-glass-strong liquid-glass-hover border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleForward}
            className="w-10 h-10 p-0 rounded-full liquid-glass-strong liquid-glass-hover border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-lg"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Search Bar */}
      {showSearch && (
        <motion.div 
          className="flex-1 max-w-lg mx-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 20, stiffness: 300 }}
        >
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-spotify-text/80 group-hover:text-white transition-colors duration-300 z-10" />
            <Input
              type="text"
              placeholder="What do you want to listen to?"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-12 pr-4 h-12 liquid-glass-strong border border-white/20 hover:border-white/30 focus:border-spotify-green/50 text-white placeholder:text-spotify-text/70 liquid-glass-hover transition-all duration-300 rounded-full text-base font-medium shadow-lg hover:shadow-xl"
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-spotify-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              initial={false}
            />
          </motion.div>
        </motion.div>
      )}

      {/* User Profile */}
      <motion.div 
        className="flex items-center space-x-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {status === 'loading' ? (
          <motion.div 
            className="w-10 h-10 rounded-full glass animate-pulse border border-white/20"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ) : session?.user ? (
          <div className="relative">
            <motion.button
              ref={buttonRef}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-3 p-2 rounded-full glass-strong hover:glass-stronger border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-lg"
            >
              {session.user.image ? (
                <motion.img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-9 h-9 rounded-full ring-2 ring-white/20 hover:ring-spotify-green/50 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                />
              ) : (
                <motion.div 
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-spotify-green to-spotify-green/70 flex items-center justify-center ring-2 ring-white/20"
                  whileHover={{ scale: 1.1 }}
                >
                  <User className="w-5 h-5 text-white" />
                </motion.div>
              )}
              <span className="text-sm font-semibold text-white hidden md:block pr-1">
                {session.user.name}
              </span>
            </motion.button>

            {/* Profile Dropdown - Rendered via Portal */}
            {isProfileOpen && typeof window !== 'undefined' && createPortal(
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="fixed w-52 glass-strong rounded-xl shadow-2xl border border-white/20 backdrop-blur-xs overflow-hidden bg-spotify-gray/90"
                  style={{ 
                    zIndex: 999999,
                    top: dropdownPosition.top,
                    right: dropdownPosition.right
                  }}
                >
                  <div className="py-2">
                    <motion.button
                      onClick={() => window.open('https://open.spotify.com', '_blank')}
                      className="flex items-center w-full px-4 py-3 text-sm text-white hover:glass-stronger hover:bg-white/10 transition-all duration-200 group"
                      whileHover={{ x: 4 }}
                    >
                      <ExternalLink className="w-5 h-5 mr-3 text-spotify-text group-hover:text-spotify-green transition-colors duration-200" />
                      <span className="font-medium">Open Spotify</span>
                    </motion.button>
                    <motion.button
                      onClick={() => router.push('/settings')}
                      className="flex items-center w-full px-4 py-3 text-sm text-white hover:glass-stronger hover:bg-white/10 transition-all duration-200 group"
                      whileHover={{ x: 4 }}
                    >
                      <Settings className="w-5 h-5 mr-3 text-spotify-text group-hover:text-spotify-green transition-colors duration-200" />
                      <span className="font-medium">Settings</span>
                    </motion.button>
                    <div className="my-2 mx-4 h-px bg-white/20" />
                    <motion.button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-3 text-sm text-white hover:glass-stronger hover:bg-red-500/20 transition-all duration-200 group"
                      whileHover={{ x: 4 }}
                    >
                      <LogOut className="w-5 h-5 mr-3 text-spotify-text group-hover:text-red-400 transition-colors duration-200" />
                      <span className="font-medium group-hover:text-red-400 transition-colors duration-200">Log out</span>
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>,
              document.body
            )}
          </div>
        ) : (
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignIn}
                className="text-spotify-text hover:text-white glass hover:glass-strong border border-transparent hover:border-white/20 transition-all duration-300 px-4 py-2 rounded-full font-medium"
              >
                Sign up
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="default"
                size="sm"
                onClick={handleSignIn}
                className="px-6 py-2 rounded-full font-semibold bg-spotify-green hover:bg-spotify-green/90 text-black shadow-lg hover:shadow-xl transition-all duration-300 border border-spotify-green/50"
              >
                Log in
              </Button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed inset-0"
          style={{ zIndex: 999998 }}
          onClick={() => setIsProfileOpen(false)}
        />,
        document.body
      )}
    </motion.div>
  )
}