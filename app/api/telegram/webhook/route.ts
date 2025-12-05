import { NextResponse } from "next/server"
import { 
  sendMessage, 
  sendVideo, 
  sendPhoto, 
  sendMediaGroup, 
  extractTikTokUrl, 
  getTelegramBotToken, 
  answerCallbackQuery,
  type TelegramUpdate 
} from "@/lib/telegram"

const BOT_USERNAME = "tik_save_videosbot"
const CHANNEL_USERNAME = process.env.TELEGRAM_CHANNEL_USERNAME || "tik_save_videosbot"

export async function POST(req: Request) {
  try {
    const update: TelegramUpdate = await req.json()

    // Handle callback queries (button clicks)
    if (update.callback_query) {
      const callbackQuery = update.callback_query
      const chatId = callbackQuery.from.id
      const callbackData = callbackQuery.data
      const messageId = callbackQuery.message?.message_id

      // Answer the callback query
      await answerCallbackQuery(callbackQuery.id)

      if (callbackData === "share") {
        await sendMessage(
          chatId,
          `🔁 Share this bot with your friends!\n\n` +
          `https://t.me/${BOT_USERNAME}?start=ref_${chatId}\n\n` +
          `Thank you for sharing! 🙏`
        )
        return NextResponse.json({ ok: true })
      }

      if (callbackData === "rate") {
        await sendMessage(
          chatId,
          `⭐ Rate our bot!\n\n` +
          `Your feedback helps us improve. Thank you! 🙏\n\n` +
          `https://t.me/${BOT_USERNAME}`
        )
        return NextResponse.json({ ok: true })
      }

      if (callbackData === "join_channel") {
        await sendMessage(
          chatId,
          `📢 Join our channel for updates and more content!\n\n` +
          `https://t.me/${CHANNEL_USERNAME}`
        )
        return NextResponse.json({ ok: true })
      }

      return NextResponse.json({ ok: true })
    }

    // Handle messages
    if (!update.message || !update.message.text) {
      return NextResponse.json({ ok: true })
    }

    const chatId = update.message.chat.id
    const messageText = update.message.text.trim()

    // Handle /start command
    if (messageText === "/start" || messageText.startsWith("/start@")) {
      const welcomeMessage = 
        "👋 Welcome to TikTok Downloader Bot\n\n" +
        "✅ No watermark\n" +
        "✅ HD quality\n" +
        "✅ 100% Free\n\n" +
        "Just send me the TikTok link and I'll download it for you."

      const inlineKeyboard = {
        inline_keyboard: [
          [
            { text: "🔁 Share with Friends", callback_data: "share" },
            { text: "⭐ Rate Bot", callback_data: "rate" }
          ],
          [
            { text: "📢 Join Channel", url: `https://t.me/${CHANNEL_USERNAME}` }
          ]
        ]
      }

      await sendMessage(chatId, welcomeMessage, undefined, inlineKeyboard)
      return NextResponse.json({ ok: true })
    }

    // Handle /help command
    if (messageText === "/help" || messageText.startsWith("/help@")) {
      await sendMessage(
        chatId,
        "📖 How to use:\n\n" +
        "1. Copy a TikTok video URL\n" +
        "2. Send it to this bot\n" +
        "3. Wait for the video to be processed\n" +
        "4. Receive the downloaded video\n\n" +
        "Supported formats:\n" +
        "• TikTok video URLs\n" +
        "• TikTok image posts\n\n" +
        "Commands:\n" +
        "/start - Start the bot\n" +
        "/help - Show this help message"
      )
      return NextResponse.json({ ok: true })
    }

    // Extract TikTok URL from message
    const tiktokUrl = extractTikTokUrl(messageText)

    if (!tiktokUrl) {
      await sendMessage(
        chatId,
        "❌ Invalid TikTok link.\n\nSend a valid TikTok video URL."
      )
      return NextResponse.json({ ok: true })
    }

    // Send processing message
    const processingMessage = await sendMessage(chatId, "⏳ Downloading your video, please wait...")

    try {
      // Call the TikTok API endpoint
      let baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      if (!baseUrl) {
        if (process.env.VERCEL_URL) {
          baseUrl = `https://${process.env.VERCEL_URL}`
        } else {
          baseUrl = "http://localhost:3000"
        }
      }
      
      const apiUrl = `${baseUrl}/api/tiktok/telegram?url=${encodeURIComponent(tiktokUrl)}`
      const response = await fetch(apiUrl)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to process TikTok URL")
      }

      // Delete processing message
      try {
        await fetch(`https://api.telegram.org/bot${getTelegramBotToken()}/deleteMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: processingMessage.result?.message_id,
          }),
        })
      } catch (e) {
        // Ignore errors when deleting message
      }

      // Handle video response
      if (data.type === "video" && data.video) {
        // Create caption with download completed message
        const caption = 
          "✅ Download Completed\n" +
          `🔁 Share: t.me/${BOT_USERNAME}` +
          (data.description ? `\n\n${data.description}` : "") +
          (data.creator ? `\n\n👤 @${data.creator}` : "")

        await sendVideo(chatId, data.video, caption)

        // Send viral growth message after video
        const viralMessage = 
          "🎉 Video ready!\n\n" +
          "Want unlimited downloads?\n\n" +
          "✅ Invite 3 friends\n" +
          "✅ Leave a ⭐⭐⭐⭐⭐ review"

        await sendMessage(chatId, viralMessage)
        return NextResponse.json({ ok: true })
      }

      // Handle image response
      if (data.type === "image" && data.images && data.images.length > 0) {
        if (data.images.length === 1) {
          // Single image
          const caption = 
            "✅ Download Completed\n" +
            `🔁 Share: t.me/${BOT_USERNAME}` +
            (data.description ? `\n\n${data.description}` : "") +
            (data.creator ? `\n\n👤 @${data.creator}` : "")
          
          await sendPhoto(chatId, data.images[0], caption)
        } else {
          // Multiple images - send as media group
          const media = data.images.map((url: string, index: number) => ({
            type: "photo",
            media: url,
            caption: index === 0 
              ? ("✅ Download Completed\n" +
                 `🔁 Share: t.me/${BOT_USERNAME}` +
                 (data.description ? `\n\n${data.description}` : "") +
                 (data.creator ? `\n\n👤 @${data.creator}` : ""))
              : undefined,
          }))
          
          await sendMediaGroup(chatId, media)
        }

        // Send viral growth message after images
        const viralMessage = 
          "🎉 Video ready!\n\n" +
          "Want unlimited downloads?\n\n" +
          "✅ Invite 3 friends\n" +
          "✅ Leave a ⭐⭐⭐⭐⭐ review"

        await sendMessage(chatId, viralMessage)
        return NextResponse.json({ ok: true })
      }

      // Unknown response type
      await sendMessage(chatId, "⚠️ Could not download video.\n\nPlease try again later.")
      return NextResponse.json({ ok: true })

    } catch (error: any) {
      // Delete processing message
      try {
        await fetch(`https://api.telegram.org/bot${getTelegramBotToken()}/deleteMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: processingMessage.result?.message_id,
          }),
        })
      } catch (e) {
        // Ignore errors
      }

      // Check if it's an invalid link error
      const errorMessage = error?.message || "An error occurred while processing your request"
      
      if (errorMessage.toLowerCase().includes("invalid") || errorMessage.toLowerCase().includes("url")) {
        await sendMessage(
          chatId,
          "❌ Invalid TikTok link.\n\nSend a valid TikTok video URL."
        )
      } else {
        await sendMessage(
          chatId,
          "⚠️ Could not download video.\n\nPlease try again later."
        )
      }
      
      return NextResponse.json({ ok: true })
    }
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

// GET endpoint for webhook verification (optional)
export async function GET(req: Request) {
  return NextResponse.json({ 
    message: "Telegram webhook endpoint is active",
    timestamp: new Date().toISOString()
  })
}
