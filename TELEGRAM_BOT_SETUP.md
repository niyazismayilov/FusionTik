# 🤖 Telegram Bot Setup Guide

## Quick Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
TELEGRAM_BOT_TOKEN=8506385037:AAECCbrD9LO5gZ2pTNtEoiU5a8ZWOxOR5Qg
NEXT_PUBLIC_BASE_URL=https://your-domain.com
TELEGRAM_CHANNEL_USERNAME=your_channel_username
```

**Note:** Replace `your_channel_username` with your actual Telegram channel username (without @)

**Important:** Replace `https://your-domain.com` with your actual deployed URL.

### 2. Deploy Your Application

Deploy your Next.js application to a hosting service that supports HTTPS (required by Telegram):
- Vercel (recommended)
- Railway
- Render
- Any other service with HTTPS

### 3. Set Up Webhook

After deployment, set the webhook URL using one of these methods:

#### Method 1: Using the API Endpoint (Recommended)

```bash
curl -X POST https://your-domain.com/api/telegram/set-webhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/api/telegram/webhook"}'
```

#### Method 2: Using GET Request

```bash
curl "https://your-domain.com/api/telegram/set-webhook?url=https://your-domain.com/api/telegram/webhook"
```

#### Method 3: Direct Telegram API

```bash
curl -X POST "https://api.telegram.org/bot8506385037:AAECCbrD9LO5gZ2pTNtEoiU5a8ZWOxOR5Qg/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/api/telegram/webhook"}'
```

### 4. Verify Webhook

Check if webhook is set correctly:

```bash
curl "https://api.telegram.org/bot8506385037:AAECCbrD9LO5gZ2pTNtEoiU5a8ZWOxOR5Qg/getWebhookInfo"
```

### 5. Test Your Bot

1. Open Telegram and search for your bot: `@tik_save_videosbot`
2. Send `/start` command
3. Send a TikTok URL to test

## Bot Commands

- `/start` - Welcome message
- `/help` - Show help information
- Send any TikTok URL to download

## How It Works

1. User sends TikTok URL to bot
2. Bot receives webhook at `/api/telegram/webhook`
3. Bot calls `/api/tiktok/telegram` to process the URL
4. Bot sends the video back to the user

## Troubleshooting

### Bot not responding?
- Check that `TELEGRAM_BOT_TOKEN` is set in environment variables
- Verify webhook is set correctly using `getWebhookInfo`
- Check server logs for errors

### Webhook errors?
- Ensure your server uses HTTPS (Telegram requirement)
- Verify the webhook URL is accessible
- Check that `NEXT_PUBLIC_BASE_URL` matches your deployed URL

### Videos not sending?
- Verify the TikTok API endpoint is working: `/api/tiktok/telegram?url=<test_url>`
- Check that video URLs are accessible
- Review server logs for processing errors

## API Endpoints

### Webhook Endpoint
- **URL:** `POST /api/telegram/webhook`
- **Purpose:** Receives updates from Telegram
- **Usage:** Automatically called by Telegram

### Set Webhook
- **URL:** `POST /api/telegram/set-webhook`
- **Body:** `{"url": "https://your-domain.com/api/telegram/webhook"}`
- **Purpose:** Configure Telegram webhook

### TikTok API (Bot-friendly)
- **URL:** `GET /api/tiktok/telegram?url=<tiktok_url>`
- **Response:** JSON with video URL
- **Purpose:** Get video URL for Telegram bot

## Security Notes

⚠️ **Important:** 
- Never commit your bot token to version control
- Use environment variables for sensitive data
- Keep your bot token secure
- The token in this file is already exposed - consider regenerating it if this is a public repository

## Support

If you encounter issues:
1. Check the server logs
2. Verify all environment variables are set
3. Test the TikTok API endpoint directly
4. Check Telegram Bot API status

