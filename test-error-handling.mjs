import fetch from 'node-fetch';

async function testErrorHandling() {
  console.log('Testing download API error handling...');
  
  try {
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
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('✅ Error handling working correctly!');
      console.log('Error response:', JSON.stringify(errorData, null, 2));
      
      // Check if we have user-friendly error messages
      if (errorData.message && errorData.suggestion) {
        console.log('✅ User-friendly error messages present');
        console.log('Message:', errorData.message);
        console.log('Suggestion:', errorData.suggestion);
      } else {
        console.log('❌ Missing user-friendly error messages');
      }
    } else {
      console.log('❌ Expected error but got success response');
      // If successful, try to read a small amount of data
      const reader = response.body.getReader();
      const { value } = await reader.read();
      console.log('Received data length:', value ? value.length : 0);
      reader.releaseLock();
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testErrorHandling();