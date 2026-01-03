'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Search, 
  Library, 
  Heart,
  Music2,
  LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

const mobileNavItems: NavItem[] = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Search', href: '/search', icon: Search },
  { title: 'Library', href: '/library', icon: Library },
  { title: 'Liked', href: '/library?tab=liked', icon: Heart },
  { title: 'Music', href: '/ai-recommendations', icon: Music2 },
]

interface MobileNavProps {
  hasActivePlayer?: boolean
}

function MobileNavComponent({ hasActivePlayer }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'md:hidden fixed left-0 right-0 z-40',
        'transition-all duration-500 ease-out',
        hasActivePlayer ? 'bottom-20' : 'bottom-0'
      )}
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)',
      }}
    >
      {/* Liquid Glass Container */}
      <div className="mx-4 mb-4">
        <div className="liquid-glass-strong rounded-3xl border border-white/10 overflow-hidden">
          {/* Ambient Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-spotify-green/5 via-transparent to-transparent pointer-events-none" />
          
          {/* Top Edge Highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Navigation Items */}
          <div className="relative flex items-center justify-around px-3 py-3">
            {mobileNavItems.map((item) => {
              const isActive = 
                pathname === item.href || 
                (item.href.includes('?tab=') && 
                 pathname === '/library' && 
                 item.href.includes(pathname))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex flex-col items-center justify-center',
                    'flex-1 py-2 rounded-2xl',
                    'transition-all duration-200 ease-out',
                    'active:scale-90',
                    'group'
                  )}
                >
                  {/* Active Background Glow */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-spotify-green/10 to-transparent rounded-2xl" />
                  )}
                  
                  {/* Icon */}
                  <div className="relative">
                    {/* Glow effect for active icon */}
                    {isActive && (
                      <div className="absolute inset-0 blur-lg bg-spotify-green/30" />
                    )}
                    
                    <item.icon 
                      className={cn(
                        'relative transition-all duration-200',
                        isActive 
                          ? 'w-[26px] h-[26px] text-spotify-green drop-shadow-lg' 
                          : 'w-[26px] h-[26px] text-white/60 group-hover:text-white/80'
                      )} 
                      strokeWidth={isActive ? 2.5 : 1.5}
                      fill={isActive ? 'currentColor' : 'none'}
                    />
                  </div>
                  
                  {/* Active Indicator - Instagram style dot with Spotify green */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                      <div className="w-1 h-1 rounded-full bg-spotify-green shadow-lg shadow-spotify-green/50" />
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
          
          {/* Bottom Edge Shine */}
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </nav>
  )
}

export const MobileNav = memo(MobileNavComponent)

