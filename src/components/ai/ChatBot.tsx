'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Music, 
  Sparkles,
  Volume2,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  recommendations?: TrackRecommendation[]
}

interface TrackRecommendation {
  id: string
  name: string
  artist: string
  image: string
  reason: string
}

interface ChatBotProps {
  isVisible: boolean
  onClose: () => void
  onPlayTrack: (trackId: string) => void
  onLikeTrack: (trackId: string) => void
  currentContext?: {
    page: string
    currentTrack?: string
    recentTracks?: string[]
    mood?: string
  }
}

export function ChatBot({ 
  isVisible, 
  onClose, 
  onPlayTrack, 
  onLikeTrack,
  currentContext 
}: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI music assistant. I can help you discover new music, create playlists, and answer questions about your listening habits. What would you like to explore today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Simulate AI response (replace with actual Groq API call)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateMockResponse(inputValue),
        timestamp: new Date(),
        recommendations: inputValue.toLowerCase().includes('recommend') ? generateMockRecommendations() : undefined
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('recommend') || lowerInput.includes('suggest')) {
      return "Based on your listening history, I've found some great tracks you might enjoy! Here are my recommendations:"
    }
    
    if (lowerInput.includes('mood') || lowerInput.includes('feeling')) {
      return "I can help you find music that matches your mood! What are you feeling like listening to today?"
    }
    
    if (lowerInput.includes('playlist')) {
      return "I'd love to help you create a playlist! What theme or mood are you going for?"
    }
    
    return "That's interesting! I can help you discover new music, analyze your listening habits, or create personalized playlists. What would you like to explore?"
  }

  const generateMockRecommendations = (): TrackRecommendation[] => [
    {
      id: '1',
      name: 'Blinding Lights',
      artist: 'The Weeknd',
      image: 'https://i.scdn.co/image/ab67616d0000b273c06f0e8b33c6e8a8c2f5c7e1',
      reason: 'Similar to your recent listening patterns'
    },
    {
      id: '2',
      name: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      image: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a',
      reason: 'Trending in your preferred genres'
    },
    {
      id: '3',
      name: 'Stay',
      artist: 'The Kid LAROI, Justin Bieber',
      image: 'https://i.scdn.co/image/ab67616d0000b273c4dee8b6c2b5b0c8f0b5c7e1',
      reason: 'Matches your current mood'
    }
  ]

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-24 right-6 w-96 h-[500px] bg-spotify-gray rounded-lg shadow-2xl border border-spotify-lightgray z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-spotify-lightgray">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Music Assistant</h3>
              <p className="text-xs text-spotify-text">Powered by Groq</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-spotify-text hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] p-3 rounded-lg',
                  message.type === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-spotify-lightgray text-white'
                )}
              >
                <p className="text-sm">{message.content}</p>
                
                {/* Recommendations */}
                {message.recommendations && (
                  <div className="mt-3 space-y-2">
                    {message.recommendations.map((track) => (
                      <Card key={track.id} className="p-2 bg-spotify-black/50">
                        <div className="flex items-center space-x-2">
                          <img
                            src={track.image}
                            alt={track.name}
                            className="w-8 h-8 rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                              {track.name}
                            </p>
                            <p className="text-xs text-spotify-text truncate">
                              {track.artist}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onPlayTrack(track.id)}
                              className="w-6 h-6 p-0 text-spotify-text hover:text-white"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onLikeTrack(track.id)}
                              className="w-6 h-6 p-0 text-spotify-text hover:text-primary"
                            >
                              <Heart className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-spotify-text mt-1">
                          {track.reason}
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-spotify-text mt-2">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-spotify-lightgray p-3 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-spotify-lightgray">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about music..."
              className="flex-1 bg-spotify-lightgray border-none text-white placeholder:text-spotify-text"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-3"
              variant="spotify"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Floating Chat Button
interface ChatButtonProps {
  onClick: () => void
  hasNewMessage?: boolean
}

export function ChatButton({ onClick, hasNewMessage }: ChatButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Button
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:shadow-xl relative"
      >
        <MessageCircle className="w-6 h-6" />
        {hasNewMessage && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </Button>
    </motion.div>
  )
}