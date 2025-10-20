'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Search, 
  Library, 
  Heart, 
  Download, 
  Plus,
  Music,
  Mic2,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const sidebarItems = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Search',
    href: '/search',
    icon: Search,
  },
  {
    title: 'Your Library',
    href: '/library',
    icon: Library,
  },
]

const libraryItems = [
  {
    title: 'Liked Songs',
    href: '/library?tab=liked',
    icon: Heart,
  },
  {
    title: 'Downloaded',
    href: '/library?tab=downloaded',
    icon: Download,
  },
  {
    title: 'Recently Played',
    href: '/library?tab=recent',
    icon: Music,
  },
  {
    title: 'AI Recommendations',
    href: '/ai-recommendations',
    icon: TrendingUp,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn('flex flex-col h-full liquid-glass border-r border-white/10 text-white', className)}>
      {/* Logo */}
      <motion.div 
        className="p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className="flex items-center space-x-3 group">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-br from-spotify-green to-green-400 rounded-xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic2 className="w-6 h-6 text-white" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-spotify-green bg-clip-text text-transparent group-hover:from-spotify-green group-hover:to-white transition-all duration-300">
            Spotify Clone
          </span>
        </Link>
      </motion.div>

      {/* Main Navigation */}
      <motion.nav 
        className="px-3 space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {sidebarItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden',
                  isActive
                    ? 'liquid-glass-strong text-white shadow-lg border border-white/20'
              : 'text-spotify-text hover:text-white liquid-glass-hover hover:border hover:border-white/10'
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive ? "text-spotify-green" : "group-hover:text-spotify-green"
                )} />
                <span className="relative z-10">{item.title}</span>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-spotify-green/20 to-transparent rounded-xl"
                    layoutId="activeNavItem"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </motion.nav>

      {/* Create Playlist Button */}
      <motion.div 
        className="px-6 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          variant="default"
          className="liquid-glass-hover w-full justify-start text-white hover:text-spotify-green border border-white/10 hover:border-spotify-green/50"
        >
          <div className='flex justify-start '>
          <Plus className="w-5 h-5 mr-3" />
          Create Playlist
          </div>
        </Button>
      </motion.div>

      {/* Library Section */}
      <motion.div 
        className="flex-1 px-3 space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="px-4 py-3 text-xs font-semibold text-spotify-text uppercase tracking-wider border-b border-white/10">
          Your Library
        </div>
        {libraryItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden',
                  isActive
                    ? 'liquid-glass-strong text-white shadow-lg border border-white/20'
                : 'text-spotify-text hover:text-white liquid-glass-hover hover:border hover:border-white/10'
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive ? "text-spotify-green" : "group-hover:text-spotify-green"
                )} />
                <span className="relative z-10">{item.title}</span>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-spotify-green/20 to-transparent rounded-xl"
                    layoutId="activeLibraryItem"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Install App */}
      <motion.div 
        className="p-6 border-t border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button
          variant="gradient"
          className="w-full justify-start text-white shadow-lg hover:shadow-xl"
          >
          <div className='flex'>
            <Download className="w-5 h-5 mr-3" />
            <p>Install App</p>
          </div>
        </Button>
      </motion.div>
    </div>
  )
}