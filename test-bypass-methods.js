import ytdl from '@distube/ytdl-core';
import playdl from 'play-dl';

async function testBypassMethods() {
  const testUrl = 'https://www.youtube.com/watch?v=s5FbBMSnubQ';
  
  console.log('🔍 Testing YouTube bypass methods...\n');
  
  // Method 1: Enhanced ytdl-core with headers
  console.log('1️⃣ Testing enhanced @distube/ytdl-core with bypass headers...');
  try {
    const stream = ytdl(testUrl, {
      filter: 'audioonly',
      quality: 'lowestaudio',
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0',
        }
      }
    });
    
    console.log('✅ Enhanced ytdl-core stream created successfully');
    
    // Test if we can get data
    let dataReceived = false;
    let errorOccurred = false;
    
    stream.on('data', (chunk) => {
      if (!dataReceived) {
        console.log('✅ Data received from enhanced ytdl-core stream, size:', chunk.length);
        dataReceived = true;
      }
    });
    
    stream.on('error', (error) => {
      console.log('❌ Enhanced ytdl-core error:', error.message);
      errorOccurred = true;
    });
    
    stream.on('end', () => {
      console.log('✅ Enhanced ytdl-core stream ended successfully');
    });
    
    // Wait to see if data comes through
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    if (!dataReceived && !errorOccurred) {
      console.log('⏳ Enhanced ytdl-core: No data received yet, but no errors');
    }
    
    stream.destroy();
    
  } catch (error) {
    console.log('❌ Enhanced ytdl-core failed:', error.message);
  }
  
  console.log('\n');
  
  // Method 2: play-dl detailed test
  console.log('2️⃣ Testing play-dl with detailed approach...');
  try {
    // Try direct URL validation
    const isValid = playdl.yt_validate(testUrl);
    console.log('✅ play-dl URL validation:', isValid);
    
    if (isValid === 'video') {
      // Try to get video info
      const info = await playdl.video_info(testUrl);
      console.log('✅ play-dl got video info:', info.video_details.title);
      console.log('✅ play-dl video duration:', info.video_details.durationRaw);
      console.log('✅ play-dl video URL:', info.video_details.url);
      
      // Now try to use this URL with ytdl-core
      console.log('🔄 Trying ytdl-core with play-dl URL...');
      try {
        const stream2 = ytdl(info.video_details.url, {
          filter: 'audioonly',
          quality: 'lowestaudio',
          requestOptions: {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Referer': 'https://www.youtube.com/',
              'Origin': 'https://www.youtube.com',
            }
          }
        });
        
        console.log('✅ ytdl-core with play-dl URL created successfully');
        
        let dataReceived2 = false;
        stream2.on('data', (chunk) => {
          if (!dataReceived2) {
            console.log('✅ Data received from ytdl-core + play-dl combo, size:', chunk.length);
            dataReceived2 = true;
          }
        });
        
        stream2.on('error', (error) => {
          console.log('❌ ytdl-core + play-dl combo error:', error.message);
        });
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        stream2.destroy();
        
      } catch (error) {
        console.log('❌ ytdl-core + play-dl combo failed:', error.message);
      }
    }
    
  } catch (error) {
    console.log('❌ play-dl failed:', error.message);
  }
  
  console.log('\n');
  
  // Method 3: ytdl-core with different user agents
  console.log('3️⃣ Testing ytdl-core with mobile user agent...');
  try {
    const stream = ytdl(testUrl, {
      filter: 'audioonly',
      quality: 'lowestaudio',
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Referer': 'https://m.youtube.com/',
        }
      }
    });
    
    console.log('✅ Mobile user agent ytdl-core stream created');
    
    let dataReceived = false;
    stream.on('data', (chunk) => {
      if (!dataReceived) {
        console.log('✅ Data received from mobile user agent stream, size:', chunk.length);
        dataReceived = true;
      }
    });
    
    stream.on('error', (error) => {
      console.log('❌ Mobile user agent error:', error.message);
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    stream.destroy();
    
  } catch (error) {
    console.log('❌ Mobile user agent failed:', error.message);
  }
  
  console.log('\n🏁 Bypass method testing completed!');
}

testBypassMethods().catch(console.error);