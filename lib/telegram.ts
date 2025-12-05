const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8506385037:AAECCbrD9LO5gZ2pTNtEoiU5a8ZWOxOR5Qg"
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

export function getTelegramApiUrl() {
  return TELEGRAM_API_URL
}

export function getTelegramBotToken() {
  return TELEGRAM_BOT_TOKEN
}

export interface TelegramUpdate {
  update_id: number
  message?: {
    message_id: number
    chat: {
      id: number
      type: string
      username?: string
      first_name?: string
    }
    text?: string
    from?: {
      id: number
      is_bot: boolean
      first_name: string
      username?: string
    }
  }
  callback_query?: {
    id: string
    from: {
      id: number
      is_bot: boolean
      first_name: string
      username?: string
    }
    message?: {
      message_id: number
      chat: {
        id: number
        type: string
      }
    }
    data?: string
  }
}

export async function sendMessage(
  chatId: number, 
  text: string, 
  parseMode?: "HTML" | "Markdown",
  replyMarkup?: {
    inline_keyboard?: Array<Array<{ text: string; url?: string; callback_data?: string }>>
  }
) {
  const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      reply_markup: replyMarkup,
    }),
  })
  return response.json()
}

export async function sendVideo(chatId: number, videoUrl: string, caption?: string) {
  const response = await fetch(`${TELEGRAM_API_URL}/sendVideo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      video: videoUrl,
      caption: caption,
      supports_streaming: true,
    }),
  })
  return response.json()
}

export async function sendPhoto(chatId: number, photoUrl: string, caption?: string) {
  const response = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      photo: photoUrl,
      caption: caption,
    }),
  })
  return response.json()
}

export async function sendMediaGroup(chatId: number, media: Array<{ type: string; media: string; caption?: string }>) {
  const response = await fetch(`${TELEGRAM_API_URL}/sendMediaGroup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      media: media,
    }),
  })
  return response.json()
}

export async function setWebhook(url: string) {
  const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url,
    }),
  })
  return response.json()
}

export function extractTikTokUrl(text: string): string | null {
  const tiktokRegex = /(https?:\/\/)?(www\.)?(tiktok\.com|vt\.tiktok\.com|m\.tiktok\.com|vm\.tiktok\.com)\/[^\s]+/i
  const match = text.match(tiktokRegex)
  return match ? match[0] : null
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string, showAlert?: boolean) {
  const response = await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text,
      show_alert: showAlert,
    }),
  })
  return response.json()
}

export async function editMessageText(
  chatId: number,
  messageId: number,
  text: string,
  parseMode?: "HTML" | "Markdown",
  replyMarkup?: {
    inline_keyboard?: Array<Array<{ text: string; url?: string; callback_data?: string }>>
  }
) {
  const response = await fetch(`${TELEGRAM_API_URL}/editMessageText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: parseMode,
      reply_markup: replyMarkup,
    }),
  })
  return response.json()
}

