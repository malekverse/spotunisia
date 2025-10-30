const YTDlpWrap = require('yt-dlp-wrap').default;

async function testYtDlp() {
  try {
    console.log('Testing yt-dlp-wrap library...');
    
    const testUrl = 'https://www.youtube.com/watch?v=s5FbBMSnubQ';
    console.log('Test URL:', testUrl);
    
    // Create YTDlpWrap instance
    const ytDlpWrap = new YTDlpWrap();
    
    // Test 1: Get video info
    console.log('\n--- Test 1: Getting video info ---');
    const videoInfo = await ytDlpWrap.getVideoInfo(testUrl);
    console.log('Video title:', videoInfo.title);
    console.log('Video duration:', videoInfo.duration, 'seconds');
    console.log('Video uploader:', videoInfo.uploader);
    
    // Test 2: Check available formats
    console.log('\n--- Test 2: Available formats ---');
    if (videoInfo.formats && videoInfo.formats.length > 0) {
      const audioFormats = videoInfo.formats.filter(f => f.acodec && f.acodec !== 'none');
      console.log('Audio formats available:', audioFormats.length);
      
      if (audioFormats.length > 0) {
        console.log('Best audio format:');
        console.log('- Format ID:', audioFormats[0].format_id);
        console.log('- Extension:', audioFormats[0].ext);
        console.log('- Audio codec:', audioFormats[0].acodec);
      }
    }
    
    console.log('✅ yt-dlp-wrap test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testYtDlp();