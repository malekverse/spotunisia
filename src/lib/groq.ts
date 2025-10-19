import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface MusicRecommendationRequest {
  likedTracks: string[]
  recentlyPlayed: string[]
  userPreferences?: {
    genres?: string[]
    energy?: number
    valence?: number
  }
}

export class GroqService {
  private systemPrompt = `You are a music recommendation AI assistant for a Spotify-like music streaming app. Your role is to:

1. Help users discover new music based on their listening history and preferences
2. Provide contextual music recommendations
3. Answer questions about music, artists, albums, and genres
4. Assist with playlist creation and organization
5. Explain music features and audio characteristics

Guidelines:
- Be conversational and enthusiastic about music
- Provide specific, actionable recommendations
- Consider the user's listening history when making suggestions
- Explain why you're recommending certain tracks or artists
- Keep responses concise but informative
- Focus on music-related topics only

When recommending music, consider:
- Similar artists and genres
- Audio features (tempo, energy, mood)
- Release dates and popularity
- User's listening patterns and preferences`

  async generateChatResponse(messages: ChatMessage[]): Promise<string> {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: this.systemPrompt },
          ...messages
        ],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 1000,
      })

      return completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.'
    } catch (error) {
      console.error('Error generating chat response:', error)
      throw new Error('Failed to generate AI response')
    }
  }

  async generateMusicRecommendations(request: MusicRecommendationRequest): Promise<string> {
    try {
      const prompt = `Based on the user's music preferences, generate personalized music recommendations:

Liked Tracks: ${request.likedTracks.slice(0, 10).join(', ')}
Recently Played: ${request.recentlyPlayed.slice(0, 5).join(', ')}
${request.userPreferences ? `Preferences: ${JSON.stringify(request.userPreferences)}` : ''}

Please provide 5-8 specific song recommendations with artist names, explaining why each recommendation fits the user's taste. Focus on discovering new music that matches their style.`

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'llama3-8b-8192',
        temperature: 0.8,
        max_tokens: 800,
      })

      return completion.choices[0]?.message?.content || 'I couldn\'t generate recommendations at this time.'
    } catch (error) {
      console.error('Error generating music recommendations:', error)
      throw new Error('Failed to generate music recommendations')
    }
  }

  async analyzeListeningHabits(tracks: string[], timeframe: string = 'recent'): Promise<string> {
    try {
      const prompt = `Analyze the user's listening habits based on these tracks: ${tracks.slice(0, 20).join(', ')}

Timeframe: ${timeframe}

Provide insights about:
1. Musical preferences and genres
2. Listening patterns
3. Mood and energy preferences
4. Suggestions for expanding their musical taste

Keep the analysis engaging and provide actionable insights.`

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'llama3-8b-8192',
        temperature: 0.6,
        max_tokens: 600,
      })

      return completion.choices[0]?.message?.content || 'I couldn\'t analyze your listening habits at this time.'
    } catch (error) {
      console.error('Error analyzing listening habits:', error)
      throw new Error('Failed to analyze listening habits')
    }
  }

  async generatePlaylistDescription(playlistName: string, tracks: string[]): Promise<string> {
    try {
      const prompt = `Create a compelling description for a playlist named "${playlistName}" containing these tracks: ${tracks.slice(0, 10).join(', ')}

Generate a creative, engaging description that captures the mood and theme of the playlist. Keep it under 150 characters.`

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'llama3-8b-8192',
        temperature: 0.8,
        max_tokens: 200,
      })

      return completion.choices[0]?.message?.content || `A curated collection of tracks for ${playlistName}`
    } catch (error) {
      console.error('Error generating playlist description:', error)
      return `A curated collection of tracks for ${playlistName}`
    }
  }

  async shouldShowChatbot(context: {
    currentPage: string
    userAction?: string
    timeOnPage?: number
    searchQuery?: string
  }): Promise<boolean> {
    // Logic to determine when to show the chatbot contextually
    const { currentPage, userAction, timeOnPage = 0, searchQuery } = context

    // Show chatbot if:
    // 1. User is on search page with no results
    // 2. User has been on a page for more than 30 seconds
    // 3. User is looking at recommendations
    // 4. User is creating a playlist
    // 5. User explicitly searches for music advice

    if (searchQuery && (
      searchQuery.includes('recommend') ||
      searchQuery.includes('similar') ||
      searchQuery.includes('like') ||
      searchQuery.includes('discover')
    )) {
      return true
    }

    if (currentPage === 'search' && timeOnPage > 10000) {
      return true
    }

    if (currentPage === 'recommendations' || currentPage === 'discover') {
      return true
    }

    if (userAction === 'create-playlist') {
      return true
    }

    if (timeOnPage > 30000) {
      return true
    }

    return false
  }
}

export const groqService = new GroqService()