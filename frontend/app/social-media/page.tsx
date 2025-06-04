"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  TwitterIcon as TikTok,
  Plus,
  Settings,
  DollarSign,
  Users,
  Eye,
  Loader2,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

interface SocialAccount {
  platform: string
  username: string
  connected: boolean
  followers: number
  icon: any
  color: string
}

interface AdCampaign {
  id: string
  platform: string
  budget: number
  duration: number
  status: "active" | "paused" | "completed"
  reach: number
  clicks: number
  conversions: number
}

export default function SocialMediaPage() {
  const [businessData, setBusinessData] = useState<any>(null)
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    { platform: "Facebook", username: "", connected: false, followers: 0, icon: Facebook, color: "text-blue-600" },
    { platform: "Instagram", username: "", connected: false, followers: 0, icon: Instagram, color: "text-pink-600" },
    { platform: "Twitter", username: "", connected: false, followers: 0, icon: Twitter, color: "text-blue-400" },
    { platform: "LinkedIn", username: "", connected: false, followers: 0, icon: Linkedin, color: "text-blue-700" },
    { platform: "YouTube", username: "", connected: false, followers: 0, icon: Youtube, color: "text-red-600" },
    { platform: "TikTok", username: "", connected: false, followers: 0, icon: TikTok, color: "text-black" },
  ])

  const [postContent, setPostContent] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [adSpend, setAdSpend] = useState({
    enabled: false,
    budget: 50,
    duration: 7,
    objective: "awareness",
    targeting: "automatic",
  })
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([])
  const [loading, setLoading] = useState({
    connecting: "",
    posting: false,
    generating: false,
  })

  useEffect(() => {
    const stored = localStorage.getItem("businessData")
    if (stored) {
      setBusinessData(JSON.parse(stored))
    }

    // Load saved social accounts
    const savedAccounts = localStorage.getItem("socialAccounts")
    if (savedAccounts) {
      setSocialAccounts(JSON.parse(savedAccounts))
    }

    // Load saved campaigns
    const savedCampaigns = localStorage.getItem("adCampaigns")
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns))
    }
  }, [])

  const connectAccount = async (platform: string) => {
    setLoading((prev) => ({ ...prev, connecting: platform }))

    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const updatedAccounts = socialAccounts.map((account) => {
      if (account.platform === platform) {
        return {
          ...account,
          connected: true,
          username: `@${businessData?.businessName?.toLowerCase().replace(/\s+/g, "") || "business"}`,
          followers: Math.floor(Math.random() * 10000) + 500,
        }
      }
      return account
    })

    setSocialAccounts(updatedAccounts)
    localStorage.setItem("socialAccounts", JSON.stringify(updatedAccounts))
    setLoading((prev) => ({ ...prev, connecting: "" }))
  }

  const disconnectAccount = (platform: string) => {
    const updatedAccounts = socialAccounts.map((account) => {
      if (account.platform === platform) {
        return { ...account, connected: false, username: "", followers: 0 }
      }
      return account
    })

    setSocialAccounts(updatedAccounts)
    localStorage.setItem("socialAccounts", JSON.stringify(updatedAccounts))
  }

  const generatePost = async () => {
    setLoading((prev) => ({ ...prev, generating: true }))

    try {
      const response = await fetch("/api/social-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessData }),
      })
      const data = await response.json()
      setPostContent(data.post)
    } catch (error) {
      console.error("Error generating post:", error)
    } finally {
      setLoading((prev) => ({ ...prev, generating: false }))
    }
  }

  const publishPost = async () => {
    if (!postContent.trim() || selectedPlatforms.length === 0) return

    setLoading((prev) => ({ ...prev, posting: true }))

    try {
      const response = await fetch("/api/social-publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postContent,
          platforms: selectedPlatforms,
          adSpend: adSpend.enabled ? adSpend : null,
          businessData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add new campaigns if ad spend is enabled
        if (adSpend.enabled && data.campaigns) {
          const newCampaigns = [...campaigns, ...data.campaigns]
          setCampaigns(newCampaigns)
          localStorage.setItem("adCampaigns", JSON.stringify(newCampaigns))
        }

        alert("Post published successfully!")
        setPostContent("")
        setSelectedPlatforms([])
      }
    } catch (error) {
      console.error("Error publishing post:", error)
      alert("Error publishing post. Please try again.")
    } finally {
      setLoading((prev) => ({ ...prev, posting: false }))
    }
  }

  const connectedAccounts = socialAccounts.filter((account) => account.connected)
  const totalFollowers = connectedAccounts.reduce((sum, account) => sum + account.followers, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center space-x-4">
            <Logo size="md" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Social Media Manager</h1>
              <p className="text-gray-600">Connect accounts, create content, and manage ad campaigns with MarketMAte</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Connected Accounts</p>
                  <p className="text-2xl font-bold">{connectedAccounts.length}</p>
                </div>
                <Settings className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Followers</p>
                  <p className="text-2xl font-bold">{totalFollowers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Campaigns</p>
                  <p className="text-2xl font-bold">{campaigns.filter((c) => c.status === "active").length}</p>
                </div>
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Reach</p>
                  <p className="text-2xl font-bold">
                    {campaigns.reduce((sum, c) => sum + c.reach, 0).toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="accounts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accounts">Account Management</TabsTrigger>
            <TabsTrigger value="publish">Create & Publish</TabsTrigger>
            <TabsTrigger value="campaigns">Ad Campaigns</TabsTrigger>
          </TabsList>

          {/* Account Management Tab */}
          <TabsContent value="accounts">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialAccounts.map((account) => {
                const IconComponent = account.icon
                return (
                  <Card key={account.platform}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className={`h-6 w-6 ${account.color}`} />
                          <CardTitle className="text-lg">{account.platform}</CardTitle>
                        </div>
                        {account.connected ? (
                          <Badge variant="default">Connected</Badge>
                        ) : (
                          <Badge variant="outline">Not Connected</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {account.connected ? (
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Username</p>
                            <p className="font-medium">{account.username}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Followers</p>
                            <p className="font-medium">{account.followers.toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => disconnectAccount(account.platform)}
                              className="flex-1"
                            >
                              Disconnect
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">
                            Connect your {account.platform} account to start posting
                          </p>
                          <Button
                            onClick={() => connectAccount(account.platform)}
                            disabled={loading.connecting === account.platform}
                            className="w-full"
                          >
                            {loading.connecting === account.platform ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Connect {account.platform}
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Create & Publish Tab */}
          <TabsContent value="publish">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Content Creation */}
              <Card>
                <CardHeader>
                  <CardTitle>Create Content</CardTitle>
                  <CardDescription>Write or generate AI-powered social media posts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="postContent">Post Content</Label>
                    <Textarea
                      id="postContent"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Write your post content here..."
                      rows={6}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{postContent.length} characters</span>
                      <Button variant="outline" size="sm" onClick={generatePost} disabled={loading.generating}>
                        {loading.generating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          "Generate AI Post"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Platform Selection */}
                  <div className="space-y-2">
                    <Label>Select Platforms</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {connectedAccounts.map((account) => {
                        const IconComponent = account.icon
                        const isSelected = selectedPlatforms.includes(account.platform)
                        return (
                          <Button
                            key={account.platform}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedPlatforms(selectedPlatforms.filter((p) => p !== account.platform))
                              } else {
                                setSelectedPlatforms([...selectedPlatforms, account.platform])
                              }
                            }}
                            className="justify-start"
                          >
                            <IconComponent className={`h-4 w-4 mr-2 ${account.color}`} />
                            {account.platform}
                          </Button>
                        )
                      })}
                    </div>
                    {connectedAccounts.length === 0 && (
                      <p className="text-sm text-gray-500">Connect social media accounts to start posting</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Ad Spend Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Ad Campaign Settings</CardTitle>
                  <CardDescription>Boost your posts with paid advertising</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="adSpendEnabled">Enable Ad Spend</Label>
                    <Switch
                      id="adSpendEnabled"
                      checked={adSpend.enabled}
                      onCheckedChange={(checked) => setAdSpend((prev) => ({ ...prev, enabled: checked }))}
                    />
                  </div>

                  {adSpend.enabled && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label>Daily Budget: ${adSpend.budget}</Label>
                        <Slider
                          value={[adSpend.budget]}
                          onValueChange={(value) => setAdSpend((prev) => ({ ...prev, budget: value[0] }))}
                          max={500}
                          min={10}
                          step={10}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>$10</span>
                          <span>$500</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Campaign Duration: {adSpend.duration} days</Label>
                        <Slider
                          value={[adSpend.duration]}
                          onValueChange={(value) => setAdSpend((prev) => ({ ...prev, duration: value[0] }))}
                          max={30}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="objective">Campaign Objective</Label>
                        <Select
                          value={adSpend.objective}
                          onValueChange={(value) => setAdSpend((prev) => ({ ...prev, objective: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="awareness">Brand Awareness</SelectItem>
                            <SelectItem value="traffic">Website Traffic</SelectItem>
                            <SelectItem value="engagement">Engagement</SelectItem>
                            <SelectItem value="leads">Lead Generation</SelectItem>
                            <SelectItem value="conversions">Conversions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Estimated Results</p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-blue-700">
                          <div>Reach: {(adSpend.budget * adSpend.duration * 50).toLocaleString()}</div>
                          <div>Clicks: {(adSpend.budget * adSpend.duration * 2).toLocaleString()}</div>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">Total budget: ${adSpend.budget * adSpend.duration}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={publishPost}
                    disabled={loading.posting || !postContent.trim() || selectedPlatforms.length === 0}
                    className="w-full"
                  >
                    {loading.posting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        Publish to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? "s" : ""}
                        {adSpend.enabled && " + Ads"}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ad Campaigns Tab */}
          <TabsContent value="campaigns">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Active Ad Campaigns</h3>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>

              {campaigns.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                    <p className="text-gray-600 mb-4">Create your first ad campaign to boost your social media reach</p>
                    <Button>Create Your First Campaign</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                              {socialAccounts.find((acc) => acc.platform === campaign.platform)?.icon && (
                                <div className="h-6 w-6">
                                  {React.createElement(
                                    socialAccounts.find((acc) => acc.platform === campaign.platform)!.icon,
                                    {
                                      className: `h-6 w-6 ${
                                        socialAccounts.find((acc) => acc.platform === campaign.platform)?.color
                                      }`,
                                    },
                                  )}
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">{campaign.platform} Campaign</h4>
                              <p className="text-sm text-gray-600">Daily budget: ${campaign.budget}</p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              campaign.status === "active"
                                ? "default"
                                : campaign.status === "paused"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-indigo-600">{campaign.reach.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Reach</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{campaign.clicks.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Clicks</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{campaign.conversions}</p>
                            <p className="text-sm text-gray-600">Conversions</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            {campaign.status === "active" ? "Pause" : "Resume"}
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
