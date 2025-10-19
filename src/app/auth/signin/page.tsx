'use client'

import React from 'react'
import { signIn, getProviders } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Music } from 'lucide-react'

export default function SignIn() {
  const handleSpotifySignIn = () => {
    signIn('spotify', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black via-spotify-gray to-primary/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-4"
      >
        <div className="bg-spotify-lightgray rounded-lg p-8 shadow-2xl">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Music className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to Spotify Clone
            </h1>
            <p className="text-spotify-text">
              Connect with Spotify to start listening to your favorite music
            </p>
          </motion.div>

          {/* Sign In Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handleSpotifySignIn}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 transform hover:scale-105"
              size="lg"
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.5c-.17 0-.33-.07-.47-.2-1.27-.99-2.87-1.49-4.75-1.49-1.28 0-2.54.2-3.74.6-.2.07-.42-.02-.49-.22-.07-.2.02-.42.22-.49 1.32-.44 2.71-.67 4.01-.67 2.07 0 3.84.56 5.26 1.66.18.14.21.4.07.58-.08.11-.2.17-.33.17-.08 0-.15-.02-.22-.06zm.81-2.11c-.2 0-.39-.08-.53-.24-1.54-1.2-3.48-1.81-5.76-1.81-1.57 0-3.08.25-4.49.74-.24.08-.5-.04-.58-.28-.08-.24.04-.5.28-.58 1.55-.54 3.21-.81 4.93-.81 2.51 0 4.64.67 6.33 1.99.21.16.25.46.09.67-.09.12-.23.19-.37.19-.1 0-.2-.03-.29-.09zm.69-2.26c-.22 0-.43-.09-.58-.26-1.8-1.37-4.06-2.06-6.73-2.06-1.82 0-3.6.29-5.29.86-.28.09-.58-.06-.67-.34-.09-.28.06-.58.34-.67 1.84-.62 3.78-.94 5.76-.94 2.9 0 5.4.75 7.44 2.23.24.18.29.52.11.76-.1.14-.26.22-.42.22-.11 0-.22-.03-.32-.1z"/>
              </svg>
              Continue with Spotify
            </Button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-3"
          >
            <div className="flex items-center text-sm text-spotify-text">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Access your Spotify playlists and library
            </div>
            <div className="flex items-center text-sm text-spotify-text">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Control playback on your devices
            </div>
            <div className="flex items-center text-sm text-spotify-text">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Discover new music with AI recommendations
            </div>
          </motion.div>

          {/* Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-xs text-spotify-text text-center"
          >
            You'll be redirected to Spotify to authorize this application
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}