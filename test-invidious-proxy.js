import playdl from 'play-dl';

async function testInvidiousProxy() {
  const testUrl = 'https://www.youtube.com/watch?v=s5FbBMSnubQ';
  const videoId = 's5FbBMSnubQ';
  
  console.log('🔍 Testing Invidious API as YouTube proxy...\n');
  
  // List of public Invidious instances
  const invidiousInstances = [
    'https://invidious.io',
    'https://invidious.fdn.fr',
    'https://invidious.privacydev.net',
    'https://inv.riverside.rocks',
    'https://invidious.slipfox.xyz'
  ];
  
  // First, get metadata with play-dl for comparison
  console.log('📋 Getting metadata with play-dl...');
  try {
    const isValid = playdl.yt_validate(testUrl);
    console.log('✅ play-dl validation:', isValid);
    
    if (isValid === 'video') {
      const info = await playdl.video_info(testUrl);
      console.log('✅ play-dl video info:');
      console.log('   Title:', info.video_details.title);
      console.log('   Duration:', info.video_details.durationRaw);
      console.log('   Views:', info.video_details.views);
    }
  } catch (error) {
    console.log('❌ play-dl failed:', error.message);
  }
  
  console.log('\n🌐 Testing Invidious instances...');
  
  for (const instance of invidiousInstances) {
    console.log(`\n🔄 Testing ${instance}...`);
    
    try {
      // Test if instance is accessible
      const healthCheck = await fetch(`${instance}/api/v1/stats`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!healthCheck.ok) {
        console.log('❌ Instance not accessible, status:', healthCheck.status);
        continue;
      }
      
      console.log('✅ Instance is accessible');
      
      // Get video info from Invidious
      const videoInfoResponse = await fetch(`${instance}/api/v1/videos/${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(15000)
      });
      
      if (!videoInfoResponse.ok) {
        console.log('❌ Failed to get video info, status:', videoInfoResponse.status);
        continue;
      }
      
      const videoInfo = await videoInfoResponse.json();
      console.log('✅ Got video info from Invidious:');
      console.log('   Title:', videoInfo.title);
      console.log('   Duration:', videoInfo.lengthSeconds, 'seconds');
      console.log('   Views:', videoInfo.viewCount);
      console.log('   Available formats:', videoInfo.adaptiveFormats?.length || 0);
      
      // Find audio-only formats
      const audioFormats = videoInfo.adaptiveFormats?.filter(f => 
        f.type && f.type.includes('audio') && !f.type.includes('video')
      ) || [];
      
      if (audioFormats.length > 0) {
        console.log('✅ Found', audioFormats.length, 'audio formats');
        
        // Test the best audio format
        const bestAudio = audioFormats.find(f => f.type.includes('mp4')) || audioFormats[0];
        console.log('   Best audio format:', bestAudio.type);
        console.log('   Quality:', bestAudio.qualityLabel || 'N/A');
        console.log('   URL available:', !!bestAudio.url);
        
        if (bestAudio.url) {
          console.log('🔄 Testing audio stream URL...');
          
          try {
            const streamResponse = await fetch(bestAudio.url, {
              method: 'HEAD',
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': instance
              },
              signal: AbortSignal.timeout(10000)
            });
            
            console.log('✅ Audio stream accessible, status:', streamResponse.status);
            console.log('   Content-Type:', streamResponse.headers.get('content-type'));
            console.log('   Content-Length:', streamResponse.headers.get('content-length'));
            
            if (streamResponse.status === 200) {
              console.log('🎉 SUCCESS! Found working audio stream via Invidious');
              console.log('   Instance:', instance);
              console.log('   Stream URL length:', bestAudio.url.length);
              
              // Test downloading a small chunk
              console.log('🔄 Testing small download...');
              const downloadResponse = await fetch(bestAudio.url, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                  'Referer': instance,
                  'Range': 'bytes=0-1023' // First 1KB
                },
                signal: AbortSignal.timeout(10000)
              });
              
              if (downloadResponse.ok) {
                const chunk = await downloadResponse.arrayBuffer();
                console.log('✅ Successfully downloaded', chunk.byteLength, 'bytes');
                console.log('🎉 INVIDIOUS PROXY SOLUTION WORKS!');
                console.log('🎯 This can be implemented in the download API');
                
                return {
                  success: true,
                  instance: instance,
                  videoInfo: videoInfo,
                  audioFormat: bestAudio
                };
              }
            }
            
          } catch (streamError) {
            console.log('❌ Stream test failed:', streamError.message);
          }
        }
      } else {
        console.log('❌ No audio formats found');
      }
      
    } catch (error) {
      console.log('❌ Instance failed:', error.message);
    }
  }
  
  console.log('\n🏁 Invidious proxy testing completed!');
  return { success: false };
}

testInvidiousProxy().catch(console.error);