'use client'

import React from 'react'
// Removed useSearchParams and useRouter to prevent SSR issues
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'



export default function AuthError() {
  const [isClient, setIsClient] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setIsClient(true)
    // Get error from URL on client side only
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      setError(urlParams.get('error'))
    }
  }, [])

  const handleNavigation = (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.'
      case 'AccessDenied':
        return 'You denied access to your Spotify account.'
      case 'Verification':
        return 'The verification token has expired or is invalid.'
      default:
        return 'An unexpected error occurred during authentication.'
    }
  }

  const getErrorTitle = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'Configuration Error'
      case 'AccessDenied':
        return 'Access Denied'
      case 'Verification':
        return 'Verification Failed'
      default:
        return 'Authentication Error'
    }
  }

  // Show loading while client is hydrating
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black via-spotify-gray to-red-900/20">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black via-spotify-gray to-red-900/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-4"
      >
        <div className="bg-spotify-lightgray rounded-lg p-8 shadow-2xl text-center">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Error Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mb-4"
          >
            {getErrorTitle(error)}
          </motion.h1>

          {/* Error Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-spotify-text mb-8"
          >
            {getErrorMessage(error)}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <Button
              onClick={() => handleNavigation('/auth/signin')}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button
              onClick={() => handleNavigation('/')}
              variant="ghost"
              className="w-full text-spotify-text hover:text-white"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-xs text-spotify-text"
          >
            {error === 'Configuration' && (
              <p>
                Please check that your Spotify app credentials are properly configured.
              </p>
            )}
            {error === 'AccessDenied' && (
              <p>
                You need to grant access to your Spotify account to use this application.
              </p>
            )}
            {!error || (error !== 'Configuration' && error !== 'AccessDenied') && (
              <p>
                If this problem persists, please try again later or contact support.
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}