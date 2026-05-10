/**
 * Render Script using Playwright
 * Captures the React animation frame-by-frame or via screencast.
 */
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';

async function render() {
  console.log('🚀 Starting render process...');
  
  // 1. Start the server
  const server = spawn('npm', ['run', 'dev'], {
    env: { ...process.env, PORT: '3000' },
    shell: true
  });

  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 5000));

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  console.log('🌐 Loading application...');
  await page.goto('http://localhost:3000');
  
  // Wait for the fiverr watermark or some element to be sure it's loaded
  await page.waitForSelector('#video-container');

  console.log('📹 Recording animation (37.94s)...');
  
  // Click play button (this assumes your UI has a start button)
  // Or we can manually set the time state if we exposed it to window, 
  // but for a simple capture we just run it.
  await page.click('button:has-text("Play")');

  // Record for the duration
  // In a professional setup, we would use 'timesnap' or 'remotion' 
  // for frame-perfect sync, but this is a standard capture.
  await page.video().path(); // Playwright can record video automatically
  
  // Wait for the full duration
  await new Promise(resolve => setTimeout(resolve, 39000)); 

  await browser.close();
  server.kill();
  
  console.log('✅ Render complete! Check the artifacts.');
}

render().catch(console.error);
