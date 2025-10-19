# 🎵 Spotify Clone

A modern, feature-rich Spotify clone built with Next.js 14, TypeScript, and Tailwind CSS. This application replicates the core Spotify experience with a beautiful dark theme, smooth animations, and comprehensive music streaming features.

![Spotify Clone](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🏠 **Home Dashboard**
- Dynamic greeting based on time of day
- Featured playlists and quick access cards
- Recently played tracks section
- "Made for you" personalized recommendations
- Popular playlists discovery
- Smooth animations with Framer Motion

### 🔍 **Advanced Search**
- Real-time search with debouncing
- Browse music categories with colorful tiles
- Recent searches history
- Filter results by type (All, Tracks, Playlists, Artists)
- Top results highlighting
- Organized search results display

### 📚 **Personal Library**
- Three main sections: Playlists, Liked Songs, Downloaded
- Grid and list view modes
- Search within your library
- URL parameter support for direct navigation
- Create and manage playlists
- Sort and filter options

### ⚙️ **Comprehensive Settings**
- **Account Settings**: Autoplay, crossfade, gapless playback
- **Audio Quality**: Streaming quality controls with range sliders
- **Download Preferences**: Quality settings and cellular options
- **Notifications**: Playlist updates, new releases, concert alerts
- **Privacy Controls**: Private sessions, activity sharing
- **Display Options**: Theme selection, language preferences
- **Accessibility**: High contrast, reduced motion options

### 🎵 **Music Player**
- Full playback controls (play, pause, skip, previous)
- Interactive progress bar with seek functionality
- Volume control with mute option
- Shuffle and repeat modes
- Like and download track actions
- Compact and expanded player views
- Real-time progress updates

### 🤖 **AI Music Assistant**
- Contextual chatbot for music recommendations
- Mock AI responses and suggestions
- Music discovery based on preferences
- Interactive chat interface
- Toggleable visibility

## 🛠 **Tech Stack**

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js (ready for integration)
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 🚀 **Getting Started**

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/spotify-clone.git
   cd spotify-clone
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   SPOTIFY_CLIENT_ID=your-spotify-client-id
   SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
   GROQ_API_KEY=your-groq-api-key
   MONGODB_URI=your-mongodb-connection-string
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 **Project Structure**

```
src/
├── app/                    # Next.js App Router pages
│   ├── library/           # Library page
│   ├── search/            # Search page
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Context providers
├── components/            # Reusable components
│   ├── ai/               # AI chatbot components
│   ├── layout/           # Layout components (Sidebar, TopBar)
│   ├── player/           # Music player components
│   └── ui/               # UI components (Button, Card, etc.)
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication config
│   ├── groq.ts           # AI integration
│   ├── spotify.ts        # Spotify API integration
│   └── utils.ts          # Utility functions
└── models/               # Data models
    ├── Download.ts
    ├── Playlist.ts
    └── User.ts
```

## 🎨 **Design System**

### Colors
- **Primary**: Spotify Green (#1DB954)
- **Background**: Dark (#121212)
- **Surface**: Light Gray (#181818)
- **Text**: White (#FFFFFF)
- **Secondary Text**: Gray (#B3B3B3)

### Typography
- **Font Family**: Inter
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)
- **Small Text**: Light weight (300)

## 🔧 **Available Scripts**

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
```

## 🌟 **Key Features Implementation**

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Adaptive navigation

### Performance Optimizations
- Next.js Image optimization
- Component lazy loading
- Efficient re-renders with React hooks
- Optimized bundle splitting

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Focus management

## 🔮 **Future Enhancements**

- [ ] Real Spotify API integration
- [ ] User authentication with Spotify OAuth
- [ ] Playlist creation and management
- [ ] Social features (following, sharing)
- [ ] Offline mode support
- [ ] Progressive Web App (PWA)
- [ ] Real-time lyrics display
- [ ] Advanced audio visualizations

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- [Spotify](https://spotify.com) for the design inspiration
- [Next.js](https://nextjs.org) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS
- [Framer Motion](https://framer.com/motion) for smooth animations
- [Lucide](https://lucide.dev) for the beautiful icons

## 📞 **Support**

If you have any questions or need help, please open an issue or reach out:

- 📧 Email: your.email@example.com
- 🐦 Twitter: [@yourusername](https://twitter.com/yourusername)
- 💼 LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

---

**Made with ❤️ and lots of ☕**
