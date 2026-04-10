import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/isakp/AppData/Local/npm-cache/_npx/7d92d9a2d2ccc630/node_modules/puppeteer');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url    = process.argv[2] || 'http://localhost:3000';
const label  = process.argv[3] || '';

// Auto-increment screenshot filename
const dir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n));
const next = (nums.length ? Math.max(...nums) : 0) + 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath = path.join(dir, filename);

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:/Users/isakp/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();
console.log('Screenshot saved:', outPath);
