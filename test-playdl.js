const playdl = require('play-dl');

async function testPlayDl() {
  try {
    console.log('Testing play-dl library...');
    
    const testUrl = 'https://www.youtube.com/watch?v=s5FbBMSnubQ';
    console.log('Test URL:', testUrl);
    console.log('URL type:', typeof testUrl);
    
    // Test 1: Get video info
    console.log('\n--- Test 1: Getting video info ---');
    const videoInfo = await playdl.video_info(testUrl);
    console.log('Video info retrieved successfully');
    console.log('Video title:', videoInfo.video_details.title);
    console.log('Video URL from info:', videoInfo.video_details.url);
    
    // Test 2: Try streaming with original URL
    console.log('\n--- Test 2: Streaming with original URL ---');
    try {
      const streamInfo1 = await playdl.stream(testUrl);
      console.log('Stream 1 successful:', !!streamInfo1);
      console.log('Stream 1 has stream property:', !!streamInfo1.stream);
    } catch (error) {
      console.log('Stream 1 error:', error.message);
      console.log('Stream 1 error code:', error.code);
      console.log('Stream 1 error input:', error.input);
    }
    
    // Test 3: Try streaming with video info URL
    console.log('\n--- Test 3: Streaming with video info URL ---');
    try {
      const streamInfo2 = await playdl.stream(videoInfo.video_details.url);
      console.log('Stream 2 successful:', !!streamInfo2);
      console.log('Stream 2 has stream property:', !!streamInfo2.stream);
    } catch (error) {
      console.log('Stream 2 error:', error.message);
      console.log('Stream 2 error code:', error.code);
      console.log('Stream 2 error input:', error.input);
    }
    
    // Test 4: Try streaming with video info object
    console.log('\n--- Test 4: Streaming with video info object ---');
    try {
      const streamInfo3 = await playdl.stream(videoInfo);
      console.log('Stream 3 successful:', !!streamInfo3);
      console.log('Stream 3 has stream property:', !!streamInfo3.stream);
    } catch (error) {
      console.log('Stream 3 error:', error.message);
      console.log('Stream 3 error code:', error.code);
      console.log('Stream 3 error input:', error.input);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testPlayDl();