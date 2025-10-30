import playdl from 'play-dl';

async function testPlayDlStream() {
  const testUrl = 'https://www.youtube.com/watch?v=s5FbBMSnubQ';
  
  console.log('🔍 Testing play-dl streaming capabilities...\n');
  
  try {
    // Step 1: Validate URL
    const isValid = playdl.yt_validate(testUrl);
    console.log('✅ URL validation:', isValid);
    
    if (isValid !== 'video') {
      console.log('❌ Invalid URL');
      return;
    }
    
    // Step 2: Get video info
    console.log('\n📋 Getting video info...');
    const info = await playdl.video_info(testUrl);
    console.log('✅ Video info obtained:');
    console.log('   Title:', info.video_details.title);
    console.log('   Duration:', info.video_details.durationRaw);
    console.log('   Views:', info.video_details.views);
    console.log('   URL:', info.video_details.url);
    
    // Step 3: Try to get stream info with different qualities
    console.log('\n🎵 Testing stream extraction...');
    
    const qualities = [
      { quality: 0, name: 'Lowest' },
      { quality: 1, name: 'Low' },
      { quality: 2, name: 'Medium' },
      { quality: 3, name: 'High' },
      { quality: 4, name: 'Highest' }
    ];
    
    for (const q of qualities) {
      try {
        console.log(`\n🔄 Trying ${q.name} quality (${q.quality})...`);
        const streamInfo = await playdl.stream(testUrl, { 
          quality: q.quality,
          htmldata: false
        });
        
        console.log('✅ Stream info obtained for', q.name, 'quality:');
        console.log('   Type:', streamInfo.type);
        console.log('   URL available:', !!streamInfo.url);
        console.log('   Format:', streamInfo.format);
        
        if (streamInfo.url) {
          console.log('   Stream URL length:', streamInfo.url.length);
          console.log('   Stream URL preview:', streamInfo.url.substring(0, 100) + '...');
          
          // Test if the stream URL is accessible
          try {
            console.log('🔄 Testing stream URL accessibility...');
            const response = await fetch(streamInfo.url, { 
              method: 'HEAD',
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.youtube.com/'
              }
            });
            
            console.log('✅ Stream URL is accessible, status:', response.status);
            console.log('   Content-Type:', response.headers.get('content-type'));
            console.log('   Content-Length:', response.headers.get('content-length'));
            
            // If this works, we found a working stream!
            if (response.status === 200) {
              console.log('🎉 SUCCESS! Found working stream with', q.name, 'quality');
              
              // Test downloading a small chunk
              console.log('🔄 Testing small download...');
              const downloadResponse = await fetch(streamInfo.url, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                  'Referer': 'https://www.youtube.com/',
                  'Range': 'bytes=0-1023' // Download first 1KB
                }
              });
              
              if (downloadResponse.ok) {
                const chunk = await downloadResponse.arrayBuffer();
                console.log('✅ Successfully downloaded', chunk.byteLength, 'bytes');
                console.log('🎉 STREAM IS WORKING! This approach can be used.');
                break; // Found working stream, no need to test others
              }
            }
            
          } catch (fetchError) {
            console.log('❌ Stream URL not accessible:', fetchError.message);
          }
        }
        
      } catch (streamError) {
        console.log('❌ Failed to get stream for', q.name, 'quality:', streamError.message);
      }
    }
    
    // Step 4: Try alternative approach with search
    console.log('\n🔍 Testing search-based approach...');
    try {
      const searchResults = await playdl.search(info.video_details.title, { 
        limit: 1,
        type: 'video'
      });
      
      if (searchResults.length > 0) {
        console.log('✅ Found video via search:', searchResults[0].title);
        console.log('   URL:', searchResults[0].url);
        
        // Try streaming the search result
        try {
          const searchStreamInfo = await playdl.stream(searchResults[0].url, { quality: 0 });
          console.log('✅ Search-based stream info obtained');
          console.log('   URL available:', !!searchStreamInfo.url);
        } catch (searchStreamError) {
          console.log('❌ Search-based stream failed:', searchStreamError.message);
        }
      }
    } catch (searchError) {
      console.log('❌ Search approach failed:', searchError.message);
    }
    
  } catch (error) {
    console.log('❌ Overall test failed:', error.message);
    console.log('Error details:', error);
  }
  
  console.log('\n🏁 play-dl stream testing completed!');
}

testPlayDlStream().catch(console.error);