'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

const sidebarItems = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Search', href: '/search', icon: Search },
  { title: 'Your Library', href: '/library', icon: Library },
]

const libraryItems = [
  { title: 'Liked Songs', href: '/library?tab=liked', icon: Heart },
  { title: 'Downloaded', href: '/library?tab=downloaded', icon: Download },
  { title: 'Recently Played', href: '/library?tab=recent', icon: Music },
  { title: 'AI Recommendations', href: '/ai-recommendations', icon: TrendingUp },
]

interface SidebarProps {
  className?: string
}

function SidebarComponent({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn(
      'flex flex-col h-full liquid-glass border-r border-white/10',
      className
    )}>
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-spotify-green via-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-spotify-green/20 group-hover:shadow-spotify-green/40 transition-all duration-300 group-hover:scale-105">
            <Mic2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Spotunisia
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                isActive
                  ? 'liquid-glass-strong text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors duration-300",
                isActive ? "text-spotify-green" : "group-hover:text-spotify-green"
              )} />
              <span>{item.title}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-spotify-green shadow-lg shadow-spotify-green/50" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Create Playlist Button */}
      <div className="px-3 py-4">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white liquid-glass-hover border border-white/5 hover:border-white/10 transition-all duration-300">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <span>Create Playlist</span>
        </button>
      </div>

      {/* Library Section */}
      <div className="flex-1 px-3 space-y-1">
        <div className="px-4 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
          Your Library
        </div>
        {libraryItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href.includes('?tab=') && pathname === '/library' && item.href.includes(pathname))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                isActive
                  ? 'liquid-glass-strong text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-spotify-green" : ""
              )} />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </div>

      {/* Install App */}
      <div className="p-4 border-t border-white/5">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-spotify-green to-green-400 text-black hover:shadow-lg hover:shadow-spotify-green/30 transition-all duration-300 hover:scale-[1.02]">
          <Download className="w-4 h-4" />
          <span>Install App</span>
        </button>
      </div>
    </div>
  )
}

export const Sidebar = memo(SidebarComponent)
