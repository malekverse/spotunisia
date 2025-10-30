import fetch from 'node-fetch';

async function testDownloadAPI() {
  try {
    console.log('Testing download API with ytdl-core...');
    
    const response = await fetch('http://localhost:3000/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trackName: 'ارحموني',
        artistName: 'IZZ',
        platform: 'youtube',
        quality: 'high'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ Download API is working!');
      console.log('Content-Type:', response.headers.get('content-type'));
      console.log('Content-Disposition:', response.headers.get('content-disposition'));
      
      // Check if we're getting a stream
      const reader = response.body.getReader();
      const { value, done } = await reader.read();
      
      if (!done && value) {
        console.log('✅ Stream is working! Received', value.length, 'bytes');
      } else {
        console.log('❌ No stream data received');
      }
      
      reader.releaseLock();
    } else {
      const errorText = await response.text();
      console.log('❌ Download API failed:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDownloadAPI();