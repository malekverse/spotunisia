# 🚀 Spotify Clone Setup Guide

This guide will help you set up the Spotify Clone application with proper authentication.

## Prerequisites

- Node.js 18+ installed
- A Spotify Developer Account
- MongoDB database (local or cloud)

## Step 1: Spotify App Setup

1. **Create a Spotify App**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Click "Create an App"
   - Fill in the app name and description
   - Accept the terms and create the app

2. **Configure App Settings**
   - In your app dashboard, click "Settings"
   - Add the following Redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/spotify
     ```
   - Save the settings

3. **Get Your Credentials**
   - Copy your `Client ID` and `Client Secret`
   - Keep these secure and never commit them to version control

## Step 2: Environment Configuration

1. **Copy the environment template**
   ```bash
   cp .env.example .env.local
   ```

2. **Update your `.env.local` file with your credentials:**
   ```env
   # Spotify API Configuration
   SPOTIFY_CLIENT_ID=your_actual_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_actual_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback/spotify

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_key_here

   # MongoDB Configuration (choose one)
   # Local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/spotify-clone
   # Or MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spotify-clone

   # Optional: AI Integration
   GROQ_API_KEY=your_groq_api_key_here

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Step 3: Generate NextAuth Secret

Generate a secure random string for `NEXTAUTH_SECRET`:

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 4: Database Setup

### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use the connection string: `mongodb://localhost:27017/spotify-clone`

### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `<username>`, `<password>`, and `<cluster>` in the connection string

## Step 5: Install Dependencies and Run

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

## Step 6: Test Authentication

1. Open [http://localhost:3000](http://localhost:3000)
2. You should be redirected to the sign-in page
3. Click "Continue with Spotify"
4. Authorize the application in Spotify
5. You should be redirected back to the home page

## Troubleshooting

### Common Issues

1. **"Configuration Error"**
   - Check that your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are correct
   - Ensure your redirect URI is properly configured in Spotify Dashboard

2. **"Access Denied"**
   - Make sure you're authorizing the application in Spotify
   - Check that your Spotify account is in good standing

3. **Database Connection Issues**
   - Verify your `MONGODB_URI` is correct
   - Ensure MongoDB is running (for local setup)
   - Check network connectivity (for Atlas)

4. **NextAuth Errors**
   - Ensure `NEXTAUTH_SECRET` is set and is a secure random string
   - Verify `NEXTAUTH_URL` matches your application URL

### Environment Variables Checklist

Make sure all these variables are set in your `.env.local`:

- ✅ `SPOTIFY_CLIENT_ID`
- ✅ `SPOTIFY_CLIENT_SECRET`
- ✅ `NEXTAUTH_SECRET`
- ✅ `NEXTAUTH_URL`
- ✅ `MONGODB_URI`

### Getting Help

If you're still having issues:

1. Check the browser console for errors
2. Check the terminal/server logs
3. Verify all environment variables are correctly set
4. Ensure your Spotify app settings match the configuration

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your Spotify credentials secure
- Use a strong, random `NEXTAUTH_SECRET`
- In production, use environment variables provided by your hosting platform

## Next Steps

Once authentication is working:

1. Explore the different pages (Home, Search, Library, Settings)
2. Try the keyboard shortcuts (press `?` to see available shortcuts)
3. Test the music player controls
4. Customize the settings to your preference

Enjoy your Spotify Clone! 🎵