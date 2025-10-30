import playdl from 'play-dl';

async function testPlayDlStream() {
  try {
    console.log('Testing play-dl stream functionality...');
    
    const url = 'https://www.youtube.com/watch?v=s5FbBMSnubQ';
    console.log('URL to test:', url);
    
    // Test if play-dl can validate the URL
    const isValid = playdl.yt_validate(url);
    console.log('URL validation result:', isValid);
    
    if (isValid === 'video') {
      console.log('URL is valid, attempting to get stream...');
      
      // Try to get stream info first
      const streamInfo = await playdl.stream(url, {
        quality: 0 // lowest quality for testing
      });
      
      console.log('Stream info:', streamInfo);
      console.log('Stream type:', typeof streamInfo);
      console.log('Stream properties:', Object.keys(streamInfo));
      
    } else {
      console.log('URL validation failed:', isValid);
    }
    
  } catch (error) {
    console.error('Error testing play-dl stream:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      input: error.input
    });
  }
}

testPlayDlStream();