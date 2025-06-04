"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

interface VideoAd {
  id: string
  title: string
  prompt: string
  platform: string
  duration: string
  status: "draft" | "processing" | "ready" | "published"
  createdAt: string
  thumbnailUrl: string
  videoUrl?: string
}

export default function VideoAdsPage() {
  const [businessData, setBusinessData] = useState<any>(null)
  const [videoAds, setVideoAds] = useState<VideoAd[]>([])
  const [loading, setLoading] = useState({
    generating: false,
    loading: true,
  })
  const [formData, setFormData] = useState({
    title: "",
    prompt: "",
    platform: "facebook",
    duration: "30",
    style: "modern",
  })

  useEffect(() => {
    const stored = localStorage.getItem("businessData")
    if (stored) {
      setBusinessData(JSON.parse(stored))
    }
    
    // Load sample video ads
    const sampleAds: VideoAd[] = [
      {
        id: "video_1",
        title: "Product Showcase",
        prompt: "Show our main product features with customer testimonials",
        platform: "facebook",
        duration: "30",
        status: "ready",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        thumbnailUrl: "/placeholder.svg?height=720&width=1280",
        videoUrl: "#",
      },
      {
        id: "video_2",
        title: "Brand Story",
        prompt: "Tell our company's origin story and mission",
        platform: "youtube",
        duration: "60",
        status: "published",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        thumbnailUrl: "/placeholder.svg?height=720&width=1280",
        videoUrl: "#",
      },
      {
        id: "video_3",
        title: "Summer Promotion",
        prompt: "Announce our summer sale with special discounts",
        platform: "instagram",
        duration: "15",
        status: "processing",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      },
    ]
    
    setVideoAds(sampleAds)
    setLoading({ ...loading, loading: false })
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading({ ...loading, generating: true })
    
    try {
      const response = await fetch("/api/nvidia-llama/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          businessData,
        }),
      })
      
      const data = await response.json()
      
      if (data.videoId) {
        // Add the new video to the list
        const newVideoAd: VideoAd = {
          id: data.videoId,
          title: formData.title,
          prompt: formData.prompt,
          platform: formData.platform,
          duration: formData.duration,
          status: "processing",
          createdAt: new Date().toISOString(),
          thumbnailUrl: data.thumbnailUrl || "/placeholder.svg?height=720&width=1280",
        }
        
        setVideoAds([newVideoAd, ...videoAds])
        
        // Reset form
        setFormData({
          title: "",
          prompt: "",
          platform: "facebook",
          duration: "30",
          style: "modern",
        })
        
        // Simulate video processing completion after 5 seconds
        setTimeout(() => {
          setVideoAds(prev => 
            prev.map(ad => 
              ad.id === data.videoId 
                ? { ...ad, status: "ready", videoUrl: "#" } 
                : ad
            )
          )
        }, 5000)
      }
    } catch (error) {
      console.error("Error generating video:", error)
    } finally {
      setLoading({ ...loading, generating: false })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "processing":
        return <Badge className="bg-yellow-600">Processing</Badge>
      case "ready":
        return <Badge className="bg-green-600">Ready</Badge>
      case "published":
        return <Badge className="bg-blue-600">Published</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/social-media">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Social Media
            </Link>
          </Button>
          <div className="flex items-center space-x-4">
            <Logo size="md" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Video Ads</h1>
              <p className="text-gray-600">Create engaging video ads with NVIDIA Llama AI</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <Tab\
