'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Sparkles,
  Music,
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface TrackRecommendation {
  id: string
  name: string
  artists: { name: string }[]
  reason: string
}

interface Track {
  id: string
  name: string
  artist: string
  album: string
  image: string
  duration: number
  preview_url?: string
  isLiked?: boolean
  isDownloaded?: boolean
}

interface ChatBotProps {
  currentTrack?: Track
}

const ChatBot = ({ currentTrack }: ChatBotProps) => {
  const [isChatBotVisible, setIsChatBotVisible] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI music assistant. I can help you discover new music, create playlists, and answer questions about your listening habits. What would you like to explore today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<TrackRecommendation[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isChatBotVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isChatBotVisible])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: generateMockResponse(inputValue),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      if (inputValue.toLowerCase().includes('recommend')) {
        setRecommendations(generateMockRecommendations())
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        role: 'assistant',
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
      artists: [{ name: 'The Weeknd' }],
      reason: 'Similar to your recent listening patterns'
    },
    {
      id: '2',
      name: 'Good 4 U',
      artists: [{ name: 'Olivia Rodrigo' }],
      reason: 'Trending in your preferred genres'
    },
    {
      id: '3',
      name: 'Stay',
      artists: [{ name: 'The Kid LAROI' }, { name: 'Justin Bieber' }],
      reason: 'Matches your current mood'
    }
  ]

  const handleTrackSelect = (track: TrackRecommendation) => {
    console.log('Selected track:', track)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      <AnimatePresence>
        {isChatBotVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.6
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.85, 
              y: 30,
              transition: {
                type: "spring",
                damping: 30,
                stiffness: 400,
                duration: 0.4
              }
            }}
            className="fixed bottom-32 right-6 w-[420px] h-[650px] backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl z-40 flex flex-col overflow-hidden"
             style={{
               background: `
                 linear-gradient(135deg, 
                   rgba(255,255,255,0.15) 0%, 
                   rgba(255,255,255,0.08) 25%,
                   rgba(29,185,84,0.05) 50%,
                   rgba(255,255,255,0.03) 75%,
                   rgba(0,0,0,0.1) 100%
                 )
               `,
               boxShadow: `
                 0 32px 64px -12px rgba(0, 0, 0, 0.5),
                 0 0 0 1px rgba(255, 255, 255, 0.2),
                 inset 0 2px 4px rgba(255, 255, 255, 0.3),
                 inset 0 -2px 4px rgba(0, 0, 0, 0.1),
                 0 0 40px rgba(29, 185, 84, 0.1)
               `
             }}
          >
            {/* Header */}
            <motion.div 
               className="flex items-center justify-between px-8 py-7 backdrop-blur-md bg-white/8 border-b border-white/20"
               style={{
                 background: `
                   linear-gradient(180deg, 
                     rgba(255,255,255,0.12) 0%, 
                     rgba(255,255,255,0.06) 50%,
                     rgba(29,185,84,0.03) 100%
                   )
                 `,
                 boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1)'
               }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.2, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  className="relative"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
                    borderRadius: '12px',
                    padding: '8px',
                    boxShadow: `
                      0 0 20px rgba(29, 185, 84, 0.4),
                      0 0 40px rgba(29, 185, 84, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3)
                    `
                  }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-wide leading-tight">AI Music Assistant</h3>
                  <p className="text-sm text-white/80 font-semibold tracking-wide">Discover your next favorite song</p>
                </div>
              </div>
              <motion.button
                 onClick={() => setIsChatBotVisible(false)}
                 className="text-white/60 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/10 relative overflow-hidden group"
                 whileHover={{ 
                   scale: 1.1, 
                   rotate: 90,
                   backgroundColor: "rgba(255, 255, 255, 0.15)"
                 }}
                 whileTap={{ scale: 0.9, rotate: 180 }}
                 style={{
                   boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.2)'
                 }}
                 animate={{
                   boxShadow: [
                     '0 0 0 0 rgba(255, 255, 255, 0.2)',
                     '0 0 0 4px rgba(255, 255, 255, 0.1)',
                     '0 0 0 0 rgba(255, 255, 255, 0.2)'
                   ]
                 }}
                 transition={{ 
                   type: "spring", 
                   stiffness: 400, 
                   damping: 25,
                   duration: 2, 
                   repeat: Infinity 
                 }}
               >
                 <motion.div
                   className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                 />
                 <X className="w-5 h-5 relative z-10" />
               </motion.button>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 bg-gradient-to-b from-transparent via-black/5 to-black/10" ref={messagesEndRef}>
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                        delay: index * 0.1
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.9, 
                      y: -10,
                      transition: { duration: 0.2 }
                    }}
                    layout
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div
                      className={`max-w-[85%] px-5 py-4 rounded-2xl backdrop-blur-md border shadow-lg ${
                        message.role === 'user'
                          ? 'border-spotify-green/30'
                          : 'border-white/20'
                      }`}
                      style={{
                         background: message.role === 'user'
                           ? `linear-gradient(135deg, 
                               rgba(29, 185, 84, 0.9) 0%, 
                               rgba(30, 215, 96, 0.7) 50%,
                               rgba(29, 185, 84, 0.5) 100%
                             )`
                           : `linear-gradient(135deg, 
                               rgba(255, 255, 255, 0.18) 0%, 
                               rgba(255, 255, 255, 0.12) 25%,
                               rgba(29, 185, 84, 0.03) 50%,
                               rgba(255, 255, 255, 0.08) 75%,
                               rgba(255, 255, 255, 0.05) 100%
                             )`,
                         boxShadow: message.role === 'user'
                           ? `0 12px 40px rgba(29, 185, 84, 0.4), 
                              inset 0 2px 4px rgba(255, 255, 255, 0.3),
                              inset 0 -1px 2px rgba(0, 0, 0, 0.1),
                              0 0 20px rgba(29, 185, 84, 0.2)`
                           : `0 12px 40px rgba(0, 0, 0, 0.25), 
                              inset 0 2px 4px rgba(255, 255, 255, 0.15),
                              inset 0 -1px 2px rgba(0, 0, 0, 0.05),
                              0 0 15px rgba(255, 255, 255, 0.05)`
                       }}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 400, damping: 25 }
                      }}
                    >
                      <p className="text-white text-sm leading-loose font-semibold tracking-wide">{message.content}</p>
                       <p className="text-white/70 text-xs mt-3 font-bold tracking-wider uppercase">
                         {new Date(message.timestamp).toLocaleTimeString()}
                       </p>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Recommendations */}
              <AnimatePresence>
                {recommendations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        type: "spring",
                        damping: 25,
                        stiffness: 200,
                        staggerChildren: 0.1
                      }
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {recommendations.map((track, index) => (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0, 
                          scale: 1,
                          transition: {
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                            delay: index * 0.1
                          }
                        }}
                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                        className="p-5 backdrop-blur-md border border-white/20 rounded-xl shadow-lg cursor-pointer group relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        }}
                        whileHover={{ 
                          scale: 1.03,
                          y: -2,
                          transition: { type: "spring", stiffness: 400, damping: 25 }
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTrackSelect(track)}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-spotify-green/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                        />
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          whileHover={{
                            boxShadow: [
                              '0 0 0 0 rgba(29, 185, 84, 0.3)',
                              '0 0 0 4px rgba(29, 185, 84, 0.1)',
                              '0 0 0 0 rgba(29, 185, 84, 0.3)'
                            ]
                          }}
                          transition={{ duration: 1, repeat: Infinity, type: "tween" }}
                        />
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className="w-12 h-12 bg-gradient-to-br from-spotify-green/20 to-spotify-green/10 rounded-lg flex items-center justify-center border border-spotify-green/30"
                            whileHover={{ rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            <Music className="w-6 h-6 text-spotify-green" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                             <p className="text-white font-black text-sm truncate group-hover:text-spotify-green transition-colors duration-300 tracking-wide leading-tight">
                               {track.name}
                             </p>
                             <p className="text-white/80 text-xs truncate font-bold tracking-wide mt-1">
                               {track.artists.map(a => a.name).join(', ')}
                             </p>
                             <p className="text-white/60 text-xs mt-2 font-semibold tracking-wide italic">
                               {track.reason}
                             </p>
                           </div>
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 15 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            <Play className="w-5 h-5 text-spotify-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: {
                      type: "spring",
                      damping: 25,
                      stiffness: 300
                    }
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex justify-start"
                >
                  <motion.div
                    className="p-4 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-5 h-5 text-spotify-green" />
                      </motion.div>
                      <span className="text-white/90 text-sm font-bold tracking-wide">Finding perfect songs for you...</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <motion.div 
               className="px-8 py-6 border-t border-white/20 backdrop-blur-md bg-white/8"
               style={{
                 background: `
                   linear-gradient(180deg, 
                     rgba(255,255,255,0.08) 0%, 
                     rgba(255,255,255,0.12) 50%,
                     rgba(29,185,84,0.03) 100%
                   )
                 `,
                 boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 -1px 2px rgba(0, 0, 0, 0.1)'
               }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.4, duration: 0.5 }
              }}
            >
              <div className="flex space-x-4">
                <motion.div
                   className="flex-1 relative"
                   whileFocus={{ scale: 1.02 }}
                   transition={{ type: "spring", stiffness: 300, damping: 25 }}
                 >
                   <Input
                     ref={inputRef}
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     onKeyPress={handleKeyPress}
                     placeholder="Ask me about music..."
                     className="w-full backdrop-blur-md border border-white/20 text-white placeholder:text-white/70 placeholder:font-semibold placeholder:tracking-wide rounded-xl px-4 py-3 focus:border-spotify-green/50 focus:ring-2 focus:ring-spotify-green/20 transition-all duration-300 font-semibold tracking-wide"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                       boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1)'
                     }}
                     disabled={isLoading}
                     onFocus={() => {
                       // Add subtle glow effect on focus
                     }}
                   />
                   <motion.div
                     className="absolute inset-0 rounded-xl pointer-events-none"
                     animate={{
                       boxShadow: inputValue ? [
                         '0 0 0 0 rgba(29, 185, 84, 0.2)',
                         '0 0 0 2px rgba(29, 185, 84, 0.1)',
                         '0 0 0 0 rgba(29, 185, 84, 0.2)'
                       ] : '0 0 0 0 rgba(29, 185, 84, 0.2)'
                     }}
                     transition={{ duration: 1.5, repeat: inputValue ? Infinity : 0, type: "tween" }}
                   />
                 </motion.div>
                <motion.div
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="relative overflow-hidden rounded-xl"
                 >
                   <Button
                     onClick={handleSendMessage}
                     disabled={!inputValue.trim() || isLoading}
                     className="px-6 py-3 text-black font-semibold rounded-xl shadow-lg transition-all duration-300 relative overflow-hidden group"
                     style={{
                       background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
                       boxShadow: '0 4px 20px rgba(29, 185, 84, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                     }}
                   >
                     <motion.div
                       className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-600"
                     />
                     <motion.div
                       className="absolute inset-0 rounded-xl"
                       animate={{
                         boxShadow: [
                           '0 0 0 0 rgba(29, 185, 84, 0.4)',
                           '0 0 0 8px rgba(29, 185, 84, 0.1)',
                           '0 0 0 0 rgba(29, 185, 84, 0.4)'
                         ]
                       }}
                       transition={{ duration: 2, repeat: Infinity, type: "tween" }}
                     />
                     <Send className="w-4 h-4 relative z-10" />
                   </Button>
                 </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      {!isChatBotVisible && (
        <ChatButton 
          onClick={() => setIsChatBotVisible(true)} 
          hasNewMessage={false}
          bottomOffset={currentTrack ? 120 : 24}
        />
      )}
    </>
  )
}

