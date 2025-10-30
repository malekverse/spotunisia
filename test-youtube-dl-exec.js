import youtubedl from 'youtube-dl-exec';
import playdl from 'play-dl';

async function testYoutubeDlExec() {
  const testUrl = 'https://www.youtube.com/watch?v=s5FbBMSnubQ';
  
  console.log('🔍 Testing youtube-dl-exec (yt-dlp wrapper)...\n');
  
  // Method 1: Get video info using youtube-dl-exec
  console.log('1️⃣ Testing youtube-dl-exec video info...');
  try {
    const info = await youtubedl(testUrl, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      ]
    });
    
    console.log('✅ youtube-dl-exec got video info:');
    console.log('   Title:', info.title);
    console.log('   Duration:', info.duration);
    console.log('   Uploader:', info.uploader);
    console.log('   Available formats:', info.formats?.length || 0);
    
    // Find audio-only formats
    const audioFormats = info.formats?.filter(f => 
      f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none')
    );
    
    if (audioFormats && audioFormats.length > 0) {
      console.log('✅ Found', audioFormats.length, 'audio-only formats');
      console.log('   Best audio format:', audioFormats[0].format_id, '-', audioFormats[0].ext);
      console.log('   Audio URL available:', !!audioFormats[0].url);
    }
    
  } catch (error) {
    console.log('❌ youtube-dl-exec info failed:', error.message);
  }
  
  console.log('\n');
  
  // Method 2: Get direct download URL
  console.log('2️⃣ Testing youtube-dl-exec direct URL extraction...');
  try {
    const result = await youtubedl(testUrl, {
      getUrl: true,
      format: 'bestaudio[ext=m4a]/bestaudio',
      noCheckCertificates: true,
      noWarnings: true,
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      ]
    });
    
    console.log('✅ youtube-dl-exec got direct URL:', result);
    
    // Test if the URL is accessible
    console.log('🔄 Testing URL accessibility...');
    const response = await fetch(result, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.youtube.com/'
      }
    });
    
    console.log('✅ URL is accessible, status:', response.status);
    console.log('   Content-Type:', response.headers.get('content-type'));
    console.log('   Content-Length:', response.headers.get('content-length'));
    
  } catch (error) {
    console.log('❌ youtube-dl-exec URL extraction failed:', error.message);
  }
  
  console.log('\n');
  
  // Method 3: Compare with play-dl
  console.log('3️⃣ Comparing with play-dl...');
  try {
    const isValid = playdl.yt_validate(testUrl);
    console.log('✅ play-dl validation:', isValid);
    
    if (isValid === 'video') {
      const info = await playdl.video_info(testUrl);
      console.log('✅ play-dl got video info:', info.video_details.title);
      console.log('   Duration:', info.video_details.durationRaw);
      console.log('   Views:', info.video_details.views);
    }
    
  } catch (error) {
    console.log('❌ play-dl failed:', error.message);
  }
  
  console.log('\n🏁 youtube-dl-exec testing completed!');
}

testYoutubeDlExec().catch(console.error);