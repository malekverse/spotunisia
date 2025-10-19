# Spotify API Limitations

## Development Mode Restrictions

### Recommendations Endpoint (404 Error)

**Issue**: The Spotify Web API `/v1/recommendations` endpoint returns a `404 Not Found` error when using a development mode application, even with valid access tokens and proper authentication.

**Cause**: Spotify apps in development mode have restricted access to certain endpoints. The recommendations endpoint appears to be one of these restricted endpoints.

**Solution Implemented**: 
- Added fallback logic in `src/lib/spotify.ts` 
- When the recommendations endpoint returns a 404 error, the application automatically generates mock recommendation data
- The fallback data follows the same structure as the Spotify API response to maintain compatibility

**Code Location**: 
- `SpotifyService.getRecommendations()` method in `src/lib/spotify.ts`
- `SpotifyService.getFallbackRecommendations()` private method

**Fallback Behavior**:
- Generates 5 mock tracks with realistic metadata
- Uses placeholder album images (`/placeholder-album.svg`)
- Maintains the same response structure as the real Spotify API
- Logs warnings to indicate when fallback is being used

**Production Considerations**:
- This limitation may be resolved when the Spotify app is moved to production mode
- Consider testing with a production Spotify app to verify if the recommendations endpoint works
- The fallback logic can be removed or modified once the real endpoint is accessible

**Related Documentation**:
- [Spotify Web API Authorization Guide](https://developer.spotify.com/documentation/web-api/concepts/authorization)
- [Spotify App Settings](https://developer.spotify.com/dashboard)

## Other Potential Limitations

Development mode Spotify apps may have additional restrictions:
- Lower rate limits (429 errors more likely)
- Limited access to certain user data
- Restricted playback controls
- Limited number of users who can authenticate

## Monitoring

Check server logs for these indicators of development mode limitations:
- `404 Not Found` errors from Spotify API endpoints
- `429 Too Many Requests` errors (rate limiting)
- Fallback logic activation messages