// Floating Chat Button
interface ChatButtonProps {
  onClick: () => void
  hasNewMessage?: boolean
  bottomOffset?: number
}

export function ChatButton({ onClick, hasNewMessage, bottomOffset = 24 }: ChatButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed right-6 z-40"
      style={{ bottom: `${bottomOffset}px` }}
    >
      <motion.button
        onClick={onClick}
        className="w-16 h-16 rounded-full backdrop-blur-2xl border border-white/30 shadow-2xl relative overflow-hidden group transition-all duration-300 flex items-center justify-center"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(29, 185, 84, 0.9) 0%, 
              rgba(30, 215, 96, 0.8) 25%,
              rgba(29, 185, 84, 0.7) 50%, 
              rgba(0, 0, 0, 0.3) 75%,
              rgba(29, 185, 84, 0.4) 100%
            )
          `,
          boxShadow: `
            0 25px 50px rgba(29, 185, 84, 0.4), 
            0 0 0 1px rgba(255, 255, 255, 0.2), 
            inset 0 2px 4px rgba(255, 255, 255, 0.3),
            inset 0 -2px 4px rgba(0, 0, 0, 0.2),
            0 0 30px rgba(29, 185, 84, 0.2)
          `
        }}
        whileHover={{
          boxShadow: '0 25px 50px rgba(29, 185, 84, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
        }}
        animate={{
          boxShadow: [
            '0 20px 40px rgba(29, 185, 84, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            '0 25px 50px rgba(29, 185, 84, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)',
            '0 20px 40px rgba(29, 185, 84, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, type: "tween" }}
      >
        <MessageCircle className="w-7 h-7 text-black relative z-10" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        {hasNewMessage && (
          <motion.div 
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, type: "tween" }}
          />
        )}
      </motion.button>
    </motion.div>
  )
}

export default ChatBot