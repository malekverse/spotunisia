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
  Radio,
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
    <div className={cn('flex flex-col h-full bg-spotify-black text-white', className)}>
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Mic2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Spotify Clone</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.href}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-spotify-gray text-white'
                    : 'text-spotify-text hover:text-white hover:bg-spotify-lightgray'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Create Playlist Button */}
      <div className="px-6 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-spotify-text hover:text-white hover:bg-spotify-lightgray"
        >
          <Plus className="w-5 h-5 mr-3" />
          Create Playlist
        </Button>
      </div>

      {/* Library Section */}
      <div className="flex-1 px-3 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-spotify-text uppercase tracking-wider">
          Your Library
        </div>
        {libraryItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.href}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-spotify-gray text-white'
                    : 'text-spotify-text hover:text-white hover:bg-spotify-lightgray'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Install App */}
      <div className="p-6 border-t border-spotify-gray">
        <Button
          variant="ghost"
          className="w-full justify-start text-spotify-text hover:text-white"
        >
          <Download className="w-5 h-5 mr-3" />
          Install App
        </Button>
      </div>
    </div>
  )
}