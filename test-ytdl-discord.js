import ytdl from 'ytdl-core-discord';
import playdl from 'play-dl';

async function testYtdlDiscord() {
  const testUrl = 'https://www.youtube.com/watch?v=s5FbBMSnubQ';
  
  console.log('🔍 Testing ytdl-core-discord...\n');
  
  // First, verify play-dl still works for metadata
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
  
  console.log('\n🎵 Testing ytdl-core-discord streaming...');
  
  // Test ytdl-core-discord with different configurations
  const configs = [
    {
      name: 'Basic',
      options: {
        filter: 'audioonly',
        quality: 'lowestaudio',
        highWaterMark: 1 << 25
      }
    },
    {
      name: 'With Headers',
      options: {
        filter: 'audioonly',
        quality: 'lowestaudio',
        highWaterMark: 1 << 25,
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.youtube.com/',
            'Origin': 'https://www.youtube.com',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site'
          }
        }
      }
    },
    {
      name: 'Mobile User Agent',
      options: {
        filter: 'audioonly',
        quality: 'lowestaudio',
        highWaterMark: 1 << 25,
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
            'Accept': '*/*',
            'Referer': 'https://m.youtube.com/',
          }
        }
      }
    }
  ];
  
  for (const config of configs) {
    console.log(`\n🔄 Testing ${config.name} configuration...`);
    
    try {
      console.log('   Creating stream...');
      const stream = ytdl(testUrl, config.options);
      console.log('✅ Stream created successfully');
      
      // Test stream events
      let dataReceived = false;
      let errorOccurred = false;
      let streamEnded = false;
      
      const timeout = setTimeout(() => {
        if (!dataReceived && !errorOccurred) {
          console.log('⏳ No data received within 10 seconds, but no errors');
        }
        stream.destroy();
      }, 10000);
      
      stream.on('data', (chunk) => {
        if (!dataReceived) {
          console.log('✅ Data received! Chunk size:', chunk.length);
          console.log('🎉 SUCCESS! ytdl-core-discord is working with', config.name, 'config');
          dataReceived = true;
          clearTimeout(timeout);
          
          // Test a bit more data
          let totalBytes = chunk.length;
          const dataTimeout = setTimeout(() => {
            console.log('✅ Total bytes received:', totalBytes);
            console.log('🎉 STREAM IS FULLY WORKING!');
            stream.destroy();
          }, 2000);
          
          stream.on('data', (nextChunk) => {
            totalBytes += nextChunk.length;
          });
        }
      });
      
      stream.on('error', (error) => {
        console.log('❌ Stream error:', error.message);
        errorOccurred = true;
        clearTimeout(timeout);
      });
      
      stream.on('end', () => {
        console.log('✅ Stream ended normally');
        streamEnded = true;
        clearTimeout(timeout);
      });
      
      // Wait for the stream to process
      await new Promise(resolve => {
        stream.on('data', () => resolve());
        stream.on('error', () => resolve());
        setTimeout(resolve, 12000); // Max wait time
      });
      
      if (dataReceived) {
        console.log('🎉 FOUND WORKING CONFIGURATION:', config.name);
        break; // Found working config, no need to test others
      }
      
    } catch (error) {
      console.log('❌ Failed to create stream:', error.message);
    }
  }
  
  console.log('\n🏁 ytdl-core-discord testing completed!');
}

testYtdlDiscord().catch(console.error);