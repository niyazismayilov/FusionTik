# 🚀 FusionTik - TikTok Downloader

> Download TikTok videos, images, and audio without watermarks. Fast, free, and user-friendly.

## 🌟 What is FusionTik?

FusionTik is your go-to solution for downloading TikTok content effortlessly. Whether you want to save videos, images, or extract audio, FusionTik makes it simple and fast. No watermarks, no hassle - just pure content downloading experience.

**🌐 Try it now:** [FusionTik Live](https://fusiontik.vercel.app)

### 🎯 Why Choose FusionTik?

- 🎬 **Clean Downloads** - Get TikTok videos without any watermarks
- 🖼️ **Photo Support** - Download image carousels and slideshows
- 🎵 **Audio Only** - Extract just the music you love
- 📱 **Works Everywhere** - Perfect on phone, tablet, or computer
- ⚡ **Lightning Fast** - Downloads in seconds, not minutes
- 🔒 **Your Privacy** - We don't store your data or track you
- 💾 **Smart History** - Never lose track of what you've downloaded
- 🆓 **Always Free** - No hidden costs, no premium tiers

## 🛠️ Built With Modern Tech

- **⚛️ Next.js 15** - The latest React framework for optimal performance
- **📘 TypeScript** - Type-safe development for reliability
- **🎨 Tailwind CSS** - Utility-first styling for beautiful designs
- **🧩 shadcn/ui** - High-quality, accessible UI components
- **🎭 Framer Motion** - Smooth animations and transitions
- **🔗 Lucide Icons** - Beautiful, consistent iconography
- **🌐 External APIs** - Reliable TikTok content extraction

## 🚀 Quick Start

### What You'll Need

- **Node.js 18+** (Latest LTS recommended)
- **Package Manager** (npm, yarn, or pnpm)

### Get Started

1. **Clone the repository:**

```bash
git clone https://github.com/jundy779/FusionTik.git
cd FusionTik
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

## 🎮 Running FusionTik

### Development

Start the development server:

```bash
npm run dev
```

Visit <http://localhost:3000> to see FusionTik in action!

### Production

Build for production:

```bash
npm run build
npm run start
```

Customize the port:

```bash
PORT=8080 npm run start
```

## 🤖 Telegram Bot Setup

FusionTik includes a Telegram bot that allows users to download TikTok videos directly from Telegram!

### Bot Features

- 📱 Send TikTok URLs to the bot
- 🎬 Receive downloaded videos without watermarks
- 🖼️ Support for image posts
- ⚡ Fast processing and delivery
- 🆓 Completely free to use

### Setup Instructions

1. **Get your Telegram Bot Token**
   - Create a bot with [@BotFather](https://t.me/botfather) on Telegram
   - Save your bot token

2. **Configure Environment Variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   ```

3. **Set Up Webhook**
   
   Once your application is deployed, set the webhook URL:
   
   **Option A: Using the Web Interface (Easiest)**
   
   Visit `/webhook` page on your deployed site:
   ```
   https://your-domain.com/webhook
   ```
   
   The page provides a user-friendly interface to:
   - View current webhook status
   - Set or update webhook URL
   - Check for errors
   - Monitor pending updates
   
   **Option B: Using the API endpoint**
   ```bash
   curl -X POST https://your-domain.com/api/telegram/set-webhook \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-domain.com/api/telegram/webhook"}'
   ```
   
   **Option B: Using GET request**
   ```bash
   curl "https://your-domain.com/api/telegram/set-webhook?url=https://your-domain.com/api/telegram/webhook"
   ```
   
   **Option C: Direct Telegram API call**
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-domain.com/api/telegram/webhook"}'
   ```

4. **Test Your Bot**
   - Open your bot on Telegram: `t.me/your_bot_username`
   - Send `/start` to begin
   - Send a TikTok URL to test

### API Endpoints

- **Webhook Endpoint:** `POST /api/telegram/webhook`
  - Receives updates from Telegram
  - Processes TikTok URLs and sends videos

- **Set Webhook:** `POST /api/telegram/set-webhook`
  - Configures the Telegram webhook URL
  - Accepts `{"url": "https://..."}` in body

- **TikTok API (for bots):** `GET /api/tiktok/telegram?url=<tiktok_url>`
  - Returns video URL in bot-friendly format
  - Also supports POST with JSON body

### Bot Commands

- `/start` - Welcome message and instructions
- `/help` - Show help information
- Send any TikTok URL to download the video

### Example Usage

Users can simply send a TikTok URL to your bot:
```
https://www.tiktok.com/@username/video/1234567890
```

The bot will:
1. Process the URL
2. Download the video
3. Send it back to the user with caption

### Troubleshooting

- **Webhook not working?** Make sure your server has HTTPS (required by Telegram)
- **Bot not responding?** Check that `TELEGRAM_BOT_TOKEN` is set correctly
- **Videos not sending?** Verify `NEXT_PUBLIC_BASE_URL` points to your deployed URL

## 📁 Project Structure

```
FusionTik/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── tiktok/
│   │   │   └── route.ts          # TikTok download API endpoint
│   │   └── global-stats/
│   │       └── route.ts          # Global download counter API
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (main downloader)
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── navbar.tsx                # Navigation bar component
│   ├── result-buttons.tsx        # Download result buttons
│   ├── result-card.tsx           # Download history card
│   ├── stats-card.tsx            # Download statistics card
│   ├── video-preview.tsx         # Video preview with caption
│   └── video-preview-modal.tsx   # Video preview modal
│
├── hooks/                        # Custom React hooks
│   ├── use-download-history.ts   # Download history management
│   ├── use-download-stats.ts     # Individual user statistics
│   └── use-global-stats.ts       # Global download counter
│
├── lib/                          # Utility libraries
│   └── utils.ts                  # Helper functions
│
├── data/                         # Data storage
│   └── global-stats.json         # Global counter persistence
│
├── public/                       # Static assets
│   └── ...
│
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore file
├── components.json              # shadcn/ui configuration
├── next.config.mjs              # Next.js configuration
├── package.json                 # Project dependencies
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## 💡 How It Works

### 🎬 Video Downloads

- Paste any TikTok video URL
- Get clean MP4 files without watermarks
- Choose between standard and HD quality
- Multiple download options (MP4 [1], MP4 HD, MP3)

### 🖼️ Image Collections

- Download entire photo carousels
- Save individual images or all at once
- Maintains original image quality

### 🎵 Audio Extraction

- Extract just the audio from videos
- Get MP3 files ready to use
- Perfect for music lovers

### 📚 Smart History

- Your downloads are saved locally
- Access previous downloads anytime
- Manage your collection easily
- Personal download statistics

### 🌍 Global Counter

- Track total downloads worldwide
- Persistent storage across server restarts
- Real-time counter updates

## 🛡️ Your Privacy Matters

- **🔒 Zero Data Storage** - We don't keep your downloads on our servers
- **💻 Local Only** - Your history stays on your device
- **👻 No Tracking** - We don't follow you around the internet
- **📖 Open Source** - You can see exactly what we do

## 🤝 Want to Help?

We'd love your contributions! Here's how:

1. **🍴 Fork this repo**
2. **🌿 Create a branch:**  
   ```bash
   git checkout -b your-awesome-feature
   ```
3. **💾 Commit your changes:**  
   ```bash
   git commit -m 'Add your awesome feature'
   ```
4. **🚀 Push and create a PR**

## 🐛 Found a Bug?

Help us fix it! Please include:

- What went wrong
- How to make it happen again
- What you expected vs what happened
- Screenshots if helpful
- Your device/browser info

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚖️ Important Notice

**Please use responsibly:**

- This is for personal use only
- Respect content creators' rights
- Follow TikTok's Terms of Service
- Don't use downloaded content commercially without permission

## 🙏 Thanks to These Amazing Tools

- [Next.js](https://nextjs.org/) - Our React foundation
- [Tailwind CSS](https://tailwindcss.com/) - Beautiful styling made easy
- [shadcn/ui](https://ui.shadcn.com/) - Gorgeous UI components
- [Framer Motion](https://www.framer.com/motion/) - Smooth animations
- [TikSave.io](https://tiksave.io/) - TikTok content extraction

## 📞 Get in Touch

- **🌐 Website:** [Fusionify.ID](https://linktr.ee/fusionifytempest)
- **📁 Repository:** [FusionTik](https://github.com/jundy779/FusionTik)

---

**💙 Made with love by [FUSIONIFY DIGITAL.ID](https://linktr.ee/fusionifytempest)**