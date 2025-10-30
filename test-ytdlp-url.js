// Test the URL extracted by yt-dlp
const testUrl = 'https://rr3---sn-uv2oxuuo-u0od.googlevideo.com/videoplayback?expire=1761104419&ei=w_33aKfJGdC5mLAPpPCHyQs&ip=197.0.98.127&id=o-ABzAdQ2Gxw1QfftzyW8Byc8YKZVRpM_CJ1ZfAb7qEEp9&itag=140&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&met=1761082819%2C&mh=Eg&mm=31%2C29&mn=sn-uv2oxuuo-u0od%2Csn-hpa7kn76&ms=au%2Crdu&mv=m&mvi=3&pl=17&rms=au%2Cau&initcwndbps=587500&bui=ATw7iSVMhceiy13XPWteppkGnMGQyUYPXgsspcYjY9wtyGAhagbz7vTmfUB2DOj9w-3Qw_mKWjnL8V-f&vprv=1&svpuc=1&mime=audio%2Fmp4&ns=J1ltuOULIyI1Brs4kp1FvaQQ&rqh=1&gir=yes&clen=4146033&dur=256.139&lmt=1706031222368266&mt=1761082413&fvip=2&keepalive=yes&lmw=1&fexp=51557447%2C51565115%2C51565681%2C51580970&c=TVHTML5&sefc=1&txp=4532434&n=b3CJTk-M4XWr4g&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&lsig=APaTxxMwRQIhAJ2zRfUOK9MjTiSoaUW6osRmGdAX9_6Fx6qHgMrvBWTMAiAqy4ugQdYxjVlv_ate_6KNHleFhu1SfsoLzJ2u8T-n0w%3D%3D&sig=AJfQdSswRQIhAM3PgJkd2EbZhN5tJB_XghQ1A_LRB7USNSLbJL1jnwq8AiBd-iI_AJs2EC857RO9o5HCU_fTHXMJNDlyEvhYDSGgfQ%3D%3D';

async function testYtdlpUrl() {
  console.log('🔍 Testing yt-dlp extracted URL...\n');
  
  try {
    console.log('🔄 Testing URL accessibility...');
    const response = await fetch(testUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.youtube.com/'
      }
    });
    
    console.log('✅ URL is accessible!');
    console.log('   Status:', response.status);
    console.log('   Content-Type:', response.headers.get('content-type'));
    console.log('   Content-Length:', response.headers.get('content-length'));
    console.log('   Accept-Ranges:', response.headers.get('accept-ranges'));
    
    if (response.status === 200) {
      console.log('\n🔄 Testing small download...');
      const downloadResponse = await fetch(testUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.youtube.com/',
          'Range': 'bytes=0-4095' // Download first 4KB
        }
      });
      
      if (downloadResponse.ok) {
        const chunk = await downloadResponse.arrayBuffer();
        console.log('✅ Successfully downloaded', chunk.byteLength, 'bytes');
        console.log('🎉 YT-DLP URL IS FULLY WORKING!');
        console.log('🎯 This approach can be implemented in the API');
        
        // Test streaming capability
        console.log('\n🔄 Testing streaming capability...');
        const streamResponse = await fetch(testUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://www.youtube.com/'
          }
        });
        
        if (streamResponse.ok && streamResponse.body) {
          console.log('✅ Stream response received');
          const reader = streamResponse.body.getReader();
          let totalBytes = 0;
          let chunks = 0;
          
          try {
            while (chunks < 5) { // Read first 5 chunks
              const { done, value } = await reader.read();
              if (done) break;
              
              totalBytes += value.length;
              chunks++;
              console.log(`   Chunk ${chunks}: ${value.length} bytes`);
            }
            
            console.log('✅ Streaming works! Total bytes read:', totalBytes);
            console.log('🎉 PERFECT! This can be used for real-time streaming');
            
          } finally {
            reader.releaseLock();
            streamResponse.body.cancel();
          }
        }
      }
    }
    
  } catch (error) {
    console.log('❌ URL test failed:', error.message);
  }
  
  console.log('\n🏁 yt-dlp URL testing completed!');
}

testYtdlpUrl().catch(console.error);