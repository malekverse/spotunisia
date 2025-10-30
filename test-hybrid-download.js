// Test the hybrid download API implementation
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000';

async function testHybridDownload() {
  console.log('🧪 Testing Hybrid Download API Implementation');
  console.log('=' .repeat(60));

  const testTrack = {
    trackName: 'Believer',
    artistName: 'Imagine Dragons'
  };
  
  try {
    console.log(`\n📡 Testing download API with track: "${testTrack.trackName}" by "${testTrack.artistName}"`);
    
    const downloadResponse = await fetch(`${API_BASE}/api/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trackName: testTrack.trackName,
        artistName: testTrack.artistName,
        quality: 'high'
      })
    });

    console.log(`📊 Response Status: ${downloadResponse.status}`);
    console.log(`📊 Response Headers:`, Object.fromEntries(downloadResponse.headers.entries()));

    if (!downloadResponse.ok) {
      const errorText = await downloadResponse.text();
      console.log(`❌ Download failed: ${errorText}`);
      return;
    }

    // Check if we're getting a stream
    const contentType = downloadResponse.headers.get('content-type');
    const contentLength = downloadResponse.headers.get('content-length');
    const contentDisposition = downloadResponse.headers.get('content-disposition');

    console.log(`✅ Content-Type: ${contentType}`);
    console.log(`✅ Content-Length: ${contentLength || 'Not specified'}`);
    console.log(`✅ Content-Disposition: ${contentDisposition}`);

    // Test streaming by reading a small chunk
    if (downloadResponse.body) {
      console.log('\n🔄 Testing stream reading...');
      
      let totalBytes = 0;
      let chunks = 0;
      const maxChunks = 5; // Read only first 5 chunks for testing
      
      downloadResponse.body.on('data', (chunk) => {
        if (chunks < maxChunks) {
          totalBytes += chunk.length;
          chunks++;
          console.log(`📦 Chunk ${chunks}: ${chunk.length} bytes (Total: ${totalBytes} bytes)`);
        }
        
        if (chunks >= maxChunks) {
          downloadResponse.body.destroy(); // Stop reading after max chunks
        }
      });
      
      downloadResponse.body.on('end', () => {
        console.log('📥 Stream ended naturally');
      });
      
      downloadResponse.body.on('error', (error) => {
        console.error('❌ Stream error:', error);
      });
      
      // Wait a bit for chunks to be read
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (totalBytes > 0) {
        console.log(`✅ Successfully streamed ${totalBytes} bytes in ${chunks} chunks`);
        console.log('🎉 Hybrid download API is working correctly!');
      } else {
        console.log('⚠️  No data received from stream');
      }
    } else {
      console.log('❌ No readable stream available');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the development server is running (pnpm dev)');
    }
  }
}

// Run the test
testHybridDownload().catch(console.error);