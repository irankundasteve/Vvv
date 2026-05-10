/**
 * Render Script using Playwright
 * Captures the React animation frame-by-frame or via screencast.
 */
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import waitOn from 'wait-on';

async function render() {
  const PORT = process.env.PORT || 3000;
  const URL = `http://localhost:${PORT}`;

  console.log('🚀 Starting dev server...');
  const server = spawn('npm', ['run', 'dev'], {
    env: { ...process.env, PORT: PORT.toString() },
    shell: true,
    stdio: 'inherit'
  });

  try {
    console.log(`⏳ Waiting for ${URL}...`);
    await waitOn({ resources: [URL], timeout: 30000 });
    console.log('✅ Server is ready!');

    const browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      recordVideo: {
        dir: './recordings',
        size: { width: 1920, height: 1080 }
      }
    });

    console.log('🌐 Loading application...');
    await page.goto(URL);
    await page.waitForSelector('#video-container');

    console.log('📹 Starting video playback...');
    // The play button is the large one in the middle
    await page.click('button:has(svg)'); 

    const durationMs = 38500; // Slightly more than 37.94s
    console.log(`⏳ Recording for ${durationMs/1000}s...`);
    await page.waitForTimeout(durationMs);

    console.log('💾 Saving video...');
    const videoPath = await page.video().path();
    console.log(`🎬 Video recorded to: ${videoPath}`);

    // In a real flow, we'd move this to the final video.mp4
    // But Playwright puts it in recordings/ by default above.
    
    await browser.close();
    console.log('✅ Render complete!');
  } catch (error) {
    console.error('❌ Render failed:', error);
    process.exit(1);
  } finally {
    console.log('🛑 Shutting down server...');
    server.kill();
  }
}

render();
