const { default: fetch } = require('node-fetch');

async function testGetDownload() {
  console.log('Testing GET download API...');
  
  try {
    const trackName = 'Shinrei Tantei Yakumo Outro';
    const artistName = 'Emy Hetari';
    const platform = 'youtube';
    
    const url = `http://localhost:3000/api/download?trackName=${encodeURIComponent(trackName)}&artistName=${encodeURIComponent(artistName)}&platform=${platform}`;
    
    console.log('Making GET request to:', url);
    
    const downloadResponse = await fetch(url);
    
    console.log('Response status:', downloadResponse.status);
    console.log('Response headers:');
    console.log('  Content-Type:', downloadResponse.headers.get('content-type'));
    console.log('  Content-Length:', downloadResponse.headers.get('content-length'));
    console.log('  Content-Disposition:', downloadResponse.headers.get('content-disposition'));
    console.log('  X-Extraction-Method:', downloadResponse.headers.get('x-extraction-method'));
    console.log('  X-Video-Title:', downloadResponse.headers.get('x-video-title'));
    console.log('  X-Video-Duration:', downloadResponse.headers.get('x-video-duration'));
    
    if (downloadResponse.status !== 200) {
      const errorText = await downloadResponse.text();
      console.log(`❌ Download failed: ${errorText}`);
      return;
    }
    
    console.log('✅ Download API responded successfully!');
    
    // Test streaming by reading a few chunks
    let totalBytes = 0;
    let chunkCount = 0;
    const maxChunks = 5;
    
    console.log('Testing stream reading...');
    
    const timeout = setTimeout(() => {
      console.log('✅ Stream test completed (timeout reached)');
      console.log(`Total bytes read: ${totalBytes}`);
      console.log(`Chunks read: ${chunkCount}`);
    }, 5000);
    
    downloadResponse.body.on('data', (chunk) => {
      totalBytes += chunk.length;
      chunkCount++;
      console.log(`Chunk ${chunkCount}: ${chunk.length} bytes`);
      
      if (chunkCount >= maxChunks) {
        clearTimeout(timeout);
        console.log('✅ Stream test completed (max chunks reached)');
        console.log(`Total bytes read: ${totalBytes}`);
        console.log(`Chunks read: ${chunkCount}`);
        downloadResponse.body.destroy();
      }
    });
    
    downloadResponse.body.on('end', () => {
      clearTimeout(timeout);
      console.log('✅ Stream ended naturally');
      console.log(`Total bytes read: ${totalBytes}`);
      console.log(`Chunks read: ${chunkCount}`);
    });
    
    downloadResponse.body.on('error', (error) => {
      clearTimeout(timeout);
      console.error('❌ Stream error:', error);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('Make sure the development server is running on http://localhost:3000');
    }
  }
}

testGetDownload().catch(console.error);