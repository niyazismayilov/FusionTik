"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/components/ui/use-toast"

interface WebhookInfo {
  url: string
  has_custom_certificate: boolean
  pending_update_count: number
  last_error_date?: number
  last_error_message?: string
  max_connections?: number
  ip_address?: string
}

export default function WebhookManagementPage() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [webhookInfo, setWebhookInfo] = useState<WebhookInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingInfo, setIsLoadingInfo] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { toast } = useToast()

  // Get current base URL
  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin
    }
    return ""
  }

  // Normalize URL to prevent double slashes
  const normalizeUrl = (url: string) => {
    return url.replace(/([^:]\/)\/+/g, "$1")
  }

  // Load webhook info on mount
  useEffect(() => {
    loadWebhookInfo()
  }, [])

  const loadWebhookInfo = async () => {
    setIsLoadingInfo(true)
    try {
      const response = await fetch("/api/telegram/webhook-info")
      const data = await response.json()

      if (data.success && data.webhookInfo) {
        setWebhookInfo(data.webhookInfo)
        if (data.webhookInfo.url) {
          setWebhookUrl(data.webhookInfo.url)
        } else {
          // Set default webhook URL
          setWebhookUrl(normalizeUrl(`${getBaseUrl()}/api/telegram/webhook`))
        }
      } else {
        // Set default if no webhook is set
        setWebhookUrl(normalizeUrl(`${getBaseUrl()}/api/telegram/webhook`))
      }
    } catch (err: any) {
      console.error("Error loading webhook info:", err)
      setWebhookUrl(normalizeUrl(`${getBaseUrl()}/api/telegram/webhook`))
    } finally {
      setIsLoadingInfo(false)
    }
  }

  const handleSetWebhook = async () => {
    if (!webhookUrl) {
      setError("Please enter a webhook URL")
      return
    }

    // Normalize URL before sending
    const normalizedUrl = normalizeUrl(webhookUrl.trim())
    setWebhookUrl(normalizedUrl)

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/telegram/set-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: normalizedUrl }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        toast({
          title: "Webhook Set Successfully",
          description: data.message,
        })
        // Reload webhook info
        await loadWebhookInfo()
      } else {
        setError(data.message || "Failed to set webhook")
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to set webhook",
        })
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to set webhook"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
    toast({
      title: "Copied!",
      description: "Webhook URL copied to clipboard",
    })
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Never"
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Telegram Bot Webhook Management</h1>
          <p className="text-muted-foreground">
            Configure and manage your Telegram bot webhook settings
          </p>
        </div>

        {/* Webhook Configuration Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Webhook Configuration</CardTitle>
            <CardDescription>
              Set the webhook URL where Telegram will send bot updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="webhook-url" className="text-sm font-medium">
                Webhook URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-domain.com/api/telegram/webhook"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUrl}
                  title="Copy URL"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Make sure your server uses HTTPS (required by Telegram)
              </p>
            </div>

            <Button
              onClick={handleSetWebhook}
              disabled={isLoading || !webhookUrl}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Webhook...
                </>
              ) : (
                "Set Webhook"
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Webhook Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Webhook Status</CardTitle>
            <CardDescription>
              Current webhook configuration and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingInfo ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading webhook info...</span>
              </div>
            ) : webhookInfo ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      {webhookInfo.url ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Set
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Pending Updates
                    </label>
                    <div className="mt-1">
                      <Badge variant={webhookInfo.pending_update_count > 0 ? "destructive" : "secondary"}>
                        {webhookInfo.pending_update_count}
                      </Badge>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Webhook URL</label>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-muted rounded-md text-sm break-all">
                        {webhookInfo.url || "Not configured"}
                      </code>
                      {webhookInfo.url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(webhookInfo.url, "_blank")}
                          title="Open URL"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {webhookInfo.ip_address && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                      <div className="mt-1">
                        <code className="px-3 py-2 bg-muted rounded-md text-sm">
                          {webhookInfo.ip_address}
                        </code>
                      </div>
                    </div>
                  )}

                  {webhookInfo.max_connections && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Max Connections
                      </label>
                      <div className="mt-1">
                        <code className="px-3 py-2 bg-muted rounded-md text-sm">
                          {webhookInfo.max_connections}
                        </code>
                      </div>
                    </div>
                  )}

                  {webhookInfo.last_error_date && (
                    <div className="md:col-span-2">
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Last Error</AlertTitle>
                        <AlertDescription>
                          <div className="mt-2 space-y-1">
                            <p>
                              <strong>Date:</strong> {formatDate(webhookInfo.last_error_date)}
                            </p>
                            {webhookInfo.last_error_message && (
                              <p>
                                <strong>Message:</strong> {webhookInfo.last_error_message}
                              </p>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={loadWebhookInfo}
                    className="w-full"
                  >
                    <Loader2 className="mr-2 h-4 w-4" />
                    Refresh Status
                  </Button>
                </div>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Webhook Info</AlertTitle>
                <AlertDescription>
                  Unable to load webhook information. Make sure your bot token is configured correctly.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common webhook management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setWebhookUrl(normalizeUrl(`${getBaseUrl()}/api/telegram/webhook`))
                toast({
                  title: "URL Updated",
                  description: "Webhook URL set to default",
                })
              }}
            >
              Use Default URL
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={loadWebhookInfo}
            >
              Refresh Webhook Info
            </Button>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Webhooks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              A webhook is a way for Telegram to send updates to your bot automatically.
              When users interact with your bot, Telegram sends the updates to your webhook URL.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Your server must use HTTPS (required by Telegram)</li>
              <li>The webhook URL must be publicly accessible</li>
              <li>Updates are sent as POST requests to your webhook endpoint</li>
              <li>You can check webhook status anytime using the status card above</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

