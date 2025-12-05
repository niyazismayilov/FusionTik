import { NextResponse } from "next/server"
import { setWebhook } from "@/lib/telegram"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please provide a webhook URL in the request body: { \"url\": \"https://your-domain.com/api/telegram/webhook\" }" },
        { status: 400 }
      )
    }

    const result = await setWebhook(url)

    return NextResponse.json({
      success: result.ok,
      message: result.ok 
        ? `Webhook set successfully to: ${url}`
        : result.description || "Failed to set webhook",
      result: result,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to set webhook" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json(
      { error: "Please provide a webhook URL as query parameter: ?url=https://your-domain.com/api/telegram/webhook" },
      { status: 400 }
    )
  }

  try {
    const result = await setWebhook(url)

    return NextResponse.json({
      success: result.ok,
      message: result.ok 
        ? `Webhook set successfully to: ${url}`
        : result.description || "Failed to set webhook",
      result: result,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to set webhook" },
      { status: 500 }
    )
  }
}

