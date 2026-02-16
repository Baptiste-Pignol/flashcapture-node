# 📸 FlashCapture Node.js Client

[![npm version](https://img.shields.io/npm/v/flashcapture-node.svg?style=flat-square)](https://www.npmjs.com/package/flashcapture-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![RapidAPI](https://img.shields.io/badge/RapidAPI-FlashCapture-blueviolet?style=flat-square)](https://rapidapi.com/your-username/api/flashcapture)

The official, high-performance Node.js wrapper for the **FlashCapture API**.

**Stop fighting with Puppeteer.** Generate pixel-perfect screenshots of modern websites, handle lazy-loading, block ads, and capture full pages without managing headless browsers or zombie processes.

## 🚀 Features

* **Zero-Config:** No need to install Chrome, Puppeteer, or heavy binaries.
* **Smart Polling:** The SDK handles the async job queue automatically. You just `await` the result.
* **Ad-Blocking:** Built-in options to hide banners and cookie popups.
* **TypeScript Support:** Includes type definitions (`.d.ts`) out of the box.

---

## 📦 Installation

```bash
npm install flashcapture-node

```

## 🔑 Prerequisites

You need an API Key from RapidAPI.

1. Go to [FlashCapture on RapidAPI](https://rapidapi.com/BaptistePignol/api/flashcapture-screenshot-api).
2. Subscribe to the **Free Tier** (50 shots/month).
3. Copy your `X-RapidAPI-Key`.

---

## 🛠 Usage

### 1. Quick Start: Capture & Save to Disk

The easiest way to take a screenshot and save it locally.

```javascript
const FlashCapture = require('flashcapture-node');

// Initialize with your API Key
const client = new FlashCapture('YOUR_RAPIDAPI_KEY_HERE');

(async () => {
    try {
        console.log('📸 Snapping Google...');
        
        const result = await client.captureAndSave(
            '[https://www.wikipedia.org](https://www.wikipedia.org)', 
            './google.png', 
            { 
                fullPage: true, 
                darkMode: true 
            }
        );

        console.log(`✅ Saved to: ${result.localPath}`);
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
})();

```

### 2. Advanced: Get Image Buffer (Memory)

Useful if you want to upload the image directly to S3, send it to a Discord bot, or serve it via an API without saving it to disk.

```javascript
const FlashCapture = require('flashcapture-node');
const client = new FlashCapture('YOUR_KEY');

(async () => {
    // 1. Submit job and wait for completion (Auto-polling)
    const job = await client.capture('[https://www.wikipedia.org](https://www.wikipedia.org)', {
        width: 1920,
        height: 1080,
        hideElements: ['.cookie-banner', '#ad-sidebar']
    });

    console.log(`Job Done! ID: ${job.id}`);

    // 2. Download the buffer
    const imageBuffer = await client.download(job.id);

    // ... Do whatever you want with the buffer
    // s3.putObject({ Body: imageBuffer ... })
})();

```

---

## ⚙️ Configuration Options

You can pass these options to `capture()` or `captureAndSave()`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `fullPage` | `boolean` | `false` | Capture the full scrollable height of the page. |
| `width` | `number` | `1920` | Viewport width in pixels. |
| `height` | `number` | `1080` | Viewport height in pixels. |
| `darkMode` | `boolean` | `false` | Force the website to render in dark mode. |
| `delay` | `number` | `0` | Wait time in seconds before capturing (for animations). |
| `hideElements` | `string[]` | `[]` | Array of CSS selectors to hide (e.g. `['.ads', '#popup']`). |
| `userAgent` | `string` | `null` | Spoof a custom user agent. |
| `type` | `string` | `'png'` | Output format: `'png'` or `'jpeg'`. |

---

## ❓ FAQ

**Why use this instead of `puppeteer` directly?**
Running Puppeteer in production (Docker/Lambda) is hard. You have to deal with fonts, memory leaks, crashing processes, and IP bans. FlashCapture handles all that infrastructure for you via a simple API.

**Is it free?**
Yes, there is a free tier on RapidAPI for development and testing.

---

## 📄 License

MIT © [FlashCapture Team]