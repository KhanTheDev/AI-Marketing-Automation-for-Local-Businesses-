"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, Mail, Share2, Bot, Building2, Loader2, User } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

interface BusinessData {
  businessName: string
  industry: string
  location: string
  website: string
  services: string
  audience: string
  brandStyle: string
}

export default function DashboardPage() {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)
  const [leadScore, setLeadScore] = useState<any>(null)
  const [campaign, setCampaign] = useState<any>(null)
  const [socialPost, setSocialPost] = useState<string>("")
  const [chatMessage, setChatMessage] = useState("")
  const [chatResponse, setChatResponse] = useState("")
  const [loading, setLoading] = useState({
    leadScore: false,
    campaign: false,
    socialPost: false,
    chatbot: false,
  })

  useEffect(() => {
    // Load business data from localStorage
    const stored = localStorage.getItem("businessData")
    if (stored) {
      setBusinessData(JSON.parse(stored))
    }
  }, [])

  const handleLeadScore = async () => {
    setLoading((prev) => ({ ...prev, leadScore: true }))
    try {
      const response = await fetch("/api/lead-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessData }),
      })
      const data = await response.json()
      setLeadScore(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading((prev) => ({ ...prev, leadScore: false }))
    }
  }

  const handleGenerateCampaign = async () => {
    setLoading((prev) => ({ ...prev, campaign: true }))
    try {
      const response = await fetch("/api/send-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessData }),
      })
      const data = await response.json()
      setCampaign(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading((prev) => ({ ...prev, campaign: false }))
    }
  }

  const handleGenerateSocialPost = async () => {
    setLoading((prev) => ({ ...prev, socialPost: true }))
    try {
      const response = await fetch("/api/social-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessData }),
      })
      const data = await response.json()
      setSocialPost(data.post)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading((prev) => ({ ...prev, socialPost: false }))
    }
  }

  const handleChatbot = async () => {
    if (!chatMessage.trim()) return

    setLoading((prev) => ({ ...prev, chatbot: true }))
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatMessage, businessData }),
      })
      const data = await response.json()
      setChatResponse(data.response)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading((prev) => ({ ...prev, chatbot: false }))
    }
  }

  if (!businessData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Logo size="md" className="justify-center mb-4" />
            <CardTitle>Welcome to MarketMAte</CardTitle>
            <CardDescription>Please complete your business setup to access your AI marketing dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/business-intake">Complete Setup</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Logo size="md" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketing Dashboard</h1>
              <p className="text-gray-600 flex items-center mt-1">
                <Building2 className="h-4 w-4 mr-2" />
                {businessData.businessName} • {businessData.industry}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/account">
                <User className="h-4 w-4 mr-2" />
                Account
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Home</Link>
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Lead Scoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                AI Lead Scoring
              </CardTitle>
              <CardDescription>Get AI-powered lead qualification and scoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleLeadScore} disabled={loading.leadScore} className="w-full">
                {loading.leadScore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Generate Lead Score"
                )}
              </Button>

              {leadScore && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Lead Quality Score</span>
                    <Badge
                      variant={leadScore.score >= 80 ? "default" : leadScore.score >= 60 ? "secondary" : "outline"}
                    >
                      {leadScore.score}/100
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{leadScore.analysis}</p>
                  <div className="mt-3">
                    <p className="text-sm font-medium">Recommendations:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                      {leadScore.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campaign Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-indigo-600" />
                Smart Campaigns
              </CardTitle>
              <CardDescription>Generate automated email and SMS campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleGenerateCampaign} disabled={loading.campaign} className="w-full">
                {loading.campaign ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Campaign...
                  </>
                ) : (
                  "Generate Campaign"
                )}
              </Button>

              {campaign && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{campaign.subject}</h4>
                  <p className="text-sm text-gray-600 mb-3">{campaign.preview}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">Email</Badge>
                    <Badge variant="outline">SMS</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Estimated reach: {campaign.estimatedReach} contacts</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Post Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Share2 className="h-5 w-5 mr-2 text-indigo-600" />
                Social Content Generator
              </CardTitle>
              <CardDescription>Create engaging social media posts for your brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleGenerateSocialPost} disabled={loading.socialPost} className="w-full">
                {loading.socialPost ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Post...
                  </>
                ) : (
                  "Generate Social Post"
                )}
              </Button>

              {socialPost && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{socialPost}</p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="outline">LinkedIn</Badge>
                    <Badge variant="outline">Twitter</Badge>
                    <Badge variant="outline">Facebook</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Chatbot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-indigo-600" />
                AI Marketing Assistant
              </CardTitle>
              <CardDescription>Chat with your MarketMAte about business and marketing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chatMessage">Ask your MarketMAte anything:</Label>
                <Input
                  id="chatMessage"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="How can I improve my marketing strategy?"
                  onKeyPress={(e) => e.key === "Enter" && handleChatbot()}
                />
              </div>

              <Button onClick={handleChatbot} disabled={loading.chatbot || !chatMessage.trim()} className="w-full">
                {loading.chatbot ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  "Ask MarketMAte"
                )}
              </Button>

              {chatResponse && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{chatResponse}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Media Manager */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Share2 className="h-5 w-5 mr-2 text-indigo-600" />
                Social Media Manager
              </CardTitle>
              <CardDescription>Connect accounts and publish across all platforms with ad campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/social-media">Manage Social Media</Link>
              </Button>

              <div className="text-sm text-gray-600">
                <p>• Connect Facebook, Instagram, Twitter, LinkedIn</p>
                <p>• One-click multi-platform posting</p>
                <p>• Automated ad campaign management</p>
                <p>• Real-time analytics and insights</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
