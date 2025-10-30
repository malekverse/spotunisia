const ytdl = require('ytdl-core');

async function testYtdl() {
  try {
    console.log('Testing ytdl-core library...');
    
    const testUrl = 'https://www.youtube.com/watch?v=s5FbBMSnubQ';
    console.log('Test URL:', testUrl);
    
    // Test 1: Check if URL is valid
    console.log('\n--- Test 1: Validating URL ---');
    const isValid = ytdl.validateURL(testUrl);
    console.log('URL is valid:', isValid);
    
    if (!isValid) {
      console.log('URL is not valid, stopping tests');
      return;
    }
    
    // Test 2: Get video info
    console.log('\n--- Test 2: Getting video info ---');
    const info = await ytdl.getInfo(testUrl);
    console.log('Video title:', info.videoDetails.title);
    console.log('Video length:', info.videoDetails.lengthSeconds, 'seconds');
    console.log('Available formats:', info.formats.length);
    
    // Test 3: Get audio formats
    console.log('\n--- Test 3: Getting audio formats ---');
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    console.log('Audio formats available:', audioFormats.length);
    
    if (audioFormats.length > 0) {
      console.log('First audio format:');
      console.log('- Quality:', audioFormats[0].quality);
      console.log('- Container:', audioFormats[0].container);
      console.log('- Audio codec:', audioFormats[0].audioCodec);
    }
    
    // Test 4: Try to create a stream
    console.log('\n--- Test 4: Creating audio stream ---');
    const stream = ytdl(testUrl, { 
      filter: 'audioonly',
      quality: 'highestaudio'
    });
    
    console.log('Stream created successfully:', !!stream);
    console.log('Stream is readable:', stream.readable);
    
    // Clean up
    stream.destroy();
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testYtdl();