import { NextResponse } from "next/server"
import { getTelegramBotToken } from "@/lib/telegram"

export async function GET() {
  try {
    const token = getTelegramBotToken()
    const response = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`)
    const data = await response.json()

    return NextResponse.json({
      success: data.ok,
      webhookInfo: data.result,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to get webhook info" },
      { status: 500 }
    )
  }
}

